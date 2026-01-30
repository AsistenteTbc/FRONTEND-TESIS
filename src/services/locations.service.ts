import { api } from './api';
import type { IProvince, ICity, ILaboratory } from '../types/wizard';

export const locationsService = {
  getProvinces: async (): Promise<IProvince[]> => {
    const response = await api.get<IProvince[]>('/steps/provinces');
    return response.data;
  },

  getCities: async (provinceId: number): Promise<ICity[]> => {
    const response = await api.get<ICity[]>(`/steps/provinces/${provinceId}/cities`);
    return response.data;
  },

  getLaboratory: async (cityId: number): Promise<ILaboratory> => {
    const response = await api.get<ILaboratory>(`/steps/laboratorios/${cityId}`);
    return response.data;
  }
};