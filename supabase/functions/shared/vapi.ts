/**
 * Utilitaire pour les appels à l'API Vapi
 * Remplace l'utilisation du SDK par des appels HTTP directs
 */

// Utilitaire pour accéder à Deno avec typage
const DenoEnv = {
  get: (key: string): string | undefined => {
    // @ts-ignore - Deno existe dans l'environnement d'exécution
    return typeof Deno !== 'undefined' ? Deno.env.get(key) : undefined;
  }
};

// Configuration de base pour l'API Vapi
const VAPI_API_BASE = 'https://api.vapi.ai';
// Mise à jour : L'API Vapi utilise directement les ressources sans préfixe "v1"
// selon la documentation: https://docs.vapi.ai/api-reference/assistants/create
// Ancien préfixe: const VAPI_API_VERSION = 'v1'; (désormais déprécié)

// Types pour les webhooks et la pagination générique
export interface Webhook {
  id: string;
  url: string;
  events: string[];
  description?: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebhookCreateParams {
  url: string;
  events: string[];
  description?: string;
  enabled?: boolean;
}

export interface WebhookUpdateParams {
  url?: string;
  events?: string[];
  description?: string;
  enabled?: boolean;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    has_more: boolean;
  };
}

// Types pour les fichiers Vapi
export interface VapiFile {
  id: string;
  filename: string;
  purpose: string;
  size_bytes: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface FileContent {
  // Le type de contenu peut varier (texte, JSON, etc.)
  // Pour l'instant, nous le laissons en 'any' pour flexibilité
  content: any; 
}

export interface FileUploadParams {
  file: Uint8Array; // Contenu du fichier en bytes
  filename: string;
  purpose: 'assistants' | 'knowledge-bases';
  metadata?: Record<string, any>;
}

export interface FileListParams extends PaginationParams {
  purpose?: 'assistants' | 'knowledge-bases';
}

// Types pour les Workflows Vapi
export interface WorkflowStep {
  type: string; // Exemple: 'llm', 'function', 'condition', etc.
  // Les autres propriétés dépendent du type de step
  [key: string]: any;
}

export interface VapiWorkflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WorkflowCreateParams {
  name: string;
  description?: string;
  steps: WorkflowStep[];
  metadata?: Record<string, any>;
}

export interface WorkflowUpdateParams {
  name?: string;
  description?: string;
  steps?: WorkflowStep[];
  metadata?: Record<string, any>;
}

export interface WorkflowExecuteParams {
  inputs: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface WorkflowExecution {
  id: string; // ID de l'exécution
  workflow_id: string;
  status: string; // Exemple: 'running', 'completed', 'failed'
  inputs: Record<string, any>;
  outputs?: Record<string, any>;
  error?: any;
  created_at: string;
  updated_at: string;
}

// Types pour les Squads Vapi
export interface SquadMember {
  id: string; // ID de l'assistant ou de l'utilisateur
  role: string; // Exemple: 'assistant', 'viewer', 'editor'
}

export interface VapiSquad {
  id: string;
  name: string;
  description?: string;
  members: SquadMember[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SquadCreateParams {
  name: string;
  description?: string;
  members?: SquadMember[];
  metadata?: Record<string, any>;
}

export interface SquadUpdateParams {
  name?: string;
  description?: string;
  metadata?: Record<string, any>;
}

// Types pour les Fonctions (Tools) Vapi
export interface VapiFunctionParameterProperty {
  type: string; // e.g., "string", "number", "boolean", "object", "array"
  description?: string;
  enum?: string[];
  items?: VapiFunctionParameterProperty; // For array type
  properties?: Record<string, VapiFunctionParameterProperty>; // For object type
  required?: string[]; // For object type
}

export interface VapiFunctionParameters {
  type: "object";
  properties: Record<string, VapiFunctionParameterProperty>;
  required?: string[];
}

export interface VapiFunction {
  id: string;
  name: string;
  description?: string;
  parameters: VapiFunctionParameters;
  webhook_url?: string; // For server-side execution
  code?: string; // For client-side execution (not recommended for Supabase Edge)
  async?: boolean;
  timeout_ms?: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface FunctionCreateParams {
  name: string;
  description?: string;
  parameters: VapiFunctionParameters;
  webhook_url?: string;
  code?: string;
  async?: boolean;
  timeout_ms?: number;
  metadata?: Record<string, any>;
}

export interface FunctionUpdateParams {
  name?: string;
  description?: string;
  parameters?: VapiFunctionParameters;
  webhook_url?: string;
  code?: string;
  async?: boolean;
  timeout_ms?: number;
  metadata?: Record<string, any>;
}

// Types pour l'Organisation Vapi
export interface VapiOrganization {
  id: string;
  name: string;
  description?: string;
  webhook_url?: string;
  trusted_origins?: string[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface OrganizationUpdateParams {
  name?: string;
  description?: string;
  webhook_url?: string;
  trusted_origins?: string[];
  metadata?: Record<string, any>;
}

export interface VapiLimits {
  // La structure exacte des limites dépend de l'API Vapi
  // Exemple:
  max_calls?: number;
  max_duration_per_call_ms?: number;
  max_assistants?: number;
  // ... autres limites
  [key: string]: any; // Pour flexibilité
}

// Types pour les Analytics Vapi
export interface CallMetricsParams {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  assistant_id?: string;
  phone_number_id?: string;
  // ... autres filtres possibles
  [key: string]: any;
}

export interface VapiCallMetrics {
  // Structure dépendant de l'API Vapi
  total_calls: number;
  total_duration_ms: number;
  average_duration_ms: number;
  // ... autres métriques
  [key: string]: any;
}

export interface UsageStatsParams {
  start_date?: string; // YYYY-MM-DD
  end_date?: string; // YYYY-MM-DD
  // ... autres filtres possibles
  [key: string]: any;
}

export interface VapiUsageStats {
  // Structure dépendant de l'API Vapi
  total_requests: number;
  total_tokens_processed: number;
  // ... autres statistiques
  [key: string]: any;
}

export interface CallTimelineEvent {
  type: string;
  timestamp: string;
  data?: any;
  // ... autres champs
}

export interface VapiCallTimeline {
  call_id: string;
  events: CallTimelineEvent[];
  // ... autres informations
}

// Types pour les Assistants Vapi
export interface VapiAssistant {
  id: string;
  name: string;
  model?: {
    provider: string; // 'openai', 'anthropic', 'cohere', 'azure', etc.
    model: string; // 'gpt-4o', 'claude-3-opus-20240229', etc.
    systemPrompt?: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    messages?: Array<{
      role: string;
      content: string;
    }>;
  };
  voice?: {
    provider: string; // 'elevenlabs', 'deepgram', 'openai', etc.
    voiceId: string; // ID spécifique au provider
  };
  firstMessage?: string;
  voicemailMessage?: string;
  endCallMessage?: string;
  endCallFunctionEnabled?: boolean;
  recordingEnabled?: boolean;
  tools?: {
    functions?: string[]; // IDs des fonctions
    knowledgeBases?: string[]; // IDs des bases de connaissances
    workflows?: string[]; // IDs des workflows
  };
  forwardingPhoneNumber?: string;
  recordingSettings?: {
    createRecording: boolean;
    saveRecording: boolean;
  };
  metadata?: Record<string, any>;
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
  transcriber?: {
    provider: string;
    keywords?: string[];
  };
  created_at: string;
  updated_at: string;
}

export interface AssistantCreateParams {
  name: string;
  model?: {
    provider: string;
    model: string;
    systemPrompt?: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    messages?: Array<{
      role: string;
      content: string;
    }>;
    tools?: any[];
    emotionRecognitionEnabled?: boolean;
    knowledgeBaseId?: string;
    knowledgeBase?: {
      server?: {
        url?: string;
        timeoutSeconds?: number;
        backoffPlan?: {
          maxRetries?: number;
          type?: Record<string, any>;
          baseDelaySeconds?: number;
        };
      };
    };
    numFastTurns?: number;
  };
  voice?: {
    provider: string;
    voiceId: string;
    speed?: number;
    cachingEnabled?: boolean;
    chunkPlan?: {
      enabled?: boolean;
      minCharacters?: number;
      punctuationBoundaries?: string[];
      formatPlan?: {
        enabled?: boolean;
        numberToDigitsCutoff?: number;
      };
    };
    fallbackPlan?: {
      voices?: Array<{
        provider: string;
        voiceId: string;
        cachingEnabled?: boolean;
      }>;
    };
  };
  firstMessage?: string;
  firstMessageInterruptionsEnabled?: boolean;
  firstMessageMode?: 'assistant-speaks-first' | 'assistant-speaks-first-with-model-generated-message' | 'assistant-waits-for-user';
  voicemailMessage?: string;
  endCallMessage?: string;
  endCallFunctionEnabled?: boolean;
  recordingEnabled?: boolean;
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  backgroundSound?: string | 'off' | 'office';
  backgroundDenoisingEnabled?: boolean;
  modelOutputInMessagesEnabled?: boolean;
  endCallPhrases?: string[];
  tools?: {
    functions?: string[];
    knowledgeBases?: string[];
    workflows?: string[];
  };
  clientMessages?: string[];
  serverMessages?: string[];
  transportConfigurations?: Array<{
    provider: string;
    config: Record<string, any>;
    phoneNumbersFilter?: string[];
    countriesFilter?: string[];
  }>;
  observabilityPlan?: {
    langfuseEnabled?: boolean;
    langfuseConfig?: {
      publicKey?: string;
      privateKey?: string;
      host?: string;
    };
  };
  hooks?: Array<{
    event: string;
    action: Record<string, any>;
    condition?: Record<string, any>;
  }>;
  compliancePlan?: {
    piiRedactionEnabled?: boolean;
  };
  metadata?: Record<string, any>;
  analysisPlan?: {
    sentimentEnabled?: boolean;
    topicsEnabled?: boolean;
    entitiesEnabled?: boolean;
    summaryEnabled?: boolean;
  };
  artifactPlan?: {
    recordingEnabled?: boolean;
    transcriptEnabled?: boolean;
    callReportEnabled?: boolean;
    sentimentEnabled?: boolean;
    topicsEnabled?: boolean;
    entitiesEnabled?: boolean;
    summaryEnabled?: boolean;
  };
  messagePlan?: {
    idleMessages?: string[];
    idleMessageIntervalSeconds?: number;
  };
  startSpeakingPlan?: {
    confidenceThreshold?: number;
    delayMs?: number;
    stopTracking?: {
      durationMs?: number;
      confidenceThreshold?: number;
    };
    preferContentCompletion?: boolean;
  };
  stopSpeakingPlan?: {
    confidenceThreshold?: number;
    delayMs?: number;
    waitForPauseInInterruption?: boolean;
    allowedInterruptions?: string[];
    blacklistInterruptions?: string[];
  };
  monitorPlan?: {
    listenEnabled?: boolean;
    controlEnabled?: boolean;
  };
  server?: {
    url?: string;
    urlSecret?: string;
    webhookTimeoutMs?: number;
    webhookRetries?: number;
    baseDelayMs?: number;
  };
  keypadInputPlan?: {
    enabled?: boolean;
    timeoutSeconds?: number;
    endKeys?: string[];
  };
  transcriber?: {
    provider: string;
    confidenceThreshold?: number;
    disablePartialTranscripts?: boolean;
    endUtteranceSilenceThreshold?: number;
    fallbackPlan?: {
      transcribers?: Array<{
        provider: string;
        confidenceThreshold?: number;
      }>;
    };
    language?: string;
    realtimeUrl?: string;
    wordBoost?: string[];
  };
  voicemailDetection?: {
    provider?: string;
    backoffPlan?: {
      startAtSeconds?: number;
      type?: Record<string, any>;
      baseDelaySeconds?: number;
    };
    noiseThreshold?: number;
  };
  credentials?: Array<Record<string, any>>;
  credentialIds?: string[];
  forwardingPhoneNumber?: string;
  recordingSettings?: {
    createRecording: boolean;
    saveRecording: boolean;
  };
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
}

export interface AssistantUpdateParams {
  name?: string;
  model?: {
    provider?: string;
    model?: string;
    systemPrompt?: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
    messages?: Array<{
      role: string;
      content: string;
    }>;
    tools?: any[];
    emotionRecognitionEnabled?: boolean;
    knowledgeBaseId?: string;
    knowledgeBase?: {
      server?: {
        url?: string;
        timeoutSeconds?: number;
        backoffPlan?: {
          maxRetries?: number;
          type?: Record<string, any>;
          baseDelaySeconds?: number;
        };
      };
    };
    numFastTurns?: number;
  };
  voice?: {
    provider?: string;
    voiceId?: string;
    speed?: number;
    cachingEnabled?: boolean;
    chunkPlan?: {
      enabled?: boolean;
      minCharacters?: number;
      punctuationBoundaries?: string[];
      formatPlan?: {
        enabled?: boolean;
        numberToDigitsCutoff?: number;
      };
    };
    fallbackPlan?: {
      voices?: Array<{
        provider: string;
        voiceId: string;
        cachingEnabled?: boolean;
      }>;
    };
  };
  firstMessage?: string;
  firstMessageInterruptionsEnabled?: boolean;
  firstMessageMode?: 'assistant-speaks-first' | 'assistant-speaks-first-with-model-generated-message' | 'assistant-waits-for-user';
  voicemailMessage?: string;
  endCallMessage?: string;
  endCallFunctionEnabled?: boolean;
  recordingEnabled?: boolean;
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  backgroundSound?: string | 'off' | 'office';
  backgroundDenoisingEnabled?: boolean;
  modelOutputInMessagesEnabled?: boolean;
  endCallPhrases?: string[];
  tools?: {
    functions?: string[];
    knowledgeBases?: string[];
    workflows?: string[];
  };
  forwardingPhoneNumber?: string;
  recordingSettings?: {
    createRecording?: boolean;
    saveRecording?: boolean;
  };
  clientMessages?: string[];
  serverMessages?: string[];
  transportConfigurations?: Array<{
    provider: string;
    config: Record<string, any>;
    phoneNumbersFilter?: string[];
    countriesFilter?: string[];
  }>;
  observabilityPlan?: {
    langfuseEnabled?: boolean;
    langfuseConfig?: {
      publicKey?: string;
      privateKey?: string;
      host?: string;
    };
  };
  hooks?: Array<{
    event: string;
    action: Record<string, any>;
    condition?: Record<string, any>;
  }>;
  compliancePlan?: {
    piiRedactionEnabled?: boolean;
  };
  metadata?: Record<string, any>;
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
  analysisPlan?: {
    sentimentEnabled?: boolean;
    topicsEnabled?: boolean;
    entitiesEnabled?: boolean;
    summaryEnabled?: boolean;
  };
  artifactPlan?: {
    recordingEnabled?: boolean;
    transcriptEnabled?: boolean;
    callReportEnabled?: boolean;
    sentimentEnabled?: boolean;
    topicsEnabled?: boolean;
    entitiesEnabled?: boolean;
    summaryEnabled?: boolean;
  };
  messagePlan?: {
    idleMessages?: string[];
    idleMessageIntervalSeconds?: number;
  };
  startSpeakingPlan?: {
    confidenceThreshold?: number;
    delayMs?: number;
    stopTracking?: {
      durationMs?: number;
      confidenceThreshold?: number;
    };
    preferContentCompletion?: boolean;
  };
  stopSpeakingPlan?: {
    confidenceThreshold?: number;
    delayMs?: number;
    waitForPauseInInterruption?: boolean;
    allowedInterruptions?: string[];
    blacklistInterruptions?: string[];
  };
  monitorPlan?: {
    listenEnabled?: boolean;
    controlEnabled?: boolean;
  };
  server?: {
    url?: string;
    urlSecret?: string;
    webhookTimeoutMs?: number;
    webhookRetries?: number;
    baseDelayMs?: number;
  };
  keypadInputPlan?: {
    enabled?: boolean;
    timeoutSeconds?: number;
    endKeys?: string[];
  };
  transcriber?: {
    provider: string;
    confidenceThreshold?: number;
    disablePartialTranscripts?: boolean;
    endUtteranceSilenceThreshold?: number;
    fallbackPlan?: {
      transcribers?: Array<{
        provider: string;
        confidenceThreshold?: number;
      }>;
    };
    language?: string;
    realtimeUrl?: string;
    wordBoost?: string[];
  };
  voicemailDetection?: {
    provider?: string;
    backoffPlan?: {
      startAtSeconds?: number;
      type?: Record<string, any>;
      baseDelaySeconds?: number;
    };
    noiseThreshold?: number;
  };
  credentials?: Array<Record<string, any>>;
  credentialIds?: string[];
}

// Types pour les Knowledge Bases Vapi
export interface VapiKnowledgeBase {
  id: string;
  name: string;
  description?: string;
  model?: {
    provider: string; // ex: "openai"
    model: string;    // ex: "text-embedding-3-small"
    dimensions?: number;
  };
  files?: string[]; // IDs des fichiers associés
  file_count?: number; // Nombre de fichiers associés
  chunks_count?: number; // Nombre de chunks (segments de texte) extraits
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KnowledgeBaseCreateParams {
  name: string;
  description?: string;
  model?: {
    provider: string;
    model: string;
    dimensions?: number;
  };
  metadata?: Record<string, any>;
}

export interface KnowledgeBaseUpdateParams {
  name?: string;
  description?: string;
  model?: {
    provider?: string;
    model?: string;
    dimensions?: number;
  };
  metadata?: Record<string, any>;
}

export interface KnowledgeBaseQueryParams {
  query: string;
  top_k?: number;
  similarity_threshold?: number;
  metadata_filter?: Record<string, any>;
}

export interface KnowledgeBaseQueryResult {
  matches: {
    text: string;
    score: number;
    metadata?: Record<string, any>;
    source?: string;
  }[];
}

export interface KnowledgeBaseAddFileParams {
  file_id: string;
}

// Types pour les Test Suites Vapi
export interface VapiTestSuite {
  id: string;
  name: string;
  description?: string;
  assistant_id: string;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TestSuiteCreateParams {
  name: string;
  description?: string;
  assistant_id: string;
  metadata?: Record<string, any>;
}

export interface TestSuiteUpdateParams {
  name?: string;
  description?: string;
  assistant_id?: string;
  metadata?: Record<string, any>;
}

// Types pour les Test Suite Tests Vapi
export interface VapiTestSuiteTest {
  id: string;
  test_suite_id: string;
  name: string;
  description?: string;
  expected_output: string; // Ou une structure plus complexe si nécessaire
  input: string; // Ou une structure plus complexe si nécessaire
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface TestSuiteTestCreateParams {
  name: string;
  description?: string;
  expected_output: string;
  input: string;
  metadata?: Record<string, any>;
}

export interface TestSuiteTestUpdateParams {
  name?: string;
  description?: string;
  expected_output?: string;
  input?: string;
  metadata?: Record<string, any>;
}

/**
 * Types for Phone Numbers
 */
export interface VapiPhoneNumber {
  id: string;
  phone_number: string;
  friendly_name?: string;
  provider: string;
  country: string;
  capabilities: string[];
  active: boolean;
  assistant_id?: string;
  workflow_id?: string;
  created_at: string;
  updated_at: string;
}

export interface PhoneNumberSearchParams {
  country: string;
  area_code?: string;
  capabilities?: string[];
  limit?: number;
}

export interface PhoneNumberSearchResult {
  phone_numbers: Array<{
    phone_number: string;
    provider: string;
    country: string;
    capabilities: string[];
  }>;
}

export interface PhoneNumberProvisionParams {
  phone_number: string;
  provider?: string;
  friendly_name?: string;
}

export interface PhoneNumberUpdateParams {
  friendly_name?: string;
  assistant_id?: string;
  workflow_id?: string;
}

/**
 * Fonction généralisée pour appeler l'API Vapi
 */
export async function callVapiAPI<T = any>(
  endpoint: string,
  method: string = 'GET', 
  data?: any,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  const apiKey = DenoEnv.get('VAPI_API_KEY') || '';
  if (!apiKey) {
    throw new Error('VAPI_API_KEY is not set in environment variables');
  }

  // Construire l'URL avec les paramètres
  let url = `${VAPI_API_BASE}${endpoint}`;
  
  // Ajouter des paramètres de requête si nécessaire
  if (params && Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    url += `?${queryParams.toString()}`;
  }

  console.log(`[VAPI_REQUEST] ${method} ${url}`);

  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
    // console.log(`[VAPI_REQUEST_BODY] ${JSON.stringify(data)}`);
  }

  try {
    const response = await fetch(url, options);
    const responseText = await response.text();
    
    if (!response.ok) {
      let errorData: any = { 
        message: `API request failed with status ${response.status}`, 
        raw_error: responseText 
      };
      
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        // Keep the initial error if parsing fails
        console.warn('[VAPI_ERROR_PARSE] Failed to parse error response as JSON');
      }
      
      console.error(`[VAPI_ERROR] ${method} ${url} failed with status ${response.status}:`, errorData);
      throw new Error(`Erreur API Vapi (${endpoint.replace('/', '')}): ${response.status} - ${errorData.message || errorData.raw_error || 'Unknown error'}`);
    }

    if (responseText) {
      try {
        return JSON.parse(responseText);
      } catch (e: any) {
        console.error(`[VAPI_ERROR] Failed to parse JSON response: ${e.message}`);
        throw new Error(`Invalid JSON response from Vapi: ${responseText.substring(0, 100)}`);
      }
    }
    
    return {} as T;
  } catch (error: any) {
    console.error(`[VAPI_REQUEST_FAILED] ${method} ${url}: ${error.message}`);
    throw error;
  }
}

/**
 * Fonctions spécifiques pour les webhooks Vapi
 */
export const vapiWebhooks = {
  list: async (params?: PaginationParams): Promise<PaginatedResponse<Webhook>> => {
    const queryParams = params ? {
      limit: params.limit,
      offset: params.offset
    } : undefined;
    // Cast explicite pour correspondre à la signature de callVapiAPI
    return callVapiAPI<PaginatedResponse<Webhook>>('webhooks', 'GET', undefined, queryParams as Record<string, string | number | boolean | undefined>);
  },

  retrieve: async (id: string): Promise<Webhook> => {
    return callVapiAPI<Webhook>(`webhooks/${id}`);
  },

  create: async (data: WebhookCreateParams): Promise<Webhook> => {
    return callVapiAPI<Webhook>('webhooks', 'POST', data);
  },

  update: async (id: string, data: WebhookUpdateParams): Promise<Webhook> => {
    return callVapiAPI<Webhook>(`webhooks/${id}`, 'PATCH', data);
  },

  delete: async (id: string): Promise<void> => {
    // S'attendre à un type vide (ou un objet vide si T ne peut être void directement)
    await callVapiAPI<Record<string, never>>(`webhooks/${id}`, 'DELETE');
  },

  ping: async (id: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`webhooks/${id}/ping`, 'POST');
  }
};

/**
 * Fonctions spécifiques pour les fichiers Vapi
 */
export const vapiFiles = {
  list: async (params?: FileListParams): Promise<PaginatedResponse<VapiFile>> => {
    return callVapiAPI<PaginatedResponse<VapiFile>>('files', 'GET', undefined, params as Record<string, string | number | boolean | undefined>);
  },

  retrieve: async (id: string): Promise<VapiFile> => {
    return callVapiAPI<VapiFile>(`files/${id}`);
  },

  content: async (id: string): Promise<FileContent> => {
    // Note: L'API Vapi peut retourner différents types de contenu ici.
    // La fonction callVapiAPI s'attend à du JSON. Si ce n'est pas du JSON,
    // il faudra adapter callVapiAPI ou gérer la réponse différemment ici.
    return callVapiAPI<FileContent>(`files/${id}/content`);
  },

  upload: async (data: FileUploadParams): Promise<VapiFile> => {
    // Appel direct avec fetch pour gérer FormData
    // Récupérer la clé API depuis les variables d'environnement
    const apiKey = DenoEnv.get('VAPI_API_KEY');
    
    if (!apiKey) {
      console.error('[API_ERROR] VAPI_API_KEY is missing from environment variables');
      throw new Error('Clé API Vapi manquante.');
    }

    const formData = new FormData();
    formData.append('file', new Blob([data.file]), data.filename);
    formData.append('purpose', data.purpose);
    if (data.metadata) {
      formData.append('metadata', JSON.stringify(data.metadata));
    }

    const url = new URL(`${VAPI_API_BASE}/files`);
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        // Content-Type est automatiquement défini par fetch pour FormData
      },
      body: formData,
    });

    if (!response.ok) {
      let errorData = { message: response.statusText };
      try {
        errorData = await response.json();
      } catch (e) { /* ignorer */ }
      console.error(`[VAPI_ERROR] POST ${url.toString()} failed with status ${response.status}: ${JSON.stringify(errorData)}`);
      throw new Error(`Erreur API Vapi (files upload): ${response.status} - ${errorData.message || response.statusText}`);
    }
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`files/${id}`, 'DELETE');
  }
};

/**
 * Fonctions spécifiques pour les workflows Vapi
 */
export const vapiWorkflows = {
  list: async (params?: PaginationParams): Promise<PaginatedResponse<VapiWorkflow>> => {
    return callVapiAPI<PaginatedResponse<VapiWorkflow>>('workflows', 'GET', undefined, params as Record<string, string | number | boolean | undefined>);
  },

  retrieve: async (id: string): Promise<VapiWorkflow> => {
    return callVapiAPI<VapiWorkflow>(`workflows/${id}`);
  },

  create: async (data: WorkflowCreateParams): Promise<VapiWorkflow> => {
    return callVapiAPI<VapiWorkflow>('workflows', 'POST', data);
  },

  update: async (id: string, data: WorkflowUpdateParams): Promise<VapiWorkflow> => {
    return callVapiAPI<VapiWorkflow>(`workflows/${id}`, 'PATCH', data);
  },

  delete: async (id: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`workflows/${id}`, 'DELETE');
  },

