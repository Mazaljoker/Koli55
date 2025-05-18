/**
 * Fonction Supabase Edge pour la gestion des tests individuels dans les suites de tests Vapi
 * 
 * Endpoints:
 * - GET /test-suite-tests/:suiteId - Liste tous les tests d'une suite
 * - GET /test-suite-tests/:suiteId/:testId - Récupère un test par ID
 * - POST /test-suite-tests/:suiteId - Crée un nouveau test dans une suite
 * - PATCH /test-suite-tests/:suiteId/:testId - Met à jour un test
 * - DELETE /test-suite-tests/:suiteId/:testId - Supprime un test
 * 
 * Variables d'Entrée (Request):
 * 
 * GET /test-suite-tests/:suiteId:
 *   - Path params: suiteId (identifiant de la suite de tests)
 *   - Query params: page (numéro de page), limit (nombre d'éléments par page)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * GET /test-suite-tests/:suiteId/:testId:
 *   - Path params: suiteId (identifiant de la suite de tests), testId (identifiant du test)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * POST /test-suite-tests/:suiteId:
 *   - Path params: suiteId (identifiant de la suite de tests)
 *   - Body: {
 *       name: string (obligatoire, 3-100 caractères),
 *       description?: string (max 500 caractères),
 *       expected_output: string (obligatoire, résultat attendu du test),
 *       input: string (obligatoire, entrée du test),
 *       metadata?: object
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: createTestSchema
 * 
 * PATCH /test-suite-tests/:suiteId/:testId:
 *   - Path params: suiteId (identifiant de la suite de tests), testId (identifiant du test)
 *   - Body: {
 *       name?: string (3-100 caractères),
 *       description?: string (max 500 caractères),
 *       expected_output?: string (résultat attendu du test),
 *       input?: string (entrée du test),
 *       metadata?: object
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: updateTestSchema
 * 
 * DELETE /test-suite-tests/:suiteId/:testId:
 *   - Path params: suiteId (identifiant de la suite de tests), testId (identifiant du test)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * Variables de Sortie (Response):
 * 
 * GET /test-suite-tests/:suiteId:
 *   - Succès: {
 *       data: VapiTestSuiteTest[], // Liste des tests de la suite
 *       pagination: {
 *         page: number,
 *         limit: number,
 *         total: number,
 *         has_more: boolean
 *       }
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * GET /test-suite-tests/:suiteId/:testId:
 *   - Succès: { data: VapiTestSuiteTest }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /test-suite-tests/:suiteId:
 *   - Succès: { data: VapiTestSuiteTest }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * PATCH /test-suite-tests/:suiteId/:testId:
 *   - Succès: { data: VapiTestSuiteTest }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * DELETE /test-suite-tests/:suiteId/:testId:
 *   - Succès: { success: true }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * Structure VapiTestSuiteTest conforme à l'interface VapiTestSuiteTest de shared/vapi.ts:
 * {
 *   id: string,
 *   name: string,
 *   description?: string,
 *   input: string,
 *   expected_output: string,
 *   test_suite_id: string,
 *   metadata?: Record<string, any>,
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
  vapiTestSuiteTests,
  VapiTestSuiteTest,
  TestSuiteTestCreateParams,
  TestSuiteTestUpdateParams
} from '../shared/vapi.ts'

/**
 * Fonctions utilitaires pour mapper les données entre notre format DB/frontend et le format Vapi
 */

/**
 * Convertit les données du test du format frontend/DB au format Vapi
 * 
 * @param testData - Données du test
 */
