import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { corsHeaders } from "../shared/cors.ts";
import {
  createVapiErrorResponse,
  createVapiSingleResponse,
} from "../shared/response-helpers.ts";

// Types pour l'analyse business
interface BusinessAnalysis {
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

// Mapping des mots-clés sectoriels
const SECTOR_KEYWORDS = {
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
    "gastronomie",
    "chef",
    "plat",
  ],
  salon: [
    "salon",
    "coiffure",
    "coiffeur",
    "beauté",
    "esthétique",
    "rendez-vous",
    "coupe",
    "coloration",
    "manucure",
  ],
  ecommerce: [
    "boutique",
    "vente",
    "produits",
    "commerce",
    "magasin",
    "e-commerce",
    "commande",
    "livraison",
  ],
  artisan: [
    "plombier",
    "électricien",
    "chauffagiste",
    "dépannage",
    "intervention",
    "réparation",
    "urgence",
    "artisan",
  ],
  service: [
    "conseil",
    "service",
    "accompagnement",
    "formation",
    "consulting",
    "expertise",
    "consultation",
  ],
  medical: [
    "médecin",
    "docteur",
    "cabinet",
    "consultation",
    "santé",
    "patient",
    "rendez-vous médical",
    "praticien",
  ],
};

// Templates de configuration par secteur
const SECTOR_TEMPLATES = {
  restaurant: {
    id: "restaurant_fr",
    name: "Restaurant & Restauration",
    config: {
      systemPromptTemplate: "conversational_service",
      voiceStyle: "warm_welcoming",
      suggestedTools: [
        "make_reservation",
        "check_availability",
        "get_menu_info",
      ],
      keywords: ["réservation", "menu", "table", "horaires", "spécialités"],
      firstMessageTemplate:
        "Bonjour et bienvenue chez {business_name} ! Comment puis-je vous aider aujourd'hui ?",
      tone: "chaleureux",
      capabilities: [
        "reservations",
        "menu_info",
        "hours_info",
        "human_transfer",
      ],
    },
  },
  salon: {
    id: "salon_fr",
    name: "Salon de Coiffure & Beauté",
    config: {
      systemPromptTemplate: "appointment_focused",
      voiceStyle: "professional_friendly",
      suggestedTools: [
        "book_appointment",
        "check_availability",
        "service_info",
      ],
      keywords: ["rendez-vous", "coupe", "coloration", "disponibilité"],
      firstMessageTemplate:
        "Bonjour ! Bienvenue chez {business_name}. Souhaitez-vous prendre rendez-vous ?",
      tone: "professionnel et bienveillant",
      capabilities: ["appointments", "service_info", "availability", "pricing"],
    },
  },
  ecommerce: {
    id: "ecommerce_fr",
    name: "E-commerce & Boutique",
    config: {
      systemPromptTemplate: "customer_support",
      voiceStyle: "professional_helpful",
      suggestedTools: ["track_order", "product_info", "return_process"],
      keywords: ["commande", "livraison", "produit", "retour", "taille"],
      firstMessageTemplate:
        "Bonjour ! Je suis l'assistant de {business_name}. Comment puis-je vous aider ?",
      tone: "serviable et efficace",
      capabilities: ["order_tracking", "product_info", "returns", "support"],
    },
  },
  artisan: {
    id: "artisan_fr",
    name: "Artisan & Dépannage",
    config: {
      systemPromptTemplate: "urgent_direct",
      voiceStyle: "efficient_reassuring",
      suggestedTools: [
        "emergency_dispatch",
        "quote_request",
        "availability_check",
      ],
      keywords: ["urgence", "dépannage", "intervention", "devis"],
      firstMessageTemplate:
        "Bonjour, {business_name} à votre service. Avez-vous une urgence ?",
      tone: "rassurant et efficace",
      capabilities: [
        "emergency_handling",
        "scheduling",
        "quotes",
        "technical_support",
      ],
    },
  },
  service: {
    id: "service_fr",
    name: "Services & Conseil",
    config: {
      systemPromptTemplate: "professional_consultant",
      voiceStyle: "expert_professional",
      suggestedTools: ["book_consultation", "qualify_need", "transfer_expert"],
      keywords: ["consultation", "expertise", "accompagnement", "conseil"],
      firstMessageTemplate:
        "Bonjour ! Je suis l'assistant de {business_name}. Comment puis-je vous accompagner ?",
      tone: "expert et professionnel",
      capabilities: [
        "consultations",
        "lead_qualification",
        "expert_transfer",
        "information",
      ],
    },
  },
  medical: {
    id: "medical_fr",
    name: "Cabinet Médical",
    config: {
      systemPromptTemplate: "medical_professional",
      voiceStyle: "calm_professional",
      suggestedTools: [
        "book_appointment",
        "emergency_triage",
        "prescription_info",
      ],
      keywords: ["rendez-vous", "urgence", "consultation", "docteur"],
      firstMessageTemplate:
        "Bonjour, cabinet {business_name}. Souhaitez-vous prendre rendez-vous ?",
      tone: "calme et professionnel",
      capabilities: [
        "appointments",
        "emergency_triage",
        "information",
        "prescription_support",
      ],
    },
  },
};

/**
 * Détecte le secteur d'activité basé sur les mots-clés
 */
