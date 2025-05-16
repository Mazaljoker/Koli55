// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

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

  console.log(`[DEBUG] Calling Vapi API: ${method} ${url}`);
  if (body) {
    console.log(`[DEBUG] Request body: ${JSON.stringify(body)}`);
  }

  try {
    console.log(`[DEBUG] Fetch starting with options:`, options);
    const response = await fetch(url, options);
    
    console.log(`[DEBUG] Fetch response status: ${response.status}`);
    const responseText = await response.text();
    console.log(`[DEBUG] Fetch response text: ${responseText}`);
    
    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { raw_error: responseText };
      }
      
      console.error(`[ERROR] API request failed with status ${response.status}:`, errorData);
      throw new Error(errorData.message || errorData.raw_error || `API request failed with status ${response.status}`);
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log(`[DEBUG] API response: ${JSON.stringify(responseData).substring(0, 200)}...`);
    } catch (e) {
      console.error(`[ERROR] Failed to parse response as JSON: ${e.message}`);
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 200)}`);
    }
    
    return responseData;
  } catch (error: any) {
    console.error(`[ERROR] Error calling Vapi API: ${error.message}`);
    throw error;
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Récupération de la clé API Vapi
    // @ts-ignore - Deno est disponible dans l'environnement Supabase Edge Functions
    const vapiApiKey = Deno.env.get('VAPI_API_KEY') || ''
    console.log(`[DEBUG] Vapi API Key preview: ${vapiApiKey.substring(0, 4)}...${vapiApiKey.substring(vapiApiKey.length - 4)}`);
    
    if (!vapiApiKey) {
      throw new Error('VAPI_API_KEY not set')
    }
    
    // Récupération de l'URL pour le routage
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(segment => segment)
    
    console.log(`[DEBUG] Received request: ${req.method} ${url.pathname}`);
    
    // GET /assistants - Liste de tous les assistants
    if (req.method === 'GET' && pathSegments.length <= 1) {
      // Récupération des paramètres de pagination
      const page = parseInt(url.searchParams.get('page') || '1')
      const limit = parseInt(url.searchParams.get('limit') || '20')
      const offset = (page - 1) * limit
      
      // Appel à l'API Vapi pour récupérer les assistants
      try {
        const assistantsData = await callVapiAPI(`/assistant?limit=${limit}&offset=${offset}`, vapiApiKey, 'GET', null)
        
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Assistants retrieved successfully',
            data: assistantsData.data || [],
            pagination: assistantsData.pagination || {
              total: 0,
              has_more: false
            },
            raw_response: assistantsData
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      } catch (vapiError: any) {
        console.error('[ERROR] Vapi API error:', vapiError)
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Failed to retrieve assistants from Vapi API',
            error: vapiError instanceof Error ? vapiError.message : 'Unknown error',
            vapi_integration: true
          }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        )
      }
    }
    
    // POST /assistants - Créer un nouvel assistant
    if (req.method === 'POST' && pathSegments.length <= 1) {
      try {
        // Récupération des données du corps de la requête
        const requestData = await req.json().catch(() => ({}))
        console.log(`[DEBUG] POST assistant request data:`, requestData);
        
        // Validation des données minimales requises
        if (!requestData.name) {
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Assistant name is required',
            }),
            { 
              status: 400,
              headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            }
          )
        }
        
        // Création d'un objet de requête conforme à la documentation de l'API Vapi
        const assistantData: any = {
          name: requestData.name
        }
        
        // Configuration du modèle
        if (requestData.model) {
          assistantData.model = {
            provider: "openai",
            model: requestData.model
          }
        }
        
        // Configuration des instructions
        if (requestData.instructions) {
          if (!assistantData.model) {
            assistantData.model = { provider: "openai", model: "gpt-4o" }
          }
          assistantData.model.systemPrompt = requestData.instructions
        }
        
        // Configuration de la voix
        if (requestData.voice_id) {
          assistantData.voice = {
            provider: "elevenlabs",  // Changé à elevenlabs
            voiceId: requestData.voice_id
          }
        }
        
        // Message de début
        if (requestData.firstMessage) {
          assistantData.firstMessage = requestData.firstMessage
        }
        
        try {
          // Appel à l'API Vapi pour créer l'assistant
          console.log(`[DEBUG] Calling Vapi API to create assistant with data:`, assistantData);
          const createdAssistant = await callVapiAPI('/assistant', vapiApiKey, 'POST', assistantData);
          
          console.log(`[DEBUG] Successfully created assistant:`, createdAssistant);
          return new Response(
            JSON.stringify({
              success: true,
              message: 'Assistant created successfully',
              data: createdAssistant
            }),
            { 
              status: 201,  // Created
              headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            }
          );
        } catch (apiError: any) {
          console.error(`[ERROR] Error calling Vapi API to create assistant:`, apiError);
          return new Response(
            JSON.stringify({
              success: false,
              message: 'Failed to create assistant',
              error: apiError instanceof Error ? apiError.message : String(apiError),
              vapi_api_key_preview: `${vapiApiKey.substring(0, 4)}...${vapiApiKey.substring(vapiApiKey.length - 4)}`,
              request_data: assistantData,
              debug_info: {
                endpoint: '/assistant',
                method: 'POST'
              }
            }),
            { 
              status: 500,
              headers: { 'Content-Type': 'application/json', ...corsHeaders } 
            }
          );
        }
      } catch (createError: any) {
        console.error('[ERROR] Failed to create assistant:', createError)
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Failed to create assistant',
            error: createError instanceof Error ? createError.message : 'Unknown error'
          }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        )
      }
    }
    
    // Endpoint pour tester la connexion Vapi
    if (req.method === 'GET' && pathSegments.length === 2 && pathSegments[1] === 'test') {
      // Test simple de l'API Vapi
      try {
        const maskedKey = `${vapiApiKey.substring(0, 4)}...${vapiApiKey.substring(vapiApiKey.length - 4)}`
        
        return new Response(
          JSON.stringify({
            success: true,
            message: 'Vapi API key is valid',
            vapi_key_preview: maskedKey
          }),
          { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        )
      } catch (testError: any) {
        return new Response(
          JSON.stringify({
            success: false,
            message: 'Failed to test Vapi connection',
            error: testError instanceof Error ? testError.message : 'Unknown error'
          }),
          { 
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders } 
          }
        )
      }
    }
    
    // Requête non supportée
    return new Response(
      JSON.stringify({
        success: false,
        message: 'Unsupported request method or path',
        supportedMethods: ['GET', 'POST'],
        supportedPaths: ['/assistants', '/assistants/test']
      }),
      { 
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    )
  } catch (error: any) {
    console.error('[ERROR] Unhandled error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred', 
          status: 500 
        } 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    )
  }
}) 