import supabase from '../supabaseClient';

// Fonction utilitaire pour logger les appels API
const logApiCall = (action: string, endpoint: string, payload?: any, response?: any, error?: any) => {
  // Si nous sommes côté client, enregistrer dans le localStorage
  if (typeof window !== 'undefined') {
    try {
      const logs = JSON.parse(localStorage.getItem('koli55_api_logs') || '[]');
      logs.unshift({
        timestamp: new Date().toISOString(),
        action,
        endpoint,
        payload: payload ? JSON.stringify(payload) : null,
        response: response ? JSON.stringify(response) : null,
        error: error ? (typeof error === 'object' ? JSON.stringify(error) : error.toString()) : null
      });
      
      // Limiter à 50 entrées
      if (logs.length > 50) {
        logs.length = 50;
      }
      
      localStorage.setItem('koli55_api_logs', JSON.stringify(logs));
    } catch (err) {
      console.error('Error logging API call to localStorage:', err);
    }
  }
  
  // Toujours logger dans la console pour débogage
  console.group(`API Call: ${action} - ${endpoint}`);
  console.log('Timestamp:', new Date().toISOString());
  if (payload) console.log('Payload:', payload);
  if (response) console.log('Response:', response);
  if (error) console.error('Error:', error);
  console.groupEnd();
};

// Types avancés pour model et voice

/**
 * Structure détaillée d'un modèle LLM
 * Peut être utilisé comme alternative à la chaîne simple
 */
export interface ModelConfig {
  provider: string; // 'openai', 'anthropic', 'cohere', 'google', etc.
  model: string; // 'gpt-4o', 'claude-3-opus-20240229', etc.
  systemPrompt?: string; // Instructions système (remplace instructions si présent)
  temperature?: number; // Entre 0 et 1
  topP?: number; // Entre 0 et 1
  maxTokens?: number; // Nombre maximal de tokens
}

/**
 * Structure détaillée d'une voix TTS
 * Peut être utilisé comme alternative à la chaîne simple
 */
export interface VoiceConfig {
  provider: string; // 'elevenlabs', 'deepgram', 'openai', etc.
  voiceId: string; // ID spécifique au provider
}

/**
 * Configuration des outils disponibles pour l'assistant
 */
export interface ToolsConfig {
  functions?: string[]; // IDs des fonctions disponibles
  knowledgeBases?: string[]; // IDs des bases de connaissances
  workflows?: string[]; // IDs des workflows disponibles
}

/**
 * Configuration des paramètres d'enregistrement
 */
export interface RecordingSettings {
  createRecording: boolean;
  saveRecording: boolean;
}

// Types pour les payloads d'entrée

export interface CreateAssistantPayload {
  name: string;
  model?: string | ModelConfig;
  language?: string; // e.g., 'en-US', 'fr-FR'
  voice?: string | VoiceConfig;
  firstMessage?: string; // Initial message from the assistant
  instructions?: string; // system_prompt (ignoré si model.systemPrompt est défini)
  tools_config?: ToolsConfig;
  forwarding_phone_number?: string;
  // Paramètres avancés d'appel
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
  recordingSettings?: RecordingSettings;
  metadata?: Record<string, any>;
}

export interface UpdateAssistantPayload {
  name?: string;
  model?: string | ModelConfig;
  language?: string;
  voice?: string | VoiceConfig;
  firstMessage?: string;
  instructions?: string;
  tools_config?: ToolsConfig;
  forwarding_phone_number?: string;
  // Paramètres avancés d'appel
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
  recordingSettings?: RecordingSettings;
  metadata?: Record<string, any>;
}

export interface ListAssistantsParams {
  page?: number;
  limit?: number;
  action?: string; // Par exemple 'listMine' pour lister les assistants de l'utilisateur courant
}

// Types pour les réponses d'API

export interface AssistantData {
  id: string;
  name: string;
  model?: string | ModelConfig; // Chaîne simple ou objet structuré
  language?: string;
  voice?: string | VoiceConfig; // Chaîne simple ou objet structuré
  firstMessage?: string;
  instructions?: string;
  tools_config?: ToolsConfig;
  forwarding_phone_number?: string;
  // Paramètres avancés d'appel
  silence_timeout_seconds?: number;
  max_duration_seconds?: number;
  end_call_after_silence?: boolean;
  voice_reflection?: boolean;
  recording_settings?: RecordingSettings;
  metadata?: Record<string, any>;
  // Détails Vapi mis en cache
  vapi_assistant_id?: string; // ID de l'assistant chez Vapi
  vapi_model_details?: string; // JSON stringifié des détails du modèle chez Vapi
  vapi_voice_details?: string; // JSON stringifié des détails de la voix chez Vapi
  created_at: string;
  updated_at?: string;
  user_id?: string; // Supabase spécifique, lié à l'utilisateur propriétaire
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
  vapi_error?: string;
}

