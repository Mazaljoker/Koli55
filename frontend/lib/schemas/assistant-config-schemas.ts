import { z } from 'zod';

// ===== SCHÉMAS POUR ASSISTANT CONFIG (Cahier des Charges AlloKoli) =====

/**
 * Profil de l'assistant conforme au cahier des charges
 */
export const AssistantProfileSchema = z.object({
  name: z.string().min(1, "Le nom de l'assistant est obligatoire").max(100, "Le nom doit faire <= 100 caractères"),
  businessType: z.string().min(1, "Le type d'activité est obligatoire").max(50, "Le type d'activité doit faire <= 50 caractères"),
  tone: z.enum([
    'formel',
    'amical_chaleureux', 
    'direct_efficace',
    'professionnel',
    'convivial',
    'elegant_rassurant',
    'dynamique_moderne',
    'calme_relaxant'
  ], {
    errorMap: () => ({ message: "Le ton doit être l'une des valeurs prédéfinies" })
  }),
  language: z.string().default('fr-FR').refine(
    (val: string) => /^[a-z]{2}-[A-Z]{2}$/.test(val),
    { message: "La langue doit être au format ISO (ex: fr-FR, en-US)" }
  )
});

/**
 * Configuration Vapi pour l'assistant
 */
export const VapiConfigSchema = z.object({
  firstMessage: z.string().min(1, "Le message d'accueil est obligatoire").max(500, "Le message d'accueil doit faire <= 500 caractères"),
  systemPrompt: z.string().min(1, "Le prompt système est obligatoire").max(4000, "Le prompt système doit faire <= 4000 caractères"),
  endCallMessage: z.string().max(300, "Le message de fin d'appel doit faire <= 300 caractères").optional(),
  model: z.object({
    provider: z.enum(['openai', 'anthropic'], { 
      errorMap: () => ({ message: "Le provider doit être openai ou anthropic" })
    }).default('openai'),
    model: z.string().default('gpt-4o'),
    temperature: z.number().min(0).max(2).default(0.7),
    max_tokens: z.number().int().min(100).max(4000).default(1000)
  }),
  voice: z.object({
    provider: z.enum(['elevenlabs', 'azure'], {
      errorMap: () => ({ message: "Le provider vocal doit être elevenlabs ou azure" })
    }).default('elevenlabs'),
    voice_id: z.string().min(1, "L'ID de la voix est obligatoire"),
    stability: z.number().min(0).max(1).default(0.5),
    similarity_boost: z.number().min(0).max(1).default(0.5)
  })
});

/**
 * Fonctionnalités de l'assistant
 */
export const AssistantFeaturesSchema = z.object({
  canTakeReservations: z.boolean().default(false),
  reservationDetails: z.string().max(1000, "Les détails de réservation doivent faire <= 1000 caractères").optional(),
  canTakeAppointments: z.boolean().default(false),
  appointmentDetails: z.string().max(1000, "Les détails de rendez-vous doivent faire <= 1000 caractères").optional(),
  canTransferCall: z.boolean().default(false),
  transferPhoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Le numéro de transfert doit être au format international").optional(),
  canTakeOrders: z.boolean().default(false),
  orderDetails: z.string().max(1000, "Les détails de commande doivent faire <= 1000 caractères").optional(),
  canProvideQuotes: z.boolean().default(false),
  quoteDetails: z.string().max(1000, "Les détails de devis doivent faire <= 1000 caractères").optional()
});

/**
 * Informations clés de l'entreprise
 */
export const BusinessInformationSchema = z.object({
  companyName: z.string().max(100, "Le nom de l'entreprise doit faire <= 100 caractères").optional(),
  address: z.string().max(200, "L'adresse doit faire <= 200 caractères").optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Le numéro de téléphone doit être au format international").optional(),
  email: z.string().email("L'email doit être valide").optional(),
  website: z.string().url("Le site web doit être une URL valide").optional(),
  openingHours: z.string().max(500, "Les horaires d'ouverture doivent faire <= 500 caractères").optional(),
  services: z.array(z.string().max(100, "Chaque service doit faire <= 100 caractères")).max(10, "Maximum 10 services").optional(),
  specialties: z.array(z.string().max(100, "Chaque spécialité doit faire <= 100 caractères")).max(5, "Maximum 5 spécialités").optional(),
  pricing: z.string().max(1000, "Les informations tarifaires doivent faire <= 1000 caractères").optional(),
  policies: z.string().max(1000, "Les politiques doivent faire <= 1000 caractères").optional()
});

