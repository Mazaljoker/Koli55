/**
 * Fonction Supabase Edge pour la gestion des exécutions de suites de tests Vapi
 * Endpoints:
 * - GET /:suiteId - Liste toutes les exécutions d'une suite
 * - GET /:suiteId/:runId - Récupère une exécution par ID
 * - POST /:suiteId - Démarre une nouvelle exécution de tests
 * - PATCH /:suiteId/:runId - Met à jour une exécution
 * - DELETE /:suiteId/:runId - Supprime une exécution
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, notFoundError, validationError } from '../shared/errors.ts'
import { authenticate } from '../shared/auth.ts'
import { validateInput, validatePagination, ValidationSchema } from '../shared/validation.ts'

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

// Schéma de validation pour le démarrage d'une exécution de tests
const startRunSchema: ValidationSchema = {
  test_ids: { 
    type: 'array',
    minLength: 1
  },
  metadata: { 
    type: 'object'
  }
}

// Schéma de validation pour la mise à jour d'une exécution de tests
const updateRunSchema: ValidationSchema = {
  status: { 
    type: 'string',
    enum: ['running', 'completed', 'failed', 'cancelled']
  },
  results: { 
    type: 'object'
  },
  metadata: { 
    type: 'object'
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
    
    // Vérification qu'on a au moins le segment 'test-suite-runs' et l'ID de la suite
    if (pathSegments.length < 2 || pathSegments[0] !== 'test-suite-runs') {
      throw validationError('Chemin d\'URL invalide')
    }
    
    // Extraction des IDs
    const suiteId = pathSegments[1]
    const runId = pathSegments.length >= 3 ? pathSegments[2] : null
    
    // GET /test-suite-runs/:suiteId - Liste de toutes les exécutions d'une suite
    if (req.method === 'GET' && !runId) {
      const { page, limit } = validatePagination(url.searchParams)
      
      // Récupération des exécutions via l'API Vapi
      const runs = await vapiClient.testSuiteRuns.list(suiteId, {
        limit,
        offset: (page - 1) * limit
      })
      
      return new Response(JSON.stringify({
        data: runs.data,
        pagination: {
          page,
          limit,
          total: runs.pagination.total || 0,
          has_more: runs.pagination.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /test-suite-runs/:suiteId/:runId - Récupération d'une exécution spécifique
    if (req.method === 'GET' && runId) {
      // Récupération de l'exécution via l'API Vapi
      const run = await vapiClient.testSuiteRuns.retrieve(suiteId, runId)
      
      if (!run) {
        throw notFoundError(`Exécution avec l'ID ${runId} non trouvée dans la suite ${suiteId}`)
      }
      
      return new Response(JSON.stringify({ data: run }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /test-suite-runs/:suiteId - Démarrage d'une nouvelle exécution de tests
    if (req.method === 'POST' && !runId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, startRunSchema)
      
      // Ajout des métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Démarrage de l'exécution via l'API Vapi
      const run = await vapiClient.testSuiteRuns.start(suiteId, validatedData)
      
      return new Response(JSON.stringify({ data: run }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /test-suite-runs/:suiteId/:runId - Mise à jour d'une exécution
    if (req.method === 'PATCH' && runId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, updateRunSchema)
      
      // Mise à jour de l'exécution via l'API Vapi
      const run = await vapiClient.testSuiteRuns.update(suiteId, runId, validatedData)
      
      return new Response(JSON.stringify({ data: run }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /test-suite-runs/:suiteId/:runId - Suppression d'une exécution
    if (req.method === 'DELETE' && runId) {
      // Suppression de l'exécution via l'API Vapi
      await vapiClient.testSuiteRuns.delete(suiteId, runId)
      
      return new Response(JSON.stringify({ success: true }), {
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