export interface AssistantApiResponse extends ApiResponse<AssistantData> {}
export interface AssistantsListApiResponse extends ApiResponse<AssistantData[]> {}

// Fonctions du service

/**
 * Crée un nouvel assistant dans Vapi via l'Edge Function
 */
export async function createAssistant(payload: CreateAssistantPayload): Promise<AssistantApiResponse> {
  try {
    logApiCall('CREATE', 'assistants', payload);
    
    // Ajouter un timeout pour la requête réelle
    const timeoutPromise = new Promise<{ data: null, error: Error }>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout: Edge Function did not respond in time'));
      }, 8000); // 8 secondes de timeout pour la création
    });
    
    // Préparer la requête à la fonction Edge
    const fetchPromise = supabase.functions.invoke('assistants', {
      method: 'POST',
      body: payload,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    
    logApiCall('FETCH', 'assistants', {method: 'POST', body: payload, headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }});
    
    try {
      // Race entre le timeout et la requête
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (error) {
        console.warn('Edge Function error in createAssistant:', error);
        logApiCall('ERROR', 'assistants', payload, null, error);
        throw new Error(error.message || 'Failed to create assistant - Edge Function error');
      }
      
      // Vérifier que la réponse est valide
      if (!data) {
        const noDataError = new Error('No data received from Edge Function');
        logApiCall('ERROR', 'assistants', payload, null, noDataError);
        throw noDataError;
      }
      
      if (typeof data !== 'object' || !('success' in data)) {
        console.error('Invalid response format:', data);
        const invalidFormatError = new Error('Invalid response format from Edge Function');
        logApiCall('ERROR', 'assistants', payload, data, invalidFormatError);
        throw invalidFormatError;
      }
      
      logApiCall('SUCCESS', 'assistants', payload, data);
      return data as AssistantApiResponse;
    } catch (innerError: any) {
      // Capture les erreurs spécifiques à la requête
      console.error('Network or timeout error:', innerError);
      logApiCall('NETWORK_ERROR', 'assistants', payload, null, innerError);
      
      throw innerError;
    }
  } catch (error: any) {
    console.error('Error in createAssistant:', error);
    
    // Message d'erreur détaillé pour faciliter le débogage
    let errorMessage = 'Une erreur inattendue est survenue lors de la création de l\'assistant.';
    
    if (error.message) {
      errorMessage = error.message;
      
      // Améliorer les messages d'erreur spécifiques
      if (error.message.includes('non-2xx status code')) {
        errorMessage = 'La fonction Edge a retourné une erreur. Vérifiez que les fonctions Edge sont correctement déployées et que VAPI_API_KEY est configurée.';
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Délai d\'attente dépassé lors de la connexion à la fonction Edge. Vérifiez votre connexion réseau et l\'état des services Supabase.';
      } else if (error.message.includes('failed to fetch')) {
        errorMessage = 'Impossible de contacter les services Supabase. Vérifiez votre connexion internet.';
      }
    }
    
    const errorResponse = {
      success: false,
      message: errorMessage,
      vapi_error: error.vapi_error || undefined,
    };
    
    logApiCall('ERROR_RESPONSE', 'assistants', null, errorResponse, error);
    return errorResponse;
  }
}

/**
 * Récupère un assistant par son ID
 */
export async function getAssistantById(id: string): Promise<AssistantApiResponse> {
  try {
    // Ajouter un timeout pour la requête
    const timeoutPromise = new Promise<{ data: null, error: Error }>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout: Edge Function did not respond in time'));
      }, 5000); // 5 secondes de timeout
    });
    
    // Exécuter la requête avec un timeout
    const fetchPromise = supabase.functions.invoke(`assistants/${id}`, {
      method: 'GET',
    });
    
    // Race entre le timeout et la requête
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

    if (error) {
      console.warn('Edge Function error:', error.message);
      throw new Error(error.message || `Failed to retrieve assistant with ID ${id}`);
    }

    // Vérifier que la réponse est valide
    if (!data || typeof data !== 'object' || !('success' in data)) {
      throw new Error('Invalid response format from Edge Function');
    }

    return data as AssistantApiResponse;
  } catch (error: any) {
    console.error(`Error in getAssistantById(${id}):`, error);
    
    return {
      success: false,
      message: error.message?.includes('Edge Function') 
        ? "Impossible de se connecter aux services Supabase Edge Functions. Vérifiez votre connexion et que les fonctions sont bien déployées."
        : (error.message || 'An unexpected error occurred'),
    };
  }
}

