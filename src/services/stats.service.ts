import axios from "axios";
import type { DashboardFilters, DashboardStats } from "../types/stats"; // <--- Importar tipos

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const statsApi = axios.create({
  baseURL: `${BASE_URL}/stats`,
});

export const statsService = {
  // Ahora especificamos que devuelve Promise<DashboardStats>
  async getDashboardStats(filters: DashboardFilters): Promise<DashboardStats> {
    const params: Record<string, string> = {};

    if (filters.province && filters.province !== "TODAS") {
      params.province = filters.province;
    }
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;

    const { data } = await statsApi.get("/dashboard", { params });
    return data;
  },

  async logConsultation(data: any) {
    await statsApi.post("/log", data);
  },
};