  execute: async (id: string, data: WorkflowExecuteParams): Promise<WorkflowExecution> => {
    return callVapiAPI<WorkflowExecution>(`workflows/${id}/execute`, 'POST', data);
  }
};

/**
 * Fonctions spécifiques pour les squads Vapi
 */
export const vapiSquads = {
  list: async (params?: PaginationParams): Promise<PaginatedResponse<VapiSquad>> => {
    return callVapiAPI<PaginatedResponse<VapiSquad>>('squads', 'GET', undefined, params as Record<string, string | number | boolean | undefined>);
  },

  retrieve: async (id: string): Promise<VapiSquad> => {
    return callVapiAPI<VapiSquad>(`squads/${id}`);
  },

  create: async (data: SquadCreateParams): Promise<VapiSquad> => {
    return callVapiAPI<VapiSquad>('squads', 'POST', data);
  },

  update: async (id: string, data: SquadUpdateParams): Promise<VapiSquad> => {
    return callVapiAPI<VapiSquad>(`squads/${id}`, 'PATCH', data);
  },

  delete: async (id: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`squads/${id}`, 'DELETE');
  },

  addMembers: async (id: string, members: SquadMember[]): Promise<VapiSquad> => { // Vapi retourne le squad mis à jour
    return callVapiAPI<VapiSquad>(`squads/${id}/members`, 'POST', { members });
  },

