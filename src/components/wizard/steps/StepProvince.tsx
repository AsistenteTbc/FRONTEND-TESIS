import React, { useEffect, useState } from 'react';
import type { StepComponentProps } from '../../../types/wizard';
import { locationsService } from '../../../services/locations.service';
import { Button } from '../../ui/Button';
import Select from 'react-select';

const StepProvince: React.FC<StepComponentProps> = ({ stepData, onNext }) => {
  const [options, setOptions] = useState<{value: number, label: string}[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provinces = await locationsService.getProvinces();
        setOptions(provinces.map(p => ({ value: p.id, label: p.name })));
      } catch (error) {
        console.error('Error cargando provincias', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProvinces();
  }, []);

  const selectedOption = options.find(opt => opt.value === selectedId);

  const handleSubmit = () => {
    if (selectedId) {
      onNext(selectedId);
    }
  };

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{stepData.title}</h2>
        <p className="text-gray-400">Seleccione la región donde reside el paciente.</p>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          Provincia
        </label>
        <Select
          options={options}
          value={selectedOption}
          onChange={(opt) => setSelectedId(opt?.value || null)}
          isLoading={loading}
          placeholder={loading ? "Cargando provincias..." : "Buscar provincia..."}
          className="react-select-dark"
          classNamePrefix="react-select"
          isSearchable
          isClearable
          noOptionsMessage={() => "No hay provincias disponibles"}
          styles={{
            menu: (base) => ({
              ...base,
              zIndex: 9999,
            }),
            input: (base) => ({
              ...base,
              color: 'white',
            }),
            singleValue: (base) => ({
              ...base,
              color: 'white',
            }),
          }}
        />
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={!selectedId || loading}
        fullWidth
        isLoading={loading}
      >
        Continuar
      </Button>
    </div>
  );
};

export default StepProvince;