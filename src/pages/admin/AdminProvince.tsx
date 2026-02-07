import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { adminService, type IProvince } from "../../services/admin.service";
import { AdminMenu } from "./AdminMenu";

const AdminProvinces = () => {
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<IProvince>>({ name: "" });

  // Cargar datos
  const loadData = async () => {
    try {
      const data = await adminService.getProvinces();
      setProvinces(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Guardar (Crear o Editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await adminService.updateProvince(formData.id, formData);
      } else {
        await adminService.createProvince(formData);
      }
      setIsModalOpen(false);
      setFormData({ name: "" });
      loadData();
    } catch (error) {
      alert("Error al guardar provincia");
    }
  };

  // Eliminar (Soft Delete)
  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar esta provincia?")) {
      await adminService.deleteProvince(id);
      loadData();
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen pt-24">
      {/* 1. Insertamos el Menú aquí */}
      <AdminMenu />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Provincias</h2>
        <button
          onClick={() => {
            setFormData({ name: "" });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-500 transition-colors px-4 py-2 rounded flex gap-2"
        >
          <Plus size={18} /> Nueva Provincia
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-xl max-w-3xl">
        <table className="w-full text-left">
          <thead className="bg-gray-700 text-gray-300 uppercase text-xs font-bold">
            <tr>
              <th className="p-4 w-20">ID</th>
              <th className="p-4">Nombre</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {provinces.map((prov) => (
              <tr
                key={prov.id}
                className="hover:bg-gray-700/50 transition-colors"
              >
                <td className="p-4 text-gray-500 font-mono text-sm">
                  {prov.id}
                </td>
                <td className="p-4 font-medium text-lg">{prov.name}</td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button
                    onClick={() => {
                      setFormData(prov);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-400 p-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(prov.id)}
                    className="text-red-400 p-2 hover:bg-gray-700 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {provinces.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No hay provincias registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md border border-gray-700 shadow-2xl animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">
              {formData.id ? "Editar" : "Crear"} Provincia
            </h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-gray-400 uppercase font-bold">
                  Nombre
                </label>
                <input
                  className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none"
                  placeholder="Ej: Córdoba"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="flex gap-3 mt-4">
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

export default AdminProvinces;
