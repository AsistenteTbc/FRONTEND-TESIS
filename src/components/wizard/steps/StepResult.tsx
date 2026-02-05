import React, { useEffect, useState, useRef } from "react";
import type { StepComponentProps, ILaboratory } from "../../../types/wizard"; // Asegúrate de la ruta correcta
import { locationsService } from "../../../services/locations.service";
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

  // 2. LÓGICA DE FILTRADO DE CONTENIDO (JSON vs Texto)
  const [displayContent, setDisplayContent] = useState<{
    medical: string;
    logistics: string;
  }>({
    medical: "",
    logistics: "",
  });

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

  // 3. LÓGICA DE LABORATORIO
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

  // 4. LÓGICA DE ESTADÍSTICAS (ACTUALIZADA PARA OBTENER NOMBRE REAL DE CIUDAD)
  const hasLogged = useRef(false);

  useEffect(() => {
    // Solo registramos si no se ha hecho ya y tenemos datos geográficos
    if (
      !hasLogged.current &&
      context.selectedProvinceId &&
      context.selectedCityId
    ) {
      hasLogged.current = true;

      const logStatistics = async () => {
        let realCityName = "Desconocida";

        try {
          // BUSCAMOS EL NOMBRE REAL DE LA CIUDAD
          // Pedimos la lista de ciudades de esa provincia y buscamos la que coincida con el ID
          const cities = await locationsService.getCities(
            context.selectedProvinceId!,
          );
          const foundCity = cities.find((c) => c.id === context.selectedCityId);

          if (foundCity) {
            realCityName = foundCity.name; // Ej: "General Pico"
          } else {
            realCityName = `City ID: ${context.selectedCityId}`; // Fallback
          }
        } catch (error) {
          console.error("No se pudo obtener el nombre de la ciudad", error);
          realCityName = `City ID: ${context.selectedCityId}`;
        }

        const provinceName =
          context.selectedProvinceId === 1 ? "La Pampa" : "Santa Fe";

        const payload = {
          provinceName: provinceName,
          cityName: realCityName, // <--- AHORA ENVIAMOS EL NOMBRE REAL
          resultVariant: stepData.variant,
          resultTitle: stepData.title,
        };

        console.log("📊 Registrando estadística...", payload);

        fetch("http://localhost:3000/stats/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }).catch((err) => console.error("Error al guardar estadísticas:", err));
      };

      logStatistics();
    }
  }, [context.selectedProvinceId, context.selectedCityId, stepData]);

  return (
    <div className="animate-fadeIn text-center">
      <div className="mb-6 flex justify-center">
        <div className={`rounded-full p-6 border-4 ${styles.bgIcon}`}>
          <span className="text-6xl">{styles.icon}</span>
        </div>
      </div>

      <h2 className={`text-3xl font-bold mb-4 ${styles.title}`}>
        {stepData.title}
      </h2>

      {/* PARTE MÉDICA */}
      <div
        className={`p-6 rounded-xl border shadow-lg mb-6 text-left whitespace-pre-line ${styles.box}`}
      >
        <p className="text-lg text-gray-200 leading-relaxed font-medium">
          {displayContent.medical}
        </p>
      </div>

      {/* PARTE LOGÍSTICA */}
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

      {/* LABORATORIO */}
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
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                >
                  📞 Llamar
                </a>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center">
              Sin laboratorio asignado.
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
