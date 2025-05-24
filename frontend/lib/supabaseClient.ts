import { createClient } from '@supabase/supabase-js';
import { appConfig, devConfig, isDevelopment } from './config/env';

// Création du client Supabase avec la configuration validée
const supabase = createClient(appConfig.supabase.url, appConfig.supabase.anonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
    flowType: 'pkce', // Plus sécurisé pour les applications web
  },
  global: {
    fetch: (...args) => {
      const [url, options] = args;
      
      // Ajouter un timeout aux requêtes fetch
      if (options && typeof options === 'object') {
        (options as RequestInit & { timeout?: number }).timeout = 8000; // 8 secondes de timeout
      }
      
      // Log des requêtes en mode debug
      if (devConfig.enableDebug) {
        console.log('[SUPABASE] Request:', url);
      }
      
      return fetch(url, options);
    }
  },
  // Configuration pour le mode développement
  ...(isDevelopment && {
    db: {
      schema: 'public'
    }
  })
});

// Exporter les constantes utiles
export const USE_DEMO_DATA = devConfig.useDemoData;

// Fonction utilitaire pour vérifier la connexion Supabase
export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (devConfig.enableDebug) {
      console.log('[SUPABASE] Connection check:', { hasSession: !!data.session, error });
    }
    
    return !error;
  } catch (error) {
    console.error('[SUPABASE] Connection failed:', error);
    return false;
  }
}

// Helper pour obtenir l'utilisateur actuel de manière sécurisée
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      if (devConfig.enableDebug) {
        console.warn('[SUPABASE] User fetch error:', error);
      }
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('[SUPABASE] Unexpected error getting user:', error);
    return null;
  }
}

export default supabase; 