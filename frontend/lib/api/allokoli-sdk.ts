/**
 * SDK AlloKoli - Client TypeScript pour l'API AlloKoli
 * 
 * Généré automatiquement à partir de la spécification OpenAPI 3.1.0
 * Base URL: https://{project-id}.supabase.co/functions/v1
 * 
 * @version 2.0.0
 * @description API complète pour la plateforme AlloKoli - Gestion d'assistants vocaux IA via Vapi
 */

// ============================================================================
// TYPES ET INTERFACES
// ============================================================================

/**
 * Configuration du client SDK
 */
export interface AlloKoliSDKConfig {
  /** URL de base de l'API Supabase */
  baseUrl: string;
  /** Token JWT pour l'authentification */
  authToken?: string;
  /** Timeout par défaut pour les requêtes (ms) */
  timeout?: number;
  /** Headers personnalisés */
  headers?: Record<string, string>;
}

/**
 * Réponse d'erreur standard
 */
export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: Record<string, unknown>;
  }
}

/**
 * Réponse de succès standard
 */
export interface SuccessResponse {
  success: true;
}

/**
 * Métadonnées de pagination
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  has_more: boolean;
}

/**
 * Modèle Vapi - peut être simple ou complexe
 */
export type VapiModel = string | {
  provider: 'openai' | 'anthropic' | 'together-ai';
  model: string;
  temperature?: number;
  max_tokens?: number;
};

/**
 * Voix Vapi - peut être simple ou complexe
 */
export type VapiVoice = string | {
  provider: 'elevenlabs' | 'azure' | 'google';
  voice_id: string;
  stability?: number;
  similarity_boost?: number;
};

/**
 * Paramètres d'enregistrement
 */
export interface RecordingSettings {
  createRecording?: boolean;
  saveRecording?: boolean;
}

/**
 * Assistant complet
 */
export interface Assistant {
  id: string;
  name: string;
  model: VapiModel;
  voice: VapiVoice;
  language?: string;
  firstMessage?: string;
  instructions?: string;
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
  recordingSettings?: RecordingSettings;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/**
 * Données pour créer un assistant
 */
export interface AssistantCreate {
  name: string;
  model?: VapiModel;
  voice?: VapiVoice;
  language?: string;
  firstMessage?: string;
  instructions?: string;
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
  recordingSettings?: RecordingSettings;
  metadata?: Record<string, unknown>;
}

/**
 * Données pour mettre à jour un assistant
 */
export interface AssistantUpdate {
  name?: string;
  model?: VapiModel;
  voice?: VapiVoice;
  language?: string;
  firstMessage?: string;
  instructions?: string;
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
  recordingSettings?: RecordingSettings;
  metadata?: Record<string, unknown>;
}

/**
 * Fichier dans une base de connaissances
 */
export interface KnowledgeBaseFile {
  id: string;
  name: string;
  size: number;
  type: string;
}

/**
 * Base de connaissances
 */
export interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Données pour créer une base de connaissances
 */
export interface KnowledgeBaseCreate {
  name: string;
  description?: string;
}

/**
 * Données pour mettre à jour une base de connaissances
 */
export interface KnowledgeBaseUpdate {
  name?: string;
  description?: string;
}

/**
 * Requête pour interroger une base de connaissances
 */
export interface KnowledgeBaseQuery {
  query: string;
  limit?: number;
}

/**
 * Résultat d'une recherche dans une base de connaissances
 */
export interface QueryResultItem {
  content: string;
  score: number;
  metadata?: Record<string, unknown>;
}

/**
 * Résultat d'une requête sur une base de connaissances
 */
export interface QueryResult {
  results: QueryResultItem[];
}

/**
 * Appel téléphonique
 */
export interface Call {
  id: string;
  assistant_id?: string;
  phone_number?: string;
  status: 'ringing' | 'in-progress' | 'ended' | 'failed';
  duration?: number;
  cost?: number;
  recording_url?: string;
  transcript?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  ended_at?: string;
}

/**
 * Données pour créer un appel
 */
export interface CallCreate {
  assistant_id: string;
  phone_number: string;
  metadata?: Record<string, unknown>;
}

/**
 * Numéro de téléphone
 */
export interface PhoneNumber {
  id: string;
  number: string;
  name?: string;
  assistant_id?: string;
  webhook_url?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at?: string;
}

/**
 * Paramètres de pagination
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Réponse paginée générique
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Réponse unique générique
 */
export interface SingleResponse<T> {
  data: T;
}

// ============================================================================
// EXCEPTIONS
// ============================================================================

/**
 * Erreur API personnalisée
 */
export class AlloKoliAPIError extends Error {
  public readonly status: number;
  public readonly code?: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
    this.name = 'AlloKoliAPIError';

