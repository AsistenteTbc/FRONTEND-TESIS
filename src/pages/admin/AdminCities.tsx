import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import {
  adminService,
  type ICity,
  type IProvince,
  type ILaboratorio,
} from "../../services/admin.service";
import { AdminMenu } from "./AdminMenu";

const AdminCities = () => {
  const [cities, setCities] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estado del formulario
  const initialForm = {
    name: "",
    zipCode: "",
    provinceId: 0,
    laboratorioId: 0,
  };
  const [formData, setFormData] = useState<any>(initialForm);

  const loadData = async () => {
    try {
      const [c, p, l] = await Promise.all([
        adminService.getCities(),
        adminService.getProvinces(),
        adminService.getLaboratorios(),
      ]);
      setCities(c);
      setProvinces(p);
      setLaboratorios(l);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      provinceId: Number(formData.provinceId),
      // Si es 0 o vacío, mandamos null para que la DB no falle
      laboratorioId:
        Number(formData.laboratorioId) > 0
          ? Number(formData.laboratorioId)
          : null,
    };

    try {
      if (formData.id) await adminService.updateCity(formData.id, payload);
      else await adminService.createCity(payload);

      setIsModalOpen(false);
      setFormData(initialForm);
      loadData();
    } catch (error) {
      alert("Error al guardar ciudad");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta ciudad?")) {
      await adminService.deleteCity(id);
      loadData();
    }
  };

  // --- LÓGICA DE FILTRADO ---
  // Filtramos los laboratorios para mostrar solo los que pertenecen a la provincia seleccionada en el form
  const filteredLabs = laboratorios.filter(
    (l) => l.provinceId === Number(formData.provinceId),
  );

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen pt-24">
      <AdminMenu />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Ciudades</h2>
        <button
          onClick={() => {
            setFormData(initialForm);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded flex gap-2 transition-colors"
        >
          <Plus size={18} /> Nueva Ciudad
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-700 text-gray-300 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">Ciudad</th>
              <th className="p-4">Provincia</th>
              <th className="p-4">Laboratorio Asignado</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {cities.map((city) => (
              <tr
                key={city.id}
                className="hover:bg-gray-700/50 transition-colors"
              >
                <td className="p-4">
                  <div className="font-medium text-lg">{city.name}</div>
                  <div className="text-xs text-gray-500">
                    CP: {city.zipCode}
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-sm border border-blue-500/10">
                    {city.province?.name}
                  </span>
                </td>
                <td className="p-4">
                  {city.laboratorio ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-green-300 text-sm font-medium">
                        {city.laboratorio.name}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-gray-500 text-sm italic">
                        Sin asignar
                      </span>
                    </div>
                  )}
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setFormData({
                        id: city.id,
                        name: city.name,
                        zipCode: city.zipCode,
                        provinceId: city.provinceId,
                        // Manejo seguro por si viene null
                        laboratorioId: city.laboratorioId || 0,
                      });
                      setIsModalOpen(true);
                    }}
                    className="text-blue-400 p-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(city.id)}
                    className="text-red-400 p-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {cities.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No hay ciudades registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">
              {formData.id ? "Editar" : "Crear"} Ciudad
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">
                  Nombre
                </label>
                <input
                  className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Nombre"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">
                  Código Postal
                </label>
                <input
                  className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="CP"
                  value={formData.zipCode}
                  onChange={(e) =>
                    setFormData({ ...formData, zipCode: e.target.value })
                  }
                  required
                />
              </div>

              {/* SELECT PROVINCIA */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">
                  Provincia
                </label>
                <select
                  className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  value={formData.provinceId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      provinceId: Number(e.target.value),
                      laboratorioId: 0,
                    })
                  }
                  required
                >
                  <option value={0}>Seleccionar Provincia</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* SELECT LABORATORIO (Filtrado por Provincia) */}
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">
                  Laboratorio Asignado
                </label>
                <select
                  className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 disabled:opacity-50 focus:border-blue-500 focus:outline-none"
                  value={formData.laboratorioId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      laboratorioId: Number(e.target.value),
                    })
                  }
                  disabled={!formData.provinceId} // Se deshabilita si no eligió provincia
                >
                  <option value={0}>-- Seleccionar Laboratorio --</option>
                  {filteredLabs.length > 0 ? (
                    filteredLabs.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>
                      No hay laboratorios en esta provincia
                    </option>
                  )}
                </select>
                <p className="text-[10px] text-gray-500 mt-1">
                  * Solo se muestran laboratorios de la provincia seleccionada
                </p>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 p-2 rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-500 p-2 rounded transition-colors font-bold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCities;
