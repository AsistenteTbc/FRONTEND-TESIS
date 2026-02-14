import React, { useEffect, useState, useRef } from "react";
import type { StepComponentProps, ILaboratory } from "../../../types/wizard";
import { locationsService } from "../../../services/locations.service";
import { statsService } from "../../../services/stats.service";
import { Button } from "../../ui/Button";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { LabMap } from "../../maps/LabMap";

const StepResult: React.FC<StepComponentProps> = ({
  stepData,
  onNext,
  context,
}) => {
  // 1. ESTILOS VISUALES (Variant)
  const getStyles = (variant: number = 1) => {
    switch (variant) {
      case 2: // Success
        return {
          icon: "✅",
          bgIcon: "bg-green-900/30 border-green-500/50 text-green-500",
          title: "text-green-400",
          box: "bg-green-900/20 border-green-600/50",
        };
      case 3: // Warning
        return {
          icon: "⚠️",
          bgIcon: "bg-yellow-900/30 border-yellow-500/50 text-yellow-500",
          title: "text-yellow-400",
          box: "bg-yellow-900/20 border-yellow-600/50",
        };
      case 4: // Danger
        return {
          icon: "🚨",
          bgIcon: "bg-red-900/30 border-red-500/50 text-red-500",
          title: "text-red-400",
          box: "bg-red-900/20 border-red-600/50",
        };
      default: // Info
        return {
          icon: "ℹ️",
          bgIcon: "bg-blue-900/30 border-blue-500/50 text-blue-500",
          title: "text-blue-400",
          box: "bg-gray-800 border-gray-700",
        };
    }
  };
  const styles = getStyles(stepData.variant);

  // 2. LÓGICA DE FILTRADO DE CONTENIDO (Medical vs Logistics)
  const [displayContent, setDisplayContent] = useState<{
    medical: string;
    logistics: string;
  }>({ medical: "", logistics: "" });

  useEffect(() => {
    try {
      const parsed = JSON.parse(stepData.content || "");
      if (parsed.medical && parsed.logistics) {
        const provinceId = context.selectedProvinceId;
        // Obtenemos la logística específica de la provincia seleccionada
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

  // 3. LÓGICA DE LABORATORIO (Buscar por ciudad seleccionada)
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
          console.error("Error buscando laboratorio:", error);
        } finally {
          setLoadingLab(false);
        }
      };
      fetchLab();
    }
  }, [shouldShowLab, context.selectedCityId]);

  // 4. LÓGICA DE ESTADÍSTICAS REALES 📊
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
        // A. Obtener nombres reales de ubicación
        const [provinces, cities] = await Promise.all([
          locationsService.getProvinces(),
          locationsService.getCities(context.selectedProvinceId),
        ]);

        const provinceObj = provinces.find(
          (p) => p.id === context.selectedProvinceId,
        );
        const cityObj = cities.find((c) => c.id === context.selectedCityId);

        // B. INFERENCIA DE DATOS DESDE LAS RESPUESTAS (context.answers)
        const answersList = Object.values(context.answers || {});

        // Detectar Grupo de Riesgo (Buscamos palabras clave en las respuestas)
        const riskKeywords = [
          "vih",
          "sida",
          "diabetes",
          "cáncer",
          "transplante",
          "inmunosuprimido",
          "contacto estrecho",
        ];
        const isRiskGroup = answersList.some((ans) =>
          riskKeywords.some((keyword) => ans.toLowerCase().includes(keyword)),
        );

        // Detectar Rango de Peso
        const weightAnswer =
          answersList.find(
            (ans) =>
              ans.toLowerCase().includes("kg") ||
              ans.toLowerCase().includes("kilos") ||
              ans.includes(">") ||
              ans.includes("<"),
          ) || "No especificado";

        // C. Armar el payload final
        const payload = {
          provinceName: provinceObj ? provinceObj.name : "Desconocida",
          cityName: cityObj ? cityObj.name : "Desconocida",
          resultVariant: stepData.variant, // 2=Sano, 3=Sospecha, 4=Urgente
          diagnosisType: stepData.title, // "Posible Caso", "Atención Inmediata", etc.
          isRiskGroup: isRiskGroup, // Booleano real calculado
          patientWeightRange: weightAnswer, // String real calculado
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

  // --- RENDERIZADO ---
  return (
    <div className="animate-fadeIn text-center pb-6">
      {/* ÍCONO */}
      <div className="mb-6 flex justify-center">
        <div className={`rounded-full p-6 border-4 ${styles.bgIcon}`}>
          <span className="text-6xl">{styles.icon}</span>
        </div>
      </div>

      {/* TÍTULO */}
      <h2 className={`text-3xl font-bold mb-4 ${styles.title}`}>
        {stepData.title}
      </h2>

      {/* CAJA MÉDICA */}
      <div
        className={`p-6 rounded-xl border shadow-lg mb-6 text-left whitespace-pre-line ${styles.box}`}
      >
        <p className="text-lg text-gray-200 leading-relaxed font-medium">
          {displayContent.medical}
        </p>
      </div>

      {/* CAJA LOGÍSTICA */}
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

      {/* CAJA LABORATORIO Y MAPA */}
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
              {/* Tarjeta de Info */}
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

              {/* MAPA */}
              {lab.latitude && lab.longitude ? (
                <div className="h-[300px] w-full rounded-xl overflow-hidden border border-gray-700 shadow-md">
                  <LabMap labs={[lab]} />
                </div>
              ) : (
                <div className="text-xs text-gray-500 text-center p-3 bg-gray-800 rounded border border-gray-700">
                  Mapa no disponible para este centro (Sin coordenadas).
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center border border-gray-700 p-4 rounded-lg bg-gray-800/50">
              No hay un laboratorio asignado a esta ciudad en el sistema.
            </p>
          )}
        </div>
      )}

      {/* BOTÓN FINAL */}
      <Button onClick={() => onNext()} variant="outline" fullWidth>
        🔄 Nueva consulta
      </Button>
    </div>
  );
};

export default StepResult;
