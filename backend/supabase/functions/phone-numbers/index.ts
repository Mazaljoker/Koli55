/**
 * Fonction Supabase Edge pour la gestion des numéros de téléphone Vapi
 * 
 * Endpoints:
 * - GET /phone-numbers - Liste tous les numéros disponibles
 * - GET /phone-numbers/:id - Récupère un numéro par ID
 * - POST /phone-numbers - Provisionne un nouveau numéro
 * - PATCH /phone-numbers/:id - Met à jour un numéro
 * - DELETE /phone-numbers/:id - Libère un numéro
 * - POST /phone-numbers/search - Recherche des numéros disponibles
 * - POST /phone-numbers/provision - Provisionne un numéro avec un fournisseur spécifique
 * 
 * Variables d'Entrée (Request):
 * 
 * GET /phone-numbers:
 *   - Query params: page (numéro de page), limit (nombre d'éléments par page)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * GET /phone-numbers/:id:
 *   - Path params: id (identifiant du numéro de téléphone)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * POST /phone-numbers:
 *   - Body: {
 *       phone_number: string (obligatoire, au format E.164),
 *       provider?: string (défaut: 'twilio'),
 *       friendly_name?: string
 *     }
 *   - Headers: Authorization (JWT token obligatoire, rôle admin requis)
 * 
 * PATCH /phone-numbers/:id:
 *   - Path params: id (identifiant du numéro de téléphone)
 *   - Body: {
 *       friendly_name?: string,
 *       assistant_id?: string,
 *       workflow_id?: string
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: updateNumberSchema
 * 
 * DELETE /phone-numbers/:id:
 *   - Path params: id (identifiant du numéro de téléphone)
 *   - Headers: Authorization (JWT token obligatoire, rôle admin requis)
 * 
 * POST /phone-numbers/search:
 *   - Body: {
 *       country: string (obligatoire, code pays ISO-2, ex: 'FR', 'US'),
 *       area_code?: string,
 *       capabilities?: string[],
 *       limit?: number (1-25)
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: searchNumbersSchema
 * 
 * POST /phone-numbers/provision:
 *   - Body: {
 *       phone_number: string (obligatoire, au format E.164),
 *       provider?: string (enum: 'twilio', 'telnyx', 'bandwidth'),
 *       friendly_name?: string
 *     }
 *   - Headers: Authorization (JWT token obligatoire, rôle admin requis)
 *   - Validation: provisionNumberSchema
 * 
 * Variables de Sortie (Response):
 * 
 * GET /phone-numbers:
 *   - Succès: {
 *       data: PhoneNumber[], // Liste des numéros de téléphone
 *       pagination: {
 *         page: number,
 *         limit: number,
 *         total: number,
 *         has_more: boolean
 *       }
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * GET /phone-numbers/:id:
 *   - Succès: { data: PhoneNumber }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /phone-numbers:
 *   - Succès: { data: PhoneNumber }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * PATCH /phone-numbers/:id:
 *   - Succès: { data: PhoneNumber }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * DELETE /phone-numbers/:id:
 *   - Succès: { success: true }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /phone-numbers/search:
 *   - Succès: { 
 *       data: {
 *         phone_numbers: Array<{
 *           phone_number: string,
 *           provider: string,
 *           country: string,
 *           capabilities: string[]
 *         }>
 *       }
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /phone-numbers/provision:
 *   - Succès: { data: PhoneNumber }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * Structure PhoneNumber conforme à l'interface de l'API Vapi:
 * {
 *   id: string,
 *   phone_number: string,
 *   friendly_name?: string,
 *   provider: string,
 *   country: string,
 *   capabilities: string[],
 *   active: boolean,
 *   assistant_id?: string,
 *   workflow_id?: string,
 *   created_at: string,
 *   updated_at: string
 * }
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, notFoundError, validationError } from '../shared/errors.ts'
import { authenticate, verifyAdmin } from '../shared/auth.ts'
import { validateInput, validatePagination, ValidationSchema } from '../shared/validation.ts'
import { 
  vapiPhoneNumbers, 
  VapiPhoneNumber, 
  PhoneNumberProvisionParams, 
  PhoneNumberUpdateParams,
  PhoneNumberSearchParams,
  PhoneNumberSearchResult
} from '../shared/vapi.ts'

// Utilitaire pour accéder à Deno avec typage
const DenoEnv = {
  get: (key: string): string | undefined => {
    // @ts-ignore - Deno existe dans l'environnement d'exécution
    return typeof Deno !== 'undefined' ? Deno.env.get(key) : undefined;
  }
};

// Schéma de validation pour la recherche de numéros
const searchNumbersSchema: ValidationSchema = {
  country: { 
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 2,
    message: 'Le code pays doit être au format ISO-2 (ex: FR, US)'
  },
  area_code: { 
    type: 'string'
  },
  capabilities: { 
    type: 'array'
  },
  limit: { 
    type: 'number',
    min: 1,
    max: 25
  }
}

// Schéma de validation pour la provision d'un numéro
const provisionNumberSchema: ValidationSchema = {
  phone_number: { 
    type: 'string',
    required: true,
    pattern: /^\+[1-9]\d{1,14}$/, // Format E.164
    message: 'Le numéro de téléphone doit être au format E.164 (ex: +33612345678)'
  },
  provider: { 
    type: 'string',
    enum: ['twilio', 'telnyx', 'bandwidth'],
    message: 'Le fournisseur doit être l\'un des suivants : twilio, telnyx, bandwidth'
  },
  friendly_name: { 
    type: 'string',
    maxLength: 100
  }
}

// Schéma de validation pour la mise à jour d'un numéro
const updateNumberSchema: ValidationSchema = {
  friendly_name: { 
    type: 'string',
    maxLength: 100
  },
  assistant_id: { 
    type: 'string'
  },
  workflow_id: { 
    type: 'string'
  }
}

/**
 * Fonctions utilitaires pour mapper les données entre notre format DB/frontend et le format Vapi
 */

