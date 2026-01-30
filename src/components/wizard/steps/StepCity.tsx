import React, { useEffect, useState } from "react";
import type { StepComponentProps } from "../../../types/wizard";
import { locationsService } from "../../../services/locations.service";
import { Button } from "../../ui/Button";
import Select from "react-select";

const StepCity: React.FC<StepComponentProps> = ({
  stepData,
  onNext,
  onBack,
  context,
}) => {
  const [options, setOptions] = useState<{ value: number; label: string }[]>(
    []
  );
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const provinceId = context.selectedProvinceId;

    if (!provinceId) {
      console.error("No hay provincia seleccionada en el contexto");
      return;
    }

    const fetchCities = async () => {
      setLoading(true);
      try {
        const cities = await locationsService.getCities(provinceId);
        setOptions(cities.map((c) => ({ value: c.id, label: c.name })));
      } catch (error) {
        console.error("Error cargando ciudades", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, [context.selectedProvinceId]);

  const selectedOption = options.find((opt) => opt.value === selectedId);

  return (
    <div className="animate-fadeIn space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{stepData.title}</h2>
        <p className="text-gray-400">Seleccione su localidad más cercana.</p>
      </div>

      <Select
        options={options}
        value={selectedOption}
        onChange={(opt) => setSelectedId(opt?.value || null)}
        isLoading={loading}
        placeholder="Buscar ciudad..."
        className="react-select-dark"
        classNamePrefix="react-select"
        isSearchable
        isClearable
        noOptionsMessage={() => "No hay ciudades disponibles"}
        styles={{
          menu: (base) => ({
            ...base,
            zIndex: 9999, // Asegura que esté por encima de todo
          }),
        }}
      />

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="w-1/3">
          Atrás
        </Button>
        <Button
          onClick={() => selectedId && onNext(selectedId)}
          disabled={!selectedId}
          className="w-2/3"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default StepCity;
