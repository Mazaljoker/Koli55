// frontend/lib/hooks/useVapiConfigurator.ts
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Vapi from "@vapi-ai/web";

interface VapiMessage {
  type: "assistant" | "user" | "system";
  message: string;
  timestamp: Date;
  id: string;
  metadata?: Record<string, any>;
}

interface VapiState {
  isCallActive: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  volumeLevel: number;
  messages: VapiMessage[];
  currentStep: number;
  error: string | null;
  isLoading: boolean;
  isConnected: boolean;
}

interface ConfiguratorData {
  restaurantName?: string;
  cuisineType?: string;
  services?: string[];
  hours?: Record<string, string>;
  specialties?: string[];
  phoneNumber?: string;
  address?: string;
  website?: string;
  socialMedia?: Record<string, string>;
  targetAudience?: string;
  businessGoals?: string[];
  isComplete: boolean;
  confidence: number;
}

interface VapiConfig {
  assistantId?: string;
  publicKey?: string;
  serverUrl?: string;
  enableDebug?: boolean;
}

// Configuration par défaut
const DEFAULT_CONFIG: VapiConfig = {
  enableDebug: process.env.NODE_ENV === "development",
};

// Types des étapes de configuration
const CONFIGURATION_STEPS = {
  WELCOME: 0,
  RESTAURANT_NAME: 1,
  CUISINE_TYPE: 2,
  SERVICES: 3,
  HOURS: 4,
  SPECIALTIES: 5,
  CONTACT_INFO: 6,
  BUSINESS_GOALS: 7,
  REVIEW_CONFIG: 8,
  COMPLETE: 9,
} as const;

