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
    answers: {},
  });

  // Cargar paso inicial (ID 1)
  useEffect(() => {
    loadStep(1);
  }, []);

  const loadStep = async (stepId: number) => {
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
  };

  /**
   * Lógica central de navegación.
   * Recibe un payload que depende del tipo de paso actual.
   */
  const handleNext = useCallback(
    async (payload?: number | string) => {
      if (!stepData) return;
      setTransitioning(true);

      try {
        // --- CASO 1: SELECCIÓN DE PROVINCIA ---
        if (stepData.code === "STEP_PROVINCE") {
          // Payload es el ID de la provincia
          if (typeof payload === "number") {
            setContext((prev) => ({ ...prev, selectedProvinceId: payload }));
            // Asumimos que el paso de Ciudad es el siguiente (ID actual + 1)
            // O puedes hardcodear que vaya al paso 2
            await loadStep(stepData.id + 1);
          }
        }

        // --- CASO 2: SELECCIÓN DE CIUDAD ---
        else if (stepData.code === "STEP_CITY") {
          // Payload es el ID de la ciudad
          if (typeof payload === "number") {
            setContext((prev) => ({ ...prev, selectedCityId: payload }));
            // Asumimos que la primera pregunta es el siguiente paso
            await loadStep(stepData.id + 1);
          }
        }

        // --- CASO 3: PREGUNTA NORMAL ---
        else if (
          stepData.code === "STEP_QUESTION" ||
          stepData.code.startsWith("STEP_Q")
        ) {
          // Payload es el `nextStepId` que viene de la opción elegida
          if (typeof payload === "number") {
            const nextStepId = payload;

            // BUSCAMOS QUÉ OPCIÓN SE ELIGIÓ PARA GUARDAR EL TEXTO (LABEL)
            // Esto es necesario para las estadísticas finales
            const selectedOption = stepData.options?.find(
              (opt) => opt.nextStepId === nextStepId,
            );

            if (selectedOption) {
              setContext((prev) => ({
                ...prev,
                answers: {
                  ...prev.answers,
                  [stepData.id]: selectedOption.label, // Usamos 'label' según tu interfaz
                },
              }));
            }

            await loadStep(nextStepId);
          }
        }

        // --- CASO 4: RESULTADO FINAL (RESET) ---
        else if (stepData.is_end || stepData.code === "STEP_RESULT") {
          // Si el usuario da a "Nueva consulta", reiniciamos todo
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
        setTransitioning(false); // Aseguramos quitar el loading si falla
      }
    },
    [stepData],
  );

  const handleBack = useCallback(() => {
    if (context.history.length > 1) {
      const newHistory = [...context.history];
      newHistory.pop(); // Sacar el actual
      const prevStepId = newHistory[newHistory.length - 1]; // Obtener el anterior

      setContext((prev) => ({ ...prev, history: newHistory }));

      setTransitioning(true);
      // Usamos stepsService en lugar de wizardService
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
