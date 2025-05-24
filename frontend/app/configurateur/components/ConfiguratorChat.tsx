import React from 'react';
import { Button } from 'antd';
import { Mic, MicOff, RotateCcw } from 'lucide-react';

interface ConfiguratorChatProps {
  isSessionActive?: boolean;
  transcript?: string[];
  currentStep?: number;
  onToggleCall?: () => void;
  onReset?: () => void;
}

const ConfiguratorChat: React.FC<ConfiguratorChatProps> = ({
  isSessionActive = false,
  transcript = [],
  currentStep = 0,
  onToggleCall,
  onReset,
}) => {
  const stepTitles = [
    "Accueil",
    "Nom du restaurant",
    "Type de cuisine",
    "Services offerts",
    "Horaires d'ouverture",
    "Spécialités",
    "Configuration générée"
  ];

  return (
    <div className="h-[600px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg">
      {/* Header */}
      <div className="p-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Assistant Configurateur</h3>
          <div className="flex gap-2">
            <Button
              onClick={onToggleCall}
              variant={isSessionActive ? "solid" : "filled"}
              size="sm"
              className={isSessionActive ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"}
            >
              {isSessionActive ? <MicOff size={16} /> : <Mic size={16} />}
              <span className="ml-2">
                {isSessionActive ? "Arrêter" : "Commencer"}
              </span>
            </Button>
            <Button
              onClick={onReset}
              variant="outlined"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RotateCcw size={16} />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex flex-col h-full p-4">
        {/* Étape actuelle */}
        <div className="mb-4 p-3 bg-blue-500/20 rounded-lg border border-blue-500/30">
          <h4 className="text-white font-medium">
            {stepTitles[currentStep]}
          </h4>
          <p className="text-blue-200 text-sm mt-1">
            Étape {currentStep + 1} sur 7
          </p>
        </div>

        {/* Transcript */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {transcript.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400 text-center">
                {!isSessionActive 
                  ? "Cliquez sur 'Commencer' pour démarrer la configuration"
                  : "En attente de la conversation..."
                }
              </p>
            </div>
          ) : (
            transcript.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  index % 2 === 0
                    ? 'bg-blue-500/20 text-white border border-blue-500/30' // Assistant
                    : 'bg-green-500/20 text-white ml-8 border border-green-500/30' // Utilisateur
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    index % 2 === 0 ? 'bg-blue-400' : 'bg-green-400'
                  }`} />
                  <p className="text-sm flex-1">{message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Instructions */}
        <div className="p-3 bg-gray-500/20 rounded-lg border border-gray-500/30">
          <p className="text-gray-300 text-sm">
            {!isSessionActive 
              ? "💡 Cliquez sur 'Commencer' pour démarrer la configuration de votre assistant vocal"
              : isSessionActive && transcript.length === 0
                ? "🎤 Parlez clairement et attendez les questions de l'assistant"
                : "🗣️ Répondez aux questions de l'assistant pour configurer votre restaurant"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfiguratorChat; 