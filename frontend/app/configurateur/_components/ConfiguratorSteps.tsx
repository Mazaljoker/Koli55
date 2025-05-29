import React from 'react';
import { Card } from 'antd';
import { Check, Circle } from 'lucide-react';

interface ConfiguratorStepsProps {
  currentStep?: number;
}

const ConfiguratorSteps: React.FC<ConfiguratorStepsProps> = ({ 
  currentStep = 0
}) => {
  const steps = [
    { title: "Accueil", description: "Présentation du processus" },
    { title: "Restaurant", description: "Nom de l'établissement" },
    { title: "Cuisine", description: "Type de spécialité" },
    { title: "Services", description: "Livraison, réservations..." },
    { title: "Horaires", description: "Planning d'ouverture" },
    { title: "Spécialités", description: "Plats signature" },
    { title: "Configuration", description: "Génération finale" },
  ];

  return (
    <Card 
      className="bg-white/10 backdrop-blur-sm border-white/20"
      style={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}
    >
      <div className="p-6">
        <h3 className="text-white font-semibold mb-4">Progression</h3>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                index < currentStep 
                  ? 'bg-green-500' 
                  : index === currentStep 
                    ? 'bg-blue-500' 
                    : 'bg-gray-500/30'
              }`}>
                {index < currentStep ? (
                  <Check size={16} className="text-white" />
                ) : (
                  <Circle size={16} className="text-white" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium transition-colors duration-300 ${
                  index <= currentStep ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.title}
                </h4>
                <p className={`text-sm transition-colors duration-300 ${
                  index <= currentStep ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
              {index === currentStep && (
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              )}
            </div>
          ))}
        </div>
        
        {/* Barre de progression */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-300 mb-2">
            <span>Progression</span>
            <span>{Math.round((currentStep / (steps.length - 1)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ConfiguratorSteps; 