/**
 * Convertit les données de recherche du format frontend/DB au format Vapi
 * 
 * @param searchData - Données de recherche
 */
function mapToVapiSearchFormat(searchData: any): PhoneNumberSearchParams {
  console.log(`[MAPPING] mapToVapiSearchFormat - Input: ${JSON.stringify(searchData, null, 2)}`);
  
  const payload: PhoneNumberSearchParams = {
    country: searchData.country
  };
  
  if (searchData.area_code !== undefined) {
    payload.area_code = searchData.area_code;
  }
  
  if (searchData.capabilities !== undefined) {
    payload.capabilities = searchData.capabilities;
  }
  
  if (searchData.limit !== undefined) {
    payload.limit = searchData.limit;
  }
  
  console.log(`[MAPPING] mapToVapiSearchFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
}

/**
 * Convertit les données de provision du format frontend/DB au format Vapi
 * 
 * @param provisionData - Données de provision
 */
function mapToVapiProvisionFormat(provisionData: any): PhoneNumberProvisionParams {
  console.log(`[MAPPING] mapToVapiProvisionFormat - Input: ${JSON.stringify(provisionData, null, 2)}`);
  
  const payload: PhoneNumberProvisionParams = {
    phone_number: provisionData.phone_number
  };
  
  if (provisionData.provider !== undefined) {
    payload.provider = provisionData.provider;
  }
  
  if (provisionData.friendly_name !== undefined) {
    payload.friendly_name = provisionData.friendly_name;
  }
  
  console.log(`[MAPPING] mapToVapiProvisionFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
}

/**
 * Convertit les données de mise à jour du format frontend/DB au format Vapi
 * 
 * @param updateData - Données de mise à jour
 */
function mapToVapiUpdateFormat(updateData: any): PhoneNumberUpdateParams {
  console.log(`[MAPPING] mapToVapiUpdateFormat - Input: ${JSON.stringify(updateData, null, 2)}`);
  
  const payload: PhoneNumberUpdateParams = {};
  
  if (updateData.friendly_name !== undefined) {
    payload.friendly_name = updateData.friendly_name;
  }
  
  if (updateData.assistant_id !== undefined) {
    payload.assistant_id = updateData.assistant_id;
  }
  
  if (updateData.workflow_id !== undefined) {
    payload.workflow_id = updateData.workflow_id;
  }
  
  console.log(`[MAPPING] mapToVapiUpdateFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
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
    
    // Vérification qu'on a au moins le segment 'phone-numbers'
    if (pathSegments.length === 0 || pathSegments[0] !== 'phone-numbers') {
      throw validationError('Chemin d\'URL invalide')
    }
    
    // Extraction de l'ID du numéro de téléphone si présent
    const phoneNumberId = pathSegments.length >= 2 ? pathSegments[1] : null
    
    // Action spéciale: recherche de numéros disponibles
    if (req.method === 'POST' && pathSegments.length === 2 && pathSegments[1] === 'search') {
      console.log(`[HANDLER] POST /phone-numbers/search - Recherche de numéros disponibles`);
      
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, searchNumbersSchema)
      
      // Utiliser notre fonction de mapping et l'API PhoneNumber
      const searchParams = mapToVapiSearchFormat(validatedData);
      const searchResult = await vapiPhoneNumbers.search(searchParams);
      
      console.log(`[VAPI_SUCCESS] Search phone numbers - found: ${searchResult.phone_numbers?.length || 0} numbers`);
      
      return new Response(JSON.stringify({ data: searchResult }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Action spéciale: provision d'un numéro spécifique
    if (req.method === 'POST' && pathSegments.length === 2 && pathSegments[1] === 'provision') {
      console.log(`[HANDLER] POST /phone-numbers/provision - Provision d'un numéro spécifique`);
      
      // Cette opération nécessite des privilèges d'administrateur
      verifyAdmin(user)
      
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, provisionNumberSchema)
      
      // Utiliser notre fonction de mapping et l'API PhoneNumber
      const provisionParams = mapToVapiProvisionFormat(validatedData);
      const provisionResult = await vapiPhoneNumbers.provision(provisionParams);
      
      console.log(`[VAPI_SUCCESS] Provisioned phone number: ${provisionResult.id}`, provisionResult);
      
      return new Response(JSON.stringify({ data: provisionResult }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /phone-numbers - Liste de tous les numéros de téléphone
    if (req.method === 'GET' && !phoneNumberId) {
      console.log(`[HANDLER] GET /phone-numbers - Liste des numéros de téléphone`);
      
      const { page, limit } = validatePagination(url.searchParams)
      
      const phoneNumbers = await vapiPhoneNumbers.list({
        limit: limit,
        offset: (page - 1) * limit
      });
      
      console.log(`[VAPI_SUCCESS] Listed ${phoneNumbers.data?.length || 0} phone numbers`);
      
      return new Response(JSON.stringify({
        data: phoneNumbers.data,
        pagination: {
          page,
          limit,
          total: phoneNumbers.pagination?.total || 0,
          has_more: phoneNumbers.pagination?.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /phone-numbers/:id - Récupération d'un numéro de téléphone spécifique
    if (req.method === 'GET' && phoneNumberId) {
      console.log(`[HANDLER] GET /phone-numbers/${phoneNumberId} - Récupération d'un numéro de téléphone`);
      
      let phoneNumber: VapiPhoneNumber;
      try {
        phoneNumber = await vapiPhoneNumbers.retrieve(phoneNumberId);
        console.log(`[VAPI_SUCCESS] Retrieved phone number: ${phoneNumberId}`, phoneNumber);
      } catch (error) {
        console.error(`[VAPI_ERROR] GET /phone-numbers/${phoneNumberId} - Failed to retrieve:`, error);
        throw notFoundError(`Numéro de téléphone avec l'ID ${phoneNumberId} non trouvé`);
      }
      
      return new Response(JSON.stringify({ data: phoneNumber }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /phone-numbers - Création d'un nouveau numéro de téléphone
    if (req.method === 'POST' && !phoneNumberId) {
      console.log(`[HANDLER] POST /phone-numbers - Création d'un nouveau numéro de téléphone`);
      
      // Cette opération nécessite des privilèges d'administrateur
      verifyAdmin(user)
      
      const data = await req.json()
      const validatedData = validateInput(data, provisionNumberSchema)
      
      // Utiliser notre fonction de mapping et l'API PhoneNumber
      const phoneNumberParams = mapToVapiProvisionFormat(validatedData);
      
      // Créer le numéro de téléphone via notre API Vapi
      const phoneNumber = await vapiPhoneNumbers.create(phoneNumberParams);
      console.log(`[VAPI_SUCCESS] Created phone number: ${phoneNumber.id}`, phoneNumber);
      
      return new Response(JSON.stringify({ data: phoneNumber }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /phone-numbers/:id - Mise à jour d'un numéro de téléphone
    if (req.method === 'PATCH' && phoneNumberId) {
      console.log(`[HANDLER] PATCH /phone-numbers/${phoneNumberId} - Mise à jour d'un numéro de téléphone`);
      
      const data = await req.json()
      const validatedData = validateInput(data, updateNumberSchema)
      
      // Utiliser notre fonction de mapping et l'API PhoneNumber
      const updateParams = mapToVapiUpdateFormat(validatedData);
      
      // Mettre à jour le numéro de téléphone via notre API Vapi
      const phoneNumber = await vapiPhoneNumbers.update(phoneNumberId, updateParams);
      console.log(`[VAPI_SUCCESS] Updated phone number: ${phoneNumberId}`, phoneNumber);
      
      return new Response(JSON.stringify({ data: phoneNumber }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /phone-numbers/:id - Suppression d'un numéro de téléphone
    if (req.method === 'DELETE' && phoneNumberId) {
      console.log(`[HANDLER] DELETE /phone-numbers/${phoneNumberId} - Suppression d'un numéro de téléphone`);
      
      // Cette opération nécessite des privilèges d'administrateur
      verifyAdmin(user)
      
      // Supprimer le numéro de téléphone via notre API Vapi
      await vapiPhoneNumbers.delete(phoneNumberId);
      console.log(`[VAPI_SUCCESS] Deleted phone number: ${phoneNumberId}`);
      
      return new Response(JSON.stringify({ success: true }), {
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