/**
 * Fonction Supabase Edge pour la gestion des messages dans les appels Vapi
 * 
 * Endpoints:
 * - GET /messages/:callId - Liste tous les messages d'un appel
 * - POST /messages/:callId - Ajoute un message à un appel
 * - GET /messages/:callId/:messageId - Récupère un message spécifique par ID
 * 
 * Variables d'Entrée (Request):
 * 
 * GET /messages/:callId:
 *   - Path params: callId (identifiant de l'appel)
 *   - Query params: limit (nombre maximum de messages à retourner)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * POST /messages/:callId:
 *   - Path params: callId (identifiant de l'appel)
 *   - Body: {
 *       role: string (obligatoire, enum: 'system', 'user', 'assistant', 'function', 'tool'),
 *       content: string (obligatoire, contenu du message),
 *       name?: string (nom optionnel, utile pour les messages de type function),
 *       metadata?: object (métadonnées personnalisées)
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: createMessageSchema
 * 
 * GET /messages/:callId/:messageId:
 *   - Path params: callId (identifiant de l'appel), messageId (identifiant du message)
 *   - Headers: Authorization (JWT token obligatoire)
 * 
 * Variables de Sortie (Response):
 * 
 * GET /messages/:callId:
 *   - Succès: {
 *       data: Message[], // Liste des messages de l'appel
 *       pagination: {
 *         has_more: boolean
 *       }
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * POST /messages/:callId:
 *   - Succès: { data: Message }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * GET /messages/:callId/:messageId:
 *   - Succès: { data: Message }
 *   - Erreur: FormattedError de shared/errors.ts
 * 
 * Structure Message conforme à l'interface de l'API Vapi
 * {
 *   id: string,
 *   role: 'system' | 'user' | 'assistant' | 'function' | 'tool',
 *   content: string,
 *   name?: string,
 *   call_id: string,
 *   metadata?: object,
 *   created_at: string
 * }
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, notFoundError, validationError } from '../shared/errors.ts'
import { authenticate } from '../shared/auth.ts'
import { validateInput, validatePagination, ValidationSchema } from '../shared/validation.ts'
import { callVapiAPI } from '../shared/vapi.ts'

// Utilitaire pour accéder à Deno avec typage
const DenoEnv = {
  get: (key: string): string | undefined => {
    // @ts-ignore - Deno existe dans l'environnement d'exécution
    return typeof Deno !== 'undefined' ? Deno.env.get(key) : undefined;
  }
};

const vapiApiKey = DenoEnv.get('VAPI_API_KEY') || ''

// Schéma de validation pour l'ajout d'un message
const createMessageSchema: ValidationSchema = {
  role: { 
    type: 'string',
    required: true,
    enum: ['system', 'user', 'assistant', 'function', 'tool']
  },
  content: { 
    type: 'string',
    required: true
  },
  name: { 
    type: 'string'
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
    
    // Vérifier que le premier segment est présent (callId)
    if (pathSegments.length < 2) {
      throw validationError('ID d\'appel manquant dans l\'URL')
    }
    
    const callId = pathSegments[1]
    const messageId = pathSegments.length >= 3 ? pathSegments[2] : null
    
    // Vérifier que l'appel existe
    const callResponse = await callVapiAPI(`calls/${callId}`, vapiApiKey, 'GET', undefined)
    const call = await callResponse.json()
    if (!call || callResponse.status === 404) {
      throw notFoundError(`Appel avec l'ID ${callId} non trouvé`)
    }
    
    // GET /messages/:callId/:messageId - Récupérer un message spécifique
    if (req.method === 'GET' && messageId) {
      // Récupération des messages de l'appel
      const messagesResponse = await callVapiAPI(`calls/${callId}/messages`, vapiApiKey, 'GET', undefined)
      const messagesData = await messagesResponse.json()
      
      // Recherche du message spécifique
      const message = messagesData.data.find((msg: any) => msg.id === messageId)
      
      if (!message) {
        throw notFoundError(`Message avec l'ID ${messageId} non trouvé`)
      }
      
      return new Response(JSON.stringify({ data: message }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /messages/:callId - Lister tous les messages d'un appel
    if (req.method === 'GET') {
      // Paramètres de pagination (si utilisés par l'API Vapi)
      const limit = parseInt(url.searchParams.get('limit') || '50', 10)
      
      // Récupération des messages de l'appel
      const messagesResponse = await callVapiAPI(
        `calls/${callId}/messages?limit=${limit}`, 
        vapiApiKey, 
        'GET', 
        undefined
      )
      const messagesData = await messagesResponse.json()
      
      return new Response(JSON.stringify({
        data: messagesData.data,
        pagination: messagesData.pagination || { has_more: false }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /messages/:callId - Ajouter un message à un appel
    if (req.method === 'POST') {
      // Récupération des données du corps de la requête
      const data = await req.json()
      
      // Validation des données
      const validatedData = validateInput(data, createMessageSchema)
      
      // Ajout des métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id
      }
      
      // Ajout du message à l'appel via l'API Vapi
      const messageResponse = await callVapiAPI(
        `calls/${callId}/messages`, 
        vapiApiKey, 
        'POST', 
        validatedData
      )
      const message = await messageResponse.json()
      
      return new Response(JSON.stringify({ data: message }), {
        status: 201,
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