/**
 * Fonction Supabase Edge pour la gestion des appels téléphoniques Vapi
 * 
 * Endpoints:
 * - GET /calls - Liste tous les appels de l'utilisateur
 * - GET /calls/:id - Récupère un appel par ID
 * - POST /calls - Crée un nouvel appel
 * - PATCH /calls/:id - Met à jour un appel existant
 * - DELETE /calls/:id - Supprime un appel
 * - POST /calls/:id/end - Termine un appel en cours
 * - GET /calls/:id/listen - Obtient un lien pour écouter un appel
 * 
 * Variables d'Entrée (Request):
 * 
 * GET /calls:
 *   - Query params: page (numéro de page), limit (nombre d'éléments par page)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * GET /calls/:id:
 *   - Path params: id (identifiant de l'appel)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * POST /calls:
 *   - Body: {
 *       assistant_id: string (obligatoire, ID de l'assistant à utiliser),
 *       phone_number_id: string (obligatoire, ID du numéro de téléphone à utiliser),
 *       to: string (obligatoire, numéro de téléphone à appeler au format E.164),
 *       metadata?: object (métadonnées personnalisées)
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * PATCH /calls/:id:
 *   - Path params: id (identifiant de l'appel)
 *   - Body: {
 *       metadata?: object (métadonnées personnalisées)
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * DELETE /calls/:id:
 *   - Path params: id (identifiant de l'appel)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * POST /calls/:id/end:
 *   - Path params: id (identifiant de l'appel)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * GET /calls/:id/listen:
 *   - Path params: id (identifiant de l'appel)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * Variables de Sortie (Response):
 * 
 * GET /calls:
 *   - Succès: {
 *       success: true,
 *       data: Call[], // Liste d'appels
 *       pagination: {
 *         total: number,
 *         limit: number,
 *         page: number,
 *         has_more: boolean
 *       }
 *     }
 *   - Erreur: { success: false, message: string }
 * 
 * GET /calls/:id:
 *   - Succès: { success: true, data: Call }
 *   - Erreur: { success: false, message: string }
 * 
 * POST /calls:
 *   - Succès: { success: true, data: Call }
 *   - Erreur: { success: false, message: string }
 * 
 * PATCH /calls/:id:
 *   - Succès: { success: true, data: Call }
 *   - Erreur: { success: false, message: string }
 * 
 * DELETE /calls/:id:
 *   - Succès: { success: true }
 *   - Erreur: { success: false, message: string }
 * 
 * POST /calls/:id/end:
 *   - Succès: { success: true, data: Call }
 *   - Erreur: { success: false, message: string }
 * 
 * GET /calls/:id/listen:
 *   - Succès: { success: true, data: { url: string } }
 *   - Erreur: { success: false, message: string }
 * 
 * Structure Call conforme à l'interface de l'API Vapi
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Check for VAPI API key
    const vapiApiKey = Deno.env.get('VAPI_API_KEY') || ''
    const maskedKey = vapiApiKey ? 
      `${vapiApiKey.substring(0, 4)}...${vapiApiKey.substring(vapiApiKey.length - 4)}` : 
      'Not set'
    
    // Return a simple response with details
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Calls function deployed successfully!',
        vapi_key_status: vapiApiKey ? 'Set' : 'Not set',
        vapi_key_preview: maskedKey,
        endpoints: {
          GET_ALL: '/calls',
          GET_ONE: '/calls/:id',
          CREATE: '/calls',
          UPDATE: '/calls/:id',
          DELETE: '/calls/:id',
          END_CALL: '/calls/:id/end',
          LISTEN: '/calls/:id/listen'
        }
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Error:', error)
      
    return new Response(
      JSON.stringify({ 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred', 
          status: 500 
        } 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      }
    )
  }
}) 