  removeMember: async (squadId: string, memberId: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`squads/${squadId}/members/${memberId}`, 'DELETE');
  }
};

/**
 * Fonctions spécifiques pour les Fonctions (Tools) Vapi
 */
export const vapiTools = { // Renommé en vapiTools pour éviter la confusion
  list: async (params?: PaginationParams): Promise<PaginatedResponse<VapiFunction>> => {
    return callVapiAPI<PaginatedResponse<VapiFunction>>('functions', 'GET', undefined, params as Record<string, string | number | boolean | undefined>);
  },

  retrieve: async (id: string): Promise<VapiFunction> => {
    return callVapiAPI<VapiFunction>(`functions/${id}`);
  },

  create: async (data: FunctionCreateParams): Promise<VapiFunction> => {
    return callVapiAPI<VapiFunction>('functions', 'POST', data);
  },

  update: async (id: string, data: FunctionUpdateParams): Promise<VapiFunction> => {
    return callVapiAPI<VapiFunction>(`functions/${id}`, 'PATCH', data);
  },

  delete: async (id: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`functions/${id}`, 'DELETE');
  }
};

/**
 * Fonctions spécifiques pour l'Organisation Vapi
 */
export const vapiOrganization = {
  retrieve: async (): Promise<VapiOrganization> => {
    return callVapiAPI<VapiOrganization>('organization');
  },

  update: async (data: OrganizationUpdateParams): Promise<VapiOrganization> => {
    return callVapiAPI<VapiOrganization>('organization', 'PATCH', data);
  },

  getLimits: async (): Promise<VapiLimits> => {
    return callVapiAPI<VapiLimits>('organization/limits');
  }
};

