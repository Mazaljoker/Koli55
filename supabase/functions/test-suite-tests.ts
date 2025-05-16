/**
 * Fonction Supabase Edge pour la gestion des tests individuels dans les suites de tests Vapi
 * Endpoints:
 * - GET /:suiteId - Liste tous les tests d'une suite
 * - GET /:suiteId/:testId - Récupère un test par ID
 * - POST /:suiteId - Crée un nouveau test dans une suite
 * - PATCH /:suiteId/:testId - Met à jour un test
 * - DELETE /:suiteId/:testId - Supprime un test
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from './_shared/cors.js'
import { errorResponse, notFoundError, validationError } from './_shared/errors.js'
import { authenticate } from './_shared/auth.js'
import { validateInput, validatePagination, ValidationSchema } from './_shared/validation.js'

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

// Schéma de validation pour la création d'un test
const createTestSchema: ValidationSchema = {
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
  expected_output: { 
    type: 'string',
    required: true
  },
  input: { 
    type: 'string',
    required: true
  },
  metadata: { 
    type: 'object'
  }
}

// Schéma de validation pour la mise à jour d'un test
const updateTestSchema: ValidationSchema = {
  name: { 
    type: 'string',
    minLength: 3,
    maxLength: 100
  },
  description: { 
    type: 'string',
    maxLength: 500
  },
  expected_output: { 
    type: 'string'
  },
  input: { 
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
    
    // Vérification qu'on a au moins le segment 'test-suite-tests' et l'ID de la suite
    if (pathSegments.length < 2 || pathSegments[0] !== 'test-suite-tests') {
      throw validationError('Chemin d\'URL invalide')
    }
    
    // Extraction des IDs
    const suiteId = pathSegments[1]
    const testId = pathSegments.length >= 3 ? pathSegments[2] : null
    
    // GET /test-suite-tests/:suiteId - Liste de tous les tests d'une suite
    if (req.method === 'GET' && !testId) {
      const { page, limit } = validatePagination(url.searchParams)
      
      // Récupération des tests via l'API Vapi
      const tests = await vapiClient.testSuiteTests.list(suiteId, {
        limit,
        offset: (page - 1) * limit
      })
      
      return new Response(JSON.stringify({
        data: tests.data,
        pagination: {
          page,
          limit,
          total: tests.pagination.total || 0,
          has_more: tests.pagination.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /test-suite-tests/:suiteId/:testId - Récupération d'un test spécifique
    if (req.method === 'GET' && testId) {
      // Récupération du test via l'API Vapi
      const test = await vapiClient.testSuiteTests.retrieve(suiteId, testId)
      
      if (!test) {
        throw notFoundError(`Test avec l'ID ${testId} non trouvé dans la suite ${suiteId}`)
      }
      
      return new Response(JSON.stringify({ data: test }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /test-suite-tests/:suiteId - Création d'un nouveau test
    if (req.method === 'POST' && !testId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, createTestSchema)
      
      // Ajout des métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Création du test via l'API Vapi
      const test = await vapiClient.testSuiteTests.create(suiteId, validatedData)
      
      return new Response(JSON.stringify({ data: test }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /test-suite-tests/:suiteId/:testId - Mise à jour d'un test
    if (req.method === 'PATCH' && testId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, updateTestSchema)
      
      // Mise à jour du test via l'API Vapi
      const test = await vapiClient.testSuiteTests.update(suiteId, testId, validatedData)
      
      return new Response(JSON.stringify({ data: test }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /test-suite-tests/:suiteId/:testId - Suppression d'un test
    if (req.method === 'DELETE' && testId) {
      // Suppression du test via l'API Vapi
      await vapiClient.testSuiteTests.delete(suiteId, testId)
      
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