function mapToVapiTestFormat(testData: any): TestSuiteTestCreateParams | TestSuiteTestUpdateParams {
  console.log(`[MAPPING] mapToVapiTestFormat - Input: ${JSON.stringify(testData, null, 2)}`);
  
  const payload: TestSuiteTestCreateParams | TestSuiteTestUpdateParams = {};
  
  if (testData.name !== undefined) {
    payload.name = testData.name;
  }
  
  if (testData.description !== undefined) {
    payload.description = testData.description;
  }
  
  if (testData.expected_output !== undefined) {
    payload.expected_output = testData.expected_output;
  }
  
  if (testData.input !== undefined) {
    payload.input = testData.input;
  }
  
  if (testData.metadata !== undefined) {
    payload.metadata = testData.metadata;
  }
  
  console.log(`[MAPPING] mapToVapiTestFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
}

// Utilitaire pour accéder à Deno avec typage (pour la compatibilité)
const DenoEnv = {
  get: (key: string): string | undefined => {
    // @ts-ignore - Deno existe dans l'environnement d'exécution
    return typeof Deno !== 'undefined' ? Deno.env.get(key) : undefined;
  }
};

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
      console.log(`[HANDLER] GET /test-suite-tests/${suiteId} - Liste des tests d'une suite`);
      
      const { page, limit } = validatePagination(url.searchParams)
      
      // Récupération des tests via l'API Vapi
      const tests = await vapiTestSuiteTests.list(suiteId, {
        limit,
        offset: (page - 1) * limit
      })
      
      console.log(`[VAPI_SUCCESS] Listed ${tests.data?.length || 0} tests for suite: ${suiteId}`);
      
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
      console.log(`[HANDLER] GET /test-suite-tests/${suiteId}/${testId} - Récupération d'un test`);
      
      // Récupération du test via l'API Vapi
      let test: VapiTestSuiteTest;
      try {
        test = await vapiTestSuiteTests.get(suiteId, testId);
        console.log(`[VAPI_SUCCESS] Retrieved test: ${testId} for suite: ${suiteId}`, test);
      } catch (error) {
        console.error(`[VAPI_ERROR] GET /test-suite-tests/${suiteId}/${testId} - Failed to retrieve:`, error);
        throw notFoundError(`Test avec l'ID ${testId} non trouvé dans la suite ${suiteId}`);
      }
      
      return new Response(JSON.stringify({ data: test }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /test-suite-tests/:suiteId - Création d'un nouveau test
    if (req.method === 'POST' && !testId) {
      console.log(`[HANDLER] POST /test-suite-tests/${suiteId} - Création d'un test`);
      
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
      
      // Utiliser notre fonction de mapping
      const testPayload = mapToVapiTestFormat(validatedData) as TestSuiteTestCreateParams;
      
      // Création du test via l'API Vapi
      const test = await vapiTestSuiteTests.create(suiteId, testPayload)
      console.log(`[VAPI_SUCCESS] Created test: ${test.id} for suite: ${suiteId}`, test);
      
      return new Response(JSON.stringify({ data: test }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /test-suite-tests/:suiteId/:testId - Mise à jour d'un test
    if (req.method === 'PATCH' && testId) {
      console.log(`[HANDLER] PATCH /test-suite-tests/${suiteId}/${testId} - Mise à jour d'un test`);
      
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, updateTestSchema)
      
      // Utiliser notre fonction de mapping
      const testPayload = mapToVapiTestFormat(validatedData) as TestSuiteTestUpdateParams;
      
      // Mise à jour du test via l'API Vapi
      const test = await vapiTestSuiteTests.update(suiteId, testId, testPayload)
      console.log(`[VAPI_SUCCESS] Updated test: ${testId} for suite: ${suiteId}`, test);
      
      return new Response(JSON.stringify({ data: test }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /test-suite-tests/:suiteId/:testId - Suppression d'un test
    if (req.method === 'DELETE' && testId) {
      console.log(`[HANDLER] DELETE /test-suite-tests/${suiteId}/${testId} - Suppression d'un test`);
      
      // Suppression du test via l'API Vapi
      await vapiTestSuiteTests.remove(suiteId, testId)
      console.log(`[VAPI_SUCCESS] Deleted test: ${testId} from suite: ${suiteId}`);
      
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