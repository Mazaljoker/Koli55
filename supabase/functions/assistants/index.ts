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
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../shared/cors.ts'
import { 
  vapiAssistants, 
  VapiAssistant, 
  AssistantCreateParams, 
  AssistantUpdateParams 
} from '../shared/vapi.ts'

// Fonction pour faire des requêtes à l'API Vapi - pour la rétrocompatibilité, 
// idéalement remplacer progressivement par les appels de vapiAssistants
async function callVapiAPI(endpoint: string, apiKey: string, method: string = 'GET', body?: any) {
  const url = `https://api.vapi.ai${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  };

  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(body);
  }

  console.log(`[VAPI_CALL] ${method} ${url}`);
  // if (body) { // console.log(`[VAPI_CALL_BODY] ${JSON.stringify(body)}`); }

  try {
    const response = await fetch(url, options);
    const responseText = await response.text();
    
    if (!response.ok) {
      let errorData: any = { message: `API request failed with status ${response.status}`, raw_error: responseText };
      try {
        errorData = JSON.parse(responseText);
      } catch (parseError) {
        // Keep the initial error if parsing fails, log parseError for debugging
        console.warn('[VAPI_ERROR_PARSE] Failed to parse error response as JSON:', parseError);
      }
      console.error(`[VAPI_ERROR] Status: ${response.status}`, errorData);
      throw new Error(errorData.message || errorData.raw_error || 'VAPI API request failed');
    }

    if (responseText) {
        try {
            return JSON.parse(responseText);
        } catch (e: any) {
            console.error(`[VAPI_ERROR] Failed to parse JSON response: ${e.message}`, responseText);
            throw new Error(`Invalid JSON response from Vapi: ${responseText.substring(0,100)}`);
        }
    }
    return {};

  } catch (error: any) {
    console.error(`[VAPI_ERROR] Network or other error: ${error.message}`);
    throw error;
  }
}

function getSupabaseClient(req: Request): SupabaseClient {
  const authHeader = req.headers.get('Authorization');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('[SUPABASE_CLIENT_ERROR] SUPABASE_URL or SUPABASE_ANON_KEY is not set.');
    throw new Error('Server configuration error: Supabase credentials missing.');
  }

  if (!authHeader) {
    console.warn('[SUPABASE_CLIENT_WARN] No Authorization header, using anon key for Supabase client.');
    return createClient(supabaseUrl, supabaseAnonKey);
  }
  
  return createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } }
  });
}

/**
 * Fonctions utilitaires pour mapper les données entre notre format DB/frontend et le format Vapi
 */

/**
 * Convertit le modèle du format frontend/DB au format Vapi
 * Accepte soit une chaîne simple, soit un objet structuré
 * 
 * @param modelInput - String (ex: 'gpt-4o') ou Object { provider, model, systemPrompt, ... }
 * @param systemPrompt - Optionnel, instructions système si modelInput est une chaîne
 */
function mapModelToVapiFormat(modelInput: string | any, systemPrompt?: string): { provider: string, model: string, systemPrompt?: string } {
  console.log(`[MAPPING] mapModelToVapiFormat - modelInput: ${typeof modelInput === 'string' ? modelInput : JSON.stringify(modelInput)}, systemPrompt: ${systemPrompt || 'none'}`);
  
  if (!modelInput && !systemPrompt) {
    // Valeurs par défaut si rien n'est fourni
    return { provider: 'openai', model: 'gpt-4o' };
  }
  
  if (typeof modelInput === 'string') {
    // Simple string handling - infère le provider basé sur des préfixes connus
    let provider = 'openai'; // par défaut
    let model = modelInput;
    
    // Inférer le provider basé sur des préfixes connus
    if (modelInput.startsWith('claude')) {
      provider = 'anthropic';
    } else if (modelInput.startsWith('command')) {
      provider = 'cohere';
    } else if (modelInput.startsWith('gemini')) {
      provider = 'google';
    }
    
    return {
      provider,
      model,
      systemPrompt: systemPrompt || undefined
    };
  }
  
  // L'entrée est déjà un objet structuré
  if (typeof modelInput === 'object') {
    // Si l'objet a déjà le format attendu par Vapi
    if (modelInput.provider && modelInput.model) {
      return {
        provider: modelInput.provider,
        model: modelInput.model,
        systemPrompt: modelInput.systemPrompt || systemPrompt || undefined,
        ...(modelInput.temperature !== undefined && { temperature: modelInput.temperature }),
        ...(modelInput.topP !== undefined && { topP: modelInput.topP }),
        ...(modelInput.maxTokens !== undefined && { maxTokens: modelInput.maxTokens })
      };
    }
  }
  
  // Fallback avec des valeurs par défaut + systemPrompt si fourni
  return {
    provider: 'openai',
    model: 'gpt-4o',
    systemPrompt: systemPrompt || undefined
  };
}

/**
 * Convertit la voix du format frontend/DB au format Vapi
 * Accepte soit une chaîne simple, soit un objet structuré
 * 
 * @param voiceInput - String (ex: 'elevenlabs-rachel') ou Object { provider, voiceId }
 */
function mapVoiceToVapiFormat(voiceInput: string | any): { provider: string, voiceId: string } | undefined {
  console.log(`[MAPPING] mapVoiceToVapiFormat - voiceInput: ${typeof voiceInput === 'string' ? voiceInput : JSON.stringify(voiceInput)}`);
  
  if (!voiceInput) {
    return undefined;
  }
  
  if (typeof voiceInput === 'string') {
    // Format: "provider-voiceId" (ex: "elevenlabs-rachel")
    const parts = voiceInput.split('-');
    if (parts.length >= 2) {
      return {
        provider: parts[0],
        voiceId: parts.slice(1).join('-') // Rejoindre au cas où le voiceId contient des tirets
      };
    }
    
    // Fallback: assume it's elevenlabs voice ID if no provider is specified
    return {
      provider: 'elevenlabs',
      voiceId: voiceInput
    };
  }
  
  // L'entrée est déjà un objet structuré
  if (typeof voiceInput === 'object' && voiceInput.provider && voiceInput.voiceId) {
    return {
      provider: voiceInput.provider,
      voiceId: voiceInput.voiceId
    };
  }
  
  console.warn(`[MAPPING] mapVoiceToVapiFormat - Format non reconnu pour voice: ${JSON.stringify(voiceInput)}`);
  return undefined;
}

/**
 * Convertit les données de l'assistant du format DB/frontend au format attendu par l'API Vapi
 * 
 * @param assistantData - Données de l'assistant depuis la DB ou la requête frontend
 */
function mapToVapiAssistantFormat(assistantData: any): AssistantCreateParams | AssistantUpdateParams {
  console.log(`[MAPPING] mapToVapiAssistantFormat - Input: ${JSON.stringify(assistantData, null, 2)}`);
  
  const payload: AssistantCreateParams | AssistantUpdateParams = {
    name: assistantData.name
  };
  
  // Mapping du modèle et system prompt
  if (assistantData.model !== undefined || assistantData.system_prompt || assistantData.instructions) {
    payload.model = mapModelToVapiFormat(
      assistantData.model, 
      assistantData.system_prompt || assistantData.instructions
    );
  }
  
  // Mapping de la voix
  const voice = mapVoiceToVapiFormat(assistantData.voice);
  if (voice) {
    payload.voice = voice;
  }
  
  // Mapping des autres champs directs
  if (assistantData.first_message || assistantData.firstMessage) {
    payload.firstMessage = assistantData.first_message || assistantData.firstMessage;
  }
  
  // Mapping des outils si présents
  if (assistantData.tools_config) {
    payload.tools = assistantData.tools_config;
  }
  
  // Mapping du numéro de téléphone de transfert
  if (assistantData.forwarding_phone_number) {
    payload.forwardingPhoneNumber = assistantData.forwarding_phone_number;
  }
  
  // Mapping des paramètres avancés d'appel
  if (assistantData.silenceTimeoutSeconds !== undefined) {
    payload.silenceTimeoutSeconds = assistantData.silenceTimeoutSeconds;
  }
  
  if (assistantData.maxDurationSeconds !== undefined) {
    payload.maxDurationSeconds = assistantData.maxDurationSeconds;
  }
  
  if (assistantData.endCallAfterSilence !== undefined) {
    payload.endCallAfterSilence = assistantData.endCallAfterSilence;
  }
  
  if (assistantData.voiceReflection !== undefined) {
    payload.voiceReflection = assistantData.voiceReflection;
  }
  
  // Mapping des paramètres d'enregistrement
  if (assistantData.recordingSettings) {
    payload.recordingSettings = assistantData.recordingSettings;
  }
  
  // Mapping des métadonnées
  if (assistantData.metadata) {
    payload.metadata = assistantData.metadata;
  }
  
  console.log(`[MAPPING] mapToVapiAssistantFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const vapiApiKey = Deno.env.get('VAPI_API_KEY');
    if (!vapiApiKey) {
      console.error('[CONFIG_ERROR] VAPI_API_KEY not set');
      return new Response(JSON.stringify({ success: false, message: 'Server configuration error: VAPI_API_KEY is missing.' }), 
                              { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
    }
    
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(segment => segment);
    
    console.log(`[REQUEST_INFO] ${req.method} /${pathSegments[0]}${url.pathname.replace(`/${pathSegments[0]}`, '')} ${url.search}`);

    const supabaseClient = getSupabaseClient(req);
    const functionName = pathSegments[0]; 

    if (functionName === 'assistants') {
      const assistantId = pathSegments[1]; 

      if (req.method === 'GET' && !assistantId) {
        console.log('[HANDLER] GET /assistants - Fetching from Supabase table');
        try {
          const authHeader = req.headers.get('Authorization');
          if (!authHeader) {
            console.warn('[AUTH_WARN] GET /assistants - Missing Authorization header.');
            return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 401,
            });
          }

          const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
          
          if (userError || !user) {
            console.error('[AUTH_ERROR] GET /assistants - Error fetching user:', userError?.message || 'No user found');
            return new Response(JSON.stringify({ error: userError?.message || 'Failed to authenticate user' }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 401,
            });
          }

          let query = supabaseClient.from('assistants').select('*').eq('user_id', user.id);
          const page = parseInt(url.searchParams.get('page') || '1');
          const limit = parseInt(url.searchParams.get('limit') || '10');
          const offset = (page - 1) * limit;
          query = query.range(offset, offset + limit - 1).order('created_at', { ascending: false });

          const { data: assistantsData, error: dbError, count } = await query;

          if (dbError) {
            console.error('[DB_ERROR] GET /assistants:', dbError);
            throw new Error(dbError.message || 'Failed to retrieve assistants from database.');
          }
          
          console.log(`[DB_SUCCESS] Fetched ${assistantsData?.length || 0} assistants.`);
          
          let totalItems = 0;
          let countQuery = supabaseClient.from('assistants').select('id', { count: 'exact', head: true });
          // if (user) { // user is guaranteed to be defined here due to the check above
          countQuery = countQuery.eq('user_id', user.id);
          // }
          const { count: exactCount } = await countQuery;
          totalItems = exactCount || 0;
        
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Assistants retrieved successfully',
              data: assistantsData || [],
              pagination: {
                total: totalItems,
                limit: limit,
                page: page,
                has_more: (offset + (assistantsData?.length || 0)) < totalItems,
              }
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
        } catch (error: any) {
          console.error('[ERROR] GET /assistants:', error.message, error.stack);
        return new Response(
            JSON.stringify({ success: false, message: error.message || 'Failed to retrieve assistants' }),
            { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
          );
      }
    }
    
    // POST /assistants - Créer un nouvel assistant
      if (req.method === 'POST' && !assistantId) {
        console.log('[HANDLER] POST /assistants - Integrating DB insert, Vapi call, and DB update');
        try {
          const requestData = await req.json().catch(() => ({}));
          console.log(`[REQUEST_DATA] POST /assistants:`, requestData);

          // 1. Authenticate user and get user_id
          const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
          if (userError || !user) {
            console.error('[AUTH_ERROR] POST /assistants - Error fetching user:', userError?.message || 'No user found');
            return new Response(JSON.stringify({ success: false, message: userError?.message || 'Failed to authenticate user' }), {
              status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }

          // Validate required fields (e.g., name)
          if (!requestData.name) {
            return new Response(JSON.stringify({ success: false, message: 'Assistant name is required' }), 
                              { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
          }

          // 2. Insert initial assistant data into Supabase table
          const initialAssistantData = {
            user_id: user.id,
            name: requestData.name,
            model: typeof requestData.model === 'object' ? JSON.stringify(requestData.model) : requestData.model,
            language: requestData.language,
            voice: typeof requestData.voice === 'object' ? JSON.stringify(requestData.voice) : requestData.voice,
            first_message: requestData.firstMessage,
            system_prompt: requestData.instructions,
            // Nouveaux champs avancés
            metadata: requestData.metadata,
            tools_config: requestData.tools_config,
            forwarding_phone_number: requestData.forwarding_phone_number,
            // Paramètres d'appel
            silence_timeout_seconds: requestData.silenceTimeoutSeconds,
            max_duration_seconds: requestData.maxDurationSeconds,
            end_call_after_silence: requestData.endCallAfterSilence,
            voice_reflection: requestData.voiceReflection,
            // Paramètres d'enregistrement
            recording_settings: requestData.recordingSettings
          };

          const { data: dbAssistant, error: dbInsertError } = await supabaseClient
            .from('assistants')
            .insert(initialAssistantData)
            .select()
            .single();

          if (dbInsertError || !dbAssistant) {
            console.error('[DB_ERROR] POST /assistants - Failed to insert assistant:', dbInsertError);
            return new Response(JSON.stringify({ success: false, message: dbInsertError?.message || 'Failed to create assistant in database' }), 
                              { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
          }

          console.log('[DB_SUCCESS] POST /assistants - Assistant inserted with ID:', dbAssistant.id);

          // 3. Préparer le payload et appeler l'API Vapi en utilisant nos fonctions utilitaires
          const vapiAssistantPayload = mapToVapiAssistantFormat({
            ...dbAssistant,
            // Inclure les champs requestData qui pourraient ne pas être dans dbAssistant
            // (notamment pour les objets stockés comme chaînes JSON dans la DB)
            model: requestData.model,
            voice: requestData.voice
          }) as AssistantCreateParams; // Type assertion pour fixer l'erreur de type
          
          let createdVapiAssistant: VapiAssistant | null = null;
          let finalAssistantData = dbAssistant;

          try {
            // Utiliser l'API d'assistants Vapi au lieu de l'appel direct
            createdVapiAssistant = await vapiAssistants.create(vapiAssistantPayload);
            console.log(`[VAPI_SUCCESS] Created assistant:`, createdVapiAssistant);

            // 4. Update Supabase record with vapi_assistant_id
            if (createdVapiAssistant && createdVapiAssistant.id) {
              const { data: updatedDbAssistant, error: dbUpdateError } = await supabaseClient
                .from('assistants')
                .update({ 
                  vapi_assistant_id: createdVapiAssistant.id,
                  // Stocker un aperçu du modèle et de la voix complets (optionnel pour débogage)
                  vapi_model_details: createdVapiAssistant.model ? JSON.stringify(createdVapiAssistant.model) : null,
                  vapi_voice_details: createdVapiAssistant.voice ? JSON.stringify(createdVapiAssistant.voice) : null
                })
                .eq('id', dbAssistant.id)
                .select()
                .single();

              if (dbUpdateError) {
                console.error('[DB_ERROR] POST /assistants - Failed to update assistant with vapi_id:', dbUpdateError);
                // Non-fatal for the client, but log it. The assistant exists in DB and Vapi.
              } else {
                finalAssistantData = updatedDbAssistant || dbAssistant;
                console.log('[DB_SUCCESS] POST /assistants - Assistant updated with vapi_id:', finalAssistantData.vapi_assistant_id);
              }
            } else {
              console.warn('[VAPI_WARN] POST /assistant - Vapi creation did not return an ID. DB record not updated with vapi_assistant_id.');
            }
          } catch (vapiError: any) {
            console.error('[VAPI_ERROR] POST /assistants - Call to Vapi API failed after DB insert:', vapiError.message);
            // Assistant is in our DB, but not in Vapi (or Vapi call failed).
            return new Response(JSON.stringify({ 
              success: true, // Or false, depending on how critical Vapi sync is for creation
              message: 'Assistant created in local DB, but Vapi API call failed. Manual sync may be required.',
              data: dbAssistant, // Return the DB data
              vapi_error: vapiError.message
            }), { status: 207, headers: { 'Content-Type': 'application/json', ...corsHeaders } }); // 207 Multi-Status
          }

          return new Response(JSON.stringify({ 
            success: true, 
            message: 'Assistant created successfully' + (createdVapiAssistant?.id ? ' and synced with Vapi.' : '. Vapi sync pending or failed.'), 
            data: finalAssistantData 
          }),
            { status: 201, headers: { 'Content-Type': 'application/json', ...corsHeaders } });

        } catch (error: any) {
          console.error('[ERROR] POST /assistants (Vapi call): ', error.message, error.stack);
          return new Response(JSON.stringify({ success: false, message: error.message || 'Failed to process assistant creation' }),
                              { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
      }

      // GET /assistants/{id} - Récupérer un assistant spécifique
      if (req.method === 'GET' && assistantId) {
        console.log(`[HANDLER] GET /assistants/${assistantId} - Fetching from Supabase table`);
        try {
          // 1. Authenticate user
          const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
          if (userError || !user) {
            console.error(`[AUTH_ERROR] GET /assistants/${assistantId} - Error fetching user:`, userError?.message || 'No user found');
            return new Response(JSON.stringify({ success: false, message: userError?.message || 'Failed to authenticate user' }), {
              status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }

          // 2. Fetch assistant from Supabase by its ID and user_id
          const { data: assistantData, error: dbError } = await supabaseClient
            .from('assistants')
            .select('*')
            .eq('id', assistantId)
            .eq('user_id', user.id) // Ensure the assistant belongs to the authenticated user
            .single();

          if (dbError) {
            console.error(`[DB_ERROR] GET /assistants/${assistantId} - Error fetching assistant:`, dbError);
            // Check if the error is because the assistant was not found
            if (dbError.code === 'PGRST116') { // PGRST116: Row not found (PostgREST specific)
              return new Response(JSON.stringify({ success: false, message: 'Assistant not found' }), 
                                { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
            }
            return new Response(JSON.stringify({ success: false, message: dbError.message || 'Failed to retrieve assistant' }), 
                              { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
          }

          if (!assistantData) { // Should be caught by dbError.code === 'PGRST116' with .single(), but as a safeguard
            return new Response(JSON.stringify({ success: false, message: 'Assistant not found' }), 
                              { status: 404, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
          }

          console.log(`[DB_SUCCESS] GET /assistants/${assistantId} - Fetched assistant:`, assistantData.id);
          return new Response(JSON.stringify({ success: true, data: assistantData }), 
                              { headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        } catch (error: any) {
          console.error(`[ERROR] GET /assistants/${assistantId}:`, error.message, error.stack);
          return new Response(JSON.stringify({ success: false, message: error.message || 'Failed to retrieve assistant' }), 
                              { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
      }

      // PATCH /assistants/{id} - Mettre à jour
      if (req.method === 'PATCH' && assistantId) {
        console.log(`[HANDLER] PATCH /assistants/${assistantId} - Integrating DB update and Vapi sync`);
        try {
          const requestData = await req.json().catch(() => ({}));
          console.log(`[REQUEST_DATA] PATCH /assistants/${assistantId}:`, requestData);

          // 1. Authenticate user
          const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
          if (userError || !user) {
            console.error(`[AUTH_ERROR] PATCH /assistants/${assistantId} - Error fetching user:`, userError?.message || 'No user found');
            return new Response(JSON.stringify({ success: false, message: userError?.message || 'Failed to authenticate user' }), {
              status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }

          // 2. Fetch existing assistant from Supabase to get vapi_assistant_id and check ownership
          const { data: existingAssistant, error: fetchError } = await supabaseClient
            .from('assistants')
            .select('*')
            .eq('id', assistantId)
            .eq('user_id', user.id) // Ensure user owns this assistant
            .single();

          if (fetchError || !existingAssistant) {
            console.error(`[DB_ERROR] PATCH /assistants/${assistantId} - Assistant not found or user mismatch:`, fetchError);
            const status = fetchError?.code === 'PGRST116' ? 404 : 500; // PGRST116: Row not found
            return new Response(JSON.stringify({ success: false, message: status === 404 ? 'Assistant not found' : 'Failed to retrieve assistant' }),
                              { status, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
          }

          // 3. Prepare data for Supabase update (only include fields present in requestData)
          const updatePayload: any = {};
          // Champs de base
          if (requestData.name !== undefined) updatePayload.name = requestData.name;
          if (requestData.model !== undefined) {
            updatePayload.model = typeof requestData.model === 'object' ? JSON.stringify(requestData.model) : requestData.model;
          }
          if (requestData.language !== undefined) updatePayload.language = requestData.language;
          if (requestData.voice !== undefined) {
            updatePayload.voice = typeof requestData.voice === 'object' ? JSON.stringify(requestData.voice) : requestData.voice;
          }
          if (requestData.firstMessage !== undefined) updatePayload.first_message = requestData.firstMessage;
          if (requestData.instructions !== undefined) updatePayload.system_prompt = requestData.instructions;
          
          // Champs additionnels
          if (requestData.metadata !== undefined) updatePayload.metadata = requestData.metadata;
          if (requestData.tools_config !== undefined) updatePayload.tools_config = requestData.tools_config;
          if (requestData.forwarding_phone_number !== undefined) updatePayload.forwarding_phone_number = requestData.forwarding_phone_number;
          
          // Nouveaux paramètres avancés
          if (requestData.silenceTimeoutSeconds !== undefined) updatePayload.silence_timeout_seconds = requestData.silenceTimeoutSeconds;
          if (requestData.maxDurationSeconds !== undefined) updatePayload.max_duration_seconds = requestData.maxDurationSeconds;
          if (requestData.endCallAfterSilence !== undefined) updatePayload.end_call_after_silence = requestData.endCallAfterSilence;
          if (requestData.voiceReflection !== undefined) updatePayload.voice_reflection = requestData.voiceReflection;
          if (requestData.recordingSettings !== undefined) updatePayload.recording_settings = requestData.recordingSettings;

          if (Object.keys(updatePayload).length === 0) {
            return new Response(JSON.stringify({ success: true, message: 'No changes to apply', data: existingAssistant }),
                              { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
          }
          
          // 4. Update assistant in Supabase
          const { data: updatedDbAssistant, error: dbUpdateError } = await supabaseClient
            .from('assistants')
            .update(updatePayload)
            .eq('id', assistantId)
            .select()
            .single();

          if (dbUpdateError || !updatedDbAssistant) {
            console.error(`[DB_ERROR] PATCH /assistants/${assistantId} - Failed to update assistant:`, dbUpdateError);
            return new Response(JSON.stringify({ success: false, message: dbUpdateError?.message || 'Failed to update assistant in database' }),
                              { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
          }
          console.log(`[DB_SUCCESS] PATCH /assistants/${assistantId} - Assistant updated in DB.`);

          // 5. Call Vapi API to update if vapi_assistant_id exists and relevant fields changed
          let finalAssistantData = updatedDbAssistant;
          if (existingAssistant.vapi_assistant_id) {
            console.log(`[VAPI_SYNC] PATCH /assistants/${assistantId} - Attempting to sync with Vapi ID: ${existingAssistant.vapi_assistant_id}`);
            
            // Utiliser notre fonction utilitaire pour mapper les données au format Vapi
            const vapiUpdatePayload = mapToVapiAssistantFormat({
              ...updatedDbAssistant, 
              // Inclure les objets structurés de la requête originale plutôt que leurs versions stringifiées en DB
              model: requestData.model !== undefined ? requestData.model : updatedDbAssistant.model,
              voice: requestData.voice !== undefined ? requestData.voice : updatedDbAssistant.voice
            });
            
            // Ne rien envoyer à Vapi si le payload est vide (contient seulement un name qui n'a pas changé)
            if (Object.keys(vapiUpdatePayload).length > 1 || 
                (Object.keys(vapiUpdatePayload).length === 1 && updatePayload.name !== undefined)) {
              try {
                // Utiliser l'API d'assistants Vapi au lieu de l'appel direct
                const updatedVapiAssistant = await vapiAssistants.update(existingAssistant.vapi_assistant_id, vapiUpdatePayload);
                console.log(`[VAPI_SUCCESS] Updated assistant: ${existingAssistant.vapi_assistant_id}`, updatedVapiAssistant);
                
                // Mise à jour optionnelle des détails Vapi stockés en cache DB
                if (updatedVapiAssistant) {
                  const { error: detailsUpdateError } = await supabaseClient
                    .from('assistants')
                    .update({ 
                      vapi_model_details: updatedVapiAssistant.model ? JSON.stringify(updatedVapiAssistant.model) : null,
                      vapi_voice_details: updatedVapiAssistant.voice ? JSON.stringify(updatedVapiAssistant.voice) : null
                    })
                    .eq('id', assistantId);
                    
                  if (detailsUpdateError) {
                    console.warn(`[DB_WARN] Failed to update Vapi details cache:`, detailsUpdateError);
                  }
                }
              } catch (vapiError: any) {
                console.error(`[VAPI_ERROR] PATCH /assistants/${assistantId} - Vapi API call failed:`, vapiError.message);
                // Non-fatal, but client should be aware that Vapi sync might have failed.
                return new Response(JSON.stringify({ 
                  success: true, // DB update succeeded
                  message: 'Assistant updated in local DB, but Vapi API sync failed. Manual check may be required.',
                  data: updatedDbAssistant,
                  vapi_error: vapiError.message
                }), { status: 207, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
              }
            } else {
              console.log(`[VAPI_SYNC] PATCH /assistants/${assistantId} - No Vapi-relevant fields changed, skipping Vapi update.`);
            }
          } else {
            console.log(`[VAPI_SYNC] PATCH /assistants/${assistantId} - No vapi_assistant_id, skipping Vapi update.`);
          }

          return new Response(JSON.stringify({ success: true, message: 'Assistant updated successfully', data: finalAssistantData }), 
                              { headers: { 'Content-Type': 'application/json', ...corsHeaders } });

        } catch (error: any) {
          console.error('[ERROR] PATCH /assistants/:id:', error.message, error.stack);
          return new Response(JSON.stringify({ success: false, message: error.message || 'Failed to update assistant' }), 
                              { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
      }

      // DELETE /assistants/{id} - Supprimer
      if (req.method === 'DELETE' && assistantId) {
        console.log(`[HANDLER] DELETE /assistants/${assistantId} - Integrating DB delete and Vapi sync`);
        try {
          // 1. Authenticate user
          const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
          if (userError || !user) {
            console.error(`[AUTH_ERROR] DELETE /assistants/${assistantId} - Error fetching user:`, userError?.message || 'No user found');
            return new Response(JSON.stringify({ success: false, message: userError?.message || 'Failed to authenticate user' }), {
              status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders }
            });
          }

          // 2. Fetch existing assistant from Supabase to get vapi_assistant_id and check ownership
          const { data: existingAssistant, error: fetchError } = await supabaseClient
            .from('assistants')
            .select('id, vapi_assistant_id') // Only select needed fields
            .eq('id', assistantId)
            .eq('user_id', user.id) // Ensure user owns this assistant
            .single();

          if (fetchError || !existingAssistant) {
            console.error(`[DB_ERROR] DELETE /assistants/${assistantId} - Assistant not found or user mismatch:`, fetchError);
            const status = fetchError?.code === 'PGRST116' ? 404 : 500; // PGRST116: Row not found
            return new Response(JSON.stringify({ success: false, message: status === 404 ? 'Assistant not found' : 'Failed to retrieve assistant for deletion' }),
                              { status, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
          }

          // 3. Call Vapi API to delete if vapi_assistant_id exists
          if (existingAssistant.vapi_assistant_id) {
            console.log(`[VAPI_SYNC] DELETE /assistants/${assistantId} - Attempting to delete from Vapi ID: ${existingAssistant.vapi_assistant_id}`);
            try {
              // Utiliser l'API d'assistants Vapi au lieu de l'appel direct
              await vapiAssistants.delete(existingAssistant.vapi_assistant_id);
              console.log(`[VAPI_SUCCESS] DELETE - Assistant deleted from Vapi: ${existingAssistant.vapi_assistant_id}`);
            } catch (vapiError: any) {
              console.error(`[VAPI_ERROR] DELETE /assistants/${assistantId} - Vapi API call failed:`, vapiError.message);
              // Log the error. Depending on policy, you might choose to proceed with DB deletion or halt.
              // For now, we proceed with DB deletion even if Vapi fails, but warn the client.
              return new Response(JSON.stringify({ 
                success: false, 
                message: 'Failed to delete assistant from Vapi. Database deletion pending. Manual check may be required.',
                vapi_error: vapiError.message
              }), { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }); 
            }
          } else {
            console.log(`[VAPI_SYNC] DELETE /assistants/${assistantId} - No vapi_assistant_id, skipping Vapi deletion.`);
          }

          // 4. Delete assistant from Supabase
          const { error: dbDeleteError } = await supabaseClient
            .from('assistants')
            .delete()
            .eq('id', assistantId);

          if (dbDeleteError) {
            console.error(`[DB_ERROR] DELETE /assistants/${assistantId} - Failed to delete assistant from DB:`, dbDeleteError);
            return new Response(JSON.stringify({ success: false, message: dbDeleteError?.message || 'Failed to delete assistant from database' }),
                              { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
          }

          console.log(`[DB_SUCCESS] DELETE /assistants/${assistantId} - Assistant deleted from DB.`);
          return new Response(JSON.stringify({ success: true, message: 'Assistant deleted successfully' }), 
                              { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }); 
        } catch (error: any) {
          console.error('[ERROR] DELETE /assistants/:id:', error.message, error.stack);
          return new Response(JSON.stringify({ success: false, message: error.message || 'Failed to delete assistant' }), 
                              { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } });
        }
      }

      return new Response(JSON.stringify({ success: false, message: `Method ${req.method} not handled for /assistants${assistantId ? '/' + assistantId : ''}` }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ success: false, message: `Function ${functionName || 'root'} not found or method not handled.` }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (error: any) {
    console.error('[GLOBAL_ERROR]', error.message, error.stack);
    return new Response(
      JSON.stringify({ success: false, message: error.message || 'An unexpected error occurred.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
}) 