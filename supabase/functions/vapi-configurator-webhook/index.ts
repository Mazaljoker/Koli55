// @ts-nocheck - Ignorer les erreurs TypeScript pour l'environnement Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../shared/cors.ts";
import {
  createErrorResponse,
  createSuccessResponse,
} from "../shared/response-helpers.ts";

// Initialisation du client Supabase
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Templates importés depuis les templates créés
const TEMPLATES = {
  restaurant: {
    id: "restaurant_fr",
    name: "Restaurant & Restauration",
    base_config: {
      systemPrompt: `Vous êtes l'assistant vocal de {business_name}, {business_description}.
      
      VOTRE RÔLE :
      - Accueillir chaleureusement les clients
      - Renseigner sur le menu, horaires, et services
      - Prendre des réservations et commandes à emporter
      - Donner les informations pratiques (adresse, parking, etc.)
      
      STYLE :
      - Chaleureux et convivial
      - Utilisation du "vous" poli
      - Mettez en avant les spécialités et l'ambiance
      
      INFORMATIONS IMPORTANTES :
      {knowledge_base_content}`,
      firstMessage:
        "Bonjour ! Bienvenue chez {business_name}. Je suis votre assistant vocal. Comment puis-je vous aider aujourd'hui ?",
      suggested_functions: [
        "make_reservation",
        "check_availability",
        "get_menu_info",
      ],
      voice_style: "warm_welcoming",
      keywords: ["réservation", "menu", "table", "horaires", "spécialités"],
    },
  },
  ecommerce: {
    id: "ecommerce_fr",
    name: "E-commerce & Boutique",
    base_config: {
      systemPrompt: `Vous êtes l'assistant client de {business_name}, {business_description}.
      
      VOTRE RÔLE :
      - Aider avec les questions produits
      - Suivre les commandes et livraisons
      - Gérer les retours et réclamations
      - Orienter vers le bon service si besoin
      
      STYLE :
      - Professionnel et serviable
      - Patience avec les questions techniques
      - Solutions orientées client
      
      INFORMATIONS PRODUITS :
      {knowledge_base_content}`,
      firstMessage:
        "Bonjour ! Je suis l'assistant de {business_name}. Comment puis-je vous aider avec vos achats ou votre commande ?",
      suggested_functions: ["track_order", "product_info", "return_process"],
      voice_style: "professional_helpful",
      keywords: ["commande", "livraison", "produit", "retour", "taille"],
    },
  },
  service: {
    id: "service_fr",
    name: "Services & Conseil",
    base_config: {
      systemPrompt: `Vous êtes l'assistant de {business_name}, {business_description}.
      
      VOTRE RÔLE :
      - Qualifier les demandes clients
      - Prendre des rendez-vous
      - Expliquer les services proposés
      - Rediriger vers l'expert approprié
      
      STYLE :
      - Expert et rassurant
      - Questions pertinentes pour qualifier
      - Vocabulaire professionnel adapté
      
      SERVICES & EXPERTISE :
      {knowledge_base_content}`,
      firstMessage:
        "Bonjour ! Je suis l'assistant de {business_name}. Comment puis-je vous accompagner dans votre projet ?",
      suggested_functions: [
        "book_consultation",
        "qualify_need",
        "transfer_expert",
      ],
      voice_style: "expert_professional",
      keywords: [
        "consultation",
        "expertise",
        "accompagnement",
        "projet",
        "besoin",
      ],
    },
  },
};

/**
 * Appelle le serveur MCP pour créer l'assistant final
 */