    // Permet de capturer la stack trace correctement sur TypeScript
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AlloKoliAPIError);
    }
  }
}

// ============================================================================
// CLIENT SDK
// ============================================================================

/**
 * Client SDK principal pour l'API AlloKoli
 */
export class AlloKoliSDK {
  private config: Required<AlloKoliSDKConfig>;

  constructor(config: AlloKoliSDKConfig) {
    this.config = {
      baseUrl: config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl,
      authToken: config.authToken || '',
      timeout: config.timeout || 30000,
      headers: config.headers || {},
    };
  }

  /**
   * Définit le token d'authentification
   */
  setAuthToken(token: string): void {
    this.config.authToken = token;
  }

  /**
   * Ajoute le token d'authentification si présent
   */
  private addAuthorizationHeader(headers: Record<string, string>): Record<string, string> {
    if (this.config.authToken) {
      return {
        ...headers,
        'Authorization': `Bearer ${this.config.authToken}`
      };
    }
    return headers;
  }

  /**
   * Effectue une requête HTTP vers l'API
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;
    
    // Merge des headers par défaut avec ceux spécifiques à la requête
    const headers = {
      'Content-Type': 'application/json',
      ...this.config.headers,
      ...(options.headers || {}),
    } as Record<string, string>;

    // Ajout du token d'authentification
    const headersWithAuth = this.addAuthorizationHeader(headers);

    // Préparation de la requête avec timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: headersWithAuth,
        signal: controller.signal,
      });

      // Nettoyage du timeout
      clearTimeout(timeoutId);

      // Vérifie si la réponse est OK (2xx)
      if (response.ok) {
        const data = await response.json();
        return data as T;
      }

      // Gestion des erreurs
      let errorData: ErrorResponse;
      try {
        errorData = await response.json() as ErrorResponse;
      } catch {
        errorData = {
          error: {
            message: `HTTP ${response.status}: ${response.statusText}`,
          }
        };
      }

      throw new AlloKoliAPIError(
        errorData.error.message,
        response.status,
        errorData.error.code,
        errorData.error.details
      );
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof AlloKoliAPIError) {
        throw error;
      }

      // Si l'erreur est due au timeout
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new AlloKoliAPIError(
          `La requête a dépassé le délai de ${this.config.timeout}ms`,
          408,
          'TIMEOUT'
        );
      }

      // Erreur générique
      throw new AlloKoliAPIError(
        error instanceof Error ? error.message : 'Une erreur inconnue est survenue',
        500,
        'UNKNOWN_ERROR'
      );
    }
  }

  // ============================================================================
  // MÉTHODES ASSISTANTS
  // ============================================================================

  /**
   * Récupère la liste des assistants
   */
  async listAssistants(params: PaginationParams = {}): Promise<PaginatedResponse<Assistant>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    const endpoint = `/assistants${query ? `?${query}` : ''}`;
    
