import { useDashboardStats } from "../hooks/useDashboardStats";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { DashboardFilters } from "../components/dashboard/DashboardFilters";
import { ChartBar } from "../components/dashboard/ChartBar";
import { ChartPie } from "../components/dashboard/ChartPie";
import { ChartTrend } from "../components/dashboard/ChartTrend";
import { CityAccordion } from "../components/dashboard/CityAccordion";

const DashboardPage = () => {
  const { stats, loading, filters, provincesList, updateFilter, clearFilters } =
    useDashboardStats();

  const isNational = filters.province === "TODAS";

  // Preparamos los datos para el gráfico de barras
  const barChartData = isNational
    ? stats?.byProvince
    : stats?.byCity.filter((c: any) => c.province === filters.province);

  const chartTitle = isNational
    ? "Casos por Provincia"
    : `Casos por Ciudad en ${filters.province}`;

  const pieTitle = `Tipos de Protocolo ${isNational ? "(Nacional)" : `(${filters.province})`}`;

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white pt-24">
      {/* HEADER + FILTROS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <ChartBar data={barChartData} title={chartTitle} />
            <ChartPie data={stats.bySeverity} title={pieTitle} />
          </div>

          <ChartTrend data={stats.byTrend} />

          {/* El acordeón solo se muestra si es vista nacional y hay datos de ciudades */}
          {isNational && stats.byCity && <CityAccordion data={stats.byCity} />}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
