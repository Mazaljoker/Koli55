/**
 * Gestion standardisée des erreurs pour les Edge Functions
 * Formatage cohérent des messages d'erreur retournés au client
 */

import { corsHeaders } from './cors.ts'

// Types d'erreurs standards
export enum ErrorType {
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  INTERNAL = 'INTERNAL_ERROR',
  VAPI = 'VAPI_API_ERROR',
}

// Structure d'une erreur formatée
export interface FormattedError {
  code: ErrorType;
  message: string;
  details?: Record<string, unknown>;
}

// Codes HTTP associés aux types d'erreurs
const errorStatusCodes: Record<ErrorType, number> = {
  [ErrorType.AUTHENTICATION]: 401,
  [ErrorType.AUTHORIZATION]: 403,
  [ErrorType.VALIDATION]: 400,
  [ErrorType.NOT_FOUND]: 404,
  [ErrorType.INTERNAL]: 500,
  [ErrorType.VAPI]: 502,
}

// Fonction pour générer une réponse d'erreur standardisée
export function errorResponse(error: unknown): Response {
  console.error('Error in Edge Function:', error)
  
  // Erreur formatée par défaut
  let formattedError: FormattedError = {
    code: ErrorType.INTERNAL,
    message: 'Une erreur interne est survenue',
  }

  // Si l'erreur est déjà formatée, on la réutilise
  if (error && typeof error === 'object' && 'code' in error && 'message' in error) {
    formattedError = error as FormattedError
  } 
  // Sinon on utilise le message d'erreur si disponible
  else if (error instanceof Error) {
    formattedError.message = error.message
    
    // Cas spécial pour les erreurs Vapi
    if (error.message.includes('Vapi') || error.message.includes('vapi')) {
      formattedError.code = ErrorType.VAPI
    }
  }

  const statusCode = errorStatusCodes[formattedError.code] || 500

  return new Response(
    JSON.stringify(formattedError),
    {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    }
  )
}

// Fonctions utilitaires pour générer des erreurs typées
export function authenticationError(message: string, details?: Record<string, unknown>): FormattedError {
  return { code: ErrorType.AUTHENTICATION, message, details }
}

export function authorizationError(message: string, details?: Record<string, unknown>): FormattedError {
  return { code: ErrorType.AUTHORIZATION, message, details }
}

export function validationError(message: string, details?: Record<string, unknown>): FormattedError {
  return { code: ErrorType.VALIDATION, message, details }
}

export function notFoundError(message: string, details?: Record<string, unknown>): FormattedError {
  return { code: ErrorType.NOT_FOUND, message, details }
}

export function internalError(message: string, details?: Record<string, unknown>): FormattedError {
  return { code: ErrorType.INTERNAL, message, details }
}

export function vapiError(message: string, details?: Record<string, unknown>): FormattedError {
  return { code: ErrorType.VAPI, message, details }
} 