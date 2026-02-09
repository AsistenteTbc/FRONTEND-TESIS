import { adminApi } from "./api";
import type { IProvince, ICity, ILaboratorio } from "../types/admin";

export const adminService = {
  // PROVINCIAS

  async getProvinces(): Promise<IProvince[]> {
    // Axios automáticamente hace el .json()
    const { data } = await adminApi.get<IProvince[]>("/provinces");
    return data;
  },

  async createProvince(payload: Partial<IProvince>): Promise<IProvince> {
    const { data } = await adminApi.post<IProvince>("/provinces", payload);
    return data;
  },

  async updateProvince(
    id: number,
    payload: Partial<IProvince>,
  ): Promise<IProvince> {
    const { data } = await adminApi.put<IProvince>(`/provinces/${id}`, payload);
    return data;
  },

  async deleteProvince(id: number): Promise<void> {
    await adminApi.delete(`/provinces/${id}`);
  },

  // CIUDADES

  async getCities(): Promise<ICity[]> {
    const { data } = await adminApi.get<ICity[]>("/cities");
    return data;
  },

  async createCity(payload: Partial<ICity>): Promise<ICity> {
    const { data } = await adminApi.post<ICity>("/cities", payload);
    return data;
  },

  async updateCity(id: number, payload: Partial<ICity>): Promise<ICity> {
    const { data } = await adminApi.put<ICity>(`/cities/${id}`, payload);
    return data;
  },

  async deleteCity(id: number): Promise<void> {
    await adminApi.delete(`/cities/${id}`);
  },

  // LABORATORIOS

  async getLaboratorios(): Promise<ILaboratorio[]> {
    // Nota: Asegúrate que el endpoint en backend sea /admin/laboratorios (no 'laboratories')
    const { data } = await adminApi.get<ILaboratorio[]>("/laboratorios");
    return data;
  },

  async createLaboratorio(
    payload: Partial<ILaboratorio>,
  ): Promise<ILaboratorio> {
    const { data } = await adminApi.post<ILaboratorio>(
      "/laboratorios",
      payload,
    );
    return data;
  },

  async updateLaboratorio(
    id: number,
    payload: Partial<ILaboratorio>,
  ): Promise<ILaboratorio> {
    const { data } = await adminApi.put<ILaboratorio>(
      `/laboratorios/${id}`,
      payload,
    );
    return data;
  },

  async deleteLaboratorio(id: number): Promise<void> {
    await adminApi.delete(`/laboratorios/${id}`);
  },
};
