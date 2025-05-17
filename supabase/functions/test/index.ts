/**
 * Fonction Supabase Edge pour tester le déploiement et la configuration
 * 
 * Endpoints:
 * - GET /test - Vérifie que la fonction est correctement déployée et que la clé API Vapi est configurée
 * 
 * Variables d'Entrée (Request):
 * 
 * GET /test:
 *   - Headers: aucun header spécifique requis (fonction accessible sans authentification)
 * 
 * Variables de Sortie (Response):
 * 
 * GET /test:
 *   - Succès: {
 *       success: true,
 *       message: string, // Message de confirmation
 *       vapi_key_status: string, // 'Set' ou 'Not set'
 *       vapi_key_preview: string // Version masquée de la clé API
 *     }
 *   - Erreur: {
 *       error: string // Message d'erreur
 *     }
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// This function has been set to not require authentication in the Supabase dashboard

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Simple test response with the Vapi API key (masked for security)
    const vapiApiKey = Deno.env.get('VAPI_API_KEY') || ''
    const maskedKey = vapiApiKey ? 
      `${vapiApiKey.substring(0, 4)}...${vapiApiKey.substring(vapiApiKey.length - 4)}` : 
      'Not set'
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Supabase Edge Function deployed successfully!',
        vapi_key_status: vapiApiKey ? 'Set' : 'Not set',
        vapi_key_preview: maskedKey
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    )
  }
}) 