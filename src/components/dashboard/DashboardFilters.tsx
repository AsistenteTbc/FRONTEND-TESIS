import React from "react";
import { Filter, Calendar } from "lucide-react";

interface Props {
  filters: any;
  provincesList: any[];
  onUpdate: (key: string, val: string) => void;
  onClear: () => void;
}

export const DashboardFilters: React.FC<Props> = ({
  filters,
  provincesList,
  onUpdate,
  onClear,
}) => {
  const hasActiveFilters =
    filters.from || filters.to || filters.province !== "TODAS";

  return (
    <div className="flex flex-col md:flex-row flex-wrap gap-4 bg-gray-800 p-4 rounded-xl border border-gray-700 shadow-lg w-full xl:w-auto">
      {/* Provincia */}
      <div className="flex items-center gap-2">
        <Filter className="text-blue-400 w-4 h-4" />
        <span className="text-xs text-gray-400 font-bold uppercase">
          Ubicación
        </span>
        <select
          value={filters.province}
          onChange={(e) => onUpdate("province", e.target.value)}
          className="bg-gray-700 text-white text-sm rounded px-3 py-2 border border-gray-600 focus:outline-none focus:border-blue-500"
        >
          <option value="TODAS">🇦🇷 Nivel Nacional</option>
          {provincesList.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-px h-8 bg-gray-700 hidden md:block"></div>

      {/* Fechas */}
      <div className="flex items-center gap-3">
        <Calendar className="text-blue-400 w-4 h-4" />
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase leading-none mb-1">
              Desde
            </span>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => onUpdate("from", e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
            />
          </div>
          <span className="text-gray-500 mt-4">➝</span>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 font-bold uppercase leading-none mb-1">
              Hasta
            </span>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => onUpdate("to", e.target.value)}
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 border border-gray-600"
            />
          </div>
        </div>
      </div>

      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="ml-auto md:ml-0 text-xs text-red-400 hover:text-red-300 underline"
        >
          Limpiar
        </button>
      )}
    </div>
  );
};
