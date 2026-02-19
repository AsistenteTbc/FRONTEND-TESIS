import { useState } from 'react';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { DashboardFilters } from '../components/dashboard/DashboardFilters';
import { ChartBar } from '../components/dashboard/ChartBar';
import { ChartPie } from '../components/dashboard/ChartPie';
import { ChartTrend } from '../components/dashboard/ChartTrend';
import { ChartToggles } from '../components/dashboard/ChartToggles';
import { LayoutPanelLeft, MousePointer2 } from 'lucide-react';

const DashboardPage = () => {
  const { stats, loading, filters, provincesList, updateFilter, clearFilters } =
    useDashboardStats();

  // 1. ESTADO DE VISIBILIDAD
  const [visibility, setVisibility] = useState({
    bar: false,
    severity: false,
    diagnosis: false,
    weight: false,
    risk: false,
    trend: false,
  });

  const hasVisibleCharts = Object.values(visibility).some((v) => v === true);

  const toggleVisibility = (key: string) => {
    setVisibility((prev) => ({
      ...prev,
      [key as keyof typeof prev]: !prev[key as keyof typeof prev],
    }));
  };

  const isNational = filters.province === 'TODAS';

  // Filtro de seguridad para los datos de barra
  const barChartData = isNational
    ? stats?.byProvince
    : stats?.byCity?.filter((c: any) => c.province === filters.province);

  // Función auxiliar robusta para calcular totales dinámicos
  const getTotal = (data: any[] | undefined) => 
    data?.reduce((acc, curr) => acc + (curr.value || curr.count || 0), 0) || 0;

  // Títulos dinámicos con contadores incorporados
  const chartTitle = `${isNational ? 'Casos por Provincia' : `Casos por Ciudad en ${filters.province}`} (Total: ${getTotal(barChartData)})`;
  const severityTitle = `Tipos de Protocolo (Total: ${getTotal(stats?.bySeverity)})`;
  const diagnosisTitle = `Tipo de Diagnóstico (Total: ${getTotal(stats?.byDiagnosis)})`;
  const weightTitle = `Rango de Peso (Total: ${getTotal(stats?.byWeight)})`;
  const riskTitle = `Grupo de Riesgo (Total: ${getTotal(stats?.byRisk)})`;
  const trendTitle = `Evolución de Casos en el Tiempo (Total: ${getTotal(stats?.byTrend)})`; // <--- Agregado para el ChartTrend

  return (
    <div className="w-full min-h-screen text-white pt-24 px-4 md:px-10 pb-10">
      
      {/* HEADER + FILTROS */}
      <div className="w-full flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6">
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight shrink-0">
          Estadísticas
        </h1>
        <div className="w-full xl:w-auto">
          <DashboardFilters
            filters={filters}
            provincesList={provincesList}
            onUpdate={updateFilter}
            onClear={clearFilters}
          />
        </div>
      </div>

      {/* CONTROLES DE VISIBILIDAD */}
      <div className="w-full mb-8">
        <ChartToggles visibility={visibility} onToggle={toggleVisibility} />
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
      ) : !hasVisibleCharts ? (
        /* --- ESTADO VACÍO --- */
        <div className="flex flex-col items-center justify-start py-12 animate-fadeIn text-center w-full">
          <div className="bg-blue-500/10 p-5 rounded-full mb-6 border border-blue-500/20 shadow-lg shadow-blue-500/5">
            <LayoutPanelLeft className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">
            ¡Todavía no hay gráficos visibles!
          </h2>
          <p className="text-gray-400 max-w-md leading-relaxed">
            Selecciona arriba los gráficos que deseas visualizar. Los totales se calcularán automáticamente según tus filtros de provincia y fecha.
          </p>
          <div className="mt-8 flex items-center gap-2 text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium">
            <div className="w-8 h-[1px] bg-gray-800"></div>
            <MousePointer2 className="w-3 h-3" />
            <span>Haz clic en los botones de visibilidad</span>
            <div className="w-8 h-[1px] bg-gray-800"></div>
          </div>
        </div>
      ) : (
        <div className="animate-fadeIn space-y-10 w-full">
          {/* --- FILA 1: PRINCIPALES --- */}
          <div className="flex flex-col gap-10 w-full">
            {visibility.bar && (
              <div className="animate-fadeIn w-full bg-gray-800/30 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                <ChartBar data={barChartData} title={chartTitle} />
              </div>
            )}

            {visibility.severity && (
              <div className="animate-fadeIn w-full bg-gray-800/30 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                <ChartPie data={stats.bySeverity} title={severityTitle} />
              </div>
            )}
          </div>

          {/* --- FILA 2: CLÍNICA --- */}
          {(visibility.diagnosis || visibility.weight || visibility.risk) && (
            <div className="space-y-6 w-full">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-300 flex items-center gap-2 border-b border-gray-700 pb-3">
                🩺 Detalle Clínico y Demográfico
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {visibility.diagnosis && (
                  <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                    <ChartPie data={stats.byDiagnosis} title={diagnosisTitle} />
                  </div>
                )}
                {visibility.weight && (
                  <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                    <ChartPie data={stats.byWeight} title={weightTitle} />
                  </div>
                )}
                {visibility.risk && (
                  <div className="bg-gray-800/40 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl">
                    <ChartPie data={stats.byRisk} title={riskTitle} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- FILA 3: TENDENCIA --- */}
          {visibility.trend && (
            <div className="animate-fadeIn w-full bg-gray-800/30 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl">
              {/* Ahora pasamos el título con el total acumulado de la tendencia */}
              <ChartTrend data={stats.byTrend} title={trendTitle} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;