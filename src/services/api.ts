import axios from "axios";

// Variable de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Crear instancia de Axios para el módulo Admin
export const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const statsApi = axios.create({
  baseURL: `${API_URL}/stats`,
});

export const locationsApi = axios.create({
  baseURL: `${API_URL}/locations`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const authApi = axios.create({
  baseURL: `${API_URL}/auth`,
  headers: {
    "Content-Type": "application/json",
  },
});
