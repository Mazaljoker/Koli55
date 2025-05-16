// Simple shared utility for testing purposes

// Standardized CORS headers
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

// Helper for handling OPTIONS requests
export function handleCorsPreflightRequest() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

// Standardized error response
export function errorResponse(error: any) {
  console.error('Error:', error)
  
  const status = error.status || 500
  const message = error.message || 'An unexpected error occurred'
  
  return new Response(
    JSON.stringify({
      error: { message, status }
    }),
    {
      status,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    }
  )
}

// Standardized "not found" error
export function notFoundError(message: string) {
  return {
    status: 404,
    message: message || 'Resource not found'
  }
}

// Helper to access environment variables safely
export const DenoEnv = {
  get: (key: string): string | undefined => {
    // @ts-ignore - Deno exists in the runtime environment
    return typeof Deno !== 'undefined' ? Deno.env.get(key) : undefined
  }
} 