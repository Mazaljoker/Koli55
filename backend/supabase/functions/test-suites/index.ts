/**
 * Fonction Supabase Edge pour la gestion des suites de tests Vapi
 * 
 * Endpoints:
 * - GET /test-suites - Liste toutes les suites de tests
 * - GET /test-suites/:id - Récupère une suite de tests par ID
 * - POST /test-suites - Crée une nouvelle suite de tests
 * - PATCH /test-suites/:id - Met à jour une suite de tests
 * - DELETE /test-suites/:id - Supprime une suite de tests
 * 
 * Variables d'Entrée (Request):
 * 
 * GET /test-suites:
 *   - Query params: page (numéro de page), limit (nombre d'éléments par page)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * GET /test-suites/:id:
 *   - Path params: id (identifiant de la suite de tests)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * POST /test-suites:
 *   - Body: {
 *       name: string (obligatoire, 3-100 caractères),
 *       description?: string (max 500 caractères),
 *       assistant_id: string (obligatoire, identifiant de l'assistant à tester),
 *       metadata?: object
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: createTestSuiteSchema
 * 
 * PATCH /test-suites/:id:
 *   - Path params: id (identifiant de la suite de tests)
 *   - Body: {
 *       name?: string (3-100 caractères),
 *       description?: string (max 500 caractères),
 *       assistant_id?: string (identifiant de l'assistant à tester),
 *       metadata?: object
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: updateTestSuiteSchema
 * 
 * DELETE /test-suites/:id:
 *   - Path params: id (identifiant de la suite de tests)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * Variables de Sortie (Response):
 * 
 * GET /test-suites:
 *   - Succès: {
 *       data: VapiTestSuite[], // Liste des suites de tests
 *       pagination: {
 *         total: number,
 *         has_more: boolean
 *       }
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * GET /test-suites/:id:
 *   - Succès: { data: VapiTestSuite }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /test-suites:
 *   - Succès: { data: VapiTestSuite }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * PATCH /test-suites/:id:
 *   - Succès: { data: VapiTestSuite }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * DELETE /test-suites/:id:
 *   - Succès: { success: true }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * Structure VapiTestSuite conforme à l'interface VapiTestSuite de shared/vapi.ts:
 * {
 *   id: string,
 *   name: string,
 *   description?: string,
 *   assistant_id: string,
 *   metadata?: Record<string, any>,
 *   test_count: number,
 *   created_at: string,
 *   updated_at: string
 * }
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, notFoundError, validationError } from '../shared/errors.ts'
import { authenticate } from '../shared/auth.ts'
import { validateInput, validatePagination, ValidationSchema } from '../shared/validation.ts'
import { 
  vapiTestSuites,
  VapiTestSuite,
  TestSuiteCreateParams,
  TestSuiteUpdateParams,
  PaginationParams
} from '../shared/vapi.ts'

/**
 * Fonctions utilitaires pour mapper les données entre notre format DB/frontend et le format Vapi
 */

/**
 * Convertit les données de la suite de tests du format frontend/DB au format Vapi
 * 
 * @param testSuiteData - Données de la suite de tests
 */
