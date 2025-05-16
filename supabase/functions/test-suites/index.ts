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
import { 
  vapiTestSuites,
  TestSuiteCreateParams,
  TestSuiteUpdateParams,
  PaginationParams
} from '../shared/vapi.ts'

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
    const pathSegments = url.pathname.split('/').filter(segment => segment).slice(1);
    
    // Extraction de l'ID de la suite de tests si présent
    const testSuiteId = pathSegments[0]
    
    // GET /test-suites - Liste de toutes les suites de tests
    if (req.method === 'GET' && !testSuiteId) {
      const params = new URLSearchParams(url.search);
      const { page, limit } = validatePagination(params)
      const listParams: PaginationParams = { limit, offset: (page - 1) * limit }
      const testSuites = await vapiTestSuites.list(listParams)
      return new Response(JSON.stringify(testSuites), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /test-suites/:id - Récupération d'une suite de tests spécifique
    if (req.method === 'GET' && testSuiteId) {
      const testSuite = await vapiTestSuites.retrieve(testSuiteId)
      return new Response(JSON.stringify({ data: testSuite }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /test-suites - Création d'une nouvelle suite de tests
    if (req.method === 'POST' && !testSuiteId) {
      const data = await req.json()
      const validatedData = validateInput<TestSuiteCreateParams>(data, createTestSuiteSchema)
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      const testSuite = await vapiTestSuites.create(validatedData)
      return new Response(JSON.stringify({ data: testSuite }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /test-suites/:id - Mise à jour d'une suite de tests
    if (req.method === 'PATCH' && testSuiteId) {
      const data = await req.json()
      const validatedData = validateInput<TestSuiteUpdateParams>(data, updateTestSuiteSchema)
      const testSuite = await vapiTestSuites.update(testSuiteId, validatedData)
      return new Response(JSON.stringify({ data: testSuite }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /test-suites/:id - Suppression d'une suite de tests
    if (req.method === 'DELETE' && testSuiteId) {
      await vapiTestSuites.delete(testSuiteId)
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    throw notFoundError('Endpoint non trouvé ou méthode non supportée.');
    
  } catch (error) {
    return errorResponse(error)
  }
}) 