/**
 * Fonction Supabase Edge pour la gestion des fichiers Vapi
 * 
 * Endpoints:
 * - GET /files - Liste tous les fichiers
 * - GET /files/:id - Récupère les métadonnées d'un fichier
 * - POST /files - Télécharge un nouveau fichier
 * - DELETE /files/:id - Supprime un fichier
 * - GET /files/:id/content - Récupère le contenu d'un fichier
 * 
 * Variables d'Entrée (Request):
 * 
 * GET /files:
 *   - Query params: 
 *     - page (numéro de page)
 *     - limit (nombre d'éléments par page)
 *     - purpose (optionnel, 'assistants' ou 'knowledge-bases')
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: queryParamsSchema pour le paramètre purpose
 * 
 * GET /files/:id:
 *   - Path params: id (identifiant du fichier)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * POST /files:
 *   - FormData:
 *     - file: File (obligatoire, le fichier à télécharger)
 *     - purpose: string (obligatoire, 'assistants' ou 'knowledge-bases')
 *     - metadata: string (optionnel, JSON sérialisé)
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: createFileSchema
 * 
 * DELETE /files/:id:
 *   - Path params: id (identifiant du fichier)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * GET /files/:id/content:
 *   - Path params: id (identifiant du fichier)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * Variables de Sortie (Response):
 * 
 * GET /files:
 *   - Succès: {
 *       data: VapiFile[], // Liste des fichiers selon l'interface VapiFile de shared/vapi.ts
 *       pagination: {
 *         total: number,
 *         has_more: boolean
 *       }
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * GET /files/:id:
 *   - Succès: { data: VapiFile } // Structure VapiFile de shared/vapi.ts
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /files:
 *   - Succès: { data: VapiFile } // Fichier créé selon l'interface VapiFile de shared/vapi.ts
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * DELETE /files/:id:
 *   - Succès: { success: true }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * GET /files/:id/content:
 *   - Succès: FileContent de shared/vapi.ts contenant le contenu du fichier
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * Structure VapiFile conforme à l'interface VapiFile de shared/vapi.ts
 * Structure FileContent conforme à l'interface FileContent de shared/vapi.ts
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, notFoundError, validationError } from '../shared/errors.ts'
import { authenticate } from '../shared/auth.ts'
import { validateInput, validatePagination, ValidationSchema } from '../shared/validation.ts'
import { 
  vapiFiles, 
  VapiFile,
  FileUploadParams, 
  FileListParams 
} from '../shared/vapi.ts' 

/**
 * Fonctions utilitaires pour mapper les données entre notre format DB/frontend et le format Vapi
 */

/**
 * Prépare les paramètres de téléchargement d'un fichier
 * 
 * @param fileBuffer - Buffer du fichier
 * @param fileName - Nom du fichier
 * @param purpose - But du fichier ('assistants' ou 'knowledge-bases')
 * @param metadata - Métadonnées du fichier
 */
