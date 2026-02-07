import React, { useState, useEffect } from "react";
import {
  STEP_REGISTRY,
  UnknownStep,
} from "../components/wizard/WizardRegistry";
import { stepsService } from "../services/steps.service";
import type { IStep, WizardContextState } from "../types/wizard";
import { Card } from "../components/ui/Card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";

const WizardContainer: React.FC = () => {
  const [currentStepId, setCurrentStepId] = useState<number>(1);
  const [stepData, setStepData] = useState<IStep | null>(null);
  const [context, setContext] = useState<WizardContextState>({
    history: [],
    selectedProvinceId: undefined,
    selectedCityId: undefined,
  });

  const [loading, setLoading] = useState(true);
  const [transitioning, setTransitioning] = useState(false);

  // --- EFECTO DE CARGA ---
  useEffect(() => {
    const loadStep = async () => {
      setLoading(true);
      try {
        const data = await stepsService.getStepById(currentStepId);

        // Pequeña transición
        setTimeout(() => {
          setStepData(data);
          setLoading(false);
          setTransitioning(false);
        }, 300);
      } catch (error) {
        console.error("Error al cargar el paso:", error);
        setLoading(false);
        setTransitioning(false);
      }
    };

    loadStep();
  }, [currentStepId]);

  // --- LÓGICA DE NAVEGACIÓN ---
  const handleNext = (payload?: number | string) => {
    if (!stepData || transitioning) return;

    setTransitioning(true);

    if (stepData.code !== "STEP_RESULT") {
      setContext((prev) => ({
        ...prev,
        history: [...prev.history, currentStepId],
      }));
    }

    switch (stepData.code) {
      case "STEP_PROVINCE":
        setContext((prev) => ({
          ...prev,
          selectedProvinceId: Number(payload),
        }));
        setCurrentStepId(2);
        break;

      case "STEP_CITY":
        setContext((prev) => ({ ...prev, selectedCityId: Number(payload) }));
        setCurrentStepId(3);
        break;

      case "STEP_RESULT":
        setContext({
          history: [],
          selectedProvinceId: undefined,
          selectedCityId: undefined,
        });
        setCurrentStepId(1);
        break;

      case "STEP_QUESTION":
      default:
        if (typeof payload === "number") {
          setCurrentStepId(payload);
        }
        break;
    }
  };

  const handleBack = () => {
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
      }

      return { ...prev, history: newHistory };
    });
  };

  // --- RENDERIZADO ---
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full border border-blue-500/30"></div>
            <LoadingSpinner
              size="lg"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <p className="text-gray-300 text-sm sm:text-base">
            Cargando asistente...
          </p>
        </div>
      </div>
    );
  }

  if (!stepData)
    return (
      <div className="flex justify-center items-center min-h-[400px] p-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 max-w-md w-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-white font-semibold">Error de carga</h3>
          </div>
          <p className="text-gray-300 text-sm">
            No se pudo cargar la información. Por favor, intenta nuevamente.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      </div>
    );

  const ActiveComponent = STEP_REGISTRY[stepData.code] || UnknownStep;

  return (
    <div
      className={`flex justify-center w-full px-4 transition-all duration-300 ${
        transitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="w-full max-w-2xl">
        {/* Card del wizard */}
        <Card className="w-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10">
          <div className="p-4 sm:p-6 md:p-8">
            <ActiveComponent
              stepData={stepData}
              context={context}
              onNext={handleNext}
              onBack={context.history.length > 0 ? handleBack : undefined}
              transitioning={transitioning}
            />
          </div>
        </Card>

        {/* Indicador de transición */}
        {transitioning && (
          <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
              <p className="text-gray-300 text-sm">
                Cargando siguiente paso...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WizardContainer;
