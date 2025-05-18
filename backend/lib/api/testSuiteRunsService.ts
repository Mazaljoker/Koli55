import supabase from '../supabaseClient';
import { ApiResponse, PaginationData } from './assistantsService';

// Types pour les payloads d'entrée
export interface ListTestRunsParams {
  page?: number;
  limit?: number;
  suite_id?: string;
  status?: 'running' | 'completed' | 'failed' | 'cancelled';
  start_date?: string;
  end_date?: string;
}

// Types pour les réponses d'API
export interface TestRunData {
  id: string;
  suite_id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  total_tests: number;
  passed_tests: number;
  failed_tests: number;
  error_tests: number;
  duration_seconds: number;
  started_at: string;
  completed_at?: string;
  created_by?: string;
  summary?: string;
  settings?: Record<string, any>;
}

export interface TestResultData {
  id: string;
  run_id: string;
  test_id: string;
  status: 'success' | 'failure' | 'error' | 'timeout' | 'pending';
  input: string;
  expected_output?: string;
  actual_output?: string;
  similarity?: number;
  duration_seconds: number;
  error?: string;
  created_at: string;
}

export interface TestRunApiResponse extends ApiResponse<TestRunData> {}
export interface TestRunsListApiResponse extends ApiResponse<TestRunData[]> {}
export interface TestResultsListApiResponse extends ApiResponse<TestResultData[]> {}

// Fonctions du service
/**
 * Récupère une exécution de suite de tests par son ID
 */
export async function getTestRunById(id: string): Promise<TestRunApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`test-suite-runs/${id}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve test run with ID ${id}`);
    }

    return data as TestRunApiResponse;
  } catch (error: any) {
    console.error(`Error in getTestRunById(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Liste les exécutions de suites de tests avec pagination optionnelle
 */
export async function listTestRuns(params?: ListTestRunsParams): Promise<TestRunsListApiResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.suite_id) queryParams.append('suite_id', params.suite_id);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    
    const route = `test-suite-runs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to list test runs');
    }

    return data as TestRunsListApiResponse;
  } catch (error: any) {
    console.error('Error in listTestRuns:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Annule une exécution de suite de tests en cours
 */
export async function cancelTestRun(id: string): Promise<TestRunApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`test-suite-runs/${id}/cancel`, {
      method: 'POST',
    });

    if (error) {
      throw new Error(error.message || `Failed to cancel test run with ID ${id}`);
    }

    return data as TestRunApiResponse;
  } catch (error: any) {
    console.error(`Error in cancelTestRun(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Récupère les résultats détaillés d'une exécution de suite de tests
 */
export async function getTestRunResults(id: string): Promise<TestResultsListApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`test-suite-runs/${id}/results`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to get results for test run with ID ${id}`);
    }

    return data as TestResultsListApiResponse;
  } catch (error: any) {
    console.error(`Error in getTestRunResults(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Exporte les résultats d'un test run au format JSON ou CSV
 */
export async function exportTestRunResults(id: string, format: 'json' | 'csv' = 'json'): Promise<ApiResponse<{url: string}>> {
  try {
    const { data, error } = await supabase.functions.invoke(`test-suite-runs/${id}/export`, {
      method: 'POST',
      body: { format },
    });

    if (error) {
      throw new Error(error.message || `Failed to export results for test run with ID ${id}`);
    }

    return data as ApiResponse<{url: string}>;
  } catch (error: any) {
    console.error(`Error in exportTestRunResults(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Supprime une exécution de suite de tests
 */
export async function deleteTestRun(id: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`test-suite-runs/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete test run with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deleteTestRun(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Regrouper toutes les fonctions dans un objet exporté pour faciliter l'usage
export const testSuiteRunsService = {
  getById: getTestRunById,
  list: listTestRuns,
  cancel: cancelTestRun,
  getResults: getTestRunResults,
  exportResults: exportTestRunResults,
  delete: deleteTestRun,
};

export default testSuiteRunsService; 