import React, { useState } from "react";
import { AdminMenu } from "./AdminMenu";
import AdminCities from "./AdminCities";
import AdminLabs from "./AdminLabs";
import AdminProvinces from "./AdminProvince";

const AdminHome = () => {
  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);

  // Mapeo de rutas a componentes
  const adminComponents: { [key: string]: React.ReactNode } = {
    "/admin/laboratorios": <AdminLabs />,
    "/admin/cities": <AdminCities />,
    "/admin/provinces": <AdminProvinces />,
  };

  // Si no hay selección, mostrar los 3 botones centrados
  if (!selectedAdmin) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center pt-0 pb-12">
        <div className="animate-fadeIn text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Panel de Administración</h1>
          <p className="text-gray-400 mb-12">Selecciona una opción para gestionar</p>
          <div onClick={(e) => {
            const target = e.target as HTMLAnchorElement;
            const href = target.getAttribute("href");
            if (href) {
              e.preventDefault();
              setSelectedAdmin(href);
            }
          }}>
            <AdminMenu />
          </div>
        </div>
      </div>
    );
  }

  // Si hay selección, mostrar menú arriba (con animación de subida) y el contenido
  return (
    <div className="w-full">
      <div className="animate-menuSlideUp">
        {adminComponents[selectedAdmin]}
      </div>
    </div>
  );
};

export default AdminHome;
