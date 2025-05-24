import { z } from 'zod'

// Schémas de base pour les modèles et voix
export const modelSchema = z.union([
  z.string().min(1, 'Le nom du modèle est obligatoire'),
  z.object({
    provider: z.string().min(1, 'Le fournisseur est obligatoire'),
    model: z.string().min(1, 'Le nom du modèle est obligatoire'),
    systemPrompt: z.string().optional(),
    temperature: z.number().min(0).max(2).optional(),
    maxTokens: z.number().positive().optional(),
  })
])

export const voiceSchema = z.union([
  z.string().min(1, 'L\'ID de la voix est obligatoire'),
  z.object({
    provider: z.string().min(1, 'Le fournisseur de voix est obligatoire'),
    voiceId: z.string().min(1, 'L\'ID de la voix est obligatoire'),
    speed: z.number().min(0.5).max(2).optional(),
    pitch: z.number().min(-20).max(20).optional(),
  })
])

// Schéma pour les paramètres d'enregistrement
export const recordingSettingsSchema = z.object({
  createRecording: z.boolean().default(false),
  saveRecording: z.boolean().default(false),
  recordingPath: z.string().optional(),
}).optional()

// Schéma principal pour créer un assistant
export const createAssistantSchema = z.object({
  name: z.string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-Z0-9\s\-_]+$/, 'Le nom ne peut contenir que des lettres, chiffres, espaces, tirets et underscores'),
  
  model: modelSchema,
  
  language: z.string()
    .min(2, 'Le code de langue doit contenir au moins 2 caractères')
    .max(5, 'Le code de langue ne peut pas dépasser 5 caractères')
    .default('fr'),
  
  voice: voiceSchema,
  
  firstMessage: z.string()
    .min(10, 'Le premier message doit contenir au moins 10 caractères')
    .max(500, 'Le premier message ne peut pas dépasser 500 caractères'),
  
  instructions: z.string()
    .min(20, 'Les instructions doivent contenir au moins 20 caractères')
    .max(2000, 'Les instructions ne peuvent pas dépasser 2000 caractères'),
  
  // Paramètres optionnels
  silenceTimeoutSeconds: z.number()
    .positive('Le timeout de silence doit être positif')
    .max(300, 'Le timeout de silence ne peut pas dépasser 5 minutes')
    .optional(),
  
  maxDurationSeconds: z.number()
    .positive('La durée maximale doit être positive')
    .max(3600, 'La durée maximale ne peut pas dépasser 1 heure')
    .optional(),
  
  endCallAfterSilence: z.boolean().optional(),
  
  voiceReflection: z.boolean().optional(),
  
  recordingSettings: recordingSettingsSchema,
  
  // Métadonnées
  tags: z.array(z.string()).optional(),
  description: z.string().max(1000, 'La description ne peut pas dépasser 1000 caractères').optional(),
})

// Schéma pour mettre à jour un assistant (tous les champs optionnels sauf l'ID)
export const updateAssistantSchema = z.object({
  id: z.string().uuid('L\'ID doit être un UUID valide'),
  name: z.string()
    .min(3, 'Le nom doit contenir au moins 3 caractères')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .optional(),
  
  model: modelSchema.optional(),
  language: z.string().min(2).max(5).optional(),
  voice: voiceSchema.optional(),
  firstMessage: z.string().min(10).max(500).optional(),
  instructions: z.string().min(20).max(2000).optional(),
  silenceTimeoutSeconds: z.number().positive().max(300).optional(),
  maxDurationSeconds: z.number().positive().max(3600).optional(),
  endCallAfterSilence: z.boolean().optional(),
  voiceReflection: z.boolean().optional(),
  recordingSettings: recordingSettingsSchema,
  tags: z.array(z.string()).optional(),
  description: z.string().max(1000).optional(),
})

// Schéma pour les paramètres de liste/pagination
export const listAssistantsSchema = z.object({
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20),
  search: z.string().optional(),
  tags: z.array(z.string()).optional(),
  orderBy: z.enum(['created_at', 'updated_at', 'name']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

// Types dérivés des schémas
export type CreateAssistantInput = z.infer<typeof createAssistantSchema>
export type UpdateAssistantInput = z.infer<typeof updateAssistantSchema>
export type ListAssistantsParams = z.infer<typeof listAssistantsSchema>
export type ModelConfig = z.infer<typeof modelSchema>
export type VoiceConfig = z.infer<typeof voiceSchema>
export type RecordingSettings = z.infer<typeof recordingSettingsSchema>

// Schémas pour les réponses API
export const assistantResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  model: modelSchema,
  language: z.string(),
  voice: voiceSchema,
  firstMessage: z.string(),
  instructions: z.string(),
  silenceTimeoutSeconds: z.number().optional(),
  maxDurationSeconds: z.number().optional(),
  endCallAfterSilence: z.boolean().optional(),
  voiceReflection: z.boolean().optional(),
  recordingSettings: recordingSettingsSchema,
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  user_id: z.string().uuid(),
  vapi_assistant_id: z.string().optional(),
})

export type AssistantResponse = z.infer<typeof assistantResponseSchema>

// Fonction de validation avec messages d'erreur français
export function validateCreateAssistant(data: unknown) {
  try {
    return {
      success: true,
      data: createAssistantSchema.parse(data),
      error: null,
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        error: {
          message: 'Données invalides',
          details: error.issues.map(issue => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        },
      }
    }
    return {
      success: false,
      data: null,
      error: { message: 'Erreur de validation inattendue' },
    }
  }
} 