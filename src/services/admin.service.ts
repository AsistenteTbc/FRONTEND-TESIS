// Definición de Tipos (Interfaces)
// Esto ayuda a que el editor te avise si escribes mal una propiedad

export interface IProvince {
  id: number;
  name: string;
}

export interface ICity {
  id: number;
  name: string;
  zipCode: string;
  provinceId: number; // Para enviar al backend
  province?: IProvince; // Para mostrar en la tabla (viene del backend)
}

export interface ILaboratorio {
  id: number;
  name: string;
  address: string;
  phone: string;
  horario: string;
  provinceId: number;
  province?: IProvince;
}

const API_URL = "http://localhost:3000/admin";

export const adminService = {
  // =================================================================
  // 1. PROVINCIAS
  // =================================================================

  // ASÍ DEBE ESTAR:
  async getProvinces(): Promise<IProvince[]> {
    // Esto llamará a http://localhost:3000/admin/provinces
    const response = await fetch(`${API_URL}/provinces`);
    if (!response.ok) throw new Error("Error al cargar provincias");
    return await response.json();
  },

  async createProvince(data: Partial<IProvince>): Promise<IProvince> {
    const response = await fetch(`${API_URL}/provinces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear provincia");
    return await response.json();
  },

  async updateProvince(
    id: number,
    data: Partial<IProvince>,
  ): Promise<IProvince> {
    const response = await fetch(`${API_URL}/provinces/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar provincia");
    return await response.json();
  },

  async deleteProvince(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/provinces/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar provincia");
  },

  // =================================================================
  // 2. CIUDADES
  // =================================================================

  async getCities(): Promise<ICity[]> {
    // Esto llamará a http://localhost:3000/admin/cities
    const response = await fetch(`${API_URL}/cities`);
    if (!response.ok) throw new Error("Error al cargar ciudades");
    return await response.json();
  },

  async createCity(data: Partial<ICity>): Promise<ICity> {
    const response = await fetch(`${API_URL}/cities`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear ciudad");
    return await response.json();
  },

  async updateCity(id: number, data: Partial<ICity>): Promise<ICity> {
    const response = await fetch(`${API_URL}/cities/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar ciudad");
    return await response.json();
  },

  async deleteCity(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/cities/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar ciudad");
  },

  // =================================================================
  // 3. LABORATORIOS
  // =================================================================

  async getLaboratorios(): Promise<ILaboratorio[]> {
    // Asumo que la ruta en el controller es 'laboratorios' o 'laboratories'.
    // Ajusta esto según lo que pusiste en @Controller('admin') -> @Get('laboratorios')
    const response = await fetch(`${API_URL}/laboratorios`);
    if (!response.ok) throw new Error("Error al cargar laboratorios");
    return await response.json();
  },

  async createLaboratorio(data: Partial<ILaboratorio>): Promise<ILaboratorio> {
    const response = await fetch(`${API_URL}/laboratorios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al crear laboratorio");
    return await response.json();
  },

  async updateLaboratorio(
    id: number,
    data: Partial<ILaboratorio>,
  ): Promise<ILaboratorio> {
    const response = await fetch(`${API_URL}/laboratorios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error("Error al actualizar laboratorio");
    return await response.json();
  },

  async deleteLaboratorio(id: number): Promise<void> {
    const response = await fetch(`${API_URL}/laboratorios/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar laboratorio");
  },
};
