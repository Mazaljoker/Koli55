import supabase from '../supabaseClient';

// Types for workflow step (could be complex)
export interface WorkflowStep {
  type: string; // e.g., 'llm', 'function', 'condition', etc.
  [key: string]: any; // Other properties depend on step type
}

// Types for input payloads
export interface CreateWorkflowPayload {
  name: string;
  description?: string;
  steps: WorkflowStep[];
  metadata?: Record<string, any>;
}

export interface UpdateWorkflowPayload {
  name?: string;
  description?: string;
  steps?: WorkflowStep[];
  metadata?: Record<string, any>;
}

export interface ExecuteWorkflowPayload {
  inputs: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface ListWorkflowsParams {
  page?: number;
  limit?: number;
}

// Types for API responses
export interface WorkflowData {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface WorkflowExecutionData {
  id: string;
  workflow_id: string;
  status: string; // 'running', 'completed', 'failed', etc.
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  error?: any;
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

export interface WorkflowApiResponse extends ApiResponse<WorkflowData> {}
export interface WorkflowsListApiResponse extends ApiResponse<WorkflowData[]> {}
export interface WorkflowExecutionApiResponse extends ApiResponse<WorkflowExecutionData> {}

// Service functions
/**
 * Creates a new workflow
 */
export async function createWorkflow(payload: CreateWorkflowPayload): Promise<WorkflowApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('workflows', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create workflow');
    }

    return data as WorkflowApiResponse;
  } catch (error: any) {
    console.error('Error in createWorkflow:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Retrieves a workflow by ID
 */
export async function getWorkflowById(id: string): Promise<WorkflowApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`workflows/${id}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve workflow with ID ${id}`);
    }

    return data as WorkflowApiResponse;
  } catch (error: any) {
    console.error(`Error in getWorkflowById(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Lists workflows with optional pagination
 */
export async function listWorkflows(params?: ListWorkflowsParams): Promise<WorkflowsListApiResponse> {
  try {
    // Build query params
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    // Route with query params
    const route = `workflows${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to list workflows');
    }

    return data as WorkflowsListApiResponse;
  } catch (error: any) {
    console.error('Error in listWorkflows:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Updates an existing workflow
 */
export async function updateWorkflow(id: string, payload: UpdateWorkflowPayload): Promise<WorkflowApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`workflows/${id}`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to update workflow with ID ${id}`);
    }

    return data as WorkflowApiResponse;
  } catch (error: any) {
    console.error(`Error in updateWorkflow(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Deletes a workflow by ID
 */
export async function deleteWorkflow(id: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`workflows/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete workflow with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deleteWorkflow(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Executes a workflow
 */
export async function executeWorkflow(id: string, payload: ExecuteWorkflowPayload): Promise<WorkflowExecutionApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`workflows/${id}/execute`, {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to execute workflow with ID ${id}`);
    }

    return data as WorkflowExecutionApiResponse;
  } catch (error: any) {
    console.error(`Error in executeWorkflow(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Group all functions into an exported object for easier usage
export const workflowsService = {
  create: createWorkflow,
  getById: getWorkflowById,
  list: listWorkflows,
  update: updateWorkflow,
  delete: deleteWorkflow,
  execute: executeWorkflow,
};

export default workflowsService;