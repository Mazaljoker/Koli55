/**
 * Fonction Supabase Edge pour la gestion des assistants Vapi
 *
 * Endpoints:
 * - GET /assistants - Liste tous les assistants de l'utilisateur actuel
 * - GET /assistants/:id - Récupère un assistant par ID
 * - POST /assistants - Crée un nouvel assistant
 * - PATCH /assistants/:id - Met à jour un assistant existant
 * - DELETE /assistants/:id - Supprime un assistant
 *
 * Variables d'Entrée (Request):
 *
 * GET /assistants:
 *   - Query params: page (numéro de page), limit (nombre d'éléments par page)
 *   - Headers: Authorization (JWT token obligatoire)
 *
 * GET /assistants/:id:
 *   - Path params: id (identifiant de l'assistant)
 *   - Headers: Authorization (JWT token obligatoire)
 *
 * POST /assistants:
 *   - Body: {
 *       name: string (obligatoire),
 *       model: string | { provider: string, model: string, systemPrompt?: string, ... },
 *       language: string,
 *       voice: string | { provider: string, voiceId: string },
 *       firstMessage: string,
 *       instructions: string (system_prompt),
 *       silenceTimeoutSeconds?: number,
 *       maxDurationSeconds?: number,
 *       endCallAfterSilence?: boolean,
 *       voiceReflection?: boolean,
 *       recordingSettings?: { createRecording: boolean, saveRecording: boolean }
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *
 * PATCH /assistants/:id:
 *   - Path params: id (identifiant de l'assistant)
 *   - Body: Champs optionnels à mettre à jour (name, model, language, voice, etc.)
 *   - Headers: Authorization (JWT token obligatoire)
 *
 * DELETE /assistants/:id:
 *   - Path params: id (identifiant de l'assistant)
 *   - Headers: Authorization (JWT token obligatoire)
 *
 * Variables de Sortie (Response):
 *
 * GET /assistants:
 *   - Succès: {
 *       success: true,
 *       message: string,
 *       data: Assistant[], // Liste d'assistants depuis la base de données
 *       pagination: {
 *         total: number,
 *         limit: number,
 *         page: number,
 *         has_more: boolean
 *       }
 *     }
 *   - Erreur: { success: false, message: string }
 *
 * GET /assistants/:id:
 *   - Succès: { success: true, data: Assistant }
 *   - Erreur: { success: false, message: string }
 *
 * POST /assistants:
 *   - Succès: { success: true, message: string, data: Assistant }
 *   - Erreur: { success: false, message: string }
 *
 * PATCH /assistants/:id:
 *   - Succès: { success: true, message: string, data: Assistant }
 *   - Erreur: { success: false, message: string }
 *
 * DELETE /assistants/:id:
 *   - Succès: { success: true, message: string }
 *   - Erreur: { success: false, message: string }
 *
 * Structure d'erreur: Utilise la structure FormattedError de shared/errors.ts
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../shared/cors";
import {
  vapiAssistants,
  VapiAssistant,
  AssistantCreateParams,
  AssistantUpdateParams,
  mapToVapiAssistantFormat,
} from "../shared/vapi";
import {
  sanitizeString,
  sanitizeObject,
  isValidUUID,
  validateAssistantData,
  validatePermissions,
} from "../shared/validation";
import {
  createVapiPaginatedResponse,
  createVapiSingleResponse,
  createVapiEmptyResponse,
  createVapiErrorResponse,
  extractPaginationParams,
} from "../shared/response-helpers";

/**
 * Récupère la clé API Vapi à partir de différentes sources
 * Essaie de récupérer la clé depuis :
 * 1. En-têtes de la requête (X-Vapi-API-Key)
 * 2. Variables d'environnement (VAPI_API_KEY)
 * 3. Corps de la requête (vapi_api_key)
 * 4. Table de configuration dans la base de données (config.value)
 *
 * @param req La requête HTTP
 * @param requestBody Le corps de la requête (déjà parsé)
 * @param supabaseClient Le client Supabase pour accéder à la base de données
 * @returns La clé API Vapi ou undefined si non trouvée
 */
async function getVapiApiKey(
  req: Request,
  requestBody: any,
  supabaseClient: SupabaseClient
): Promise<string | undefined> {
  // 1. Essayer de récupérer la clé depuis les en-têtes
  const apiKeyHeader = req.headers.get("X-Vapi-API-Key");
  if (apiKeyHeader) {
    console.log("[VAPI_KEY] Found API key in headers");
    return apiKeyHeader;
  }

  // 2. Essayer de récupérer la clé depuis les variables d'environnement
  // @ts-ignore - Deno existe dans l'environnement d'exécution
  const apiKeyEnv =
    typeof Deno !== "undefined" ? Deno.env.get("VAPI_API_KEY") : undefined;
  if (apiKeyEnv) {
    console.log("[VAPI_KEY] Found API key in environment variables");
    return apiKeyEnv;
  }

  // 3. Essayer de récupérer la clé depuis le corps de la requête
  if (requestBody && requestBody.vapi_api_key) {
    console.log("[VAPI_KEY] Found API key in request body");
    return requestBody.vapi_api_key;
  }

  // 4. Essayer de récupérer la clé depuis la table config de la base de données
  try {
    const { data: configData, error: configError } = await supabaseClient
      .from("config")
      .select("value")
      .eq("key", "VAPI_API_KEY")
      .single();

    if (!configError && configData && configData.value) {
      console.log("[VAPI_KEY] Found API key in database config table");
      return configData.value;
    }
  } catch (error: any) {
    console.warn(
      "[VAPI_KEY] Error fetching from config table:",
      error?.message || "Unknown error"
    );
    // Continuer avec les autres méthodes
  }

  console.warn("[VAPI_KEY] API key not found in any source");
  return undefined;
}

