/**
 * Edge Function flexible avec meilleure gestion des routes et de l'authentification
 *
 * Cet exemple montre comment créer une Edge Function robuste avec:
 * - Gestion flexible des chemins d'URL (différents formats Supabase)
 * - Système d'authentification avancé (JWT, API Key, mode test)
 * - Routage des requêtes simplifié
 * - Gestion des erreurs standardisée
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "./shared/cors.ts";
import {
  EdgeRouter,
  loggerMiddleware,
  testModeMiddleware,
} from "./shared/edge-router.ts";
import {
  extractPathInfo,
  isPathForFunction,
} from "./shared/path-normalizer.ts";
import { AuthType, authenticateUser } from "./shared/auth-utils.ts";
import {
  createSuccessResponse,
  createErrorResponse,
} from "./shared/response-helpers.ts";
import { errorResponse } from "./shared/errors.ts";

// Nom de cette Edge Function
const FUNCTION_NAME = "flexible-edge-function";

// Configuration Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Variables d'environnement additionnelles
const vapiApiKey = Deno.env.get("VAPI_API_KEY");
const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");

/**
 * Endpoint: GET /health
 * Vérifie l'état de l'Edge Function et des services externes
 */
async function healthCheckHandler(req: Request, url: URL) {
  return new Response(
    JSON.stringify({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      functionName: FUNCTION_NAME,
      environment: {
        hasVapiKey: !!vapiApiKey,
        hasTwilioCredentials: !!(twilioAccountSid && twilioAuthToken),
        supabaseUrl: !!supabaseUrl,
        supabaseServiceKey: !!supabaseServiceKey,
      },
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    }
  );
}

/**
 * Endpoint: GET /info
 * Retourne des informations sur l'Edge Function (authentification requise)
 */
async function infoHandler(req: Request, url: URL, user: any) {
  return createSuccessResponse({
    name: FUNCTION_NAME,
    description:
      "Edge Function flexible avec meilleure gestion des routes et de l'authentification",
    version: "1.0.0",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    pathInfo: extractPathInfo(url.pathname, FUNCTION_NAME),
  });
}

/**
 * Endpoint: POST /echo
 * Echo des données reçues en entrée (debug)
 */
async function echoHandler(req: Request, url: URL) {
  try {
    const body = await req.json();

    return createSuccessResponse({
      echo: body,
      method: req.method,
      url: req.url,
      headers: Object.fromEntries(req.headers.entries()),
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return createErrorResponse("Erreur lors du traitement de la requête", 400);
  }
}

/**
 * Endpoint: GET /test-auth
 * Teste différents modes d'authentification
 */
async function testAuthHandler(req: Request, url: URL) {
  // Authentification avec JWT standard
  try {
    const userJwt = await authenticateUser(req, {
      authType: AuthType.JWT,
      allowTestMode: true,
    });

    return createSuccessResponse({
      authMethod: "jwt",
      user: userJwt,
    });
  } catch (jwtError) {
    // Si JWT échoue, essayer avec API Key
    try {
      const userApiKey = await authenticateUser(req, {
        authType: AuthType.API_KEY,
        allowTestMode: true,
      });

      return createSuccessResponse({
        authMethod: "api_key",
        user: userApiKey,
      });
    } catch (apiKeyError) {
      // Si tout échoue, retourner l'erreur
      return errorResponse(apiKeyError);
    }
  }
}

// Création du routeur
const router = new EdgeRouter();

// Ajout des middlewares globaux
router.use(loggerMiddleware());
router.use(testModeMiddleware());

// Configuration des routes
router.get("/health", healthCheckHandler, false); // Pas d'authentification requise
router.get("/info", infoHandler, true); // Authentification requise
router.post("/echo", echoHandler, false); // Pas d'authentification requise
router.get("/test-auth", testAuthHandler, false); // Test d'authentification

/**
 * Handler principal de l'Edge Function
 */
const handler = async (req: Request): Promise<Response> => {
  // Gestion CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const url = new URL(req.url);

    // Vérifier si cette requête est destinée à cette fonction
    if (!isPathForFunction(url.pathname, FUNCTION_NAME)) {
      return new Response(
        JSON.stringify({ error: "Edge Function non trouvée" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Traiter la requête avec le routeur
    return await router.handleRequest(req);
  } catch (error) {
    console.error("Erreur non gérée:", error);
    return createErrorResponse("Erreur interne du serveur", 500);
  }
};

// Démarrer le serveur
serve(handler);