/**
 * Informations clés à communiquer par l'assistant
 */
export const KeyInformationSchema = z.object({
  faq: z.array(z.object({
    question: z.string().min(1, "La question est obligatoire").max(200, "La question doit faire <= 200 caractères"),
    answer: z.string().min(1, "La réponse est obligatoire").max(500, "La réponse doit faire <= 500 caractères")
  })).max(20, "Maximum 20 questions FAQ").optional(),
  promotions: z.array(z.string().max(200, "Chaque promotion doit faire <= 200 caractères")).max(5, "Maximum 5 promotions").optional(),
  importantNotes: z.array(z.string().max(300, "Chaque note doit faire <= 300 caractères")).max(10, "Maximum 10 notes importantes").optional()
});

/**
 * Configuration complète de l'assistant (AssistantConfig)
 * Schéma principal généré par l'agent Vapi configurateur
 */
export const AssistantConfigSchema = z.object({
  assistantProfile: AssistantProfileSchema,
  vapiConfig: VapiConfigSchema,
  features: AssistantFeaturesSchema,
  businessInformation: BusinessInformationSchema,
  keyInformation: KeyInformationSchema,
  metadata: z.object({
    createdAt: z.string().datetime({ message: "createdAt doit être une date ISO valide" }),
    version: z.string().default('1.0.0'),
    configuredBy: z.enum(['vapi_configurateur'], { 
      errorMap: () => ({ message: "configuredBy doit être 'vapi_configurateur'" })
    }).default('vapi_configurateur'),
    sector: z.enum([
      'restaurant',
      'salon_coiffure',
      'institut_beaute', 
      'plombier',
      'electricien',
      'chauffagiste',
      'artisan_batiment',
      'avocat',
      'consultant',
      'coach',
      'therapeute',
      'boutique_vetements',
      'boutique_generale',
      'commerce_detail',
      'service_client_pme',
      'autre'
    ], {
      errorMap: () => ({ message: "Le secteur doit être l'une des valeurs prédéfinies" })
    })
  })
});

/**
 * Requête pour créer un assistant avec numéro de téléphone
 * Utilisée par l'outil MCP `createAssistantAndProvisionNumber`
 */
export const CreateAssistantWithPhoneRequestSchema = z.object({
  assistantName: z.string().min(1, "Le nom de l'assistant est obligatoire").max(100, "Le nom doit faire <= 100 caractères"),
  businessType: z.string().min(1, "Le type d'activité est obligatoire").max(50, "Le type d'activité doit faire <= 50 caractères"),
  assistantTone: z.string().min(1, "Le ton de l'assistant est obligatoire"),
  firstMessage: z.string().min(1, "Le message d'accueil est obligatoire").max(500, "Le message d'accueil doit faire <= 500 caractères"),
  systemPromptCore: z.string().min(1, "Le prompt système est obligatoire").max(4000, "Le prompt système doit faire <= 4000 caractères"),
  canTakeReservations: z.boolean().default(false),
  reservationDetails: z.string().max(1000, "Les détails de réservation doivent faire <= 1000 caractères").optional(),
  canTakeAppointments: z.boolean().default(false),
  appointmentDetails: z.string().max(1000, "Les détails de rendez-vous doivent faire <= 1000 caractères").optional(),
  canTransferCall: z.boolean().default(false),
  transferPhoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Le numéro de transfert doit être au format international").optional(),
  keyInformation: z.array(z.string().max(300, "Chaque information clé doit faire <= 300 caractères")).max(10, "Maximum 10 informations clés").optional(),
  endCallMessage: z.string().max(300, "Le message de fin d'appel doit faire <= 300 caractères").optional(),
  language: z.string().default('fr-FR').refine(
    (val: string) => /^[a-z]{2}-[A-Z]{2}$/.test(val),
    { message: "La langue doit être au format ISO (ex: fr-FR, en-US)" }
  ),
  // Informations optionnelles de l'entreprise
  companyName: z.string().max(100, "Le nom de l'entreprise doit faire <= 100 caractères").optional(),
  address: z.string().max(200, "L'adresse doit faire <= 200 caractères").optional(),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Le numéro de téléphone doit être au format international").optional(),
  email: z.string().email("L'email doit être valide").optional(),
  openingHours: z.string().max(500, "Les horaires d'ouverture doivent faire <= 500 caractères").optional()
});