/**
 * Fonctions spécifiques pour les Analytics Vapi
 */
export const vapiAnalytics = {
  getCallMetrics: async (params?: CallMetricsParams): Promise<VapiCallMetrics> => {
    return callVapiAPI<VapiCallMetrics>('analytics/calls', 'GET', undefined, params as Record<string, string | number | boolean | undefined>);
  },

  getUsageStats: async (params?: UsageStatsParams): Promise<VapiUsageStats> => {
    return callVapiAPI<VapiUsageStats>('analytics/usage', 'GET', undefined, params as Record<string, string | number | boolean | undefined>);
  },

  getCallTimeline: async (callId: string): Promise<VapiCallTimeline> => {
    return callVapiAPI<VapiCallTimeline>(`analytics/calls/${callId}/timeline`);
  }
};

/**
 * Fonctions spécifiques pour les Test Suites Vapi
 */
export const vapiTestSuites = {
  list: async (params?: PaginationParams): Promise<PaginatedResponse<VapiTestSuite>> => {
    return callVapiAPI<PaginatedResponse<VapiTestSuite>>('test-suites', 'GET', undefined, params as Record<string, string | number | boolean | undefined>);
  },

  retrieve: async (id: string): Promise<VapiTestSuite> => {
    return callVapiAPI<VapiTestSuite>(`test-suites/${id}`);
  },

  create: async (data: TestSuiteCreateParams): Promise<VapiTestSuite> => {
    return callVapiAPI<VapiTestSuite>('test-suites', 'POST', data);
  },

  update: async (id: string, data: TestSuiteUpdateParams): Promise<VapiTestSuite> => {
    return callVapiAPI<VapiTestSuite>(`test-suites/${id}`, 'PATCH', data);
  },

  delete: async (id: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`test-suites/${id}`, 'DELETE');
  }
};

