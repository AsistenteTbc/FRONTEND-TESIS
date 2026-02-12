import { authApi } from "./api";

export const authService = {
  async login(email: string, password: string) {
    // Usamos authApi.post('/login').
    // Como authApi ya tiene base '/auth', la ruta final será '/auth/login'
    const response = await authApi.post("/login", { email, password });

    if (response.data.access_token) {
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  },

  isAuthenticated() {
    return !!localStorage.getItem("token");
  },

  // (Opcional) Helper para obtener el usuario actual sin parsearlo cada vez en los componentes
  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  },
};
