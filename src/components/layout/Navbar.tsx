import React, { useState } from "react";
import {
  Menu,
  X,
  Activity,
  Home,
  BarChart2,
  LogIn, // <--- IMPORTAMOS EL ÍCONO DE ESTADÍSTICAS
} from "lucide-react";
import { href, Link, useLocation } from "react-router-dom";

// Navbar Component
export const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Inicio", icon: Home, href: "/" },
    { name: "Tuberculosis", icon: Activity, href: "/tuberculosis" },
    { name: "Estadísticas", icon: BarChart2, href: "/dashboard" },
    { name: "Admin", icon: Activity, href: "/admin" },
    { name: "Login", icon: LogIn, href: "/login" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-gray-900/95 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Título simplificado */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
              <span className="text-white text-lg">🩺</span>
            </div>
            <h1 className="text-white font-semibold text-md tracking-tight group-hover:text-blue-400 transition-colors duration-300">
              TBC
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 mx-0.5 rounded-lg transition-all duration-200 group relative ${
                    active
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 ${
                      active ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="text-sm font-medium">{item.name}</span>

                  {/* Indicador de ruta activa */}
                  {active && (
                    <div className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-blue-400 rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation simplificado */}
        {isMenuOpen && (
          <div className="md:hidden py-3 border-t border-gray-800/50 bg-gray-900/95 backdrop-blur-lg">
            <div className="flex flex-col gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-200 ${
                      active
                        ? "text-blue-400 bg-blue-500/10 border-l-2 border-blue-400"
                        : "text-gray-400 hover:text-white hover:bg-gray-800/30"
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon
                      className={`w-4 h-4 ${active ? "text-blue-400" : ""}`}
                    />
                    <span className="text-sm font-medium">{item.name}</span>
                    {active && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