/**
 * Fonctions spécifiques pour les Test Suite Tests Vapi
 */
export const vapiTestSuiteTests = {
  list: async (suiteId: string, params?: PaginationParams): Promise<PaginatedResponse<VapiTestSuiteTest>> => {
    return callVapiAPI<PaginatedResponse<VapiTestSuiteTest>>(`test-suites/${suiteId}/tests`, 'GET', undefined, params as Record<string, string | number | boolean | undefined>);
  },

  retrieve: async (suiteId: string, testId: string): Promise<VapiTestSuiteTest> => {
    return callVapiAPI<VapiTestSuiteTest>(`test-suites/${suiteId}/tests/${testId}`);
  },

  create: async (suiteId: string, data: TestSuiteTestCreateParams): Promise<VapiTestSuiteTest> => {
    return callVapiAPI<VapiTestSuiteTest>(`test-suites/${suiteId}/tests`, 'POST', data);
  },

  update: async (suiteId: string, testId: string, data: TestSuiteTestUpdateParams): Promise<VapiTestSuiteTest> => {
    return callVapiAPI<VapiTestSuiteTest>(`test-suites/${suiteId}/tests/${testId}`, 'PATCH', data);
  },

  delete: async (suiteId: string, testId: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`test-suites/${suiteId}/tests/${testId}`, 'DELETE');
  }
};

