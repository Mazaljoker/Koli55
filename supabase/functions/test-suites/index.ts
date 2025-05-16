/**
 * Fonction Supabase Edge pour la gestion des suites de tests Vapi
 * Endpoints:
 * - GET / - Liste toutes les suites de tests
 * - GET /:id - Récupère une suite de tests par ID
 * - POST / - Crée une nouvelle suite de tests
 * - PATCH /:id - Met à jour une suite de tests
 * - DELETE /:id - Supprime une suite de tests
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

// Schéma de validation pour la création d'une suite de tests
const createTestSuiteSchema: ValidationSchema = {
  name: { 
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 100
  },
  description: { 
    type: 'string',
    maxLength: 500
  },
  assistant_id: { 
    type: 'string',
    required: true
  },
  metadata: { 
    type: 'object'
  }
}

// Schéma de validation pour la mise à jour d'une suite de tests
const updateTestSuiteSchema: ValidationSchema = {
  name: { 
    type: 'string',
    minLength: 3,
    maxLength: 100
  },
  description: { 
    type: 'string',
    maxLength: 500
  },
  assistant_id: { 
    type: 'string'
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
    
    // Extraction de l'ID de la suite de tests si présent
    const testSuiteId = pathSegments.length >= 2 ? pathSegments[1] : null
    
    // GET /test-suites - Liste de toutes les suites de tests
    if (req.method === 'GET' && !testSuiteId) {
      const { page, limit } = validatePagination(url.searchParams)
      
      // Récupération des suites de tests via l'API Vapi
      const testSuites = await vapiClient.testSuites.list({
        limit,
        offset: (page - 1) * limit
      })
      
      return new Response(JSON.stringify({
        data: testSuites.data,
        pagination: {
          page,
          limit,
          total: testSuites.pagination.total || 0,
          has_more: testSuites.pagination.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /test-suites/:id - Récupération d'une suite de tests spécifique
    if (req.method === 'GET' && testSuiteId) {
      // Récupération de la suite de tests via l'API Vapi
      const testSuite = await vapiClient.testSuites.retrieve(testSuiteId)
      
      if (!testSuite) {
        throw notFoundError(`Suite de tests avec l'ID ${testSuiteId} non trouvée`)
      }
      
      return new Response(JSON.stringify({ data: testSuite }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /test-suites - Création d'une nouvelle suite de tests
    if (req.method === 'POST' && !testSuiteId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, createTestSuiteSchema)
      
      // Ajout des métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Création de la suite de tests via l'API Vapi
      const testSuite = await vapiClient.testSuites.create(validatedData)
      
      return new Response(JSON.stringify({ data: testSuite }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /test-suites/:id - Mise à jour d'une suite de tests
    if (req.method === 'PATCH' && testSuiteId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, updateTestSuiteSchema)
      
      // Mise à jour de la suite de tests via l'API Vapi
      const testSuite = await vapiClient.testSuites.update(testSuiteId, validatedData)
      
      return new Response(JSON.stringify({ data: testSuite }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /test-suites/:id - Suppression d'une suite de tests
    if (req.method === 'DELETE' && testSuiteId) {
      // Suppression de la suite de tests via l'API Vapi
      await vapiClient.testSuites.delete(testSuiteId)
      
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