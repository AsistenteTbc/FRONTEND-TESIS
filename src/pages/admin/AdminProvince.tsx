import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, X, Save } from 'lucide-react';
import type { IProvince } from '../../types/admin';
import { adminService } from '../../services/admin.service';
import { AdminMenu } from './AdminMenu';
import { Table } from '../../components/ui/Table';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button'; // <--- Importante usar este

const AdminProvinces = () => {
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<IProvince>>({ name: '' });

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
    setFormData({ name: '' });
    loadData();
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Eliminar provincia?')) {
      await adminService.deleteProvince(id);
      loadData();
    }
  };

  const columns = [
    {
      header: 'ID',
      accessorKey: 'id' as keyof IProvince,
      className: 'w-24 text-gray-500 font-mono',
    },
    {
      header: 'Nombre',
      accessorKey: 'name' as keyof IProvince,
      className: 'text-gray-300 flex items-center gap-1',
    },
    {
      header: 'Acciones',
      className: 'text-right',

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
          {/* BOTÓN ELIMINAR (DANGER) */}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(prov.id)}
            icon={<Trash2 size={18} />}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full min-h-screen pt-24">
      <div className="px-4 md:px-8 lg:px-12 mb-8">
        <AdminMenu />

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Gestión de Provincias
          </h2>

          {/* NUEVA PROVINCIA (SUCCESS) */}
          <Button
            variant="success"
            onClick={() => {
              setFormData({ name: '' });
              setIsModalOpen(true);
            }}
            icon={<Plus size={18} />}
          >
            Nueva Provincia
          </Button>
        </div>
      </div>

      <div className="animate-slideUp">
        <Table
          data={provinces}
          columns={columns}
          emptyMessage="No hay provincias registradas."
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={formData.id ? 'Editar Provincia' : 'Crear Provincia'}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input
              className="w-full bg-gray-900/50 p-3 rounded-xl text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition-all"
              placeholder="Nombre (Ej: Córdoba)"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
          <div className="flex gap-3 mt-4">
            {/* CANCELAR (DANGER O GHOST) */}
            <Button
              type="button"
              variant="danger"
              fullWidth
              onClick={() => setIsModalOpen(false)}
              icon={<X size={18} />}
            >
              Cancelar
            </Button>
            {/* GUARDAR (SUCCESS) */}
            <Button
              type="submit"
              variant="success"
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

export default AdminProvinces;