/**
 * Fonctions spécifiques pour les Assistants Vapi
 */
export const vapiAssistants = {
  // Créer un assistant - URL correcte: /assistant (pas /v1/assistants)
  create: async (data: AssistantCreateParams, apiKey?: string): Promise<VapiAssistant> => {
    if (apiKey) {
      // Si une clé API est fournie, l'utiliser directement
      return callVapiAPIWithKey('/assistant', apiKey, 'POST', data);
    }
    return callVapiAPI<VapiAssistant>('/assistant', 'POST', data);
  },
  
  // Récupérer un assistant
  get: async (assistantId: string, apiKey?: string): Promise<VapiAssistant> => {
    if (apiKey) {
      return callVapiAPIWithKey(`/assistant/${assistantId}`, apiKey, 'GET');
    }
    return callVapiAPI<VapiAssistant>(`/assistant/${assistantId}`, 'GET');
  },
  
  // Mettre à jour un assistant
  update: async (assistantId: string, data: AssistantUpdateParams, apiKey?: string): Promise<VapiAssistant> => {
    if (apiKey) {
      return callVapiAPIWithKey(`/assistant/${assistantId}`, apiKey, 'PATCH', data);
    }
    return callVapiAPI<VapiAssistant>(`/assistant/${assistantId}`, 'PATCH', data);
  },
  
  // Supprimer un assistant
  delete: async (assistantId: string, apiKey?: string): Promise<void> => {
    if (apiKey) {
      return callVapiAPIWithKey(`/assistant/${assistantId}`, apiKey, 'DELETE');
    }
    return callVapiAPI<void>(`/assistant/${assistantId}`, 'DELETE');
  },
  
  // Lister les assistants - URL correcte: /assistants (sans préfixe v1)
  list: async (params?: PaginationParams, apiKey?: string): Promise<{ assistants: VapiAssistant[] }> => {
    if (apiKey) {
      return callVapiAPIWithKey('/assistants', apiKey, 'GET', undefined, params);
    }
    return callVapiAPI<{ assistants: VapiAssistant[] }>('/assistants', 'GET', undefined, params);
  }
};

/**
 * Fonctions spécifiques pour les Knowledge Bases Vapi
 */
