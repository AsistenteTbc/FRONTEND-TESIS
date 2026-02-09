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
    <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h3 className="text-xl font-bold text-gray-300 flex items-center gap-2">
          🌍 Detalle Nacional por Ciudades
        </h3>
      </div>

      <div className="divide-y divide-gray-700">
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
        )}
      </div>
    </div>
  );
};
