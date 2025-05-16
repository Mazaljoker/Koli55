// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient, SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../shared/cors.ts'

// Fonction pour faire des requêtes à l'API Vapi
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
            model: requestData.model, // Assuming model is a simple string for DB, adjust if it's an object
            language: requestData.language,
            voice: requestData.voice, // Assuming voice is a simple string for DB, adjust if it's an object
            first_message: requestData.firstMessage,
            system_prompt: requestData.instructions, // Align with your table schema
            // `vapi_assistant_id` will be null or not set initially
            // Add other fields from requestData that match your table schema
            metadata: requestData.metadata, // if you have a metadata JSONB field
            tools_config: requestData.tools_config, // if you store this as JSONB
            forwarding_phone_number: requestData.forwarding_phone_number
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

          // 3. Prepare payload and call Vapi API
          const vapiAssistantPayload: any = {
            name: dbAssistant.name, // Use data from DB for consistency
          };
          // Reconstruct Vapi-specific model object if necessary
          if (dbAssistant.model || dbAssistant.system_prompt) {
            vapiAssistantPayload.model = { 
              provider: requestData.model?.provider || "openai", // or get from dbAssistant if stored structured
              model: requestData.model?.model || dbAssistant.model || "gpt-4o", 
              systemPrompt: dbAssistant.system_prompt 
            };
          }
          // Reconstruct Vapi-specific voice object if necessary
          if (requestData.voice?.provider && requestData.voice?.voiceId) { // if voice stored as object in request
             vapiAssistantPayload.voice = { provider: requestData.voice.provider, voiceId: requestData.voice.voiceId };
          } else if (dbAssistant.voice) { // or if stored as a simple string that needs mapping
             // This part needs logic if your dbAssistant.voice is e.g. "elevenlabs-xyz" 
             // and needs to be { provider: "elevenlabs", voiceId: "xyz" }
             // For now, assuming requestData.voice is structured or dbAssistant.voice is simple and Vapi accepts it
          }
          if (dbAssistant.first_message) vapiAssistantPayload.firstMessage = dbAssistant.first_message;
          if (dbAssistant.tools_config) vapiAssistantPayload.tools = dbAssistant.tools_config; 
          if (dbAssistant.forwarding_phone_number) vapiAssistantPayload.forwardingPhoneNumber = dbAssistant.forwarding_phone_number;
          // Add any other Vapi-specific fields from requestData or dbAssistant
          
          let createdVapiAssistant: any;
          let finalAssistantData = dbAssistant;

          try {
            createdVapiAssistant = await callVapiAPI('/assistant', vapiApiKey, 'POST', vapiAssistantPayload);
            console.log(`[VAPI_SUCCESS] POST /assistant:`, createdVapiAssistant);

            // 4. Update Supabase record with vapi_assistant_id
            if (createdVapiAssistant && createdVapiAssistant.id) {
              const { data: updatedDbAssistant, error: dbUpdateError } = await supabaseClient
                .from('assistants')
                .update({ vapi_assistant_id: createdVapiAssistant.id })
                .eq('id', dbAssistant.id)
                .select()
                .single();

              if (dbUpdateError) {
                console.error('[DB_ERROR] POST /assistants - Failed to update assistant with vapi_id:', dbUpdateError);
                // Non-fatal for the client, but log it. The assistant exists in DB and Vapi.
                // Client gets DB version without vapi_id linked if this fails.
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
            // Return the DB version with a warning or specific error message.
            // Depending on strategy, you might want to delete the DB entry or mark it as needing sync.
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
          if (requestData.name !== undefined) updatePayload.name = requestData.name;
          if (requestData.model !== undefined) updatePayload.model = requestData.model; // Adjust if model is object
          if (requestData.language !== undefined) updatePayload.language = requestData.language;
          if (requestData.voice !== undefined) updatePayload.voice = requestData.voice; // Adjust if voice is object
          if (requestData.firstMessage !== undefined) updatePayload.firstMessage = requestData.firstMessage;
          if (requestData.instructions !== undefined) updatePayload.system_prompt = requestData.instructions;
          if (requestData.metadata !== undefined) updatePayload.metadata = requestData.metadata;
          if (requestData.tools_config !== undefined) updatePayload.tools_config = requestData.tools_config;
          if (requestData.forwarding_phone_number !== undefined) updatePayload.forwarding_phone_number = requestData.forwarding_phone_number;
          // Important: `updated_at` will be handled by the trigger

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
            // Construct Vapi payload carefully - only include fields Vapi accepts for PATCH
            // And only those that were actually part of the updatePayload for our DB
            const vapiUpdatePayload: any = {};
            if (updatePayload.name !== undefined) vapiUpdatePayload.name = updatePayload.name;
            if (updatePayload.model !== undefined || updatePayload.system_prompt !== undefined) {
                vapiUpdatePayload.model = {
                    provider: requestData.model?.provider || "openai",
                    model: requestData.model?.model || updatedDbAssistant.model || "gpt-4o",
                    systemPrompt: updatedDbAssistant.system_prompt
                };
            }
            if (requestData.voice?.provider && requestData.voice?.voiceId) {
                vapiUpdatePayload.voice = { provider: requestData.voice.provider, voiceId: requestData.voice.voiceId };
            } else if (updatePayload.voice) {
                // Add logic if simple string in DB needs to be an object for Vapi
            }
            if (updatePayload.firstMessage !== undefined) vapiUpdatePayload.firstMessage = updatePayload.firstMessage;
            if (updatePayload.tools_config !== undefined) vapiUpdatePayload.tools = updatePayload.tools_config;
            if (updatePayload.forwarding_phone_number !== undefined) vapiUpdatePayload.forwardingPhoneNumber = updatePayload.forwarding_phone_number;
            // Add other Vapi-relevant fields from updatePayload

            if (Object.keys(vapiUpdatePayload).length > 0) {
              try {
                const vapiResponse = await callVapiAPI(`/assistant/${existingAssistant.vapi_assistant_id}`, vapiApiKey, 'PATCH', vapiUpdatePayload);
                console.log(`[VAPI_SUCCESS] PATCH /assistant/${existingAssistant.vapi_assistant_id}`, vapiResponse);
                // Vapi PATCH usually returns the updated assistant. We don't necessarily need to use its response
                // if our DB is the source of truth, but good to log.
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
              console.log(`[VAPI_SYNC] PATCH /assistants/${assistantId} - No Vapi-relevant fields changed or payload empty, skipping Vapi update.`);
            }
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
              await callVapiAPI(`/assistant/${existingAssistant.vapi_assistant_id}`, vapiApiKey, 'DELETE');
              console.log(`[VAPI_SUCCESS] DELETE /assistant/${existingAssistant.vapi_assistant_id} - Assistant deleted from Vapi.`);
            } catch (vapiError: any) {
              console.error(`[VAPI_ERROR] DELETE /assistants/${assistantId} - Vapi API call failed:`, vapiError.message);
              // Log the error. Depending on policy, you might choose to proceed with DB deletion or halt.
              // For now, we proceed with DB deletion even if Vapi fails, but warn the client.
              // A more robust system might queue this for later or prevent DB deletion if Vapi fails and it's critical.
              return new Response(JSON.stringify({ 
                success: false, // Or true if DB deletion is prime and Vapi is secondary
                message: 'Failed to delete assistant from Vapi. Database deletion pending. Manual check may be required.',
                vapi_error: vapiError.message
              }), { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }); // 502 Bad Gateway or another appropriate error
            }
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
                              { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }); // Or 204 No Content with null body
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