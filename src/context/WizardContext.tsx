import React, { createContext, useContext, useState } from 'react';

interface WizardContextType {
  isResultStep: boolean;
  setIsResultStep: (value: boolean) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isResultStep, setIsResultStep] = useState(false);

  return (
    <WizardContext.Provider value={{ isResultStep, setIsResultStep }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizardContext = () => {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizardContext debe usarse dentro de WizardProvider');
  }
  return context;
};
