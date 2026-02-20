import { useState, useEffect, useCallback } from "react";
import { statsService } from "../services/stats.service";
import { locationsService } from "../services/locations.service";
import type { DashboardFilters, DashboardStats } from "../types/stats";

export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [provincesList, setProvincesList] = useState<any[]>([]);

  const [filters, setFilters] = useState<DashboardFilters>({
    province: "TODAS", // Aquí guardamos el NOMBRE para que el Select funcione
    from: "",
    to: "",
  });

  // 1. Cargar lista de provincias al montar el componente
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

  // 2. Cargar estadísticas convirtiendo el nombre a ID para el Backend
  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      let provinceParam = filters.province;

      // Si hay una provincia seleccionada, buscamos su ID real
      if (filters.province !== "TODAS") {
        const found = provincesList.find((p) => p.name === filters.province);
        if (found) {
          provinceParam = String(found.id);
        }
      }

      // Llamamos al servicio pasando el ID (o "TODAS")
      const data = await statsService.getDashboardStats({
        ...filters,
        province: provinceParam,
      });
      
      setStats(data);
    } catch (error) {
      console.error("Error cargando estadísticas:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, provincesList]);

  // Ejecutar fetch cuando cambian los filtros o se carga la lista de provincias
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const updateFilter = (key: keyof DashboardFilters, value: string) => {
    // Validación de fechas
    if (key === "from" && filters.to && value > filters.to) {
      console.warn("La fecha 'desde' no puede ser posterior a 'hasta'");
      return;
    }
    if (key === "to" && filters.from && value < filters.from) {
      console.warn("La fecha 'hasta' no puede ser anterior a 'desde'");
      return;
    }

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
    refresh: fetchStats,
  };
};