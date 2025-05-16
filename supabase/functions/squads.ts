/**
 * Fonction Supabase Edge pour la gestion des équipes d'assistants (squads) Vapi
 * Endpoints:
 * - GET / - Liste toutes les équipes
 * - GET /:id - Récupère une équipe par ID
 * - POST / - Crée une nouvelle équipe
 * - PATCH /:id - Met à jour une équipe
 * - DELETE /:id - Supprime une équipe
 * - POST /:id/members - Ajoute des membres à une équipe
 * - DELETE /:id/members/:memberId - Retire un membre d'une équipe
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

// Schéma de validation pour la création d'une équipe
const createSquadSchema: ValidationSchema = {
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
  members: { 
    type: 'array',
    minLength: 1
  },
  metadata: { 
    type: 'object'
  }
}

// Schéma de validation pour la mise à jour d'une équipe
const updateSquadSchema: ValidationSchema = {
  name: { 
    type: 'string',
    minLength: 3,
    maxLength: 100
  },
  description: { 
    type: 'string',
    maxLength: 500
  },
  metadata: { 
    type: 'object'
  }
}

// Schéma de validation pour l'ajout de membres à une équipe
const addMembersSchema: ValidationSchema = {
  members: { 
    type: 'array',
    required: true,
    minLength: 1
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
    
    // Vérification qu'on a au moins le segment 'squads'
    if (pathSegments.length === 0 || pathSegments[0] !== 'squads') {
      throw validationError('Chemin d\'URL invalide')
    }
    
    // Extraction de l'ID de l'équipe si présent
    const squadId = pathSegments.length >= 2 ? pathSegments[1] : null
    
    // Action spéciale: ajouter des membres à une équipe
    if (req.method === 'POST' && squadId && pathSegments.length === 3 && pathSegments[2] === 'members') {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, addMembersSchema)
      
      // Ajout des membres à l'équipe via l'API Vapi
      await vapiClient.squads.addMembers(squadId, validatedData.members)
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Action spéciale: retirer un membre d'une équipe
    if (req.method === 'DELETE' && squadId && pathSegments.length === 4 && pathSegments[2] === 'members') {
      const memberId = pathSegments[3]
      
      // Suppression du membre de l'équipe via l'API Vapi
      await vapiClient.squads.removeMember(squadId, memberId)
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /squads - Liste de toutes les équipes
    if (req.method === 'GET' && !squadId) {
      const { page, limit } = validatePagination(url.searchParams)
      
      // Récupération des équipes via l'API Vapi
      const squads = await vapiClient.squads.list({
        limit,
        offset: (page - 1) * limit
      })
      
      return new Response(JSON.stringify({
        data: squads.data,
        pagination: {
          page,
          limit,
          total: squads.pagination.total || 0,
          has_more: squads.pagination.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /squads/:id - Récupération d'une équipe spécifique
    if (req.method === 'GET' && squadId) {
      // Récupération de l'équipe via l'API Vapi
      const squad = await vapiClient.squads.retrieve(squadId)
      
      if (!squad) {
        throw notFoundError(`Équipe avec l'ID ${squadId} non trouvée`)
      }
      
      return new Response(JSON.stringify({ data: squad }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /squads - Création d'une nouvelle équipe
    if (req.method === 'POST' && !squadId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, createSquadSchema)
      
      // Ajout des métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Création de l'équipe via l'API Vapi
      const squad = await vapiClient.squads.create(validatedData)
      
      return new Response(JSON.stringify({ data: squad }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /squads/:id - Mise à jour d'une équipe
    if (req.method === 'PATCH' && squadId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, updateSquadSchema)
      
      // Mise à jour de l'équipe via l'API Vapi
      const squad = await vapiClient.squads.update(squadId, validatedData)
      
      return new Response(JSON.stringify({ data: squad }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /squads/:id - Suppression d'une équipe
    if (req.method === 'DELETE' && squadId) {
      // Suppression de l'équipe via l'API Vapi
      await vapiClient.squads.delete(squadId)
      
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