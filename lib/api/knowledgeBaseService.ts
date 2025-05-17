import supabase from '../supabaseClient';

// Types pour les payloads d'entrée

export interface CreateKnowledgeBasePayload {
  name: string; // Obligatoire (3-100 caractères)
  description?: string; // Max 500 caractères
  model?: object; // Modèle à utiliser pour l'embedding
  metadata?: Record<string, any>; // Métadonnées personnalisées
}

export interface UpdateKnowledgeBasePayload {
  name?: string; // 3-100 caractères
  description?: string; // Max 500 caractères
  model?: object; // Modèle à utiliser pour l'embedding
  metadata?: Record<string, any>; // Métadonnées personnalisées
}

export interface QueryKnowledgeBasePayload {
  query: string; // La question à poser (obligatoire)
  top_k?: number; // Nombre de résultats à retourner (1-20)
  similarity_threshold?: number; // Seuil de similarité (0-1)
}

export interface AddFileToKnowledgeBasePayload {
  file_id: string; // ID du fichier à ajouter
}

export interface ListKnowledgeBasesParams {
  page?: number;
  limit?: number;
}

// Types pour les réponses d'API

export interface KnowledgeBaseFile {
  id: string;
  filename: string;
  purpose: string;
  size_bytes: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBaseData {
  id: string;
  name: string;
  description?: string;
  model?: object;
  metadata?: Record<string, any>;
  files?: KnowledgeBaseFile[];
  created_at: string;
  updated_at?: string;
  user_id?: string; // Supabase spécifique
}

export interface QueryResult {
  matches: Array<{
    id: string;
    score: number;
    metadata: Record<string, any>;
    content: string;
  }>;
  // Autres champs pertinents retournés par Vapi
}

export interface PaginationData {
  total: number;
  limit: number;
  page: number;
  has_more: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationData;
  vapi_error?: string;
}

export interface KnowledgeBaseApiResponse extends ApiResponse<KnowledgeBaseData> {}
export interface KnowledgeBaseListApiResponse extends ApiResponse<KnowledgeBaseData[]> {}
export interface QueryKnowledgeBaseApiResponse extends ApiResponse<QueryResult> {}

// Fonctions du service

/**
 * Crée une nouvelle base de connaissances
 */
export async function createKnowledgeBase(payload: CreateKnowledgeBasePayload): Promise<KnowledgeBaseApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('knowledge-bases', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create knowledge base');
    }

    return data as KnowledgeBaseApiResponse;
  } catch (error: any) {
    console.error('Error in createKnowledgeBase:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Récupère une base de connaissances par son ID
 */
export async function getKnowledgeBaseById(id: string): Promise<KnowledgeBaseApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`knowledge-bases/${id}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve knowledge base with ID ${id}`);
    }

    return data as KnowledgeBaseApiResponse;
  } catch (error: any) {
    console.error(`Error in getKnowledgeBaseById(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Liste les bases de connaissances avec pagination optionnelle
 */
export async function listKnowledgeBases(params?: ListKnowledgeBasesParams): Promise<KnowledgeBaseListApiResponse> {
  try {
    // Construire les query params
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    // Route avec query params
    const route = `knowledge-bases${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to list knowledge bases');
    }

    return data as KnowledgeBaseListApiResponse;
  } catch (error: any) {
    console.error('Error in listKnowledgeBases:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Met à jour une base de connaissances existante
 */
export async function updateKnowledgeBase(id: string, payload: UpdateKnowledgeBasePayload): Promise<KnowledgeBaseApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`knowledge-bases/${id}`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to update knowledge base with ID ${id}`);
    }

    return data as KnowledgeBaseApiResponse;
  } catch (error: any) {
    console.error(`Error in updateKnowledgeBase(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Supprime une base de connaissances par son ID
 */
export async function deleteKnowledgeBase(id: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`knowledge-bases/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete knowledge base with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deleteKnowledgeBase(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Interroge une base de connaissances
 */
export async function queryKnowledgeBase(id: string, payload: QueryKnowledgeBasePayload): Promise<QueryKnowledgeBaseApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`knowledge-bases/${id}/query`, {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to query knowledge base with ID ${id}`);
    }

    return data as QueryKnowledgeBaseApiResponse;
  } catch (error: any) {
    console.error(`Error in queryKnowledgeBase(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Ajoute un fichier à une base de connaissances
 */
export async function addFileToKnowledgeBase(kbId: string, payload: AddFileToKnowledgeBasePayload): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`knowledge-bases/${kbId}/files`, {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to add file to knowledge base with ID ${kbId}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in addFileToKnowledgeBase(${kbId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Upload direct d'un fichier et ajout à la base de connaissances
 * Note: cette fonction est plus complexe car elle gère le FormData pour l'upload de fichier
 */
export async function uploadFileToKnowledgeBase(kbId: string, file: File): Promise<ApiResponse<null>> {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Cette implémentation suppose que l'Edge Function peut gérer FormData
    // Si ce n'est pas le cas, une approche alternative serait nécessaire
    const { data, error } = await supabase.functions.invoke(`knowledge-bases/${kbId}/files`, {
      method: 'POST',
      body: formData,
    });

    if (error) {
      throw new Error(error.message || `Failed to upload file to knowledge base with ID ${kbId}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in uploadFileToKnowledgeBase(${kbId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Supprime un fichier d'une base de connaissances
 */
export async function deleteFileFromKnowledgeBase(kbId: string, fileId: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`knowledge-bases/${kbId}/files/${fileId}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete file ${fileId} from knowledge base ${kbId}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deleteFileFromKnowledgeBase(${kbId}, ${fileId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Regrouper toutes les fonctions dans un objet exporté pour faciliter l'usage
export const knowledgeBaseService = {
  create: createKnowledgeBase,
  getById: getKnowledgeBaseById,
  list: listKnowledgeBases,
  update: updateKnowledgeBase,
  delete: deleteKnowledgeBase,
  query: queryKnowledgeBase,
  addFile: addFileToKnowledgeBase,
  uploadFile: uploadFileToKnowledgeBase,
  deleteFile: deleteFileFromKnowledgeBase,
};

export default knowledgeBaseService; 