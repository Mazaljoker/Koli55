async function callVapiAPI(
  endpoint: string,
  apiKey: string,
  method: string = 'GET',
  body: any = undefined
): Promise<any> {
    const url = `https://api.vapi.ai${endpoint}`;
    const options: RequestInit = {
        method,
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    };
    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
        (options as any).body = JSON.stringify(body);
    }
    const response = await fetch(url, options);
    const responseText = await response.text();
    if (!response.ok) {
        let errorData;
        try { errorData = JSON.parse(responseText); }
        catch { errorData = { raw_error: responseText }; }
        throw new Error(errorData.message || errorData.raw_error || `API request failed with status ${response.status}`);
    }
    return JSON.parse(responseText);
}

/**
 * Fonction Supabase Edge pour la gestion des bases de connaissances Vapi
 * 
 * Endpoints:
 * - GET /knowledge-bases - Liste toutes les bases de connaissances
 * - GET /knowledge-bases/:id - Récupère une base de connaissances par ID
 * - POST /knowledge-bases - Crée une nouvelle base de connaissances
 * - PATCH /knowledge-bases/:id - Met à jour une base de connaissances
 * - DELETE /knowledge-bases/:id - Supprime une base de connaissances
 * - POST /knowledge-bases/:id/query - Interroge une base de connaissances
 * - POST /knowledge-bases/:id/files - Ajoute un fichier à une base de connaissances
 * - DELETE /knowledge-bases/:id/files/:fileId - Retire un fichier d'une base de connaissances
 * 
 * Variables d'Entrée (Request):
 * 
 * GET /knowledge-bases:
 *   - Query params: page, limit (paramètres de pagination)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * GET /knowledge-bases/:id:
 *   - Path params: id (identifiant de la base de connaissances)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * POST /knowledge-bases:
 *   - Body: {
 *       name: string (obligatoire, 3-100 caractères),
 *       description: string (max 500 caractères),
 *       model: object (modèle à utiliser pour l'embedding),
 *       metadata: object (métadonnées personnalisées)
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: createKnowledgeBaseSchema
 * 
 * PATCH /knowledge-bases/:id:
 *   - Path params: id (identifiant de la base de connaissances)
 *   - Body: {
 *       name?: string (3-100 caractères),
 *       description?: string (max 500 caractères),
 *       model?: object (modèle à utiliser pour l'embedding),
 *       metadata?: object (métadonnées personnalisées)
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: updateKnowledgeBaseSchema
 * 
 * DELETE /knowledge-bases/:id:
 *   - Path params: id (identifiant de la base de connaissances)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * POST /knowledge-bases/:id/query:
 *   - Path params: id (identifiant de la base de connaissances)
 *   - Body: {
 *       query: string (obligatoire, la question à poser),
 *       top_k?: number (nombre de résultats à retourner, 1-20),
 *       similarity_threshold?: number (seuil de similarité, 0-1)
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: queryKnowledgeBaseSchema
 * 
 * POST /knowledge-bases/:id/files:
 *   - Path params: id (identifiant de la base de connaissances)
 *   - Body: {
 *       file_id: string (obligatoire, ID du fichier à ajouter)
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: addFileSchema
 * 
 * DELETE /knowledge-bases/:id/files/:fileId:
 *   - Path params: id (identifiant de la base de connaissances), fileId (identifiant du fichier)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * Variables de Sortie (Response):
 * 
 * GET /knowledge-bases:
 *   - Succès: {
 *       data: KnowledgeBase[], // Liste des bases de connaissances
 *       pagination: {
 *         page: number,
 *         limit: number,
 *         total: number,
 *         has_more: boolean
 *       }
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * GET /knowledge-bases/:id:
 *   - Succès: { data: KnowledgeBase }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /knowledge-bases:
 *   - Succès: { data: KnowledgeBase }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * PATCH /knowledge-bases/:id:
 *   - Succès: { data: KnowledgeBase }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * DELETE /knowledge-bases/:id:
 *   - Succès: { success: true }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /knowledge-bases/:id/query:
 *   - Succès: { data: QueryResult } où QueryResult contient les résultats de la recherche
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /knowledge-bases/:id/files:
 *   - Succès: { success: true }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * DELETE /knowledge-bases/:id/files/:fileId:
 *   - Succès: { success: true }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * Structure KnowledgeBase conforme à l'interface d'API Vapi.
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, notFoundError, validationError } from '../shared/errors.ts'
import { authenticate } from '../shared/auth.ts'
import { validateInput, validatePagination, ValidationSchema } from '../shared/validation.ts'
import { 
  vapiKnowledgeBases, 
  VapiKnowledgeBase, 
  KnowledgeBaseCreateParams, 
  KnowledgeBaseUpdateParams,
  KnowledgeBaseQueryParams,
  KnowledgeBaseQueryResult
} from '../shared/vapi.ts'

// Configuration de l'accès à l'API Vapi

// Utilitaire pour accéder à Deno avec typage
const DenoEnv = {
  get: (key: string): string | undefined => {
    // @ts-ignore - Deno existe dans l'environnement d'exécution
    return typeof Deno !== 'undefined' ? Deno.env.get(key) : undefined;
  }
};

const vapiApiKey = DenoEnv.get('VAPI_API_KEY') || ''

/**
 * Fonctions utilitaires pour mapper les données entre notre format DB/frontend et le format Vapi
 */

