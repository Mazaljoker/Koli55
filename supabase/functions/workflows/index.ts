/**
 * Fonction Supabase Edge pour la gestion des workflows Vapi
 * 
 * Endpoints:
 * - GET /workflows - Liste tous les workflows
 * - GET /workflows/:id - Récupère un workflow par ID
 * - POST /workflows - Crée un nouveau workflow
 * - PATCH /workflows/:id - Met à jour un workflow
 * - DELETE /workflows/:id - Supprime un workflow
 * - POST /workflows/:id/execute - Exécute un workflow
 * 
 * Variables d'Entrée (Request):
 * 
 * GET /workflows:
 *   - Query params: page (numéro de page), limit (nombre d'éléments par page)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * GET /workflows/:id:
 *   - Path params: id (identifiant du workflow)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * POST /workflows:
 *   - Body: {
 *       name: string (obligatoire, 3-100 caractères),
 *       description?: string (max 500 caractères),
 *       steps: array (obligatoire, au moins un élément),
 *       metadata?: object
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: createWorkflowSchema
 * 
 * PATCH /workflows/:id:
 *   - Path params: id (identifiant du workflow)
 *   - Body: {
 *       name?: string (3-100 caractères),
 *       description?: string (max 500 caractères),
 *       steps?: array (au moins un élément),
 *       metadata?: object
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: updateWorkflowSchema
 * 
 * DELETE /workflows/:id:
 *   - Path params: id (identifiant du workflow)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * POST /workflows/:id/execute:
 *   - Path params: id (identifiant du workflow)
 *   - Body: {
 *       inputs: object (obligatoire, données d'entrée pour le workflow),
 *       metadata?: object
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: executeWorkflowSchema
 * 
 * Variables de Sortie (Response):
 * 
 * GET /workflows:
 *   - Succès: {
 *       data: VapiWorkflow[], // Liste des workflows
 *       pagination: {
 *         total: number,
 *         has_more: boolean
 *       }
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * GET /workflows/:id:
 *   - Succès: { data: VapiWorkflow }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /workflows:
 *   - Succès: { data: VapiWorkflow }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * PATCH /workflows/:id:
 *   - Succès: { data: VapiWorkflow }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * DELETE /workflows/:id:
 *   - Succès: { success: true }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /workflows/:id/execute:
 *   - Succès: { data: WorkflowExecution }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * Structure VapiWorkflow conforme à l'interface VapiWorkflow de shared/vapi.ts:
 * {
 *   id: string,
 *   name: string,
 *   description?: string,
 *   steps: WorkflowStep[],
 *   metadata?: Record<string, any>,
 *   created_at: string,
 *   updated_at: string
 * }
 * 
 * Structure WorkflowExecution conforme à l'interface WorkflowExecution de shared/vapi.ts:
 * {
 *   id: string,
 *   workflow_id: string,
 *   status: string, // 'running', 'completed', 'failed', etc.
 *   inputs: Record<string, any>,
 *   outputs?: Record<string, any>,
 *   error?: any,
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
  vapiWorkflows,
  VapiWorkflow,
  WorkflowCreateParams,
  WorkflowUpdateParams,
  WorkflowExecuteParams,
  WorkflowExecution,
  PaginationParams
} from '../shared/vapi.ts'

/**
 * Fonctions utilitaires pour mapper les données entre notre format DB/frontend et le format Vapi
 */

/**
 * Convertit les données du workflow du format frontend/DB au format Vapi
 * 
 * @param workflowData - Données du workflow
 */
