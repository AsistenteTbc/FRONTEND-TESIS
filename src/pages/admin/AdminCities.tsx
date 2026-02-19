import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { adminService } from "../../services/admin.service";
import type { IProvince, ILaboratorio } from "../../types/admin";
import { AdminMenu } from "./AdminMenu";
import { Table } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";

const AdminCities = () => {
  const [cities, setCities] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [laboratorios, setLaboratorios] = useState<ILaboratorio[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      laboratorioId:
        Number(formData.laboratorioId) > 0
          ? Number(formData.laboratorioId)
          : null,
    };

    if (formData.id) await adminService.updateCity(formData.id, payload);
    else await adminService.createCity(payload);

    setIsModalOpen(false);
    setFormData(initialForm);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar ciudad?")) {
      await adminService.deleteCity(id);
      loadData();
    }
  };

  const filteredLabs = laboratorios.filter(
    (l) => l.provinceId === Number(formData.provinceId),
  );

  // --- CONFIGURACIÓN DE COLUMNAS ---
  const columns = [
    {
      header: "Ciudad",
      render: (city: any) => (
        <div>
          <div className="font-medium text-lg">{city.name}</div>
          <div className="text-xs text-gray-500">CP: {city.zipCode}</div>
        </div>
      ),
    },
    {
      header: "Provincia",
      render: (city: any) => (
        <span className="text-blue-400">{city.province?.name}</span>
      ),
    },
    {
      header: "Laboratorio",
      render: (city: any) =>
        city.laboratorio ? (
          <span className="text-green-400 text-sm">
            {city.laboratorio.name}
          </span>
        ) : (
          <span className="text-gray-500 text-sm italic">Sin asignar</span>
        ),
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (city: any) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setFormData({
                ...city,
                provinceId: city.provinceId,
                laboratorioId: city.laboratorioId || 0,
              });
              setIsModalOpen(true);
            }}
            className="text-blue-400 p-2 hover:bg-gray-700 rounded"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(city.id)}
            className="text-red-400 p-2 hover:bg-gray-700 rounded"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen pt-24">
      <div className="px-4 md:px-8 lg:px-12 mb-8">
        <AdminMenu />

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Gestión de Ciudades</h2>
          <button
            onClick={() => {
              setFormData(initialForm);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 px-4 py-2 rounded flex gap-2 hover:bg-blue-500 transition-colors font-semibold w-fit"
          >
            <Plus size={18} /> Nueva Ciudad
          </button>
        </div>
      </div>

      {/* USO DEL COMPONENTE TABLE */}
      <div className="animate-slideUp">
        <Table
          data={cities}
          columns={columns}
          emptyMessage="No hay ciudades cargadas."
        />
      </div>

      {/* USO DEL COMPONENTE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.id ? "Editar Ciudad" : "Crear Ciudad"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:outline-none focus:border-blue-500"
            placeholder="CP"
            value={formData.zipCode}
            onChange={(e) =>
              setFormData({ ...formData, zipCode: e.target.value })
            }
            required
          />

          <select
            className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:outline-none focus:border-blue-500 cursor-pointer"
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

          <select
            className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50"
            value={formData.laboratorioId}
            onChange={(e) =>
              setFormData({
                ...formData,
                laboratorioId: Number(e.target.value),
              })
            }
            disabled={!formData.provinceId}
          >
            <option value={0}>-- Seleccionar Laboratorio --</option>
            {filteredLabs.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="flex-1 backdrop-blur-sm bg-gray-500/20 hover:bg-gray-500/30 border border-gray-500/30 hover:border-gray-500/50 p-2 rounded-xl transition-all font-semibold text-white"
            >
              Cancelar
            </button>
            <button type="submit" className="flex-1 backdrop-blur-sm bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 hover:border-cyan-500/50 p-2 rounded-xl transition-all font-semibold text-white">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCities;
