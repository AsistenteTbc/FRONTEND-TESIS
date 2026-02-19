import React, { useState } from "react";
import { MapPin, ChevronUp, ChevronDown } from "lucide-react";

interface Props {
  data: any[]; // Recibe la lista plana de ciudades
}

export const CityAccordion: React.FC<Props> = ({ data }) => {
  const [expandedProvince, setExpandedProvince] = useState<string | null>(null);

  // Agrupamos las ciudades por provincia
  const groupedCities = data.reduce((acc: any, item: any) => {
    if (!acc[item.province]) acc[item.province] = [];
    acc[item.province].push(item);
    return acc;
  }, {});

  const toggleProvince = (name: string) =>
    setExpandedProvince(expandedProvince === name ? null : name);

  if (Object.keys(groupedCities).length === 0) return null;

  return (
    /* Contenedor Principal con efecto Liquid Glass */
    <div className="bg-gray-800/30 backdrop-blur-md rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
      <div className="p-6 border-b border-gray-700/50 bg-gray-800/40">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          📍 Cantidad de casos por provincia y ciudades
        </h3>
      </div>

      <div className="divide-y divide-gray-700/50">
        {Object.entries(groupedCities).map(
          ([provinceName, cities]: [string, any]) => {
            const isOpen = expandedProvince === provinceName;
            const totalCases = cities.reduce(
              (sum: number, city: any) => sum + city.value,
              0,
            );

            return (
              <div
                key={provinceName}
                className="transition-all duration-300"
              >
                <button
                  onClick={() => toggleProvince(provinceName)}
                  className={`w-full px-6 py-5 flex items-center justify-between transition-all focus:outline-none ${
                    isOpen ? "bg-blue-500/10" : "hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-xl transition-all duration-300 ${
                        isOpen 
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/40" 
                          : "bg-gray-700/50 text-gray-400 border border-gray-600/50"
                      }`}
                    >
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-lg font-semibold text-white tracking-tight">
                        {provinceName}
                      </span>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        {totalCases.toLocaleString()} casos registrados
                      </span>
                    </div>
                  </div>
                  <div className={`p-1 rounded-full transition-transform duration-300 ${isOpen ? "rotate-180 bg-blue-500/20 text-blue-400" : "text-gray-500"}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="bg-gray-900/40 px-6 py-6 border-t border-gray-700/50 animate-fadeIn">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {cities.map((city: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center p-3.5 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-blue-500/50 transition-colors group"
                        >
                          <span className="text-gray-300 font-medium truncate pr-2 group-hover:text-white transition-colors">
                            {city.city}
                          </span>
                          <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-lg text-xs font-black border border-blue-500/20">
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
        )}
      </div>
    </div>
  );
};