export const vapiKnowledgeBases = {
  list: async (params?: PaginationParams): Promise<PaginatedResponse<VapiKnowledgeBase>> => {
    return callVapiAPI<PaginatedResponse<VapiKnowledgeBase>>('knowledge-base', 'GET', undefined, params as Record<string, string | number | boolean | undefined>);
  },

  retrieve: async (id: string): Promise<VapiKnowledgeBase> => {
    return callVapiAPI<VapiKnowledgeBase>(`knowledge-base/${id}`);
  },

  create: async (data: KnowledgeBaseCreateParams): Promise<VapiKnowledgeBase> => {
    return callVapiAPI<VapiKnowledgeBase>('knowledge-base', 'POST', data);
  },

  update: async (id: string, data: KnowledgeBaseUpdateParams): Promise<VapiKnowledgeBase> => {
    return callVapiAPI<VapiKnowledgeBase>(`knowledge-base/${id}`, 'PATCH', data);
  },

  delete: async (id: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`knowledge-base/${id}`, 'DELETE');
  },

  query: async (id: string, data: KnowledgeBaseQueryParams): Promise<KnowledgeBaseQueryResult> => {
    return callVapiAPI<KnowledgeBaseQueryResult>(`knowledge-base/${id}/query`, 'POST', data);
  },

  addFile: async (id: string, file_id: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`knowledge-base/${id}/files`, 'POST', { file_id });
  },

  removeFile: async (id: string, file_id: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`knowledge-base/${id}/files/${file_id}`, 'DELETE');
  }
};

/**
 * Fonctions spécifiques pour les Phone Numbers Vapi
 */
export const vapiPhoneNumbers = {
  list: async (params?: PaginationParams): Promise<PaginatedResponse<VapiPhoneNumber>> => {
    return callVapiAPI<PaginatedResponse<VapiPhoneNumber>>('phone-numbers', 'GET', undefined, params as Record<string, string | number | boolean | undefined>);
  },

  retrieve: async (id: string): Promise<VapiPhoneNumber> => {
    return callVapiAPI<VapiPhoneNumber>(`phone-numbers/${id}`);
  },

  create: async (data: PhoneNumberProvisionParams): Promise<VapiPhoneNumber> => {
    return callVapiAPI<VapiPhoneNumber>('phone-numbers', 'POST', data);
  },

  update: async (id: string, data: PhoneNumberUpdateParams): Promise<VapiPhoneNumber> => {
    return callVapiAPI<VapiPhoneNumber>(`phone-numbers/${id}`, 'PATCH', data);
  },

  delete: async (id: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`phone-numbers/${id}`, 'DELETE');
  },

  search: async (params: PhoneNumberSearchParams): Promise<PhoneNumberSearchResult> => {
    return callVapiAPI<PhoneNumberSearchResult>('phone-numbers/search', 'POST', params);
  },

  provision: async (data: PhoneNumberProvisionParams): Promise<VapiPhoneNumber> => {
    return callVapiAPI<VapiPhoneNumber>('phone-numbers/provision', 'POST', data);
  }
};

/**
 * Convertit les données de l'assistant du format DB/frontend au format attendu par l'API Vapi
 * 
 * @param assistantData - Données de l'assistant depuis la DB ou la requête frontend
 * 
 * Cette fonction a été mise à jour pour prendre en charge les nouvelles fonctionnalités de l'API Vapi,
 * incluant les plans avancés comme analysisPlan, messagePlan, etc. 
 * Les champs legacy (endCallAfterSilence, voiceReflection) sont conservés pour la compatibilité.
 */