/**
 * Convertit le modèle du format frontend/DB au format Vapi
 * 
 * @param modelInput - Object {provider, model, dimensions} ou string
 */
function mapModelToVapiFormat(modelInput: any): { provider: string, model: string, dimensions?: number } | undefined {
  console.log(`[MAPPING] mapModelToVapiFormat - modelInput: ${typeof modelInput === 'string' ? modelInput : JSON.stringify(modelInput)}`);
  
  if (!modelInput) {
    return undefined;
  }
  
  // L'entrée est déjà un objet structuré
  if (typeof modelInput === 'object') {
    // Si l'objet a déjà le format attendu par Vapi
    if (modelInput.provider && modelInput.model) {
      return {
        provider: modelInput.provider,
        model: modelInput.model,
        dimensions: modelInput.dimensions
      };
    }
  } else if (typeof modelInput === 'string') {
    // Format simple: on suppose que c'est le nom du modèle avec provider OpenAI
    return {
      provider: 'openai',
      model: modelInput
    };
  }
  
  console.warn(`[MAPPING] Format de modèle non reconnu: ${JSON.stringify(modelInput)}`);
  return undefined;
}

/**
 * Convertit les données de la base de connaissances du format frontend/DB au format Vapi
 * 
 * @param kbData - Données de la base de connaissances
 */
