import { z } from 'zod';

// ===== SCHÉMAS DE BASE =====

/**
 * Schéma UUID conforme à OpenAPI
 */
export const UuidSchema = z.string().uuid({
  message: "Doit être un UUID valide"
});

/**
 * Schéma de pagination conforme à OpenAPI
 */
export const PaginationSchema = z.object({
  page: z.number().int().min(1, "La page doit être >= 1"),
  limit: z.number().int().min(1, "La limite doit être >= 1").max(100, "La limite doit être <= 100"),
  total: z.number().int().min(0, "Le total doit être >= 0"),
  has_more: z.boolean()
});

// ===== SCHÉMAS VAPI =====

/**
 * Modèle Vapi conforme à OpenAPI
 */
export const VapiModelSchema = z.object({
  provider: z.enum(['openai', 'anthropic', 'together-ai'], {
    errorMap: () => ({ message: "Le provider doit être openai, anthropic ou together-ai" })
  }),
  model: z.string().min(1, "Le modèle est obligatoire"),
  temperature: z.number().min(0, "La température doit être >= 0").max(2, "La température doit être <= 2").optional(),
  max_tokens: z.number().int().min(1, "max_tokens doit être >= 1").optional()
});

/**
 * Voix Vapi conforme à OpenAPI
 */
export const VapiVoiceSchema = z.object({
  provider: z.enum(['elevenlabs', 'azure', 'google'], {
    errorMap: () => ({ message: "Le provider doit être elevenlabs, azure ou google" })
  }),
  voice_id: z.string().min(1, "voice_id est obligatoire"),
  stability: z.number().min(0, "La stabilité doit être >= 0").max(1, "La stabilité doit être <= 1").optional(),
  similarity_boost: z.number().min(0, "similarity_boost doit être >= 0").max(1, "similarity_boost doit être <= 1").optional()
});

// ===== ENTITÉS PRINCIPALES =====

/**
 * Assistant conforme à OpenAPI
 */
export const AssistantSchema = z.object({
  id: UuidSchema,
  name: z.string().min(1, "Le nom est obligatoire").max(100, "Le nom doit faire <= 100 caractères"),
  model: z.union([
    z.string().min(1, "Le modèle est obligatoire"),
    VapiModelSchema
  ]).optional(),
  voice: z.union([
    z.string().min(1, "La voix est obligatoire"),
    VapiVoiceSchema
  ]).optional(),
  firstMessage: z.string().optional(),
  created_at: z.string().datetime({ message: "created_at doit être une date ISO valide" }),
  updated_at: z.string().datetime({ message: "updated_at doit être une date ISO valide" })
});

/**
 * Base de connaissances conforme à OpenAPI
 */
export const KnowledgeBaseSchema = z.object({
  id: UuidSchema,
  name: z.string().min(1, "Le nom est obligatoire").max(100, "Le nom doit faire <= 100 caractères"),
  description: z.string().max(500, "La description doit faire <= 500 caractères").optional(),
  created_at: z.string().datetime({ message: "created_at doit être une date ISO valide" }),
  updated_at: z.string().datetime({ message: "updated_at doit être une date ISO valide" })
});

// ===== SCHÉMAS DE REQUÊTE =====

/**
 * Création d'assistant conforme à OpenAPI
 */
export const AssistantCreateRequestSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire").max(100, "Le nom doit faire <= 100 caractères"),
  model: z.union([
    z.string().min(1, "Le modèle est obligatoire"),
    VapiModelSchema
  ]).optional(),
  voice: z.union([
    z.string().min(1, "La voix est obligatoire"),
    VapiVoiceSchema
  ]).optional(),
  firstMessage: z.string().optional()
});

/**
 * Mise à jour d'assistant conforme à OpenAPI
 */
export const AssistantUpdateRequestSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire").max(100, "Le nom doit faire <= 100 caractères").optional(),
  model: z.union([
    z.string().min(1, "Le modèle est obligatoire"),
    VapiModelSchema
  ]).optional(),
  voice: z.union([
    z.string().min(1, "La voix est obligatoire"),
    VapiVoiceSchema
  ]).optional(),
  firstMessage: z.string().optional()
});