export function useVapiConfigurator(config: VapiConfig = {}) {
  const vapiRef = useRef<Vapi | null>(null);
  const finalConfig = { ...DEFAULT_CONFIG, ...config };

  const [state, setState] = useState<VapiState>({
    isCallActive: false,
    isSpeaking: false,
    isListening: false,
    volumeLevel: 0,
    messages: [],
    currentStep: CONFIGURATION_STEPS.WELCOME,
    error: null,
    isLoading: false,
    isConnected: false,
  });

  const [configuratorData, setConfiguratorData] = useState<ConfiguratorData>({
    isComplete: false,
    confidence: 0,
  });

  // Messages d'état et de progression
  const addSystemMessage = useCallback(
    (message: string, metadata?: Record<string, any>) => {
      const systemMessage: VapiMessage = {
        type: "system",
        message,
        timestamp: new Date(),
        id: `sys-${Date.now()}-${Math.random()}`,
        metadata,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, systemMessage],
      }));
    },
    []
  );

  // Initialisation Vapi
  useEffect(() => {
    const publicKey =
      finalConfig.publicKey || process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY;

    if (!publicKey) {
      setState((prev) => ({
        ...prev,
        error:
          "Clé publique Vapi manquante. Vérifiez NEXT_PUBLIC_VAPI_PUBLIC_KEY.",
      }));
      return;
    }

    try {
      vapiRef.current = new Vapi(publicKey);
      setState((prev) => ({ ...prev, isConnected: true }));

      if (finalConfig.enableDebug) {
        addSystemMessage("SDK Vapi initialisé avec succès", {
          publicKey: publicKey.substring(0, 8) + "...",
        });
      }
    } catch (error) {
      console.error("Erreur initialisation Vapi:", error);
      setState((prev) => ({
        ...prev,
        error: "Erreur d'initialisation du SDK Vapi",
        isConnected: false,
      }));
      return;
    }

    const vapi = vapiRef.current;

    // === EVENT LISTENERS ===

    vapi.on("call-start", () => {
      setState((prev) => ({
        ...prev,
        isCallActive: true,
        error: null,
        currentStep: CONFIGURATION_STEPS.RESTAURANT_NAME,
      }));

      addSystemMessage(
        "🎉 Configuration démarrée ! Assistant Allokoli à votre service."
      );

      const welcomeMessage: VapiMessage = {
        type: "assistant",
        message:
          "Bonjour ! Je suis votre assistant configurateur AlloKoli. Je vais vous aider à créer votre assistant vocal en quelques minutes. Commençons par le nom de votre restaurant !",
        timestamp: new Date(),
        id: `msg-${Date.now()}-welcome`,
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, welcomeMessage],
      }));
    });

    vapi.on("call-end", () => {
      setState((prev) => ({
        ...prev,
        isCallActive: false,
        isSpeaking: false,
        isListening: false,
        volumeLevel: 0,
      }));

      addSystemMessage("📞 Appel terminé");
    });

    vapi.on("speech-start", () => {
      setState((prev) => ({ ...prev, isSpeaking: true }));
    });

    vapi.on("speech-end", () => {
      setState((prev) => ({ ...prev, isSpeaking: false }));
    });

    vapi.on("message", (message: any) => {
      if (finalConfig.enableDebug) {
        console.log("📨 Message Vapi reçu:", message);
      }

      // Traiter les messages transcript
      if (message.type === "transcript" && message.transcript) {
        const newMessage: VapiMessage = {
          type: message.role === "assistant" ? "assistant" : "user",
          message: message.transcript,
          timestamp: new Date(),
          id: `msg-${Date.now()}-${Math.random()}`,
          metadata: {
            role: message.role,
            timestamp: message.timestamp,
          },
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, newMessage],
        }));

        // Analyser le contenu pour progression et extraction de données
        if (message.role === "user") {
          analyzeUserInput(message.transcript);
        } else if (message.role === "assistant") {
          analyzeAssistantResponse(message.transcript);
        }
      }

      // Traiter les function calls
      if (message.type === "function-call") {
        handleFunctionCall(message);
      }
    });

    vapi.on("volume-level", (volume: number) => {
      setState((prev) => ({ ...prev, volumeLevel: volume }));
    });

    vapi.on("error", (error: any) => {
      console.error("❌ Erreur Vapi:", error);
      setState((prev) => ({
        ...prev,
        error: `Erreur Vapi: ${error.message || "Connexion interrompue"}`,
        isLoading: false,
      }));

      addSystemMessage(
        `❌ Erreur: ${error.message || "Connexion interrompue"}`,
        { error }
      );
    });

    // Nettoyage
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, [finalConfig.publicKey, finalConfig.enableDebug, addSystemMessage]);

  // === ANALYSE ET EXTRACTION DE DONNÉES ===

  const analyzeUserInput = useCallback(
    (content: string) => {
      const trimmedContent = content.trim();
      const lowerContent = content.toLowerCase();

      // Extraction intelligente basée sur l'étape actuelle
      switch (state.currentStep) {
        case CONFIGURATION_STEPS.RESTAURANT_NAME:
          setConfiguratorData((prev) => ({
            ...prev,
            restaurantName: trimmedContent,
            confidence: Math.min(prev.confidence + 15, 100),
          }));
          break;

        case CONFIGURATION_STEPS.CUISINE_TYPE:
          setConfiguratorData((prev) => ({
            ...prev,
            cuisineType: trimmedContent,
            confidence: Math.min(prev.confidence + 15, 100),
          }));
          break;

        case CONFIGURATION_STEPS.SERVICES:
          // Extraction des services (logique améliorée)
          const detectedServices = extractServices(lowerContent);
          setConfiguratorData((prev) => ({
            ...prev,
            services: [...(prev.services || []), ...detectedServices],
            confidence: Math.min(prev.confidence + 10, 100),
          }));
          break;

        case CONFIGURATION_STEPS.HOURS:
          const extractedHours = extractHours(content);
          setConfiguratorData((prev) => ({
            ...prev,
            hours: { ...prev.hours, ...extractedHours },
            confidence: Math.min(prev.confidence + 10, 100),
          }));
          break;

        case CONFIGURATION_STEPS.SPECIALTIES:
          const specialties = content
            .split(/[,;]/)
            .map((s) => s.trim())
            .filter(Boolean);
          setConfiguratorData((prev) => ({
            ...prev,
            specialties: [...(prev.specialties || []), ...specialties],
            confidence: Math.min(prev.confidence + 10, 100),
          }));
          break;

        case CONFIGURATION_STEPS.CONTACT_INFO:
          const contactInfo = extractContactInfo(content);
          setConfiguratorData((prev) => ({
            ...prev,
            ...contactInfo,
            confidence: Math.min(prev.confidence + 10, 100),
          }));
          break;

        case CONFIGURATION_STEPS.BUSINESS_GOALS:
          const goals = extractBusinessGoals(lowerContent);
          setConfiguratorData((prev) => ({
            ...prev,
            businessGoals: [...(prev.businessGoals || []), ...goals],
            confidence: Math.min(prev.confidence + 10, 100),
          }));
          break;
      }
    },
    [state.currentStep]
  );

  const analyzeAssistantResponse = useCallback(
    (content: string) => {
      const lowerContent = content.toLowerCase();

      // Détecter les transitions d'étapes basées sur les questions
      if (
        lowerContent.includes("type de cuisine") ||
        lowerContent.includes("quel genre")
      ) {
        setState((prev) => ({
          ...prev,
          currentStep: CONFIGURATION_STEPS.CUISINE_TYPE,
        }));
      } else if (
        lowerContent.includes("services") ||
        lowerContent.includes("proposez-vous")
      ) {
        setState((prev) => ({
          ...prev,
          currentStep: CONFIGURATION_STEPS.SERVICES,
        }));
      } else if (
        lowerContent.includes("horaires") ||
        lowerContent.includes("ouvert")
      ) {
        setState((prev) => ({
          ...prev,
          currentStep: CONFIGURATION_STEPS.HOURS,
        }));
      } else if (
        lowerContent.includes("spécialités") ||
        lowerContent.includes("plats")
      ) {
        setState((prev) => ({
          ...prev,
          currentStep: CONFIGURATION_STEPS.SPECIALTIES,
        }));
      } else if (
        lowerContent.includes("contact") ||
        lowerContent.includes("téléphone")
      ) {
        setState((prev) => ({
          ...prev,
          currentStep: CONFIGURATION_STEPS.CONTACT_INFO,
        }));
      } else if (
        lowerContent.includes("objectifs") ||
        lowerContent.includes("but")
      ) {
        setState((prev) => ({
          ...prev,
          currentStep: CONFIGURATION_STEPS.BUSINESS_GOALS,
        }));
      } else if (
        lowerContent.includes("résumé") ||
        lowerContent.includes("configuration")
      ) {
        setState((prev) => ({
          ...prev,
          currentStep: CONFIGURATION_STEPS.REVIEW_CONFIG,
        }));
      } else if (
        lowerContent.includes("terminé") ||
        lowerContent.includes("fini")
      ) {
        setState((prev) => ({
          ...prev,
          currentStep: CONFIGURATION_STEPS.COMPLETE,
        }));
        setConfiguratorData((prev) => ({
          ...prev,
          isComplete: true,
          confidence: 100,
        }));
        addSystemMessage("✅ Configuration terminée avec succès !");
      }
    },
    [addSystemMessage]
  );

  // === UTILITAIRES D'EXTRACTION ===

  const extractServices = (content: string): string[] => {
    const services: string[] = [];

    if (content.includes("livraison") || content.includes("delivery"))
      services.push("Livraison");
    if (
      content.includes("click") ||
      content.includes("collect") ||
      content.includes("emporter")
    )
      services.push("Click & Collect");
    if (content.includes("réservation") || content.includes("booking"))
      services.push("Réservations");
    if (content.includes("commande") || content.includes("order"))
      services.push("Commandes");
    if (content.includes("traiteur") || content.includes("catering"))
      services.push("Traiteur");

    return services;
  };

  const extractHours = (content: string): Record<string, string> => {
    const hours: Record<string, string> = {};

    // Logique d'extraction des horaires (à améliorer)
    const timePattern = /(\d{1,2}h?\d{0,2})\s*[-à]\s*(\d{1,2}h?\d{0,2})/g;
    const matches = content.match(timePattern);

    if (matches) {
      hours.general = matches[0];
    }

    return hours;
  };

  const extractContactInfo = (content: string) => {
    const info: Partial<ConfiguratorData> = {};

    // Extraction téléphone
    const phonePattern = /(?:\+33|0)[1-9](?:[.-]?\d{2}){4}/g;
    const phoneMatch = content.match(phonePattern);
    if (phoneMatch) info.phoneNumber = phoneMatch[0];

    // Extraction site web
    const urlPattern = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
    const urlMatch = content.match(urlPattern);
    if (urlMatch) info.website = urlMatch[0];

    return info;
  };

  const extractBusinessGoals = (content: string): string[] => {
    const goals: string[] = [];

    if (content.includes("plus de clients") || content.includes("clientèle"))
      goals.push("Augmenter la clientèle");
    if (content.includes("commandes") || content.includes("ventes"))
      goals.push("Améliorer les commandes");
    if (content.includes("service") || content.includes("expérience"))
      goals.push("Améliorer le service client");
    if (content.includes("automatiser") || content.includes("efficacité"))
      goals.push("Automatiser les processus");

    return goals;
  };

  // === FUNCTION CALLS ===

  const handleFunctionCall = useCallback(
    (message: any) => {
      if (finalConfig.enableDebug) {
        console.log("🔧 Function call reçu:", message);
      }

      const { functionCall } = message;

      if (functionCall?.name === "update_step") {
        const step = parseInt(functionCall.parameters?.step || "0");
        setState((prev) => ({ ...prev, currentStep: step }));
        addSystemMessage(`📍 Étape ${step} atteinte`);
      }

      if (functionCall?.name === "save_config") {
        const config = functionCall.parameters;
        setConfiguratorData((prev) => ({
          ...prev,
          ...config,
          isComplete: true,
          confidence: 100,
        }));
        addSystemMessage("💾 Configuration sauvegardée");
      }

      if (functionCall?.name === "validate_data") {
        const validation = functionCall.parameters;
        addSystemMessage(`✅ Données validées: ${validation.message}`);
      }
    },
    [finalConfig.enableDebug, addSystemMessage]
  );

  // === ACTIONS PUBLIQUES ===

  const startCall = useCallback(async () => {
    if (!vapiRef.current) {
      setState((prev) => ({
        ...prev,
        error: "SDK Vapi non initialisé",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const assistantId =
        finalConfig.assistantId || process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

      if (!assistantId) {
        throw new Error(
          "ID assistant Vapi manquant. Vérifiez NEXT_PUBLIC_VAPI_ASSISTANT_ID."
        );
      }

      // Utilisation correcte de l'API Vapi selon la documentation
      await vapiRef.current.start(assistantId);

      addSystemMessage("🚀 Démarrage de l'appel...");
    } catch (error: any) {
      const errorMessage = error.message || "Erreur lors du démarrage";
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        isLoading: false,
      }));
      addSystemMessage(`❌ Erreur: ${errorMessage}`);
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [finalConfig.assistantId, addSystemMessage]);

  const stopCall = useCallback(() => {
    if (vapiRef.current) {
      vapiRef.current.stop();
      addSystemMessage("⏹️ Appel arrêté");
    }
  }, [addSystemMessage]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!vapiRef.current || !state.isCallActive) {
        addSystemMessage("❌ Impossible d'envoyer le message: appel non actif");
        return;
      }

      try {
        const userMessage: VapiMessage = {
          type: "user",
          message: text,
          timestamp: new Date(),
          id: `msg-${Date.now()}-user-manual`,
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, userMessage],
        }));

        // Utilisation correcte de l'API Vapi selon la documentation
        vapiRef.current.send({
          type: "add-message",
          message: {
            role: "system",
            content: text,
          },
        });
      } catch (error: any) {
        const errorMessage = error.message || "Erreur envoi message";
        setState((prev) => ({ ...prev, error: errorMessage }));
        addSystemMessage(`❌ Erreur: ${errorMessage}`);
      }
    },
    [state.isCallActive, addSystemMessage]
  );

  const resetConversation = useCallback(() => {
    if (vapiRef.current && state.isCallActive) {
      vapiRef.current.stop();
    }

    setState({
      isCallActive: false,
      isSpeaking: false,
      isListening: false,
      volumeLevel: 0,
      messages: [],
      currentStep: CONFIGURATION_STEPS.WELCOME,
      error: null,
      isLoading: false,
      isConnected: !!vapiRef.current,
    });

    setConfiguratorData({
      isComplete: false,
      confidence: 0,
    });

    addSystemMessage("🔄 Conversation réinitialisée");
  }, [state.isCallActive, addSystemMessage]);

  // Fonction pour exporter la configuration
  const exportConfiguration = useCallback(() => {
    if (!configuratorData.isComplete) {
      addSystemMessage("⚠️ Configuration incomplète");
      return null;
    }

    const exportData = {
      ...configuratorData,
      exportedAt: new Date().toISOString(),
      version: "1.0",
      source: "allokoli-vapi-configurator",
    };

    addSystemMessage("📤 Configuration exportée");
    return exportData;
  }, [configuratorData.isComplete, configuratorData, addSystemMessage]);

  return {
    // État complet
    ...state,
    configuratorData,

    // Actions principales
    startCall,
    stopCall,
    sendMessage,
    resetConversation,
    exportConfiguration,

    // Utilitaires
    isConnected: state.isConnected,
    stepProgress:
      (state.currentStep / Object.keys(CONFIGURATION_STEPS).length) * 100,

    // Configuration
    steps: CONFIGURATION_STEPS,

    // Méthodes de contrôle avancées
    addSystemMessage,
  };
}
