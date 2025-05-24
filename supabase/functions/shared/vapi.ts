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

// Configuration de base pour l'API Vapi (sans versioning selon la documentation officielle)const VAPI_API_BASE = 'https://api.vapi.ai';

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
  
  // Configuration du modèle (LLM)
  model?: {
    provider: 'openai' | 'anthropic' | 'groq' | 'azure' | string;
    model: string; // 'gpt-4o', 'claude-3-opus-20240229', etc.
    systemPrompt?: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
  };
  
  // Configuration de la voix (TTS)
  voice?: {
    provider: 'elevenlabs' | 'azure' | 'openai' | 'deepgram' | 'playht' | string;
    voiceId: string;
    cachingEnabled?: boolean;
  };
  
  // Configuration du transcriber (STT)
  transcriber?: {
    provider: 'deepgram' | 'assembly-ai' | 'google' | 'azure' | 'custom-transcriber' | string;
    model?: string;
    language?: string;
    confidenceThreshold?: number;
    server?: {
      url: string;
      secret?: string;
    };
  };
  
  // Messages et comportement de conversation
  firstMessage?: string;
  firstMessageInterruptionsEnabled?: boolean;
  firstMessageMode?: 'assistant-speaks-first' | 'assistant-waits-for-user';
  endCallMessage?: string;
  endCallPhrases?: string[];
  voicemailMessage?: string;
  voicemailDetection?: {
    provider: 'twilio' | 'google' | string;
  };
  
  // Configuration des tools et intégrations
  tools?: {
    functions?: string[]; // IDs des fonctions
    knowledgeBases?: string[]; // IDs des bases de connaissances
    workflows?: string[]; // IDs des workflows
  };
  
  // Configuration des messages client/serveur
  clientMessages?: string[];
  serverMessages?: string[];
  
  // Téléphonie et transferts
  forwardingPhoneNumber?: string;
  
  // Paramètres d'appel
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  backgroundSound?: 'off' | 'office' | string;
  backgroundDenoisingEnabled?: boolean;
  modelOutputInMessagesEnabled?: boolean;
  
  // Plans spécialisés
  artifactPlan?: {
    recordingEnabled?: boolean;
    recordingFormat?: string;
    videoRecordingEnabled?: boolean;
    pcapEnabled?: boolean;
    pcapS3PathPrefix?: string;
    transcriptPlan?: {
      enabled: boolean;
    };
  };
  
  startSpeakingPlan?: {
    waitSeconds?: number;
  };
  
  stopSpeakingPlan?: {
    numWords?: number;
    voiceSeconds?: number;
    backoffSeconds?: number;
  };
  
  monitorPlan?: {
    listenEnabled?: boolean;
    listenAuthenticationEnabled?: boolean;
    controlEnabled?: boolean;
    controlAuthenticationEnabled?: boolean;
  };
  
  // Plans de détection et d'analyse
  analysisPlan?: {
    summaryPrompt?: string;
    structuredDataPrompt?: string;
    structuredDataSchema?: any;
    successEvaluationPrompt?: string;
    successEvaluationRubric?: string;
  };
  
  // Observabilité et monitoring
  observabilityPlan?: {
    provider?: 'langfuse' | string;
    tags?: string[];
  };
  
  // Configuration des transports
  transportConfigurations?: Array<{
    provider: 'twilio' | 'vonage' | 'telnyx' | string;
    timeout?: number;
    record?: boolean;
  }>;
  
  // Credentials et authentification
  credentials?: Array<{
    provider: string;
    apiKey?: string;
  }>;
  credentialIds?: string[];
  
  // Hooks et automations
  hooks?: Array<{
    on: string; // 'call.ending', 'call.starting', etc.
    do: Array<{
      type: string; // 'transfer', 'hangup', etc.
      [key: string]: any;
    }>;
  }>;
  
  // Variables et personnalisation
  variableValues?: Record<string, any>;
  
  // Configuration serveur
  server?: {
    url?: string;
    timeoutSeconds?: number;
    backoffPlan?: {
      type?: any;
      maxRetries?: number;
      baseDelaySeconds?: number;
    };
  };
  
  // Métadonnées et informations système
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface AssistantCreateParams {
  name: string;
  
  // Configuration du modèle (LLM)
  model?: {
    provider: 'openai' | 'anthropic' | 'groq' | 'azure' | string;
    model: string;
    systemPrompt?: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
  };
  
  // Configuration de la voix (TTS)
  voice?: {
    provider: 'elevenlabs' | 'azure' | 'openai' | 'deepgram' | 'playht' | string;
    voiceId: string;
    cachingEnabled?: boolean;
  };
  
  // Configuration du transcriber (STT)
  transcriber?: {
    provider: 'deepgram' | 'assembly-ai' | 'google' | 'azure' | 'custom-transcriber' | string;
    model?: string;
    language?: string;
    confidenceThreshold?: number;
    server?: {
      url: string;
      secret?: string;
    };
  };
  
  // Messages et comportement
  firstMessage?: string;
  firstMessageInterruptionsEnabled?: boolean;
  firstMessageMode?: 'assistant-speaks-first' | 'assistant-waits-for-user';
  endCallMessage?: string;
  endCallPhrases?: string[];
  voicemailMessage?: string;
  voicemailDetection?: {
    provider: 'twilio' | 'google' | string;
  };
  
  // Tools et intégrations
  tools?: {
    functions?: string[];
    knowledgeBases?: string[];
    workflows?: string[];
  };
  
  // Configuration des messages
  clientMessages?: string[];
  serverMessages?: string[];
  
  // Téléphonie
  forwardingPhoneNumber?: string;
  
  // Paramètres d'appel
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  backgroundSound?: 'off' | 'office' | string;
  backgroundDenoisingEnabled?: boolean;
  modelOutputInMessagesEnabled?: boolean;
  
  // Plans avancés
  artifactPlan?: {
    recordingEnabled?: boolean;
    recordingFormat?: string;
    videoRecordingEnabled?: boolean;
    pcapEnabled?: boolean;
    pcapS3PathPrefix?: string;
    transcriptPlan?: {
      enabled: boolean;
    };
  };
  
  startSpeakingPlan?: {
    waitSeconds?: number;
  };
  
  stopSpeakingPlan?: {
    numWords?: number;
    voiceSeconds?: number;
    backoffSeconds?: number;
  };
  
  monitorPlan?: {
    listenEnabled?: boolean;
    listenAuthenticationEnabled?: boolean;
    controlEnabled?: boolean;
    controlAuthenticationEnabled?: boolean;
  };
  
  analysisPlan?: {
    summaryPrompt?: string;
    structuredDataPrompt?: string;
    structuredDataSchema?: any;
    successEvaluationPrompt?: string;
    successEvaluationRubric?: string;
  };
  
  observabilityPlan?: {
    provider?: 'langfuse' | string;
    tags?: string[];
  };
  
  transportConfigurations?: Array<{
    provider: 'twilio' | 'vonage' | 'telnyx' | string;
    timeout?: number;
    record?: boolean;
  }>;
  
  credentials?: Array<{
    provider: string;
    apiKey?: string;
  }>;
  credentialIds?: string[];
  
  hooks?: Array<{
    on: string;
    do: Array<{
      type: string;
      [key: string]: any;
    }>;
  }>;
  
  variableValues?: Record<string, any>;
  
  server?: {
    url?: string;
    timeoutSeconds?: number;
    backoffPlan?: {
      type?: any;
      maxRetries?: number;
      baseDelaySeconds?: number;
    };
  };
  
  metadata?: Record<string, any>;
}

