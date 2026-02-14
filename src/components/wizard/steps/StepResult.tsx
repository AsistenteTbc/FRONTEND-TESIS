import React, { useEffect, useState, useRef } from "react";
import type { StepComponentProps, ILaboratory } from "../../../types/wizard";
import { locationsService } from "../../../services/locations.service";
import { statsService } from "../../../services/stats.service";
import { Button } from "../../ui/Button";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { LabMap } from "../../maps/LabMap";

// Función auxiliar para normalizar texto (quitar acentos y minúsculas)
// Esto evita errores si en la DB dice "SÍ" y comparamos con "si"
const normalize = (text: string) => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
};

const StepResult: React.FC<StepComponentProps> = ({
  stepData,
  onNext,
  context,
}) => {
  // 1. ESTILOS VISUALES
  const getStyles = (variant: number = 1) => {
    switch (variant) {
      case 2:
        return {
          icon: "✅",
          bgIcon: "bg-green-900/30 border-green-500/50 text-green-500",
          title: "text-green-400",
          box: "bg-green-900/20 border-green-600/50",
        };
      case 3:
        return {
          icon: "⚠️",
          bgIcon: "bg-yellow-900/30 border-yellow-500/50 text-yellow-500",
          title: "text-yellow-400",
          box: "bg-yellow-900/20 border-yellow-600/50",
        };
      case 4:
        return {
          icon: "🚨",
          bgIcon: "bg-red-900/30 border-red-500/50 text-red-500",
          title: "text-red-400",
          box: "bg-red-900/20 border-red-600/50",
        };
      default:
        return {
          icon: "ℹ️",
          bgIcon: "bg-blue-900/30 border-blue-500/50 text-blue-500",
          title: "text-blue-400",
          box: "bg-gray-800 border-gray-700",
        };
    }
  };
  const styles = getStyles(stepData.variant);

  // 2. CONTENIDO MÉDICO
  const [displayContent, setDisplayContent] = useState<{
    medical: string;
    logistics: string;
  }>({ medical: "", logistics: "" });

  useEffect(() => {
    try {
      const parsed = JSON.parse(stepData.content || "");
      if (parsed.medical && parsed.logistics) {
        const provinceId = context.selectedProvinceId;
        const logisticsText = parsed.logistics[provinceId?.toString() || "1"];
        setDisplayContent({
          medical: parsed.medical,
          logistics:
            logisticsText || "Consulte a la autoridad sanitaria local.",
        });
      } else {
        setDisplayContent({ medical: stepData.content || "", logistics: "" });
      }
    } catch (e) {
      setDisplayContent({ medical: stepData.content || "", logistics: "" });
    }
  }, [stepData, context.selectedProvinceId]);

  // 3. LABORATORIO
  const shouldShowLab = !!context.selectedCityId;
  const [lab, setLab] = useState<ILaboratory | null>(null);
  const [loadingLab, setLoadingLab] = useState(false);

  useEffect(() => {
    if (shouldShowLab && context.selectedCityId) {
      const fetchLab = async () => {
        setLoadingLab(true);
        try {
          const data = await locationsService.getLaboratory(
            context.selectedCityId!,
          );
          setLab(data);
        } catch (error) {
          console.error(error);
        } finally {
          setLoadingLab(false);
        }
      };
      fetchLab();
    }
  }, [shouldShowLab, context.selectedCityId]);

  // 4. LÓGICA DE ESTADÍSTICAS (ADAPTADA A TU SQL) 📊
  const hasLogged = useRef(false);

  useEffect(() => {
    const logData = async () => {
      if (
        hasLogged.current ||
        !context.selectedProvinceId ||
        !context.selectedCityId
      )
        return;
      hasLogged.current = true;

      try {
        const [provinces, cities] = await Promise.all([
          locationsService.getProvinces(),
          locationsService.getCities(context.selectedProvinceId),
        ]);

        const provinceObj = provinces.find(
          (p) => p.id === context.selectedProvinceId,
        );
        const cityObj = cities.find((c) => c.id === context.selectedCityId);

        // --- EXTRACCIÓN DE DATOS ---
        const rawAnswers = Object.values(context.answers || {});
        // Extraemos solo el texto (label) de cada respuesta y lo normalizamos para buscar
        const userChoicesNormalized = rawAnswers.map((ans: any) => {
          const text = typeof ans === "string" ? ans : ans.label;
          return normalize(text);
        });
        // También guardamos las versiones originales para extraer números (peso)
        const userChoicesOriginal = rawAnswers.map((ans: any) =>
          typeof ans === "string" ? ans : ans.label,
        );

        // A. GRUPO DE RIESGO (Boolean)
        // En tu SQL la opción es: 'SÍ, es Grupo de Riesgo'
        // Buscamos algo que contenga "si" y "grupo de riesgo"
        const isRiskGroup = userChoicesNormalized.some(
          (choice) =>
            choice.includes("grupo de riesgo") && choice.includes("si"),
        );

        // B. TIPO DE DIAGNÓSTICO
        // En tu SQL las opciones son: 'Tuberculosis Pulmonar' y 'Tuberculosis Extrapulmonar'
        let diagnosisType = "Indeterminado";
        if (
          userChoicesNormalized.some((choice) =>
            choice.includes("extrapulmonar"),
          )
        ) {
          diagnosisType = "Extrapulmonar";
        } else if (
          userChoicesNormalized.some((choice) => choice.includes("pulmonar"))
        ) {
          diagnosisType = "Pulmonar";
        } else {
          // Fallback: Si el título del resultado es "Protocolo: EXTRAPULMONAR"
          const titleNorm = normalize(stepData.title);
          if (titleNorm.includes("extrapulmonar"))
            diagnosisType = "Extrapulmonar";
          else if (
            titleNorm.includes("priorizado") ||
            titleNorm.includes("estandar")
          )
            diagnosisType = "Pulmonar";
        }

        // C. PESO (String format)
        // En tu SQL las opciones son: '30 a 34 kg', '55 kg o más', etc.
        const weightChoice = userChoicesOriginal.find((text) =>
          text.toLowerCase().includes("kg"),
        );
        let weightFormatted = "No especificado";

        if (weightChoice) {
          // Caso: "55 kg o más"
          if (weightChoice.includes("o más") || weightChoice.includes(">")) {
            const number = weightChoice.match(/\d+/);
            if (number) weightFormatted = `> ${number[0]} kg`;
          }
          // Caso: "30 a 34 kg"
          else {
            const numbers = weightChoice.match(/\d+/g);
            if (numbers && numbers.length >= 2) {
              weightFormatted = `${numbers[0]}-${numbers[1]} kg`;
            } else if (numbers) {
              weightFormatted = `${numbers[0]} kg`;
            }
          }
        }

        const payload = {
          provinceName: provinceObj ? provinceObj.name : "Desconocida",
          cityName: cityObj ? cityObj.name : "Desconocida",
          resultVariant: stepData.variant, // Viene directo de la DB (2, 3 o 4)

          diagnosisType: diagnosisType, // "Pulmonar" o "Extrapulmonar"
          isRiskGroup: isRiskGroup, // true o false
          patientWeightRange: weightFormatted, // "30-34 kg" o "> 55 kg"
        };

        await statsService.logConsultation(payload);
      } catch (error) {
        console.error("Error registrando estadística:", error);
      }
    };

    logData();
  }, [
    context.selectedProvinceId,
    context.selectedCityId,
    stepData,
    context.answers,
  ]);

  // --- RENDERIZADO (IGUAL) ---
  return (
    <div className="animate-fadeIn text-center pb-6">
      <div className="mb-6 flex justify-center">
        <div className={`rounded-full p-6 border-4 ${styles.bgIcon}`}>
          <span className="text-6xl">{styles.icon}</span>
        </div>
      </div>

      <h2 className={`text-3xl font-bold mb-4 ${styles.title}`}>
        {stepData.title}
      </h2>

      <div
        className={`p-6 rounded-xl border shadow-lg mb-6 text-left whitespace-pre-line ${styles.box}`}
      >
        <p className="text-lg text-gray-200 leading-relaxed font-medium">
          {displayContent.medical}
        </p>
      </div>

      {displayContent.logistics && (
        <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-900/10 mb-8 text-left animate-fadeIn">
          <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
            📋 GESTIÓN ADMINISTRATIVA LOCAL
          </h3>
          <p className="text-gray-300 leading-relaxed whitespace-pre-line">
            {displayContent.logistics}
          </p>
        </div>
      )}

      {shouldShowLab && (
        <div className="mb-8 text-left animate-fadeIn">
          <h3 className="text-lg font-bold text-gray-400 mb-4 flex items-center gap-2">
            <span>📍</span> Centro de Recepción de Muestras:
          </h3>

          {loadingLab ? (
            <div className="flex justify-center p-4">
              <LoadingSpinner />
            </div>
          ) : lab ? (
            <div className="space-y-4">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                  <p className="font-bold text-white text-xl mb-1">
                    {lab.name}
                  </p>
                  <div className="text-gray-400">{lab.address}</div>
                  <div className="text-gray-500 text-sm mt-1">
                    {lab.horario}
                  </div>
                </div>
                {lab.phone && (
                  <a
                    href={`tel:${lab.phone}`}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    📞 Llamar
                  </a>
                )}
              </div>

              {lab.latitude && lab.longitude ? (
                <div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-700 shadow-md">
                  <LabMap labs={[lab]} />
                </div>
              ) : (
                <div className="text-xs text-gray-500 text-center p-3 bg-gray-800 rounded border border-gray-700">
                  Mapa no disponible.
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center border border-gray-700 p-4 rounded-lg bg-gray-800/50">
              No hay un laboratorio asignado.
            </p>
          )}
        </div>
      )}

      <Button onClick={() => onNext()} variant="outline" fullWidth>
        🔄 Nueva consulta
      </Button>
    </div>
  );
};

export default StepResult;
