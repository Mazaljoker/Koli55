import { useState, useEffect, useCallback } from 'react';
import useVapi from './use-vapi';

interface ConfiguratorState {
  currentStep: number;
  collectedData: Record<string, any>;
  isComplete: boolean;
  generatedConfig: any;
}

const useVapiConfigurator = () => {
  const vapi = useVapi({
    assistantId: "46b73124-6624-45ab-89c7-d27ecedcb251",
    // Configuration spécifique au configurateur
  });

  const [state, setState] = useState<ConfiguratorState>({
    currentStep: 0,
    collectedData: {},
    isComplete: false,
    generatedConfig: null,
  });

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  // Écouter les messages de l'assistant
  useEffect(() => {
    if (vapi.messages.length > 0) {
      const lastMessage = vapi.messages[vapi.messages.length - 1];
      
      // Analyser le message pour déterminer l'étape
      analyzeMessageForStep(lastMessage);
      
      // Ajouter au transcript
      setTranscript(prev => [...prev, lastMessage.content]);
    }
  }, [vapi.messages]);

  const analyzeMessageForStep = (message: any) => {
    const content = message.content.toLowerCase();
    
    // Logique pour déterminer l'étape basée sur le contenu
    if (content.includes('nom du restaurant')) {
      setState(prev => ({ ...prev, currentStep: 1 }));
    } else if (content.includes('type de cuisine')) {
      setState(prev => ({ ...prev, currentStep: 2 }));
    } else if (content.includes('services')) {
      setState(prev => ({ ...prev, currentStep: 3 }));
    } else if (content.includes('horaires')) {
      setState(prev => ({ ...prev, currentStep: 4 }));
    } else if (content.includes('spécialités')) {
      setState(prev => ({ ...prev, currentStep: 5 }));
    } else if (content.includes('configuration') || content.includes('json')) {
      setState(prev => ({ ...prev, currentStep: 6, isComplete: true }));
      
      // Extraire le JSON généré
      extractGeneratedConfig(content);
    }
  };

  const extractGeneratedConfig = (content: string) => {
    try {
      // Logique pour extraire le JSON du message
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const config = JSON.parse(jsonMatch[0]);
        setState(prev => ({ ...prev, generatedConfig: config }));
      }
    } catch (error) {
      console.error('Erreur extraction JSON:', error);
    }
  };

  const startConfiguration = useCallback(() => {
    setState({
      currentStep: 0,
      collectedData: {},
      isComplete: false,
      generatedConfig: null,
    });
    setTranscript([]);
    vapi.start();
  }, [vapi]);

  const resetConfiguration = useCallback(() => {
    setState({
      currentStep: 0,
      collectedData: {},
      isComplete: false,
      generatedConfig: null,
    });
    setTranscript([]);
    vapi.stop();
  }, [vapi]);

  return {
    ...vapi,
    ...state,
    isListening,
    transcript,
    startConfiguration,
    resetConfiguration,
  };
};

export default useVapiConfigurator; 