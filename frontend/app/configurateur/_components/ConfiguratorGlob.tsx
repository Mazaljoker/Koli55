import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { MicIcon, PhoneOff, Settings } from 'lucide-react';

import AbstractBall from '@/components/examples/abstract-ball';

// Hook configurateur (à adapter selon l'implémentation finale)
// import useVapiConfigurator from '@/hooks/use-vapi-configurator';

const ConfiguratorGlob: React.FC = () => {
  // Simulation des données pour le développement
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState(false);

  // Configuration du Glob
  const [config, setConfig] = useState({
    perlinTime: 25.0,
    perlinDNoise: 1.0,
    chromaRGBr: 7.5,
    chromaRGBg: 5.0,
    chromaRGBb: 7.0,
    chromaRGBn: 0.5,
    chromaRGBm: 1.0,
    sphereWireframe: false,
    spherePoints: false,
    spherePsize: 1.0,
    cameraSpeedY: 0.0,
    cameraSpeedX: 0.0,
    cameraZoom: 175,
    cameraGuide: false,
    perlinMorph: 5.5,
  });

  // Animation basée sur l'état de la conversation
  useEffect(() => {
    if (isSessionActive && volumeLevel > 0) {
      // Animation active pendant que l'utilisateur parle
      setConfig(prev => ({
        ...prev,
        perlinTime: 100.0,
        perlinMorph: 25.0,
        chromaRGBr: 10.0,
        chromaRGBg: 8.0,
        chromaRGBb: 12.0,
      }));
    } else if (isSessionActive && isListening) {
      // Animation d'écoute
      setConfig(prev => ({
        ...prev,
        perlinTime: 50.0,
        perlinMorph: 15.0,
        chromaRGBr: 5.0,
        chromaRGBg: 10.0,
        chromaRGBb: 8.0,
      }));
    } else if (isSessionActive) {
      // Session active mais silencieuse
      setConfig(prev => ({
        ...prev,
        perlinTime: 25.0,
        perlinMorph: 10.0,
        chromaRGBr: 7.5,
        chromaRGBg: 5.0,
        chromaRGBb: 7.0,
      }));
    } else {
      // État inactif
      setConfig(prev => ({
        ...prev,
        perlinTime: 5.0,
        perlinMorph: 2.0,
        chromaRGBr: 3.0,
        chromaRGBg: 3.0,
        chromaRGBb: 3.0,
      }));
    }
  }, [isSessionActive, volumeLevel, isListening]);

  // Couleurs basées sur l'étape actuelle
  useEffect(() => {
    const stepColors = {
      0: { r: 7.5, g: 5.0, b: 7.0 }, // Accueil - Violet
      1: { r: 10.0, g: 5.0, b: 5.0 }, // Nom - Rouge
      2: { r: 8.0, g: 8.0, b: 5.0 }, // Cuisine - Orange
      3: { r: 5.0, g: 10.0, b: 5.0 }, // Services - Vert
      4: { r: 5.0, g: 8.0, b: 10.0 }, // Horaires - Bleu
      5: { r: 10.0, g: 8.0, b: 10.0 }, // Spécialités - Magenta
      6: { r: 8.0, g: 10.0, b: 8.0 }, // Génération - Vert clair
    };

    const colors = stepColors[currentStep as keyof typeof stepColors] || stepColors[0];
    setConfig(prev => ({
      ...prev,
      chromaRGBr: colors.r,
      chromaRGBg: colors.g,
      chromaRGBb: colors.b,
    }));
  }, [currentStep]);

  const toggleCall = () => {
    setIsSessionActive(!isSessionActive);
    if (!isSessionActive) {
      setCurrentStep(0);
    }
  };

  // Simulation d'animation pour le développement
  const GlobPlaceholder = () => (
    <div 
      className="w-full h-full flex items-center justify-center relative overflow-hidden"
      style={{
        background: `radial-gradient(circle, 
          rgba(${config.chromaRGBr * 25}, ${config.chromaRGBg * 25}, ${config.chromaRGBb * 25}, 0.3) 0%, 
          rgba(0, 0, 0, 0.8) 70%)`
      }}
    >
      <div 
        className="w-64 h-64 rounded-full border-2 border-white/20 animate-pulse"
        style={{
          background: `radial-gradient(circle, 
            rgba(${config.chromaRGBr * 25}, ${config.chromaRGBg * 25}, ${config.chromaRGBb * 25}, 0.6) 0%, 
            rgba(${config.chromaRGBr * 15}, ${config.chromaRGBg * 15}, ${config.chromaRGBb * 15}, 0.2) 70%)`
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-white/60 text-sm">
          Composant Glob VapiBlocks
        </span>
      </div>
    </div>
  );

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden">
      {/* Placeholder pour le composant AbstractBall */}
      <AbstractBall {...config} />
      
      {/* Overlay avec contrôles */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
        <Button 
          onClick={toggleCall} 
          className={`rounded-full w-16 h-16 ${
            isSessionActive 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSessionActive ? <PhoneOff size={24} /> : <MicIcon size={24} />}
        </Button>
        
        <Button 
          variant="outlined" 
          className="rounded-full w-16 h-16 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20"
        >
          <Settings size={24} className="text-white" />
        </Button>
      </div>

      {/* Indicateur d'étape */}
      <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
        <span className="text-white font-medium">
          Étape {currentStep + 1}/7
        </span>
      </div>

      {/* Indicateur d'état */}
      <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            isSessionActive ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
          }`} />
          <span className="text-white text-sm">
            {isSessionActive ? 'Actif' : 'Inactif'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConfiguratorGlob; 
 