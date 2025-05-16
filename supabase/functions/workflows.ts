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
import { corsHeaders } from './_shared/cors.js'
import { errorResponse, notFoundError } from './_shared/errors.js'
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

// Schéma de validation pour la création d'un workflow
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
    
    // Extraction de l'ID du workflow si présent
    const workflowId = pathSegments.length >= 2 ? pathSegments[1] : null
    
    // Action spéciale: exécuter un workflow
    if (req.method === 'POST' && workflowId && pathSegments.length === 3 && pathSegments[2] === 'execute') {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, executeWorkflowSchema)
      
      // Ajout des métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Exécution du workflow via l'API Vapi
      const execution = await vapiClient.workflows.execute(workflowId, validatedData)
      
      return new Response(JSON.stringify({ data: execution }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /workflows - Liste de tous les workflows
    if (req.method === 'GET' && !workflowId) {
      const { page, limit } = validatePagination(url.searchParams)
      
      // Récupération des workflows via l'API Vapi
      const workflows = await vapiClient.workflows.list({
        limit,
        offset: (page - 1) * limit
      })
      
      return new Response(JSON.stringify({
        data: workflows.data,
        pagination: {
          page,
          limit,
          total: workflows.pagination.total || 0,
          has_more: workflows.pagination.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /workflows/:id - Récupération d'un workflow spécifique
    if (req.method === 'GET' && workflowId) {
      // Récupération du workflow via l'API Vapi
      const workflow = await vapiClient.workflows.retrieve(workflowId)
      
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
      const validatedData = validateInput(data, createWorkflowSchema)
      
      // Ajout des métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Création du workflow via l'API Vapi
      const workflow = await vapiClient.workflows.create(validatedData)
      
      return new Response(JSON.stringify({ data: workflow }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /workflows/:id - Mise à jour d'un workflow
    if (req.method === 'PATCH' && workflowId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, updateWorkflowSchema)
      
      // Mise à jour du workflow via l'API Vapi
      const workflow = await vapiClient.workflows.update(workflowId, validatedData)
      
      return new Response(JSON.stringify({ data: workflow }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /workflows/:id - Suppression d'un workflow
    if (req.method === 'DELETE' && workflowId) {
      // Suppression du workflow via l'API Vapi
      await vapiClient.workflows.delete(workflowId)
      
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