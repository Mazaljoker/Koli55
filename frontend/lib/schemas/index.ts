/**
 * Schémas de validation centralisés pour l'application AlloKoli
 * 
 * Ce module exporte tous les schémas Zod utilisés dans l'application
 * pour une validation cohérente des données.
 */

// Export des schémas d'assistants
export {
  modelSchema,
  voiceSchema,
  recordingSettingsSchema,
  createAssistantSchema,
  updateAssistantSchema,
  listAssistantsSchema,
  assistantResponseSchema,
  validateCreateAssistant,
  type CreateAssistantInput,
  type UpdateAssistantInput,
  type ListAssistantsParams,
  type ModelConfig,
  type VoiceConfig,
  type RecordingSettings,
  type AssistantResponse,
} from './assistant'

// Schémas communs pour l'API
import { z } from 'zod'

export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.unknown().optional(),
  error: z.object({
    message: z.string(),
    details: z.array(z.object({
      field: z.string(),
      message: z.string(),
    })).optional(),
  }).optional(),
})

export const paginationSchema = z.object({
  page: z.number().positive().default(1),
  limit: z.number().positive().max(100).default(20),
  total: z.number().nonnegative(),
  totalPages: z.number().nonnegative(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
})

export const paginatedResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(z.unknown()),
  pagination: paginationSchema,
})

// Types utilitaires
export type ApiResponse<T = unknown> = {
  success: boolean
  message: string
  data?: T
  error?: {
    message: string
    details?: Array<{ field: string; message: string }>
  }
}

export type PaginatedResponse<T = unknown> = {
  success: boolean
  message: string
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Utilitaires de validation
export function createApiResponse<T>(
  success: boolean,
  message: string,
  data?: T,
  error?: { message: string; details?: Array<{ field: string; message: string }> }
): ApiResponse<T> {
  return { success, message, data, error }
}

export function createPaginatedResponse<T>(
  success: boolean,
  message: string,
  data: T[],
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
): PaginatedResponse<T> {
  return { success, message, data, pagination }
} 