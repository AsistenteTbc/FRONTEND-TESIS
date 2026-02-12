import React, { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

// Definimos qué forma tiene nuestro contexto
interface AuthContextType {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Al cargar la app, verificamos si hay sesión guardada
  useEffect(() => {
    const checkSession = () => {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  // 2. Función Login (envuelve al servicio)
  const login = async (email: string, pass: string) => {
    try {
      const data = await authService.login(email, pass);
      setUser(data.user); // Actualizamos estado global
    } catch (error) {
      throw error; // Lanzamos el error para que lo maneje el formulario
    }
  };

  // 3. Función Logout
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto fácil
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};
