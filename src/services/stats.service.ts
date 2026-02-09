import { statsApi } from "./api";
import type { DashboardFilters } from "../types/stats";

export const statsService = {
  async getDashboardStats(filters: DashboardFilters) {
    // 3. Preparamos el objeto de parámetros
    // Axios ignorará automáticamente los que sean undefined,
    // pero como tu lógica usa "TODAS", lo filtramos manual.
    const params: Record<string, string> = {};

    if (filters.province !== "TODAS") params.province = filters.province;
    if (filters.from) params.from = filters.from;
    if (filters.to) params.to = filters.to;

    // 4. Llamada limpia con Axios
    // Axios se encarga de serializar los params (?province=X&from=Y...)
    const { data } = await statsApi.get("/dashboard", { params });

    // 5. Normalización de datos (Conversión a Number para los gráficos)
    return {
      byProvince: data.byProvince.map((i: any) => ({
        ...i,
        value: Number(i.value),
      })),
      bySeverity: data.bySeverity.map((i: any) => ({
        ...i,
        value: Number(i.value),
      })),
      byCity: (data.byCity || []).map((i: any) => ({
        ...i,
        value: Number(i.value),
      })),
      byTrend: (data.byTrend || []).map((i: any) => ({
        ...i,
        value: Number(i.value),
      })),
    };
  },
};
