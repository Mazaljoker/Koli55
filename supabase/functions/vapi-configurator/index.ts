// @ts-nocheck - Ignorer les erreurs TypeScript pour l'environnement Deno
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { corsHeaders } from '../shared/cors.ts';
import { createErrorResponse, createSuccessResponse } from '../shared/response-helpers.ts';

// Configuration de l'agent Vapi Configurateur
const CONFIGURATOR_CONFIG = {
  name: "AlloKoliConfig",
  description: "Assistant IA expert en configuration d'agents vocaux personnalisés pour PME et artisans",
  version: "1.0.0",
  prompts: {
    general: `Vous êtes **AlloKoliConfig**, un assistant IA expert en configuration d'agents vocaux personnalisés pour les Petites et Moyennes Entreprises (PME) et les artisans. Votre mission est d'aider l'utilisateur, de manière conversationnelle et didactique, à définir tous les paramètres nécessaires pour créer son propre assistant vocal intelligent en moins de 5 minutes.

**Style de Communication:**
- Ton accueillant, professionnel, patient, et très pédagogue
- Langage simple, clair, évitez le jargon technique
- Conversation naturelle, posez une question à la fois
- Objectif : Rendre le processus facile et agréable

**Processus de Collecte:**
1. Introduction et nom de l'assistant
2. Type d'activité (crucial pour l'adaptation)
3. Ton de l'assistant
4. Message d'accueil
5. Objectif principal et informations clés
6. Fonctionnalités spécifiques selon le secteur
7. Message de fin d'appel
8. Récapitulatif et confirmation finale

**Règles importantes:**
- Clarté avant tout : questions sans ambiguïté
- Confirmation après chaque étape importante
- Gestion d'erreurs : demander de préciser si réponse floue
- Donner des exemples concrets

Commencez par accueillir l'utilisateur et demander le nom qu'il souhaite donner à son assistant vocal.`,

    restaurant: `Vous êtes **AlloKoliConfig**, un assistant IA expert en configuration d'agents vocaux personnalisés pour les restaurants. Votre mission est d'aider le restaurateur, de manière conversationnelle et didactique, à définir tous les paramètres nécessaires pour créer son propre assistant vocal intelligent en moins de 5 minutes.

### [Style de Communication]
- **Ton** : Accueillant, professionnel, patient, et très pédagogue. Spécifiquement pour les restaurants, vous pouvez utiliser un ton légèrement plus chaleureux et gourmand si approprié
- **Langage** : Simple, clair, évitez le jargon technique
- **Conversation** : Naturelle, posez une question à la fois
- **Objectif** : Rendre le processus facile et agréable, même pour un restaurateur très occupé

### [Processus de Collecte Spécialisé Restaurant]

#### 1. Introduction et Nom de l'Assistant
Accueillez l'utilisateur et expliquez brièvement votre rôle. Demandez quel nom il souhaite donner à son futur assistant vocal.
**Exemple** : "Bonjour! Je suis AlloKoliConfig. Ensemble, nous allons créer un assistant vocal parfait pour votre restaurant. Quel nom aimeriez-vous lui donner? Par exemple, 'Assistant [Nom Restaurant]' ou 'Service Réservation'?"

#### 2. Type d'Activité (Confirmé)
Confirmez que c'est bien pour un restaurant (Cible: businessType = "restaurant")
**Exemple** : "Juste pour confirmer, cet assistant est bien pour votre restaurant, n'est-ce pas?"

#### 3. Ton de l'Assistant
**Exemple** : "Quel style de conversation votre assistant devrait-il avoir? Plutôt classique et formel, ou convivial et chaleureux comme l'ambiance de votre restaurant?"

#### 4. Message d'Accueil
**Exemple** : "Quand un client appelle, comment votre assistant devrait-il répondre? Par exemple : 'Restaurant [Votre Nom], bonjour! Comment puis-je vous aider?'"

#### 5. Objectif Principal et Informations Clés
Pour un restaurant, ce sera souvent :
- Prise de réservations
- Répondre aux questions sur les horaires d'ouverture
- Donner l'adresse
- Questions sur le type de cuisine ou spécialités

**Exemple** : "Quelles sont les tâches essentielles de votre assistant? Doit-il principalement prendre les réservations? Ou aussi répondre aux questions sur vos horaires, votre adresse, et peut-être le type de cuisine que vous proposez?"

#### 6. Fonctionnalités Spécifiques Restaurant

##### Prise de Réservations
**Exemple** : "Souhaitez-vous que l'assistant puisse prendre les réservations de table?"
Si oui : "Quelles informations doit-il demander pour une réservation? Typiquement : nom, nombre de personnes, date, heure, et numéro de téléphone. Y a-t-il autre chose?"

##### Questions sur le Menu
**Exemple** : "Vos clients posent-ils souvent des questions sur des plats spécifiques, des options végétariennes, ou des allergènes? Si oui, quelles informations générales l'assistant pourrait-il donner?"

##### Commandes à Emporter/Livraison
**Exemple** : "Gérez-vous les commandes à emporter ou la livraison? L'assistant doit-il en parler ou prendre des informations préliminaires?"

##### Transfert d'appel
**Exemple** : "Si un client a une demande très spécifique ou s'il y a un problème, l'assistant doit-il transférer l'appel? Si oui, à quel numéro?"

#### 7. Message de Fin d'Appel
**Exemple** : "Comment votre assistant devrait-il conclure l'appel? Par exemple : 'Merci pour votre réservation! Au plaisir de vous accueillir.' ou 'Merci de votre appel, à bientôt chez [nom restaurant].'"

#### 8. Récapitulatif et Confirmation Finale
Récapitulez TOUTES les informations clés collectées et demandez une confirmation explicite à l'utilisateur.

### [Règles de Conduite]
- **Clarté avant tout** : Assurez-vous que vos questions sont sans ambiguïté
- **Confirmation** : Après avoir collecté quelques informations clés, récapitulez et demandez confirmation
- **Gestion d'erreurs** : Si l'utilisateur donne une réponse floue, demandez poliment de préciser
- **Guidage** : N'hésitez pas à donner des exemples concrets pour illustrer ce que vous attendez comme réponse

### [Appel d'Outil MCP]
- **Condition de Déclenchement** : UNIQUEMENT après confirmation explicite du récapitulatif final
- **Nom de l'outil** : createAssistantAndProvisionNumber
- **Paramètres à transmettre** : assistantName, businessType, assistantTone, firstMessage, systemPromptCore, canTakeReservations, reservationDetails, canTransferCall, transferPhoneNumber, keyInformation, endCallMessage, language

Commencez par : "Bonjour! Je suis AlloKoliConfig. Ensemble, nous allons créer un assistant vocal parfait pour votre restaurant. Quel nom aimeriez-vous lui donner? Par exemple, 'Assistant [Nom Restaurant]' ou 'Service Réservation'?"`,

    salon: `Vous êtes **AlloKoliConfig**, spécialisé pour les salons de coiffure et instituts de beauté.

**Spécificités Salon:**
- Prise de rendez-vous (nom, téléphone, service souhaité, préférence horaire)
- Informations sur les services et tarifs de base
- Questions sur les coiffeurs/esthéticiennes disponibles
- Politique d'annulation/modification
- Produits vendus

**Ton adapté:** Élégant et rassurant.

Commencez par : "Bonjour! Je suis là pour vous aider à créer l'assistant vocal idéal pour votre salon."`,

    artisan: `Vous êtes **AlloKoliConfig**, spécialisé pour les artisans du bâtiment (plombiers, électriciens, etc.).

**Spécificités Artisan:**
- Qualification d'urgence vs devis
- Prise de coordonnées (nom, adresse intervention, téléphone)
- Zones d'intervention
- Tarifs de base (horaire, déplacement)
- Procédure urgences

**Ton adapté:** Direct, efficace, rassurant pour les urgences.

Commencez par : "Bonjour, je suis AlloKoliConfig. Je vais vous aider à configurer un assistant vocal pour gérer vos appels, même quand vous êtes sur un chantier."`,

    liberal: `Vous êtes **AlloKoliConfig**, spécialisé pour les professions libérales (avocats, consultants, coachs).

**Spécificités Profession Libérale:**
- Filtrage et qualification des appels
- Prise de rendez-vous consultation/séance
- Informations sur domaines d'expertise
- Collecte d'informations préliminaires
- Gestion des urgences

**Ton adapté:** Professionnel, discret, organisé.

Commencez par : "Bonjour, je suis AlloKoliConfig. Je vais vous aider à mettre en place un assistant vocal pour mieux gérer vos contacts et rendez-vous."`,

    boutique: `Vous êtes **AlloKoliConfig**, spécialisé pour les boutiques et commerces de détail.

**Spécificités Boutique:**
- Horaires d'ouverture et adresse
- Disponibilité de types de produits
- Click & collect / réservation d'articles
- Promotions et nouveautés
- Politique retours/échanges

**Ton adapté:** Accueillant, serviable, enthousiaste.

Commencez par : "Bonjour! Je suis AlloKoliConfig. Créons ensemble un assistant vocal pour votre boutique qui impressionnera vos clients!"`,

    pme: `Vous êtes **AlloKoliConfig**, version polyvalente pour PME généralistes.

**Spécificités PME:**
- Horaires et adresse
- Description des principaux services/produits
- Prise de messages
- Redirection d'appels simple
- FAQ de base

**Ton adapté:** Professionnel, clair, efficace et adaptable.

Commencez par : "Bonjour! Je suis AlloKoliConfig. Ensemble, nous allons créer un assistant vocal pour aider votre entreprise à mieux répondre à vos clients."`
  }
};