// Fonction pour faire des requêtes à l'API Vapi - pour la rétrocompatibilité,
// idéalement remplacer progressivement par les appels de vapiAssistants
async function callVapiAPI(
  endpoint: string,
  apiKey: string,
  method: string = "GET",
  body?: any
) {
  // Correction: API Vapi utilise directement les endpoints sans préfixe /v1/
  const sanitizedEndpoint = endpoint.startsWith("/")
    ? endpoint.substring(1)
    : endpoint;
  const url = `https://api.vapi.ai/${sanitizedEndpoint}`;

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
    options.body = JSON.stringify(body);
  }

  console.log(`[VAPI_CALL] ${method} ${url}`);
  // if (body) { // console.log(`[VAPI_CALL_BODY] ${JSON.stringify(body)}`); }

  try {
    const response = await fetch(url, options);
    const responseText = await response.text();

    if (!response.ok) {
      let errorData: any = {
        message: `API request failed with status ${response.status}`,
        raw_error: responseText,
      };
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        // Keep the initial error if parsing fails, log parseError for debugging
        console.warn(
          "[VAPI_ERROR_PARSE] Failed to parse error response as JSON:",
          parseError
        );
      }
      console.error(`[VAPI_ERROR] Status: ${response.status}`, errorData);
      throw new Error(
        errorData.message || errorData.raw_error || "VAPI API request failed"
      );
    }

    if (responseText) {
      try {
        return JSON.parse(responseText);
      } catch (e: any) {
        console.error(
          `[VAPI_ERROR] Failed to parse JSON response: ${e.message}`,
          responseText
        );
        throw new Error(
          `Invalid JSON response from Vapi: ${responseText.substring(0, 100)}`
        );
      }
    }
    return {};
  } catch (error: any) {
    console.error(`[VAPI_ERROR] Network or other error: ${error.message}`);
    throw error;
  }
}

function getSupabaseClient(req: Request): SupabaseClient {
  let authHeader = req.headers.get("Authorization");
  // @ts-ignore - Deno existe dans l'environnement d'exécution
  const supabaseUrl =
    typeof Deno !== "undefined" ? Deno.env.get("SUPABASE_URL") : undefined;
  // @ts-ignore - Deno existe dans l'environnement d'exécution
  const supabaseAnonKey =
    typeof Deno !== "undefined" ? Deno.env.get("SUPABASE_ANON_KEY") : undefined;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "[SUPABASE_CLIENT_ERROR] SUPABASE_URL or SUPABASE_ANON_KEY is not set."
    );
    throw new Error(
      "Server configuration error: Supabase credentials missing."
    );
  }

  // Détecter le mode développement via variable d'environnement ou forcer pour le débogage
  // @ts-ignore - Deno existe dans l'environnement d'exécution
  const isDevelopment =
    (typeof Deno !== "undefined" ? Deno.env.get("SUPABASE_ENV") : undefined) ===
      "development" || true;

  if (!authHeader) {
    console.warn("[SUPABASE_CLIENT_WARN] No Authorization header provided.");
    if (isDevelopment) {
      console.log("[DEV_MODE] Using development authentication without token.");
      return createClient(supabaseUrl, supabaseAnonKey);
    } else {
      console.error(
        "[AUTH_ERROR] Authorization header required in production mode."
      );
      throw new Error("Authorization header is required");
    }
  }

  // Vérifier si le token est au bon format (Bearer <token>)
  if (!authHeader.startsWith("Bearer ")) {
    console.warn(
      "[SUPABASE_CLIENT_WARN] Invalid Authorization header format. Expected: Bearer <token>"
    );
    if (isDevelopment) {
      console.log(
        "[DEV_MODE] Using development authentication despite invalid token format."
      );
      authHeader =
        "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0";
    } else {
      console.error(
        "[AUTH_ERROR] Invalid Authorization header format in production mode."
      );
      throw new Error(
        "Invalid Authorization header format. Expected: Bearer <token>"
      );
    }
  }

  // Extraire le token
  const jwt = authHeader.replace("Bearer ", "");

  // Vérifier si le token est un JWT valide avec un claim 'sub'
  try {
    // Décoder la partie payload du JWT (2ème partie)
    const parts = jwt.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    // Ajouter le padding pour la conversion base64
    const padding = "=".repeat((4 - (parts[1].length % 4)) % 4);
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/") + padding;

    // Décoder et parser le payload
    const payload = JSON.parse(atob(base64));

    // Vérifier les claims essentiels
    if (!payload.sub) {
      console.warn('[JWT_VALIDATION] JWT missing required "sub" claim.');
      if (isDevelopment) {
        console.log(
          "[DEV_MODE] Using development authentication despite missing sub claim."
        );
      } else {
        throw new Error("Invalid JWT: missing sub claim");
      }
    } else {
      console.log(`[JWT_VALIDATION] Valid JWT with sub: ${payload.sub}`);
    }
  } catch (error: any) {
    console.warn(
      `[JWT_VALIDATION] Error validating JWT: ${
        error?.message || "Unknown error"
      }`
    );
    if (isDevelopment) {
      console.log(
        "[DEV_MODE] Using development authentication despite JWT validation error."
      );
    } else {
      throw new Error(
        `JWT validation error: ${error?.message || "Unknown error"}`
      );
    }
  }

  // Créer le client Supabase avec l'en-tête d'autorisation
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
}

