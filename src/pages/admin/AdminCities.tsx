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
    <div className="p-6 bg-gray-900 text-white min-h-screen pt-24">
      <AdminMenu />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Ciudades</h2>
        <button
          onClick={() => {
            setFormData(initialForm);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 px-4 py-2 rounded flex gap-2 hover:bg-blue-500 transition-colors"
        >
          <Plus size={18} /> Nueva Ciudad
        </button>
      </div>

      {/* USO DEL COMPONENTE TABLE */}
      <Table
        data={cities}
        columns={columns}
        emptyMessage="No hay ciudades cargadas."
      />

      {/* USO DEL COMPONENTE MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.id ? "Editar Ciudad" : "Crear Ciudad"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            className="input-std"
            placeholder="Nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            className="input-std"
            placeholder="CP"
            value={formData.zipCode}
            onChange={(e) =>
              setFormData({ ...formData, zipCode: e.target.value })
            }
            required
          />

          <select
            className="input-std"
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
            className="input-std"
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
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCities;
