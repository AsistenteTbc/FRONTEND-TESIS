import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ChevronDown, ChevronUp, MapPin, Filter, Calendar } from "lucide-react";
// Importamos el servicio para buscar las provincias reales
import { adminService } from "../services/admin.service";

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // --- FILTROS ---
  const [selectedProvince, setSelectedProvince] = useState<string>("TODAS");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  // Estado para la lista dinámica de provincias
  const [provincesList, setProvincesList] = useState<any[]>([]);

  // Estado del acordeón
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null);

  // 1. EFECTO DE CARGA INICIAL (Traer provincias disponibles)
  useEffect(() => {
    adminService
      .getProvinces()
      .then((data) => setProvincesList(data))
      .catch((err) =>
        console.error("Error cargando provincias para filtro:", err),
      );
  }, []);

  // 2. EFECTO DE DATOS (Se dispara cuando cambia un filtro)
  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    if (selectedProvince !== "TODAS") {
      params.append("province", selectedProvince);
    }
    if (dateFrom) {
      params.append("from", dateFrom);
    }
    if (dateTo) {
      params.append("to", dateTo);
    }

    fetch(`http://localhost:3000/stats/dashboard?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        const safeData = {
          byProvince: data.byProvince.map((item: any) => ({
            ...item,
            value: Number(item.value),
          })),
          bySeverity: data.bySeverity.map((item: any) => ({
            ...item,
            value: Number(item.value),
          })),
          byCity: data.byCity
            ? data.byCity.map((item: any) => ({
                ...item,
                value: Number(item.value),
              }))
            : [],
          byTrend: data.byTrend
            ? data.byTrend.map((item: any) => ({
                ...item,
                value: Number(item.value),
              }))
            : [],
        };
        setStats(safeData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [selectedProvince, dateFrom, dateTo]);

  // Agrupar ciudades (Solo se usa si estamos en TODAS)
  const groupedCities = stats?.byCity
    ? stats.byCity.reduce((acc: any, item: any) => {
        if (!acc[item.province]) acc[item.province] = [];
        acc[item.province].push(item);
        return acc;
      }, {})
    : {};

  const toggleProvince = (name: string) =>
    setExpandedProvince(expandedProvince === name ? null : name);

  const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const isNational = selectedProvince === "TODAS";

  const barChartData = isNational
    ? stats?.byProvince
    : stats?.byCity.filter((c: any) => c.province === selectedProvince);

  const xAxisKey = isNational ? "name" : "city";

  const clearFilters = () => {
    setSelectedProvince("TODAS");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white pt-24">
      {/* HEADER + BARRA DE FILTROS */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          📊 Tablero Epidemiológico
        </h1>

        {/* CONTENEDOR DE FILTROS */}
        <div className="flex flex-col md:flex-row flex-wrap gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg w-full xl:w-auto">
          {/* 1. Filtro Provincia */}
          <div className="flex items-center gap-2">
            <Filter className="text-blue-400 w-4 h-4" />
            <span className="text-xs text-gray-400 font-bold uppercase">
              Ubicación
            </span>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <option value="TODAS">🇦🇷 Nivel Nacional</option>

              {/* 👇 AQUI ESTA LA MAGIA: Mapeamos la lista real de la BD */}
              {provincesList.map((prov) => (
                <option key={prov.id} value={prov.name}>
                  {prov.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-px h-8 bg-gray-700 hidden md:block"></div>

          {/* 2. Filtro Fechas */}
          <div className="flex items-center gap-3">
            <Calendar className="text-blue-400 w-4 h-4" />
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase leading-none mb-1">
                  Desde
                </span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <span className="text-gray-500 mt-3">➝</span>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 font-bold uppercase leading-none mb-1">
                  Hasta
                </span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Botón Limpiar */}
          {(dateFrom || dateTo || selectedProvince !== "TODAS") && (
            <button
              onClick={clearFilters}
              className="ml-auto md:ml-0 text-xs text-red-400 hover:text-red-300 underline"
            >
              Limpiar Filtros
            </button>
          )}
        </div>
      </div>

      {/* CONTENIDO DEL DASHBOARD */}
      {loading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner />
        </div>
      ) : !stats ? (
        <div>Error cargando datos.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* GRÁFICO 1: BARRAS */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-xl mb-4 text-gray-300 font-semibold border-b border-gray-700 pb-2">
                {isNational
                  ? "Casos por Provincia"
                  : `Casos por Ciudad en ${selectedProvince}`}
                {(dateFrom || dateTo) && (
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    (Filtrado por fecha)
                  </span>
                )}
              </h3>
              <div className="h-[300px]">
                {barChartData && barChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#374151"
                        vertical={false}
                      />
                      <XAxis
                        dataKey={xAxisKey}
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        interval={0}
                      />
                      <YAxis
                        stroke="#9ca3af"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        allowDecimals={false}
                      />
                      <Tooltip
                        cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                          color: "#fff",
                        }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#3b82f6"
                        radius={[4, 4, 0, 0]}
                        barSize={50}
                        name="Casos"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <p>No hay datos para este rango o ubicación.</p>
                  </div>
                )}
              </div>
            </div>

            {/* GRÁFICO 2: TORTA */}
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h3 className="text-xl mb-4 text-gray-300 font-semibold border-b border-gray-700 pb-2">
                Tipos de Protocolo{" "}
                {isNational ? "(Nacional)" : `(${selectedProvince})`}
              </h3>
              <div className="h-[300px]">
                {stats.bySeverity.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.bySeverity}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={40}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        paddingAngle={5}
                        label={({ percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {stats.bySeverity.map((entry: any, index: number) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          borderColor: "#374151",
                          color: "#fff",
                        }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500">
                    <p>Sin datos de riesgo.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* GRÁFICO 3: TENDENCIA TEMPORAL (NUEVO) */}
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 mb-8">
            <h3 className="text-xl mb-4 text-gray-300 font-semibold border-b border-gray-700 pb-2">
              📉 Evolución de Casos en el Tiempo
            </h3>
            <div className="h-[300px]">
              {stats.byTrend && stats.byTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.byTrend}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#374151"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="date"
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(str) => {
                        const [year, month, day] = str.split("-");
                        return `${day}/${month}`;
                      }}
                    />
                    <YAxis
                      stroke="#9ca3af"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                        color: "#fff",
                      }}
                      labelFormatter={(label) => `Fecha: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#8884d8"
                      strokeWidth={3}
                      dot={{ r: 4, fill: "#8884d8" }}
                      activeDot={{ r: 8 }}
                      name="Casos Diarios"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <p>No hay suficientes datos temporales.</p>
                </div>
              )}
            </div>
          </div>

          {/* ACORDEÓN DE CIUDADES */}
          {isNational && (
            <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
              <div className="p-6 border-b border-gray-700">
                <h3 className="text-xl font-bold text-gray-300 flex items-center gap-2">
                  🌍 Detalle Nacional por Ciudades
                  {(dateFrom || dateTo) && (
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      (Filtrado por fecha)
                    </span>
                  )}
                </h3>
              </div>

              <div className="divide-y divide-gray-700">
                {Object.keys(groupedCities).length > 0 ? (
                  Object.entries(groupedCities).map(
                    ([provinceName, cities]: [string, any]) => {
                      const isOpen = expandedProvince === provinceName;
                      const totalCases = cities.reduce(
                        (sum: number, city: any) => sum + city.value,
                        0,
                      );

                      return (
                        <div
                          key={provinceName}
                          className="bg-gray-800 transition-colors hover:bg-gray-750"
                        >
                          <button
                            onClick={() => toggleProvince(provinceName)}
                            className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors focus:outline-none"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className={`p-2 rounded-lg ${isOpen ? "bg-blue-500/20 text-blue-400" : "bg-gray-700 text-gray-400"}`}
                              >
                                <MapPin className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <span className="block text-lg font-medium text-white">
                                  {provinceName}
                                </span>
                                <span className="text-sm text-gray-400">
                                  {totalCases} casos en el período
                                </span>
                              </div>
                            </div>
                            {isOpen ? (
                              <ChevronUp className="text-gray-400" />
                            ) : (
                              <ChevronDown className="text-gray-400" />
                            )}
                          </button>
                          {isOpen && (
                            <div className="bg-gray-900/50 px-6 py-4 border-t border-gray-700 animate-fadeIn">
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {cities.map((city: any, idx: number) => (
                                  <div
                                    key={idx}
                                    className="flex justify-between items-center p-3 rounded bg-gray-800 border border-gray-700"
                                  >
                                    <span className="text-gray-300 font-medium truncate pr-2">
                                      {city.city}
                                    </span>
                                    <span className="bg-blue-900/50 text-blue-400 px-2 py-1 rounded text-sm font-bold">
                                      {city.value}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    },
                  )
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    No hay registros detallados.
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Dashboard;