async function callMcpServer(
  functionName: string,
  parameters: any
): Promise<any> {
  const mcpServerUrl = `${supabaseUrl}/functions/v1/mcp-server`;

  const response = await fetch(mcpServerUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${supabaseServiceKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tool: functionName,
      parameters,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur MCP Server: ${error}`);
  }

  return await response.json();
}

/**
 * Tool: Analyse le contexte business (appelé par l'assistant Vapi)
 */
async function analyzeBusinessContext(description: string) {
  const keywords = {
    restaurant: [
      "restaurant",
      "pizzeria",
      "brasserie",
      "café",
      "bistrot",
      "cuisine",
      "menu",
      "table",
      "réservation",
      "plat",
      "spécialité",
    ],
    ecommerce: [
      "boutique",
      "vente",
      "produits",
      "commerce",
      "magasin",
      "achat",
      "commande",
      "livraison",
      "stock",
      "prix",
    ],
    service: [
      "conseil",
      "service",
      "accompagnement",
      "formation",
      "consulting",
      "consultation",
      "expertise",
      "rendez-vous",
      "projet",
      "cabinet",
    ],
  };

  const lowerDesc = description.toLowerCase();
  const scores: Record<string, number> = {};

  for (const [sector, words] of Object.entries(keywords)) {
    scores[sector] = words.reduce((score, word) => {
      return score + (lowerDesc.includes(word) ? 1 : 0);
    }, 0);
  }

  const bestSector = Object.entries(scores).reduce((a, b) =>
    scores[a[0]] > scores[b[0]] ? a : b
  )[0];

  const sector = scores[bestSector] > 0 ? bestSector : "service";
  const template =
    TEMPLATES[sector as keyof typeof TEMPLATES] || TEMPLATES.service;

  return {
    sector,
    confidence: Math.min(
      description.length / 100 + (sector !== "service" ? 0.2 : 0),
      1
    ),
    template_id: template.id,
    suggested_config: template.base_config,
    detected_info: {
      business_name: extractBusinessName(description),
      services: extractServices(description),
      location: extractLocation(description),
    },
  };
}

/**
 * Tool: Liste les voix pour un secteur (appelé par l'assistant Vapi)
 */
async function listVoicesForSector(sector: string, language: string = "fr") {
  const sectorVoices: Record<string, any[]> = {
    restaurant: [
      {
        id: "elevenlabs_sarah_warm",
        name: "Sarah - Chaleureuse",
        style: "Accueillante et conviviale",
        provider: "elevenlabs",
      },
      {
        id: "playht_julie_professional",
        name: "Julie - Professionnelle",
        style: "Élégante et raffinée",
        provider: "playht",
      },
      {
        id: "openai_nova_friendly",
        name: "Nova - Amicale",
        style: "Décontractée et sympathique",
        provider: "openai",
      },
    ],
    ecommerce: [
      {
        id: "elevenlabs_emma_helpful",
        name: "Emma - Serviable",
        style: "Patiente et informatrice",
        provider: "elevenlabs",
      },
      {
        id: "playht_alice_efficient",
        name: "Alice - Efficace",
        style: "Dynamique et précise",
        provider: "playht",
      },
      {
        id: "openai_alloy_neutral",
        name: "Alloy - Neutre",
        style: "Professionnelle et claire",
        provider: "openai",
      },
    ],
    service: [
      {
        id: "elevenlabs_marie_expert",
        name: "Marie - Experte",
        style: "Compétente et rassurante",
        provider: "elevenlabs",
      },
      {
        id: "playht_sophie_advisor",
        name: "Sophie - Conseillère",
        style: "Bienveillante et sage",
        provider: "playht",
      },
      {
        id: "openai_echo_professional",
        name: "Echo - Corporate",
        style: "Formelle et fiable",
        provider: "openai",
      },
    ],
  };

  return sectorVoices[sector] || sectorVoices.service;
}

/**
 * Tool: Test d'échantillon vocal (appelé par l'assistant Vapi)
 */
async function testVoiceSample(
  voiceId: string,
  sampleText: string,
  businessName?: string
) {
  const personalizedText = businessName
    ? sampleText.replace("{business_name}", businessName)
    : sampleText;

  // Simuler l'URL de l'échantillon (dans la vraie implémentation, appeler l'API TTS)
  const testAudioUrl = `/api/voice-test/${voiceId}?text=${encodeURIComponent(
    personalizedText
  )}`;

  return {
    audio_url: testAudioUrl,
    success: true,
  };
}

/**
 * Tool: Création assistant complet (appelé par l'assistant Vapi)
 */
async function createCompleteAssistant(config: any) {
  // Cette fonction appellerait l'edge function de création d'assistant
  // Simuler pour l'instant
  const assistantId = `asst_${Date.now()}`;

  return {
    assistant_id: assistantId,
    test_url: `https://dashboard.vapi.ai/assistant/${assistantId}/test`,
    phone_number: "+33123456789", // Simulé
    success: true,
  };
}

// Fonctions utilitaires
function extractBusinessName(description: string): string | undefined {
  const patterns = [
    /(?:restaurant|café|bistrot|pizzeria)\s+([A-Z][a-zA-ZÀ-ÿ\s]+)/i,
    /(?:chez|au|à la|du)\s+([A-Z][a-zA-ZÀ-ÿ\s]+)/i,
    /([A-Z][a-zA-ZÀ-ÿ\s]+)(?:\s+restaurant|\s+café|\s+bistrot)/i,
  ];

  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return undefined;
}

function extractServices(description: string): string[] {
  const services: string[] = [];
  const lowerDesc = description.toLowerCase();
  const serviceKeywords = {
    Réservations: ["réservation", "réserver", "table"],
    "Commandes à emporter": ["emporter", "takeaway", "commande"],
    Livraison: ["livraison", "livrer", "delivery"],
    Consultation: ["consultation", "rendez-vous", "rdv"],
    Devis: ["devis", "estimation", "tarif"],
    "Support client": ["support", "aide", "assistance"],
  };

  for (const [service, keywords] of Object.entries(serviceKeywords)) {
    if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
      services.push(service);
    }
  }
  return services;
}

