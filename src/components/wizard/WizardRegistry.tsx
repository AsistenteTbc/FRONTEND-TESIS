// src/components/wizard/WizardRegistry.tsx
import React from 'react';
import StepProvince from './steps/StepProvince';
import StepCity from './steps/StepCity';
import StepQuestion from './steps/StepQuestion';
import StepResult from './steps/StepResult'; 

// Este objeto mapea el string de la DB con el Componente de React
export const STEP_REGISTRY: Record<string, React.FC<any>> = {
  'STEP_PROVINCE': StepProvince,
  'STEP_CITY': StepCity,
  'STEP_QUESTION': StepQuestion, 
  'STEP_RESULT': StepResult, 
};

// Un componente por defecto por si el código no existe o está mal escrito en la DB
export const UnknownStep = () => (
  <div className="text-red-400 p-4">
    Error: Tipo de paso desconocido. Verifique el código en la base de datos.
  </div>
);