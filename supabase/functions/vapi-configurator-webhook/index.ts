// @ts-nocheck - Ignorer les erreurs TypeScript pour l'environnement Deno
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../shared/cors.ts';
import { createErrorResponse, createSuccessResponse } from '../shared/response-helpers.ts';

// Initialisation du client Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Appelle le serveur MCP pour créer l'assistant final
 */
async function callMcpServer(functionName: string, parameters: any): Promise<any> {
  const mcpServerUrl = `${supabaseUrl}/functions/v1/mcp-server`;
  
  const response = await fetch(mcpServerUrl, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tool: functionName,
      parameters
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur MCP Server: ${error}`);
  }

  return await response.json();
}

/**
 * Traite les function calls de l'agent configurateur
 */
async function handleFunctionCall(functionCall: any): Promise<any> {
  const { name, parameters } = functionCall;

  switch (name) {
    case 'createAssistantAndProvisionNumber':
      try {
        // Appeler le serveur MCP pour créer l'assistant complet
        const result = await callMcpServer('createAssistantAndProvisionNumber', parameters);
        
        // Log de l'événement
        console.log('Assistant créé via configurateur:', {
          assistantName: parameters.assistantName,
          businessType: parameters.businessType,
          result
        });

        return {
          success: true,
          message: `Parfait ! Votre assistant "${parameters.assistantName}" a été créé avec succès. Un numéro de téléphone lui a été attribué et il sera opérationnel dans quelques minutes. Vous recevrez un email avec tous les détails de configuration.`,
          data: result
        };

      } catch (error) {
        console.error('Erreur création assistant:', error);
        return {
          success: false,
          message: `Je rencontre une difficulté technique pour créer votre assistant. Pouvez-vous réessayer dans quelques instants ? Si le problème persiste, notre équipe technique sera notifiée.`,
          error: error.message
        };
      }

    default:
      return {
        success: false,
        message: "Fonction non reconnue. Pouvez-vous reformuler votre demande ?",
        error: `Fonction inconnue: ${name}`
      };
  }
}

/**
 * Traite les webhooks Vapi pour l'agent configurateur
 */
async function handleVapiWebhook(webhookData: any): Promise<any> {
  const { type, call, message } = webhookData;

  switch (type) {
    case 'function-call':
      // L'agent configurateur appelle une fonction (création d'assistant)
      return await handleFunctionCall(message.functionCall);

    case 'call-start':
      // Début d'appel avec l'agent configurateur
      console.log('Début de configuration avec agent:', {
        callId: call?.id,
        timestamp: new Date().toISOString()
      });
      
      return {
        success: true,
        message: "Session de configuration démarrée"
      };

    case 'call-end':
      // Fin d'appel avec l'agent configurateur
      console.log('Fin de configuration:', {
        callId: call?.id,
        duration: call?.duration,
        timestamp: new Date().toISOString()
      });

      // Optionnel : sauvegarder les métriques de la session
      if (call?.id) {
        try {
          await supabase
            .from('configurator_sessions')
            .insert({
              call_id: call.id,
              duration: call.duration,
              status: call.status,
              created_at: new Date().toISOString()
            });
        } catch (error) {
          console.error('Erreur sauvegarde session:', error);
        }
      }

      return {
        success: true,
        message: "Session de configuration terminée"
      };

    case 'transcript':
      // Transcription en temps réel (optionnel pour analytics)
      if (message?.transcript) {
        console.log('Transcription configurateur:', {
          callId: call?.id,
          role: message.role,
          content: message.transcript.substring(0, 100) + '...'
        });
      }

      return {
        success: true,
        message: "Transcription reçue"
      };

    case 'hang':
      // Appel raccroché
      console.log('Appel configurateur raccroché:', {
        callId: call?.id,
        reason: message?.reason
      });

      return {
        success: true,
        message: "Appel terminé"
      };

    default:
      console.log('Webhook configurateur non géré:', { type, callId: call?.id });
      return {
        success: true,
        message: `Webhook ${type} reçu`
      };
  }
}

/**
 * Valide la signature du webhook Vapi (sécurité)
 */
function validateVapiWebhook(req: Request, body: string): boolean {
  // TODO: Implémenter la validation de signature Vapi si disponible
  // Pour l'instant, on accepte tous les webhooks
  return true;
}

/**
 * Handler principal
 */
async function handler(req: Request): Promise<Response> {
  // Gestion CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return createErrorResponse('Méthode non autorisée', 405);
  }

  try {
    const body = await req.text();
    
    // Validation de sécurité
    if (!validateVapiWebhook(req, body)) {
      return createErrorResponse('Webhook non autorisé', 401);
    }

    const webhookData = JSON.parse(body);
    
    // Traitement du webhook
    const result = await handleVapiWebhook(webhookData);

    return createSuccessResponse(result);

  } catch (error) {
    console.error('Erreur webhook configurateur:', error);
    return createErrorResponse(error.message, 500);
  }
}

// Export pour Deno
Deno.serve(handler); 