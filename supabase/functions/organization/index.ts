/**
 * Fonction Supabase Edge pour la gestion de l'organisation Vapi
 * 
 * Endpoints:
 * - GET /organization - Récupère les détails de l'organisation
 * - PATCH /organization - Met à jour l'organisation
 * - GET /organization/limits - Obtient les limites d'utilisation
 * 
 * Variables d'Entrée (Request):
 * 
 * GET /organization:
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * PATCH /organization:
 *   - Body: {
 *       name?: string (3-100 caractères),
 *       description?: string (max 500 caractères),
 *       webhook_url?: string (URL valide),
 *       trusted_origins?: string[],
 *       metadata?: object
 *     }
 *   - Headers: Authorization (JWT token obligatoire, rôle admin requis)
 *   - Validation: updateOrganizationSchema
 * 
 * GET /organization/limits:
 *   - Headers: Authorization (JWT token obligatoire, rôle admin requis)
 * 
 * Variables de Sortie (Response):
 * 
 * GET /organization:
 *   - Succès: { 
 *       data: VapiOrganization // Structure détaillée de l'organisation
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * PATCH /organization:
 *   - Succès: { 
 *       data: VapiOrganization // Structure détaillée de l'organisation mise à jour
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * GET /organization/limits:
 *   - Succès: { 
 *       data: VapiLimits // Structure des limites d'utilisation de l'API Vapi
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * Structure VapiOrganization conforme à l'interface VapiOrganization de shared/vapi.ts:
 * {
 *   id: string,
 *   name: string,
 *   description?: string,
 *   webhook_url?: string,
 *   trusted_origins?: string[],
 *   metadata?: Record<string, any>,
 *   created_at: string,
 *   updated_at: string
 * }
 * 
 * Structure VapiLimits conforme à l'interface VapiLimits de shared/vapi.ts.
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, validationError } from '../shared/errors.ts'
import { authenticate, verifyAdmin } from '../shared/auth.ts'
import { validateInput, ValidationSchema } from '../shared/validation.ts'
import { 
  vapiOrganization,
  OrganizationUpdateParams 
} from '../shared/vapi.ts'

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
    pattern: /^https?:\/\/.+$/i
  },
  trusted_origins: {
    type: 'array'
  },
  metadata: { 
    type: 'object'
  }
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    const user = await authenticate(req)
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(segment => segment).slice(1);

    const action = pathSegments[0]

    // GET /organization/limits - Obtient les limites d'utilisation
    if (req.method === 'GET' && action === 'limits') {
      verifyAdmin(user)
      const limits = await vapiOrganization.getLimits()
      return new Response(JSON.stringify({ data: limits }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /organization - Récupération des détails de l'organisation
    if (req.method === 'GET' && !action) {
      const organizationDetails = await vapiOrganization.retrieve()
      return new Response(JSON.stringify({ data: organizationDetails }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /organization - Mise à jour de l'organisation
    if (req.method === 'PATCH' && !action) {
      verifyAdmin(user)
      const data = await req.json()
      const validatedData = validateInput<OrganizationUpdateParams>(data, updateOrganizationSchema)
      const organization = await vapiOrganization.update(validatedData)
      return new Response(JSON.stringify({ data: organization }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Méthode non supportée si aucune route ne correspond
    return new Response(JSON.stringify({ 
      error: 'Endpoint non trouvé ou méthode non supportée' 
    }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders }
    })
    
  } catch (error) {
    return errorResponse(error)
  }
}) 