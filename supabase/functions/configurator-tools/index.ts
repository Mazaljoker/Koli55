// @ts-nocheck - Ignorer les erreurs TypeScript pour l'environnement Deno
/**
 * Index des Tools Configurateur AlloKoli
 *
 * Ces tools sont utilisés par l'assistant configurateur Vapi
 * pour analyser, recommander et créer des assistants automatiquement.
 */

// Export des fonctions principales
export { analyzeBusinessContext } from "./analyze-business.ts";
export { listVoicesForSector } from "./list-voices.ts";
export { createCompleteAssistant } from "./create-assistant.ts";

// Types communs
export interface ConfiguratorToolResult {
  success: boolean;
  data?: any;
  error?: string;
}

export interface BusinessAnalysis {
  sector: string;
  size: "small" | "medium" | "large";
  services: string[];
  confidence: number;
  detectedInfo: {
    businessName?: string;
    location?: string;
    specialties?: string[];
  };
  recommendedTemplate: {
    id: string;
    name: string;
    config: any;
  };
}

export interface VoiceRecommendations {
  primary: VoiceRecommendation;
  alternatives: VoiceRecommendation[];
  sector_optimized: boolean;
}

export interface VoiceRecommendation {
  id: string;
  name: string;
  provider: string;
  style: string;
  reason: string;
  sample_text?: string;
  language: string;
}

export interface AssistantConfig {
  businessName: string;
  sector: string;
  selectedVoice: {
    provider: string;
    voiceId: string;
    name: string;
  };
  template: {
    id: string;
    config: any;
  };
  knowledgeBaseIds?: string[];
  customInstructions?: string;
  userId?: string;
}

export interface CreatedAssistant {
  assistant_id: string;
  supabase_id: string;
  test_url: string;
  phone_number?: string;
  configuration: any;
  success: boolean;
}

/**
 * Configuration des tools pour l'assistant configurateur Vapi
 */
export const CONFIGURATOR_TOOLS_CONFIG = {
  assistant_id: "46b73124-6624-45ab-89c7-d27ecedcb251",
  webhook_url: "https://allokoli.vercel.app/api/vapi/webhook",
  tools: [
    {
      name: "analyzeBusinessContext",
      description:
        "Analyse le contexte business et détecte le secteur d'activité pour recommander le template optimal",
      parameters: {
        type: "object",
        properties: {
          description: {
            type: "string",
            description:
              "Description de l'entreprise par l'utilisateur (activité, services, etc.)",
          },
        },
        required: ["description"],
      },
    },
    {
      name: "listVoicesForSector",
      description:
        "Obtient les 3 meilleures voix recommandées pour un secteur donné avec exemples audio personnalisés",
      parameters: {
        type: "object",
        properties: {
          sector: {
            type: "string",
            description:
              "Secteur d'activité détecté (restaurant, salon, ecommerce, artisan, service, medical)",
          },
          language: {
            type: "string",
            description: "Code langue (fr, en, etc.)",
            default: "fr",
          },
          businessName: {
            type: "string",
            description:
              "Nom de l'entreprise pour personnaliser les exemples audio",
          },
        },
        required: ["sector"],
      },
    },
    {
      name: "createCompleteAssistant",
      description:
        "Crée l'assistant vocal final avec toute la configuration optimisée",
      parameters: {
        type: "object",
        properties: {
          businessName: {
            type: "string",
            description: "Nom de l'entreprise",
          },
          sector: {
            type: "string",
            description: "Secteur d'activité",
          },
          selectedVoice: {
            type: "object",
            description: "Voix sélectionnée par l'utilisateur",
            properties: {
              provider: { type: "string" },
              voiceId: { type: "string" },
              name: { type: "string" },
            },
            required: ["provider", "voiceId", "name"],
          },
          template: {
            type: "object",
            description: "Template de configuration sectoriel",
            properties: {
              id: { type: "string" },
              config: { type: "object" },
            },
            required: ["id", "config"],
          },
          knowledgeBaseIds: {
            type: "array",
            description: "IDs des bases de connaissances à associer",
            items: { type: "string" },
          },
          customInstructions: {
            type: "string",
            description: "Instructions personnalisées supplémentaires",
          },
          userId: {
            type: "string",
            description: "ID utilisateur pour traçabilité",
          },
        },
        required: ["businessName", "sector", "selectedVoice"],
      },
    },
  ],
};

/**
 * Documentation des tools
 */
