import { FormInstance } from "antd";

/**
 * Types partagés pour les formulaires d'assistant
 */

// Interface commune pour toutes les étapes du formulaire
export interface AssistantStepProps {
  form: FormInstance;
  isActive?: boolean;
}

// Définition de la structure complète d'un assistant
export interface AssistantFormData {
  // Informations de base
  name: string;
  
  // Configuration du modèle
  modelProvider: string;
  modelName: string;
  systemPrompt: string;
  modelTemperature?: number;
  modelMaxTokens?: number;
  
  // Configuration de la voix
  voiceProvider: string;
  voiceId: string;
  
  // Messages
  firstMessage: string;
  endCallMessage?: string;
  endCallPhrases?: string;
  
  // Paramètres avancés
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
  recordingEnabled?: boolean;
  
  // Intégrations
  forwardingPhoneNumber?: string;
  knowledgeBaseIds?: string[];
  functionIds?: string[];
  workflowIds?: string[];
  
  // Métadonnées
  metadata?: Record<string, string | number | boolean | null>;
}

// Types pour les options des sélecteurs
export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

// Options pour les modèles IA
export const AI_PROVIDERS: SelectOption[] = [
  { value: "openai", label: "OpenAI" },
  { value: "anthropic", label: "Anthropic" },
  { value: "google", label: "Google" },
  { value: "cohere", label: "Cohere" }
];

export const AI_MODELS: Record<string, SelectOption[]> = {
  openai: [
    { value: "gpt-4o", label: "GPT-4o", description: "Modèle avancé multi-modal d'OpenAI" },
    { value: "gpt-4", label: "GPT-4", description: "Modèle avancé d'OpenAI" },
    { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", description: "Modèle rapide d'OpenAI" }
  ],
  anthropic: [
    { value: "claude-3-opus-20240229", label: "Claude 3 Opus", description: "Modèle le plus avancé d'Anthropic" },
    { value: "claude-3-sonnet-20240229", label: "Claude 3 Sonnet", description: "Bon équilibre performance/coût" },
    { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku", description: "Modèle rapide d'Anthropic" }
  ],
  google: [
    { value: "gemini-pro", label: "Gemini Pro", description: "Modèle avancé de Google" }
  ],
  cohere: [
    { value: "command", label: "Command", description: "Modèle principal de Cohere" },
    { value: "command-light", label: "Command Light", description: "Version légère de Command" }
  ]
};

// Options pour les fournisseurs de voix
export const VOICE_PROVIDERS: SelectOption[] = [
  { value: "11labs", label: "ElevenLabs", description: "Voix haute qualité avec émotions" },
  { value: "azure", label: "Azure", description: "Voix Microsoft haute qualité" },
  { value: "deepgram", label: "Deepgram", description: "Voix optimisée pour la vitesse" },
  { value: "play.ht", label: "Play.ht", description: "Grande variété de voix" }
];

export const VOICES: Record<string, SelectOption[]> = {
  "11labs": [
    { value: "jennifer", label: "Jennifer (Femme, EN-US)", description: "Voix professionnelle féminine américaine" },
    { value: "rachel", label: "Rachel (Femme, EN-UK)", description: "Voix professionnelle féminine britannique" },
    { value: "antoine", label: "Antoine (Homme, FR-FR)", description: "Voix professionnelle masculine française" },
    { value: "josh", label: "Josh (Homme, EN-US)", description: "Voix professionnelle masculine américaine" }
  ],
  "azure": [
    { value: "en-US-JennyNeural", label: "Jenny (Femme, EN-US)", description: "Voix féminine américaine naturelle" },
    { value: "en-GB-SoniaNeural", label: "Sonia (Femme, EN-UK)", description: "Voix féminine britannique naturelle" },
    { value: "fr-FR-DeniseNeural", label: "Denise (Femme, FR-FR)", description: "Voix féminine française naturelle" },
    { value: "fr-CA-SylvieNeural", label: "Sylvie (Femme, FR-CA)", description: "Voix féminine canadienne-française" }
  ],
  "deepgram": [
    { value: "nova", label: "Nova (Femme, EN-US)", description: "Voix féminine américaine optimisée" },
    { value: "ava", label: "Ava (Femme, EN-UK)", description: "Voix féminine britannique optimisée" },
    { value: "max", label: "Max (Homme, EN-US)", description: "Voix masculine américaine optimisée" }
  ],
  "play.ht": [
    { value: "lara", label: "Lara (Femme, FR-CA)", description: "Voix féminine canadienne-française expressive" },
    { value: "sophie", label: "Sophie (Femme, FR-FR)", description: "Voix féminine française expressive" },
    { value: "michelle", label: "Michelle (Femme, EN-US)", description: "Voix féminine américaine expressive" },
    { value: "harry", label: "Harry (Homme, EN-UK)", description: "Voix masculine britannique expressive" }
  ]
};

// Templates pour les prompts système
export const SYSTEM_PROMPT_TEMPLATES = {
  assistant: 
`Vous êtes un assistant IA utile et amical. Votre rôle est de répondre aux questions et d'aider l'utilisateur avec diverses tâches.

- Soyez concis et direct dans vos réponses
- Posez des questions clarifiantes si nécessaire
- Restez poli et professionnel en toutes circonstances`,

  customerService: 
`Vous êtes un représentant du service client pour notre entreprise. Votre mission est d'aider les clients avec leurs questions et problèmes.

- Accueillez chaleureusement le client et demandez comment vous pouvez aider
- Répondez avec empathie et compréhension
- Collectez les informations nécessaires pour résoudre leur problème
- Proposez des solutions concrètes et des étapes à suivre`,

  sales: 
`Vous êtes un assistant commercial spécialisé dans la présentation de nos produits et services. Votre objectif est d'informer et d'aider les prospects.

- Identifiez les besoins du client
- Présentez les caractéristiques et avantages pertinents de nos offres
- Répondez aux objections avec tact et données factuelles
- Guidez le client vers la solution la plus adaptée à ses besoins`
}; 