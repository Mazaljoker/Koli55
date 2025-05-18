import supabase from '../supabaseClient';

// Types for input payloads
export interface FunctionParameter {
  type: string;
  description?: string;
  required?: boolean;
  [key: string]: any; // Other JSONSchema properties
}

export interface FunctionParameters {
  type: string; // Usually "object"
  properties: Record<string, FunctionParameter>;
  required?: string[];
  [key: string]: any; // Other JSONSchema properties
}

export interface CreateFunctionPayload {
  name: string;
  description?: string;
  parameters: FunctionParameters;
  webhook_url?: string;
  metadata?: Record<string, any>;
}

export interface UpdateFunctionPayload {
  name?: string;
  description?: string;
  parameters?: FunctionParameters;
  webhook_url?: string;
  metadata?: Record<string, any>;
}

export interface ListFunctionsParams {
  page?: number;
  limit?: number;
}

// Types for API responses
export interface FunctionData {
  id: string;
  name: string;
  description?: string;
  parameters: FunctionParameters;
  webhook_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
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

export interface FunctionApiResponse extends ApiResponse<FunctionData> {}
export interface FunctionsListApiResponse extends ApiResponse<FunctionData[]> {}

// Service functions
/**
 * Creates a new function (tool)
 */
export async function createFunction(payload: CreateFunctionPayload): Promise<FunctionApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('functions', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create function');
    }

    return data as FunctionApiResponse;
  } catch (error: any) {
    console.error('Error in createFunction:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Retrieves a function by ID
 */
export async function getFunctionById(id: string): Promise<FunctionApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`functions/${id}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve function with ID ${id}`);
    }

    return data as FunctionApiResponse;
  } catch (error: any) {
    console.error(`Error in getFunctionById(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Lists functions with optional pagination
 */
export async function listFunctions(params?: ListFunctionsParams): Promise<FunctionsListApiResponse> {
  try {
    // Build query params
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    // Route with query params
    const route = `functions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to list functions');
    }

    return data as FunctionsListApiResponse;
  } catch (error: any) {
    console.error('Error in listFunctions:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Updates an existing function
 */
export async function updateFunction(id: string, payload: UpdateFunctionPayload): Promise<FunctionApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`functions/${id}`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to update function with ID ${id}`);
    }

    return data as FunctionApiResponse;
  } catch (error: any) {
    console.error(`Error in updateFunction(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Deletes a function by ID
 */
export async function deleteFunction(id: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`functions/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete function with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deleteFunction(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Group all functions into an exported object for easier usage
export const functionsService = {
  create: createFunction,
  getById: getFunctionById,
  list: listFunctions,
  update: updateFunction,
  delete: deleteFunction,
};

export default functionsService; 