/**
 * Réponse de création d'assistant avec numéro
 */
export const CreateAssistantWithPhoneResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    assistant: z.object({
      id: z.string().uuid("L'ID de l'assistant doit être un UUID valide"),
      name: z.string(),
      vapi_id: z.string().min(1, "L'ID Vapi est obligatoire")
    }),
    phoneNumber: z.object({
      id: z.string().uuid("L'ID du numéro doit être un UUID valide"),
      number: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Le numéro doit être au format international"),
      twilio_sid: z.string().min(1, "Le SID Twilio est obligatoire"),
      country: z.string().length(2, "Le code pays doit faire 2 caractères"),
      is_active: z.boolean()
    }),
    assistantConfig: AssistantConfigSchema
  }),
  message: z.string().optional()
});

// ===== SCHÉMAS POUR LES PROMPTS SPÉCIALISÉS =====

/**
 * Contexte de secteur pour adapter les prompts
 */
export const SectorContextSchema = z.object({
  sector: z.enum([
    'restaurant',
    'salon_coiffure',
    'institut_beaute',
    'plombier',
    'electricien', 
    'chauffagiste',
    'artisan_batiment',
    'avocat',
    'consultant',
    'coach',
    'therapeute',
    'boutique_vetements',
    'boutique_generale',
    'commerce_detail',
    'service_client_pme',
    'general'
  ]),
  promptTemplate: z.string().min(1, "Le template de prompt est obligatoire"),
  specificQuestions: z.array(z.string()).max(20, "Maximum 20 questions spécifiques"),
  defaultFeatures: z.object({
    canTakeReservations: z.boolean().default(false),
    canTakeAppointments: z.boolean().default(false),
    canTransferCall: z.boolean().default(false),
    canTakeOrders: z.boolean().default(false),
    canProvideQuotes: z.boolean().default(false)
  })
});

// ===== TYPES TYPESCRIPT INFÉRÉS =====

export type AssistantProfile = z.infer<typeof AssistantProfileSchema>;
export type VapiConfig = z.infer<typeof VapiConfigSchema>;
export type AssistantFeatures = z.infer<typeof AssistantFeaturesSchema>;
export type BusinessInformation = z.infer<typeof BusinessInformationSchema>;
export type KeyInformation = z.infer<typeof KeyInformationSchema>;
export type AssistantConfig = z.infer<typeof AssistantConfigSchema>;

export type CreateAssistantWithPhoneRequest = z.infer<typeof CreateAssistantWithPhoneRequestSchema>;
export type CreateAssistantWithPhoneResponse = z.infer<typeof CreateAssistantWithPhoneResponseSchema>;
export type SectorContext = z.infer<typeof SectorContextSchema>;

// ===== UTILITAIRES SPÉCIALISÉS =====

/**
 * Valide un AssistantConfig complet
 */
export function validateAssistantConfig(data: unknown): { success: true; data: AssistantConfig } | { success: false; error: string } {
  try {
    const validatedData = AssistantConfigSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err: z.ZodIssue) => `${err.path.join('.')}: ${err.message}`).join(', ');
      return { success: false, error: `Erreur de validation AssistantConfig: ${errorMessages}` };
    }
    return { success: false, error: 'Erreur de validation inconnue' };
  }
}

/**
 * Génère un prompt système basé sur l'AssistantConfig
 */
