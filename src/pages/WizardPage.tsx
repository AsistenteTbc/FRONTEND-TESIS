import React from "react";
import {
  STEP_REGISTRY,
  UnknownStep,
} from "../components/wizard/WizardRegistry";
import { Card } from "../components/ui/Card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useWizard } from "../hooks/useWizard"; // <--- IMPORTAMOS EL HOOK

const WizardPage: React.FC = () => {
  // Usamos el hook y obtenemos todo lo necesario
  const {
    stepData,
    context,
    loading,
    error,
    transitioning,
    handleNext,
    handleBack,
    retry,
  } = useWizard();

  // --- RENDERIZADO DE ESTADOS DE CARGA/ERROR ---

  if (loading && !stepData) {
    return (
      <div className="flex justify-center items-center min-h-[400px] p-4">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="relative">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full border border-blue-500/30"></div>
            <LoadingSpinner
              size="lg"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />
          </div>
          <p className="text-gray-400 text-sm">Cargando asistente...</p>
        </div>
      </div>
    );
  }

  if (error || !stepData) {
    return (
      <div className="flex justify-center items-center min-h-[400px] p-4 animate-fadeIn">
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 max-w-md w-full text-center">
          <h3 className="text-white font-semibold text-lg mb-2">
            Error de conexión
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            No pudimos cargar el paso. Verifica tu conexión.
          </p>
          <button
            onClick={retry}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm font-bold"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // --- RENDERIZADO DEL PASO ACTIVO ---

  const ActiveComponent = STEP_REGISTRY[stepData.code] || UnknownStep;

  return (
    <div
      className={`flex justify-center w-full px-4 transition-all duration-300 ${transitioning ? "opacity-50 scale-95" : "opacity-100 scale-100"}`}
    >
      <div className="w-full max-w-2xl">
        {/* Card Principal */}
        <Card className="w-full bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 shadow-2xl">
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

        {/* Overlay de Transición */}
        {transitioning && (
          <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center z-50 pointer-events-none">
            <LoadingSpinner size="lg" />
          </div>
        )}
      </div>
    </div>
  );
};

export default WizardPage;
