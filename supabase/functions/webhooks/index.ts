/**
 * Fonction Supabase Edge pour la gestion des webhooks Vapi
 * Endpoints:
 * - GET / - Liste tous les webhooks
 * - GET /:id - Récupère un webhook par ID
 * - POST / - Crée un nouveau webhook
 * - PATCH /:id - Met à jour un webhook
 * - DELETE /:id - Supprime un webhook
 * - POST /:id/ping - Teste un webhook
 * - POST /receive - Point d'entrée pour les événements Vapi (sans auth)
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../shared/cors.ts'
import { errorResponse, notFoundError, validationError } from '../shared/errors.ts'
import { authenticate, verifyAdmin } from '../shared/auth.ts'
import { validateInput, validatePagination, ValidationSchema } from '../shared/validation.ts'
import { vapiWebhooks, WebhookCreateParams, WebhookUpdateParams } from '../shared/vapi.ts'

// Utilitaire pour accéder à Deno avec typage
const DenoEnv = {
  get: (key: string): string | undefined => {
    // @ts-ignore - Deno existe dans l'environnement d'exécution
    return typeof Deno !== 'undefined' ? Deno.env.get(key) : undefined;
  }
};

const vapiApiKey = DenoEnv.get('VAPI_API_KEY') || ''

// Schéma de validation pour la création d'un webhook
const createWebhookSchema: ValidationSchema = {
  url: { 
    type: 'string',
    required: true,
    pattern: /^https?:\/\/.+/i,
    message: 'L\'URL du webhook doit être une URL valide'
  },
  events: { 
    type: 'array',
    required: true,
    message: 'Les événements à écouter sont requis'
  },
  description: { 
    type: 'string',
    maxLength: 255
  },
  enabled: {
    type: 'boolean'
  }
}

// Schéma de validation pour la mise à jour d'un webhook
const updateWebhookSchema: ValidationSchema = {
  url: { 
    type: 'string',
    pattern: /^https?:\/\/.+/i
  },
  events: { 
    type: 'array'
  },
  description: { 
    type: 'string',
    maxLength: 255
  },
  enabled: {
    type: 'boolean'
  }
}

// Fonction utilitaire pour vérifier la signature des webhooks Vapi
function verifyWebhookSignature(req: Request, body: string): boolean {
  const signature = req.headers.get('x-vapi-signature')
  const timestamp = req.headers.get('x-vapi-timestamp')
  
  if (!signature || !timestamp) {
    return false
  }
  
  // Dans une implémentation réelle, vérifier la signature avec une clé secrète
  // Pour l'instant, considérons que c'est valide si la signature existe
  return true
}

// Fonction de gestion des événements Vapi
async function handleVapiEvent(event: any): Promise<void> {
  // En fonction du type d'événement, effectuer différentes actions
  const eventType = event.type || 'unknown'
  
  // Exemple: journaliser les événements dans Supabase, mettre à jour des statistiques, etc.
  console.log(`Événement Vapi reçu: ${eventType}`, event)
  
  switch (eventType) {
    case 'call.started':
      // Enregistrer le début d'un appel
      break
      
    case 'call.ended':
      // Enregistrer la fin d'un appel et ses métadonnées
      break
      
    case 'message.created':
      // Enregistrer un nouveau message
      break
      
    case 'error':
      // Gérer les erreurs
      console.error('Erreur Vapi:', event.error)
      break
  }
}

serve(async (req: Request) => {
  // Gestion des requêtes CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }
  
  // Récupération de l'URL pour le routage
  const url = new URL(req.url)
  const pathSegments = url.pathname.split('/').filter(segment => segment)
  
  try {
    // Cas spécial: endpoint de réception des webhooks (sans authentification)
    if (req.method === 'POST' && pathSegments.length === 2 && pathSegments[1] === 'receive') {
      // Récupérer le corps de la requête
      const bodyText = await req.text()
      let event
      
      try {
        event = JSON.parse(bodyText)
      } catch (e) {
        throw validationError('Corps de requête JSON invalide')
      }
      
      // Vérifier la signature du webhook (sécurité)
      if (!verifyWebhookSignature(req, bodyText)) {
        return new Response(JSON.stringify({ error: 'Signature de webhook invalide' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        })
      }
      
      // Traiter l'événement de manière asynchrone
      handleVapiEvent(event)
      
      // Répondre immédiatement avec un succès (requis par Vapi)
      return new Response(JSON.stringify({ success: true }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // Pour toutes les autres routes, l'authentification est requise
    const user = await authenticate(req)
    
    // Action spéciale: tester un webhook
    if (req.method === 'POST' && pathSegments.length === 3 && pathSegments[2] === 'ping') {
      const webhookId = pathSegments[1]
      
      await vapiWebhooks.ping(webhookId)
      
      return new Response(JSON.stringify({ success: true, message: 'Webhook testé avec succès' }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /webhooks - Liste de tous les webhooks
    if (req.method === 'GET' && pathSegments.length <= 1) {
      const { page, limit } = validatePagination(url.searchParams)
      
      const webhooksResult = await vapiWebhooks.list({
        limit,
        offset: (page - 1) * limit
      })
      
      return new Response(JSON.stringify({
        data: webhooksResult.data,
        pagination: {
          page,
          limit,
          total: webhooksResult.pagination.total || 0,
          has_more: webhooksResult.pagination.has_more || false
        }
      }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // GET /webhooks/:id - Récupération d'un webhook spécifique
    if (req.method === 'GET' && pathSegments.length === 2) {
      const webhookId = pathSegments[1]
      
      const webhook = await vapiWebhooks.retrieve(webhookId)
      
      if (!webhook) {
        throw notFoundError(`Webhook avec l'ID ${webhookId} non trouvé`)
      }
      
      return new Response(JSON.stringify({ data: webhook }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // POST /webhooks - Création d'un nouveau webhook
    if (req.method === 'POST' && pathSegments.length <= 1) {
      verifyAdmin(user)
      const data = await req.json()
      const validatedData = validateInput<WebhookCreateParams>(data, createWebhookSchema)
      const webhook = await vapiWebhooks.create(validatedData)
      
      return new Response(JSON.stringify({ data: webhook }), {
        status: 201,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // PATCH /webhooks/:id - Mise à jour d'un webhook
    if (req.method === 'PATCH' && pathSegments.length === 2) {
      verifyAdmin(user)
      const webhookId = pathSegments[1]
      const data = await req.json()
      const validatedData = validateInput<WebhookUpdateParams>(data, updateWebhookSchema)
      const webhook = await vapiWebhooks.update(webhookId, validatedData)
      
      return new Response(JSON.stringify({ data: webhook }), {
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      })
    }
    
    // DELETE /webhooks/:id - Suppression d'un webhook
    if (req.method === 'DELETE' && pathSegments.length === 2) {
      verifyAdmin(user)
      const webhookId = pathSegments[1]
      await vapiWebhooks.delete(webhookId)
      
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