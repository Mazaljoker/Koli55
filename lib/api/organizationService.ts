import supabase from '../supabaseClient';

// Types pour les payloads d'entrée
export interface CreateOrganizationPayload {
  name: string;
  description?: string;
  settings?: Record<string, any>;
}

export interface UpdateOrganizationPayload {
  name?: string;
  description?: string;
  settings?: Record<string, any>;
}

export interface ListOrganizationsParams {
  page?: number;
  limit?: number;
}

export interface InviteUserPayload {
  email: string;
  role?: 'admin' | 'member' | 'viewer';
  message?: string;
}

// Types pour les réponses d'API
export interface OrganizationData {
  id: string;
  name: string;
  description?: string;
  settings?: Record<string, any>;
  created_at: string;
  updated_at?: string;
  owner_id?: string;
}

export interface OrganizationMember {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  invited_at?: string;
  joined_at?: string;
}

export interface OrganizationApiResponse extends ApiResponse<OrganizationData> {}
export interface OrganizationsListApiResponse extends ApiResponse<OrganizationData[]> {}
export interface OrganizationMembersApiResponse extends ApiResponse<OrganizationMember[]> {}
export interface InvitationApiResponse extends ApiResponse<{invitation_id: string}> {}

// Réutilisation des types communs d'API response
import { ApiResponse, PaginationData } from './assistantsService';

// Fonctions du service
/**
 * Crée une nouvelle organisation
 */
export async function createOrganization(payload: CreateOrganizationPayload): Promise<OrganizationApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('organization', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create organization');
    }

    return data as OrganizationApiResponse;
  } catch (error: any) {
    console.error('Error in createOrganization:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Récupère une organisation par son ID
 */
export async function getOrganizationById(id: string): Promise<OrganizationApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`organization/${id}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve organization with ID ${id}`);
    }

    return data as OrganizationApiResponse;
  } catch (error: any) {
    console.error(`Error in getOrganizationById(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Liste les organisations avec pagination optionnelle
 */
export async function listOrganizations(params?: ListOrganizationsParams): Promise<OrganizationsListApiResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const route = `organization${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to list organizations');
    }

    return data as OrganizationsListApiResponse;
  } catch (error: any) {
    console.error('Error in listOrganizations:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Met à jour une organisation existante
 */
export async function updateOrganization(id: string, payload: UpdateOrganizationPayload): Promise<OrganizationApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`organization/${id}`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to update organization with ID ${id}`);
    }

    return data as OrganizationApiResponse;
  } catch (error: any) {
    console.error(`Error in updateOrganization(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Supprime une organisation par son ID
 */
export async function deleteOrganization(id: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`organization/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete organization with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deleteOrganization(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Récupère l'organisation actuelle de l'utilisateur
 */
export async function getCurrentOrganization(): Promise<OrganizationApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('organization/current', {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to retrieve current organization');
    }

    return data as OrganizationApiResponse;
  } catch (error: any) {
    console.error('Error in getCurrentOrganization:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Liste les membres d'une organisation
 */
export async function listOrganizationMembers(orgId: string): Promise<OrganizationMembersApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`organization/${orgId}/members`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to list members for organization ${orgId}`);
    }

    return data as OrganizationMembersApiResponse;
  } catch (error: any) {
    console.error(`Error in listOrganizationMembers(${orgId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Invite un utilisateur à rejoindre une organisation
 */
export async function inviteUserToOrganization(orgId: string, payload: InviteUserPayload): Promise<InvitationApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`organization/${orgId}/invite`, {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to invite user to organization ${orgId}`);
    }

    return data as InvitationApiResponse;
  } catch (error: any) {
    console.error(`Error in inviteUserToOrganization(${orgId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Supprime un membre d'une organisation
 */
export async function removeMemberFromOrganization(orgId: string, memberId: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`organization/${orgId}/members/${memberId}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to remove member ${memberId} from organization ${orgId}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in removeMemberFromOrganization(${orgId}, ${memberId}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Regrouper toutes les fonctions dans un objet exporté pour faciliter l'usage
export const organizationService = {
  create: createOrganization,
  getById: getOrganizationById,
  list: listOrganizations,
  update: updateOrganization,
  delete: deleteOrganization,
  getCurrent: getCurrentOrganization,
  listMembers: listOrganizationMembers,
  inviteUser: inviteUserToOrganization,
  removeMember: removeMemberFromOrganization,
};

export default organizationService; 