'use client';

import React from 'react';
import ConfiguratorGlob from './components/ConfiguratorGlob';
import ConfiguratorChat from './components/ConfiguratorChat';
import ConfiguratorSteps from './components/ConfiguratorSteps';
import ConfiguratorResult from './components/ConfiguratorResult';
import { VapiConfigProvider } from '@/components/vapi/VapiConfigProvider';

const ConfiguratorPage: React.FC = () => {
  return (
    <VapiConfigProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Configurateur AlloKoli
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Créez votre assistant vocal personnalisé en quelques minutes grâce à notre guide intelligent
            </p>
          </div>

          {/* Layout principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Colonne gauche - Visualisation */}
            <div className="space-y-6">
              <ConfiguratorGlob />
              <ConfiguratorSteps />
            </div>

            {/* Colonne droite - Chat et contrôles */}
            <div className="space-y-6">
              <ConfiguratorChat />
            </div>
          </div>

          {/* Résultat */}
          <ConfiguratorResult />
        </div>
      </div>
    </VapiConfigProvider>
  );
};

export default ConfiguratorPage; 