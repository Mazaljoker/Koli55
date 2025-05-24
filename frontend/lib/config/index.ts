/**
 * Configuration centralisée pour l'application AlloKoli
 */

// Export de la configuration d'environnement
export { 
  env, 
  isDevelopment, 
  isProduction, 
  isStaging, 
  devConfig, 
  appConfig,
  type Environment 
} from './env'

// Re-export pour compatibilité avec le code existant
export { default as supabase } from '../supabaseClient' 