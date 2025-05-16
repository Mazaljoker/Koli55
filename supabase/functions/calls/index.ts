// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Check for VAPI API key
    const vapiApiKey = Deno.env.get('VAPI_API_KEY') || ''
    const maskedKey = vapiApiKey ? 
      `${vapiApiKey.substring(0, 4)}...${vapiApiKey.substring(vapiApiKey.length - 4)}` : 
      'Not set'
    
    // Return a simple response with details
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Calls function deployed successfully!',
        vapi_key_status: vapiApiKey ? 'Set' : 'Not set',
        vapi_key_preview: maskedKey,
        endpoints: {
          GET_ALL: '/calls',
          GET_ONE: '/calls/:id',
          CREATE: '/calls',
          UPDATE: '/calls/:id',
          DELETE: '/calls/:id',
          END_CALL: '/calls/:id/end',
          LISTEN: '/calls/:id/listen'
        }
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    )
  } catch (error) {
    console.error('Error:', error)
    
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