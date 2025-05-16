/**
 * Fonction Supabase Edge pour la gestion des bases de connaissances Vapi
 * Endpoints:
 * - GET / - Liste toutes les bases de connaissances
 * - GET /:id - Récupère une base de connaissances par ID
 * - POST / - Crée une nouvelle base de connaissances
 * - PATCH /:id - Met à jour une base de connaissances
 * - DELETE /:id - Supprime une base de connaissances
 * - POST /:id/query - Interroge une base de connaissances
 * - POST /:id/files - Ajoute un fichier à une base de connaissances
 * - DELETE /:id/files/:fileId - Retire un fichier d'une base de connaissances
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

// Schéma de validation pour la création d'une base de connaissances
const createKnowledgeBaseSchema: ValidationSchema = {
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
  model: { 
    type: 'object'
  },
  metadata: { 
    type: 'object'
  }
}

// Schéma de validation pour la mise à jour d'une base de connaissances
const updateKnowledgeBaseSchema: ValidationSchema = {
  name: { 
    type: 'string',
    minLength: 3,
    maxLength: 100
  },
  description: { 
    type: 'string',
    maxLength: 500
  },
  model: { 
    type: 'object'
  },
  metadata: { 
    type: 'object'
  }
}

// Schéma de validation pour l'interrogation d'une base de connaissances
const queryKnowledgeBaseSchema: ValidationSchema = {
  query: { 
    type: 'string',
    required: true,
    minLength: 1
  },
  top_k: { 
    type: 'number',
    min: 1,
    max: 20
  },
  similarity_threshold: { 
    type: 'number',
    min: 0,
    max: 1
  }
}

// Schéma de validation pour l'ajout d'un fichier à une base de connaissances
const addFileSchema: ValidationSchema = {
  file_id: { 
    type: 'string',
    required: true
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
    
    // Vérification qu'on a au moins le segment 'knowledge-bases'
    if (pathSegments.length === 0 || pathSegments[0] !== 'knowledge-bases') {
      throw validationError('Chemin d\'URL invalide')
    }
    
    // Extraction de l'ID de la base de connaissances si présent
    const kbId = pathSegments.length >= 2 ? pathSegments[1] : null
    
    // Action spéciale: interroger une base de connaissances
    if (req.method === 'POST' && kbId && pathSegments.length === 3 && pathSegments[2] === 'query') {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, queryKnowledgeBaseSchema)
      
      // Interrogation de la base de connaissances via l'API Vapi
      const queryResult = await vapiClient.knowledgeBases.query(kbId, validatedData)
      
      return new Response(JSON.stringify({ data: queryResult }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Action spéciale: ajouter un fichier à une base de connaissances
    if (req.method === 'POST' && kbId && pathSegments.length === 3 && pathSegments[2] === 'files') {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, addFileSchema)
      
      // Ajout du fichier à la base de connaissances via l'API Vapi
      await vapiClient.knowledgeBases.addFile(kbId, validatedData.file_id)
      
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Action spéciale: retirer un fichier d'une base de connaissances
    if (req.method === 'DELETE' && kbId && pathSegments.length === 4 && pathSegments[2] === 'files') {
      const fileId = pathSegments[3]
      
      // Suppression du fichier de la base de connaissances via l'API Vapi
      await vapiClient.knowledgeBases.removeFile(kbId, fileId)
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /knowledge-bases - Liste de toutes les bases de connaissances
    if (req.method === 'GET' && !kbId) {
      const { page, limit } = validatePagination(url.searchParams)
      
      // Récupération des bases de connaissances via l'API Vapi
      const kbs = await vapiClient.knowledgeBases.list({
        limit,
        offset: (page - 1) * limit
      })
      
      return new Response(JSON.stringify({
        data: kbs.data,
        pagination: {
          page,
          limit,
          total: kbs.pagination.total || 0,
          has_more: kbs.pagination.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /knowledge-bases/:id - Récupération d'une base de connaissances spécifique
    if (req.method === 'GET' && kbId) {
      // Récupération de la base de connaissances via l'API Vapi
      const kb = await vapiClient.knowledgeBases.retrieve(kbId)
      
      if (!kb) {
        throw notFoundError(`Base de connaissances avec l'ID ${kbId} non trouvée`)
      }
      
      return new Response(JSON.stringify({ data: kb }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /knowledge-bases - Création d'une nouvelle base de connaissances
    if (req.method === 'POST' && !kbId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, createKnowledgeBaseSchema)
      
      // Ajout des métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Création de la base de connaissances via l'API Vapi
      const kb = await vapiClient.knowledgeBases.create(validatedData)
      
      return new Response(JSON.stringify({ data: kb }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /knowledge-bases/:id - Mise à jour d'une base de connaissances
    if (req.method === 'PATCH' && kbId) {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, updateKnowledgeBaseSchema)
      
      // Mise à jour de la base de connaissances via l'API Vapi
      const kb = await vapiClient.knowledgeBases.update(kbId, validatedData)
      
      return new Response(JSON.stringify({ data: kb }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /knowledge-bases/:id - Suppression d'une base de connaissances
    if (req.method === 'DELETE' && kbId) {
      // Suppression de la base de connaissances via l'API Vapi
      await vapiClient.knowledgeBases.delete(kbId)
      
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