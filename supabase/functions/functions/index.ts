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
  parameters: { 
    type: 'object',
    required: true
  },
  webhook_url: { 
    type: 'string',
    pattern: /^https?:\/\/.*$/
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
    pattern: /^https?:\/\/.*$/
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
    
    // Extraction de l'ID de la fonction si présent
    const functionId = pathSegments.length >= 2 ? pathSegments[1] : null
    
    // GET /functions - Liste de toutes les fonctions
    if (req.method === 'GET' && !functionId) {
      const { page, limit } = validatePagination(url.searchParams)
      
      // Récupération des fonctions via l'API Vapi
      const functions = await vapiClient.functions.list({
        limit,
        offset: (page - 1) * limit
      })
      
      return new Response(JSON.stringify({
        data: functions.data,
        pagination: {
          page,
          limit,
          total: functions.pagination.total || 0,
          has_more: functions.pagination.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /functions/:id - Récupération d'une fonction spécifique
    if (req.method === 'GET' && functionId) {
      // Récupération de la fonction via l'API Vapi
      const fn = await vapiClient.functions.retrieve(functionId)
      
      if (!fn) {
        throw notFoundError(`Fonction avec l'ID ${functionId} non trouvée`)
      }
      
      return new Response(JSON.stringify({ data: fn }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /functions - Création d'une nouvelle fonction
    if (req.method === 'POST' && !functionId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, createFunctionSchema)
      
      // Ajout des métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Création de la fonction via l'API Vapi
      const fn = await vapiClient.functions.create(validatedData)
      
      return new Response(JSON.stringify({ data: fn }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /functions/:id - Mise à jour d'une fonction
    if (req.method === 'PATCH' && functionId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, updateFunctionSchema)
      
      // Mise à jour de la fonction via l'API Vapi
      const fn = await vapiClient.functions.update(functionId, validatedData)
      
      return new Response(JSON.stringify({ data: fn }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /functions/:id - Suppression d'une fonction
    if (req.method === 'DELETE' && functionId) {
      // Suppression de la fonction via l'API Vapi
      await vapiClient.functions.delete(functionId)
      
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