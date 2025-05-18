import supabase from '../supabaseClient';

// Types for input payloads
export interface InvokeFunctionPayload {
  name: string;
  params?: Record<string, any>;
  metadata?: Record<string, any>;
}

// Types for API responses
export interface FunctionInvocationResult {
  id: string;
  function_name: string;
  result: any;
  status: 'success' | 'error';
  execution_time_ms?: number;
  created_at: string;
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

export interface InvocationApiResponse extends ApiResponse<FunctionInvocationResult> {}

/**
 * Invokes a custom function by name
 */
export async function invokeCustomFunction(payload: InvokeFunctionPayload): Promise<InvocationApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`custom-functions/invoke`, {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to invoke function ${payload.name}`);
    }

    return data as InvocationApiResponse;
  } catch (error: any) {
    console.error(`Error in invokeCustomFunction(${payload.name}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Retrieves the result of a past function invocation
 */
export async function getInvocationResult(invocationId: string): Promise<InvocationApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`custom-functions/invocation/${invocationId}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve result for invocation ${invocationId}`);
    }

    return data as InvocationApiResponse;
  } catch (error: any) {
    console.error(`Error in getInvocationResult(${invocationId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * List all custom functions available for invocation
 */
export async function listAvailableCustomFunctions(): Promise<ApiResponse<string[]>> {
  try {
    const { data, error } = await supabase.functions.invoke(`custom-functions/list`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to list available custom functions');
    }

    return data as ApiResponse<string[]>;
  } catch (error: any) {
    console.error('Error in listAvailableCustomFunctions:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

// Group all functions into an exported object for easier usage
export const customFunctionsService = {
  invoke: invokeCustomFunction,
  getInvocationResult,
  listAvailable: listAvailableCustomFunctions,
};

export default customFunctionsService; 