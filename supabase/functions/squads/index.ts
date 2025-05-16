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
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, notFoundError, validationError } from '../shared/errors.ts'
import { authenticate } from '../shared/auth.ts'
import { validateInput, validatePagination, ValidationSchema } from '../shared/validation.ts'
import { 
  vapiSquads,
  SquadCreateParams,
  SquadUpdateParams,
  SquadMember,
  PaginationParams
} from '../shared/vapi.ts'

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
    // items: { type: 'object', properties: { id: {type: 'string'}, role: {type: 'string'} } } // Validation plus stricte
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
    minLength: 1,
    // items: { type: 'object', properties: { id: {type: 'string'}, role: {type: 'string'} } }
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    const user = await authenticate(req)
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(segment => segment).slice(1);

    const squadId = pathSegments[0]
    const action = pathSegments[1] // 'members' ou undefined
    const memberId = pathSegments[2] // ID du membre pour suppression

    // POST /squads/:id/members - Ajoute des membres à une équipe
    if (req.method === 'POST' && squadId && action === 'members' && !memberId) {
      const data = await req.json()
      const validatedData = validateInput<{ members: SquadMember[] }>(data, addMembersSchema)
      const updatedSquad = await vapiSquads.addMembers(squadId, validatedData.members)
      return new Response(JSON.stringify({ data: updatedSquad }), { // Vapi retourne le squad mis à jour
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /squads/:id/members/:memberId - Retire un membre d'une équipe
    if (req.method === 'DELETE' && squadId && action === 'members' && memberId) {
      await vapiSquads.removeMember(squadId, memberId)
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /squads - Liste de toutes les équipes
    if (req.method === 'GET' && !squadId) {
      const params = new URLSearchParams(url.search);
      const { page, limit } = validatePagination(params)
      const listParams: PaginationParams = {
        limit,
        offset: (page - 1) * limit
      }
      const squads = await vapiSquads.list(listParams)
      return new Response(JSON.stringify(squads), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /squads/:id - Récupération d'une équipe spécifique
    if (req.method === 'GET' && squadId && !action) {
      const squad = await vapiSquads.retrieve(squadId)
      return new Response(JSON.stringify({ data: squad }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /squads - Création d'une nouvelle équipe
    if (req.method === 'POST' && !squadId) {
      const data = await req.json()
      const validatedData = validateInput<SquadCreateParams>(data, createSquadSchema)
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      const squad = await vapiSquads.create(validatedData)
      return new Response(JSON.stringify({ data: squad }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /squads/:id - Mise à jour d'une équipe
    if (req.method === 'PATCH' && squadId && !action) {
      const data = await req.json()
      const validatedData = validateInput<SquadUpdateParams>(data, updateSquadSchema)
      const squad = await vapiSquads.update(squadId, validatedData)
      return new Response(JSON.stringify({ data: squad }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /squads/:id - Suppression d'une équipe
    if (req.method === 'DELETE' && squadId && !action) {
      await vapiSquads.delete(squadId)
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    throw notFoundError('Endpoint non trouvé ou méthode non supportée.');

  } catch (error) {
    return errorResponse(error)
  }
}) 