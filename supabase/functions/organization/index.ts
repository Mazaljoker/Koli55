/**
 * Fonction Supabase Edge pour la gestion de l'organisation Vapi
 * Endpoints:
 * - GET / - Récupère les détails de l'organisation
 * - PATCH / - Met à jour l'organisation
 * - GET /limits - Obtient les limites d'utilisation
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, validationError } from '../shared/errors.ts'
import { authenticate, verifyAdmin } from '../shared/auth.ts'
import { validateInput, ValidationSchema } from '../shared/validation.ts'

// Configuration de l'accès à l'API Vapi
// @deno-types="https://esm.sh/@vapi-ai/server-sdk@1.2.1"
import { VapiClient } from 'https://esm.sh/@vapi-ai/server-sdk@1.2.1'

// Utilitaire pour accéder à Deno avec typage
const DenoEnv = {
  get: (key: string): string | undefined => {
    // @ts-ignore - Deno existe dans l'environnement d'exécution
    return typeof Deno !== 'undefined' ? Deno.env.get(key) : undefined;
  }
};

const vapiApiKey = DenoEnv.get('VAPI_API_KEY') || ''
const vapiClient = new VapiClient({ token: vapiApiKey })

// Schéma de validation pour la mise à jour de l'organisation
const updateOrganizationSchema: ValidationSchema = {
  name: { 
    type: 'string',
    minLength: 3,
    maxLength: 100
  },
  description: { 
    type: 'string',
    maxLength: 500
  },
  webhook_url: { 
    type: 'string',
    pattern: /^https?:\/\/.*$/
  },
  metadata: { 
    type: 'object'
  }
}

serve(async (req: Request) => {
  // Gestion des requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Authentification de l'utilisateur
    const user = await authenticate(req)
    
    // Récupération de l'URL pour le routage
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(segment => segment)
    
    // Vérification qu'on a au moins le segment 'organization'
    if (pathSegments.length === 0 || pathSegments[0] !== 'organization') {
      return new Response(JSON.stringify({ 
        error: 'Chemin d\'URL invalide' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Action spéciale: obtenir les limites d'utilisation
    if (req.method === 'GET' && pathSegments.length === 2 && pathSegments[1] === 'limits') {
      // Pour cette route, seuls les administrateurs peuvent accéder aux limites
      verifyAdmin(user)
      
      // Récupération des limites via l'API Vapi
      const limits = await vapiClient.organization.getLimits()
      
      return new Response(JSON.stringify({ data: limits }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /organization - Récupération des détails de l'organisation
    if (req.method === 'GET' && pathSegments.length === 1) {
      // Récupération des détails de l'organisation via l'API Vapi
      const organizationDetails = await vapiClient.organization.retrieve()
      
      return new Response(JSON.stringify({ data: organizationDetails }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /organization - Mise à jour de l'organisation
    if (req.method === 'PATCH' && pathSegments.length === 1) {
      // Pour cette route, seuls les administrateurs peuvent mettre à jour l'organisation
      verifyAdmin(user)
      
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, updateOrganizationSchema)
      
      // Mise à jour de l'organisation via l'API Vapi
      const organization = await vapiClient.organization.update(validatedData)
      
      return new Response(JSON.stringify({ data: organization }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Méthode non supportée
    return new Response(JSON.stringify({ 
      error: 'Méthode non supportée' 
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
    
  } catch (error) {
    return errorResponse(error)
  }
}) 