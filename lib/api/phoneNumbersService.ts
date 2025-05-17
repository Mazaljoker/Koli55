import supabase from '../supabaseClient';

// Types pour les payloads d'entrée

export interface CreatePhoneNumberPayload {
  phone_number: string;
  provider?: string;
  friendly_name?: string;
}

export interface UpdatePhoneNumberPayload {
  friendly_name?: string;
  assistant_id?: string;
  workflow_id?: string;
}

export interface ProvisionPhoneNumberPayload {
  phone_number: string;
  provider?: string;
  friendly_name?: string;
}

export interface SearchPhoneNumbersPayload {
  country: string;
  area_code?: string;
  capabilities?: string[];
  limit?: number;
}

export interface ListPhoneNumbersParams {
  page?: number;
  limit?: number;
}

// Types pour les réponses d'API

export interface PhoneNumberData {
  id: string;
  phone_number: string;
  friendly_name?: string;
  provider: string;
  country: string;
  capabilities: string[];
  active: boolean;
  assistant_id?: string;
  workflow_id?: string;
  created_at: string;
  updated_at?: string;
}

export interface PhoneNumberSearchResult {
  phone_numbers: Array<{
    phone_number: string;
    provider: string;
    country: string;
    capabilities: string[];
  }>;
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

export interface PhoneNumberApiResponse extends ApiResponse<PhoneNumberData> {}
export interface PhoneNumbersListApiResponse extends ApiResponse<PhoneNumberData[]> {}
export interface PhoneNumberSearchApiResponse extends ApiResponse<PhoneNumberSearchResult> {}

// Fonctions du service

/**
 * Crée un nouveau numéro de téléphone
 */
export async function createPhoneNumber(payload: CreatePhoneNumberPayload): Promise<PhoneNumberApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('phone-numbers', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create phone number');
    }

    return data as PhoneNumberApiResponse;
  } catch (error: any) {
    console.error('Error in createPhoneNumber:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Récupère un numéro de téléphone par son ID
 */
export async function getPhoneNumberById(id: string): Promise<PhoneNumberApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`phone-numbers/${id}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve phone number with ID ${id}`);
    }

    return data as PhoneNumberApiResponse;
  } catch (error: any) {
    console.error(`Error in getPhoneNumberById(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Liste les numéros de téléphone avec pagination optionnelle
 */
export async function listPhoneNumbers(params?: ListPhoneNumbersParams): Promise<PhoneNumbersListApiResponse> {
  try {
    // Construire les query params
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    // Route avec query params
    const route = `phone-numbers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to list phone numbers');
    }

    return data as PhoneNumbersListApiResponse;
  } catch (error: any) {
    console.error('Error in listPhoneNumbers:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Met à jour un numéro de téléphone existant
 */
export async function updatePhoneNumber(id: string, payload: UpdatePhoneNumberPayload): Promise<PhoneNumberApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`phone-numbers/${id}`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to update phone number with ID ${id}`);
    }

    return data as PhoneNumberApiResponse;
  } catch (error: any) {
    console.error(`Error in updatePhoneNumber(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Supprime un numéro de téléphone par son ID
 */
export async function deletePhoneNumber(id: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`phone-numbers/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete phone number with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deletePhoneNumber(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Recherche des numéros de téléphone disponibles
 */
export async function searchPhoneNumbers(payload: SearchPhoneNumbersPayload): Promise<PhoneNumberSearchApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`phone-numbers/search`, {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to search phone numbers');
    }

    return data as PhoneNumberSearchApiResponse;
  } catch (error: any) {
    console.error('Error in searchPhoneNumbers:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Provisionne un numéro de téléphone spécifique
 */
export async function provisionPhoneNumber(payload: ProvisionPhoneNumberPayload): Promise<PhoneNumberApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`phone-numbers/provision`, {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to provision phone number');
    }

    return data as PhoneNumberApiResponse;
  } catch (error: any) {
    console.error('Error in provisionPhoneNumber:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Regrouper toutes les fonctions dans un objet exporté pour faciliter l'usage
export const phoneNumbersService = {
  create: createPhoneNumber,
  getById: getPhoneNumberById,
  list: listPhoneNumbers,
  update: updatePhoneNumber,
  delete: deletePhoneNumber,
  search: searchPhoneNumbers,
  provision: provisionPhoneNumber,
};

export default phoneNumbersService; 