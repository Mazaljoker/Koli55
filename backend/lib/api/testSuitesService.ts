import supabase from '../supabaseClient';

// Types for input payloads
export interface CreateTestSuitePayload {
  name: string;
  description?: string;
  assistant_id: string;
  metadata?: Record<string, any>;
}

export interface UpdateTestSuitePayload {
  name?: string;
  description?: string;
  assistant_id?: string;
  metadata?: Record<string, any>;
}

export interface ListTestSuitesParams {
  page?: number;
  limit?: number;
}

// Types for API responses
export interface TestSuiteData {
  id: string;
  name: string;
  description?: string;
  assistant_id: string;
  metadata?: Record<string, any>;
  test_count: number;
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

export interface TestSuiteApiResponse extends ApiResponse<TestSuiteData> {}
export interface TestSuitesListApiResponse extends ApiResponse<TestSuiteData[]> {}

// Service functions
/**
 * Creates a new test suite
 */
export async function createTestSuite(payload: CreateTestSuitePayload): Promise<TestSuiteApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('test-suites', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create test suite');
    }

    return data as TestSuiteApiResponse;
  } catch (error: any) {
    console.error('Error in createTestSuite:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Retrieves a test suite by ID
 */
export async function getTestSuiteById(id: string): Promise<TestSuiteApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`test-suites/${id}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve test suite with ID ${id}`);
    }

    return data as TestSuiteApiResponse;
  } catch (error: any) {
    console.error(`Error in getTestSuiteById(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Lists test suites with optional pagination
 */
export async function listTestSuites(params?: ListTestSuitesParams): Promise<TestSuitesListApiResponse> {
  try {
    // Build query params
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    // Route with query params
    const route = `test-suites${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to list test suites');
    }

    return data as TestSuitesListApiResponse;
  } catch (error: any) {
    console.error('Error in listTestSuites:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Updates an existing test suite
 */
export async function updateTestSuite(id: string, payload: UpdateTestSuitePayload): Promise<TestSuiteApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`test-suites/${id}`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to update test suite with ID ${id}`);
    }

    return data as TestSuiteApiResponse;
  } catch (error: any) {
    console.error(`Error in updateTestSuite(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Deletes a test suite by ID
 */
export async function deleteTestSuite(id: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`test-suites/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete test suite with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deleteTestSuite(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Group all functions into an exported object for easier usage
export const testSuitesService = {
  create: createTestSuite,
  getById: getTestSuiteById,
  list: listTestSuites,
  update: updateTestSuite,
  delete: deleteTestSuite,
};

export default testSuitesService; 