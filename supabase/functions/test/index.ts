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

// Import avec directive pour type Deno
// @ts-ignore
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

// This function has been set to not require authentication in the Supabase dashboard

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
}

// Simple test endpoint pour vérifier la connectivité aux Edge Functions
const handler = async (req: Request) => {
  // Autoriser les requêtes CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Content-Type': 'application/json',
  };
  
  // Répondre aux requêtes OPTIONS (pre-flight CORS)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers });
  }
  
  // Vérifier si la clé API Vapi est configurée
  // @ts-ignore - Deno existe dans l'environnement d'exécution
  const vapiApiKey = Deno.env.get('VAPI_API_KEY') || '';
  const vapiKeyStatus = vapiApiKey ? 'Set' : 'Not set';
  const vapiKeyPreview = vapiApiKey 
    ? `${vapiApiKey.substring(0, 4)}...${vapiApiKey.substring(vapiApiKey.length - 4)}` 
    : 'Not available';
  
  // Simple réponse JSON pour confirmer que l'endpoint fonctionne
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Edge Function connectivity test successful',
      timestamp: new Date().toISOString(),
      vapi_key_status: vapiKeyStatus,
      vapi_key_preview: vapiKeyPreview,
      environment: {
        is_development: true
      }
    }),
    {
      status: 200,
      headers,
    }
  );
};

// Exposer la fonction via serve
serve(handler); 