import React, { useEffect, useState, useRef } from "react";
import type { StepComponentProps, ILaboratory } from "../../../types/wizard";
import { locationsService } from "../../../services/locations.service";
import { statsService } from "../../../services/stats.service";
import { Button } from "../../ui/Button";
import { LoadingSpinner } from "../../ui/LoadingSpinner";
import { LabMap } from "../../maps/LabMap";
import { useWizardContext } from "../../../context/WizardContext";
import { CheckCircle, AlertTriangle, AlertCircle, MapPin, Phone, Stethoscope, Building, RotateCcw } from "lucide-react";

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
  // Notificar al Layout que estamos en resultado
  const { setIsResultStep } = useWizardContext();
  useEffect(() => {
    setIsResultStep(true);
    return () => setIsResultStep(false);
  }, [setIsResultStep]);

  // 1. ESTILOS VISUALES MEJORADOS
  const getStyles = (variant: number = 1) => {
    switch (variant) {
      case 2:
        return {
          icon: CheckCircle,
          gradient: "from-green-600 to-green-700",
          bgLight: "bg-green-500/10",
          border: "border-green-500/30",
          title: "text-green-400",
          accent: "text-green-500",
          badge: "bg-green-500/20 text-green-300",
        };
      case 3:
        return {
          icon: AlertTriangle,
          gradient: "from-yellow-600 to-yellow-700",
          bgLight: "bg-yellow-500/10",
          border: "border-yellow-500/30",
          title: "text-yellow-400",
          accent: "text-yellow-500",
          badge: "bg-yellow-500/20 text-yellow-300",
        };
      case 4:
        return {
          icon: AlertCircle,
          gradient: "from-red-600 to-red-700",
          bgLight: "bg-red-500/10",
          border: "border-red-500/30",
          title: "text-red-400",
          accent: "text-red-500",
          badge: "bg-red-500/20 text-red-300",
        };
      default:
        return {
          icon: AlertCircle,
          gradient: "from-blue-600 to-blue-700",
          bgLight: "bg-blue-500/10",
          border: "border-blue-500/30",
          title: "text-blue-400",
          accent: "text-blue-500",
          badge: "bg-blue-500/20 text-blue-300",
        };
    }
  };
  const styles = getStyles(stepData.variant);
  const IconComponent = styles.icon;

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

  // --- RENDERIZADO MEJORADO ---
  return (
    <div className="animate-fadeIn w-full">
      {/* Hero Section - Protocolo */}
      <div className={`bg-gradient-to-br ${styles.gradient} rounded-3xl p-8 md:p-12 mb-8 overflow-hidden shadow-2xl relative`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className={`${styles.bgLight} p-6 rounded-2xl border ${styles.border} w-fit flex-shrink-0`}>
            <IconComponent className={`w-12 h-12 ${styles.accent}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 break-words">
              {stepData.title}
            </h2>
            <p className="text-white/80 text-base md:text-lg break-words">Protocolo de actuación recomendado</p>
          </div>
        </div>
      </div>

      {/* Contenido Médico */}
      <div className={`${styles.bgLight} border ${styles.border} rounded-2xl p-8 mb-8 backdrop-blur-sm`}>
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className={`w-6 h-6 ${styles.accent} flex-shrink-0`} />
          <h3 className={`text-2xl font-bold ${styles.title}`}>
            Protocolo Médico
          </h3>
        </div>
        <p className="text-gray-200 leading-relaxed text-lg whitespace-pre-line">
          {displayContent.medical}
        </p>
      </div>

      {/* Gestión Administrativa */}
      {displayContent.logistics && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-8 mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-4">
            <Building className="w-6 h-6 text-blue-400 flex-shrink-0" />
            <h3 className="text-2xl font-bold text-blue-400">
              Gestión Administrativa Local
            </h3>
          </div>
          <p className="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
            {displayContent.logistics}
          </p>
        </div>
      )}

      {/* Laboratorio */}
      {shouldShowLab && (
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <MapPin className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold text-gray-100">
              Centro de Recepción de Muestras
            </h3>
          </div>

          {loadingLab ? (
            <div className="flex justify-center p-8">
              <LoadingSpinner />
            </div>
          ) : lab ? (
            <div className="space-y-4">
              {/* Tarjeta del Laboratorio */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:border-blue-500/50 transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold text-white mb-3">
                      {lab.name}
                    </h4>
                    <div className="space-y-2">
                      <p className="text-gray-400 flex items-center gap-2">
                        📍 {lab.address}
                      </p>
                      {lab.horario && (
                        <p className="text-gray-400 flex items-center gap-2">
                          🕐 {lab.horario}
                        </p>
                      )}
                    </div>
                  </div>
                  {lab.phone && (
                    <a
                      href={`tel:${lab.phone}`}
                      className="flex items-center gap-2 bg-blue-950 hover:bg-blue-200 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl w-fit"
                    >
                      <Phone className="w-5 h-5" />
                      Llamar
                    </a>
                  )}
                </div>
              </div>

              {/* Mapa */}
              {lab.latitude && lab.longitude ? (
                <div className="h-96 w-full rounded-2xl overflow-hidden border border-gray-700 shadow-lg">
                  <LabMap labs={[lab as any]} />
                </div>
              ) : (
                <div className="text-center p-6 bg-gray-800/50 border border-gray-700 rounded-2xl text-gray-400">
                  Coordenadas no disponibles
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8 bg-gray-800/50 border border-gray-700 rounded-2xl text-gray-400">
              No hay laboratorio asignado en tu zona
            </div>
          )}
        </div>
      )}

      {/* Botón Nueva Consulta */}
      <div className="mt-12 pt-8 border-t border-gray-700">
        <Button
          onClick={() => onNext()}
          variant="outline"
          fullWidth
          className="py-4 text-lg font-semibold"
        >
          🔄 Realizar Nueva Consulta
        </Button>
      </div>
    </div>
  );
};

export default StepResult;
