/**
 * Fonction Supabase Edge pour la gestion des fichiers Vapi
 * Endpoints:
 * - GET / - Liste tous les fichiers
 * - GET /:id - Récupère les métadonnées d'un fichier
 * - POST / - Télécharge un nouveau fichier
 * - DELETE /:id - Supprime un fichier
 * - GET /:id/content - Récupère le contenu d'un fichier
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

// Schéma de validation pour le téléchargement de fichier
const createFileSchema: ValidationSchema = {
  file: { 
    type: 'object',
    required: true
  },
  purpose: { 
    type: 'string',
    required: true,
    enum: ['assistants', 'knowledge-bases']
  },
  metadata: { 
    type: 'object'
  }
}

// Schéma de validation pour les paramètres de requête de liste
const queryParamsSchema: ValidationSchema = {
  purpose: { 
    type: 'string',
    enum: ['assistants', 'knowledge-bases']
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
    
    // Vérification qu'on a au moins le segment 'files'
    if (pathSegments.length === 0 || pathSegments[0] !== 'files') {
      throw validationError('Chemin d\'URL invalide')
    }
    
    // Extraction de l'ID du fichier si présent
    const fileId = pathSegments.length >= 2 ? pathSegments[1] : null
    
    // Action spéciale: récupérer le contenu d'un fichier
    if (req.method === 'GET' && fileId && pathSegments.length === 3 && pathSegments[2] === 'content') {
      // Récupération du contenu du fichier via l'API Vapi
      const content = await vapiClient.files.content(fileId)
      
      if (!content) {
        throw notFoundError(`Contenu du fichier avec l'ID ${fileId} non trouvé`)
      }
      
      return new Response(JSON.stringify({ data: content }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /files - Liste de tous les fichiers
    if (req.method === 'GET' && !fileId) {
      const { page, limit } = validatePagination(url.searchParams)
      
      // Validation des paramètres de requête
      const queryParams: Record<string, any> = {}
      for (const [key, value] of url.searchParams.entries()) {
        queryParams[key] = value
      }
      
      // Suppression des paramètres de pagination
      delete queryParams.page
      delete queryParams.limit
      
      // Validation des paramètres de filtre
      validateInput(queryParams, queryParamsSchema)
      
      // Récupération des fichiers via l'API Vapi
      const files = await vapiClient.files.list({
        ...queryParams,
        limit,
        offset: (page - 1) * limit
      })
      
      return new Response(JSON.stringify({
        data: files.data,
        pagination: {
          page,
          limit,
          total: files.pagination.total || 0,
          has_more: files.pagination.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /files/:id - Récupération des métadonnées d'un fichier spécifique
    if (req.method === 'GET' && fileId) {
      // Récupération des métadonnées du fichier via l'API Vapi
      const file = await vapiClient.files.retrieve(fileId)
      
      if (!file) {
        throw notFoundError(`Fichier avec l'ID ${fileId} non trouvé`)
      }
      
      return new Response(JSON.stringify({ data: file }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /files - Téléchargement d'un nouveau fichier
    if (req.method === 'POST' && !fileId) {
      // Récupération des données du corps de la requête
      const formData = await req.formData()
      const fileData = formData.get('file') as File
      
      if (!fileData) {
        throw validationError('Fichier requis')
      }
      
      // Création d'un objet de données pour la validation
      const data = {
        file: fileData,
        purpose: formData.get('purpose') as string,
        metadata: formData.get('metadata') ? 
          JSON.parse(formData.get('metadata') as string) : 
          {}
      }
      
      // Validation des données
      const validatedData = validateInput(data, createFileSchema)
      
      // Ajout des métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Transformation du fichier en ArrayBuffer
      const fileBuffer = await fileData.arrayBuffer()
      
      // Téléchargement du fichier via l'API Vapi
      const file = await vapiClient.files.upload({
        file: new Uint8Array(fileBuffer),
        filename: fileData.name,
        purpose: validatedData.purpose,
        metadata: validatedData.metadata
      })
      
      return new Response(JSON.stringify({ data: file }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /files/:id - Suppression d'un fichier
    if (req.method === 'DELETE' && fileId) {
      // Suppression du fichier via l'API Vapi
      await vapiClient.files.delete(fileId)
      
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