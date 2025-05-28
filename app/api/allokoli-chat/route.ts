// app/api/allokoli-chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Créer client Supabase avec service role pour écriture
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Interface pour la requête
interface ChatRequest {
  message: string;
  step: number;
  assistantConfig: any;
  mode: "chat" | "voice";
  user_id?: string;
}

// Interface pour la réponse
interface ChatResponse {
  content: string;
  options?: string[];
  component?: string;
  data?: any;
  config?: any;
  nextStep?: number;
  mode?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, step, assistantConfig, mode, user_id }: ChatRequest =
      await request.json();

    console.log(`[CHAT API] Step ${step}: ${message}`);

    // Router vers la fonction appropriée selon l'étape
    const response = await processConversationStep(
      message,
      step,
      assistantConfig,
      mode,
      user_id
    );

    return NextResponse.json(response);
  } catch (error) {
    console.error("[CHAT API] Error:", error);
    return NextResponse.json(
      {
        content: "❌ Une erreur est survenue. Pouvez-vous réessayer ?",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

async function processConversationStep(
  message: string,
  step: number,
  config: any,
  mode: string,
  user_id?: string
): Promise<ChatResponse> {
  switch (step) {
    case 0:
      return handleModeSelection(message, config);

    case 1:
      return handleBusinessType(message, config);

    case 2:
      return handleAssistantName(message, config);

    case 3:
      return handleTone(message, config);

    case 4:
      return handleKeyInformation(message, config);

    case 5:
      return await handleAssistantCreation(config, user_id);

    case 6:
      return handleKnowledgeBase(message, config);

    case 7:
      return handleTesting(message, config);

    case 8:
      return await handlePhoneNumberProvisioning(config, user_id);

    default:
      return {
        content: "🎉 **Félicitations !** Votre assistant AlloKoli est prêt !",
        component: "success",
      };
  }
}

function handleModeSelection(message: string, config: any): ChatResponse {
  if (
    message.includes("🎤") ||
    message.toLowerCase().includes("voix") ||
    message.toLowerCase().includes("parler")
  ) {
    return {
      content:
        "🎤 **Mode vocal activé !** Cliquez sur le micro pour commencer à parler. Je vais vous poser quelques questions pour créer votre assistant.",
      nextStep: 1,
      mode: "voice",
    };
  } else {
    return {
      content:
        "💬 **Parfait !** Commençons par le chat.\n\n**Parlez-moi de votre activité :** restaurant, plomberie, consultation, salon de beauté, garage... ?",
      nextStep: 1,
      mode: "chat",
    };
  }
}

function handleBusinessType(message: string, config: any): ChatResponse {
  const businessType = extractBusinessType(message);

  const newConfig = {
    ...config,
    business_type: businessType,
    original_business_input: message,
  };

  const suggestions = getBusinessSuggestions(businessType);

  return {
    content: `✅ **${businessType}**, excellent choix ! ${suggestions}\n\n**Quel nom voulez-vous donner à votre assistant ?**\n\n*Exemples : "Assistant ${businessType === "restaurant" ? "Pizzeria Mario" : businessType === "plombier" ? "Plomberie Dupont" : "MonBusiness"}*`,
    config: newConfig,
    nextStep: 2,
  };
}

function handleAssistantName(message: string, config: any): ChatResponse {
  const assistantName = message.trim();

  const newConfig = {
    ...config,
    assistant_name: assistantName,
  };

  const toneOptions = getToneOptionsForBusiness(config.business_type);

  return {
    content: `✅ **"${assistantName}"**, parfait ! J'aime beaucoup ce nom.\n\n**Quel ton souhaitez-vous pour votre assistant ?**`,
    options: toneOptions,
    config: newConfig,
    nextStep: 3,
  };
}

function handleTone(message: string, config: any): ChatResponse {
  const tone = message.toLowerCase().replace(/[^a-z]/g, "");

  const newConfig = {
    ...config,
    tone: tone,
  };

  const infoPrompt = getInfoPromptForBusiness(config.business_type);

  return {
    content: `✅ **Ton ${tone}**, parfait ! Cela correspondra bien à votre clientèle.\n\n${infoPrompt}`,
    config: newConfig,
    nextStep: 4,
  };
}

function handleKeyInformation(message: string, config: any): ChatResponse {
  const keyInfo = parseKeyInformation(message);

  const newConfig = {
    ...config,
    key_information: keyInfo,
    raw_key_info: message,
  };

  return {
    content: `✅ **Informations enregistrées !** Votre assistant connaîtra :\n${keyInfo.map((info) => `• ${info}`).join("\n")}\n\n🎉 **Récapitulatif :**\n• **Métier :** ${config.business_type}\n• **Nom :** ${config.assistant_name}\n• **Ton :** ${config.tone}\n• **Infos clés :** ${keyInfo.length} éléments\n\n**Ces informations sont-elles correctes ?**`,
    options: [
      "✅ Oui, créer mon assistant !",
      "✏️ Je veux modifier quelque chose",
    ],
    config: newConfig,
    nextStep: 5,
  };
}

async function handleAssistantCreation(
  config: any,
  user_id?: string
): Promise<ChatResponse> {
  try {
    console.log("[CREATION] Creating assistant with config:", config);

    // Générer la configuration Vapi complète
    const vapiConfig = await generateVapiConfig(config);

    // Créer l'assistant sur Vapi via votre utilitaire
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-user-assistant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          assistant_config: vapiConfig,
          user_metadata: {
            user_id,
            business_type: config.business_type,
            assistant_name: config.assistant_name,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Assistant creation failed: ${response.status}`);
    }

    const result = await response.json();

    const newConfig = {
      ...config,
      vapi_assistant_id: result.assistant_id,
      creation_timestamp: new Date().toISOString(),
    };

    return {
      content: `🎉 **Assistant créé avec succès !**\n\n✅ **${config.assistant_name}** est maintenant opérationnel !\n\n**Voulez-vous enrichir votre assistant avec une base de connaissances ?** (documents, site web, infos spécifiques)`,
      options: ["📚 Ajouter des documents", "⏭️ Passer au test"],
      config: newConfig,
      nextStep: 6,
      component: "knowledgeBase",
    };
  } catch (error) {
    console.error("[CREATION] Error:", error);
    return {
      content: `❌ **Erreur lors de la création.** Nous allons réessayer.\n\nVoulez-vous reprendre la création ?`,
      options: ["🔄 Réessayer", "📞 Contacter le support"],
      nextStep: 5,
    };
  }
}

function handleKnowledgeBase(message: string, config: any): ChatResponse {
  if (message.includes("📚") || message.includes("documents")) {
    return {
      content:
        "📚 **Excellent !** Ajoutons une base de connaissances à votre assistant.\n\nVous pouvez uploader vos documents pour que votre assistant donne des réponses plus précises et personnalisées.",
      component: "knowledgeBase",
      config: config,
      nextStep: 7,
    };
  } else {
    return {
      content:
        "✅ **Pas de problème !** Votre assistant peut déjà répondre aux questions de base grâce aux informations que vous avez fournies.\n\n**Testons votre assistant maintenant !**",
      component: "testAssistant",
      config: config,
      nextStep: 7,
    };
  }
}

function handleTesting(message: string, config: any): ChatResponse {
  if (message.includes("✅") || message.includes("fonctionne")) {
    return {
      content:
        "🎉 **Parfait !** Votre assistant fonctionne bien.\n\n**Dernière étape :** obtenons votre numéro de téléphone pour que vos clients puissent appeler votre assistant !",
      component: "phoneNumber",
      config: config,
      nextStep: 8,
    };
  } else if (message.includes("❌") || message.includes("problème")) {
    return {
      content:
        "🔧 **Pas de souci !** Nous allons ajuster votre assistant.\n\nQuel est le problème rencontré ?",
      options: [
        "Le ton ne convient pas",
        "Il manque des informations",
        "Autre problème",
      ],
      nextStep: 7,
    };
  } else {
    return {
      content:
        "🎧 **Test en cours...** Votre assistant répond :\n\n*\"Bonjour ! Je suis l'assistant de " +
        config.assistant_name +
        ". Comment puis-je vous aider aujourd'hui ?\"*\n\n**Le test fonctionne-t-il bien ?**",
      options: ["✅ Parfait !", "❌ Il y a un problème"],
      nextStep: 7,
    };
  }
}

async function handlePhoneNumberProvisioning(
  config: any,
  user_id?: string
): Promise<ChatResponse> {
  try {
    console.log(
      "[PHONE] Provisioning phone number for assistant:",
      config.vapi_assistant_id
    );

    // Provisionner le numéro via votre fonction Supabase
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/provision-phone-number`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          assistant_id: config.vapi_assistant_id,
          user_id: user_id,
          area_code: "01", // Par défaut Paris, pourrait être configurable
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Phone provisioning failed: ${response.status}`);
    }

    const result = await response.json();

    const finalConfig = {
      ...config,
      phone_number: result.phone_number,
      phone_number_id: result.phone_number_id,
      completion_timestamp: new Date().toISOString(),
    };

    // Sauvegarder la configuration finale en base
    await saveAssistantToDatabase(finalConfig, user_id);

    return {
      content: `🎉 **FÉLICITATIONS !** Votre assistant est maintenant opérationnel !\n\n📞 **Votre numéro :** ${result.phone_number}\n\n✅ Votre assistant **${config.assistant_name}** est prêt à recevoir des appels !\n\nVous recevrez un email avec tous les détails. Vous pouvez dès maintenant appeler ce numéro pour tester !`,
      component: "success",
      config: finalConfig,
      nextStep: 9,
    };
  } catch (error) {
    console.error("[PHONE] Error:", error);
    return {
      content:
        "❌ **Erreur lors de l'attribution du numéro.** Nous allons réessayer dans quelques instants.\n\nVotre assistant est créé, nous finalisons juste l'attribution du numéro.",
      options: ["🔄 Réessayer", "📧 M'envoyer les détails par email"],
      nextStep: 8,
    };
  }
}

// Fonctions utilitaires
function extractBusinessType(input: string): string {
  const businessKeywords = {
    restaurant: [
      "restaurant",
      "pizzeria",
      "brasserie",
      "bistrot",
      "café",
      "resto",
    ],
    plombier: ["plombier", "plomberie", "sanitaire", "chauffage"],
    consultant: ["consultant", "conseil", "consulting", "expertise"],
    "salon de beauté": [
      "salon",
      "beauté",
      "coiffeur",
      "esthétique",
      "coiffure",
    ],
    garage: ["garage", "automobile", "mécanique", "auto", "carrosserie"],
    commerce: ["magasin", "boutique", "commerce", "vente", "shop"],
  };

  const lowerInput = input.toLowerCase();

  for (const [type, keywords] of Object.entries(businessKeywords)) {
    if (keywords.some((keyword) => lowerInput.includes(keyword))) {
      return type;
    }
  }

  // Si aucun mot-clé trouvé, retourner l'input nettoyé
  return input.trim().toLowerCase();
}

function getBusinessSuggestions(businessType: string): string {
  const suggestions = {
    restaurant:
      "Votre assistant pourra gérer les réservations, présenter le menu et donner les horaires.",
    plombier:
      "Votre assistant pourra qualifier les urgences et prendre les coordonnées clients.",
    consultant:
      "Votre assistant pourra présenter vos services et gérer les prises de rendez-vous.",
    "salon de beauté":
      "Votre assistant pourra présenter vos prestations et gérer les réservations.",
    garage:
      "Votre assistant pourra qualifier les problèmes techniques et programmer des rendez-vous.",
  };

  return (
    suggestions[businessType as keyof typeof suggestions] ||
    "Votre assistant sera personnalisé pour votre activité."
  );
}

function getToneOptionsForBusiness(businessType: string): string[] {
  const commonTones = ["Formel", "Amical", "Professionnel"];

  if (businessType === "restaurant") {
    return ["Chaleureux", "Amical", "Professionnel"];
  } else if (businessType === "salon de beauté") {
    return ["Bienveillant", "Amical", "Professionnel"];
  }

  return commonTones;
}

function getInfoPromptForBusiness(businessType: string): string {
  const prompts = {
    restaurant:
      "**Quelles sont les 3 informations importantes que vos clients demandent le plus ?**\n\n*Exemples : horaires d'ouverture, spécialités du menu, politique de réservation, adresse, allergènes...*",
    plombier:
      "**Quelles sont les 3 informations clés pour vos clients ?**\n\n*Exemples : zones d'intervention, tarifs horaires, urgences 24h/24, types de dépannages...*",
    consultant:
      "**Quelles sont les 3 informations essentielles sur vos services ?**\n\n*Exemples : domaines d'expertise, durée des missions, tarifs, processus de consultation...*",
  };

  return (
    prompts[businessType as keyof typeof prompts] ||
    "**Quelles sont les 3 informations les plus importantes que vos clients demandent ?**\n\n*Exemples : services proposés, horaires, tarifs, contact...*"
  );
}

function parseKeyInformation(input: string): string[] {
  // Séparer par des délimiteurs courants
  const separators = /[,;.\n-]/;
  const items = input
    .split(separators)
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, 5); // Limiter à 5 informations max

  return items.length > 0 ? items : [input.trim()];
}

async function generateVapiConfig(config: any): Promise<any> {
  // Générer le prompt système personnalisé
  const systemPrompt = generateSystemPrompt(config);

  // Sélectionner la voix appropriée
  const voiceConfig = selectVoiceForTone(config.tone);

  return {
    name: config.assistant_name,
    model: {
      provider: "openai",
      model: "gpt-4o-mini",
      systemPrompt: systemPrompt,
      temperature: 0.7,
      maxTokens: 200,
    },
    voice: voiceConfig,
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "fr",
    },
    firstMessage: generateFirstMessage(config),
    endCallMessage: `Merci de votre appel ! À bientôt chez ${config.business_type} !`,
    endCallPhrases: ["au revoir", "merci", "bonne journée", "à bientôt"],
    silenceTimeoutSeconds: 10,
    maxDurationSeconds: 300, // 5 minutes max par appel
  };
}

function generateSystemPrompt(config: any): string {
  const { business_type, assistant_name, tone, key_information } = config;

  const basePrompt = `Vous êtes ${assistant_name}, l'assistant vocal de ${business_type}.

VOTRE RÔLE :
Vous accueillez les clients et répondez à leurs questions de manière ${tone}.

INFORMATIONS IMPORTANTES À CONNAÎTRE :
${key_information.map((info: string, index: number) => `${index + 1}. ${info}`).join("\n")}

VOUS POUVEZ :
- Accueillir chaleureusement les clients
- Répondre aux questions sur les services et informations
- Prendre des coordonnées si nécessaire
- Orienter vers la personne appropriée si besoin

VOUS NE POUVEZ PAS :
- Prendre de paiements
- Confirmer des rendez-vous sans vérification
- Donner d'informations non mentionnées ci-dessus

STYLE DE COMMUNICATION :
- Ton ${tone} mais toujours professionnel
- Réponses courtes et claires
- Français naturel et fluide
- Empathique et à l'écoute

Si vous ne savez pas répondre à une question, dites-le honnêtement et proposez de transférer l'appel ou de prendre un message.`;

  return basePrompt;
}

function generateFirstMessage(config: any): string {
  const { business_type, tone } = config;

  const greetings = {
    chaleureux: `Bonjour et bienvenue ! Vous êtes bien chez ${business_type}. Je suis votre assistant vocal, comment puis-je vous aider aujourd'hui ?`,
    amical: `Salut ! Vous appelez ${business_type}. Je suis l'assistant qui va vous renseigner. Que puis-je faire pour vous ?`,
    professionnel: `Bonjour, vous êtes en relation avec ${business_type}. Je suis l'assistant vocal. Comment puis-je vous assister ?`,
    formel: `Bonjour. Vous contactez ${business_type}. Je suis l'assistant automatisé. En quoi puis-je vous être utile ?`,
  };

  return (
    greetings[tone as keyof typeof greetings] || greetings["professionnel"]
  );
}

function selectVoiceForTone(tone: string): any {
  const voiceMap = {
    chaleureux: { provider: "elevenlabs", voiceId: "XrExE9yKIg1WjnnlVkGX" }, // Voix masculine chaleureuse
    amical: { provider: "elevenlabs", voiceId: "pNInz6obpgDQGcFmaJgB" }, // Voix féminine amicale
    professionnel: { provider: "elevenlabs", voiceId: "MF3mGyEYCl7XYWbV9V6O" }, // Voix féminine professionnelle
    formel: { provider: "elevenlabs", voiceId: "TxGEqnHWrfWFTfGW9XjX" }, // Voix masculine formelle
  };

  return voiceMap[tone as keyof typeof voiceMap] || voiceMap["professionnel"];
}

async function saveAssistantToDatabase(
  config: any,
  user_id?: string
): Promise<void> {
  try {
    const { error } = await supabase.from("assistants").insert({
      user_id: user_id || null,
      name: config.assistant_name,
      business_type: config.business_type,
      vapi_assistant_id: config.vapi_assistant_id,
      phone_number: config.phone_number,
      phone_number_id: config.phone_number_id,
      config_json: config,
      is_active: true,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error("[DB] Save error:", error);
      throw error;
    }

    console.log("[DB] Assistant saved successfully");
  } catch (error) {
    console.error("[DB] Failed to save assistant:", error);
    // Ne pas faire échouer le processus si la sauvegarde échoue
  }
}
