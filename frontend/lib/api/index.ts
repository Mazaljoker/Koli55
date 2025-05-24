/**
 * API AlloKoli - SDK unifié
 * 
 * Exemple d'utilisation:
 * import { AlloKoliSDK } from './api';
 * import { useAlloKoliSDKWithAuth } from './hooks/useAlloKoliSDK';
 */

// Export du SDK principal
export { AlloKoliSDK, AlloKoliAPIError } from './allokoli-sdk';

// Export des hooks React
export { useAlloKoliSDK, useAlloKoliSDKWithAuth } from '../hooks/useAlloKoliSDK';

// Export des types principaux
export type {
  Assistant,
  AssistantCreate,
  AssistantUpdate,
  KnowledgeBase,
  KnowledgeBaseCreate,
  KnowledgeBaseUpdate,
  PaginatedResponse,
  SingleResponse,
  PaginationParams,
  VapiModel,
  VapiVoice,
  RecordingSettings,
  Call,
  PhoneNumber
} from './allokoli-sdk'; 