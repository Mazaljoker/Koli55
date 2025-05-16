/**
 * Fonction Supabase Edge pour la gestion des fonctions (tools) utilisables par les assistants Vapi
 * Endpoints:
 * - GET / - Liste toutes les fonctions
 * - GET /:id - Récupère une fonction par ID
 * - POST / - Crée une nouvelle fonction
 * - PATCH /:id - Met à jour une fonction
 * - DELETE /:id - Supprime une fonction
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, notFoundError, validationError } from '../shared/errors.ts'
import { authenticate } from '../shared/auth.ts'
import { validateInput, validatePagination, ValidationSchema } from '../shared/validation.ts'
import { 
  vapiTools, 
  FunctionCreateParams, 
  FunctionUpdateParams, 
  VapiFunctionParameters, // Importer pour les schémas
  PaginationParams 
} from '../shared/vapi.ts'

// Schéma de validation pour la création d'une fonction
const createFunctionSchema: ValidationSchema = {
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
  parameters: { // Type VapiFunctionParameters est un objet avec properties
    type: 'object',
    required: true,
    // Une validation plus poussée de la structure interne est possible
  },
  webhook_url: { 
    type: 'string',
    pattern: /^https?:\/\/.+$/i // Correction du pattern regex
  },
  metadata: { 
    type: 'object'
  }
}

// Schéma de validation pour la mise à jour d'une fonction
const updateFunctionSchema: ValidationSchema = {
  name: { 
    type: 'string',
    minLength: 3,
    maxLength: 100
  },
  description: { 
    type: 'string',
    maxLength: 500
  },
  parameters: { 
    type: 'object'
  },
  webhook_url: { 
    type: 'string',
    pattern: /^https?:\/\/.+$/i // Correction du pattern regex
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
    
    // Extraction de l'ID de la fonction si présent
    const functionId = pathSegments[0]
    
    // GET /functions - Liste de toutes les fonctions
    if (req.method === 'GET' && !functionId) {
      const params = new URLSearchParams(url.search);
      const { page, limit } = validatePagination(params)
      const listParams: PaginationParams = { limit, offset: (page - 1) * limit }
      const functions = await vapiTools.list(listParams)
      return new Response(JSON.stringify(functions), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /functions/:id - Récupération d'une fonction spécifique
    if (req.method === 'GET' && functionId) {
      const fn = await vapiTools.retrieve(functionId)
      
      if (!fn) {
        throw notFoundError(`Fonction avec l'ID ${functionId} non trouvée`)
      }
      
      return new Response(JSON.stringify({ data: fn }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /functions - Création d'une nouvelle fonction
    if (req.method === 'POST' && !functionId) {
      const data = await req.json()
      const validatedData = validateInput<FunctionCreateParams>(data, createFunctionSchema)
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      const fn = await vapiTools.create(validatedData)
      return new Response(JSON.stringify({ data: fn }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /functions/:id - Mise à jour d'une fonction
    if (req.method === 'PATCH' && functionId) {
      const data = await req.json()
      const validatedData = validateInput<FunctionUpdateParams>(data, updateFunctionSchema)
      const fn = await vapiTools.update(functionId, validatedData)
      return new Response(JSON.stringify({ data: fn }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /functions/:id - Suppression d'une fonction
    if (req.method === 'DELETE' && functionId) {
      await vapiTools.delete(functionId)
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