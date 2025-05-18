/**
 * Services API pour frontend
 * 
 * Exemple d'utilisation:
 * import { assistantsService } from '@api';
 */

export { default as assistantsService } from './assistantsService';

// Exporter les types
export type {
  ApiResponse,
  PaginationData,
  AssistantData,
  CreateAssistantPayload,
  UpdateAssistantPayload
} from './assistantsService'; 