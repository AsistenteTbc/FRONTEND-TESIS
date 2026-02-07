import "./App.css";
import { Layout } from "./components/layout/Layout";
import { Routes, Route } from "react-router-dom";
import WizardContainer from "./pages/WizardContainer";
import TuberculosisInfo from "./pages/TuberculosisInfo";
import Dashboard from "./pages/Dashboard";
import AdminCities from "./pages/admin/AdminCities";
import AdminLabs from "./pages/admin/AdminLabs";
import AdminProvinces from "./pages/admin/AdminProvince";
import { AdminMenu } from "./pages/admin/AdminMenu";

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<WizardContainer />} />
          <Route path="/tuberculosis" element={<TuberculosisInfo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminMenu />}></Route>
          <Route path="/admin/cities" element={<AdminCities />} />
          <Route path="/admin/laboratorios" element={<AdminLabs />} />
          <Route path="/admin/provinces" element={<AdminProvinces />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
