import "./App.css";
import { Layout } from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";
import TuberculosisInfo from "./pages/TuberculosisInfo";
import Dashboard from "./pages/DashboardPage";
import AdminCities from "./pages/admin/AdminCities";
import AdminLabs from "./pages/admin/AdminLabs";
import AdminProvinces from "./pages/admin/AdminProvince";
import { AdminMenu } from "./pages/admin/AdminMenu";
import WizardPage from "./pages/WizardPage";
import Login from "./pages/admin/Login";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<WizardPage />} />
          <Route path="/tuberculosis" element={<TuberculosisInfo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminMenu />}></Route>
          <Route path="/admin/cities" element={<AdminCities />} />
          <Route path="/admin/laboratorios" element={<AdminLabs />} />
          <Route path="/admin/provinces" element={<AdminProvinces />} />
          <Route path="/login" element={<Login></Login>}></Route>
        </Routes>
      </Layout>
    </>
  );
}

export default App;
