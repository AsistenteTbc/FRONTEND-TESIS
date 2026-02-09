import { useState, useEffect, useCallback } from "react";
import { stepsService } from "../services/steps.service";
import type { IStep, WizardContextState } from "../types/wizard";

export const useWizard = () => {
  // Estados
  const [currentStepId, setCurrentStepId] = useState<number>(1);
  const [stepData, setStepData] = useState<IStep | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  const [transitioning, setTransitioning] = useState(false);

  // Contexto del Wizard (Historial y Selecciones)
  const [context, setContext] = useState<WizardContextState>({
    history: [],
    selectedProvinceId: undefined,
    selectedCityId: undefined,
  });

  // Cargar paso actual
  useEffect(() => {
    let isMounted = true;

    const loadStep = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await stepsService.getStepById(currentStepId);

        // Pequeño delay artificial para suavizar la transición visual
        setTimeout(() => {
          if (isMounted) {
            setStepData(data);
            setLoading(false);
            setTransitioning(false);
          }
        }, 300);
      } catch (err) {
        console.error("Error cargando paso:", err);
        if (isMounted) {
          setError(true);
          setLoading(false);
          setTransitioning(false);
        }
      }
    };

    loadStep();

    return () => {
      isMounted = false;
    };
  }, [currentStepId]);

  // Lógica de Avanzar (Next)
  const handleNext = useCallback(
    (payload?: number | string) => {
      if (!stepData || transitioning) return;

      setTransitioning(true);

      // Guardar historial (si no es el resultado final)
      if (stepData.code !== "STEP_RESULT") {
        setContext((prev) => ({
          ...prev,
          history: [...prev.history, currentStepId],
        }));
      }

      // Máquina de estados simple
      switch (stepData.code) {
        case "STEP_PROVINCE":
          setContext((prev) => ({
            ...prev,
            selectedProvinceId: Number(payload),
          }));
          setCurrentStepId(2); // Asumiendo que paso 2 es Ciudad
          break;

        case "STEP_CITY":
          setContext((prev) => ({ ...prev, selectedCityId: Number(payload) }));
          setCurrentStepId(3); // Asumiendo que paso 3 es Preguntas
          break;

        case "STEP_RESULT":
          // Reset completo al terminar
          setContext({
            history: [],
            selectedProvinceId: undefined,
            selectedCityId: undefined,
          });
          setCurrentStepId(1);
          break;

        case "STEP_QUESTION":
        default:
          // Si es una pregunta normal, el payload es el ID del siguiente paso
          if (typeof payload === "number") {
            setCurrentStepId(payload);
          }
          break;
      }
    },
    [stepData, currentStepId, transitioning],
  );

  // Lógica de Retroceder (Back)
  const handleBack = useCallback(() => {
    if (transitioning) return;

    setTransitioning(true);
    setContext((prev) => {
      const newHistory = [...prev.history];
      const prevStepId = newHistory.pop();

      if (prevStepId) {
        setTimeout(() => {
          setCurrentStepId(prevStepId);
          setTransitioning(false);
        }, 200);
      } else {
        setTransitioning(false);
      }

      return { ...prev, history: newHistory };
    });
  }, [transitioning]);

  const retry = () => setCurrentStepId(currentStepId); // Reintentar carga

  return {
    stepData,
    context,
    loading,
    error,
    transitioning,
    handleNext,
    handleBack,
    retry,
  };
};
