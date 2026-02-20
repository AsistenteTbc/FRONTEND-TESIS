import React from 'react';
import { Filter, Calendar, X } from 'lucide-react';
import DatePicker from 'react-datepicker'; // <--- Importar la librería
import 'react-datepicker/dist/react-datepicker.css'; // <--- Importar los estilos base
import { Button } from '../ui/Button';

interface Props {
  filters: any;
  provincesList: any[];
  onUpdate: (key: string, val: string | null) => void;
  onClear: () => void;
}

export const DashboardFilters: React.FC<Props> = ({
  filters,
  provincesList,
  onUpdate,
  onClear,
}) => {
  const hasActiveFilters =
    filters.from || filters.to || filters.province !== 'TODAS';

  // Función para formatear la fecha a YYYY-MM-DD (lo que espera tu backend)
  const handleDateChange = (key: string, date: Date | null) => {
    if (!date) {
      onUpdate(key, null);
      return;
    }
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);
    onUpdate(key, adjustedDate.toISOString().split('T')[0]);
  };

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-700 shadow-xl w-full xl:w-auto relative z-50">
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
          onChange={(e) => onUpdate('province', e.target.value)}
          className="w-full md:w-48 bg-gray-900/50 text-white text-sm rounded-xl px-3 py-2.5 border border-gray-600 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
        >
          <option value="TODAS">🇦🇷 Nivel Nacional</option>
          {provincesList.map((p) => (
            <option key={p.id} value={p.name}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden md:block w-px h-10 bg-gray-700 mx-2"></div>

      {/* SECCIÓN: FECHAS (MODIFICADA) */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
        <div className="flex items-center gap-2 shrink-0">
          <Calendar className="text-blue-400 w-4 h-4" />
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-wider">
            Periodo
          </span>
        </div>

        <div className="flex gap-2 w-full sm:w-auto items-center custom-datepicker">
          <DatePicker
            selected={
              filters.from ? new Date(filters.from + 'T00:00:00') : null
            }
            onChange={(date) => handleDateChange('from', date)}
            selectsStart
            startDate={
              filters.from ? new Date(filters.from + 'T00:00:00') : null
            }
            endDate={filters.to ? new Date(filters.to + 'T00:00:00') : null}
            maxDate={filters.to ? new Date(filters.to + 'T00:00:00') : null}
            placeholderText="Desde"
            dateFormat="dd/MM/yyyy"
            className="w-full bg-gray-900/50 text-white text-xs rounded-xl px-3 py-2.5 border border-gray-600 focus:border-blue-500 outline-none cursor-pointer"
          />
          <DatePicker
            selected={filters.to ? new Date(filters.to + 'T00:00:00') : null}
            onChange={(date) => handleDateChange('to', date)}
            selectsEnd
            startDate={
              filters.from ? new Date(filters.from + 'T00:00:00') : null
            }
            endDate={filters.to ? new Date(filters.to + 'T00:00:00') : null}
            minDate={filters.from ? new Date(filters.from + 'T00:00:00') : null}
            placeholderText="Hasta"
            dateFormat="dd/MM/yyyy"
            className="w-full bg-gray-900/50 text-white text-xs rounded-xl px-3 py-2.5 border border-gray-600 focus:border-blue-500 outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* BOTÓN LIMPIAR */}
      {hasActiveFilters && (
        <Button
          variant="danger"
          size="sm"
          onClick={onClear}
          icon={<X size={14} />}
        >
          Limpiar filtros
        </Button>
      )}
    </div>
  );
};
