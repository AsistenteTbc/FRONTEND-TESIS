import React from "react";
import { Eye, EyeOff, BarChart, PieChart, Activity } from "lucide-react";

interface ChartTogglesProps {
  visibility: {
    bar: boolean;
    severity: boolean;
    diagnosis: boolean;
    weight: boolean;
    risk: boolean;
    trend: boolean;
  };
  onToggle: (key: string) => void;
}

export const ChartToggles: React.FC<ChartTogglesProps> = ({
  visibility,
  onToggle,
}) => {
  // Configuración de los botones
  const toggles = [
    {
      key: "bar",
      label: "Distribución Geográfica",
      icon: <BarChart size={16} />,
    },
    { key: "severity", label: "Gravedad", icon: <PieChart size={16} /> },
    { key: "diagnosis", label: "Diagnóstico", icon: <Activity size={16} /> },
    { key: "weight", label: "Peso", icon: <PieChart size={16} /> },
    { key: "risk", label: "Riesgo", icon: <PieChart size={16} /> },
    { key: "trend", label: "Tendencia", icon: <Activity size={16} /> },
  ];

  return (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700 mb-6 animate-fadeIn">
      <h3 className="text-gray-400 text-sm font-semibold mb-3 flex items-center gap-2">
        <Eye size={16} />
        VISIBILIDAD DE GRÁFICOS
      </h3>
      <div className="flex flex-wrap gap-3">
        {toggles.map((t) => {
          const isActive = visibility[t.key as keyof typeof visibility];
          return (
            <button
              key={t.key}
              onClick={() => onToggle(t.key)}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/50 hover:bg-blue-600/30"
                    : "bg-gray-700/30 text-gray-500 border border-gray-700 hover:bg-gray-700/50 line-through decoration-gray-500"
                }
              `}
            >
              {t.icon}
              {t.label}
              {isActive ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
