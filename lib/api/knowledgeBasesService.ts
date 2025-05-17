import supabase from '../supabaseClient';

// Types avancés pour model

/**
 * Structure détaillée d'un modèle d'embedding
 * Peut être utilisé comme alternative à la chaîne simple
 */
export interface ModelConfig {
  provider: string; // 'openai', 'cohere', etc.
  model: string;    // 'text-embedding-3-small', etc.
  dimensions?: number; // Taille du vecteur d'embedding
}

// Types pour les payloads d'entrée

export interface CreateKnowledgeBasePayload {
  name: string;
  description?: string;
  model?: string | ModelConfig;
  metadata?: Record<string, any>;
}

export interface UpdateKnowledgeBasePayload {
  name?: string;
  description?: string;
  model?: string | ModelConfig;
  metadata?: Record<string, any>;
}

export interface QueryKnowledgeBasePayload {
  query: string;
  top_k?: number;
  similarity_threshold?: number;
  metadata_filter?: Record<string, any>;
}

export interface AddFileToKnowledgeBasePayload {
  file_id: string;
}

export interface ListKnowledgeBasesParams {
  page?: number;
  limit?: number;
}

// Types pour les réponses d'API

export interface KnowledgeBaseData {
  id: string;
  name: string;
  description?: string;
  model?: string | ModelConfig;
  files?: string[];
  file_count?: number;
  chunks_count?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface KnowledgeBaseQueryResult {
  matches: {
    text: string;
    score: number;
    metadata?: Record<string, any>;
    source?: string;
  }[];
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
}

export interface KnowledgeBaseApiResponse extends ApiResponse<KnowledgeBaseData> {}
export interface KnowledgeBasesListApiResponse extends ApiResponse<KnowledgeBaseData[]> {}
export interface KnowledgeBaseQueryApiResponse extends ApiResponse<KnowledgeBaseQueryResult> {}

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
export async function listKnowledgeBases(params?: ListKnowledgeBasesParams): Promise<KnowledgeBasesListApiResponse> {
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

    return data as KnowledgeBasesListApiResponse;
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
export async function queryKnowledgeBase(id: string, payload: QueryKnowledgeBasePayload): Promise<KnowledgeBaseQueryApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`knowledge-bases/${id}/query`, {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to query knowledge base with ID ${id}`);
    }

    return data as KnowledgeBaseQueryApiResponse;
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
export async function addFileToKnowledgeBase(id: string, payload: AddFileToKnowledgeBasePayload): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`knowledge-bases/${id}/files`, {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to add file to knowledge base with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in addFileToKnowledgeBase(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Supprime un fichier d'une base de connaissances
 */
export async function removeFileFromKnowledgeBase(id: string, fileId: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`knowledge-bases/${id}/files/${fileId}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to remove file from knowledge base with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in removeFileFromKnowledgeBase(${id}, ${fileId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Regrouper toutes les fonctions dans un objet exporté pour faciliter l'usage
export const knowledgeBasesService = {
  create: createKnowledgeBase,
  getById: getKnowledgeBaseById,
  list: listKnowledgeBases,
  update: updateKnowledgeBase,
  delete: deleteKnowledgeBase,
  query: queryKnowledgeBase,
  addFile: addFileToKnowledgeBase,
  removeFile: removeFileFromKnowledgeBase,
};

export default knowledgeBasesService; 