export const TOOLS_DOCUMENTATION = {
  version: "1.0.0",
  created: "2025-01-28",
  description: "Tools configurateur pour assistant AlloKoli",

  tools: {
    "analyze-business": {
      purpose:
        "Analyse automatique du contexte business et détection de secteur",
      input: "Description textuelle de l'entreprise",
      output: "Secteur détecté + template recommandé + confiance",
      examples: [
        {
          input: "Restaurant italien à Paris spécialisé en pizza",
          output:
            "{ sector: 'restaurant', confidence: 0.95, template: 'restaurant_fr' }",
        },
      ],
    },

    "list-voices": {
      purpose: "Recommandations vocales optimisées par secteur",
      input: "Secteur d'activité + nom d'entreprise optionnel",
      output: "3 voix recommandées avec exemples personnalisés",
      examples: [
        {
          input: "{ sector: 'restaurant', businessName: 'Bella Vista' }",
          output: "{ primary: voice1, alternatives: [voice2, voice3] }",
        },
      ],
    },

    "create-assistant": {
      purpose: "Création complète d'assistant Vapi + sauvegarde Supabase",
      input: "Configuration complète (business, voix, template)",
      output: "Assistant créé avec ID et URL de test",
      examples: [
        {
          input:
            "{ businessName: 'Bella Vista', sector: 'restaurant', selectedVoice: {...} }",
          output:
            "{ assistant_id: 'vapi-id', test_url: 'https://...', success: true }",
        },
      ],
    },
  },
};

import "jsr:@supabase/functions-js/edge-runtime.d.ts";

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

