/**
 * Helpers pour harmoniser les réponses avec le format API Vapi officiel
 * 
 * Au lieu de retourner { success: true, data: [...] }, nous retournons directement
 * le format Vapi: { data: [...] } ou l'objet directement selon l'endpoint
 */

import { corsHeaders } from './cors';

// Types pour les réponses paginées Vapi
export interface VapiPaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    has_more: boolean;
  };
}

// Types pour les réponses simples Vapi
export interface VapiSingleResponse<T> {
  data?: T;
}

// Type pour les erreurs Vapi (structure plus simple)
export interface VapiErrorResponse {
  message: string;
  code?: string;
  details?: any;
}

/**
 * Crée une réponse paginée au format Vapi
 */
export function createVapiPaginatedResponse<T>(
  data: T[],
  total: number,
  limit: number,
  page: number,
  status: number = 200
): Response {
  const has_more = (page - 1) * limit + data.length < total;
  
  const response: VapiPaginatedResponse<T> = {
    data,
    pagination: {
      total,
      has_more
    }
  };

  return new Response(JSON.stringify(response), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

/**
 * Crée une réponse simple au format Vapi (pour un seul objet)
 */
export function createVapiSingleResponse<T>(
  data: T,
  status: number = 200
): Response {
  // Pour les réponses simples, Vapi retourne directement l'objet (pas dans un wrapper "data")
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

/**
 * Crée une réponse de succès vide (pour DELETE par exemple)
 */
export function createVapiEmptyResponse(status: number = 204): Response {
  return new Response(null, {
    status,
    headers: { ...corsHeaders }
  });
}

/**
 * Crée une réponse d'erreur au format Vapi
 */
export function createVapiErrorResponse(
  message: string,
  status: number = 400,
  code?: string,
  details?: any
): Response {
  const errorResponse: VapiErrorResponse = {
    message,
    ...(code && { code }),
    ...(details && { details })
  };

  return new Response(JSON.stringify(errorResponse), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders }
  });
}

/**
 * Transforme une réponse legacy (avec success/message) en format Vapi
 */
export function transformLegacyResponse(
  legacyResponse: any,
  status: number = 200
): Response {
  // Si c'est une erreur legacy
  if (legacyResponse.success === false) {
    return createVapiErrorResponse(
      legacyResponse.message || 'Une erreur est survenue',
      status >= 400 ? status : 400,
      legacyResponse.code,
      legacyResponse.errors || legacyResponse.details
    );
  }

  // Si c'est un succès avec pagination
  if (legacyResponse.pagination) {
    return createVapiPaginatedResponse(
      legacyResponse.data || [],
      legacyResponse.pagination.total || 0,
      legacyResponse.pagination.limit || 10,
      legacyResponse.pagination.page || 1,
      status
    );
  }

  // Si c'est un succès simple
  if (legacyResponse.data !== undefined) {
    return createVapiSingleResponse(legacyResponse.data, status);
  }

  // Fallback: retourner l'objet tel quel
  return createVapiSingleResponse(legacyResponse, status);
}

/**
 * Helper pour valider et transformer les paramètres de pagination
 */
export function extractPaginationParams(url: URL): {
  limit: number;
  page: number;
  offset: number;
} {
  const page = Math.max(parseInt(url.searchParams.get('page') || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '10', 10), 1), 100);
  const offset = (page - 1) * limit;

  return { limit, page, offset };
} 