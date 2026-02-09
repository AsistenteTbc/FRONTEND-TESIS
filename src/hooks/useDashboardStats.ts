import { useState, useEffect } from "react";
import { statsService } from "../services/stats.service";
import type { DashboardFilters } from "../types/stats";
import { adminService } from "../services/admin.service";

export const useDashboardStats = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [provincesList, setProvincesList] = useState<any[]>([]);

  const [filters, setFilters] = useState<DashboardFilters>({
    province: "TODAS",
    from: "",
    to: "",
  });

  // Cargar lista de provincias para el select
  useEffect(() => {
    adminService.getProvinces().then(setProvincesList).catch(console.error);
  }, []);

  // Cargar estadísticas cuando cambian los filtros
  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await statsService.getDashboardStats(filters);
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [filters]);

  const updateFilter = (key: keyof DashboardFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ province: "TODAS", from: "", to: "" });
  };

  return {
    stats,
    loading,
    filters,
    provincesList,
    updateFilter,
    clearFilters,
  };
};
