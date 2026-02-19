import React, { useEffect } from 'react'; // <--- Importar useEffect
import { Navbar } from './Navbar';
import { useLocation } from 'react-router-dom';
import { useWizardContext } from '../../context/WizardContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { isResultStep } = useWizardContext();

  // 1. Lógica para cambiar el título de la pestaña
  useEffect(() => {
    const routeTitles: { [key: string]: string } = {
      '/': 'Inicio',
      '/tuberculosis': 'Tuberculosis',
      '/dashboard': 'Estadísticas',
      '/login': 'Login',
    };

    // Verificación especial para rutas de Admin que empiezan con /admin
    let currentTitle = routeTitles[location.pathname] || 'TBC Portal';
    
    if (location.pathname.startsWith('/admin')) {
      currentTitle = 'Admin';
    }

    document.title = `${currentTitle} | Sistema de Salud`;
  }, [location]);

  // Definimos si es la página de estadísticas
  const isDashboard = location.pathname === '/dashboard';
  const isLogin = location.pathname === '/login';
  const isTuberculosis = location.pathname === '/tuberculosis';
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col font-sans text-white relative">
      {/* Background Pattern - Fixed */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-blue-900/20"></div>
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(59, 130, 246, 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <Navbar />

      {/* Main Content Dinámico */}
      <main className={`
        flex-grow flex relative z-10 px-4 pt-24 pb-8
        ${isDashboard || isTuberculosis || isResultStep || isAdmin ? 'items-start justify-start' : 'items-center justify-center'}
      `}>
        <div className={`
          w-full transition-all duration-300
          ${isDashboard || isTuberculosis || isResultStep || isAdmin ? 'max-w-full px-2 md:px-6' : 'max-w-4xl'}
          ${isLogin ? 'max-w-md' : ''}
        `}>
          {children}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-gray-800/50 bg-gray-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span className="text-blue-400">🩺</span>
              <span>&copy; {new Date().getFullYear()} Sistema de Gestión de Salud</span>
            </div>
            <div className="flex items-center gap-6 text-gray-500 text-xs">
              <a href="#" className="hover:text-blue-400 transition-colors duration-200">Ayuda</a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-200">Privacidad</a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-200">Términos</a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-200">Contacto</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};