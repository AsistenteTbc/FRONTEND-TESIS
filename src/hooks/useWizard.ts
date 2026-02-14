import { useState, useEffect, useCallback } from "react";
import { stepsService } from "../services/steps.service";
import type { IStep, WizardContextState } from "../types/wizard";

export const useWizard = () => {
  const [stepData, setStepData] = useState<IStep | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [transitioning, setTransitioning] = useState(false);

  // Inicializamos el contexto
  const [context, setContext] = useState<WizardContextState>({
    selectedProvinceId: undefined,
    selectedCityId: undefined,
    history: [],
    answers: {}, // Se llenará con { id_paso: { label: "Si", value: "RISK_TRUE" } }
  });

  // Función para cargar un paso (definida antes del useEffect)
  const loadStep = useCallback(async (stepId: number) => {
    setLoading(true);
    setError(false);
    try {
      const data = await stepsService.getStepById(stepId);
      setStepData(data);

      // Actualizar historial (evitando duplicados)
      setContext((prev) => {
        if (prev.history.includes(stepId)) return prev;
        return { ...prev, history: [...prev.history, stepId] };
      });
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
      setTransitioning(false);
    }
  }, []);

  // Cargar paso inicial (ID 1) al montar
  useEffect(() => {
    loadStep(1);
  }, [loadStep]);

  /**
   * Lógica central de navegación.
   */
  const handleNext = useCallback(
    async (payload?: number | string) => {
      if (!stepData) return;
      setTransitioning(true);

      try {
        // --- CASO 1: SELECCIÓN DE PROVINCIA ---
        if (stepData.code === "STEP_PROVINCE") {
          if (typeof payload === "number") {
            setContext((prev) => ({ ...prev, selectedProvinceId: payload }));
            // Asumimos que el siguiente paso es el ID actual + 1
            await loadStep(stepData.id + 1);
          }
        }

        // --- CASO 2: SELECCIÓN DE CIUDAD ---
        else if (stepData.code === "STEP_CITY") {
          if (typeof payload === "number") {
            setContext((prev) => ({ ...prev, selectedCityId: payload }));
            await loadStep(stepData.id + 1);
          }
        }

        // --- CASO 3: PREGUNTA NORMAL ---
        else if (
          stepData.code === "STEP_QUESTION" ||
          stepData.code.startsWith("STEP_Q")
        ) {
          if (typeof payload === "number") {
            const nextStepId = payload;

            // Buscamos la opción elegida para guardar label Y value
            const selectedOption = stepData.options?.find(
              (opt) => opt.nextStepId === nextStepId,
            );

            if (selectedOption) {
              setContext((prev) => ({
                ...prev,
                answers: {
                  ...prev.answers,
                  // 👇 IMPORTANTE: Guardamos el objeto completo para la lógica final
                  [stepData.id]: {
                    label: selectedOption.label,
                    value: selectedOption.value,
                  },
                },
              }));
            }

            await loadStep(nextStepId);
          }
        }

        // --- CASO 4: RESULTADO FINAL (RESET) ---
        else if (stepData.is_end || stepData.code === "STEP_RESULT") {
          setContext({
            selectedProvinceId: undefined,
            selectedCityId: undefined,
            history: [],
            answers: {},
          });
          await loadStep(1);
        }
      } catch (error) {
        console.error("Error en navegación:", error);
        setTransitioning(false);
      }
    },
    [stepData, loadStep],
  );

  const handleBack = useCallback(() => {
    if (context.history.length > 1) {
      const newHistory = [...context.history];
      newHistory.pop(); // Sacar el actual
      const prevStepId = newHistory[newHistory.length - 1]; // Obtener el anterior

      setContext((prev) => ({ ...prev, history: newHistory }));

      setTransitioning(true);
      stepsService.getStepById(prevStepId).then((data) => {
        setStepData(data);
        setTransitioning(false);
      });
    }
  }, [context.history]);

  const retry = () => {
    if (stepData) loadStep(stepData.id);
    else loadStep(1);
  };

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