function detectSector(description: string): {
  sector: string;
  confidence: number;
} {
  const text = description.toLowerCase();
  const scores: Record<string, number> = {};

  // Calculer le score pour chaque secteur
  for (const [sector, keywords] of Object.entries(SECTOR_KEYWORDS)) {
    scores[sector] = 0;

    for (const keyword of keywords) {
      if (text.includes(keyword.toLowerCase())) {
        scores[sector] += 1;
      }
    }

    // Bonus pour les mots-clés exacts
    for (const keyword of keywords) {
      if (
        text.includes(` ${keyword.toLowerCase()} `) ||
        text.startsWith(`${keyword.toLowerCase()} `) ||
        text.endsWith(` ${keyword.toLowerCase()}`)
      ) {
        scores[sector] += 0.5;
      }
    }
  }

  // Trouver le secteur avec le meilleur score
  let bestSector = "service"; // Par défaut
  let bestScore = 0;

  for (const [sector, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestSector = sector;
    }
  }

  // Calculer la confiance (0-1)
  const confidence = Math.min(bestScore / 3, 1); // 3 mots-clés = 100% confiance

  return { sector: bestSector, confidence };
}

/**
 * Extrait les informations métier du texte
 */
function extractBusinessInfo(description: string) {
  const text = description.toLowerCase();

  // Extraction du nom (patterns courants)
  const namePatterns = [
    /(?:restaurant|chez|salon|boutique|cabinet)\s+([a-zA-ZÀ-ÿ\s]{2,20})/i,
    /([a-zA-ZÀ-ÿ\s]{2,20})\s+(?:restaurant|salon|boutique)/i,
    /je\s+(?:suis|gère|dirige)\s+([a-zA-ZÀ-ÿ\s]{2,20})/i,
  ];

  let businessName = "";
  for (const pattern of namePatterns) {
    const match = description.match(pattern);
    if (match) {
      businessName = match[1].trim();
      break;
    }
  }

  // Extraction de la localisation
  const locationPatterns = [
    /à\s+([a-zA-ZÀ-ÿ\s]{2,20})/i,
    /sur\s+([a-zA-ZÀ-ÿ\s]{2,20})/i,
    /dans\s+([a-zA-ZÀ-ÿ\s]{2,20})/i,
  ];

  let location = "";
  for (const pattern of locationPatterns) {
    const match = description.match(pattern);
    if (match) {
      location = match[1].trim();
      break;
    }
  }

  // Extraction des services/spécialités
  const services: string[] = [];
  const servicePatterns = [
    /(?:spécialisé|spécialités?)\s+(?:en|dans)\s+([a-zA-ZÀ-ÿ\s,]{5,50})/i,
    /(?:propose|offre|fait)\s+([a-zA-ZÀ-ÿ\s,]{5,50})/i,
    /(?:livraison|à emporter|sur place|dépannage|urgence)/gi,
  ];

  for (const pattern of servicePatterns) {
    const matches = description.match(pattern);
    if (matches) {
      if (typeof matches[1] === "string") {
        services.push(...matches[1].split(",").map((s) => s.trim()));
      } else {
        services.push(matches[0]);
      }
    }
  }

  // Fix pour l'erreur Set iteration
  const uniqueServices = services.filter((s) => s.length > 2);
  const servicesArray = Array.from(new Set(uniqueServices));

  return {
    businessName: businessName || "",
    location: location || "",
    services: servicesArray,
  };
}

/**
 * Détermine la taille de l'entreprise
 */
function detectBusinessSize(description: string): "small" | "medium" | "large" {
  const text = description.toLowerCase();

  // Indicateurs de grande entreprise
  if (
    text.includes("chaîne") ||
    text.includes("plusieurs") ||
    text.includes("franchise") ||
    text.includes("réseau") ||
    text.includes("filiales") ||
    text.includes("groupe")
  ) {
    return "large";
  }

  // Indicateurs de moyenne entreprise
  if (
    text.includes("équipe") ||
    text.includes("collaborateurs") ||
    text.includes("succursale") ||
    text.includes("agence")
  ) {
    return "medium";
  }

  // Par défaut, petite entreprise
  return "small";
}

/**
 * Fonction principale d'analyse business
 */
export async function analyzeBusinessContext(
  description: string
): Promise<BusinessAnalysis> {
  // Détection du secteur
  const { sector, confidence } = detectSector(description);

  // Extraction des informations
  const detectedInfo = extractBusinessInfo(description);

  // Détection de la taille
  const size = detectBusinessSize(description);

  // Sélection du template approprié
  const template =
    SECTOR_TEMPLATES[sector as keyof typeof SECTOR_TEMPLATES] ||
    SECTOR_TEMPLATES.service;

  return {
    sector,
    size,
    services: detectedInfo.services,
    confidence,
    detectedInfo,
    recommendedTemplate: {
      id: template.id,
      name: template.name,
      config: template.config,
    },
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

    const { description } = await req.json();

    if (!description || typeof description !== "string") {
      return createVapiErrorResponse("Description business requise", 400);
    }

    // Analyse du contexte business
    const analysis = await analyzeBusinessContext(description);

    return createVapiSingleResponse({
      analysis,
      recommendations: {
        template: analysis.recommendedTemplate,
        confidence: analysis.confidence,
        detected_sector: analysis.sector,
        business_size: analysis.size,
      },
    });
  } catch (error: any) {
    console.error("Erreur analyse business:", error);
    return createVapiErrorResponse(error.message || "Erreur interne", 500);
  }
}
