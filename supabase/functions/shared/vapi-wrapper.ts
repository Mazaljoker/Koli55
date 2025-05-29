import { DenoEnv } from "./env";
import { VAPI_API_BASE } from "./constants";

/**
 * Fonction utilitaire pour les appels à l'API Vapi avec correction des erreurs de syntaxe
 */
export async function callVapiAPIWrapper<T = any>(
  endpoint: string,
  method: string = "GET",
  data?: any,
  params?: Record<string, string | number | boolean | undefined>,
  useFormData: boolean = false
): Promise<T> {
  const apiKey = DenoEnv.get("VAPI_API_KEY");
  if (!apiKey) {
    throw new Error(
      "Clé API Vapi manquante. Veuillez la définir dans les secrets Supabase : VAPI_API_KEY"
    );
  }

  const url = new URL(`${VAPI_API_BASE}/${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const requestInit: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
    },
  };

  if (data && ["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
    if (useFormData) {
      requestInit.body = data;
    } else {
      requestInit.headers = {
        ...requestInit.headers,
        "Content-Type": "application/json",
      };
      requestInit.body = JSON.stringify(data);
    }
  } else if (!useFormData) {
    requestInit.headers = {
      ...requestInit.headers,
      "Content-Type": "application/json",
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
    throw new Error(
      `Erreur API Vapi (${endpoint}): ${response.status} - ${
        errorData.message || response.statusText
      }`
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// Réexporter les types et interfaces nécessaires de vapi.ts
import type {
  Webhook,
  WebhookCreateParams,
  WebhookUpdateParams,
  PaginationParams,
  PaginatedResponse,
  VapiFile,
  FileContent,
  FileUploadParams,
  FileListParams,
  WorkflowStep,
  VapiWorkflow,
  WorkflowCreateParams,
  WorkflowUpdateParams,
  WorkflowExecuteParams,
  WorkflowExecution,
  VapiSquad,
  SquadMember,
  SquadCreateParams,
  SquadUpdateParams,
  VapiFunction,
  VapiFunctionParameters,
  FunctionCreateParams,
  FunctionUpdateParams,
  VapiOrganization,
  OrganizationUpdateParams,
  VapiLimits,
  CallMetricsParams,
  VapiCallMetrics,
  UsageStatsParams,
  VapiUsageStats,
  CallTimelineEvent,
  VapiCallTimeline,
  VapiAssistant,
  AssistantCreateParams,
  AssistantUpdateParams,
  VapiKnowledgeBase,
  KnowledgeBaseCreateParams,
  KnowledgeBaseUpdateParams,
  KnowledgeBaseQueryParams,
  KnowledgeBaseQueryResult,
  KnowledgeBaseAddFileParams,
  VapiTestSuite,
  TestSuiteCreateParams,
  TestSuiteUpdateParams,
  VapiTestSuiteTest,
  TestSuiteTestCreateParams,
  TestSuiteTestUpdateParams,
  VapiPhoneNumber,
  PhoneNumberSearchParams,
  PhoneNumberSearchResult,
  PhoneNumberProvisionParams,
  PhoneNumberUpdateParams,
} from "./vapi";

export type {
  Webhook,
  WebhookCreateParams,
  WebhookUpdateParams,
  PaginationParams,
  PaginatedResponse,
  VapiFile,
  FileContent,
  FileUploadParams,
  FileListParams,
  WorkflowStep,
  VapiWorkflow,
  WorkflowCreateParams,
  WorkflowUpdateParams,
  WorkflowExecuteParams,
  WorkflowExecution,
  VapiSquad,
  SquadMember,
  SquadCreateParams,
  SquadUpdateParams,
  VapiFunction,
  VapiFunctionParameters,
  FunctionCreateParams,
  FunctionUpdateParams,
  VapiOrganization,
  OrganizationUpdateParams,
  VapiLimits,
  CallMetricsParams,
  VapiCallMetrics,
  UsageStatsParams,
  VapiUsageStats,
  CallTimelineEvent,
  VapiCallTimeline,
  VapiAssistant,
  AssistantCreateParams,
  AssistantUpdateParams,
  VapiKnowledgeBase,
  KnowledgeBaseCreateParams,
  KnowledgeBaseUpdateParams,
  KnowledgeBaseQueryParams,
  KnowledgeBaseQueryResult,
  KnowledgeBaseAddFileParams,
  VapiTestSuite,
  TestSuiteCreateParams,
  TestSuiteUpdateParams,
  VapiTestSuiteTest,
  TestSuiteTestCreateParams,
  TestSuiteTestUpdateParams,
  VapiPhoneNumber,
  PhoneNumberSearchParams,
  PhoneNumberSearchResult,
  PhoneNumberProvisionParams,
  PhoneNumberUpdateParams,
};

// Wrapper pour les webhooks
export const vapiWebhooksWrapper = {
  list: async (params?: PaginationParams) => {
    const queryParams = params
      ? {
          limit: params.limit,
          offset: params.offset,
        }
      : undefined;
    return callVapiAPIWrapper("webhooks", "GET", undefined, queryParams);
  },
  retrieve: async (id: string) => {
    return callVapiAPIWrapper(`webhooks/${id}`);
  },
  create: async (data: WebhookCreateParams) => {
    return callVapiAPIWrapper("webhooks", "POST", data);
  },
  update: async (id: string, data: WebhookUpdateParams) => {
    return callVapiAPIWrapper(`webhooks/${id}`, "PATCH", data);
  },
  delete: async (id: string) => {
    await callVapiAPIWrapper(`webhooks/${id}`, "DELETE");
  },
  ping: async (id: string) => {
    await callVapiAPIWrapper(`webhooks/${id}/ping`, "POST");
  },
};

// Autres wrappers similaires pour les autres fonctionnalités...
// Vous pouvez ajouter les wrappers pour les autres fonctionnalités au besoin
