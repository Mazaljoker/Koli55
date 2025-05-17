import supabase from '../supabaseClient';

// Types pour les payloads d'entrée

export interface MessageCreateParams {
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
  content: string;
  name?: string;
  metadata?: Record<string, any>;
}

export interface MessageListParams {
  limit?: number;
}

// Types pour les réponses d'API

export interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant' | 'function' | 'tool';
  content: string;
  name?: string;
  call_id: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface PaginationData {
  has_more: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationData;
  vapi_error?: string;
}

export interface MessageApiResponse extends ApiResponse<Message> {}
export interface MessageListApiResponse extends ApiResponse<Message[]> {}

// Fonctions du service

/**
 * Liste les messages d'un appel
 */
export async function listMessages(callId: string, params?: MessageListParams): Promise<MessageListApiResponse> {
  try {
    // Construire les query params
    const queryParams = new URLSearchParams();
    
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    // Route avec query params
    const route = `messages/${callId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to list messages for call ${callId}`);
    }

    return {
      success: true,
      data: data?.data || [],
      pagination: data?.pagination || { has_more: false }
    };
  } catch (error: any) {
    console.error(`Error in listMessages(${callId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Récupère un message spécifique par son ID
 */
export async function getMessageById(callId: string, messageId: string): Promise<MessageApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`messages/${callId}/${messageId}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve message ${messageId} for call ${callId}`);
    }

    return {
      success: true,
      data: data?.data
    };
  } catch (error: any) {
    console.error(`Error in getMessageById(${callId}, ${messageId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Ajoute un message à un appel
 */
export async function createMessage(callId: string, params: MessageCreateParams): Promise<MessageApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`messages/${callId}`, {
      method: 'POST',
      body: params,
    });

    if (error) {
      throw new Error(error.message || `Failed to create message for call ${callId}`);
    }

    return {
      success: true,
      data: data?.data
    };
  } catch (error: any) {
    console.error(`Error in createMessage(${callId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Regrouper toutes les fonctions dans un objet exporté pour faciliter l'usage
export const messagesService = {
  list: listMessages,
  getById: getMessageById,
  create: createMessage,
};

export default messagesService; 