/**
 * Liste les assistants avec pagination optionnelle
 */
export async function listAssistants(params?: ListAssistantsParams): Promise<AssistantsListApiResponse> {
  try {
    // Construire les query params ou body selon l'implémentation de l'Edge Function
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    // Préparer le corps de la requête si action est spécifié
    const body = params?.action ? { action: params.action } : undefined;
    
    // Route avec query params
    const route = `assistants${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    // Ajouter un timeout pour la requête
    const timeoutPromise = new Promise<{ data: null, error: Error }>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout: Edge Function did not respond in time'));
      }, 5000); // 5 secondes de timeout
    });
    
    // Exécuter la requête avec un timeout
    const fetchPromise = supabase.functions.invoke(route, {
      method: 'GET',
      body, // Body pour action spécifique comme 'listMine'
    });
    
    // Race entre le timeout et la requête
    const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
    
    if (error) {
      console.warn('Edge Function error:', error.message);
      throw new Error(error.message || 'Failed to list assistants');
    }
    
    // Vérifier que la réponse est valide
    if (!data || typeof data !== 'object' || !('success' in data)) {
      throw new Error('Invalid response format from Edge Function');
    }

    return data as AssistantsListApiResponse;
  } catch (error: any) {
    console.error('Error in listAssistants:', error);
    
    return {
      success: false,
      message: error.message?.includes('Edge Function') 
        ? "Impossible de se connecter aux services Supabase Edge Functions. Vérifiez votre connexion et que les fonctions sont bien déployées."
        : (error.message || 'An unexpected error occurred'),
      data: [],
    };
  }
}

/**
 * Met à jour un assistant existant
 */
export async function updateAssistant(id: string, payload: UpdateAssistantPayload): Promise<AssistantApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke(`assistants/${id}`, {
      method: 'PATCH',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || `Failed to update assistant with ID ${id}`);
    }

    return data as AssistantApiResponse;
  } catch (error: any) {
    console.error(`Error in updateAssistant(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Supprime un assistant par son ID
 */
export async function deleteAssistant(id: string): Promise<ApiResponse<null>> {
  try {
    const { data, error } = await supabase.functions.invoke(`assistants/${id}`, {
      method: 'DELETE',
    });

    if (error) {
      throw new Error(error.message || `Failed to delete assistant with ID ${id}`);
    }

    return data as ApiResponse<null>;
  } catch (error: any) {
    console.error(`Error in deleteAssistant(${id}):`, error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Test de connectivité avec les fonctions Edge
 * Utile pour diagnostiquer les problèmes de connexion aux fonctions Edge
 */
export async function testEdgeFunctionConnectivity(): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('Testing Edge Function connectivity...');
    
    // Définir un timeout court pour le test
    const timeoutPromise = new Promise<{ data: null, error: Error }>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Request timeout during connectivity test'));
      }, 5000); // 5 secondes pour le test
    });
    
    // Essayer d'appeler une fonction Edge simple avec un court timeout
    const fetchPromise = supabase.functions.invoke('test', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    });
    
    try {
      // Race entre le timeout et la requête
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);
      
      if (error) {
        console.error('Edge Function connectivity test failed:', error.message);
        return { 
          success: false, 
          error: `Failed to send a request to the Edge Function: ${error.message}`
        };
      }
      
      // Vérifier que la réponse est valide
      if (!data || !data.success) {
        console.error('Invalid response from Edge Function test:', data);
        return {
          success: false,
          error: 'Invalid response from Edge Function test'
        };
      }
      
      // Test réussi
      console.log('Edge Function connectivity test successful');
      return { success: true };
    } catch (timeoutError: any) {
      console.error('Edge Function connectivity test failed:', timeoutError.message);
      return {
        success: false,
        error: 'Failed to send a request to the Edge Function'
      };
    }
  } catch (error: any) {
    console.error('Error during connectivity test:', error);
    return { 
      success: false, 
      error: 'Failed to send a request to the Edge Function'
    };
  }
}

// Regrouper toutes les fonctions dans un objet exporté pour faciliter l'usage
export const assistantsService = {
  create: createAssistant,
  getById: getAssistantById,
  list: listAssistants,
  update: updateAssistant,
  delete: deleteAssistant,
  testConnectivity: testEdgeFunctionConnectivity
};

export default assistantsService; 