export interface AssistantUpdateParams {
  name?: string;
  
  // Configuration du modèle (LLM)
  model?: {
    provider?: 'openai' | 'anthropic' | 'groq' | 'azure' | string;
    model?: string;
    systemPrompt?: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
  };
  
  // Configuration de la voix (TTS)
  voice?: {
    provider?: 'elevenlabs' | 'azure' | 'openai' | 'deepgram' | 'playht' | string;
    voiceId?: string;
    cachingEnabled?: boolean;
  };
  
  // Configuration du transcriber (STT)
  transcriber?: {
    provider?: 'deepgram' | 'assembly-ai' | 'google' | 'azure' | 'custom-transcriber' | string;
    model?: string;
    language?: string;
    confidenceThreshold?: number;
    server?: {
      url?: string;
      secret?: string;
    };
  };
  
  // Messages et comportement
  firstMessage?: string;
  firstMessageInterruptionsEnabled?: boolean;
  firstMessageMode?: 'assistant-speaks-first' | 'assistant-waits-for-user';
  endCallMessage?: string;
  endCallPhrases?: string[];
  voicemailMessage?: string;
  voicemailDetection?: {
    provider?: 'twilio' | 'google' | string;
  };
  
  // Tools et intégrations
  tools?: {
    functions?: string[];
    knowledgeBases?: string[];
    workflows?: string[];
  };
  