    return this.request<PaginatedResponse<Assistant>>(endpoint);
  }

  /**
   * Récupère un assistant par son ID
   */
  async getAssistant(id: string): Promise<SingleResponse<Assistant>> {
    return this.request<SingleResponse<Assistant>>(`/assistants/${id}`);
  }

  /**
   * Crée un nouvel assistant
   */
  async createAssistant(data: AssistantCreate): Promise<SingleResponse<Assistant>> {
    return this.request<SingleResponse<Assistant>>('/assistants', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Met à jour un assistant existant
   */
  async updateAssistant(id: string, data: AssistantUpdate): Promise<SingleResponse<Assistant>> {
    return this.request<SingleResponse<Assistant>>(`/assistants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprime un assistant
   */
  async deleteAssistant(id: string): Promise<SuccessResponse> {
    return this.request<SuccessResponse>(`/assistants/${id}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // MÉTHODES BASES DE CONNAISSANCES
  // ============================================================================

  /**
   * Récupère la liste des bases de connaissances
   */
  async listKnowledgeBases(params: PaginationParams = {}): Promise<PaginatedResponse<KnowledgeBase>> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    
    const query = queryParams.toString();
    const endpoint = `/knowledge-bases${query ? `?${query}` : ''}`;
    
    return this.request<PaginatedResponse<KnowledgeBase>>(endpoint);
  }

  /**
   * Récupère une base de connaissances par son ID
   */
  async getKnowledgeBase(id: string): Promise<SingleResponse<KnowledgeBase>> {
    return this.request<SingleResponse<KnowledgeBase>>(`/knowledge-bases/${id}`);
  }

  /**
   * Crée une nouvelle base de connaissances
   */
  async createKnowledgeBase(data: KnowledgeBaseCreate): Promise<SingleResponse<KnowledgeBase>> {
    return this.request<SingleResponse<KnowledgeBase>>('/knowledge-bases', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Met à jour une base de connaissances existante
   */
  async updateKnowledgeBase(id: string, data: KnowledgeBaseUpdate): Promise<SingleResponse<KnowledgeBase>> {
    return this.request<SingleResponse<KnowledgeBase>>(`/knowledge-bases/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Supprime une base de connaissances
   */
  async deleteKnowledgeBase(id: string): Promise<SuccessResponse> {
    return this.request<SuccessResponse>(`/knowledge-bases/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Effectue une recherche dans une base de connaissances
   */
  async queryKnowledgeBase(id: string, query: KnowledgeBaseQuery): Promise<SingleResponse<QueryResult>> {
    return this.request<SingleResponse<QueryResult>>(`/knowledge-bases/${id}/query`, {
      method: 'POST',
      body: JSON.stringify(query),
    });
  }

  /**
   * Ajoute un fichier à une base de connaissances
   */
  async addFileToKnowledgeBase(id: string, fileId: string): Promise<SuccessResponse> {
    return this.request<SuccessResponse>(`/knowledge-bases/${id}/files`, {
      method: 'POST',
      body: JSON.stringify({ file_id: fileId }),
    });
  }

  /**
   * Retire un fichier d'une base de connaissances
   */
  async removeFileFromKnowledgeBase(id: string, fileId: string): Promise<SuccessResponse> {
    return this.request<SuccessResponse>(`/knowledge-bases/${id}/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // MÉTHODES UTILITAIRES
  // ============================================================================

  /**
   * Vérifie la connectivité au système
   */
  async healthCheck(): Promise<{ 
    success: boolean; 
    message: string; 
    timestamp: string;
    system_status: {
      database: 'healthy' | 'degraded' | 'down';
      vapi_integration: 'healthy' | 'degraded' | 'down';
      edge_functions: 'healthy' | 'degraded' | 'down';
    }
  }> {
    return this.request('/test');
  }

  /**
   * Récupère la configuration actuelle du SDK (sans le token)
   */
  getConfig(): Omit<AlloKoliSDKConfig, 'authToken'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authToken, ...config } = this.config;
    return config;
  }
}

// ============================================================================
// FACTORY ET HELPERS
// ============================================================================

/**
 * Crée une nouvelle instance du SDK AlloKoli
 */
export function createAlloKoliSDK(config: AlloKoliSDKConfig): AlloKoliSDK {
  return new AlloKoliSDK(config);
}

/**
 * Crée une nouvelle instance du SDK AlloKoli configurée pour Supabase
 */
export function createAlloKoliSDKWithSupabase(
  projectId: string,
  authToken?: string
): AlloKoliSDK {
  const baseUrl = `https://${projectId}.supabase.co/functions/v1`;
  
  return createAlloKoliSDK({
    baseUrl,
    authToken,
    headers: {
      'x-client-info': 'allokoli-sdk/2.0.0',
    }
  });
}

/**
 * Valide un UUID
 */
export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Valide un numéro de téléphone
 */
export function isValidPhoneNumber(phone: string): boolean {
  // Format E.164 simplifié (commence par + suivi de chiffres)
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default AlloKoliSDK; 