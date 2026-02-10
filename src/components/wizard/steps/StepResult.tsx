import React, { useEffect, useState, useRef } from "react";
import type { StepComponentProps, ILaboratory } from "../../../types/wizard";
import { locationsService } from "../../../services/locations.service";
import { statsService } from "../../../services/stats.service"; // <--- IMPORTAMOS STATS SERVICE
import { Button } from "../../ui/Button";
import { LoadingSpinner } from "../../ui/LoadingSpinner";

const StepResult: React.FC<StepComponentProps> = ({
  stepData,
  onNext,
  context,
}) => {
  // 1. ESTILOS VISUALES (Variant)
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

  // 2. LÓGICA DE FILTRADO DE CONTENIDO
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

  // 3. LÓGICA DE LABORATORIO (ASSIGNED LAB)
  const shouldShowLab = !!context.selectedCityId;
  const [lab, setLab] = useState<ILaboratory | null>(null);
  const [loadingLab, setLoadingLab] = useState(false);

  useEffect(() => {
    if (shouldShowLab && context.selectedCityId) {
      const fetchLab = async () => {
        setLoadingLab(true);
        try {
          // Usamos el método correcto que definimos antes
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

  // 4. LÓGICA DE ESTADÍSTICAS (¡REFACTORIZADA!) 📊
  const hasLogged = useRef(false);

  useEffect(() => {
    const logData = async () => {
      // Evitamos doble log en React StrictMode
      if (
        hasLogged.current ||
        !context.selectedProvinceId ||
        !context.selectedCityId
      )
        return;
      hasLogged.current = true;

      try {
        // A. OBTENER NOMBRES REALES (Para no guardar IDs)
        // Ejecutamos ambas peticiones en paralelo para ser más rápidos
        const [provinces, cities] = await Promise.all([
          locationsService.getProvinces(),
          locationsService.getCities(context.selectedProvinceId),
        ]);

        const provinceObj = provinces.find(
          (p) => p.id === context.selectedProvinceId,
        );
        const cityObj = cities.find((c) => c.id === context.selectedCityId);

        // Si no encontramos el nombre, usamos un fallback, pero esto ya no debería pasar
        const realProvinceName = provinceObj ? provinceObj.name : "Desconocida";
        const realCityName = cityObj ? cityObj.name : "Desconocida";

        // B. PREPARAR PAYLOAD
        const payload = {
          provinceName: realProvinceName, // ¡AHORA ES DINÁMICO! Córdoba funcionará.
          cityName: realCityName,
          resultVariant: stepData.variant,
          // Puedes agregar más datos del contexto si los tienes (ej: grupo de riesgo)
          isRiskGroup: false, // O sacar de context si lo guardaste
          diagnosisType: "Generado por Wizard",
          patientWeightRange: "No especificado",
        };

        console.log("📊 Enviando estadística:", payload);

        // C. ENVIAR USANDO EL SERVICIO (AXIOS)
        await statsService.logConsultation(payload);
      } catch (error) {
        console.error("Error registrando estadística:", error);
        // No bloqueamos la UI si falla el log
      }
    };

    logData();
  }, [context.selectedProvinceId, context.selectedCityId, stepData]);

  // --- RENDERIZADO ---
  return (
    <div className="animate-fadeIn text-center">
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

      {/* CAJA LABORATORIO */}
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
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-600 flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <p className="font-bold text-white text-xl mb-1">{lab.name}</p>
                <div className="text-gray-400">{lab.address}</div>
                <div className="text-gray-500 text-sm mt-1">{lab.horario}</div>
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
          ) : (
            <p className="text-gray-500 italic text-center border border-gray-700 p-4 rounded-lg">
              No hay un laboratorio asignado a esta ciudad en el sistema.
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
