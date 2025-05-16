/**
 * Fonction Supabase Edge pour les métriques et statistiques d'utilisation Vapi
 * Endpoints:
 * - GET /calls - Obtient des métriques sur les appels
 * - GET /usage - Récupère les statistiques d'utilisation
 * - GET /calls/:id/timeline - Obtient la chronologie d'un appel
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, validationError } from '../shared/errors.ts' // notFoundError non utilisé
import { authenticate } from '../shared/auth.ts'
import { validateInput, ValidationSchema } from '../shared/validation.ts'
import { 
  vapiAnalytics,
  CallMetricsParams,
  UsageStatsParams
} from '../shared/vapi.ts'

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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    await authenticate(req) // Authentification pour tous les endpoints analytics
    const url = new URL(req.url)
    // Les segments commencent après /functions/NOM_FONCTION/
    // /analytics/calls -> pathSegments = ["calls"]
    // /analytics/usage -> pathSegments = ["usage"]
    // /analytics/calls/CALL_ID/timeline -> pathSegments = ["calls", "CALL_ID", "timeline"]
    const pathSegments = url.pathname.split('/').filter(segment => segment).slice(1);

    const mainAction = pathSegments[0]
    const callId = pathSegments[1] // Utilisé seulement pour timeline
    const subAction = pathSegments[2] // 'timeline' ou undefined

    // GET /analytics/calls - Obtention des métriques sur les appels
    if (req.method === 'GET' && mainAction === 'calls' && !callId) {
      const queryParams: CallMetricsParams = {}
      for (const [key, value] of url.searchParams.entries()) {
        queryParams[key] = value
      }
      validateInput(queryParams, callMetricsSchema)
      const callMetrics = await vapiAnalytics.getCallMetrics(queryParams)
      return new Response(JSON.stringify({ data: callMetrics }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /analytics/usage - Récupération des statistiques d'utilisation
    if (req.method === 'GET' && mainAction === 'usage') {
      const queryParams: UsageStatsParams = {}
      for (const [key, value] of url.searchParams.entries()) {
        queryParams[key] = value
      }
      validateInput(queryParams, usageStatsSchema)
      const usageStats = await vapiAnalytics.getUsageStats(queryParams)
      return new Response(JSON.stringify({ data: usageStats }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /analytics/calls/:id/timeline - Obtention de la chronologie d'un appel
    if (req.method === 'GET' && mainAction === 'calls' && callId && subAction === 'timeline') {
      const timeline = await vapiAnalytics.getCallTimeline(callId)
      // Pas besoin de vérifier !timeline car callVapiAPI lèvera une erreur si 404
      return new Response(JSON.stringify({ data: timeline }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Méthode non supportée
    return new Response(JSON.stringify({ 
      error: 'Endpoint non trouvé ou méthode non supportée' 
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
    
  } catch (error) {
    return errorResponse(error)
  }
}) 