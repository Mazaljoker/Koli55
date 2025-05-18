// Fonction Edge Hello World
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  
  // Test pour les clés Vapi
  const vapiApiKey = Deno.env.get('VAPI_API_KEY');
  const vapiHeaderKey = req.headers.get('X-Vapi-API-Key');
  
  return new Response(
    JSON.stringify({
      success: true,
      message: 'Hello from Edge Function!',
      timestamp: new Date().toISOString(),
      env_vapi_key: vapiApiKey ? 'exists' : 'not found',
      header_vapi_key: vapiHeaderKey ? 'exists' : 'not found'
    }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
  );
}); 