/**
 * Fonction Supabase Edge pour les métriques et statistiques d'utilisation Vapi
 * Endpoints:
 * - GET /calls - Obtient des métriques sur les appels
 * - GET /usage - Récupère les statistiques d'utilisation
 * - GET /calls/:id/timeline - Obtient la chronologie d'un appel
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from './_shared/cors.js'
import { errorResponse, notFoundError } from './_shared/errors.js'
import { authenticate } from './_shared/auth.js'
import { validateInput, ValidationSchema } from './_shared/validation.js'

// Configuration de l'accès à l'API Vapi
// @deno-types="https://esm.sh/@vapi-ai/server-sdk@1.2.1"
import { VapiClient } from 'https://esm.sh/@vapi-ai/server-sdk@1.2.1'

// Utilitaire pour accéder à Deno avec typage
const DenoEnv = {
  get: (key: string): string | undefined => {
    // @ts-ignore - Deno existe dans l'environnement d'exécution
    return typeof Deno !== 'undefined' ? Deno.env.get(key) : undefined;
  }
};

const vapiApiKey = DenoEnv.get('VAPI_API_KEY') || ''
const vapiClient = new VapiClient({ token: vapiApiKey })

// Schéma de validation pour les paramètres de métriques d'appels
const callMetricsSchema: ValidationSchema = {
  start_date: { 
    type: 'string',
    pattern: /^\d{4}-\d{2}-\d{2}$/
  },
  end_date: { 
    type: 'string',
    pattern: /^\d{4}-\d{2}-\d{2}$/
  },
  assistant_id: { 
    type: 'string'
  },
  phone_number_id: { 
    type: 'string'
  }
}

// Schéma de validation pour les paramètres de statistiques d'utilisation
const usageStatsSchema: ValidationSchema = {
  start_date: { 
    type: 'string',
    pattern: /^\d{4}-\d{2}-\d{2}$/
  },
  end_date: { 
    type: 'string',
    pattern: /^\d{4}-\d{2}-\d{2}$/
  }
}

serve(async (req: Request) => {
  // Gestion des requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Authentification de l'utilisateur
    const user = await authenticate(req)
    
    // Récupération de l'URL pour le routage
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(segment => segment)
    
    // Vérification qu'on a au moins le segment 'analytics'
    if (pathSegments.length === 0 || pathSegments[0] !== 'analytics') {
      return new Response(JSON.stringify({ 
        error: 'Chemin d\'URL invalide' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /analytics/calls - Obtention des métriques sur les appels
    if (req.method === 'GET' && pathSegments.length === 2 && pathSegments[1] === 'calls') {
      // Récupération des paramètres de requête
      const queryParams: Record<string, any> = {}
      for (const [key, value] of url.searchParams.entries()) {
        queryParams[key] = value
      }
      
      // Validation des paramètres
      validateInput(queryParams, callMetricsSchema)
      
      // Récupération des métriques via l'API Vapi
      const callMetrics = await vapiClient.analytics.getCallMetrics(queryParams)
      
      return new Response(JSON.stringify({ data: callMetrics }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /analytics/usage - Récupération des statistiques d'utilisation
    if (req.method === 'GET' && pathSegments.length === 2 && pathSegments[1] === 'usage') {
      // Récupération des paramètres de requête
      const queryParams: Record<string, any> = {}
      for (const [key, value] of url.searchParams.entries()) {
        queryParams[key] = value
      }
      
      // Validation des paramètres
      validateInput(queryParams, usageStatsSchema)
      
      // Récupération des statistiques d'utilisation via l'API Vapi
      const usageStats = await vapiClient.analytics.getUsageStats(queryParams)
      
      return new Response(JSON.stringify({ data: usageStats }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /analytics/calls/:id/timeline - Obtention de la chronologie d'un appel
    if (req.method === 'GET' && pathSegments.length === 4 && 
        pathSegments[1] === 'calls' && pathSegments[3] === 'timeline') {
      const callId = pathSegments[2]
      
      // Récupération de la chronologie de l'appel via l'API Vapi
      const timeline = await vapiClient.analytics.getCallTimeline(callId)
      
      if (!timeline) {
        throw notFoundError(`Chronologie de l'appel avec l'ID ${callId} non trouvée`)
      }
      
      return new Response(JSON.stringify({ data: timeline }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Méthode non supportée
    return new Response(JSON.stringify({ 
      error: 'Méthode non supportée' 
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
    
  } catch (error) {
    return errorResponse(error)
  }
}) 