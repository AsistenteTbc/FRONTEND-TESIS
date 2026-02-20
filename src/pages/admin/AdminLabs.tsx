import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, MapPin, X, Save } from "lucide-react";
import { adminService } from "../../services/admin.service";
import type { IProvince, ILaboratorio } from "../../types/admin";
import { AdminMenu } from "./AdminMenu";
import { Table } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import { LocationPicker } from "../../components/admin/LocationPicker";
import { Button } from "../../components/ui/Button"; // <--- Importamos tu componente

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
    latitude: 0,
    longitude: 0,
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

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev: any) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.provinceId) return alert("Selecciona una provincia");

    const payload = {
      ...formData,
      provinceId: Number(formData.provinceId),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
    };

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

  const columns = [
    {
      header: "Nombre",
      accessorKey: "name" as keyof ILaboratorio,
      className: "text-gray-300 flex items-center gap-1",
    },
    {
      header: "Ubicación y Contacto",
      render: (lab: ILaboratorio) => (
        <div>
          <div className="text-gray-300 flex items-center gap-1">
            <MapPin size={14} className="text-blue-400" /> {lab.address}
          </div>
          <div className="text-xs text-gray-500 ml-5">
            {lab.phone || "S/T"} • {lab.horario || "S/H"}
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
          {/* BOTÓN EDITAR: Manteniendo tu estilo preferido (Oscuro + Celeste) */}
          <button
            onClick={() => {
              setFormData({
                ...lab,
                provinceId: lab.provinceId,
                latitude: Number(lab.latitude || 0),
                longitude: Number(lab.longitude || 0),
              });
              setIsModalOpen(true);
            }}
            className="text-blue-400 p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <Edit size={18} />
          </button>
          {/* BOTÓN ELIMINAR (DANGER de tu UI) */}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(lab.id)}
            icon={<Trash2 size={18} />}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen pt-24 text-white">
      <div className="px-4 md:px-8 lg:px-12 mb-8">
        <AdminMenu />

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Gestión de Laboratorios</h2>
          {/* BOTÓN NUEVO (SUCCESS de tu UI) */}
          <Button
            variant="success"
            onClick={() => {
              setFormData(initialForm);
              setIsModalOpen(true);
            }}
            icon={<Plus size={18} />}
          >
            Nuevo Laboratorio
          </Button>
        </div>
      </div>

      <div className="animate-slideUp">
        <Table
          data={labs}
          columns={columns}
          emptyMessage="No hay laboratorios registrados."
        />
      </div>

      <Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title={formData.id ? "Editar Laboratorio" : "Crear Laboratorio"}
>
  {/* Reducimos gap-4 a gap-2 para pegar los elementos */}
  <form onSubmit={handleSubmit} className="flex flex-col gap-2">
    <input
      className="w-full bg-gray-900/50 p-2.5 rounded-xl text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-all text-sm"
      placeholder="Nombre"
      value={formData.name}
      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      required
    />

    <div>
      <input
        className="w-full bg-gray-900/50 p-2.5 rounded-xl text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-all text-sm"
        placeholder="Dirección (Ej: Av. Santa Fe 1234, Ciudad)"
        value={formData.address}
        onChange={(e) =>
          setFormData({ ...formData, address: e.target.value })
        }
        required
      />
    </div>

    {/* Mapa más compacto */}
    <div className="border border-gray-700 rounded-xl p-2 bg-gray-900/30 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
          Ubicación Exacta
        </span>
        <div className="flex gap-1.5">
          <input
            type="number"
            step="any"
            className="bg-gray-800 text-white text-[10px] p-1 rounded-lg border border-gray-700 w-16 outline-none"
            value={formData.latitude || ""}
            onChange={(e) => handleLocationChange(Number(e.target.value), formData.longitude)}
            placeholder="Lat"
          />
          <input
            type="number"
            step="any"
            className="bg-gray-800 text-white text-[10px] p-1 rounded-lg border border-gray-700 w-16 outline-none"
            value={formData.longitude || ""}
            onChange={(e) => handleLocationChange(formData.latitude, Number(e.target.value))}
            placeholder="Lng"
          />
        </div>
      </div>

      <div className="h-32 rounded-lg overflow-hidden border border-gray-700">
        <LocationPicker
          onLocationChange={handleLocationChange}
          initialLat={formData.latitude}
          initialLng={formData.longitude}
        />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-2">
      <input
        className="w-full bg-gray-900/50 p-2.5 rounded-xl text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
        placeholder="Teléfono"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
      />
      <input
        className="w-full bg-gray-900/50 p-2.5 rounded-xl text-white border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
        placeholder="Horario"
        value={formData.horario}
        onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
      />
    </div>

    <select
      className="w-full bg-gray-900/50 p-2.5 rounded-xl text-white border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer text-sm appearance-none"
      value={formData.provinceId}
      onChange={(e) => setFormData({ ...formData, provinceId: Number(e.target.value) })}
      required
    >
      <option value={0}>Seleccionar Provincia</option>
      {provinces.map((p) => (
        <option key={p.id} value={p.id}>{p.name}</option>
      ))}
    </select>

    <div className="flex gap-2 mt-2">
      <Button
        type="button"
        variant="danger"
        size="sm"
        fullWidth
        onClick={() => setIsModalOpen(false)}
        icon={<X size={16} />}
      >
        Cancelar
      </Button>
      <Button
        type="submit"
        variant="success"
        size="sm"
        fullWidth
        icon={<Save size={16} />}
      >
        Guardar
      </Button>
    </div>
  </form>
</Modal>
    </div>
  );
};

export default AdminLabs;