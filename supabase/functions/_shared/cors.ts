/**
 * Gestion des headers CORS pour les Edge Functions Supabase
 * Permet les requêtes cross-origin pour l'API
 */

// Headers CORS standard pour toutes les réponses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

// Fonction utilitaire pour ajouter les headers CORS à une réponse existante
export function addCorsHeaders(response: Response): Response {
  const newResponse = new Response(response.body, response)
  
  Object.entries(corsHeaders).forEach(([key, value]) => {
    newResponse.headers.set(key, value)
  })
  
  return newResponse
}

// Gestionnaire de requêtes OPTIONS pour le preflight CORS
export function handleCorsPreflightRequest(): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
} 