import { createClient } from '@supabase/supabase-js';

// Utiliser des variables d'environnement pour les informations d'authentification
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Les variables d\'environnement NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être définies');
}

// Déterminer si les données de démo doivent être utilisées
const useDemoData = typeof window !== 'undefined' && 
  (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost');

// Création du client Supabase avec des options supplémentaires pour le debug
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: (...args) => {
      // Ajouter un timeout aux requêtes fetch
      const [url, options] = args;
      // @ts-expect-error - Ajout manuel du timeout qui n'est pas dans le type standard
      options.timeout = 8000; // 8 secondes de timeout
      return fetch(url, options);
    }
  }
});

// Exporter une constante indiquant si on doit utiliser les données de démo
export const USE_DEMO_DATA = useDemoData;

export default supabase; 