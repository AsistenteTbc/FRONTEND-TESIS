import { Link, useLocation } from "react-router-dom";
import { Map, Building2, MapPin } from "lucide-react"; // Íconos opcionales para que quede más bonito

export const AdminMenu = () => {
  const location = useLocation();

  // Definimos las pestañas
  const tabs = [
    { name: "Provincias", path: "/admin/provinces", icon: Map },
    { name: "Laboratorios", path: "/admin/laboratorios", icon: Building2 },
    { name: "Ciudades", path: "/admin/cities", icon: MapPin },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="mb-8 border-b border-gray-700 pb-1">
      <nav className="flex gap-4 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.path);

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2
                ${
                  active
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600"
                }
              `}
            >
              <Icon size={16} />
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
