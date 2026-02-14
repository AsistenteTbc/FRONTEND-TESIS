export interface IProvince {
  id: number;
  name: string;
}

export interface ICity {
  id: number;
  name: string;
  zipCode: string;
  provinceId: number;
  laboratorioId: number;
  province?: IProvince;
}

export interface ILaboratory {
  id: number;
  name: string;
  address: string;
  phone: string;
  horario: string;
  provinceId: number;
  province?: IProvince;
  latitude?: number;
  longitude?: number;
}

export interface IOption {
  id: number;
  label: string;
  nextStepId: number;
  value?: string;
}

// La definición de un "Paso" genérico
export interface IStep {
  id: number;
  title: string;
  variant: number;
  content?: string; // Puede ser null
  code: string; // CLAVE: 'STEP_PROVINCE', 'STEP_CITY', etc.
  is_end: boolean;
  is_location?: boolean;
  options?: IOption[]; // Para pasos tipo "pregunta cerrada"
}

// --- Interfaces para el Frontend (Strategy Pattern) ---

// Esta es la "forma" que deben tener TODOS tus componentes de paso
// (StepProvince, StepCity, StepQuestion...)
export interface StepComponentProps {
  // Datos del paso actual (título, opciones si las hay)
  stepData: IStep;

  // Función para avanzar. El payload es lo que eligió el usuario.
  // Puede ser un ID (number), un string, o nada.
  onNext: (payload?: number | string) => void;

  // Función para volver atrás (opcional por ahora)
  onBack?: () => void;
  context: WizardContextState;
}

// Contexto Global (lo que vamos guardando en memoria)
export interface WizardContextState {
  selectedProvinceId?: number;
  selectedCityId?: number;
  history: number[]; // Array de IDs de pasos visitados
  answers: Record<number, { label: string; value?: string }>;
}
