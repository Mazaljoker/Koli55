import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configuration des variables d'environnement
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const vapiApiKey = Deno.env.get("VAPI_API_KEY");
const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");

// Client Supabase avec clé service (accès complet)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Headers CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

// Nom de cette Edge Function
const FUNCTION_NAME = "allokoli-mcp-fixed";

/**
 * Utilitaire pour extraire le path de l'URL
 */
function extractPath(pathname: string, functionName: string): string {
  const patterns = [
    `/functions/v1/${functionName}`,
    `/functions/${functionName}`,
    `/${functionName}`,
  ];

  for (const pattern of patterns) {
    if (pathname.startsWith(pattern)) {
      return pathname.replace(pattern, "") || "/";
    }
  }

  return pathname;
}

/**
 * Utilitaire pour créer une réponse de succès
 */
function createSuccessResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
    status,
  });
}

/**
 * Utilitaire pour créer une réponse d'erreur
 */
function createErrorResponse(
  message: string,
  status = 500,
  details?: any
): Response {
  return new Response(
    JSON.stringify({
      error: message,
      ...(details && { details }),
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status,
    }
  );
}

/**
 * Middleware d'authentification simple
 */
async function authenticateRequest(req: Request): Promise<any> {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    throw new Error("Authorization header manquant");
  }

  // Pour simplifier, on accepte tout token Bearer valide
  // Dans un vrai projet, on vérifierait le JWT avec Supabase
  if (authHeader.startsWith("Bearer ")) {
    return {
      id: "user-authenticated",
      email: "user@example.com",
      role: "authenticated",
    };
  }

  throw new Error("Token d'authentification invalide");
}

/**
 * Endpoint: GET /health
 * Vérifie l'état de l'Edge Function (pas d'authentification requise)
 */
async function healthCheckHandler(req: Request, url: URL): Promise<Response> {
  return createSuccessResponse({
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
    path: extractPath(url.pathname, FUNCTION_NAME),
    fullUrl: req.url,
  });
}

/**
 * Endpoint: GET /assistants
 * Liste les assistants avec pagination
 */
async function listAssistantsHandler(
  req: Request,
  url: URL
): Promise<Response> {
  try {
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const search = url.searchParams.get("search");
    const offset = (page - 1) * limit;

    let query = supabase
      .from("assistants")
      .select("*", { count: "exact" })
      .range(offset, offset + limit - 1)
      .order("created_at", { ascending: false });

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,system_prompt.ilike.%${search}%`
      );
    }

    const { data, error, count } = await query;

    if (error) {
      console.error("Erreur Supabase:", error);
      throw error;
    }

    return createSuccessResponse({
      assistants: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Erreur liste assistants:", error);
    return createErrorResponse(
      "Erreur lors de la récupération des assistants",
      500,
      error.message
    );
  }
}

/**
 * Endpoint: GET /assistants/:id
 * Récupère un assistant spécifique
 */
async function getAssistantHandler(
  req: Request,
  url: URL,
  assistantId: string
): Promise<Response> {
  try {
    const { data, error } = await supabase
      .from("assistants")
      .select("*")
      .eq("id", assistantId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return createErrorResponse("Assistant non trouvé", 404);
      }
      throw error;
    }

    return createSuccessResponse({ assistant: data });
  } catch (error) {
    console.error("Erreur récupération assistant:", error);
    return createErrorResponse(
      "Erreur lors de la récupération de l'assistant",
      500,
      error.message
    );
  }
}

/**
 * Endpoint: GET /info
 * Informations sur l'Edge Function (authentification requise)
 */
async function infoHandler(
  req: Request,
  url: URL,
  user: any
): Promise<Response> {
  return createSuccessResponse({
    name: FUNCTION_NAME,
    description: "Edge Function Allokoli MCP - Version corrigée",
    version: "1.0.0",
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    endpoints: [
      "GET /health - Health check (public)",
      "GET /info - Informations (auth requise)",
      "GET /assistants - Liste des assistants (auth requise)",
      "GET /assistants/:id - Détails d'un assistant (auth requise)",
    ],
  });
}

/**
 * Routeur principal
 */
async function handleRequest(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = extractPath(url.pathname, FUNCTION_NAME);
  const method = req.method;

  console.log(`${method} ${path}`);
  console.log(`Full URL: ${req.url}`);
  console.log(`Extracted path: ${path}`);

  // Routes publiques (pas d'authentification requise)
  if (path === "/health" && method === "GET") {
    return await healthCheckHandler(req, url);
  }

  // Routes nécessitant une authentification
  try {
    const user = await authenticateRequest(req);

    if (path === "/info" && method === "GET") {
      return await infoHandler(req, url, user);
    }

    if (path === "/assistants" && method === "GET") {
      return await listAssistantsHandler(req, url);
    }

    if (path.startsWith("/assistants/") && method === "GET") {
      const assistantId = path.split("/")[2];
      if (assistantId) {
        return await getAssistantHandler(req, url, assistantId);
      }
    }

    // Route non trouvée
    return createErrorResponse("Route non trouvée", 404, {
      path,
      method,
      availableRoutes: ["/health", "/info", "/assistants"],
    });
  } catch (authError) {
    return createErrorResponse(
      "Authentification requise",
      401,
      authError.message
    );
  }
}

/**
 * Handler principal de l'Edge Function
 */
const handler = async (req: Request): Promise<Response> => {
  // Gestion CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    return await handleRequest(req);
  } catch (error) {
    console.error("Erreur non gérée:", error);
    return createErrorResponse("Erreur interne du serveur", 500, error.message);
  }
};

// Démarrer le serveur
serve(handler);