// Helper functions for Vapi responses
function createVapiErrorResponse(error: string, details: string): Response {
  return new Response(
    JSON.stringify({
      error: {
        message: error,
        details: details,
      },
    }),
    {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

function createVapiSingleResponse(toolCallId: string, result: any): Response {
  return new Response(
    JSON.stringify({
      results: [
        {
          toolCallId: toolCallId,
          result: result,
        },
      ],
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

/**
 * Edge Function Configurateur Tools
 * Endpoint unifié pour les 3 tools du configurateur AlloKoli
 */
Deno.serve(async (req: Request) => {
  // CORS pour toutes les requêtes
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const toolName = url.searchParams.get("tool");

    if (!toolName) {
      return new Response(
        JSON.stringify({
          error: "Paramètre 'tool' requis",
          availableTools: [
            "analyzeBusinessContext",
            "listVoicesForBusiness",
            "createAssistant",
          ],
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Router vers la bonne fonction
    switch (toolName) {
      case "analyzeBusinessContext":
        return await analyzeBusinessContext(req);

      case "listVoicesForBusiness":
        return await listVoicesForBusiness(req);

      case "createAssistant":
        return await createAssistant(req);

      default:
        return new Response(
          JSON.stringify({
            error: `Tool '${toolName}' non reconnu`,
            availableTools: [
              "analyzeBusinessContext",
              "listVoicesForBusiness",
              "createAssistant",
            ],
          }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
    }
  } catch (error) {
    console.error("Erreur dans configurator-tools:", error);
    return new Response(
      JSON.stringify({
        error: "Erreur interne du serveur",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

/**
 * Analyse le contexte business
 */
async function analyzeBusinessContext(req: Request): Promise<Response> {
  try {
    if (req.method !== "POST") {
      return createVapiErrorResponse(
        "Méthode non autorisée",
        "Cette fonction nécessite une requête POST"
      );
    }

    const body = await req.json();
    const { message } = body;
    const toolCall = message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments?.businessDescription) {
      return createVapiErrorResponse(
        "Description manquante",
        "La description du business est requise"
      );
    }

    const { businessDescription } = toolCall.function.arguments;

    // Analyse simple par mots-clés
    const analysis = {
      sector: detectSector(businessDescription),
      confidence: 0.85,
      detectedInfo: {
        businessName: extractBusinessName(businessDescription),
      },
      recommendedTemplate: {
        id: "default",
        name: "Configuration Standard",
      },
    };

    return createVapiSingleResponse(toolCall.id, {
      success: true,
      analysis,
      message: `Analyse terminée avec ${Math.round(
        analysis.confidence * 100
      )}% de confiance`,
    });
  } catch (error) {
    console.error("Erreur analyzeBusinessContext:", error);
    return createVapiErrorResponse("Erreur d'analyse", error.message);
  }
}

/**
 * Liste les voix pour business
 */
async function listVoicesForBusiness(req: Request): Promise<Response> {
  try {
    if (req.method !== "POST") {
      return createVapiErrorResponse(
        "Méthode non autorisée",
        "Cette fonction nécessite une requête POST"
      );
    }

    const body = await req.json();
    const { message } = body;
    const toolCall = message?.tool_calls?.[0];

    const { sector = "service" } = toolCall?.function?.arguments || {};

    const voices = [
      {
        provider: "11labs",
        voiceId: "pNInz6obpgDQGcFmaJgB",
        name: "Adam (Premium)",
        description: "Voix masculine professionnelle et chaleureuse",
        recommended: true,
      },
      {
        provider: "openai",
        voiceId: "nova",
        name: "Nova (OpenAI)",
        description: "Voix féminine moderne et efficace",
        recommended: true,
      },
    ];

    return createVapiSingleResponse(toolCall.id, {
      success: true,
      sector,
      voices,
      message: `${voices.length} voix disponibles pour le secteur ${sector}`,
    });
  } catch (error) {
    console.error("Erreur listVoicesForBusiness:", error);
    return createVapiErrorResponse("Erreur de recherche", error.message);
  }
}

/**
 * Crée un assistant Vapi
 */
async function createAssistant(req: Request): Promise<Response> {
  try {
    if (req.method !== "POST") {
      return createVapiErrorResponse(
        "Méthode non autorisée",
        "Cette fonction nécessite une requête POST"
      );
    }

    const body = await req.json();
    const { message } = body;
    const toolCall = message?.tool_calls?.[0];
    const config = toolCall?.function?.arguments;

    if (!config?.name || !config?.sector || !config?.voice) {
      return createVapiErrorResponse(
        "Paramètres manquants",
        "Les champs name, sector et voice sont requis"
      );
    }

    // Essayer d'abord VAPI_PRIVATE_KEY, puis VAPI_PUBLIC_KEY
    let vapiApiKey = Deno.env.get("VAPI_PRIVATE_KEY");
    let keyType = "PRIVATE";

    if (!vapiApiKey) {
      vapiApiKey = Deno.env.get("VAPI_PUBLIC_KEY");
      keyType = "PUBLIC";
    }

    if (!vapiApiKey) {
      throw new Error(
        "Aucune clé Vapi configurée (ni VAPI_PRIVATE_KEY ni VAPI_PUBLIC_KEY)"
      );
    }

    console.log(`Utilisation de VAPI_${keyType}_KEY pour créer l'assistant`);

    // Créer l'assistant via l'API Vapi
    const assistantPayload = {
      name: config.name,
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        temperature: 0.7,
        systemMessage: `Tu es l'assistant vocal de ${config.name}. Aide les clients de manière professionnelle et chaleureuse.`,
      },
      voice: {
        provider: config.voice.provider,
        voiceId: config.voice.voiceId,
      },
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "fr",
      },
      firstMessage: `Bonjour ! Bienvenue chez ${config.name}. Comment puis-je vous aider ?`,
    };

    const response = await fetch("https://api.vapi.ai/assistant", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${vapiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(assistantPayload),
    });

    if (!response.ok) {
      const errorText = await response.text();

      // Si on a utilisé PUBLIC_KEY et ça échoue, essayer avec PRIVATE_KEY
      if (keyType === "PUBLIC") {
        const privateKey = Deno.env.get("VAPI_PRIVATE_KEY");
        if (privateKey) {
          console.log("Échec avec PUBLIC_KEY, tentative avec PRIVATE_KEY");

          const retryResponse = await fetch("https://api.vapi.ai/assistant", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${privateKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(assistantPayload),
          });

          if (retryResponse.ok) {
            const assistant = await retryResponse.json();
            return createVapiSingleResponse(toolCall.id, {
              success: true,
              assistant: {
                id: assistant.id,
                name: config.name,
                sector: config.sector,
              },
              message: `Assistant '${config.name}' créé avec succès (avec PRIVATE_KEY)`,
              keyUsed: "PRIVATE",
            });
          }
        }
      }

      throw new Error(`API Vapi error ${response.status}: ${errorText}`);
    }

    const assistant = await response.json();

    return createVapiSingleResponse(toolCall.id, {
      success: true,
      assistant: {
        id: assistant.id,
        name: config.name,
        sector: config.sector,
      },
      message: `Assistant '${config.name}' créé avec succès (avec ${keyType}_KEY)`,
      keyUsed: keyType,
    });
  } catch (error) {
    console.error("Erreur createAssistant:", error);
    return createVapiErrorResponse("Erreur de création", error.message);
  }
}

// Helper functions
function detectSector(description: string): string {
  const lower = description.toLowerCase();
  if (
    lower.includes("restaurant") ||
    lower.includes("pizza") ||
    lower.includes("cuisine")
  )
    return "restaurant";
  if (
    lower.includes("salon") ||
    lower.includes("coiffure") ||
    lower.includes("beauté")
  )
    return "salon";
  if (
    lower.includes("boutique") ||
    lower.includes("vente") ||
    lower.includes("commerce")
  )
    return "ecommerce";
  if (
    lower.includes("plombier") ||
    lower.includes("électricien") ||
    lower.includes("artisan")
  )
    return "artisan";
  if (
    lower.includes("médecin") ||
    lower.includes("cabinet") ||
    lower.includes("santé")
  )
    return "medical";
  return "service";
}

function extractBusinessName(description: string): string | undefined {
  const match = description.match(
    /(?:chez|restaurant|salon|boutique)\s+([A-Z][A-Za-z\s]+)/i
  );
  return match?.[1]?.trim();
}
