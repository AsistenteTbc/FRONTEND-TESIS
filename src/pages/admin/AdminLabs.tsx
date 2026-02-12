import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, MapPin } from "lucide-react";
import { adminService } from "../../services/admin.service";
import type { IProvince, ILaboratorio } from "../../types/admin";
import { AdminMenu } from "./AdminMenu";
import { Table } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import { LocationPicker } from "../../components/admin/LocationPicker";

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

  // Manejador centralizado para coordenadas (viene del mapa o de los inputs)
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

  // --- COLUMNAS ---
  const columns = [
    {
      header: "Nombre",
      accessorKey: "name" as keyof ILaboratorio,
      className: "font-medium text-lg",
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

          {/* DIRECCIÓN (TEXTO) */}
          <div>
            <label className="text-xs text-gray-400 ml-1">Dirección</label>
            <input
              className="input-std"
              placeholder="Ej: Av. Santa Fe 1234, Ciudad"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
            <p className="text-[10px] text-gray-500 mt-1 ml-1">
              * Ingresa la dirección y luego marca el punto exacto en el mapa.
            </p>
          </div>

          {/* 👇 MAPA + INPUTS MANUALES */}
          <div className="border border-gray-600 rounded p-2 bg-gray-800">
            <div className="flex justify-between items-end mb-2 gap-4">
              <span className="text-xs font-bold text-blue-400 mb-2">
                Ubicación Exacta
              </span>

              {/* Inputs Editables de Latitud y Longitud */}
              <div className="flex gap-2">
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-400">Latitud</label>
                  <input
                    type="number"
                    step="any" // Importante para permitir decimales largos
                    className="bg-gray-700 text-white text-xs p-1 rounded border border-gray-600 w-24 focus:border-blue-500 outline-none"
                    value={formData.latitude || ""}
                    onChange={(e) =>
                      handleLocationChange(
                        Number(e.target.value),
                        formData.longitude,
                      )
                    }
                  />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] text-gray-400">Longitud</label>
                  <input
                    type="number"
                    step="any"
                    className="bg-gray-700 text-white text-xs p-1 rounded border border-gray-600 w-24 focus:border-blue-500 outline-none"
                    value={formData.longitude || ""}
                    onChange={(e) =>
                      handleLocationChange(
                        formData.latitude,
                        Number(e.target.value),
                      )
                    }
                  />
                </div>
              </div>
            </div>

            <LocationPicker
              onLocationChange={handleLocationChange}
              initialLat={formData.latitude}
              initialLng={formData.longitude}
            />
          </div>

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
