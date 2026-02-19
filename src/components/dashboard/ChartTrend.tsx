import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: any[];
  title?: string; // <--- Agregamos esta línea
}

export const ChartTrend: React.FC<Props> = ({ data, title }) => { // <--- Recibimos 'title'
  return (
    <div className="bg-gray-800/30 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-700/50 mb-8">
      <h3 className="text-xl mb-4 text-gray-300 font-semibold border-b border-gray-700 pb-2">
        {/* Usamos el title que viene por prop, o uno por defecto si no hay */}
        📉 {title || "Evolución de Casos en el Tiempo"}
      </h3>
      <div className="h-[300px]">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
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
                  if (!str) return "";
                  const parts = str.split("-");
                  return parts.length === 3 ? `${parts[2]}/${parts[1]}` : str;
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
  );
};