import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus } from "lucide-react";
import { adminService } from "../../services/admin.service";
import type { IProvince, ILaboratorio } from "../../types/admin";
import { AdminMenu } from "./AdminMenu";
import { Table } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";

const AdminLabs = () => {
  const [labs, setLabs] = useState<ILaboratorio[]>([]);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    name: "",
    address: "",
    phone: "",
    horario: "",
    provinceId: 0,
  };
  const [formData, setFormData] = useState<any>(initialForm);

  const loadData = async () => {
    try {
      const [l, p] = await Promise.all([
        adminService.getLaboratorios(),
        adminService.getProvinces(),
      ]);
      setLabs(l);
      setProvinces(p);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.provinceId) return alert("Selecciona una provincia");

    const payload = { ...formData, provinceId: Number(formData.provinceId) };

    if (formData.id) await adminService.updateLaboratorio(formData.id, payload);
    else await adminService.createLaboratorio(payload);

    setIsModalOpen(false);
    setFormData(initialForm);
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar laboratorio?")) {
      await adminService.deleteLaboratorio(id);
      loadData();
    }
  };

  // --- COLUMNAS ---
  const columns = [
    {
      header: "Nombre",
      accessorKey: "name" as keyof ILaboratorio,
      className: "font-medium text-lg",
    },
    {
      header: "Contacto",
      render: (lab: ILaboratorio) => (
        <div>
          <div className="text-gray-300">{lab.address}</div>
          <div className="text-xs text-gray-500">
            {lab.phone} • {lab.horario}
          </div>
        </div>
      ),
    },
    {
      header: "Provincia",
      render: (lab: ILaboratorio) => (
        <span className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded text-sm border border-blue-500/20">
          {lab.province?.name || "Sin Asignar"}
        </span>
      ),
    },
    {
      header: "Acciones",
      className: "text-right",
      render: (lab: ILaboratorio) => (
        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              setFormData({ ...lab, provinceId: lab.provinceId });
              setIsModalOpen(true);
            }}
            className="text-blue-400 p-2 hover:bg-gray-700 rounded"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => handleDelete(lab.id)}
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
        <h2 className="text-2xl font-bold">Gestión de Laboratorios</h2>
        <button
          onClick={() => {
            setFormData(initialForm);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded flex gap-2 transition-colors"
        >
          <Plus size={18} /> Nuevo Laboratorio
        </button>
      </div>

      <Table
        data={labs}
        columns={columns}
        emptyMessage="No hay laboratorios registrados."
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.id ? "Editar Laboratorio" : "Crear Laboratorio"}
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
            placeholder="Dirección"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              className="input-std"
              placeholder="Teléfono"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <input
              className="input-std"
              placeholder="Horario"
              value={formData.horario}
              onChange={(e) =>
                setFormData({ ...formData, horario: e.target.value })
              }
            />
          </div>

          <select
            className="input-std"
            value={formData.provinceId}
            onChange={(e) =>
              setFormData({ ...formData, provinceId: Number(e.target.value) })
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

      {/* Un pequeño estilo inline o global para limpiar el JSX de inputs repetitivos */}
      <style>{`
        .input-std { width: 100%; background-color: #374151; padding: 0.5rem; border-radius: 0.25rem; border: 1px solid #4b5563; color: white; outline: none; }
        .input-std:focus { border-color: #3b82f6; }
        .btn-primary { flex: 1; background-color: #2563eb; padding: 0.5rem; border-radius: 0.25rem; font-weight: bold; }
        .btn-primary:hover { background-color: #1d4ed8; }
        .btn-secondary { flex: 1; background-color: #4b5563; padding: 0.5rem; border-radius: 0.25rem; }
        .btn-secondary:hover { background-color: #374151; }
      `}</style>
    </div>
  );
};

export default AdminLabs;