function mapToVapiTestSuiteFormat(testSuiteData: any): TestSuiteCreateParams | TestSuiteUpdateParams {
  console.log(`[MAPPING] mapToVapiTestSuiteFormat - Input: ${JSON.stringify(testSuiteData, null, 2)}`);
  
  const payload: TestSuiteCreateParams | TestSuiteUpdateParams = {};
  
  if (testSuiteData.name !== undefined) {
    payload.name = testSuiteData.name;
  }
  
  if (testSuiteData.description !== undefined) {
    payload.description = testSuiteData.description;
  }
  
  if (testSuiteData.assistant_id !== undefined) {
    payload.assistant_id = testSuiteData.assistant_id;
  }
  
  if (testSuiteData.metadata !== undefined) {
    payload.metadata = testSuiteData.metadata;
  }
  
  console.log(`[MAPPING] mapToVapiTestSuiteFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
}

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
    
    // Vérification qu'on a au moins le segment 'test-suites'
    if (pathSegments.length === 0 || pathSegments[0] !== 'test-suites') {
      throw validationError('Chemin d\'URL invalide')
    }
    
    // Extraction de l'ID de la suite de tests si présent
    const testSuiteId = pathSegments.length >= 2 ? pathSegments[1] : null
    
    // GET /test-suites - Liste de toutes les suites de tests
    if (req.method === 'GET' && !testSuiteId) {
      console.log(`[HANDLER] GET /test-suites - Liste des suites de tests`);
      
      const { page, limit } = validatePagination(url.searchParams)
      
      const testSuites = await vapiTestSuites.list({
        limit: limit,
        offset: (page - 1) * limit
      });
      
      console.log(`[VAPI_SUCCESS] Listed ${testSuites.data?.length || 0} test suites`);
      
      return new Response(JSON.stringify({
        data: testSuites.data,
        pagination: {
          page,
          limit,
          total: testSuites.pagination?.total || 0,
          has_more: testSuites.pagination?.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /test-suites/:id - Récupération d'une suite de tests spécifique
    if (req.method === 'GET' && testSuiteId) {
      console.log(`[HANDLER] GET /test-suites/${testSuiteId} - Récupération d'une suite de tests`);
      
      let testSuite: VapiTestSuite;
      try {
        testSuite = await vapiTestSuites.retrieve(testSuiteId);
        console.log(`[VAPI_SUCCESS] Retrieved test suite: ${testSuiteId}`, testSuite);
      } catch (error) {
        console.error(`[VAPI_ERROR] GET /test-suites/${testSuiteId} - Failed to retrieve:`, error);
        throw notFoundError(`Suite de tests avec l'ID ${testSuiteId} non trouvée`);
      }
      
      return new Response(JSON.stringify({ data: testSuite }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /test-suites - Création d'une nouvelle suite de tests
    if (req.method === 'POST' && !testSuiteId) {
      console.log(`[HANDLER] POST /test-suites - Création d'une suite de tests`);
      
      const data = await req.json()
      const validatedData = validateInput(data, createTestSuiteSchema)
      
      // Ajouter les métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Utiliser notre fonction de mapping
      const testSuitePayload = mapToVapiTestSuiteFormat(validatedData) as TestSuiteCreateParams;
      
      const testSuite = await vapiTestSuites.create(testSuitePayload)
      console.log(`[VAPI_SUCCESS] Created test suite: ${testSuite.id}`, testSuite);
      
      return new Response(JSON.stringify({ data: testSuite }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /test-suites/:id - Mise à jour d'une suite de tests
    if (req.method === 'PATCH' && testSuiteId) {
      console.log(`[HANDLER] PATCH /test-suites/${testSuiteId} - Mise à jour d'une suite de tests`);
      
      const data = await req.json()
      const validatedData = validateInput(data, updateTestSuiteSchema)
      
      // Utiliser notre fonction de mapping
      const testSuitePayload = mapToVapiTestSuiteFormat(validatedData) as TestSuiteUpdateParams;
      
      const testSuite = await vapiTestSuites.update(testSuiteId, testSuitePayload)
      console.log(`[VAPI_SUCCESS] Updated test suite: ${testSuiteId}`, testSuite);
      
      return new Response(JSON.stringify({ data: testSuite }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /test-suites/:id - Suppression d'une suite de tests
    if (req.method === 'DELETE' && testSuiteId) {
      console.log(`[HANDLER] DELETE /test-suites/${testSuiteId} - Suppression d'une suite de tests`);
      
      await vapiTestSuites.delete(testSuiteId)
      console.log(`[VAPI_SUCCESS] Deleted test suite: ${testSuiteId}`);
      
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