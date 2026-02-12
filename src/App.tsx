import "./App.css";
import { Routes, Route, Outlet } from "react-router-dom";

// Contextos y Guardias
import { AuthProvider } from "./context/AuthContext";

// Componentes UI
import { Layout } from "./components/layout/Layout";

// Páginas Públicas
import WizardPage from "./pages/WizardPage";
import TuberculosisInfo from "./pages/TuberculosisInfo";
import Login from "./pages/admin/Login"; // Asegúrate de que la ruta sea correcta (ej: ../pages/TuberculosisLogin o Login)

// Páginas Privadas (Admin/Dashboard)
import Dashboard from "./pages/DashboardPage";
import { AdminMenu } from "./pages/admin/AdminMenu";
import AdminCities from "./pages/admin/AdminCities";
import AdminLabs from "./pages/admin/AdminLabs";
import AdminProvinces from "./pages/admin/AdminProvince";
import { ProtectedRoute } from "./auth/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      {" "}
      {/* 1. Todo envuelto en el AuthProvider */}
      <Routes>
        {/* --- RUTA LOGIN (Sin Layout) --- */}
        {/* Lo dejamos fuera para que ocupe toda la pantalla */}

        {/* --- RUTAS CON LAYOUT (Navbar/Sidebar) --- */}
        {/* Creamos un wrapper para que el Layout envuelva a todas estas rutas */}
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path="/login" element={<Login />} />
          {/* A. Rutas Públicas (Cualquiera puede verlas) */}
          <Route path="/" element={<WizardPage />} />
          <Route path="/tuberculosis" element={<TuberculosisInfo />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* B. Rutas Protegidas (Solo logueados) */}
          {/* Si no estás logueado, ProtectedRoute te manda al Login */}
          <Route element={<ProtectedRoute />}>
            {/* Rutas de Admin */}
            <Route path="/admin" element={<AdminMenu />} />
            <Route path="/admin/cities" element={<AdminCities />} />
            <Route path="/admin/laboratorios" element={<AdminLabs />} />
            <Route path="/admin/provinces" element={<AdminProvinces />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
