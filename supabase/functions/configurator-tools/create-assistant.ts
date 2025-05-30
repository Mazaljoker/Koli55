// @ts-nocheck - Ignorer les erreurs TypeScript pour l'environnement Deno
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../shared/cors.ts";
import {
  createVapiErrorResponse,
  createVapiSingleResponse,
} from "../shared/response-helpers.ts";

// Types pour la création d'assistant
interface AssistantConfig {
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

interface CreatedAssistant {
  assistant_id: string;
  supabase_id: string;
  test_url: string;
  phone_number?: string;
  configuration: any;
  success: boolean;
}

// Configuration des modèles par secteur
const MODEL_CONFIGS = {
  restaurant: {
    provider: "openai",
    model: "gpt-4o",
    temperature: 0.7,
    max_tokens: 1000,
    reason: "Optimal pour interactions client naturelles",
  },
  salon: {
    provider: "openai",
    model: "gpt-4o",
    temperature: 0.7,
    max_tokens: 1000,
    reason: "Parfait pour prise de rendez-vous",
  },
  ecommerce: {
    provider: "openai",
    model: "gpt-4o",
    temperature: 0.5,
    max_tokens: 1200,
    reason: "Efficace pour support client",
  },
  artisan: {
    provider: "openai",
    model: "gpt-4o-mini",
    temperature: 0.3,
    max_tokens: 800,
    reason: "Réponses rapides pour urgences",
  },
  service: {
    provider: "openai",
    model: "gpt-4o",
    temperature: 0.6,
    max_tokens: 1200,
    reason: "Polyvalent pour consultations",
  },
  medical: {
    provider: "openai",
    model: "gpt-4o",
    temperature: 0.4,
    max_tokens: 1000,
    reason: "Précision pour secteur médical",
  },
};

/**
 * Génère le system prompt personnalisé
 */
function generateSystemPrompt(config: AssistantConfig): string {
  const { businessName, sector, template } = config;

  const basePrompts = {
    restaurant: `Tu es l'assistant vocal de ${businessName}, un restaurant ${
      template.config.tone || "chaleureux"
    }.

INFORMATIONS SUR LE RESTAURANT:
- Nom: ${businessName}
- Style: ${template.config.tone}
- Services disponibles: ${
      template.config.capabilities?.join(", ") ||
      "réservations, informations menu"
    }

CAPACITÉS PRINCIPALES:
- Réserver une table
- Fournir des informations sur le menu et les spécialités  
- Indiquer les horaires d'ouverture
- Transférer vers un humain si nécessaire

INSTRUCTIONS:
- Sois ${template.config.tone} et professionnel
- Mets en valeur les spécialités de la maison
- Guide les clients vers une réservation
- Reste dans ton rôle d'assistant restaurant`,

    salon: `Tu es l'assistant vocal de ${businessName}, un salon de coiffure/beauté ${
      template.config.tone || "professionnel"
    }.

INFORMATIONS SUR LE SALON:
- Nom: ${businessName}
- Style: ${template.config.tone}
- Services: ${
      template.config.capabilities?.join(", ") ||
      "rendez-vous, informations services"
    }

CAPACITÉS PRINCIPALES:
- Prendre des rendez-vous
- Informer sur les services et tarifs
- Vérifier les disponibilités
- Orienter vers l'équipe appropriée

INSTRUCTIONS:
- Sois ${template.config.tone} et attentionné
- Pose les bonnes questions pour qualifier le besoin
- Propose des créneaux adaptés
- Reste dans ton rôle d'assistant salon`,

    ecommerce: `Tu es l'assistant client de ${businessName}, une boutique ${
      template.config.tone || "serviable"
    }.

INFORMATIONS SUR LA BOUTIQUE:
- Nom: ${businessName}
- Style: ${template.config.tone}
- Services: ${
      template.config.capabilities?.join(", ") ||
      "commandes, livraisons, support"
    }

CAPACITÉS PRINCIPALES:
- Aider avec les questions produits
- Suivre les commandes et livraisons
- Gérer les retours et réclamations
- Orienter vers le bon service

INSTRUCTIONS:
- Sois ${template.config.tone} et patient
- Fournis des informations précises
- Résous les problèmes rapidement
- Reste dans ton rôle d'assistant boutique`,

    artisan: `Tu es l'assistant de ${businessName}, une entreprise ${
      template.config.tone || "efficace"
    }.

INFORMATIONS SUR L'ENTREPRISE:
- Nom: ${businessName}
- Style: ${template.config.tone}
- Services: ${
      template.config.capabilities?.join(", ") ||
      "dépannages, interventions, devis"
    }

CAPACITÉS PRINCIPALES:
- Traiter les urgences en priorité
- Planifier les interventions
- Fournir des devis
- Transférer les cas complexes

INSTRUCTIONS:
- Sois ${template.config.tone} et réactif
- Identifie rapidement les urgences
- Rassure les clients en détresse
- Reste dans ton rôle d'assistant artisan`,

    service: `Tu es l'assistant de ${businessName}, une entreprise de services ${
      template.config.tone || "professionnelle"
    }.

INFORMATIONS SUR L'ENTREPRISE:
- Nom: ${businessName}
- Style: ${template.config.tone}
- Services: ${
      template.config.capabilities?.join(", ") ||
      "consultations, accompagnement"
    }

CAPACITÉS PRINCIPALES:
- Qualifier les demandes clients
- Prendre des rendez-vous de consultation
- Expliquer les services proposés
- Rediriger vers l'expert approprié

INSTRUCTIONS:
- Sois ${template.config.tone} et rassurant
- Pose des questions pertinentes
- Utilise un vocabulaire professionnel adapté
- Reste dans ton rôle d'assistant conseil`,

    medical: `Tu es l'assistant du cabinet médical ${businessName}, ${
      template.config.tone || "calme et professionnel"
    }.

INFORMATIONS SUR LE CABINET:
- Nom: ${businessName}
- Style: ${template.config.tone}
- Services: ${
      template.config.capabilities?.join(", ") ||
      "rendez-vous, urgences, informations"
    }

CAPACITÉS PRINCIPALES:
- Prendre des rendez-vous médicaux
- Évaluer les urgences
- Fournir des informations pratiques
- Rassurer les patients

INSTRUCTIONS:
- Sois ${template.config.tone} et empathique
- Respecte la confidentialité médicale
- Priorise les urgences
- Reste dans ton rôle d'assistant médical`,
  };

  const basePrompt =
    basePrompts[sector as keyof typeof basePrompts] || basePrompts.service;

  // Ajouter les instructions personnalisées si présentes
  if (config.customInstructions) {
    return `${basePrompt}\n\nINSTRUCTIONS SUPPLÉMENTAIRES:\n${config.customInstructions}`;
  }

  return basePrompt;
}

/**
 * Génère le message d'accueil personnalisé
 */
function generateFirstMessage(config: AssistantConfig): string {
  const { businessName, template } = config;

  if (template.config.firstMessageTemplate) {
    return template.config.firstMessageTemplate.replace(
      "{business_name}",
      businessName
    );
  }

  return `Bonjour ! Je suis l'assistant vocal de ${businessName}. Comment puis-je vous aider aujourd'hui ?`;
}

/**
 * Crée l'assistant complet sur Vapi
 */
async function createVapiAssistant(config: AssistantConfig): Promise<any> {
  const vapiApiKey = Deno.env.get("VAPI_PRIVATE_KEY");

  if (!vapiApiKey) {
    throw new Error("VAPI_PRIVATE_KEY non configurée");
  }

  const modelConfig =
    MODEL_CONFIGS[config.sector as keyof typeof MODEL_CONFIGS] ||
    MODEL_CONFIGS.service;

  const vapiPayload = {
    name: `${config.businessName} - Assistant`,
    model: {
      provider: modelConfig.provider,
      model: modelConfig.model,
      systemMessage: generateSystemPrompt(config),
      temperature: modelConfig.temperature,
      maxTokens: modelConfig.max_tokens,
    },
    voice: {
      provider: config.selectedVoice.provider,
      voiceId: config.selectedVoice.voiceId,
    },
    firstMessage: generateFirstMessage(config),
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "fr",
    },
    // Ajouter la knowledge base si présente
    ...(config.knowledgeBaseIds &&
      config.knowledgeBaseIds.length > 0 && {
        knowledgeBase: {
          provider: "vapi",
          knowledgeBaseId: config.knowledgeBaseIds[0],
        },
      }),
    // Configuration avancée
    endCallMessage: `Merci d'avoir contacté ${config.businessName}. À très bientôt !`,
    silenceTimeoutSeconds: 30,
    maxDurationSeconds: 1200,
    backgroundDenoisingEnabled: true,
  };