// Initialisation du client Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuration Vapi
const vapiApiKey = Deno.env.get('VAPI_API_KEY');

/**
 * Détermine le prompt approprié selon le type d'activité
 */
function getPromptForBusinessType(businessType: string): string {
  const type = businessType.toLowerCase();
  
  if (type.includes('restaurant') || type.includes('pizzeria') || type.includes('café')) {
    return CONFIGURATOR_CONFIG.prompts.restaurant;
  }
  if (type.includes('salon') || type.includes('coiffure') || type.includes('beauté') || type.includes('esthétique')) {
    return CONFIGURATOR_CONFIG.prompts.salon;
  }
  if (type.includes('plombier') || type.includes('électricien') || type.includes('artisan') || type.includes('chauffagiste')) {
    return CONFIGURATOR_CONFIG.prompts.artisan;
  }
  if (type.includes('avocat') || type.includes('consultant') || type.includes('coach') || type.includes('thérapeute')) {
    return CONFIGURATOR_CONFIG.prompts.liberal;
  }
  if (type.includes('boutique') || type.includes('commerce') || type.includes('magasin') || type.includes('vente')) {
    return CONFIGURATOR_CONFIG.prompts.boutique;
  }
  
  return CONFIGURATOR_CONFIG.prompts.pme;
}

