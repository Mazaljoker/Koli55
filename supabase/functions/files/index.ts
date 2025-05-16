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
import { vapiFiles, FileUploadParams, FileListParams } from '../shared/vapi.ts' 

// Schéma de validation pour le téléchargement de fichier (purpose et metadata uniquement)
const createFileSchema: ValidationSchema = {
  purpose: { 
    type: 'string',
    required: true,
    enum: ['assistants', 'knowledge-bases']
  },
  metadata: { 
    type: 'object'
  }
}

// Schéma de validation pour les paramètres de requête de liste (purpose uniquement)
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
    const user = await authenticate(req)
    const url = new URL(req.url)
    // Les segments commencent après /functions/NOM_FONCTION/
    // Pour /files -> pathSegments = []
    // Pour /files/ID_FICHIER -> pathSegments = ["ID_FICHIER"]
    // Pour /files/ID_FICHIER/content -> pathSegments = ["ID_FICHIER", "content"]
    const pathSegments = url.pathname.split('/').filter(segment => segment).slice(1); 

    const fileId = pathSegments[0]
    const action = pathSegments[1]

    // GET /files/:id/content - Récupérer le contenu d'un fichier
    if (req.method === 'GET' && fileId && action === 'content') {
      const fileContent = await vapiFiles.content(fileId)
      return new Response(JSON.stringify(fileContent), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /files - Liste de tous les fichiers
    if (req.method === 'GET' && !fileId) {
      const params = new URLSearchParams(url.search);
      const { page, limit } = validatePagination(params) // validatePagination ne prend qu'un URLSearchParams
      
      const listParams: FileListParams = {
        limit,
        offset: (page - 1) * limit,
      };
      
      const purposeParam = params.get('purpose');
      if (purposeParam) {
        validateInput({ purpose: purposeParam }, queryParamsSchema) // Valider 'purpose' spécifiquement
        listParams.purpose = purposeParam as 'assistants' | 'knowledge-bases';
      }
      
      const files = await vapiFiles.list(listParams)
      return new Response(JSON.stringify(files), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /files/:id - Récupération des métadonnées d'un fichier spécifique
    if (req.method === 'GET' && fileId && !action) {
      const file = await vapiFiles.retrieve(fileId)
      return new Response(JSON.stringify({ data: file }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /files - Téléchargement d'un nouveau fichier
    if (req.method === 'POST' && !fileId) {
      const formData = await req.formData()
      const fileFromForm = formData.get('file') as File | null
      const purpose = formData.get('purpose') as string | null
      const metadataString = formData.get('metadata') as string | null

      if (!fileFromForm) throw validationError('Fichier requis dans le FormData sous la clé \'file\'.');
      if (!purpose) throw validationError('Champ \'purpose\' requis dans le FormData.');
      
      validateInput({ purpose }, createFileSchema) 
      let metadataInput: Record<string, any> = {}; // Renommé pour éviter conflit avec variable 'metadata' non déclarée
      if (metadataString) {
        try {
          metadataInput = JSON.parse(metadataString);
          validateInput({ metadata: metadataInput }, createFileSchema) 
        } catch (e) {
          throw validationError('Champ \'metadata\' doit être un JSON valide.')
        }
      }
      
      const fileBuffer = await fileFromForm.arrayBuffer()
      
      const uploadData: FileUploadParams = {
        file: new Uint8Array(fileBuffer),
        filename: fileFromForm.name,
        purpose: purpose as 'assistants' | 'knowledge-bases',
        metadata: {
          ...metadataInput,
          user_id: user.id,
          organization_id: user.organization_id || user.id 
        }
      }
      
      const newFile = await vapiFiles.upload(uploadData)
      return new Response(JSON.stringify({ data: newFile }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /files/:id - Suppression d'un fichier
    if (req.method === 'DELETE' && fileId && !action) {
      await vapiFiles.delete(fileId)
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    throw notFoundError('Endpoint non trouvé ou méthode non supportée.');

  } catch (error) {
    return errorResponse(error)
  }
}) 