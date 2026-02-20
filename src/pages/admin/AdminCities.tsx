import React, { useEffect, useState } from "react";
import { Edit, Trash2, Plus, X, Save } from "lucide-react";
import { adminService } from "../../services/admin.service";
import type { IProvince, ILaboratorio } from "../../types/admin";
import { AdminMenu } from "./AdminMenu";
import { Table } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import { Button } from "../../components/ui/Button"; // <--- Importamos tu componente

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

  const columns = [
    {
      header: "Ciudad",
      render: (city: any) => (
        <div>
          <div className="font-medium text-lg text-white">{city.name}</div>
          <div className="text-xs text-gray-500 font-mono">CP: {city.zipCode}</div>
        </div>
      ),
    },
    {
      header: "Provincia",
      render: (city: any) => (
        <span className="text-blue-400 font-medium">{city.province?.name}</span>
      ),
    },
    {
      header: "Laboratorio",
      render: (city: any) =>
        city.laboratorio ? (
          <span className="text-green-400 text-sm bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
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
          {/* BOTÓN EDITAR: Estilo clásico preferido */}
          <button
            onClick={() => {
              setFormData({
                ...city,
                provinceId: city.provinceId,
                laboratorioId: city.laboratorioId || 0,
              });
              setIsModalOpen(true);
            }}
            className="text-blue-400 p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <Edit size={18} />
          </button>
          {/* BOTÓN ELIMINAR (DANGER) */}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(city.id)}
            icon={<Trash2 size={18} />}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen pt-24 text-white font-sans">
      <div className="px-4 md:px-8 lg:px-12 mb-8">
        <AdminMenu />

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Gestión de Ciudades</h2>
          
          <Button
            variant="success"
            onClick={() => {
              setFormData(initialForm);
              setIsModalOpen(true);
            }}
            icon={<Plus size={18} />}
          >
            Nueva Ciudad
          </Button>
        </div>
      </div>

      <div className="animate-slideUp">
        <Table
          data={cities}
          columns={columns}
          emptyMessage="No hay ciudades cargadas."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.id ? "Editar Ciudad" : "Crear Ciudad"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
          <input
            className="w-full bg-gray-900/50 p-2.5 rounded-xl text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-all text-sm"
            placeholder="Nombre de la ciudad"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            className="w-full bg-gray-900/50 p-2.5 rounded-xl text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-all text-sm"
            placeholder="Código Postal (CP)"
            value={formData.zipCode}
            onChange={(e) =>
              setFormData({ ...formData, zipCode: e.target.value })
            }
            required
          />

          <select
            className="w-full bg-gray-900/50 p-2.5 rounded-xl text-white border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer text-sm appearance-none"
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
            className="w-full bg-gray-900/50 p-2.5 rounded-xl text-white border border-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50 text-sm appearance-none"
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
            <Button
              type="button"
              variant="danger"
              size="sm"
              fullWidth
              onClick={() => setIsModalOpen(false)}
              icon={<X size={18} />}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="success"
              size="sm"
              fullWidth
              icon={<Save size={18} />}
            >
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminCities;