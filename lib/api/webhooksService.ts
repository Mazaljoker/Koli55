import supabase from '../supabaseClient';
import { ApiResponse, PaginationData } from './assistantsService';

// Types pour les payloads d'entrée
export interface CreateWebhookPayload {
  name: string;
  url: string;
  events: string[]; // Array of event types to subscribe to
  secret?: string; // Secret for webhook signature verification
  description?: string;
  active?: boolean;
  headers?: Record<string, string>; // Custom headers to send with webhook
}

export interface UpdateWebhookPayload {
  name?: string;
  url?: string;
  events?: string[];
  secret?: string;
  description?: string;
  active?: boolean;
  headers?: Record<string, string>;
}

export interface ListWebhooksParams {
  page?: number;
  limit?: number;
  active?: boolean;
}

// Types pour les réponses d'API
export interface WebhookData {
  id: string;
  name: string;
  url: string;
  events: string[];
  description?: string;
  secret?: string; // May be hidden/redacted in responses
  active: boolean;
  headers?: Record<string, string>;
  created_at: string;
  updated_at?: string;
  created_by?: string;
}

export interface WebhookDelivery {
  id: string;
  webhook_id: string;
  event: string;
  request: {
    headers: Record<string, string>;
    body: any;
  };
  response?: {
    status: number;
    headers: Record<string, string>;
    body: any;
  };
  status: string; // 'success', 'failed', 'pending'
  error?: string;
  created_at: string;
}

export interface WebhookApiResponse extends ApiResponse<WebhookData> {}
export interface WebhooksListApiResponse extends ApiResponse<WebhookData[]> {}
export interface WebhookDeliveryApiResponse extends ApiResponse<WebhookDelivery> {}
export interface WebhookDeliveriesListApiResponse extends ApiResponse<WebhookDelivery[]> {}

// Fonctions du service
/**
 * Crée un nouveau webhook
 */
export async function createWebhook(payload: CreateWebhookPayload): Promise<WebhookApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('webhooks', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create webhook');
    }

    return data as WebhookApiResponse;
  } catch (error: any) {
    console.error('Error in createWebhook:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Récupère un webhook par son ID
 */
export async function getWebhookById(id: string): Promise<WebhookApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`webhooks/${id}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve webhook with ID ${id}`);
    }

    return data as WebhookApiResponse;
  } catch (error: any) {
    console.error(`Error in getWebhookById(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Liste les webhooks avec pagination optionnelle
 */
export async function listWebhooks(params?: ListWebhooksParams): Promise<WebhooksListApiResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.active !== undefined) queryParams.append('active', params.active.toString());
    
    const route = `webhooks${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to list webhooks');
    }

    return data as WebhooksListApiResponse;
  } catch (error: any) {
    console.error('Error in listWebhooks:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Met à jour un webhook existant
 */
export async function updateWebhook(id: string, payload: UpdateWebhookPayload): Promise<WebhookApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`webhooks/${id}`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to update webhook with ID ${id}`);
    }

    return data as WebhookApiResponse;
  } catch (error: any) {
    console.error(`Error in updateWebhook(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Supprime un webhook par son ID
 */
export async function deleteWebhook(id: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`webhooks/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete webhook with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deleteWebhook(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Récupère l'historique de livraisons d'un webhook
 */
export async function getWebhookDeliveries(id: string, page = 1, limit = 10): Promise<WebhookDeliveriesListApiResponse> {
  try {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    
    const { data, error } = await supabase.functions.invoke(`webhooks/${id}/deliveries?${queryParams.toString()}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to get deliveries for webhook with ID ${id}`);
    }

    return data as WebhookDeliveriesListApiResponse;
  } catch (error: any) {
    console.error(`Error in getWebhookDeliveries(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Déclenche manuellement un test d'envoi de webhook
 */
export async function testWebhook(id: string): Promise<WebhookDeliveryApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`webhooks/${id}/test`, {
      method: 'POST',
    });

    if (error) {
      throw new Error(error.message || `Failed to test webhook with ID ${id}`);
    }

    return data as WebhookDeliveryApiResponse;
  } catch (error: any) {
    console.error(`Error in testWebhook(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Regrouper toutes les fonctions dans un objet exporté pour faciliter l'usage
export const webhooksService = {
  create: createWebhook,
  getById: getWebhookById,
  list: listWebhooks,
  update: updateWebhook,
  delete: deleteWebhook,
  getDeliveries: getWebhookDeliveries,
  test: testWebhook,
};

export default webhooksService; 