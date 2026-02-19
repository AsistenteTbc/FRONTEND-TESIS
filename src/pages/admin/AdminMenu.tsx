import { Link, useLocation } from "react-router-dom";
import { Map, Building2, MapPin } from "lucide-react";

export const AdminMenu = () => {
  const location = useLocation();

  // Definimos las opciones como cards
  const options = [
    {
      name: "Provincias",
      path: "/admin/provinces",
      icon: Map,
      description: "Gestionar provincias",
      gradient: "from-blue-600 to-blue-700",
      lightBg: "bg-blue-500/10",
      activeBg: "bg-blue-500/20",
      border: "border-blue-500/30",
      hover: "hover:border-blue-500/50 hover:bg-blue-500/20"
    },
    {
      name: "Laboratorios",
      path: "/admin/laboratorios",
      icon: Building2,
      description: "Gestionar laboratorios",
      gradient: "from-purple-600 to-purple-700",
      lightBg: "bg-purple-500/10",
      activeBg: "bg-purple-500/20",
      border: "border-purple-500/30",
      hover: "hover:border-purple-500/50 hover:bg-purple-500/20"
    },
    {
      name: "Ciudades",
      path: "/admin/cities",
      icon: MapPin,
      description: "Gestionar ciudades",
      gradient: "from-cyan-600 to-cyan-700",
      lightBg: "bg-cyan-500/10",
      activeBg: "bg-cyan-500/20",
      border: "border-cyan-500/30",
      hover: "hover:border-cyan-500/50 hover:bg-cyan-500/20"
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="mb-12 flex justify-center w-full">
      <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
        {options.map((option) => {
          const Icon = option.icon;
          const active = isActive(option.path);

          return (
            <Link
              key={option.path}
              to={option.path}
              className={`
                relative overflow-hidden group flex-1 sm:flex-none
                px-12 py-10 rounded-2xl transition-all duration-300
                ${active ? `${option.activeBg} border-opacity-100` : `bg-gray-800/40 border-opacity-50`}
                backdrop-blur-md border shadow-lg
                ${option.border} ${!active ? option.hover : ""}
              `}
            >
              {/* Gradiente de fondo que aparece al hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

              {/* Contenido */}
              <div className="relative flex flex-col items-center gap-3">
                <div className={`
                  p-3 rounded-xl transition-all duration-300
                  ${active ? `bg-gradient-to-br ${option.gradient} text-white shadow-lg` : `${option.lightBg} text-gray-300 group-hover:text-white`}
                `}>
                  <Icon size={24} />
                </div>

                <div className="text-center">
                  <h3 className={`text-sm font-bold transition-colors duration-300 ${
                    active ? "text-white" : "text-gray-300 group-hover:text-white"
                  }`}>
                    {option.name}
                  </h3>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors mt-1">
                    {option.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
