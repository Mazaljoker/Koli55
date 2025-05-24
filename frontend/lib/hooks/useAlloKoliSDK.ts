/**
 * Hook personnalisé pour utiliser le SDK AlloKoli avec Supabase
 * 
 * Ce hook gère automatiquement l'authentification et la configuration du SDK
 * en fonction de l'état de l'utilisateur Supabase.
 */

import { useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { createAlloKoliSDKWithSupabase, type AlloKoliSDK } from '../api/allokoli-sdk';

// Configuration Supabase depuis les variables d'environnement
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!;

/**
 * Hook pour utiliser le SDK AlloKoli avec authentification manuelle
 * 
 * @param authToken - Token JWT optionnel (si non fourni, l'authentification sera désactivée)
 * @returns Instance configurée du SDK AlloKoli
 */
export function useAlloKoliSDK(authToken?: string): AlloKoliSDK {
  return useMemo(() => {
    // Créer l'instance du SDK avec le project ID et le token
    return createAlloKoliSDKWithSupabase(projectId, authToken);
  }, [authToken]);
}

/**
 * Hook pour utiliser le SDK avec récupération automatique du token depuis Supabase
 * 
 * @returns Instance configurée du SDK AlloKoli avec token automatique
 */
export function useAlloKoliSDKWithAuth(): AlloKoliSDK {
  const sdk = useMemo(() => {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    // Créer l'instance du SDK
    const sdkInstance = createAlloKoliSDKWithSupabase(projectId);
    
    // Écouter les changements d'authentification et mettre à jour le token
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.access_token) {
        sdkInstance.setAuthToken(session.access_token);
      }
    });
    
    // Récupérer la session actuelle si elle existe
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.access_token) {
        sdkInstance.setAuthToken(session.access_token);
      }
    });
    
    return sdkInstance;
  }, []);
  
  return sdk;
}

/**
 * Hook pour obtenir la configuration actuelle du SDK
 * 
 * @param sdk - Instance du SDK AlloKoli
 * @returns Configuration du SDK (sans le token d'authentification)
 */
export function useSDKConfig(sdk: AlloKoliSDK) {
  return useMemo(() => sdk.getConfig(), [sdk]);
}

export default useAlloKoliSDK; 