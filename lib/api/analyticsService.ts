import supabase from '../supabaseClient';
import { ApiResponse, PaginationData } from './assistantsService';

// Types pour les payloads d'entrée
export interface AnalyticsQueryParams {
  start_date?: string; // ISO date format
  end_date?: string; // ISO date format
  granularity?: 'day' | 'week' | 'month';
  metric?: string; // e.g., 'calls', 'messages', 'users'
  filter?: Record<string, any>; // Additional filters
}

export interface TrackEventPayload {
  event_name: string;
  event_type: string;
  properties?: Record<string, any>;
  user_id?: string;
}

// Types pour les réponses d'API
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  metric: string;
}

export interface UsageStats {
  calls_count: number;
  messages_count: number;
  audio_duration: number; // in seconds
  tokens_used: number;
  knowledge_bases_count: number;
  files_count: number;
  assistants_count: number;
}

export interface AnalyticsTimeSeriesResponse extends ApiResponse<TimeSeriesDataPoint[]> {}
export interface AnalyticsUsageResponse extends ApiResponse<UsageStats> {}
export interface AnalyticsTrackResponse extends ApiResponse<{success: boolean}> {}

// Fonctions du service
/**
 * Récupère des données d'analytics sous forme de séries temporelles
 */
export async function getTimeSeriesData(params: AnalyticsQueryParams): Promise<AnalyticsTimeSeriesResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.granularity) queryParams.append('granularity', params.granularity);
    if (params.metric) queryParams.append('metric', params.metric);
    
    const route = `analytics/timeseries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
      body: params.filter,
    });

    if (error) {
      throw new Error(error.message || 'Failed to get analytics data');
    }

    return data as AnalyticsTimeSeriesResponse;
  } catch (error: any) {
    console.error('Error in getTimeSeriesData:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

/**
 * Récupère des statistiques d'utilisation globales ou pour une période donnée
 */
export async function getUsageStats(startDate?: string, endDate?: string): Promise<AnalyticsUsageResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append('start_date', startDate);
    if (endDate) queryParams.append('end_date', endDate);
    
    const route = `analytics/usage${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to get usage statistics');
    }

    return data as AnalyticsUsageResponse;
  } catch (error: any) {
    console.error('Error in getUsageStats:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Suit un événement analytique personnalisé
 */
export async function trackEvent(payload: TrackEventPayload): Promise<AnalyticsTrackResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('analytics/track', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to track event');
    }

    return data as AnalyticsTrackResponse;
  } catch (error: any) {
    console.error('Error in trackEvent:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

/**
 * Récupère la répartition des utilisations par assistant
 */
export async function getAssistantUsage(startDate?: string, endDate?: string): Promise<AnalyticsTimeSeriesResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    if (startDate) queryParams.append('start_date', startDate);
    if (endDate) queryParams.append('end_date', endDate);
    
    const route = `analytics/assistants${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const { data, error } = await supabase.functions.invoke(route, {
      method: 'GET',
    });

    if (error) {
      throw new Error(error.message || 'Failed to get assistant usage data');
    }

    return data as AnalyticsTimeSeriesResponse;
  } catch (error: any) {
    console.error('Error in getAssistantUsage:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      data: [],
    };
  }
}

// Regrouper toutes les fonctions dans un objet exporté pour faciliter l'usage
export const analyticsService = {
  getTimeSeriesData,
  getUsageStats,
  trackEvent,
  getAssistantUsage,
};

export default analyticsService; 