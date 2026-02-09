import { locationsApi } from "./api";
import type { IProvince, ICity, ILaboratory } from "../types/wizard";

export const locationsService = {
  getProvinces: async (): Promise<IProvince[]> => {
    const response = await locationsApi.get<IProvince[]>("/provinces");
    return response.data;
  },

  getCities: async (provinceId: number): Promise<ICity[]> => {
    const response = await locationsApi.get<ICity[]>(
      `/provinces/${provinceId}/cities`,
    );
    return response.data;
  },

  async getLaboratory(cityId: number) {
    const { data } = await locationsApi.get<ILaboratory>(
      `/laboratorios/${cityId}`,
    );
    return data;
  },
};
