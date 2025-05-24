'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface VapiConfigContextType {
  assistantId: string;
  isConfiguratorMode: boolean;
}

const VapiConfigContext = createContext<VapiConfigContextType | undefined>(undefined);

interface VapiConfigProviderProps {
  children: ReactNode;
  assistantId?: string;
}

export const VapiConfigProvider: React.FC<VapiConfigProviderProps> = ({
  children,
  assistantId = "46b73124-6624-45ab-89c7-d27ecedcb251", // ID du configurateur AlloKoli
}) => {
  const value: VapiConfigContextType = {
    assistantId,
    isConfiguratorMode: true,
  };

  return (
    <VapiConfigContext.Provider value={value}>
      {children}
    </VapiConfigContext.Provider>
  );
};

export const useVapiConfig = () => {
  const context = useContext(VapiConfigContext);
  if (context === undefined) {
    throw new Error('useVapiConfig must be used within a VapiConfigProvider');
  }
  return context;
}; 