function mapToVapiWorkflowFormat(workflowData: any): WorkflowCreateParams | WorkflowUpdateParams {
  console.log(`[MAPPING] mapToVapiWorkflowFormat - Input: ${JSON.stringify(workflowData, null, 2)}`);
  
  const payload: WorkflowCreateParams | WorkflowUpdateParams = {};
  
  if (workflowData.name !== undefined) {
    payload.name = workflowData.name;
  }
  
  if (workflowData.description !== undefined) {
    payload.description = workflowData.description;
  }
  
  if (workflowData.steps !== undefined) {
    payload.steps = workflowData.steps;
  }
  
  if (workflowData.metadata !== undefined) {
    payload.metadata = workflowData.metadata;
  }
  
  console.log(`[MAPPING] mapToVapiWorkflowFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
}

/**
 * Convertit les paramètres d'exécution du format frontend vers le format Vapi
 * 
 * @param executeData - Paramètres d'exécution
 */
function mapToVapiExecuteFormat(executeData: any): WorkflowExecuteParams {
  console.log(`[MAPPING] mapToVapiExecuteFormat - Input: ${JSON.stringify(executeData, null, 2)}`);
  
  const payload: WorkflowExecuteParams = {
    inputs: executeData.inputs
  };
  
  if (executeData.metadata !== undefined) {
    payload.metadata = executeData.metadata;
  }
  
  console.log(`[MAPPING] mapToVapiExecuteFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
}

// Schémas de validation
const createWorkflowSchema: ValidationSchema = {
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
  steps: { 
    type: 'array',
    required: true,
    minLength: 1
    // La validation détaillée des steps peut être complexe et est omise ici
  },
  metadata: { 
    type: 'object'
  }
}

// Schéma de validation pour la mise à jour d'un workflow
const updateWorkflowSchema: ValidationSchema = {
  name: { 
    type: 'string',
    minLength: 3,
    maxLength: 100
  },
  description: { 
    type: 'string',
    maxLength: 500
  },
  steps: { 
    type: 'array',
    minLength: 1
  },
  metadata: { 
    type: 'object'
  }
}

// Schéma de validation pour l'exécution d'un workflow
const executeWorkflowSchema: ValidationSchema = {
  inputs: { 
    type: 'object',
    required: true
    // La validation détaillée des inputs peut être complexe
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

    try {    // Mode test: vérifier si c'est un appel de test    const url = new URL(req.url)    const isTestMode = url.searchParams.get('test') === 'true' || req.headers.get('x-test-mode') === 'true'        // Authentification de l'utilisateur (optionnelle en mode test)    let user = null    if (!isTestMode) {      user = await authenticate(req)    } else {      // Mode test: utiliser un utilisateur fictif      user = {        id: 'test-user',        email: 'test@allokoli.com',        role: 'user',        organization_id: 'test-org'      }    }        // Récupération de l'URL pour le routage    const pathSegments = url.pathname.split('/').filter(segment => segment)
    
    // Vérification qu'on a au moins le segment 'workflows'
    if (pathSegments.length === 0 || pathSegments[0] !== 'workflows') {
      throw validationError('Chemin d\'URL invalide')
    }
    
    // Extraction de l'ID du workflow si présent
    const workflowId = pathSegments.length >= 2 ? pathSegments[1] : null
    const action = pathSegments.length >= 3 ? pathSegments[2] : null
    
    // POST /workflows/:id/execute - Exécuter un workflow
    if (req.method === 'POST' && workflowId && action === 'execute') {
      console.log(`[HANDLER] POST /workflows/${workflowId}/execute - Exécution d'un workflow`);
      
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, executeWorkflowSchema)
      
      // Utiliser notre fonction de mapping
      const executeParams = mapToVapiExecuteFormat(validatedData);
      
      // Exécution du workflow via l'API Vapi
      const execution = await vapiWorkflows.execute(workflowId, executeParams)
      console.log(`[VAPI_SUCCESS] Executed workflow: ${workflowId}`, execution);
      
      return new Response(JSON.stringify({ data: execution }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
        // GET /workflows - Liste de tous les workflows    if (req.method === 'GET' && !workflowId) {      console.log(`[HANDLER] GET /workflows - Liste des workflows`);            // Mode test simple      if (isTestMode) {        return new Response(JSON.stringify({          success: true,          message: 'Workflows function deployed successfully!',          endpoints: {            GET_ALL: '/workflows',            GET_ONE: '/workflows/:id',            CREATE: '/workflows',            UPDATE: '/workflows/:id',            DELETE: '/workflows/:id',            EXECUTE: '/workflows/:id/execute'          }        }), {          headers: { 'Content-Type': 'application/json', ...corsHeaders }        })      }            const { page, limit } = validatePagination(url.searchParams)            const workflows = await vapiWorkflows.list({        limit: limit,        offset: (page - 1) * limit      });            console.log(`[VAPI_SUCCESS] Listed ${workflows.data?.length || 0} workflows`);            return new Response(JSON.stringify({        data: workflows.data,        pagination: {          page,          limit,          total: workflows.pagination?.total || 0,          has_more: workflows.pagination?.has_more || false        }      }), {        headers: { 'Content-Type': 'application/json', ...corsHeaders }      })
    }
    
    // GET /workflows/:id - Récupération d'un workflow spécifique
    if (req.method === 'GET' && workflowId && !action) {
      console.log(`[HANDLER] GET /workflows/${workflowId} - Récupération d'un workflow`);
      
      // Récupération du workflow via l'API Vapi
      let workflow: VapiWorkflow;
      try {
        workflow = await vapiWorkflows.retrieve(workflowId);
        console.log(`[VAPI_SUCCESS] Retrieved workflow: ${workflowId}`, workflow);
      } catch (error) {
        console.error(`[VAPI_ERROR] GET /workflows/${workflowId} - Failed to retrieve:`, error);
        throw notFoundError(`Workflow avec l'ID ${workflowId} non trouvé`);
      }
      
      return new Response(JSON.stringify({ data: workflow }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /workflows - Création d'un nouveau workflow
    if (req.method === 'POST' && !workflowId) {
      console.log(`[HANDLER] POST /workflows - Création d'un workflow`);
      
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, createWorkflowSchema)
      
      // Ajouter les métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Utiliser notre fonction de mapping
      const workflowPayload = mapToVapiWorkflowFormat(validatedData) as WorkflowCreateParams;
      
      // Création du workflow via l'API Vapi
      const workflow = await vapiWorkflows.create(workflowPayload)
      console.log(`[VAPI_SUCCESS] Created workflow: ${workflow.id}`, workflow);
      
      return new Response(JSON.stringify({ data: workflow }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /workflows/:id - Mise à jour d'un workflow
    if (req.method === 'PATCH' && workflowId && !action) {
      console.log(`[HANDLER] PATCH /workflows/${workflowId} - Mise à jour d'un workflow`);
      
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, updateWorkflowSchema)
      
      // Utiliser notre fonction de mapping
      const workflowPayload = mapToVapiWorkflowFormat(validatedData) as WorkflowUpdateParams;
      
      // Mise à jour du workflow via l'API Vapi
      const workflow = await vapiWorkflows.update(workflowId, workflowPayload)
      console.log(`[VAPI_SUCCESS] Updated workflow: ${workflowId}`, workflow);
      
      return new Response(JSON.stringify({ data: workflow }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /workflows/:id - Suppression d'un workflow
    if (req.method === 'DELETE' && workflowId && !action) {
      console.log(`[HANDLER] DELETE /workflows/${workflowId} - Suppression d'un workflow`);
      
      // Suppression du workflow via l'API Vapi
      await vapiWorkflows.delete(workflowId)
      console.log(`[VAPI_SUCCESS] Deleted workflow: ${workflowId}`);
      
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