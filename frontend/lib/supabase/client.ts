'use client';

import { createClient } from '@supabase/supabase-js';

// URL et clé pour l'instance Supabase Cloud
// L'application utilise exclusivement Supabase Cloud (pas de version locale)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction pour vérifier la connexion à Supabase
export async function checkSupabaseConnection() {
  try {
    // Tester une requête simple qui ne dépend pas d'une table spécifique
    const { error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Erreur d\'authentification Supabase:', authError);
      return { success: false, error: authError };
    }

    // Si la requête d'authentification a réussi, essayons maintenant une requête sur une table
    // Utilisons une requête ping qui ne dépend pas de l'existence d'une table spécifique
    try {
      // On essaie health_check, mais si elle n'existe pas, ce n'est pas grave
      const { data, error } = await supabase.from('health_check').select('*').limit(1);
      
      if (error) {
        // Si l'erreur est une table inexistante, on peut considérer que Supabase est connecté
        if (error.code === 'PGRST116') {
          console.info('La table health_check n\'existe pas, mais la connexion à Supabase fonctionne');
          return { success: true };
        }
        
        // Autres types d'erreurs
        console.error('Erreur lors de la requête à Supabase:', error);
        return { success: false, error };
      }
      
      return { success: true, data };
    } catch (tableErr) {
      // Même si on a une erreur sur la table, la connexion fonctionne si on a passé la vérification d'auth
      console.warn('Erreur sur la table, mais connexion Supabase établie:', tableErr);
      return { success: true, warning: 'Table inaccessible mais connexion établie' };
    }
    
  } catch (err) {
    console.error('Exception lors de la vérification de connexion Supabase:', err);
    return { success: false, error: err };
  }
} 