/**
 * Fonction Supabase Edge pour la gestion des numéros de téléphone Vapi
 * Endpoints:
 * - GET / - Liste tous les numéros disponibles
 * - GET /:id - Récupère un numéro par ID
 * - POST / - Provisionne un nouveau numéro
 * - PATCH /:id - Met à jour un numéro
 * - DELETE /:id - Libère un numéro
 * - POST /search - Recherche des numéros disponibles
 * - POST /provision - Provisionne un numéro avec un fournisseur spécifique
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, notFoundError, validationError } from '../shared/errors.ts'
import { authenticate, verifyAdmin } from '../shared/auth.ts'
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

// Schéma de validation pour la recherche de numéros
const searchNumbersSchema: ValidationSchema = {
  country: { 
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 2,
    message: 'Le code pays doit être au format ISO-2 (ex: FR, US)'
  },
  area_code: { 
    type: 'string'
  },
  capabilities: { 
    type: 'array'
  },
  limit: { 
    type: 'number',
    min: 1,
    max: 25
  }
}

// Schéma de validation pour la provision d'un numéro
const provisionNumberSchema: ValidationSchema = {
  phone_number: { 
    type: 'string',
    required: true,
    pattern: /^\+[1-9]\d{1,14}$/, // Format E.164
    message: 'Le numéro de téléphone doit être au format E.164 (ex: +33612345678)'
  },
  provider: { 
    type: 'string',
    enum: ['twilio', 'telnyx', 'bandwidth'],
    message: 'Le fournisseur doit être l\'un des suivants : twilio, telnyx, bandwidth'
  },
  friendly_name: { 
    type: 'string',
    maxLength: 100
  }
}

// Schéma de validation pour la mise à jour d'un numéro
const updateNumberSchema: ValidationSchema = {
  friendly_name: { 
    type: 'string',
    maxLength: 100
  },
  assistant_id: { 
    type: 'string'
  },
  workflow_id: { 
    type: 'string'
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
    
    // Action spéciale: recherche de numéros disponibles
    if (req.method === 'POST' && pathSegments.length === 2 && pathSegments[1] === 'search') {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, searchNumbersSchema)
      
      // Recherche de numéros disponibles via l'API Vapi
      const searchResult = await vapiClient.phoneNumbers.search(validatedData)
      
      return new Response(JSON.stringify({ data: searchResult }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Action spéciale: provision d'un numéro spécifique
    if (req.method === 'POST' && pathSegments.length === 2 && pathSegments[1] === 'provision') {
      // Cette opération nécessite des privilèges d'administrateur
      verifyAdmin(user)
      
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, provisionNumberSchema)
      
      // Provision du numéro via l'API Vapi
      const provisionResult = await vapiClient.phoneNumbers.provision(validatedData)
      
      return new Response(JSON.stringify({ data: provisionResult }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /phone-numbers - Liste de tous les numéros
    if (req.method === 'GET' && pathSegments.length <= 1) {
      const { page, limit } = validatePagination(url.searchParams)
      
      // Récupération des numéros via l'API Vapi
      const numbers = await vapiClient.phoneNumbers.list({
        limit,
        offset: (page - 1) * limit
      })
      
      return new Response(JSON.stringify({
        data: numbers.data,
        pagination: {
          page,
          limit,
          total: numbers.pagination.total || 0,
          has_more: numbers.pagination.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /phone-numbers/:id - Récupération d'un numéro spécifique
    if (req.method === 'GET' && pathSegments.length === 2) {
      const numberId = pathSegments[1]
      
      // Récupération du numéro via l'API Vapi
      const number = await vapiClient.phoneNumbers.retrieve(numberId)
      
      if (!number) {
        throw notFoundError(`Numéro avec l'ID ${numberId} non trouvé`)
      }
      
      return new Response(JSON.stringify({ data: number }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /phone-numbers - Achat d'un nouveau numéro
    if (req.method === 'POST' && pathSegments.length <= 1) {
      // Cette opération nécessite des privilèges d'administrateur
      verifyAdmin(user)
      
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données et vérification que le numéro est spécifié
      if (!data.phone_number) {
        throw validationError('Numéro de téléphone requis, utilisez /search pour trouver des numéros disponibles')
      }
      
      // Provision du numéro via l'API Vapi
      const provisionResult = await vapiClient.phoneNumbers.provision({
        phone_number: data.phone_number,
        provider: data.provider || 'twilio',
        friendly_name: data.friendly_name
      })
      
      return new Response(JSON.stringify({ data: provisionResult }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /phone-numbers/:id - Mise à jour d'un numéro
    if (req.method === 'PATCH' && pathSegments.length === 2) {
      const numberId = pathSegments[1]
      
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, updateNumberSchema)
      
      // Mise à jour du numéro via l'API Vapi
      const number = await vapiClient.phoneNumbers.update(numberId, validatedData)
      
      return new Response(JSON.stringify({ data: number }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /phone-numbers/:id - Libération d'un numéro
    if (req.method === 'DELETE' && pathSegments.length === 2) {
      // Cette opération nécessite des privilèges d'administrateur
      verifyAdmin(user)
      
      const numberId = pathSegments[1]
      
      // Libération du numéro via l'API Vapi
      await vapiClient.phoneNumbers.release(numberId)
      
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