import { useState } from "react"; // <--- Importar useState
import { useDashboardStats } from "../hooks/useDashboardStats";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { DashboardFilters } from "../components/dashboard/DashboardFilters";
import { ChartBar } from "../components/dashboard/ChartBar";
import { ChartPie } from "../components/dashboard/ChartPie";
import { ChartTrend } from "../components/dashboard/ChartTrend";
import { CityAccordion } from "../components/dashboard/CityAccordion";
import { ChartToggles } from "../components/dashboard/ChartToggles"; // <--- Importar el nuevo componente

const DashboardPage = () => {
  const { stats, loading, filters, provincesList, updateFilter, clearFilters } =
    useDashboardStats();

  // 1. ESTADO DE VISIBILIDAD (Por defecto todo en true)
  const [visibility, setVisibility] = useState({
    bar: true,
    severity: true,
    diagnosis: true,
    weight: true,
    risk: true,
    trend: true,
  });

  // Handler para cambiar la visibilidad
  const toggleVisibility = (key: string) => {
    setVisibility((prev) => ({
      ...prev,
      [key as keyof typeof prev]: !prev[key as keyof typeof prev],
    }));
  };

  const isNational = filters.province === "TODAS";

  const barChartData = isNational
    ? stats?.byProvince
    : stats?.byCity.filter((c: any) => c.province === filters.province);

  const chartTitle = isNational
    ? "Casos por Provincia"
    : `Casos por Ciudad en ${filters.province}`;

  const pieTitle = `Tipos de Protocolo ${isNational ? "(Nacional)" : `(${filters.province})`}`;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white pt-24">
      {/* HEADER + FILTROS DE DATOS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          📊 Tablero Epidemiológico
        </h1>

        <DashboardFilters
          filters={filters}
          provincesList={provincesList}
          onUpdate={updateFilter}
          onClear={clearFilters}
        />
      </div>

      {/* CONTROLES DE VISIBILIDAD (NUEVO) */}
      <ChartToggles visibility={visibility} onToggle={toggleVisibility} />

      {/* CONTENIDO */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : !stats ? (
        <div className="text-center text-gray-500 py-20">
          Error cargando datos.
        </div>
      ) : (
        <div className="animate-fadeIn space-y-8">
          {/* --- FILA 1: PRINCIPALES --- */}
          {(visibility.bar || visibility.severity) && (
            <div
              className={`grid grid-cols-1 ${visibility.bar && visibility.severity ? "lg:grid-cols-2" : ""} gap-8`}
            >
              {visibility.bar && (
                <ChartBar data={barChartData} title={chartTitle} />
              )}
              {visibility.severity && (
                <ChartPie data={stats.bySeverity} title={pieTitle} />
              )}
            </div>
          )}

          {/* --- FILA 2: CLÍNICA (DINÁMICA) --- */}
          {/* Título de sección solo si hay algún gráfico visible */}
          {(visibility.diagnosis || visibility.weight || visibility.risk) && (
            <h2 className="text-xl font-semibold text-gray-300 flex items-center gap-2 border-b border-gray-700 pb-2">
              🩺 Detalle Clínico y Demográfico
            </h2>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibility.diagnosis && (
              <ChartPie data={stats.byDiagnosis} title="Tipo de Diagnóstico" />
            )}
            {visibility.weight && (
              <ChartPie data={stats.byWeight} title="Rango de Peso" />
            )}
            {visibility.risk && (
              <ChartPie data={stats.byRisk} title="Grupo de Riesgo" />
            )}
          </div>

          {/* --- FILA 3: TENDENCIA --- */}
          {visibility.trend && (
            <div className="animate-fadeIn">
              <ChartTrend data={stats.byTrend} />
            </div>
          )}

          {/* --- ACORDEÓN (Siempre visible si es nacional, o puedes agregarle toggle) --- */}
          {isNational && stats.byCity && <CityAccordion data={stats.byCity} />}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
