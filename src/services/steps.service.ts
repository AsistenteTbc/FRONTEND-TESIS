import { api } from "./api";
import type { IStep } from "../types/wizard";

export const stepsService = {
  getStepById: async (id: number): Promise<IStep> => {
    const response = await api.get<IStep>(`steps/${id}`);
    return response.data;
  },
};