function prepareFileUpload(
  fileBuffer: ArrayBuffer,
  fileName: string,
  purpose: 'assistants' | 'knowledge-bases',
  metadata: Record<string, any>
): FileUploadParams {
  console.log(`[MAPPING] prepareFileUpload - Preparing file upload for ${fileName} with purpose ${purpose}`);
  
  return {
    file: new Uint8Array(fileBuffer),
    filename: fileName,
    purpose: purpose,
    metadata: metadata
  };
}

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
    const pathSegments = url.pathname.split('/').filter(segment => segment)
    
    // Vérification qu'on a au moins le segment 'files'
    if (pathSegments.length === 0 || pathSegments[0] !== 'files') {
      throw validationError('Chemin d\'URL invalide')
    }
    
    // Extraction des segments pour le routage
    const fileId = pathSegments.length >= 2 ? pathSegments[1] : null
    const action = pathSegments.length >= 3 ? pathSegments[2] : null

    // GET /files/:id/content - Récupérer le contenu d'un fichier
    if (req.method === 'GET' && fileId && action === 'content') {
      console.log(`[HANDLER] GET /files/${fileId}/content - Récupération du contenu d'un fichier`);
      
      const fileContent = await vapiFiles.content(fileId)
      console.log(`[VAPI_SUCCESS] Retrieved content for file: ${fileId}`);
      
      return new Response(JSON.stringify({
        data: fileContent,
        success: true
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /files - Liste de tous les fichiers
    if (req.method === 'GET' && !fileId) {
      console.log(`[HANDLER] GET /files - Liste des fichiers`);
      
      const { page, limit } = validatePagination(url.searchParams)
      
      const listParams: FileListParams = {
        limit,
        offset: (page - 1) * limit,
      };
      
      const purposeParam = url.searchParams.get('purpose');
      if (purposeParam) {
        validateInput({ purpose: purposeParam }, queryParamsSchema)
        listParams.purpose = purposeParam as 'assistants' | 'knowledge-bases';
        console.log(`[FILTER] Filtering files by purpose: ${purposeParam}`);
      }
      
      const files = await vapiFiles.list(listParams)
      console.log(`[VAPI_SUCCESS] Listed ${files.data?.length || 0} files`);
      
      return new Response(JSON.stringify({
        data: files.data,
        pagination: {
          page,
          limit,
          total: files.pagination?.total || 0,
          has_more: files.pagination?.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /files/:id - Récupération des métadonnées d'un fichier spécifique
    if (req.method === 'GET' && fileId && !action) {
      console.log(`[HANDLER] GET /files/${fileId} - Récupération des métadonnées d'un fichier`);
      
      let file: VapiFile;
      try {
        file = await vapiFiles.retrieve(fileId);
        console.log(`[VAPI_SUCCESS] Retrieved file metadata: ${fileId}`, file);
      } catch (error) {
        console.error(`[VAPI_ERROR] GET /files/${fileId} - Failed to retrieve:`, error);
        throw notFoundError(`Fichier avec l'ID ${fileId} non trouvé`);
      }
      
      return new Response(JSON.stringify({ 
        data: file,
        success: true 
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /files - Téléchargement d'un nouveau fichier
    if (req.method === 'POST' && !fileId) {
      console.log(`[HANDLER] POST /files - Téléchargement d'un nouveau fichier`);
      
      const formData = await req.formData()
      const fileFromForm = formData.get('file') as File | null
      const purpose = formData.get('purpose') as string | null
      const metadataString = formData.get('metadata') as string | null

      if (!fileFromForm) throw validationError('Fichier requis dans le FormData sous la clé \'file\'.');
      if (!purpose) throw validationError('Champ \'purpose\' requis dans le FormData.');
      
      validateInput({ purpose }, createFileSchema) 
      
      let metadataInput: Record<string, any> = {}; 
      if (metadataString) {
        try {
          metadataInput = JSON.parse(metadataString);
          validateInput({ metadata: metadataInput }, createFileSchema) 
        } catch (e) {
          throw validationError('Champ \'metadata\' doit être un JSON valide.')
        }
      }
      
      // Ajouter les métadonnées utilisateur
      metadataInput = {
        ...metadataInput,
        user_id: user.id,
        organization_id: user.organization_id || user.id 
      };
      
      const fileBuffer = await fileFromForm.arrayBuffer()
      
      // Utiliser notre fonction de mapping
      const uploadData = prepareFileUpload(
        fileBuffer,
        fileFromForm.name,
        purpose as 'assistants' | 'knowledge-bases',
        metadataInput
      );
      
      const newFile = await vapiFiles.upload(uploadData)
      console.log(`[VAPI_SUCCESS] Created file: ${newFile.id}`, newFile);
      
      return new Response(JSON.stringify({ 
        data: newFile,
        success: true 
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /files/:id - Suppression d'un fichier
    if (req.method === 'DELETE' && fileId && !action) {
      console.log(`[HANDLER] DELETE /files/${fileId} - Suppression d'un fichier`);
      
      await vapiFiles.delete(fileId)
      console.log(`[VAPI_SUCCESS] Deleted file: ${fileId}`);
      
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