  const response = await fetch("https://api.vapi.ai/assistant", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vapiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(vapiPayload),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur création assistant Vapi: ${error}`);
  }

  return await response.json();
}

/**
 * Sauvegarde l'assistant en base Supabase
 */
async function saveAssistantToSupabase(
  vapiAssistant: any,
  config: AssistantConfig
): Promise<any> {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Configuration Supabase manquante");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { data, error } = await supabase
    .from("assistants")
    .insert({
      user_id: config.userId || "configurator",
      vapi_assistant_id: vapiAssistant.id,
      name: vapiAssistant.name,
      business_sector: config.sector,
      configuration: {
        business_name: config.businessName,
        sector: config.sector,
        voice: config.selectedVoice,
        template: config.template,
        created_via: "configurator",
      },
      status: "active",
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Erreur sauvegarde Supabase: ${error.message}`);
  }

  return data;
}

/**
 * Fonction principale de création d'assistant
 */
export async function createCompleteAssistant(
  config: AssistantConfig
): Promise<CreatedAssistant> {
  try {
    // 1. Créer l'assistant sur Vapi
    const vapiAssistant = await createVapiAssistant(config);

    // 2. Sauvegarder en base Supabase
    const supabaseRecord = await saveAssistantToSupabase(vapiAssistant, config);

    // 3. Retourner les informations complètes
    return {
      assistant_id: vapiAssistant.id,
      supabase_id: supabaseRecord.id,
      test_url: `https://dashboard.vapi.ai/assistant/${vapiAssistant.id}/test`,
      phone_number: vapiAssistant.phoneNumber,
      configuration: {
        business_name: config.businessName,
        sector: config.sector,
        voice: config.selectedVoice,
        vapi_config: vapiAssistant,
      },
      success: true,
    };
  } catch (error: any) {
    console.error("Erreur création assistant:", error);
    throw error;
  }
}

/**
 * Handler pour l'edge function
 */
export default async function handler(req: Request): Promise<Response> {
  // Gestion CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return createVapiErrorResponse("Méthode non autorisée", 405);
    }

    const assistantConfig = (await req.json()) as AssistantConfig;

    // Validation des champs requis
    if (
      !assistantConfig.businessName ||
      !assistantConfig.sector ||
      !assistantConfig.selectedVoice
    ) {
      return createVapiErrorResponse(
        "Configuration incomplète: businessName, sector et selectedVoice requis",
        400
      );
    }

    // Créer l'assistant complet
    const result = await createCompleteAssistant(assistantConfig);

    return createVapiSingleResponse(result);
  } catch (error: any) {
    console.error("Erreur création assistant:", error);
    return createVapiErrorResponse(error.message || "Erreur interne", 500);
  }
}
