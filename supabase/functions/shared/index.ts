/**
 * Ce fichier est nécessaire pour déployer les modules partagés comme une fonction Supabase.
 * Il expose les modules du dossier shared pour qu'ils puissent être utilisés par d'autres fonctions.
 */

// @ts-nocheck - Ignorer toutes les erreurs TypeScript car ce fichier s'exécute dans un environnement Deno

// Les importations avec les extensions .ts sont nécessaires pour Deno
// mais peuvent causer des erreurs dans l'environnement de développement TypeScript standard
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS'
};

// Exporter tous les modules pour qu'ils soient disponibles aux autres fonctions
export { corsHeaders }

// Types Deno (qui seront disponibles dans l'environnement d'exécution Supabase Edge Functions)
interface Request {
  method: string;
  [key: string]: any;
}

// Gestionnaire simple pour la fonction shared
Deno.serve(async (req) => {
  // Gérer les requêtes CORS pre-flight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Réponse informative pour indiquer que cette fonction est un module partagé
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Shared modules repository. Import these modules in other functions, do not call directly.',
        modules: ['auth', 'cors', 'errors', 'validation', 'vapi']
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
}) 