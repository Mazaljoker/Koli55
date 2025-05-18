/**
 * Point d'entrée central pour tous les services d'API
 * Permet d'importer facilement n'importe quel service avec une syntaxe comme :
 * import { assistantsService, knowledgeBaseService } from 'lib/api';
 */

// Exporter les services
export { default as assistantsService } from './assistantsService';
export { default as knowledgeBaseService } from './knowledgeBaseService';
export { default as filesService } from './filesService';
export { default as messagesService } from './messagesService';
export { default as callsService } from './callsService';
export { default as organizationService } from './organizationService';
export { default as squadsService } from './squadsService';
export { default as workflowsService } from './workflowsService';
export { default as webhooksService } from './webhooksService';
export { default as analyticsService } from './analyticsService';
export { default as phoneNumbersService } from './phoneNumbersService';
export { default as testSuitesService } from './testSuitesService';
export { default as testSuiteTestsService } from './testSuiteTestsService';
export { default as testSuiteRunsService } from './testSuiteRunsService';
export { default as functionsService } from './functionsService';
export { default as customFunctionsService } from './customFunctionsService';

// Exporter explicitement les types depuis chaque service
// Assistants
export type { 
  AssistantData,
  CreateAssistantPayload,
  UpdateAssistantPayload,
  ListAssistantsParams,
  AssistantApiResponse,
  AssistantsListApiResponse
} from './assistantsService';

// KnowledgeBase
export type {
  KnowledgeBaseData,
  KnowledgeBaseFile,
  CreateKnowledgeBasePayload,
  UpdateKnowledgeBasePayload,
  QueryKnowledgeBasePayload,
  AddFileToKnowledgeBasePayload,
  ListKnowledgeBasesParams,
  KnowledgeBaseApiResponse,
  KnowledgeBaseListApiResponse,
  QueryKnowledgeBaseApiResponse
} from './knowledgeBaseService';

// Files
export type {
  FileData,
  FileContentData,
  ListFilesParams,
  UploadFileParams,
  FileApiResponse,
  FilesListApiResponse,
  FileContentApiResponse
} from './filesService';

// Messages
export type {
  Message,
  MessageCreateParams,
  MessageListParams,
  MessageApiResponse,
  MessageListApiResponse
} from './messagesService';

// Calls
export type {
  Call,
  CreateCallParams,
  UpdateCallParams,
  ListCallsParams,
  CallApiResponse,
  CallsListApiResponse,
  ListenUrlResponse
} from './callsService';

// Organization
export type {
  OrganizationData,
  CreateOrganizationPayload,
  UpdateOrganizationPayload,
  ListOrganizationsParams,
  OrganizationApiResponse,
  OrganizationsListApiResponse,
  OrganizationMember,
  OrganizationMembersApiResponse,
  InviteUserPayload,
  InvitationApiResponse
} from './organizationService';

// Squads
export type {
  SquadData,
  SquadMember,
  CreateSquadPayload,
  UpdateSquadPayload,
  AddMembersPayload,
  ListSquadsParams,
  SquadApiResponse,
  SquadsListApiResponse
} from './squadsService';

// Workflows
export type {
  WorkflowData,
  WorkflowStep,
  WorkflowExecutionData,
  CreateWorkflowPayload,
  UpdateWorkflowPayload,
  ExecuteWorkflowPayload,
  ListWorkflowsParams,
  WorkflowApiResponse,
  WorkflowsListApiResponse,
  WorkflowExecutionApiResponse
} from './workflowsService';

// Webhooks
export type {
  WebhookData,
  WebhookDelivery,
  CreateWebhookPayload,
  UpdateWebhookPayload,
  ListWebhooksParams,
  WebhookApiResponse,
  WebhooksListApiResponse,
  WebhookDeliveryApiResponse,
  WebhookDeliveriesListApiResponse
} from './webhooksService';

// Analytics
export type {
  AnalyticsQueryParams,
  TrackEventPayload,
  TimeSeriesDataPoint,
  UsageStats,
  AnalyticsTimeSeriesResponse,
  AnalyticsUsageResponse,
  AnalyticsTrackResponse
} from './analyticsService';

// Phone Numbers
export type {
  PhoneNumberData,
  PhoneNumberSearchResult,
  CreatePhoneNumberPayload,
  UpdatePhoneNumberPayload,
  ProvisionPhoneNumberPayload,
  SearchPhoneNumbersPayload,
  ListPhoneNumbersParams,
  PhoneNumberApiResponse,
  PhoneNumbersListApiResponse,
  PhoneNumberSearchApiResponse
} from './phoneNumbersService';

// Test Suites
export type {
  TestSuiteData,
  CreateTestSuitePayload,
  UpdateTestSuitePayload,
  ListTestSuitesParams,
  TestSuiteApiResponse,
  TestSuitesListApiResponse
} from './testSuitesService';

// Test Suite Tests
export type {
  TestSuiteTestData,
  CreateTestSuiteTestPayload,
  UpdateTestSuiteTestPayload,
  ListTestSuiteTestsParams,
  TestSuiteTestApiResponse,
  TestSuiteTestsListApiResponse
} from './testSuiteTestsService';

// Test Suite Runs
export type {
  TestRunData,
  TestResultData,
  ListTestRunsParams,
  TestRunApiResponse,
  TestRunsListApiResponse,
  TestResultsListApiResponse
} from './testSuiteRunsService';

// Functions
export type {
  FunctionData,
  FunctionParameter,
  FunctionParameters,
  CreateFunctionPayload,
  UpdateFunctionPayload,
  ListFunctionsParams,
  FunctionApiResponse,
  FunctionsListApiResponse
} from './functionsService';

// Custom Functions
export type {
  InvokeFunctionPayload,
  FunctionInvocationResult,
  InvocationApiResponse
} from './customFunctionsService';

// Type commun pour les réponses d'API
export type { ApiResponse, PaginationData } from './assistantsService';

// Exporter un objet contenant tous les services
const api = {
  assistants: require('./assistantsService').default,
  knowledgeBases: require('./knowledgeBaseService').default,
  files: require('./filesService').default,
  messages: require('./messagesService').default,
  calls: require('./callsService').default,
  organization: require('./organizationService').default,
  squads: require('./squadsService').default,
  workflows: require('./workflowsService').default,
  webhooks: require('./webhooksService').default,
  analytics: require('./analyticsService').default,
  phoneNumbers: require('./phoneNumbersService').default,
  testSuites: require('./testSuitesService').default,
  testSuiteTests: require('./testSuiteTestsService').default,
  testSuiteRuns: require('./testSuiteRunsService').default,
  functions: require('./functionsService').default,
  customFunctions: require('./customFunctionsService').default,
};

export default api; 