function mapToVapiKnowledgeBaseFormat(kbData: any): KnowledgeBaseCreateParams | KnowledgeBaseUpdateParams {
  console.log(`[MAPPING] mapToVapiKnowledgeBaseFormat - Input: ${JSON.stringify(kbData, null, 2)}`);
  
  const payload: KnowledgeBaseCreateParams | KnowledgeBaseUpdateParams = {
    name: kbData.name
  };
  
  if (kbData.description !== undefined) {
    payload.description = kbData.description;
  }
  
  // Mapping du modèle
  if (kbData.model) {
    const modelFormat = mapModelToVapiFormat(kbData.model);
    if (modelFormat) {
      payload.model = modelFormat;
    }
  }
  
  // Mapping des métadonnées
  if (kbData.metadata) {
    payload.metadata = kbData.metadata;
  }
  
  console.log(`[MAPPING] mapToVapiKnowledgeBaseFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
}

/**
 * Convertit les paramètres de requête depuis le format frontend vers le format Vapi
 * 
 * @param queryData - Paramètres de requête
 */
function mapToVapiQueryFormat(queryData: any): KnowledgeBaseQueryParams {
  console.log(`[MAPPING] mapToVapiQueryFormat - Input: ${JSON.stringify(queryData, null, 2)}`);
  
  const payload: KnowledgeBaseQueryParams = {
    query: queryData.query
  };
  
  if (queryData.top_k !== undefined) {
    payload.top_k = queryData.top_k;
  }
  
  if (queryData.similarity_threshold !== undefined) {
    payload.similarity_threshold = queryData.similarity_threshold;
  }
  
  if (queryData.metadata_filter) {
    payload.metadata_filter = queryData.metadata_filter;
  }
  
  console.log(`[MAPPING] mapToVapiQueryFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
}

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
      console.log(`[HANDLER] POST /knowledge-bases/${kbId}/query - Interrogation d'une base de connaissances`);
      
      const data = await req.json()
      const validatedData = validateInput(data, queryKnowledgeBaseSchema)
      
      // Utiliser notre fonction de mapping et l'API KnowledgeBase
      const queryParams = mapToVapiQueryFormat(validatedData);
      const queryResult = await vapiKnowledgeBases.query(kbId, queryParams);
      
      console.log(`[VAPI_SUCCESS] Query knowledge base: ${kbId}`, queryResult);
      
      return new Response(JSON.stringify({ data: queryResult }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Action spéciale: ajouter un fichier à une base de connaissances
    if (req.method === 'POST' && kbId && pathSegments.length === 3 && pathSegments[2] === 'files') {
      console.log(`[HANDLER] POST /knowledge-bases/${kbId}/files - Ajout d'un fichier`);
      
      const data = await req.json()
      const validatedData = validateInput(data, addFileSchema)
      
      await vapiKnowledgeBases.addFile(kbId, validatedData.file_id);
      
      console.log(`[VAPI_SUCCESS] Added file ${validatedData.file_id} to knowledge base: ${kbId}`);
      
      return new Response(JSON.stringify({ success: true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Action spéciale: retirer un fichier d'une base de connaissances
    if (req.method === 'DELETE' && kbId && pathSegments.length === 4 && pathSegments[2] === 'files') {
      console.log(`[HANDLER] DELETE /knowledge-bases/${kbId}/files/${pathSegments[3]} - Retrait d'un fichier`);
      
      const fileId = pathSegments[3]
      await vapiKnowledgeBases.removeFile(kbId, fileId);
      
      console.log(`[VAPI_SUCCESS] Removed file ${fileId} from knowledge base: ${kbId}`);
      
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /knowledge-bases - Liste de toutes les bases de connaissances
    if (req.method === 'GET' && !kbId) {
      console.log(`[HANDLER] GET /knowledge-bases - Liste des bases de connaissances`);
      
      const { page, limit } = validatePagination(url.searchParams)
      
      const knowledgeBases = await vapiKnowledgeBases.list({
        limit: limit,
        offset: (page - 1) * limit
      });
      
      console.log(`[VAPI_SUCCESS] Listed ${knowledgeBases.data?.length || 0} knowledge bases`);
      
      return new Response(JSON.stringify({
        data: knowledgeBases.data,
        pagination: {
          page,
          limit,
          total: knowledgeBases.pagination?.total || 0,
          has_more: knowledgeBases.pagination?.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /knowledge-bases/:id - Récupération d'une base de connaissances spécifique
    if (req.method === 'GET' && kbId) {
      console.log(`[HANDLER] GET /knowledge-bases/${kbId} - Récupération d'une base de connaissances`);
      
      let kb: VapiKnowledgeBase;
      try {
        kb = await vapiKnowledgeBases.retrieve(kbId);
        console.log(`[VAPI_SUCCESS] Retrieved knowledge base: ${kbId}`, kb);
      } catch (error) {
        console.error(`[VAPI_ERROR] GET /knowledge-bases/${kbId} - Failed to retrieve:`, error);
        throw notFoundError(`Base de connaissances avec l'ID ${kbId} non trouvée`);
      }
      
      return new Response(JSON.stringify({ data: kb }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /knowledge-bases - Création d'une nouvelle base de connaissances
    if (req.method === 'POST' && !kbId) {
      console.log(`[HANDLER] POST /knowledge-bases - Création d'une base de connaissances`);
      
      const data = await req.json()
      const validatedData = validateInput(data, createKnowledgeBaseSchema)
      
      // Ajouter les métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id
      }
      
      // Utiliser notre fonction de mapping pour transformer au format Vapi
      const kbPayload = mapToVapiKnowledgeBaseFormat(validatedData) as KnowledgeBaseCreateParams;
      
      // Créer la base de connaissances via notre API Vapi
      const kb = await vapiKnowledgeBases.create(kbPayload);
      console.log(`[VAPI_SUCCESS] Created knowledge base: ${kb.id}`, kb);
      
      return new Response(JSON.stringify({ data: kb }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /knowledge-bases/:id - Mise à jour d'une base de connaissances
    if (req.method === 'PATCH' && kbId) {
      console.log(`[HANDLER] PATCH /knowledge-bases/${kbId} - Mise à jour d'une base de connaissances`);
      
      const data = await req.json()
      const validatedData = validateInput(data, updateKnowledgeBaseSchema)
      
      // Utiliser notre fonction de mapping pour transformer au format Vapi
      const kbPayload = mapToVapiKnowledgeBaseFormat(validatedData) as KnowledgeBaseUpdateParams;
      
      // Mettre à jour la base de connaissances via notre API Vapi
      const kb = await vapiKnowledgeBases.update(kbId, kbPayload);
      console.log(`[VAPI_SUCCESS] Updated knowledge base: ${kbId}`, kb);
      
      return new Response(JSON.stringify({ data: kb }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /knowledge-bases/:id - Suppression d'une base de connaissances
    if (req.method === 'DELETE' && kbId) {
      console.log(`[HANDLER] DELETE /knowledge-bases/${kbId} - Suppression d'une base de connaissances`);
      
      // Supprimer la base de connaissances via notre API Vapi
      await vapiKnowledgeBases.delete(kbId);
      console.log(`[VAPI_SUCCESS] Deleted knowledge base: ${kbId}`);
      
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