import supabase from '../supabaseClient';

// Types for input payloads
export interface CreateTestSuiteTestPayload {
  name: string;
  description?: string;
  expected_output: string;
  input: string;
  metadata?: Record<string, any>;
}

export interface UpdateTestSuiteTestPayload {
  name?: string;
  description?: string;
  expected_output?: string;
  input?: string;
  metadata?: Record<string, any>;
}

export interface ListTestSuiteTestsParams {
  page?: number;
  limit?: number;
}

// Types for API responses
export interface TestSuiteTestData {
  id: string;
  name: string;
  description?: string;
  input: string;
  expected_output: string;
  test_suite_id: string;
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

export interface TestSuiteTestApiResponse extends ApiResponse<TestSuiteTestData> {}
export interface TestSuiteTestsListApiResponse extends ApiResponse<TestSuiteTestData[]> {}

// Service functions
/**
 * Creates a new test in a test suite
 */
export async function createTestSuiteTest(
  suiteId: string,
  payload: CreateTestSuiteTestPayload
): Promise<TestSuiteTestApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`test-suite-tests/${suiteId}`, {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create test in test suite');
    }

    return data as TestSuiteTestApiResponse;
  } catch (error: any) {
    console.error(`Error in createTestSuiteTest(${suiteId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Retrieves a test by ID from a test suite
 */
export async function getTestSuiteTestById(
  suiteId: string,
  testId: string
): Promise<TestSuiteTestApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`test-suite-tests/${suiteId}/${testId}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve test with ID ${testId} from test suite ${suiteId}`);
    }

    return data as TestSuiteTestApiResponse;
  } catch (error: any) {
    console.error(`Error in getTestSuiteTestById(${suiteId}, ${testId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Lists tests in a test suite with optional pagination
 */
export async function listTestSuiteTests(
  suiteId: string,
  params?: ListTestSuiteTestsParams
): Promise<TestSuiteTestsListApiResponse> {
  try {
    // Build query params
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    // Route with query params
    const route = `test-suite-tests/${suiteId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to list tests in test suite ${suiteId}`);
    }

    return data as TestSuiteTestsListApiResponse;
  } catch (error: any) {
    console.error(`Error in listTestSuiteTests(${suiteId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Updates an existing test in a test suite
 */
export async function updateTestSuiteTest(
  suiteId: string,
  testId: string,
  payload: UpdateTestSuiteTestPayload
): Promise<TestSuiteTestApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`test-suite-tests/${suiteId}/${testId}`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to update test with ID ${testId} in test suite ${suiteId}`);
    }

    return data as TestSuiteTestApiResponse;
  } catch (error: any) {
    console.error(`Error in updateTestSuiteTest(${suiteId}, ${testId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Deletes a test from a test suite by ID
 */
export async function deleteTestSuiteTest(
  suiteId: string,
  testId: string
): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`test-suite-tests/${suiteId}/${testId}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete test with ID ${testId} from test suite ${suiteId}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deleteTestSuiteTest(${suiteId}, ${testId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Group all functions into an exported object for easier usage
export const testSuiteTestsService = {
  create: createTestSuiteTest,
  getById: getTestSuiteTestById,
  list: listTestSuiteTests,
  update: updateTestSuiteTest,
  delete: deleteTestSuiteTest,
};

export default testSuiteTestsService; 