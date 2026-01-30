// src/services/api.ts
import axios from 'axios';

// Usamos la variable de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});