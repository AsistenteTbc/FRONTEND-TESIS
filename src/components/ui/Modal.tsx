import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto py-4 sm:py-8 md:py-12">
      <div className="bg-gray-800 rounded-xl w-full max-w-sm sm:max-w-xl md:max-w-2xl border border-gray-700 shadow-2xl relative max-h-[calc(100vh-32px)] sm:max-h-[calc(100vh-64px)] md:max-h-[calc(100vh-96px)] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-700 sticky top-0 bg-gray-800 rounded-t-xl flex-shrink-0">
          <h3 className="text-lg sm:text-xl font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0 ml-4"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  );
};