  // Configuration des messages
  clientMessages?: string[];
  serverMessages?: string[];
  
  // Téléphonie
  forwardingPhoneNumber?: string;
  
  // Paramètres d'appel
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  backgroundSound?: 'off' | 'office' | string;
  backgroundDenoisingEnabled?: boolean;
  modelOutputInMessagesEnabled?: boolean;
  
  // Plans avancés (tous optionnels pour update)
  artifactPlan?: {
    recordingEnabled?: boolean;
    recordingFormat?: string;
    videoRecordingEnabled?: boolean;
    pcapEnabled?: boolean;
    pcapS3PathPrefix?: string;
    transcriptPlan?: {
      enabled?: boolean;
    };
  };
  
  startSpeakingPlan?: {
    waitSeconds?: number;
  };
  
  stopSpeakingPlan?: {
    numWords?: number;
    voiceSeconds?: number;
    backoffSeconds?: number;
  };
  
  monitorPlan?: {
    listenEnabled?: boolean;
    listenAuthenticationEnabled?: boolean;
    controlEnabled?: boolean;
    controlAuthenticationEnabled?: boolean;
  };
  
  analysisPlan?: {
    summaryPrompt?: string;
    structuredDataPrompt?: string;
    structuredDataSchema?: any;
    successEvaluationPrompt?: string;
    successEvaluationRubric?: string;
  };
  
  observabilityPlan?: {
    provider?: 'langfuse' | string;
    tags?: string[];
  };
  
  transportConfigurations?: Array<{
    provider?: 'twilio' | 'vonage' | 'telnyx' | string;
    timeout?: number;
    record?: boolean;
  }>;
  
  credentials?: Array<{
    provider?: string;
    apiKey?: string;
  }>;
  credentialIds?: string[];
  
  hooks?: Array<{
    on?: string;
    do?: Array<{
      type?: string;
      [key: string]: any;
    }>;
  }>;
  
  variableValues?: Record<string, any>;
  
  server?: {
    url?: string;
    timeoutSeconds?: number;
    backoffPlan?: {
      type?: any;
      maxRetries?: number;
      baseDelaySeconds?: number;
    };
  };
  
