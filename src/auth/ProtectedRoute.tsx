import { Navigate, Outlet } from "react-router-dom";

// Asegúrate de tener este componente o usa un <div>Cargando...</div>
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Si estamos verificando el token, mostramos spinner
  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  // 2. Si NO está autenticado, redirigir al Login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 3. Si está autenticado, dejar pasar (renderizar hijos)
  return <Outlet />;
};
