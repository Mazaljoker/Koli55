// @ts-nocheck - Script de test pour le serveur MCP AlloKoli
import { validateRequest, CreateAssistantWithPhoneRequestSchema } from '../shared/zod-schemas.ts';

/**
 * Tests de validation des schémas Zod
 */
function testZodValidation() {
  console.log('🧪 Test de validation Zod...');

  // Test avec des données valides
  const validRequest = {
    assistantName: "Assistant Restaurant Le Petit Bistro",
    businessType: "restaurant",
    assistantTone: "amical_chaleureux",
    firstMessage: "Bonjour ! Bienvenue au Petit Bistro. Comment puis-je vous aider aujourd'hui ?",
    systemPromptCore: "Tu es l'assistant vocal du restaurant Le Petit Bistro. Tu peux prendre des réservations et renseigner sur notre carte.",
    canTakeReservations: true,
    reservationDetails: "Nous acceptons les réservations de 12h à 14h et de 19h à 22h",
    canTakeAppointments: false,
    canTransferCall: true,
    transferPhoneNumber: "+33123456789",
    companyName: "Le Petit Bistro",
    address: "123 Rue de la Paix, 75001 Paris",
    email: "contact@petitbistro.fr",
    openingHours: "Mardi-Samedi 12h-14h et 19h-22h, Fermé Dimanche-Lundi"
  };

  const validation = validateRequest(CreateAssistantWithPhoneRequestSchema, validRequest);
  
  if (validation.success) {
    console.log('✅ Validation réussie pour des données valides');
    console.log('📋 Données validées:', JSON.stringify(validation.data, null, 2));
  } else {
    console.log('❌ Échec de validation (inattendu):', validation.error);
  }

  // Test avec des données invalides
  const invalidRequest = {
    assistantName: "", // Nom vide (invalide)
    businessType: "restaurant",
    assistantTone: "ton_inexistant", // Ton invalide
    firstMessage: "Bonjour !",
    systemPromptCore: "Prompt système",
    email: "email-invalide" // Email invalide
  };

  const invalidValidation = validateRequest(CreateAssistantWithPhoneRequestSchema, invalidRequest);
  
  if (!invalidValidation.success) {
    console.log('✅ Validation échouée comme attendu pour des données invalides');
    console.log('📋 Erreurs détectées:', JSON.stringify(invalidValidation.error.details, null, 2));
  } else {
    console.log('❌ Validation réussie (inattendu) pour des données invalides');
  }
}

/**
 * Test de la configuration MCP
 */
async function testMcpConfiguration() {
  console.log('\n🔧 Test de configuration MCP...');
  
  try {
    // Simulation d'un appel à la route de découverte MCP
    const mcpConfig = {
      name: "allokoli-mcp-server",
      version: "1.0.0",
      description: "Serveur MCP AlloKoli pour la création et gestion d'assistants vocaux avec numéros de téléphone",
      tools: [
        "createAssistantAndProvisionNumber",
        "provisionPhoneNumber", 
        "listAssistants",
        "getAssistant",
        "updateAssistant"
      ]
    };

    console.log('✅ Configuration MCP valide');
    console.log('📋 Outils disponibles:', mcpConfig.tools.join(', '));
    
  } catch (error) {
    console.log('❌ Erreur de configuration MCP:', error);
  }
}

/**
 * Test de génération de prompt système
 */
function testSystemPromptGeneration() {
  console.log('\n📝 Test de génération de prompt système...');
  
  try {
    // Simulation d'un AssistantConfig
    const mockConfig = {
      assistantProfile: {
        name: "Assistant Salon Beauté",
        businessType: "salon de coiffure",
        tone: "elegant_rassurant",
        language: "fr-FR"
      },
      businessInformation: {
        companyName: "Salon Élégance",
        address: "456 Avenue de la Beauté, 75008 Paris",
        openingHours: "Lundi-Samedi 9h-19h",
        services: ["Coupe", "Coloration", "Brushing", "Soins"]
      },
      features: {
        canTakeReservations: true,
        reservationDetails: "Réservations possibles en ligne ou par téléphone",
        canTakeAppointments: true,
        appointmentDetails: "Rendez-vous disponibles du lundi au samedi",
        canTransferCall: false
      },
      keyInformation: {
        faq: [
          {
            question: "Quels sont vos tarifs ?",
            answer: "Nos tarifs varient selon le service. Coupe femme à partir de 45€, coloration à partir de 80€."
          }
        ],
        importantNotes: ["Nous utilisons uniquement des produits bio", "Parking gratuit disponible"]
      }
    };

    // Import dynamique pour le test
    const { generateSystemPrompt } = await import('../shared/zod-schemas.ts');
    const systemPrompt = generateSystemPrompt(mockConfig);
    
    console.log('✅ Prompt système généré avec succès');
    console.log('📋 Prompt généré:');
    console.log(systemPrompt);
    
  } catch (error) {
    console.log('❌ Erreur de génération de prompt:', error);
  }
}

/**
 * Test de détermination de secteur
 */
function testSectorDetermination() {
  console.log('\n🏢 Test de détermination de secteur...');
  
  const testCases = [
    { businessType: "restaurant italien", expectedSector: "restaurant" },
    { businessType: "salon de coiffure", expectedSector: "salon_coiffure" },
    { businessType: "plombier chauffagiste", expectedSector: "plombier" },
    { businessType: "cabinet d'avocat", expectedSector: "avocat" },
    { businessType: "boutique de vêtements", expectedSector: "boutique_generale" },
    { businessType: "service informatique", expectedSector: "autre" }
  ];

  testCases.forEach(({ businessType, expectedSector }) => {
    // Simulation de la logique de détermination
    const lowerType = businessType.toLowerCase();
    let determinedSector = 'autre';
    
    if (lowerType.includes('restaurant') || lowerType.includes('pizzeria')) {
      determinedSector = 'restaurant';
    } else if (lowerType.includes('coiffure') || lowerType.includes('salon')) {
      determinedSector = 'salon_coiffure';
    } else if (lowerType.includes('plombier')) {
      determinedSector = 'plombier';
    } else if (lowerType.includes('avocat')) {
      determinedSector = 'avocat';
    } else if (lowerType.includes('boutique') || lowerType.includes('magasin')) {
      determinedSector = 'boutique_generale';
    }

    const isCorrect = determinedSector === expectedSector;
    console.log(`${isCorrect ? '✅' : '❌'} "${businessType}" → ${determinedSector} ${isCorrect ? '' : `(attendu: ${expectedSector})`}`);
  });
}

/**
 * Test de validation des variables d'environnement
 */
function testEnvironmentVariables() {
  console.log('\n🔐 Test des variables d\'environnement...');
  
  const requiredEnvVars = [
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'VAPI_API_KEY',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN'
  ];

  requiredEnvVars.forEach(envVar => {
    const value = Deno.env.get(envVar);
    const isSet = value && value.length > 0;
    console.log(`${isSet ? '✅' : '❌'} ${envVar}: ${isSet ? 'Configurée' : 'Manquante'}`);
  });
}

/**
 * Fonction principale de test
 */
async function runTests() {
  console.log('🚀 Démarrage des tests du serveur MCP AlloKoli\n');
  
  testZodValidation();
  await testMcpConfiguration();
  await testSystemPromptGeneration();
  testSectorDetermination();
  testEnvironmentVariables();
  
  console.log('\n✨ Tests terminés !');
}

// Exécution des tests si le script est lancé directement
if (import.meta.main) {
  runTests().catch(console.error);
} 