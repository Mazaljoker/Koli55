import { createClient } from '@supabase/supabase-js';

// Utiliser des variables d'environnement pour les informations d'authentification
// Pour le backend, on utilise les variables sans NEXT_PUBLIC_
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// Vérifier que les variables d'environnement sont définies
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('ERREUR: Variables d\'environnement SUPABASE_URL et SUPABASE_ANON_KEY non définies');
}

// Mode démo complètement désactivé - toujours utiliser les données réelles
const isBrowser = typeof window !== 'undefined';

// Définir le mode démo à FALSE de façon permanente
let forceDemoMode = false;
let forceProductionMode = true;

// Désactiver toute possibilité d'utiliser le mode démo
if (isBrowser) {
  // Forcer le mode production dans le localStorage
  localStorage.setItem('koli55_demo_mode', 'false');
}

// Toujours utiliser les données réelles
const useDemoData = false;

// Déterminer si nous sommes en environnement de développement local
const isDevelopment = isBrowser && window.location.hostname === 'localhost';

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

// Si nous sommes en mode développement, modifier l'URL des fonctions
// Cette approche permet de contourner l'erreur TypeScript sans changer les types
if (isDevelopment) {
  // @ts-ignore - Techniquement non typé mais fonctionne en réalité
  supabase.functions.url = 'http://127.0.0.1:54321/functions/v1';
}

// Exporter une constante indiquant qu'on doit toujours utiliser les données réelles
export const USE_DEMO_DATA = useDemoData;

// Fonction pour basculer le mode démo - désactivée pour forcer le mode production
export function toggleDemoMode(enable?: boolean): boolean {
  if (!isBrowser) {
    console.log("[toggleDemoMode] Mode démo désactivé par configuration");
    return false;
  }
  
  console.log("[toggleDemoMode] Mode démo désactivé par configuration");
  
  // Toujours retourner false car le mode démo est désactivé
  return false;
}

// Log pour le debugging (côté client uniquement)
if (isBrowser) {
  console.log(`[Supabase Client] Mode production activé, données réelles utilisées`);
  if (isDevelopment) {
    console.log(`[Supabase Client] Utilisation des fonctions Edge locales: http://127.0.0.1:54321/functions/v1`);
  }
}

export default supabase; 