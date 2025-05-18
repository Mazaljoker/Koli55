/**
 * Fonction Supabase Edge pour la gestion des fonctions (tools) utilisables par les assistants Vapi
 * 
 * Endpoints:
 * - GET /functions - Liste toutes les fonctions
 * - GET /functions/:id - Récupère une fonction par ID
 * - POST /functions - Crée une nouvelle fonction
 * - PATCH /functions/:id - Met à jour une fonction
 * - DELETE /functions/:id - Supprime une fonction
 * 
 * Variables d'Entrée (Request):
 * 
 * GET /functions:
 *   - Query params: page (numéro de page), limit (nombre d'éléments par page)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * GET /functions/:id:
 *   - Path params: id (identifiant de la fonction)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * POST /functions:
 *   - Body: {
 *       name: string (obligatoire, 3-100 caractères),
 *       description?: string (max 500 caractères),
 *       parameters: object (obligatoire, structure au format OpenAPI/JSONSchema),
 *       webhook_url?: string (URL valide),
 *       metadata?: object
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: createFunctionSchema
 * 
 * PATCH /functions/:id:
 *   - Path params: id (identifiant de la fonction)
 *   - Body: {
 *       name?: string (3-100 caractères),
 *       description?: string (max 500 caractères),
 *       parameters?: object (structure au format OpenAPI/JSONSchema),
 *       webhook_url?: string (URL valide),
 *       metadata?: object
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: updateFunctionSchema
 * 
 * DELETE /functions/:id:
 *   - Path params: id (identifiant de la fonction)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * Variables de Sortie (Response):
 * 
 * GET /functions:
 *   - Succès: {
 *       data: VapiFunction[], // Liste des fonctions
 *       pagination: {
 *         total: number,
 *         has_more: boolean
 *       }
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * GET /functions/:id:
 *   - Succès: { data: VapiFunction }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /functions:
 *   - Succès: { data: VapiFunction }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * PATCH /functions/:id:
 *   - Succès: { data: VapiFunction }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * DELETE /functions/:id:
 *   - Succès: { success: true }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * Structure VapiFunction conforme à l'interface VapiFunction de shared/vapi.ts:
 * {
 *   id: string,
 *   name: string,
 *   description?: string,
 *   parameters: VapiFunctionParameters, // Structure JSONSchema/OpenAPI pour les paramètres
 *   webhook_url?: string,
 *   metadata?: Record<string, any>,
 *   created_at: string,
 *   updated_at: string
 * }
 * 
 * Structure VapiFunctionParameters conforme à JSONSchema/OpenAPI:
 * {
 *   type: "object",
 *   properties: {
 *     [propertyName: string]: {
 *       type: string,
 *       description?: string,
 *       ...other schema properties
 *     }
 *   },
 *   required?: string[]
 * }
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, notFoundError, validationError } from '../shared/errors.ts'
import { authenticate } from '../shared/auth.ts'
import { validateInput, validatePagination, ValidationSchema } from '../shared/validation.ts'
import { 
  vapiTools,
  VapiFunction,
  FunctionCreateParams, 
  FunctionUpdateParams, 
  VapiFunctionParameters,
  PaginationParams 
} from '../shared/vapi.ts'

/**
 * Fonctions utilitaires pour mapper les données entre notre format DB/frontend et le format Vapi
 */

/**
 * Convertit les données de la fonction du format frontend/DB au format Vapi
 * 
 * @param functionData - Données de la fonction
 */
function mapToVapiFunctionFormat(functionData: any): FunctionCreateParams | FunctionUpdateParams {
  console.log(`[MAPPING] mapToVapiFunctionFormat - Input: ${JSON.stringify(functionData, null, 2)}`);
  
  const payload: FunctionCreateParams | FunctionUpdateParams = {};
  
  if (functionData.name !== undefined) {
    payload.name = functionData.name;
  }
  
  if (functionData.description !== undefined) {
    payload.description = functionData.description;
  }
  
  if (functionData.parameters !== undefined) {
    payload.parameters = functionData.parameters;
  }
  
  if (functionData.webhook_url !== undefined) {
    payload.webhook_url = functionData.webhook_url;
  }
  
  if (functionData.metadata !== undefined) {
    payload.metadata = functionData.metadata;
  }
  
  console.log(`[MAPPING] mapToVapiFunctionFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
}

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
    const pathSegments = url.pathname.split('/').filter(segment => segment)
    
    // Vérification qu'on a au moins le segment 'functions'
    if (pathSegments.length === 0 || pathSegments[0] !== 'functions') {
      throw validationError('Chemin d\'URL invalide')
    }
    
    // Extraction de l'ID de la fonction si présent
    const functionId = pathSegments.length >= 2 ? pathSegments[1] : null
    
    // GET /functions - Liste de toutes les fonctions
    if (req.method === 'GET' && !functionId) {
      console.log(`[HANDLER] GET /functions - Liste des fonctions`);
      
      const { page, limit } = validatePagination(url.searchParams)
      
      const functions = await vapiTools.list({
        limit: limit,
        offset: (page - 1) * limit
      });
      
      console.log(`[VAPI_SUCCESS] Listed ${functions.data?.length || 0} functions`);
      
      return new Response(JSON.stringify({
        data: functions.data,
        pagination: {
          page,
          limit,
          total: functions.pagination?.total || 0,
          has_more: functions.pagination?.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /functions/:id - Récupération d'une fonction spécifique
    if (req.method === 'GET' && functionId) {
      console.log(`[HANDLER] GET /functions/${functionId} - Récupération d'une fonction`);
      
      let fn: VapiFunction;
      try {
        fn = await vapiTools.retrieve(functionId);
        console.log(`[VAPI_SUCCESS] Retrieved function: ${functionId}`, fn);
      } catch (error) {
        console.error(`[VAPI_ERROR] GET /functions/${functionId} - Failed to retrieve:`, error);
        throw notFoundError(`Fonction avec l'ID ${functionId} non trouvée`);
      }
      
      return new Response(JSON.stringify({ data: fn }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /functions - Création d'une nouvelle fonction
    if (req.method === 'POST' && !functionId) {
      console.log(`[HANDLER] POST /functions - Création d'une fonction`);
      
      const data = await req.json()
      const validatedData = validateInput(data, createFunctionSchema)
      
      // Ajouter les métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Utiliser notre fonction de mapping
      const functionPayload = mapToVapiFunctionFormat(validatedData) as FunctionCreateParams;
      
      const fn = await vapiTools.create(functionPayload)
      console.log(`[VAPI_SUCCESS] Created function: ${fn.id}`, fn);
      
      return new Response(JSON.stringify({ data: fn }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /functions/:id - Mise à jour d'une fonction
    if (req.method === 'PATCH' && functionId) {
      console.log(`[HANDLER] PATCH /functions/${functionId} - Mise à jour d'une fonction`);
      
      const data = await req.json()
      const validatedData = validateInput(data, updateFunctionSchema)
      
      // Utiliser notre fonction de mapping
      const functionPayload = mapToVapiFunctionFormat(validatedData) as FunctionUpdateParams;
      
      const fn = await vapiTools.update(functionId, functionPayload)
      console.log(`[VAPI_SUCCESS] Updated function: ${functionId}`, fn);
      
      return new Response(JSON.stringify({ data: fn }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /functions/:id - Suppression d'une fonction
    if (req.method === 'DELETE' && functionId) {
      console.log(`[HANDLER] DELETE /functions/${functionId} - Suppression d'une fonction`);
      
      await vapiTools.delete(functionId)
      console.log(`[VAPI_SUCCESS] Deleted function: ${functionId}`);
      
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