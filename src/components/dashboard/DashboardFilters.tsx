import React from "react";
import { Filter, Calendar, X } from "lucide-react";

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
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700 shadow-xl w-full xl:w-auto">
      
      {/* SECCIÓN: UBICACIÓN */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
        <div className="flex items-center gap-2 shrink-0">
          <Filter className="text-blue-400 w-4 h-4" />
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider">
            Ubicación
          </span>
        </div>
        <select
          value={filters.province}
          onChange={(e) => onUpdate("province", e.target.value)}
          className="w-full md:w-48 bg-gray-900/50 text-white text-sm rounded-xl px-3 py-2.5 border border-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all appearance-none cursor-pointer"
        >
          <option value="TODAS">🇦🇷 Nivel Nacional</option>
          {provincesList.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* SEPARADOR (Solo visible en desktop) */}
      <div className="hidden md:block w-px h-10 bg-gray-700 mx-2"></div>

      {/* SECCIÓN: FECHAS */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
        <div className="flex items-center gap-2 shrink-0">
          <Calendar className="text-blue-400 w-4 h-4" />
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider">
            Periodo
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 w-full sm:w-auto items-center">
          <input
            type="date"
            value={filters.from}
            onChange={(e) => onUpdate("from", e.target.value)}
            max={filters.to || undefined}
            className="w-full bg-gray-900/50 text-white text-xs rounded-xl px-3 py-2.5 border border-gray-600 focus:border-blue-500 outline-none transition-all color-scheme-dark"
            title="No se puede seleccionar una fecha posterior a la fecha 'hasta'"
          />
          <input
            type="date"
            value={filters.to}
            onChange={(e) => onUpdate("to", e.target.value)}
            min={filters.from || undefined}
            className="w-full bg-gray-900/50 text-white text-xs rounded-xl px-3 py-2.5 border border-gray-600 focus:border-blue-500 outline-none transition-all color-scheme-dark"
            title="No se puede seleccionar una fecha anterior a la fecha 'desde'"
          />
        </div>
      </div>

      {/* BOTÓN LIMPIAR */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center justify-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors border border-transparent hover:border-red-500/20"
        >
          <X size={14} />
          <span>Limpiar</span>
        </button>
      )}
    </div>
  );
};