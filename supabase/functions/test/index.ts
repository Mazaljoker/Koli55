// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// This function has been set to not require authentication in the Supabase dashboard

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Simple test response with the Vapi API key (masked for security)
    const vapiApiKey = Deno.env.get('VAPI_API_KEY') || ''
    const maskedKey = vapiApiKey ? 
      `${vapiApiKey.substring(0, 4)}...${vapiApiKey.substring(vapiApiKey.length - 4)}` : 
      'Not set'
    
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Supabase Edge Function deployed successfully!',
        vapi_key_status: vapiApiKey ? 'Set' : 'Not set',
        vapi_key_preview: maskedKey
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders } 
      }
    )
  }
}) 