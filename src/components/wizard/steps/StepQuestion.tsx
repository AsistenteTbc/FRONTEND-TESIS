import React from 'react';
import type { StepComponentProps } from '../../../types/wizard';
import { Button } from '../../ui/Button';

const StepQuestion: React.FC<StepComponentProps> = ({ stepData, onNext, onBack }) => {
  return (
    <div className="animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-4">{stepData.title}</h2>
        {stepData.content && (
          <div className="bg-gray-700/50 p-4 rounded-xl text-gray-200 border border-gray-600">
            {stepData.content}
          </div>
        )}
      </div>

      <div className="space-y-3">
        {stepData.options?.map((option) => (
          <button
            key={option.id}
            onClick={() => onNext(option.nextStepId)} // Aquí enviamos el ID del siguiente paso directamente
            className="w-full group relative overflow-hidden bg-gray-800 hover:bg-gray-700 border border-gray-600 hover:border-blue-500 rounded-xl p-5 text-left transition-all duration-300"
          >
            <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-white group-hover:text-blue-400 transition-colors">
                    {option.label}
                </span>
                <span className="text-gray-500 group-hover:translate-x-1 transition-transform">👉</span>
            </div>
          </button>
        ))}
      </div>

      {onBack && (
        <div className="mt-6 pt-4 border-t border-gray-700">
             <Button variant="ghost" onClick={onBack} fullWidth>
                Volver atrás
            </Button>
        </div>
      )}
    </div>
  );
};

export default StepQuestion;