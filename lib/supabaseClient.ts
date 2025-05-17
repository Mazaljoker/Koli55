import { createClient } from '@supabase/supabase-js';

// Informations d'authentification Supabase
const supabaseUrl = 'https://aiurboizarbbcpynmmgv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM';

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
      // @ts-ignore - Ajout manuel du timeout qui n'est pas dans le type standard
      options.timeout = 8000; // 8 secondes de timeout
      return fetch(url, options);
    }
  }
});

// Exporter une constante indiquant si on doit utiliser les données de démo
export const USE_DEMO_DATA = useDemoData;

export default supabase; 