export function mapToVapiAssistantFormat(assistantData: any): AssistantCreateParams | AssistantUpdateParams {
  console.log(`[MAPPING] mapToVapiAssistantFormat - Input: ${JSON.stringify(assistantData, null, 2)}`);
  
  const payload: AssistantCreateParams | AssistantUpdateParams = {
    name: assistantData.name
  };
  
  // === Configuration du modèle et du système prompt ===
  if (assistantData.model !== undefined || assistantData.system_prompt || assistantData.instructions) {
    let modelConfig: any = {};
    
    // Si model est un objet, l'utiliser comme base
    if (typeof assistantData.model === 'object' && assistantData.model !== null) {
      modelConfig = { ...assistantData.model };
    } 
    // Si model est une chaîne, la considérer comme le nom du modèle
    else if (typeof assistantData.model === 'string') {
      // Inférer le provider basé sur le préfixe du modèle
      let provider = 'openai'; // par défaut
      if (assistantData.model.startsWith('claude')) {
        provider = 'anthropic';
      } else if (assistantData.model.startsWith('command')) {
        provider = 'cohere';
      } else if (assistantData.model.startsWith('gemini')) {
        provider = 'google';
      }
      
      modelConfig = {
        provider: provider,
        model: assistantData.model
      };
    } 
    // Fallback avec valeurs par défaut
    else {
      modelConfig = {
        provider: 'openai',
        model: 'gpt-4o'
      };
    }
    
    // Récupérer le systemprompt de l'une des propriétés disponibles
    const systemPrompt = assistantData.system_prompt || assistantData.instructions || "";
    
    // Créer le format 'messages' attendu par Vapi
    modelConfig.messages = [
      {
        role: "system",
        content: systemPrompt
      }
    ];
    
    // Ajouter configuration des outils si disponible
    if (assistantData.tools_config) {
      modelConfig.tools = assistantData.tools_config;
    }
    
    payload.model = modelConfig;
  }
  
  // === Configuration de la voix ===
  if (assistantData.voice) {
    let voiceConfig: any = {};
    
    if (typeof assistantData.voice === 'object' && assistantData.voice !== null) {
      // L'objet est déjà potentiellement au bon format
      voiceConfig = { ...assistantData.voice };
      
      // Correction des noms de provider
      if (voiceConfig.provider === 'elevenlabs') {
        voiceConfig.provider = '11labs';
      } else if (voiceConfig.provider === 'playht') {
        voiceConfig.provider = 'play.ht';
      }
    } 
    else if (typeof assistantData.voice === 'string') {
      // Format: "provider-voiceId" (ex: "elevenlabs-rachel")
      const parts = assistantData.voice.split('-');
      if (parts.length >= 2) {
        let provider = parts[0];
        // Correction du nom du provider
        if (provider === 'elevenlabs') {
          provider = '11labs';
        } else if (provider === 'playht') {
          provider = 'play.ht';
        }
        
        voiceConfig = {
          provider: provider,
          voiceId: parts.slice(1).join('-') // Rejoindre au cas où le voiceId contient des tirets
        };
      } else {
        // Fallback: On utilise azure par défaut qui est plus fiable
        voiceConfig = {
          provider: 'azure',
          voiceId: 'en-US-JennyNeural'
        };
      }
    }
    
    payload.voice = voiceConfig;
  }
  
  // === Configuration des messages et options d'appel ===
  
  // Premier message
  if (assistantData.first_message || assistantData.firstMessage) {
    payload.firstMessage = assistantData.first_message || assistantData.firstMessage;
  }
  
  // Gestion du mode du premier message
  if (assistantData.first_message_mode || assistantData.firstMessageMode) {
    payload.firstMessageMode = assistantData.first_message_mode || assistantData.firstMessageMode;
  }
  
  // Interruptions du premier message
  if (assistantData.first_message_interruptions_enabled !== undefined || assistantData.firstMessageInterruptionsEnabled !== undefined) {
    payload.firstMessageInterruptionsEnabled = 
      !!assistantData.first_message_interruptions_enabled || 
      !!assistantData.firstMessageInterruptionsEnabled;
  }
  
  // Message vocal
  if (assistantData.voicemail_message) {
    payload.voicemailMessage = assistantData.voicemail_message;
  }
  
  // Message de fin d'appel
  if (assistantData.end_call_message) {
    payload.endCallMessage = assistantData.end_call_message;
  }
  
  // Activation de la fonction de fin d'appel
  if (assistantData.end_call_function_enabled !== undefined) {
    payload.endCallFunctionEnabled = !!assistantData.end_call_function_enabled;
  }
  
  // Activation de l'enregistrement
  if (assistantData.recording_settings) {
    payload.recordingEnabled = 
      typeof assistantData.recording_settings === 'object' && 
      assistantData.recording_settings !== null ? 
      !!assistantData.recording_settings.createRecording : false;
  } else if (assistantData.recording_enabled !== undefined) {
    payload.recordingEnabled = !!assistantData.recording_enabled;
  }
  
  // === Configuration du numéro de transfert ===
  if (assistantData.forwarding_phone_number) {
    payload.forwardingPhoneNumber = assistantData.forwarding_phone_number;
  }
  
  // === Paramètres avancés d'appel ===
  if (assistantData.silence_timeout_seconds !== undefined) {
    payload.silenceTimeoutSeconds = assistantData.silence_timeout_seconds;
  }
  
  if (assistantData.max_duration_seconds !== undefined) {
    payload.maxDurationSeconds = assistantData.max_duration_seconds;
  }
  
  if (assistantData.end_call_after_silence !== undefined) {
    payload.endCallAfterSilence = !!assistantData.end_call_after_silence;
  }
  
  if (assistantData.voice_reflection !== undefined) {
    payload.voiceReflection = !!assistantData.voice_reflection;
  }
  
  // === Métadonnées ===
  if (assistantData.metadata) {
    payload.metadata = assistantData.metadata;
  }
  
  // === Transcripteur (optionnel) ===
  if (assistantData.transcriber) {
    payload.transcriber = assistantData.transcriber;
  }
  
  // === Plans avancés (optionnels) ===
  // analysisPlan
  if (assistantData.analysis_plan) {
    payload.analysisPlan = assistantData.analysis_plan;
  }
  
  // artifactPlan
  if (assistantData.artifact_plan) {
    payload.artifactPlan = assistantData.artifact_plan;
  }
  
  // messagePlan
  if (assistantData.message_plan) {
    payload.messagePlan = assistantData.message_plan;
  }
  
  // startSpeakingPlan
  if (assistantData.start_speaking_plan) {
    payload.startSpeakingPlan = assistantData.start_speaking_plan;
  }
  
  // stopSpeakingPlan
  if (assistantData.stop_speaking_plan) {
    payload.stopSpeakingPlan = assistantData.stop_speaking_plan;
  }
  
  // monitorPlan
  if (assistantData.monitor_plan) {
    payload.monitorPlan = assistantData.monitor_plan;
  }
  
  console.log(`[MAPPING] mapToVapiAssistantFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
}

// Utilitaire pour appeler l'API avec une clé spécifiée
async function callVapiAPIWithKey<T = any>(
  endpoint: string, 
  apiKey: string, 
  method: string = 'GET', 
  data?: any,
  params?: Record<string, string | number | boolean | undefined>
): Promise<T> {
  // Construire l'URL avec les paramètres
  let url = `${VAPI_API_BASE}${endpoint}`;
  
  // Ajouter des paramètres de requête si nécessaire
  if (params && Object.keys(params).length > 0) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });
    url += `?${queryParams.toString()}`;
  }

  console.log(`[VAPI_REQUEST] ${method} ${url}`);

  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseText = await response.text();
    
    if (!response.ok) {
      let errorData: any = { 
        message: `API request failed with status ${response.status}`, 
        raw_error: responseText 
      };
      
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        // Keep the initial error if parsing fails
        console.warn('[VAPI_ERROR_PARSE] Failed to parse error response as JSON');
      }
      
      console.error(`[VAPI_ERROR] ${method} ${url} failed with status ${response.status}:`, errorData);
      throw new Error(`Erreur API Vapi (${endpoint.replace('/', '')}): ${response.status} - ${errorData.message || errorData.raw_error || 'Unknown error'}`);
    }

    if (responseText) {
      try {
        return JSON.parse(responseText);
      } catch (e: any) {
        console.error(`[VAPI_ERROR] Failed to parse JSON response: ${e.message}`);
        throw new Error(`Invalid JSON response from Vapi: ${responseText.substring(0, 100)}`);
      }
    }
    
    return {} as T;
  } catch (error: any) {
    console.error(`[VAPI_REQUEST_FAILED] ${method} ${url}: ${error.message}`);
    throw error;
  }
} 