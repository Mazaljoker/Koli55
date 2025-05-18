import supabase from '../supabaseClient';

// Types pour les payloads d'entrée

export interface CreateCallParams {
  assistant_id: string;
  phone_number_id: string;
  to: string; // Numéro de téléphone au format E.164
  metadata?: Record<string, any>;
}

export interface UpdateCallParams {
  metadata?: Record<string, any>;
}

export interface ListCallsParams {
  page?: number;
  limit?: number;
}

// Types pour les réponses d'API

export interface Call {
  id: string;
  status: 'queued' | 'in-progress' | 'completed' | 'failed' | 'canceled';
  assistant_id: string;
  phone_number_id: string;
  to: string;
  from?: string;
  duration?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  started_at?: string;
  ended_at?: string;
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

export interface CallApiResponse extends ApiResponse<Call> {}
export interface CallsListApiResponse extends ApiResponse<Call[]> {}
export interface ListenUrlResponse extends ApiResponse<{ url: string }> {}

// Fonctions du service

/**
 * Liste les appels avec pagination optionnelle
 */
export async function listCalls(params?: ListCallsParams): Promise<CallsListApiResponse> {
  try {
    // Construire les query params
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    // Route avec query params
    const route = `calls${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to list calls');
    }

    return data as CallsListApiResponse;
  } catch (error: any) {
    console.error('Error in listCalls:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Récupère un appel par son ID
 */
export async function getCallById(id: string): Promise<CallApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`calls/${id}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve call with ID ${id}`);
    }

    return data as CallApiResponse;
  } catch (error: any) {
    console.error(`Error in getCallById(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Crée un nouvel appel
 */
export async function createCall(params: CreateCallParams): Promise<CallApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('calls', {
      method: 'POST',
      body: params,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create call');
    }

    return data as CallApiResponse;
  } catch (error: any) {
    console.error('Error in createCall:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Met à jour un appel existant
 */
export async function updateCall(id: string, params: UpdateCallParams): Promise<CallApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`calls/${id}`, {
      method: 'PATCH',
      body: params,
    });

    if (error) {
      throw new Error(error.message || `Failed to update call with ID ${id}`);
    }

    return data as CallApiResponse;
  } catch (error: any) {
    console.error(`Error in updateCall(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Supprime un appel par son ID
 */
export async function deleteCall(id: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`calls/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete call with ID ${id}`);
    }

    return {
      success: true,
      message: 'Call deleted successfully'
    };
  } catch (error: any) {
    console.error(`Error in deleteCall(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Termine un appel en cours
 */
export async function endCall(id: string): Promise<CallApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`calls/${id}/end`, {
      method: 'POST',
    });

    if (error) {
      throw new Error(error.message || `Failed to end call with ID ${id}`);
    }

    return data as CallApiResponse;
  } catch (error: any) {
    console.error(`Error in endCall(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Obtient un lien pour écouter un appel
 */
export async function getCallListenUrl(id: string): Promise<ListenUrlResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`calls/${id}/listen`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to get listen URL for call with ID ${id}`);
    }

    return data as ListenUrlResponse;
  } catch (error: any) {
    console.error(`Error in getCallListenUrl(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Regrouper toutes les fonctions dans un objet exporté pour faciliter l'usage
export const callsService = {
  list: listCalls,
  getById: getCallById,
  create: createCall,
  update: updateCall,
  delete: deleteCall,
  end: endCall,
  getListenUrl: getCallListenUrl,
};

export default callsService; 