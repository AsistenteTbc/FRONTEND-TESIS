import React, { useEffect, useState } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import { adminService, type ILaboratorio, type IProvince } from '../../services/admin.service';
import { AdminMenu } from './AdminMenu';

const AdminLabs = () => {
  const [labs, setLabs] = useState<ILaboratorio[]>([]);
  const [provinces, setProvinces] = useState<IProvince[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Estado inicial
  const initialForm = { name: '', address: '', phone: '', horario: '', provinceId: 0 };
  const [formData, setFormData] = useState<any>(initialForm);

  // Cargar datos al inicio
  const loadData = async () => {
    try {
      const [l, p] = await Promise.all([
        adminService.getLaboratorios(), 
        adminService.getProvinces()
      ]);
      setLabs(l);
      setProvinces(p);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => { loadData(); }, []);

  // Guardar (Crear o Editar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar provincia
    if (!formData.provinceId || formData.provinceId === 0) {
        alert("Debes seleccionar una provincia");
        return;
    }

    const payload = { ...formData, provinceId: Number(formData.provinceId) };
    
    try {
        if (formData.id) await adminService.updateLaboratorio(formData.id, payload);
        else await adminService.createLaboratorio(payload);
        
        setIsModalOpen(false);
        setFormData(initialForm);
        loadData();
    } catch (error) {
        alert("Error al guardar laboratorio");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de eliminar este laboratorio?')) {
      await adminService.deleteLaboratorio(id);
      loadData();
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen pt-24">
      <AdminMenu /> 
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Laboratorios</h2>
        <button onClick={() => { setFormData(initialForm); setIsModalOpen(true); }} className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded flex gap-2 transition-colors">
          <Plus size={18} /> Nuevo Laboratorio
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden border border-gray-700 shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-gray-700 text-gray-300 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">Nombre</th>
              <th className="p-4">Dirección / Contacto</th>
              <th className="p-4">Provincia</th>
              <th className="p-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {labs.map((lab) => (
              <tr key={lab.id} className="hover:bg-gray-700/50 transition-colors">
                <td className="p-4 font-medium text-lg">{lab.name}</td>
                <td className="p-4">
                    <div className="text-gray-300">{lab.address}</div>
                    <div className="text-xs text-gray-500">{lab.phone} • {lab.horario}</div>
                </td>
                <td className="p-4">
                    <span className="bg-blue-900/40 text-blue-300 px-2 py-1 rounded text-sm border border-blue-500/20">
                        {lab.province?.name || 'Sin Provincia'}
                    </span>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button onClick={() => { setFormData({
                      id: lab.id, 
                      name: lab.name, 
                      address: lab.address, 
                      phone: lab.phone, 
                      horario: lab.horario, 
                      provinceId: lab.provinceId 
                  }); setIsModalOpen(true); }} className="text-blue-400 p-2 hover:bg-gray-700 rounded transition-colors"><Edit size={18}/></button>
                  <button onClick={() => handleDelete(lab.id)} className="text-red-400 p-2 hover:bg-gray-700 rounded transition-colors"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {labs.length === 0 && (
                <tr>
                    <td colSpan={4} className="p-8 text-center text-gray-500">No hay laboratorios registrados.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-lg border border-gray-700 shadow-2xl animate-fadeIn">
            <h3 className="text-xl font-bold mb-4 text-white border-b border-gray-700 pb-2">{formData.id ? 'Editar' : 'Crear'} Laboratorio</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              <div>
                  <label className="text-xs text-gray-400 uppercase font-bold">Nombre</label>
                  <input className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none" placeholder="Ej: Hospital Lucio Molas" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>

              <div>
                  <label className="text-xs text-gray-400 uppercase font-bold">Dirección</label>
                  <input className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none" placeholder="Calle Falsa 123" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">Teléfono</label>
                    <input className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none" placeholder="02302..." value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold">Horario</label>
                    <input className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none" placeholder="08:00 - 13:00" value={formData.horario} onChange={e => setFormData({ ...formData, horario: e.target.value })} />
                </div>
              </div>
              
              <div>
                  <label className="text-xs text-gray-400 uppercase font-bold">Provincia</label>
                  <select className="w-full bg-gray-700 p-2 rounded text-white border border-gray-600 focus:border-blue-500 focus:outline-none" value={formData.provinceId} onChange={e => setFormData({ ...formData, provinceId: Number(e.target.value) })} required>
                    <option value={0}>Seleccionar Provincia</option>
                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
              </div>

              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 p-2 rounded transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-500 p-2 rounded transition-colors font-bold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLabs;