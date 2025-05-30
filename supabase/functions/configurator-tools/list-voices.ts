// @ts-nocheck - Ignorer les erreurs TypeScript pour l'environnement Deno
import { corsHeaders } from "../shared/cors.ts";
import {
  createVapiErrorResponse,
  createVapiSingleResponse,
} from "../shared/response-helpers.ts";

// Types pour les recommandations vocales
interface VoiceRecommendation {
  id: string;
  name: string;
  provider: string;
  style: string;
  reason: string;
  sample_text?: string;
  language: string;
}

interface VoiceRecommendations {
  primary: VoiceRecommendation;
  alternatives: VoiceRecommendation[];
  sector_optimized: boolean;
}

// Configuration des voix par secteur
const SECTOR_VOICES = {
  restaurant: [
    {
      id: "azure_denise",
      name: "Denise - Chaleureuse",
      provider: "azure",
      voiceId: "fr-FR-DeniseNeural",
      style: "Accueillante et conviviale",
      reason: "Voix française naturelle, idéale pour restaurants",
      language: "fr-FR",
    },
    {
      id: "elevenlabs_sarah",
      name: "Sarah - Élégante",
      provider: "elevenlabs",
      voiceId: "shimmer",
      style: "Élégante et raffinée",
      reason: "Qualité premium pour expérience haut de gamme",
      language: "fr",
    },
    {
      id: "openai_alloy",
      name: "Alloy - Amicale",
      provider: "openai",
      voiceId: "alloy",
      style: "Décontractée et sympathique",
      reason: "Équilibre qualité/coût optimal",
      language: "fr",
    },
  ],
  salon: [
    {
      id: "elevenlabs_professional",
      name: "Emma - Professionnelle",
      provider: "elevenlabs",
      voiceId: "shimmer",
      style: "Professionnelle et bienveillante",
      reason: "Parfaite pour secteur beauté et bien-être",
      language: "fr",
    },
    {
      id: "azure_professional",
      name: "Julie - Experte",
      provider: "azure",
      voiceId: "fr-FR-DeniseNeural",
      style: "Experte et rassurante",
      reason: "Voix claire pour prises de rendez-vous",
      language: "fr-FR",
    },
    {
      id: "openai_nova",
      name: "Nova - Moderne",
      provider: "openai",
      voiceId: "nova",
      style: "Moderne et dynamique",
      reason: "Ton jeune adapté aux salons tendance",
      language: "fr",
    },
  ],
  ecommerce: [
    {
      id: "openai_alloy_support",
      name: "Alloy - Support",
      provider: "openai",
      voiceId: "alloy",
      style: "Patiente et informatrice",
      reason: "Idéale pour service client e-commerce",
      language: "fr",
    },
    {
      id: "azure_helpful",
      name: "Alice - Serviable",
      provider: "azure",
      voiceId: "fr-FR-DeniseNeural",
      style: "Dynamique et précise",
      reason: "Efficace pour informations produits",
      language: "fr-FR",
    },
    {
      id: "deepgram_efficient",
      name: "Aura - Efficace",
      provider: "deepgram",
      voiceId: "aura",
      style: "Rapide et claire",
      reason: "Optimisée pour latence faible",
      language: "fr",
    },
  ],
  artisan: [
    {
      id: "openai_echo",
      name: "Echo - Rassurant",
      provider: "openai",
      voiceId: "echo",
      style: "Calme et rassurant",
      reason: "Parfait pour urgences et dépannages",
      language: "fr",
    },
    {
      id: "azure_technical",
      name: "Marc - Technique",
      provider: "azure",
      voiceId: "fr-FR-HenriNeural",
      style: "Technique et direct",
      reason: "Voix masculine pour secteur technique",
      language: "fr-FR",
    },
    {
      id: "deepgram_fast",
      name: "Aura - Rapide",
      provider: "deepgram",
      voiceId: "aura",
      style: "Très rapide",
      reason: "Réponse immédiate pour urgences",
      language: "fr",
    },
  ],
  service: [
    {
      id: "elevenlabs_expert",
      name: "Marie - Experte",
      provider: "elevenlabs",
      voiceId: "shimmer",
      style: "Compétente et rassurante",
      reason: "Crédibilité pour services de conseil",
      language: "fr",
    },
    {
      id: "azure_consultant",
      name: "Sophie - Conseillère",
      provider: "azure",
      voiceId: "fr-FR-DeniseNeural",
      style: "Bienveillante et sage",
      reason: "Ton professionnel pour consultations",
      language: "fr-FR",
    },
    {
      id: "openai_professional",
      name: "Alloy - Corporate",
      provider: "openai",
      voiceId: "alloy",
      style: "Formelle et fiable",
      reason: "Standard professionnel polyvalent",
      language: "fr",
    },
  ],
  medical: [
    {
      id: "azure_medical",
      name: "Claire - Médicale",
      provider: "azure",
      voiceId: "fr-FR-DeniseNeural",
      style: "Calme et professionnelle",
      reason: "Adaptée au secteur médical",
      language: "fr-FR",
    },
    {
      id: "openai_calm",
      name: "Nova - Apaisante",
      provider: "openai",
      voiceId: "nova",
      style: "Douce et rassurante",
      reason: "Idéale pour patients anxieux",
      language: "fr",
    },
    {
      id: "elevenlabs_medical",
      name: "Dr. Emma - Experte",
      provider: "elevenlabs",
      voiceId: "shimmer",
      style: "Experte et bienveillante",
      reason: "Crédibilité médicale premium",
      language: "fr",
    },
  ],
};

