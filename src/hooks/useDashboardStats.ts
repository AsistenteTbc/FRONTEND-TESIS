import { useState, useEffect, useCallback } from "react";
import { statsService } from "../services/stats.service";
import { locationsService } from "../services/locations.service"; // <--- Usamos locations
import type { DashboardFilters, DashboardStats } from "../types/stats";

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [provincesList, setProvincesList] = useState<any[]>([]);

  const [filters, setFilters] = useState<DashboardFilters>({
    province: "TODAS",
    from: "",
    to: "",
  });

  // 1. Cargar lista de provincias (Usando locationsService)
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await locationsService.getProvinces();
        setProvincesList(data);
      } catch (error) {
        console.error("Error cargando provincias:", error);
      }
    };
    fetchProvinces();
  }, []);

  // 2. Cargar estadísticas
  // Usamos useCallback para evitar ciclos infinitos si se agrega como dependencia en otros lados
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await statsService.getDashboardStats(filters);
      setStats(data);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Ejecutar cuando cambian los filtros
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

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
    refresh: fetchStats, // Útil si quieres agregar un botón de "Actualizar" manual
  };
};