  metadata?: Record<string, any>;
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
 * Fonction utilitaire pour les appels à l'API Vapi
 */
export async function callVapiAPI<T = any>(  endpoint: string,  method: string = 'GET',  data?: any,  params?: Record<string, string | number | boolean | undefined>, // Etendu pour accepter boolean et undefined  isFormData: boolean = false // Nouveau paramètre pour gérer multipart/form-data): Promise<T> {  const apiKey = DenoEnv.get('VAPI_API_KEY');  if (!apiKey) {    throw new Error('Clé API Vapi manquante. Veuillez la définir dans les secrets Supabase : VAPI_API_KEY');  }  // Correction: API Vapi utilise directement les endpoints sans préfixe /v1/  const url = new URL(`${VAPI_API_BASE}/${endpoint}`);
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) { // S'assurer que les paramètres undefined ne sont pas ajoutés
        url.searchParams.append(key, String(value));
      }
    });
  }

  const requestInit: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json',
    },
  };

  // Gestion différenciée pour FormData vs JSON
  if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
    if (isFormData) {
      // Pour FormData, ne pas définir Content-Type (fetch le fait automatiquement)
      requestInit.body = data;
    } else {
      // Pour JSON
      requestInit.headers = {
        ...requestInit.headers,
        'Content-Type': 'application/json',
      };
      requestInit.body = JSON.stringify(data);
    }
  } else if (!isFormData) {
    // Ajouter Content-Type JSON seulement si ce n'est pas FormData
    requestInit.headers = {
      ...requestInit.headers,
      'Content-Type': 'application/json',
    };
  }

  const response = await fetch(url.toString(), requestInit);
  
  if (!response.ok) {
    let errorData = { message: response.statusText };
    try {
      errorData = await response.json();
    } catch (e) {
      // Ignorer l'erreur si le corps n'est pas JSON
    }
    throw new Error(`Erreur API Vapi (${endpoint}): ${response.status} - ${errorData.message || response.statusText}`);
  }

  if (response.status === 204) { // No Content
    return {} as T;
  }

  return response.json();
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
    // Validation des paramètres d'entrée
    if (!data.file || !data.filename || !data.purpose) {
      throw new Error('Paramètres manquants : file, filename et purpose sont requis');
    }

    // Validation du type de purpose
    if (!['assistants', 'knowledge-bases'].includes(data.purpose)) {
      throw new Error('Purpose doit être soit "assistants" soit "knowledge-bases"');
    }

    // Création du FormData avec validation des types de fichiers
    const formData = new FormData();
    
    // Détection du type MIME basé sur l'extension du fichier
    const getContentType = (filename: string): string => {
      const ext = filename.toLowerCase().split('.').pop();
      switch (ext) {
        case 'pdf': return 'application/pdf';
        case 'txt': return 'text/plain';
        case 'json': return 'application/json';
        case 'csv': return 'text/csv';
        case 'md': return 'text/markdown';
        case 'docx': return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'doc': return 'application/msword';
        default: return 'application/octet-stream';
      }
    };

    const contentType = getContentType(data.filename);
    const blob = new Blob([data.file], { type: contentType });
    
    formData.append('file', blob, data.filename);
    formData.append('purpose', data.purpose);
    
    if (data.metadata) {
      formData.append('metadata', JSON.stringify(data.metadata));
    }

    // Utilisation de callVapiAPI avec le nouveau paramètre isFormData
    return callVapiAPI<VapiFile>('files', 'POST', formData, undefined, true);
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
  list: async (params?: PaginationParams): Promise<PaginatedResponse<VapiAssistant>> => {
    return callVapiAPI<PaginatedResponse<VapiAssistant>>('assistants', 'GET', undefined, params as Record<string, string | number | boolean | undefined>);
  },

  retrieve: async (id: string): Promise<VapiAssistant> => {
    return callVapiAPI<VapiAssistant>(`assistants/${id}`);
  },

  create: async (data: AssistantCreateParams): Promise<VapiAssistant> => {
    return callVapiAPI<VapiAssistant>('assistants', 'POST', data);
  },

  update: async (id: string, data: AssistantUpdateParams): Promise<VapiAssistant> => {
    return callVapiAPI<VapiAssistant>(`assistants/${id}`, 'PATCH', data);
  },

  delete: async (id: string): Promise<void> => {
    await callVapiAPI<Record<string, never>>(`assistants/${id}`, 'DELETE');
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
 */
export function mapToVapiAssistantFormat(assistantData: any): AssistantCreateParams | AssistantUpdateParams {
  console.log(`[MAPPING] mapToVapiAssistantFormat - Input: ${JSON.stringify(assistantData, null, 2)}`);
  
  const payload: AssistantCreateParams | AssistantUpdateParams = {
    name: assistantData.name
  };
  
  // Mapping du modèle et system prompt
  if (assistantData.model !== undefined || assistantData.system_prompt || assistantData.instructions) {
    const modelInput = assistantData.model;
    const systemPrompt = assistantData.system_prompt || assistantData.instructions;
    
    if (typeof modelInput === 'string') {
      // Simple string handling - infère le provider basé sur des préfixes connus
      let provider = 'openai'; // par défaut
      let model = modelInput;
      
      // Inférer le provider basé sur des préfixes connus
      if (modelInput.startsWith('claude')) {
        provider = 'anthropic';
      } else if (modelInput.startsWith('command')) {
        provider = 'cohere';
      } else if (modelInput.startsWith('gemini')) {
        provider = 'google';
      }
      
      payload.model = {
        provider,
        model,
        systemPrompt: systemPrompt || undefined
      };
    } else if (typeof modelInput === 'object' && modelInput.provider && modelInput.model) {
      // L'objet a déjà le format attendu par Vapi
      payload.model = {
        provider: modelInput.provider,
        model: modelInput.model,
        systemPrompt: modelInput.systemPrompt || systemPrompt || undefined,
        ...(modelInput.temperature !== undefined && { temperature: modelInput.temperature }),
        ...(modelInput.topP !== undefined && { topP: modelInput.topP }),
        ...(modelInput.maxTokens !== undefined && { maxTokens: modelInput.maxTokens })
      };
    } else if (systemPrompt) {
      // Fallback avec des valeurs par défaut + systemPrompt
      payload.model = {
        provider: 'openai',
        model: 'gpt-4o',
        systemPrompt: systemPrompt
      };
    }
  }
  
  // Mapping de la voix
  if (assistantData.voice) {
    const voiceInput = assistantData.voice;
    
    if (typeof voiceInput === 'string') {
      // Format: "provider-voiceId" (ex: "elevenlabs-rachel")
      const parts = voiceInput.split('-');
      if (parts.length >= 2) {
        payload.voice = {
          provider: parts[0],
          voiceId: parts.slice(1).join('-') // Rejoindre au cas où le voiceId contient des tirets
        };
      } else {
        // Fallback: assume it's elevenlabs voice ID if no provider is specified
        payload.voice = {
          provider: 'elevenlabs',
          voiceId: voiceInput
        };
      }
    } else if (typeof voiceInput === 'object' && voiceInput.provider && voiceInput.voiceId) {
      // L'entrée est déjà un objet structuré
      payload.voice = {
        provider: voiceInput.provider,
        voiceId: voiceInput.voiceId
      };
    }
  }
  
  // Mapping des autres champs directs
  if (assistantData.first_message || assistantData.firstMessage) {
    payload.firstMessage = assistantData.first_message || assistantData.firstMessage;
  }
  
  // Mapping des outils si présents
  if (assistantData.tools_config) {
    payload.tools = assistantData.tools_config;
  }
  
  // Mapping du numéro de téléphone de transfert
  if (assistantData.forwarding_phone_number || assistantData.forwardingPhoneNumber) {
    payload.forwardingPhoneNumber = assistantData.forwarding_phone_number || assistantData.forwardingPhoneNumber;
  }
  
  // Mapping des paramètres avancés d'appel
  if (assistantData.silence_timeout_seconds !== undefined || assistantData.silenceTimeoutSeconds !== undefined) {
    payload.silenceTimeoutSeconds = assistantData.silence_timeout_seconds || assistantData.silenceTimeoutSeconds;
  }
  
  if (assistantData.max_duration_seconds !== undefined || assistantData.maxDurationSeconds !== undefined) {
    payload.maxDurationSeconds = assistantData.max_duration_seconds || assistantData.maxDurationSeconds;
  }
  
  if (assistantData.end_call_after_silence !== undefined || assistantData.endCallAfterSilence !== undefined) {
    payload.endCallAfterSilence = assistantData.end_call_after_silence || assistantData.endCallAfterSilence;
  }
  
  // Mapping des métadonnées
  if (assistantData.metadata) {
    payload.metadata = assistantData.metadata;
  }
  
  console.log(`[MAPPING] mapToVapiAssistantFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
} 