/**
 * Génère un texte d'exemple personnalisé pour tester la voix
 */
function generateSampleText(sector: string, businessName?: string): string {
  const name = businessName || "votre entreprise";

  const samples = {
    restaurant: `Bonjour et bienvenue chez ${name} ! Avez-vous une réservation ou souhaitez-vous découvrir nos spécialités du jour ?`,
    salon: `Bonjour ! Bienvenue au salon ${name}. Avez-vous rendez-vous ou souhaitez-vous prendre un créneau pour une coupe ou une coloration ?`,
    ecommerce: `Bonjour ! Je suis l'assistante de ${name}. Je peux vous aider avec vos commandes, le suivi de livraison ou nos produits.`,
    artisan: `Bonjour, ici ${name}. Avez-vous une urgence de plomberie, électricité ou chauffage ? Je vous mets en relation rapidement.`,
    service: `Bonjour ! Je suis l'assistante de ${name}. Comment puis-je vous accompagner dans votre projet de consultation ?`,
    medical: `Bonjour, cabinet médical ${name}. Souhaitez-vous prendre rendez-vous ou avez-vous une urgence ?`,
  };

  return samples[sector as keyof typeof samples] || samples.service;
}

/**
 * Sélectionne les meilleures voix pour un secteur donné
 */
export async function listVoicesForSector(
  sector: string,
  language: string = "fr",
  businessName?: string
): Promise<VoiceRecommendations> {
  // Récupérer les voix pour le secteur (fallback sur service)
  const sectorVoices =
    SECTOR_VOICES[sector as keyof typeof SECTOR_VOICES] ||
    SECTOR_VOICES.service;

  // Filtrer par langue si spécifiée
  const filteredVoices = sectorVoices.filter((voice) =>
    voice.language.startsWith(language)
  );

  // Si pas de voix pour cette langue, prendre toutes les voix du secteur
  const availableVoices =
    filteredVoices.length > 0 ? filteredVoices : sectorVoices;

  // Voix principale (première de la liste)
  const primaryVoice = availableVoices[0];

  // Voix alternatives (les 2 suivantes)
  const alternatives = availableVoices.slice(1, 3);

  // Ajouter le texte d'exemple personnalisé
  const sampleText = generateSampleText(sector, businessName);

  return {
    primary: {
      ...primaryVoice,
      sample_text: sampleText,
    },
    alternatives: alternatives.map((voice) => ({
      ...voice,
      sample_text: sampleText,
    })),
    sector_optimized: true,
  };
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

    const { sector, language = "fr", businessName } = await req.json();

    if (!sector || typeof sector !== "string") {
      return createVapiErrorResponse("Secteur requis", 400);
    }

    // Obtenir les recommandations vocales
    const voiceRecommendations = await listVoicesForSector(
      sector,
      language,
      businessName
    );

    return createVapiSingleResponse({
      sector,
      language,
      recommendations: voiceRecommendations,
      total_voices: 1 + voiceRecommendations.alternatives.length,
    });
  } catch (error: any) {
    console.error("Erreur recommandations vocales:", error);
    return createVapiErrorResponse(error.message || "Erreur interne", 500);
  }
}