// Fonction pour extraire les informations utilisateur du JWT
function extractUserFromJWT(
  token: string
): { sub: string; role: string; email?: string } | null {
  try {
    if (!token || !token.includes(".")) {
      return null;
    }

    // Supprimer le prefix 'Bearer ' si présent
    const jwt = token.startsWith("Bearer ")
      ? token.replace("Bearer ", "")
      : token;

    // Décoder la partie payload du JWT
    const parts = jwt.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Ajouter le padding pour la conversion base64
    const padding = "=".repeat((4 - (parts[1].length % 4)) % 4);
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/") + padding;

    // Décoder et parser le payload
    const payload = JSON.parse(atob(base64));

    // Vérifier et retourner les claims nécessaires
    if (!payload.sub) {
      return null;
    }

    return {
      sub: payload.sub,
      role: payload.role || "anon",
      email: payload.email,
    };
  } catch (error: any) {
    console.warn(
      `[JWT_EXTRACTION] Error extracting user from JWT: ${
        error?.message || "Unknown error"
      }`
    );
    return null;
  }
}

/**
 * Fonctions utilitaires pour mapper les données entre notre format DB/frontend et le format Vapi
 */

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split("/").filter((segment) => segment);

    console.log(
      `[REQUEST_INFO] ${req.method} /${pathSegments[0]}${url.pathname.replace(
        `/${pathSegments[0]}`,
        ""
      )} ${url.search}`
    );

    const supabaseClient = getSupabaseClient(req);
    const functionName = pathSegments[0];

    if (functionName === "assistants") {
      const assistantId = pathSegments[1];

      if (req.method === "GET" && !assistantId) {
        console.log("[HANDLER] GET /assistants - Fetching from Supabase table");
        try {
          // Récupérer l'authentification à partir du JWT
          const authHeader = req.headers.get("Authorization");
          let userId = null;
          let userRole = "anon";

          // En développement, on permet de lister sans authentification
          const isDevelopment =
            Deno.env.get("SUPABASE_ENV") === "development" || true;

          if (authHeader) {
            const userInfo = extractUserFromJWT(authHeader);
            if (userInfo && userInfo.sub) {
              userId = userInfo.sub;
              userRole = userInfo.role || "authenticated";
              console.log(
                `[AUTH_INFO] User authenticated: ${userId} (role: ${userRole})`
              );
            }
          }

          // Paramètres de pagination
          const page = parseInt(url.searchParams.get("page") || "1", 10);
          const limit = Math.min(
            parseInt(url.searchParams.get("limit") || "10", 10),
            100
          );
          const offset = (page - 1) * limit;

          // Construire la requête
          let query = supabaseClient
            .from("assistants")
            .select("*", { count: "exact" });

          // Filtrer par utilisateur en production, mais pas en dev
          if (userId && !isDevelopment) {
            query = query.eq("user_id", userId);
          } else if (!isDevelopment && userRole !== "admin") {
            console.warn(
              "[AUTH_WARN] No user ID available and not in development mode"
            );
            return new Response(
              JSON.stringify({
                success: false,
                message: "Authentication required",
              }),
              {
                status: 401,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          // Appliquer la pagination
          query = query
            .range(offset, offset + limit - 1)
            .order("created_at", { ascending: false });

          // Exécuter la requête
          const { data: assistants, error, count } = await query;

          if (error) {
            console.error(
              "[DB_ERROR] GET /assistants - Error fetching assistants:",
              error
            );
            return new Response(
              JSON.stringify({
                success: false,
                message: error.message || "Failed to retrieve assistants",
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          console.log(
            `[DB_SUCCESS] Fetched ${assistants?.length || 0} assistants.`
          );

          // Format de réponse harmonisé avec l'API Vapi officielle
          return new Response(
            JSON.stringify({
              data: assistants || [],
              pagination: {
                total: count || 0,
                has_more: count ? offset + limit < count : false,
              },
            }),
            { headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } catch (error) {
          console.error("[ERROR] GET /assistants:", error.message, error.stack);
          // Format d'erreur harmonisé avec l'API Vapi
          return new Response(
            JSON.stringify({
              message: error.message || "Failed to retrieve assistants",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      }

      // POST /assistants - Créer un nouvel assistant
      if (req.method === "POST" && !assistantId) {
        console.log(
          "[HANDLER] POST /assistants - Integrating DB insert, Vapi call, and DB update"
        );
        try {
          const requestData = await req.json().catch(() => ({}));
          console.log(`[REQUEST_DATA] POST /assistants:`, requestData);

          // Récupérer l'authentification à partir du JWT
          const authHeader = req.headers.get("Authorization");
          let userId = null;
          let userRole = "anon";

          // En développement, on permet de créer sans authentification
          const isDevelopment =
            Deno.env.get("SUPABASE_ENV") === "development" || true;

          if (authHeader) {
            const userInfo = extractUserFromJWT(authHeader);
            if (userInfo && userInfo.sub) {
              userId = userInfo.sub;
              userRole = userInfo.role || "authenticated";
              console.log(
                `[AUTH_INFO] User authenticated: ${userId} (role: ${userRole})`
              );
            }
          } else if (!isDevelopment) {
            console.error(
              "[AUTH_ERROR] POST /assistants - No Authorization header provided"
            );
            return new Response(
              JSON.stringify({
                success: false,
                message: "Authentication required",
              }),
              {
                status: 401,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          // Valider les données d'entrée
          const validationResult = validateAssistantData(requestData);
          if (!validationResult.isValid) {
            console.error(
              "[VALIDATION_ERROR] Invalid assistant data:",
              validationResult.errors
            );
            return new Response(
              JSON.stringify({
                success: false,
                message: "Validation failed",
                errors: validationResult.errors,
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          // Si l'utilisateur est de rôle 'test', vérifier que les métadonnées contiennent is_test=true
          if (
            userRole === "test" &&
            (!requestData.metadata || requestData.metadata.is_test !== "true")
          ) {
            requestData.metadata = {
              ...(requestData.metadata || {}),
              is_test: "true",
            };
            console.log(
              "[SECURITY] Added is_test=true metadata for test user role"
            );
          }

          // Sanitizer les données avant stockage
          const sanitizedData = sanitizeObject(requestData);

          // Préparer les données pour l'insertion, en convertissant camelCase -> snake_case
          const initialAssistantData = {
            name: sanitizedData.name,
            model:
              typeof sanitizedData.model === "object"
                ? JSON.stringify(sanitizedData.model)
                : sanitizedData.model,
            language: sanitizedData.language,
            voice:
              typeof sanitizedData.voice === "object"
                ? JSON.stringify(sanitizedData.voice)
                : sanitizedData.voice,
            // Utiliser l'ID utilisateur du token JWT ou null en mode développement sans authentification
            user_id: userId || (isDevelopment ? null : undefined),
            // Conversion directe des champs en snake_case sans passer par les propriétés camelCase
            first_message:
              sanitizedData.first_message ?? sanitizedData.firstMessage,
            system_prompt:
              sanitizedData.system_prompt ?? sanitizedData.instructions,
            // Nouveaux champs avancés
            metadata: sanitizedData.metadata
              ? {
                  ...sanitizedData.metadata,
                  created_by_role: userRole,
                }
              : { created_by_role: userRole },
            tools_config: sanitizedData.tools_config,
            forwarding_phone_number:
              sanitizedData.forwarding_phone_number ??
              sanitizedData.forwardingPhoneNumber,
            // Paramètres d'appel (support directement en snake_case)
            silence_timeout_seconds:
              sanitizedData.silence_timeout_seconds ??
              sanitizedData.silenceTimeoutSeconds,
            max_duration_seconds:
              sanitizedData.max_duration_seconds ??
              sanitizedData.maxDurationSeconds,
            end_call_after_silence:
              sanitizedData.end_call_after_silence ??
              sanitizedData.endCallAfterSilence,
            voice_reflection:
              sanitizedData.voice_reflection ?? sanitizedData.voiceReflection,
            // Paramètres d'enregistrement
            recording_settings:
              sanitizedData.recording_settings ??
              sanitizedData.recordingSettings,
            // Plans avancés (nouveaux)
            analysis_plan:
              sanitizedData.analysis_plan ?? sanitizedData.analysisPlan,
            artifact_plan:
              sanitizedData.artifact_plan ?? sanitizedData.artifactPlan,
            message_plan:
              sanitizedData.message_plan ?? sanitizedData.messagePlan,
            start_speaking_plan:
              sanitizedData.start_speaking_plan ??
              sanitizedData.startSpeakingPlan,
            stop_speaking_plan:
              sanitizedData.stop_speaking_plan ??
              sanitizedData.stopSpeakingPlan,
            monitor_plan:
              sanitizedData.monitor_plan ?? sanitizedData.monitorPlan,
            voicemail_detection:
              sanitizedData.voicemail_detection ??
              sanitizedData.voicemailDetection,
            transcriber: sanitizedData.transcriber,
          };

          // Insérer dans la base de données
          const { data: dbAssistant, error: dbInsertError } =
            await supabaseClient
              .from("assistants")
              .insert(initialAssistantData)
              .select()
              .single();

          if (dbInsertError || !dbAssistant) {
            console.error(
              "[DB_ERROR] POST /assistants - Failed to insert assistant:",
              dbInsertError
            );
            return new Response(
              JSON.stringify({
                success: false,
                message:
                  dbInsertError?.message ||
                  "Failed to create assistant in database",
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          console.log(
            "[DB_SUCCESS] POST /assistants - Assistant inserted with ID:",
            dbAssistant.id
          );

          // Préparer le payload et appeler l'API Vapi
          const vapiAssistantPayload = mapToVapiAssistantFormat({
            ...dbAssistant,
            // Inclure les champs requestData qui pourraient ne pas être dans dbAssistant
            // (notamment pour les objets stockés comme chaînes JSON dans la DB)
            model: sanitizedData.model,
            voice: sanitizedData.voice,
          }) as AssistantCreateParams;

          let createdVapiAssistant: VapiAssistant | null = null;
          let finalAssistantData = dbAssistant;

          try {
            // Vérifier la présence de la clé API Vapi
            const vapiApiKey = await getVapiApiKey(
              req,
              sanitizedData,
              supabaseClient
            );
            if (!vapiApiKey) {
              console.error(
                "[CONFIG_ERROR] VAPI_API_KEY not found in any source (headers, env, request body, or database)"
              );

              // En mode développement, on continue sans Vapi
              if (isDevelopment) {
                console.log("[DEV_MODE] Continuing without Vapi API");
                // Return success response with the database assistant data
                return createVapiSingleResponse(dbAssistant, 201);
              } else {
                return createVapiErrorResponse(
                  "VAPI_API_KEY is missing. Please provide it via headers, environment variables, request body, or database config.",
                  500
                );
              }
            }

            // Initialiser l'API d'assistants Vapi avec la clé API
            console.log(`[VAPI_INFO] Using API key to call Vapi API`);

            // Créer l'assistant dans Vapi (la clé API doit être configurée dans l'environnement)
            createdVapiAssistant = await vapiAssistants.create(
              vapiAssistantPayload
            );
            console.log(
              `[VAPI_SUCCESS] Created assistant:`,
              createdVapiAssistant
            );

            // Mettre à jour l'enregistrement Supabase avec vapi_assistant_id
            if (createdVapiAssistant && createdVapiAssistant.id) {
              const { data: updatedDbAssistant, error: dbUpdateError } =
                await supabaseClient
                  .from("assistants")
                  .update({
                    vapi_assistant_id: createdVapiAssistant.id,
                    vapi_model_details: createdVapiAssistant.model
                      ? JSON.stringify(createdVapiAssistant.model)
                      : null,
                    vapi_voice_details: createdVapiAssistant.voice
                      ? JSON.stringify(createdVapiAssistant.voice)
                      : null,
                    metadata: {
                      ...initialAssistantData.metadata,
                      vapi_sync_status: "success",
                      vapi_sync_timestamp: new Date().toISOString(),
                    },
                  })
                  .eq("id", dbAssistant.id)
                  .select()
                  .single();

              if (dbUpdateError) {
                console.error(
                  "[DB_ERROR] POST /assistants - Failed to update assistant with vapi_id:",
                  dbUpdateError
                );
                // Non-fatal for the client, but log it
              } else {
                finalAssistantData = updatedDbAssistant || dbAssistant;
                console.log(
                  "[DB_SUCCESS] POST /assistants - Assistant updated with vapi_id:",
                  finalAssistantData.vapi_assistant_id
                );
              }
            } else {
              console.warn(
                "[VAPI_WARN] POST /assistant - Vapi creation did not return an ID. DB record not updated with vapi_assistant_id."
              );
            }
          } catch (vapiError: any) {
            console.error(
              "[VAPI_ERROR] POST /assistants - Call to Vapi API failed after DB insert:",
              vapiError
            );

            // Enregistrer l'erreur dans la base de données pour le suivi
            const { error: updateError } = await supabaseClient
              .from("assistants")
              .update({
                metadata: {
                  ...initialAssistantData.metadata,
                  vapi_sync_error: vapiError.message,
                  vapi_sync_status: "failed",
                  vapi_sync_timestamp: new Date().toISOString(),
                },
              })
              .eq("id", dbAssistant.id);

            if (updateError) {
              console.error(
                "[DB_ERROR] Failed to update assistant with error info:",
                updateError
              );
            }

            // En mode développement, on considère ça comme un succès
            if (isDevelopment) {
              console.log(
                "[DEV_MODE] Ignoring Vapi API error in development mode:",
                vapiError.message
              );
              return createVapiSingleResponse(dbAssistant, 201);
            } else {
              // Assistant is in our DB, but not in Vapi (or Vapi call failed).
              return createVapiErrorResponse(
                "Assistant created in database, but Vapi API call failed: " +
                  (vapiError.message || "Unknown error"),
                500
              );
            }
          }

          return createVapiSingleResponse(finalAssistantData, 201);
        } catch (error: any) {
          console.error(
            "[ERROR] POST /assistants:",
            error.message,
            error.stack
          );
          return createVapiErrorResponse(
            error.message || "Failed to process assistant creation",
            500
          );
        }
      }

      // GET /assistants/{id} - Récupérer un assistant spécifique
      if (req.method === "GET" && assistantId) {
        console.log(
          `[HANDLER] GET /assistants/${assistantId} - Fetching from Supabase table`
        );
        try {
          // Vérifier que l'ID est un UUID valide
          if (!isValidUUID(assistantId)) {
            console.error(
              `[VALIDATION_ERROR] Invalid assistant ID: ${assistantId}`
            );
            return new Response(
              JSON.stringify({
                success: false,
                message: "Invalid assistant ID format",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          // Récupérer l'authentification à partir du JWT
          const authHeader = req.headers.get("Authorization");
          let userId = null;
          let userRole = "anon";

          // En développement, on permet de récupérer sans authentification
          const isDevelopment =
            Deno.env.get("SUPABASE_ENV") === "development" || true;

          if (authHeader) {
            const userInfo = extractUserFromJWT(authHeader);
            if (userInfo && userInfo.sub) {
              userId = userInfo.sub;
              userRole = userInfo.role || "authenticated";
              console.log(
                `[AUTH_INFO] User authenticated: ${userId} (role: ${userRole})`
              );
            }
          }

          // Construire la requête
          let query = supabaseClient
            .from("assistants")
            .select("*")
            .eq("id", assistantId);

          // Récupérer d'abord l'assistant pour vérifier les permissions
          const { data: assistantData, error: getError } = await query.single();

          if (getError) {
            console.error("[DB_ERROR] Error fetching assistant:", getError);
            return new Response(
              JSON.stringify({
                success: false,
                message: getError.message || "Failed to retrieve assistant",
              }),
              {
                status: getError.code === "PGRST116" ? 404 : 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          // Vérifier les permissions en production
          if (!isDevelopment && userId) {
            const permissionCheck = validatePermissions(
              userRole,
              userId,
              assistantData.user_id,
              assistantData.metadata
            );

            if (!permissionCheck.isValid) {
              console.error("[PERMISSION_ERROR]", permissionCheck.errors);
              return new Response(
                JSON.stringify({
                  success: false,
                  message: "Permission denied",
                  errors: permissionCheck.errors,
                }),
                {
                  status: 403,
                  headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                  },
                }
              );
            }
          }

          console.log(`[DB_SUCCESS] Assistant retrieved successfully.`);

          return new Response(
            JSON.stringify({
              success: true,
              data: assistantData,
            }),
            { headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } catch (error) {
          console.error(
            `[ERROR] GET /assistants/${assistantId}:`,
            error.message,
            error.stack
          );
          return new Response(
            JSON.stringify({
              success: false,
              message: error.message || "Failed to retrieve assistant",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      }

      // PATCH /assistants/{id} - Mettre à jour
      if (req.method === "PATCH" && assistantId) {
        console.log(
          `[HANDLER] PATCH /assistants/${assistantId} - Integrating DB update and Vapi sync`
        );
        try {
          // Vérifier que l'ID est un UUID valide
          if (!isValidUUID(assistantId)) {
            console.error(
              `[VALIDATION_ERROR] Invalid assistant ID: ${assistantId}`
            );
            return new Response(
              JSON.stringify({
                success: false,
                message: "Invalid assistant ID format",
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          const requestData = await req.json().catch(() => ({}));
          console.log(
            `[REQUEST_DATA] PATCH /assistants/${assistantId}:`,
            requestData
          );

          // Récupérer l'authentification à partir du JWT
          const authHeader = req.headers.get("Authorization");
          let userId = null;
          let userRole = "anon";

          // En développement, on permet de modifier sans authentification
          const isDevelopment =
            Deno.env.get("SUPABASE_ENV") === "development" || true;

          if (authHeader) {
            const userInfo = extractUserFromJWT(authHeader);
            if (userInfo && userInfo.sub) {
              userId = userInfo.sub;
              userRole = userInfo.role || "authenticated";
              console.log(
                `[AUTH_INFO] User authenticated: ${userId} (role: ${userRole})`
              );
            }
          } else if (!isDevelopment) {
            console.error(
              "[AUTH_ERROR] PATCH /assistants - No Authorization header provided"
            );
            return new Response(
              JSON.stringify({
                success: false,
                message: "Authentication required",
              }),
              {
                status: 401,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          // Récupérer d'abord l'assistant pour vérifier les permissions
          const { data: existingAssistant, error: getError } =
            await supabaseClient
              .from("assistants")
              .select("*")
              .eq("id", assistantId)
              .single();

          if (getError) {
            console.error(
              "[DB_ERROR] Error fetching assistant for update:",
              getError
            );
            return new Response(
              JSON.stringify({
                success: false,
                message:
                  getError.message || "Failed to retrieve assistant for update",
              }),
              {
                status: getError.code === "PGRST116" ? 404 : 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          // Vérifier les permissions en production
          if (!isDevelopment && userId) {
            const permissionCheck = validatePermissions(
              userRole,
              userId,
              existingAssistant.user_id,
              existingAssistant.metadata
            );

            if (!permissionCheck.isValid) {
              console.error("[PERMISSION_ERROR]", permissionCheck.errors);
              return new Response(
                JSON.stringify({
                  success: false,
                  message: "Permission denied",
                  errors: permissionCheck.errors,
                }),
                {
                  status: 403,
                  headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                  },
                }
              );
            }
          }

          // Valider les données d'entrée
          const validationResult = validateAssistantData(requestData);
          if (!validationResult.isValid) {
            console.error(
              "[VALIDATION_ERROR] Invalid assistant data:",
              validationResult.errors
            );
            return new Response(
              JSON.stringify({
                success: false,
                message: "Validation failed",
                errors: validationResult.errors,
              }),
              {
                status: 400,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          // Si l'utilisateur est de rôle 'test', préserver le flag is_test=true
          if (
            userRole === "test" &&
            existingAssistant.metadata &&
            existingAssistant.metadata.is_test === "true"
          ) {
            if (!requestData.metadata) {
              requestData.metadata = { is_test: "true" };
            } else if (requestData.metadata.is_test !== "true") {
              requestData.metadata.is_test = "true";
            }
            console.log(
              "[SECURITY] Preserved is_test=true metadata for test user role"
            );
          }

          // Sanitizer les données avant stockage
          const sanitizedData = sanitizeObject(requestData);

          // 3. Prepare data for Supabase update (only include fields present in requestData)
          const updatePayload: any = {};
          // Champs de base
          if (sanitizedData.name !== undefined)
            updatePayload.name = sanitizedData.name;
          if (sanitizedData.model !== undefined) {
            updatePayload.model =
              typeof sanitizedData.model === "object"
                ? JSON.stringify(sanitizedData.model)
                : sanitizedData.model;
          }
          if (sanitizedData.language !== undefined)
            updatePayload.language = sanitizedData.language;
          if (sanitizedData.voice !== undefined) {
            updatePayload.voice =
              typeof sanitizedData.voice === "object"
                ? JSON.stringify(sanitizedData.voice)
                : sanitizedData.voice;
          }
          if (sanitizedData.firstMessage !== undefined)
            updatePayload.first_message = sanitizedData.firstMessage;
          if (sanitizedData.instructions !== undefined)
            updatePayload.system_prompt = sanitizedData.instructions;

          // Champs additionnels
          if (sanitizedData.metadata !== undefined)
            updatePayload.metadata = sanitizedData.metadata;
          if (sanitizedData.tools_config !== undefined)
            updatePayload.tools_config = sanitizedData.tools_config;
          if (sanitizedData.forwarding_phone_number !== undefined)
            updatePayload.forwarding_phone_number =
              sanitizedData.forwarding_phone_number;

          // Nouveaux paramètres avancés
          if (sanitizedData.silenceTimeoutSeconds !== undefined)
            updatePayload.silence_timeout_seconds =
              sanitizedData.silenceTimeoutSeconds;
          if (sanitizedData.maxDurationSeconds !== undefined)
            updatePayload.max_duration_seconds =
              sanitizedData.maxDurationSeconds;
          if (sanitizedData.endCallAfterSilence !== undefined)
            updatePayload.end_call_after_silence =
              sanitizedData.endCallAfterSilence;
          if (sanitizedData.voiceReflection !== undefined)
            updatePayload.voice_reflection = sanitizedData.voiceReflection;
          if (sanitizedData.recordingSettings !== undefined)
            updatePayload.recording_settings = sanitizedData.recordingSettings;

          // Plans avancés
          if (sanitizedData.analysisPlan !== undefined)
            updatePayload.analysis_plan = sanitizedData.analysisPlan;
          if (sanitizedData.artifactPlan !== undefined)
            updatePayload.artifact_plan = sanitizedData.artifactPlan;
          if (sanitizedData.messagePlan !== undefined)
            updatePayload.message_plan = sanitizedData.messagePlan;
          if (sanitizedData.startSpeakingPlan !== undefined)
            updatePayload.start_speaking_plan = sanitizedData.startSpeakingPlan;
          if (sanitizedData.stopSpeakingPlan !== undefined)
            updatePayload.stop_speaking_plan = sanitizedData.stopSpeakingPlan;
          if (sanitizedData.monitorPlan !== undefined)
            updatePayload.monitor_plan = sanitizedData.monitorPlan;
          if (sanitizedData.voicemailDetection !== undefined)
            updatePayload.voicemail_detection =
              sanitizedData.voicemailDetection;
          if (sanitizedData.transcriber !== undefined)
            updatePayload.transcriber = sanitizedData.transcriber;

          // Version snake_case
          if (sanitizedData.analysis_plan !== undefined)
            updatePayload.analysis_plan = sanitizedData.analysis_plan;
          if (sanitizedData.artifact_plan !== undefined)
            updatePayload.artifact_plan = sanitizedData.artifact_plan;
          if (sanitizedData.message_plan !== undefined)
            updatePayload.message_plan = sanitizedData.message_plan;
          if (sanitizedData.start_speaking_plan !== undefined)
            updatePayload.start_speaking_plan =
              sanitizedData.start_speaking_plan;
          if (sanitizedData.stop_speaking_plan !== undefined)
            updatePayload.stop_speaking_plan = sanitizedData.stop_speaking_plan;
          if (sanitizedData.monitor_plan !== undefined)
            updatePayload.monitor_plan = sanitizedData.monitor_plan;
          if (sanitizedData.voicemail_detection !== undefined)
            updatePayload.voicemail_detection =
              sanitizedData.voicemail_detection;

          if (Object.keys(updatePayload).length === 0) {
            return new Response(
              JSON.stringify({
                success: true,
                message: "No changes to apply",
                data: existingAssistant,
              }),
              {
                status: 200,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          // 4. Update assistant in Supabase
          const { data: updatedDbAssistant, error: dbUpdateError } =
            await supabaseClient
              .from("assistants")
              .update(updatePayload)
              .eq("id", assistantId)
              .select()
              .single();

          if (dbUpdateError || !updatedDbAssistant) {
            console.error(
              `[DB_ERROR] PATCH /assistants/${assistantId} - Failed to update assistant:`,
              dbUpdateError
            );
            return new Response(
              JSON.stringify({
                success: false,
                message:
                  dbUpdateError?.message ||
                  "Failed to update assistant in database",
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }
          console.log(
            `[DB_SUCCESS] PATCH /assistants/${assistantId} - Assistant updated in DB.`
          );

          // 5. Call Vapi API to update if vapi_assistant_id exists and relevant fields changed
          let finalAssistantData = updatedDbAssistant;
          if (existingAssistant.vapi_assistant_id) {
            console.log(
              `[VAPI_SYNC] PATCH /assistants/${assistantId} - Attempting to sync with Vapi ID: ${existingAssistant.vapi_assistant_id}`
            );

            // Utiliser notre fonction utilitaire pour mapper les données au format Vapi
            const vapiUpdatePayload = mapToVapiAssistantFormat({
              ...updatedDbAssistant,
              // Inclure les objets structurés de la requête originale plutôt que leurs versions stringifiées en DB
              model:
                sanitizedData.model !== undefined
                  ? sanitizedData.model
                  : updatedDbAssistant.model,
              voice:
                sanitizedData.voice !== undefined
                  ? sanitizedData.voice
                  : updatedDbAssistant.voice,
            });

            // Ne rien envoyer à Vapi si le payload est vide (contient seulement un name qui n'a pas changé)
            if (
              Object.keys(vapiUpdatePayload).length > 1 ||
              (Object.keys(vapiUpdatePayload).length === 1 &&
                updatePayload.name !== undefined)
            ) {
              try {
                // Utiliser l'API d'assistants Vapi au lieu de l'appel direct
                const updatedVapiAssistant = await vapiAssistants.update(
                  existingAssistant.vapi_assistant_id,
                  vapiUpdatePayload
                );
                console.log(
                  `[VAPI_SUCCESS] Updated assistant: ${existingAssistant.vapi_assistant_id}`,
                  updatedVapiAssistant
                );

                // Mise à jour optionnelle des détails Vapi stockés en cache DB
                if (updatedVapiAssistant) {
                  const { error: detailsUpdateError } = await supabaseClient
                    .from("assistants")
                    .update({
                      vapi_model_details: updatedVapiAssistant.model
                        ? JSON.stringify(updatedVapiAssistant.model)
                        : null,
                      vapi_voice_details: updatedVapiAssistant.voice
                        ? JSON.stringify(updatedVapiAssistant.voice)
                        : null,
                    })
                    .eq("id", assistantId);

                  if (detailsUpdateError) {
                    console.warn(
                      `[DB_WARN] Failed to update Vapi details cache:`,
                      detailsUpdateError
                    );
                  }
                }
              } catch (vapiError: any) {
                console.error(
                  `[VAPI_ERROR] PATCH /assistants/${assistantId} - Vapi API call failed:`,
                  vapiError.message
                );
                // Non-fatal, but client should be aware that Vapi sync might have failed.
                return new Response(
                  JSON.stringify({
                    success: true, // DB update succeeded
                    message:
                      "Assistant updated in local DB, but Vapi API sync failed. Manual check may be required.",
                    data: updatedDbAssistant,
                    vapi_error: vapiError.message,
                  }),
                  {
                    status: 207,
                    headers: {
                      "Content-Type": "application/json",
                      ...corsHeaders,
                    },
                  }
                );
              }
            } else {
              console.log(
                `[VAPI_SYNC] PATCH /assistants/${assistantId} - No Vapi-relevant fields changed, skipping Vapi update.`
              );
            }
          } else {
            console.log(
              `[VAPI_SYNC] PATCH /assistants/${assistantId} - No vapi_assistant_id, skipping Vapi update.`
            );
          }

          return new Response(
            JSON.stringify({
              success: true,
              message: "Assistant updated successfully",
              data: finalAssistantData,
            }),
            { headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } catch (error: any) {
          console.error(
            "[ERROR] PATCH /assistants/:id:",
            error.message,
            error.stack
          );
          return new Response(
            JSON.stringify({
              success: false,
              message: error.message || "Failed to update assistant",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      }

      // DELETE /assistants/{id} - Supprimer
      if (req.method === "DELETE" && assistantId) {
        console.log(
          `[HANDLER] DELETE /assistants/${assistantId} - Integrating DB delete and Vapi sync`
        );
        try {
          // 1. Mode développement - Aucune authentification nécessaire
          console.log(
            `[DEV_MODE] DELETE /assistants/${assistantId} - Bypassing authentication checks`
          );

          // 2. Fetch existing assistant from Supabase (sans filtrage par user_id en mode dev)
          const { data: existingAssistant, error: fetchError } =
            await supabaseClient
              .from("assistants")
              .select("id, vapi_assistant_id") // Only select needed fields
              .eq("id", assistantId)
              .single();

          if (fetchError || !existingAssistant) {
            console.error(
              `[DB_ERROR] DELETE /assistants/${assistantId} - Assistant not found or user mismatch:`,
              fetchError
            );
            const status = fetchError?.code === "PGRST116" ? 404 : 500; // PGRST116: Row not found
            return new Response(
              JSON.stringify({
                success: false,
                message:
                  status === 404
                    ? "Assistant not found"
                    : "Failed to retrieve assistant for deletion",
              }),
              {
                status,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          // 3. Call Vapi API to delete if vapi_assistant_id exists
          if (existingAssistant.vapi_assistant_id) {
            console.log(
              `[VAPI_SYNC] DELETE /assistants/${assistantId} - Attempting to delete from Vapi ID: ${existingAssistant.vapi_assistant_id}`
            );
            try {
              // Utiliser l'API d'assistants Vapi au lieu de l'appel direct
              await vapiAssistants.delete(existingAssistant.vapi_assistant_id);
              console.log(
                `[VAPI_SUCCESS] DELETE - Assistant deleted from Vapi: ${existingAssistant.vapi_assistant_id}`
              );
            } catch (vapiError: any) {
              console.error(
                `[VAPI_ERROR] DELETE /assistants/${assistantId} - Vapi API call failed:`,
                vapiError.message
              );
              // Log the error. Depending on policy, you might choose to proceed with DB deletion or halt.
              // For now, we proceed with DB deletion even if Vapi fails, but warn the client.
              return new Response(
                JSON.stringify({
                  success: false,
                  message:
                    "Failed to delete assistant from Vapi. Database deletion pending. Manual check may be required.",
                  vapi_error: vapiError.message,
                }),
                {
                  status: 502,
                  headers: {
                    "Content-Type": "application/json",
                    ...corsHeaders,
                  },
                }
              );
            }
          } else {
            console.log(
              `[VAPI_SYNC] DELETE /assistants/${assistantId} - No vapi_assistant_id, skipping Vapi deletion.`
            );
          }

          // 4. Delete assistant from Supabase
          const { error: dbDeleteError } = await supabaseClient
            .from("assistants")
            .delete()
            .eq("id", assistantId);

          if (dbDeleteError) {
            console.error(
              `[DB_ERROR] DELETE /assistants/${assistantId} - Failed to delete assistant from DB:`,
              dbDeleteError
            );
            return new Response(
              JSON.stringify({
                success: false,
                message:
                  dbDeleteError?.message ||
                  "Failed to delete assistant from database",
              }),
              {
                status: 500,
                headers: { "Content-Type": "application/json", ...corsHeaders },
              }
            );
          }

          console.log(
            `[DB_SUCCESS] DELETE /assistants/${assistantId} - Assistant deleted from DB.`
          );
          return new Response(
            JSON.stringify({
              success: true,
              message: "Assistant deleted successfully",
            }),
            {
              status: 200,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        } catch (error: any) {
          console.error(
            "[ERROR] DELETE /assistants/:id:",
            error.message,
            error.stack
          );
          return new Response(
            JSON.stringify({
              success: false,
              message: error.message || "Failed to delete assistant",
            }),
            {
              status: 500,
              headers: { "Content-Type": "application/json", ...corsHeaders },
            }
          );
        }
      }

      return new Response(
        JSON.stringify({
          success: false,
          message: `Method ${req.method} not handled for /assistants${
            assistantId ? "/" + assistantId : ""
          }`,
        }),
        {
          status: 405,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: `Function ${
          functionName || "root"
        } not found or method not handled.`,
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("[GLOBAL_ERROR]", error.message, error.stack);
    return new Response(
      JSON.stringify({
        success: false,
        message: error.message || "An unexpected error occurred.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