/**
 * Création de base de connaissances conforme à OpenAPI
 */
export const KnowledgeBaseCreateRequestSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire").max(100, "Le nom doit faire <= 100 caractères"),
  description: z.string().max(500, "La description doit faire <= 500 caractères").optional()
});

/**
 * Mise à jour de base de connaissances conforme à OpenAPI
 */
export const KnowledgeBaseUpdateRequestSchema = z.object({
  name: z.string().min(1, "Le nom est obligatoire").max(100, "Le nom doit faire <= 100 caractères").optional(),
  description: z.string().max(500, "La description doit faire <= 500 caractères").optional()
});

/**
 * Requête de recherche dans base de connaissances conforme à OpenAPI
 */
export const KnowledgeBaseQueryRequestSchema = z.object({
  query: z.string().min(1, "La requête est obligatoire").max(1000, "La requête doit faire <= 1000 caractères"),
  limit: z.number().int().min(1, "La limite doit être >= 1").max(50, "La limite doit être <= 50").default(10)
});

// ===== SCHÉMAS DE RÉPONSE =====

/**
 * Réponse paginée générique conforme à OpenAPI
 */
export const PaginatedResponseSchema = z.object({
  data: z.array(z.unknown()),
  pagination: PaginationSchema
});

/**
 * Réponse simple générique conforme à OpenAPI
 */
export const SingleResponseSchema = z.object({
  data: z.unknown()
});

/**
 * Réponse de succès conforme à OpenAPI
 */
export const SuccessResponseSchema = z.object({
  success: z.literal(true)
});

/**
 * Réponse d'erreur conforme à OpenAPI
 */
export const ErrorResponseSchema = z.object({
  error: z.object({
    message: z.string().min(1, "Le message d'erreur est obligatoire"),
    code: z.string().optional(),
    details: z.record(z.unknown()).optional()
  })
});

/**
 * Réponse paginée d'assistants conforme à OpenAPI
 */
export const PaginatedAssistantsResponseSchema = z.object({
  data: z.array(AssistantSchema),
  pagination: PaginationSchema
});

/**
 * Réponse simple d'assistant conforme à OpenAPI
 */
export const SingleAssistantResponseSchema = z.object({
  data: AssistantSchema
});

/**
 * Réponse paginée de bases de connaissances conforme à OpenAPI
 */
export const PaginatedKnowledgeBasesResponseSchema = z.object({
  data: z.array(KnowledgeBaseSchema),
  pagination: PaginationSchema
});

/**
 * Réponse simple de base de connaissances conforme à OpenAPI
 */
export const SingleKnowledgeBaseResponseSchema = z.object({
  data: KnowledgeBaseSchema
});

/**
 * Résultat de recherche dans base de connaissances conforme à OpenAPI
 */
export const KnowledgeBaseSearchResultSchema = z.object({
  content: z.string(),
  score: z.number().min(0, "Le score doit être >= 0").max(1, "Le score doit être <= 1"),
  metadata: z.record(z.unknown()).optional()
});

/**
 * Réponse de recherche dans base de connaissances conforme à OpenAPI
 */
export const KnowledgeBaseQueryResponseSchema = z.object({
  data: z.object({
    results: z.array(KnowledgeBaseSearchResultSchema)
  })
});

// ===== SCHÉMAS DE PARAMÈTRES =====

/**
 * Paramètres de pagination conforme à OpenAPI
 */
export const PaginationParamsSchema = z.object({
  page: z.number().int().min(1, "La page doit être >= 1").default(1),
  limit: z.number().int().min(1, "La limite doit être >= 1").max(100, "La limite doit être <= 100").default(20)
});

/**
 * Paramètre UUID de chemin conforme à OpenAPI
 */
export const UuidPathParamSchema = z.object({
  id: UuidSchema
});

// ===== TYPES TYPESCRIPT INFÉRÉS =====

