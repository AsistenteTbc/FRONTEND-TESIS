export interface DashboardFilters {
  province: string;
  from: string;
  to: string;
}

export interface DashboardStats {
  // Datos existentes
  byProvince: { name: string; value: number }[];
  bySeverity: { name: string; value: number }[];
  byCity: { province: string; city: string; value: number }[];
  byTrend: { date: string; value: number }[]; // date es string 'YYYY-MM-DD'

  // 👇 NUEVOS DATOS (Agregados hoy)
  byDiagnosis: { name: string; value: number }[]; // Pulmonar vs Extra
  byWeight: { name: string; value: number }[]; // Rangos de peso
  byRisk: { name: string; value: number }[]; // Grupo de riesgo vs General
}
