/**
 * Fonction Supabase Edge pour la gestion des workflows Vapi
 * Endpoints:
 * - GET / - Liste tous les workflows
 * - GET /:id - Récupère un workflow par ID
 * - POST / - Crée un nouveau workflow
 * - PATCH /:id - Met à jour un workflow
 * - DELETE /:id - Supprime un workflow
 * - POST /:id/execute - Exécute un workflow
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, notFoundError, validationError } from '../shared/errors.ts'
import { authenticate } from '../shared/auth.ts'
import { validateInput, validatePagination, ValidationSchema } from '../shared/validation.ts'
import { 
  vapiWorkflows,
  WorkflowCreateParams,
  WorkflowUpdateParams,
  WorkflowExecuteParams,
  PaginationParams
} from '../shared/vapi.ts'

// Schémas de validation (inchangés)
// ... (createWorkflowSchema, updateWorkflowSchema, executeWorkflowSchema)
// ... existing code ...
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

  try {
    // Authentification de l'utilisateur
    const user = await authenticate(req)
    
    // Récupération de l'URL pour le routage
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(segment => segment).slice(1);
    
    // Extraction de l'ID du workflow si présent
    const workflowId = pathSegments[0]
    const action = pathSegments[1] // 'execute' ou undefined
    
    // POST /workflows/:id/execute - Exécuter un workflow
    if (req.method === 'POST' && workflowId && action === 'execute') {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput<WorkflowExecuteParams>(data, executeWorkflowSchema)
      
      // Exécution du workflow via l'API Vapi
      const execution = await vapiWorkflows.execute(workflowId, validatedData)
      
      return new Response(JSON.stringify({ data: execution }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /workflows - Liste de tous les workflows
    if (req.method === 'GET' && !workflowId) {
      const params = new URLSearchParams(url.search);
      const { page, limit } = validatePagination(params)
      
      const listParams: PaginationParams = { // Utilisation de PaginationParams direct
        limit,
        offset: (page - 1) * limit
      }
      
      const workflows = await vapiWorkflows.list(listParams)
      
      return new Response(JSON.stringify(workflows), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /workflows/:id - Récupération d'un workflow spécifique
    if (req.method === 'GET' && workflowId && !action) {
      // Récupération du workflow via l'API Vapi
      const workflow = await vapiWorkflows.retrieve(workflowId)
      
      if (!workflow) {
        throw notFoundError(`Workflow avec l'ID ${workflowId} non trouvé`)
      }
      
      return new Response(JSON.stringify({ data: workflow }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /workflows - Création d'un nouveau workflow
    if (req.method === 'POST' && !workflowId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput<WorkflowCreateParams>(data, createWorkflowSchema)
      
      // Ajout des métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Création du workflow via l'API Vapi
      const workflow = await vapiWorkflows.create(validatedData)
      
      return new Response(JSON.stringify({ data: workflow }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /workflows/:id - Mise à jour d'un workflow
    if (req.method === 'PATCH' && workflowId && !action) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput<WorkflowUpdateParams>(data, updateWorkflowSchema)
      
      // Mise à jour du workflow via l'API Vapi
      const workflow = await vapiWorkflows.update(workflowId, validatedData)
      
      return new Response(JSON.stringify({ data: workflow }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /workflows/:id - Suppression d'un workflow
    if (req.method === 'DELETE' && workflowId && !action) {
      // Suppression du workflow via l'API Vapi
      await vapiWorkflows.delete(workflowId)
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Méthode non supportée
    throw notFoundError('Endpoint non trouvé ou méthode non supportée.');
    
  } catch (error) {
    return errorResponse(error)
  }
}) 