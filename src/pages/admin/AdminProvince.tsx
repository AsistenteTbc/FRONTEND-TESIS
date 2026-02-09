import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import type { IProvince } from "../../types/admin";
import { adminService } from "../../services/admin.service";
import { AdminMenu } from "./AdminMenu";
import { Table } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";

const AdminProvinces = () => {
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<IProvince>>({ name: "" });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.id) await adminService.updateProvince(formData.id, formData);
    else await adminService.createProvince(formData);

    setIsModalOpen(false);
    setFormData({ name: "" });
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar provincia?")) {
      await adminService.deleteProvince(id);
      loadData();
    }
  };

  // --- DEFINICIÓN DE COLUMNAS ---
  const columns = [
    {
      header: "ID",
      accessorKey: "id" as keyof IProvince,
      className: "w-24 text-gray-500 font-mono",
    },
    {
      header: "Nombre",
      accessorKey: "name" as keyof IProvince,
      className: "font-medium text-lg",
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (prov: IProvince) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setFormData(prov);
              setIsModalOpen(true);
            }}
            className="text-blue-400 p-2 hover:bg-gray-700 rounded"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(prov.id)}
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
        <h2 className="text-2xl font-bold">Gestión de Provincias</h2>
        <button
          onClick={() => {
            setFormData({ name: "" });
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded flex gap-2 transition-colors"
        >
          <Plus size={18} /> Nueva Provincia
        </button>
      </div>

      {/* TABLA REUTILIZABLE */}
      <div className="max-w-3xl">
        <Table
          data={provinces}
          columns={columns}
          emptyMessage="No hay provincias registradas."
        />
      </div>

      {/* MODAL REUTILIZABLE */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.id ? "Editar Provincia" : "Crear Provincia"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-gray-400 uppercase font-bold">
              Nombre
            </label>
            <input
              className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:outline-none focus:border-blue-500"
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
              className="flex-1 bg-gray-600 p-2 rounded hover:bg-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 p-2 rounded hover:bg-blue-500 font-bold"
            >
              Guardar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminProvinces;