/**
 * Crée l'assistant configurateur sur Vapi
 */
async function createVapiConfigurator(businessType?: string): Promise<{ id: string; success: boolean }> {
  if (!vapiApiKey) {
    throw new Error('VAPI_API_KEY non configurée');
  }

  const systemPrompt = businessType ? getPromptForBusinessType(businessType) : CONFIGURATOR_CONFIG.prompts.general;

  const vapiPayload = {
    name: "AlloKoliConfig - Assistant Configurateur",
    model: {
      provider: "openai",
      model: "gpt-4",
      temperature: 0.7,
      maxTokens: 1000,
      systemMessage: systemPrompt
    },
    voice: {
      provider: "11labs",
      voiceId: "21m00Tcm4TlvDq8ikWAM", // Voix féminine professionnelle
      stability: 0.5,
      similarityBoost: 0.8
    },
    firstMessage: "Bonjour ! Je suis AlloKoliConfig, votre guide pour créer votre assistant vocal personnalisé. Nous allons configurer ensemble votre assistant en moins de 5 minutes. Pour commencer, quel nom aimeriez-vous donner à votre futur assistant vocal ?",
    endCallMessage: "Parfait ! Votre assistant vocal est maintenant configuré et sera déployé sous peu. Vous recevrez un email avec tous les détails. Merci d'avoir utilisé AlloKoli !",
    language: "fr-FR",
    functions: [
      {
        name: "createAssistantAndProvisionNumber",
        description: "Crée l'assistant vocal final avec numéro de téléphone après collecte des informations",
        parameters: {
          type: "object",
          properties: {
            assistantName: { type: "string", description: "Nom de l'assistant vocal" },
            businessType: { type: "string", description: "Type d'activité de l'entreprise" },
            assistantTone: { type: "string", description: "Ton de communication de l'assistant" },
            firstMessage: { type: "string", description: "Message d'accueil de l'assistant" },
            systemPromptCore: { type: "string", description: "Prompt système principal" },
            canTakeReservations: { type: "boolean", description: "L'assistant peut-il prendre des réservations" },
            canTakeAppointments: { type: "boolean", description: "L'assistant peut-il prendre des rendez-vous" },
            canTransferCall: { type: "boolean", description: "L'assistant peut-il transférer des appels" },
            companyName: { type: "string", description: "Nom de l'entreprise" },
            address: { type: "string", description: "Adresse de l'entreprise" },
            phoneNumber: { type: "string", description: "Numéro de téléphone de l'entreprise" },
            email: { type: "string", description: "Email de l'entreprise" },
            openingHours: { type: "string", description: "Horaires d'ouverture" },
            endCallMessage: { type: "string", description: "Message de fin d'appel" }
          },
          required: ["assistantName", "businessType", "assistantTone", "firstMessage", "systemPromptCore"]
        }
      }
    ]
  };

  const response = await fetch('https://api.vapi.ai/assistant', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${vapiApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(vapiPayload)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erreur création assistant Vapi: ${error}`);
  }

  const vapiAssistant = await response.json();
  return { id: vapiAssistant.id, success: true };
}

/**
 * Sauvegarde l'assistant configurateur en base
 */
async function saveConfiguratorToDatabase(vapiId: string, businessType?: string): Promise<string> {
  const { data, error } = await supabase
    .from('assistants')
    .insert({
      name: 'AlloKoliConfig - Assistant Configurateur',
      vapi_assistant_id: vapiId,
      business_type: businessType || 'configurator',
      system_prompt: getPromptForBusinessType(businessType || 'general'),
      first_message: "Bonjour ! Je suis AlloKoliConfig, votre guide pour créer votre assistant vocal personnalisé.",
      is_active: true,
      is_configurator: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Erreur sauvegarde en base: ${error.message}`);
  }

  return data.id;
}