function extractLocation(description: string): string | undefined {
  const locationPattern =
    /(?:à|sur|dans)\s+([A-Z][a-zA-ZÀ-ÿ\s-]+)(?:\s|$|,|\.|!|\?)/i;
  const match = description.match(locationPattern);

  if (match && match[1] && match[1].length > 2) {
    return match[1].trim();
  }
  return undefined;
}

/**
 * Traite les function calls de l'agent configurateur
 */
async function handleFunctionCall(functionCall: any): Promise<any> {
  const { name, parameters } = functionCall;

  switch (name) {
    case "createAssistantAndProvisionNumber":
      try {
        // Appeler le serveur MCP pour créer l'assistant complet
        const result = await callMcpServer(
          "createAssistantAndProvisionNumber",
          parameters
        );

        // Log de l'événement
        console.log("Assistant créé via configurateur:", {
          assistantName: parameters.assistantName,
          businessType: parameters.businessType,
          result,
        });

        return {
          success: true,
          message: `Parfait ! Votre assistant "${parameters.assistantName}" a été créé avec succès. Un numéro de téléphone lui a été attribué et il sera opérationnel dans quelques minutes. Vous recevrez un email avec tous les détails de configuration.`,
          data: result,
        };
      } catch (error) {
        console.error("Erreur création assistant:", error);
        return {
          success: false,
          message: `Je rencontre une difficulté technique pour créer votre assistant. Pouvez-vous réessayer dans quelques instants ? Si le problème persiste, notre équipe technique sera notifiée.`,
          error: error.message,
        };
      }

    default:
      return {
        success: false,
        message:
          "Fonction non reconnue. Pouvez-vous reformuler votre demande ?",
        error: `Fonction inconnue: ${name}`,
      };
  }
}

/**
 * Traite les webhooks Vapi pour l'agent configurateur
 */
async function handleVapiWebhook(webhookData: any): Promise<any> {
  const { type, call, message } = webhookData;

  switch (type) {
    case "function-call":
      // L'agent configurateur appelle une fonction (création d'assistant)
      return await handleFunctionCall(message.functionCall);

    case "call-start":
      // Début d'appel avec l'agent configurateur
      console.log("Début de configuration avec agent:", {
        callId: call?.id,
        timestamp: new Date().toISOString(),
      });

      return {
        success: true,
        message: "Session de configuration démarrée",
      };

    case "call-end":
      // Fin d'appel avec l'agent configurateur
      console.log("Fin de configuration:", {
        callId: call?.id,
        duration: call?.duration,
        timestamp: new Date().toISOString(),
      });

      // Optionnel : sauvegarder les métriques de la session
      if (call?.id) {
        try {
          await supabase.from("configurator_sessions").insert({
            call_id: call.id,
            duration: call.duration,
            status: call.status,
            created_at: new Date().toISOString(),
          });
        } catch (error) {
          console.error("Erreur sauvegarde session:", error);
        }
      }

      return {
        success: true,
        message: "Session de configuration terminée",
      };

    case "transcript":
      // Transcription en temps réel (optionnel pour analytics)
      if (message?.transcript) {
        console.log("Transcription configurateur:", {
          callId: call?.id,
          role: message.role,
          content: message.transcript.substring(0, 100) + "...",
        });
      }

      return {
        success: true,
        message: "Transcription reçue",
      };

    case "hang":
      // Appel raccroché
      console.log("Appel configurateur raccroché:", {
        callId: call?.id,
        reason: message?.reason,
      });

      return {
        success: true,
        message: "Appel terminé",
      };

    default:
      console.log("Webhook configurateur non géré:", {
        type,
        callId: call?.id,
      });
      return {
        success: true,
        message: `Webhook ${type} reçu`,
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
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return createErrorResponse("Méthode non autorisée", 405);
  }

  try {
    const body = await req.text();

    // Validation de sécurité
    if (!validateVapiWebhook(req, body)) {
      return createErrorResponse("Webhook non autorisé", 401);
    }

    const webhookData = JSON.parse(body);

    // Traitement du webhook
    const result = await handleVapiWebhook(webhookData);

    return createSuccessResponse(result);
  } catch (error) {
    console.error("Erreur webhook configurateur:", error);
    return createErrorResponse(error.message, 500);
  }
}

// Export pour Deno
Deno.serve(handler);
