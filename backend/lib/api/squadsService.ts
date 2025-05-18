import supabase from '../supabaseClient';

// Types for input payloads
export interface SquadMember {
  id: string;
  role: string; // 'assistant', 'viewer', 'editor', etc.
}

export interface CreateSquadPayload {
  name: string;
  description?: string;
  members?: SquadMember[];
  metadata?: Record<string, any>;
}

export interface UpdateSquadPayload {
  name?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface AddMembersPayload {
  members: SquadMember[];
}

export interface ListSquadsParams {
  page?: number;
  limit?: number;
}

// Types for API responses
export interface SquadData {
  id: string;
  name: string;
  description?: string;
  members: SquadMember[];
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

export interface SquadApiResponse extends ApiResponse<SquadData> {}
export interface SquadsListApiResponse extends ApiResponse<SquadData[]> {}

// Service functions
/**
 * Creates a new squad
 */
export async function createSquad(payload: CreateSquadPayload): Promise<SquadApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('squads', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create squad');
    }

    return data as SquadApiResponse;
  } catch (error: any) {
    console.error('Error in createSquad:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Retrieves a squad by ID
 */
export async function getSquadById(id: string): Promise<SquadApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`squads/${id}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve squad with ID ${id}`);
    }

    return data as SquadApiResponse;
  } catch (error: any) {
    console.error(`Error in getSquadById(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Lists squads with optional pagination
 */
export async function listSquads(params?: ListSquadsParams): Promise<SquadsListApiResponse> {
  try {
    // Build query params
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    // Route with query params
    const route = `squads${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to list squads');
    }

    return data as SquadsListApiResponse;
  } catch (error: any) {
    console.error('Error in listSquads:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Updates an existing squad
 */
export async function updateSquad(id: string, payload: UpdateSquadPayload): Promise<SquadApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`squads/${id}`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to update squad with ID ${id}`);
    }

    return data as SquadApiResponse;
  } catch (error: any) {
    console.error(`Error in updateSquad(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Deletes a squad by ID
 */
export async function deleteSquad(id: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`squads/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete squad with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deleteSquad(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Adds members to a squad
 */
export async function addMembersToSquad(id: string, payload: AddMembersPayload): Promise<SquadApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`squads/${id}/members`, {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to add members to squad with ID ${id}`);
    }

    return data as SquadApiResponse;
  } catch (error: any) {
    console.error(`Error in addMembersToSquad(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Removes a member from a squad
 */
export async function removeMemberFromSquad(squadId: string, memberId: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`squads/${squadId}/members/${memberId}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to remove member from squad with ID ${squadId}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in removeMemberFromSquad(${squadId}, ${memberId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Group all functions into an exported object for easier usage
export const squadsService = {
  create: createSquad,
  getById: getSquadById,
  list: listSquads,
  update: updateSquad,
  delete: deleteSquad,
  addMembers: addMembersToSquad,
  removeMember: removeMemberFromSquad,
};

export default squadsService; 