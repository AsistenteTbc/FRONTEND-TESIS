import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  data: any[];
  title: string;
}

export const ChartBar: React.FC<Props> = ({ data, title }) => {
  // Determinamos dinámicamente qué clave usar para el eje X
  // Si los datos tienen 'city', usamos 'city'. Si tienen 'name', usamos 'name' (provincias).
  const xAxisKey = data.length > 0 && data[0].city ? "city" : "name";

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
      <h3 className="text-xl mb-4 text-gray-300 font-semibold border-b border-gray-700 pb-2">
        {title}
      </h3>
      <div className="h-[300px]">
        {data && data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
            <p>No hay datos disponibles.</p>
          </div>
        )}
      </div>
    </div>
  );
};