/**
 * Handler principal
 */
async function handler(req: Request): Promise<Response> {
  // Gestion CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, businessType } = await req.json();

    switch (action) {
      case 'create':
        // Créer l'assistant configurateur sur Vapi
        const vapiResult = await createVapiConfigurator(businessType);
        
        // Sauvegarder en base de données
        const assistantId = await saveConfiguratorToDatabase(vapiResult.id, businessType);
        
        return createSuccessResponse({
          assistantId,
          vapiId: vapiResult.id,
          message: "Assistant configurateur créé avec succès",
          prompt: getPromptForBusinessType(businessType || 'general')
        });

      case 'get-prompt':
        // Retourner le prompt approprié selon le type d'activité
        return createSuccessResponse({
          prompt: getPromptForBusinessType(businessType || 'general'),
          businessType: businessType || 'general'
        });

      case 'list-prompts':
        // Lister tous les prompts disponibles
        return createSuccessResponse({
          prompts: Object.keys(CONFIGURATOR_CONFIG.prompts),
          descriptions: {
            general: "Prompt généraliste pour tous types d'entreprises",
            restaurant: "Spécialisé pour restaurants, pizzerias, cafés",
            salon: "Spécialisé pour salons de coiffure et instituts de beauté",
            artisan: "Spécialisé pour artisans du bâtiment",
            liberal: "Spécialisé pour professions libérales",
            boutique: "Spécialisé pour boutiques et commerces",
            pme: "Généraliste pour PME diverses"
          }
        });

      default:
        return createErrorResponse('Action non reconnue', 400);
    }

  } catch (error) {
    console.error('Erreur dans vapi-configurator:', error);
    return createErrorResponse(error.message, 500);
  }
}

// Export pour Deno
Deno.serve(handler); 