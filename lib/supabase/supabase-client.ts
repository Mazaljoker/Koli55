import { createClient } from '@supabase/supabase-js';

// Récupération des variables d'environnement pour Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Création et export du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction utilitaire pour vérifier l'état de l'authentification
export const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}; 