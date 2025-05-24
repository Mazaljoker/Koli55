import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    console.log('[TEST_ASSISTANT] Starting request processing');
    
    // Récupérer les variables d'environnement
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const vapiApiKey = Deno.env.get('VAPI_API_KEY');
    
    console.log('[TEST_ASSISTANT] Environment check:', {
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseAnonKey: !!supabaseAnonKey,
      hasVapiApiKey: !!vapiApiKey
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Créer le client Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    if (req.method === 'POST') {
      const requestData = await req.json();
      console.log('[TEST_ASSISTANT] Request data:', requestData);

      // Préparer les données pour l'insertion
      const assistantData = {
        name: requestData.name || 'Test Assistant',
        model_provider: requestData.model?.provider || 'openai',
        model_name: requestData.model?.model || 'gpt-4',
        model_temperature: 0.7,
        model_max_tokens: 1500,
        voice: typeof requestData.voice === 'object' ? JSON.stringify(requestData.voice) : requestData.voice,
        language: requestData.language || 'fr-FR',
        first_message: requestData.firstMessage || 'Bonjour !',
        system_prompt: requestData.model?.systemMessage || requestData.instructions || 'Tu es un assistant vocal.',
        metadata: {
          created_via: 'test-assistant-function',
          created_at: new Date().toISOString()
        }
      };

      console.log('[TEST_ASSISTANT] Inserting assistant data:', assistantData);

      // Insérer dans la base de données
      const { data: dbAssistant, error: dbError } = await supabase
        .from('assistants')
        .insert(assistantData)
        .select()
        .single();

      if (dbError) {
        console.error('[TEST_ASSISTANT] Database error:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }

      console.log('[TEST_ASSISTANT] Assistant created successfully:', dbAssistant.id);

      return new Response(JSON.stringify({
        success: true,
        message: 'Assistant créé avec succès (test mode)',
        data: dbAssistant,
        environment: {
          hasVapiKey: !!vapiApiKey,
          vapiKeyLength: vapiApiKey ? vapiApiKey.length : 0
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 201
      });
    }

    return new Response(JSON.stringify({
      message: 'Test Assistant Function',
      method: req.method,
      environment: {
        hasVapiKey: !!vapiApiKey,
        vapiKeyLength: vapiApiKey ? vapiApiKey.length : 0
      }
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    });

  } catch (error: any) {
    console.error('[TEST_ASSISTANT] Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      stack: error.stack
    }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 500
    });
  }
}) 