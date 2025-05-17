import supabase from '../supabaseClient';

// Types for input payloads
export interface UploadFileParams {
  file: File;
  purpose: 'assistants' | 'knowledge-bases';
  metadata?: Record<string, any>;
}

export interface ListFilesParams {
  page?: number;
  limit?: number;
  purpose?: 'assistants' | 'knowledge-bases';
}

// Types for API responses
export interface FileData {
  id: string;
  filename: string;
  purpose: 'assistants' | 'knowledge-bases';
  size_bytes: number;
  mime_type?: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at?: string;
}

export interface FileContentData {
  text?: string;
  data?: Uint8Array;
  metadata?: Record<string, any>;
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

export interface FileApiResponse extends ApiResponse<FileData> {}
export interface FilesListApiResponse extends ApiResponse<FileData[]> {}
export interface FileContentApiResponse extends ApiResponse<FileContentData> {}

// Service functions
/**
 * Uploads a new file
 */
export async function uploadFile(params: UploadFileParams): Promise<FileApiResponse> {
  try {
    const formData = new FormData();
    formData.append('file', params.file);
    formData.append('purpose', params.purpose);
    
    if (params.metadata) {
      formData.append('metadata', JSON.stringify(params.metadata));
    }

    const { data, error } = await supabase.functions.invoke('files', {
      method: 'POST',
      body: formData,
      headers: {
        // No need to set Content-Type, it's automatically set with boundary for FormData
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to upload file');
    }

    return data as FileApiResponse;
  } catch (error: any) {
    console.error('Error in uploadFile:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Retrieves a file by ID
 */
export async function getFileById(id: string): Promise<FileApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`files/${id}`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve file with ID ${id}`);
    }

    return data as FileApiResponse;
  } catch (error: any) {
    console.error(`Error in getFileById(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Retrieves file content by ID
 */
export async function getFileContent(id: string): Promise<FileContentApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`files/${id}/content`, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || `Failed to retrieve content for file with ID ${id}`);
    }

    return data as FileContentApiResponse;
  } catch (error: any) {
    console.error(`Error in getFileContent(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Lists files with optional pagination and filtering
 */
export async function listFiles(params?: ListFilesParams): Promise<FilesListApiResponse> {
  try {
    // Build query params
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.purpose) queryParams.append('purpose', params.purpose);
    
    // Route with query params
    const route = `files${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to list files');
    }

    return data as FilesListApiResponse;
  } catch (error: any) {
    console.error('Error in listFiles:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Deletes a file by ID
 */
export async function deleteFile(id: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`files/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete file with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deleteFile(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Group all functions into an exported object for easier usage
export const filesService = {
  upload: uploadFile,
  getById: getFileById,
  getContent: getFileContent,
  list: listFiles,
  delete: deleteFile,
};

export default filesService; 