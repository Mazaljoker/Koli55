import supabase, { USE_DEMO_DATA } from '../supabaseClient';

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
    const { data, error } = await supabase.functions.invoke('assistants', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create assistant');
    }

    return data as AssistantApiResponse;
  } catch (error: any) {
    console.error('Error in createAssistant:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
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
    
    // Si on est en mode développement et que l'ID est un ID démo connu, renvoyer des données de test
    if (USE_DEMO_DATA && (id.startsWith('demo-') || error.message?.includes('Edge Function'))) {
      console.log(`Using mock data for assistant ID ${id} in development mode`);
      
      // Créer un assistant mock en fonction de l'ID
      const mockAssistant: AssistantData = {
        id,
        name: id === 'demo-1' ? 'Assistant Commercial' : 
              id === 'demo-2' ? 'Support Technique' : 
              id === 'demo-3' ? 'Service Client' : `Assistant ${id}`,
        model: id === 'demo-1' ? 'gpt-4o' : 
               id === 'demo-2' ? 'claude-3-opus-20240229' : 'gpt-3.5-turbo',
        language: 'fr-FR',
        forwarding_phone_number: id === 'demo-1' ? '+33755558899' : undefined,
        created_at: new Date().toISOString(),
        updated_at: id !== 'demo-3' ? new Date().toISOString() : undefined,
      };
      
      return {
        success: true,
        message: 'Mock data returned due to Edge Function failure',
        data: mockAssistant,
      };
    }
    
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
    
    // Si on est en mode développement, renvoyer des données de test
    if (USE_DEMO_DATA) {
      console.log('Using mock data for assistants in development mode');
      
      const mockAssistants: AssistantData[] = [
        {
          id: "demo-1",
          name: "Assistant Commercial",
          model: "gpt-4o",
          language: "fr-FR",
          forwarding_phone_number: "+33755558899",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: "demo-2",
          name: "Support Technique",
          model: "claude-3-opus-20240229", 
          language: "fr-FR",
          created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: "demo-3",
          name: "Service Client",
          language: "fr-FR",
          created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
        }
      ];
      
      return {
        success: true,
        message: 'Mock data returned due to Edge Function failure',
        data: mockAssistants,
      };
    }
    
    // En production, renvoyer une réponse d'erreur
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

// Regrouper toutes les fonctions dans un objet exporté pour faciliter l'usage
export const assistantsService = {
  create: createAssistant,
  getById: getAssistantById,
  list: listAssistants,
  update: updateAssistant,
  delete: deleteAssistant,
};

export default assistantsService; 