'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  key: string;
  title: string;
  description: string;
}

interface WizardProgressProps {
  currentStep: number;
  steps: Step[];
  className?: string;
}

const WizardProgress: React.FC<WizardProgressProps> = ({ 
  currentStep, 
  steps, 
  className = '' 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Ligne de progression de fond */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0" />
        
        {/* Ligne de progression active */}
        <motion.div
          className="absolute top-4 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500 z-10"
          initial={{ width: '0%' }}
          animate={{ 
            width: `${(currentStep / (steps.length - 1)) * 100}%` 
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {steps.map((step, index) => (
          <div key={step.key} className="flex flex-col items-center relative z-20">
            {/* Cercle de l'étape */}
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                index < currentStep
                  ? 'bg-green-500 border-green-500 text-white'
                  : index === currentStep
                  ? 'bg-purple-500 border-purple-500 text-white shadow-lg'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
              initial={{ scale: 0.8 }}
              animate={{ scale: index === currentStep ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </motion.div>

            {/* Titre et description de l'étape */}
            <div className="mt-2 text-center max-w-20">
              <motion.p
                className={`text-xs font-medium transition-colors duration-300 ${
                  index <= currentStep ? 'text-gray-800' : 'text-gray-400'
                }`}
                animate={{ scale: index === currentStep ? 1.05 : 1 }}
                transition={{ duration: 0.3 }}
              >
                {step.title}
              </motion.p>
              <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Indicateur de progression en pourcentage */}
      <div className="mt-6 text-center">
        <motion.div
          className="text-sm text-gray-600"
          key={currentStep}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          Étape {currentStep + 1} sur {steps.length} • {Math.round(((currentStep + 1) / steps.length) * 100)}% terminé
        </motion.div>
        
        {/* Barre de progression linéaire */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
};

export default WizardProgress; 