export function generateSystemPrompt(config: AssistantConfig): string {
  const { assistantProfile, businessInformation, features, keyInformation } = config;
  
  let prompt = `Tu es ${assistantProfile.name}, un assistant vocal IA pour une entreprise de type ${assistantProfile.businessType}. `;
  prompt += `Ton style de communication est ${assistantProfile.tone}. `;
  
  if (businessInformation.companyName) {
    prompt += `Tu représentes ${businessInformation.companyName}. `;
  }
  
  if (businessInformation.services && businessInformation.services.length > 0) {
    prompt += `Les principaux services proposés sont : ${businessInformation.services.join(', ')}. `;
  }
  
  if (features.canTakeReservations) {
    prompt += `Tu peux prendre des réservations. `;
    if (features.reservationDetails) {
      prompt += `Détails pour les réservations : ${features.reservationDetails}. `;
    }
  }
  
  if (features.canTakeAppointments) {
    prompt += `Tu peux prendre des rendez-vous. `;
    if (features.appointmentDetails) {
      prompt += `Détails pour les rendez-vous : ${features.appointmentDetails}. `;
    }
  }
  
  if (features.canTransferCall && features.transferPhoneNumber) {
    prompt += `Si nécessaire, tu peux transférer l'appel au ${features.transferPhoneNumber}. `;
  }
  
  if (businessInformation.openingHours) {
    prompt += `Horaires d'ouverture : ${businessInformation.openingHours}. `;
  }
  
  if (businessInformation.address) {
    prompt += `Adresse : ${businessInformation.address}. `;
  }
  
  if (keyInformation.faq && keyInformation.faq.length > 0) {
    prompt += `Questions fréquentes : `;
    keyInformation.faq.forEach((faq: { question: string; answer: string }) => {
      prompt += `Q: ${faq.question} R: ${faq.answer}. `;
    });
  }
  
  prompt += `Sois toujours poli, professionnel et utile. Réponds en français.`;
  
  return prompt;
}

/**
 * Convertit une requête de création en AssistantConfig complet
 */
export function createRequestToAssistantConfig(request: CreateAssistantWithPhoneRequest): AssistantConfig {
  return {
    assistantProfile: {
      name: request.assistantName,
      businessType: request.businessType,
      tone: request.assistantTone as AssistantProfile['tone'], // Type assertion avec le bon type
      language: request.language
    },
    vapiConfig: {
      firstMessage: request.firstMessage,
      systemPrompt: request.systemPromptCore,
      endCallMessage: request.endCallMessage,
      model: {
        provider: 'openai',
        model: 'gpt-4o',
        temperature: 0.7,
        max_tokens: 1000
      },
      voice: {
        provider: 'elevenlabs',
        voice_id: '21m00Tcm4TlvDq8ikWAM', // Voix par défaut
        stability: 0.5,
        similarity_boost: 0.5
      }
    },
    features: {
      canTakeReservations: request.canTakeReservations,
      reservationDetails: request.reservationDetails,
      canTakeAppointments: request.canTakeAppointments,
      appointmentDetails: request.appointmentDetails,
      canTransferCall: request.canTransferCall,
      transferPhoneNumber: request.transferPhoneNumber,
      canTakeOrders: false,
      canProvideQuotes: false
    },
    businessInformation: {
      companyName: request.companyName,
      address: request.address,
      phoneNumber: request.phoneNumber,
      email: request.email,
      openingHours: request.openingHours
    },
    keyInformation: {
      importantNotes: request.keyInformation
    },
    metadata: {
      createdAt: new Date().toISOString(),
      version: '1.0.0',
      configuredBy: 'vapi_configurateur',
      sector: determineSector(request.businessType)
    }
  };
}

/**
 * Détermine le secteur basé sur le type d'activité
 */
function determineSector(businessType: string): AssistantConfig['metadata']['sector'] {
  const lowerType = businessType.toLowerCase();
  
  if (lowerType.includes('restaurant') || lowerType.includes('pizzeria') || lowerType.includes('café')) {
    return 'restaurant';
  }
  if (lowerType.includes('coiffure') || lowerType.includes('salon')) {
    return 'salon_coiffure';
  }
  if (lowerType.includes('beauté') || lowerType.includes('esthétique')) {
    return 'institut_beaute';
  }
  if (lowerType.includes('plombier')) {
    return 'plombier';
  }
  if (lowerType.includes('électricien')) {
    return 'electricien';
  }
  if (lowerType.includes('chauffage')) {
    return 'chauffagiste';
  }
  if (lowerType.includes('avocat')) {
    return 'avocat';
  }
  if (lowerType.includes('consultant')) {
    return 'consultant';
  }
  if (lowerType.includes('coach')) {
    return 'coach';
  }
  if (lowerType.includes('boutique') || lowerType.includes('magasin')) {
    return 'boutique_generale';
  }
  
  return 'autre';
} 