export type Assistant = z.infer<typeof AssistantSchema>;
export type KnowledgeBase = z.infer<typeof KnowledgeBaseSchema>;
export type VapiModel = z.infer<typeof VapiModelSchema>;
export type VapiVoice = z.infer<typeof VapiVoiceSchema>;

export type AssistantCreateRequest = z.infer<typeof AssistantCreateRequestSchema>;
export type AssistantUpdateRequest = z.infer<typeof AssistantUpdateRequestSchema>;
export type KnowledgeBaseCreateRequest = z.infer<typeof KnowledgeBaseCreateRequestSchema>;
export type KnowledgeBaseUpdateRequest = z.infer<typeof KnowledgeBaseUpdateRequestSchema>;
export type KnowledgeBaseQueryRequest = z.infer<typeof KnowledgeBaseQueryRequestSchema>;

export type PaginatedAssistantsResponse = z.infer<typeof PaginatedAssistantsResponseSchema>;
export type SingleAssistantResponse = z.infer<typeof SingleAssistantResponseSchema>;
export type PaginatedKnowledgeBasesResponse = z.infer<typeof PaginatedKnowledgeBasesResponseSchema>;
export type SingleKnowledgeBaseResponse = z.infer<typeof SingleKnowledgeBaseResponseSchema>;
export type KnowledgeBaseQueryResponse = z.infer<typeof KnowledgeBaseQueryResponseSchema>;
export type KnowledgeBaseSearchResult = z.infer<typeof KnowledgeBaseSearchResultSchema>;

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type SuccessResponse = z.infer<typeof SuccessResponseSchema>;
export type PaginationParams = z.infer<typeof PaginationParamsSchema>;
export type UuidPathParam = z.infer<typeof UuidPathParamSchema>;

// ===== UTILITAIRES DE VALIDATION =====

/**
 * Valide et parse une requête avec gestion d'erreur standardisée
 */
export function validateRequest<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: ErrorResponse } {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: {
          error: {
            message: "Erreur de validation des données",
            code: "VALIDATION_ERROR",
            details: error.errors.reduce((acc, err) => {
              const path = err.path.join('.');
              acc[path] = err.message;
              return acc;
            }, {} as Record<string, string>)
          }
        }
      };
    }
    
    return {
      success: false,
      error: {
        error: {
          message: "Erreur de validation inconnue",
          code: "UNKNOWN_VALIDATION_ERROR"
        }
      }
    };
  }
}

/**
 * Valide et parse des paramètres de requête avec gestion d'erreur
 */
export function validateQueryParams<T>(schema: z.ZodSchema<T>, params: Record<string, string | string[] | undefined>): { success: true; data: T } | { success: false; error: ErrorResponse } {
  // Conversion des paramètres de requête en types appropriés
  const processedParams: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    
    if (Array.isArray(value)) {
      processedParams[key] = value;
    } else {
      // Tentative de conversion en nombre si c'est un nombre
      const numValue = Number(value);
      if (!isNaN(numValue) && isFinite(numValue)) {
        processedParams[key] = numValue;
      } else {
        processedParams[key] = value;
      }
    }
  }
  
  return validateRequest(schema, processedParams);
}

/**
 * Crée une réponse d'erreur standardisée
 */
export function createErrorResponse(message: string, code?: string, details?: Record<string, unknown>): ErrorResponse {
  return {
    error: {
      message,
      code,
      details
    }
  };
}

/**
 * Crée une réponse de succès standardisée
 */
export function createSuccessResponse(): SuccessResponse {
  return {
    success: true
  };
}

/**
 * Crée une réponse paginée standardisée
 */
export function createPaginatedResponse<T>(data: T[], pagination: { page: number; limit: number; total: number }): { data: T[]; pagination: { page: number; limit: number; total: number; has_more: boolean } } {
  return {
    data,
    pagination: {
      ...pagination,
      has_more: pagination.page * pagination.limit < pagination.total
    }
  };
}

/**
 * Crée une réponse simple standardisée
 */
export function createSingleResponse<T>(data: T): { data: T } {
  return {
    data
  };
} 