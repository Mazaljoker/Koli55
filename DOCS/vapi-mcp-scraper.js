/**
 * 🎯 VAPI DOCUMENTATION MCP SCRAPER
 * =================================
 *
 * Version alternative utilisant le MCP Puppeteer déjà disponible
 * pour scrapper la documentation Vapi sans dépendances externes
 */

// URLs principales à scrapper
const VAPI_URLS = [
  // API Reference - Core
  "https://docs.vapi.ai/api-reference/assistants/create",
  "https://docs.vapi.ai/api-reference/assistants/update",
  "https://docs.vapi.ai/api-reference/assistants/list",
  "https://docs.vapi.ai/api-reference/assistants/get",
  "https://docs.vapi.ai/api-reference/assistants/delete",

  // API Reference - Calls
  "https://docs.vapi.ai/api-reference/calls/create",
  "https://docs.vapi.ai/api-reference/calls/list",
  "https://docs.vapi.ai/api-reference/calls/get",
  "https://docs.vapi.ai/api-reference/calls/update",
  "https://docs.vapi.ai/api-reference/calls/delete",

  // Configuration Guides
  "https://docs.vapi.ai/assistants",
  "https://docs.vapi.ai/voices",
  "https://docs.vapi.ai/models",
  "https://docs.vapi.ai/tools",
  "https://docs.vapi.ai/knowledge-bases",
  "https://docs.vapi.ai/workflows",

  // Advanced Features
  "https://docs.vapi.ai/tools/mcp",
  "https://docs.vapi.ai/tools/function-calling",
  "https://docs.vapi.ai/tools/webhooks",
  "https://docs.vapi.ai/analytics",
  "https://docs.vapi.ai/monitoring",

  // SDK Documentation
  "https://docs.vapi.ai/sdk/web",
  "https://docs.vapi.ai/sdk/python",
  "https://docs.vapi.ai/sdk/node",
  "https://docs.vapi.ai/sdk/react",

  // Voice Providers
  "https://docs.vapi.ai/voices/11labs",
  "https://docs.vapi.ai/voices/openai",
  "https://docs.vapi.ai/voices/playht",
  "https://docs.vapi.ai/voices/rime-ai",
  "https://docs.vapi.ai/voices/deepgram",
  "https://docs.vapi.ai/voices/azure",
  "https://docs.vapi.ai/voices/cartesia",
  "https://docs.vapi.ai/voices/lmnt",

  // Model Providers
  "https://docs.vapi.ai/models/openai",
  "https://docs.vapi.ai/models/anthropic",
  "https://docs.vapi.ai/models/together-ai",
  "https://docs.vapi.ai/models/anyscale",
  "https://docs.vapi.ai/models/openrouter",
  "https://docs.vapi.ai/models/perplexity-ai",
  "https://docs.vapi.ai/models/deepinfra",
  "https://docs.vapi.ai/models/groq",
  "https://docs.vapi.ai/models/custom-llm",

  // Transcription
  "https://docs.vapi.ai/transcription/deepgram",
  "https://docs.vapi.ai/transcription/assembly-ai",
  "https://docs.vapi.ai/transcription/gladia",
  "https://docs.vapi.ai/transcription/talkscriber",

  // Examples & Use Cases
  "https://docs.vapi.ai/examples",
  "https://docs.vapi.ai/use-cases",
  "https://docs.vapi.ai/quickstart",
  "https://docs.vapi.ai/tutorials",
];

// Structure pour stocker les données scrapées
const scrapedData = {
  metadata: {
    scrapedAt: new Date().toISOString(),
    totalPages: 0,
    version: "1.0.0",
  },
  pages: {},
  parameters: {
    all: [],
    categories: {},
  },
  examples: {
    all: [],
  },
  schemas: {
    all: [],
  },
};

console.log("🎯 VAPI MCP SCRAPER - Démarrage du scrapping...");
console.log(`📄 ${VAPI_URLS.length} pages à scrapper`);

// Cette partie sera exécutée manuellement avec le MCP Puppeteer
console.log(`
🚀 INSTRUCTIONS POUR LE SCRAPPING MANUEL :

1. Utilisez le MCP Puppeteer pour naviguer vers chaque URL
2. Extrayez les données avec le script d'évaluation ci-dessous
3. Consolidez les résultats dans la base de connaissances

📋 SCRIPT D'EXTRACTION À UTILISER :

// Script à exécuter sur chaque page Vapi
const extractPageData = () => {
  const data = {
    url: window.location.href,
    title: document.title,
    headings: [],
    parameters: [],
    examples: [],
    schemas: [],
    content: {}
  };

  // Extraire les titres
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(h => {
    data.headings.push({
      level: h.tagName.toLowerCase(),
      text: h.textContent.trim(),
      id: h.id || null
    });
  });

  // Extraire les paramètres Vapi
  const vapiKeywords = [
    'transcriber', 'model', 'voice', 'firstMessage', 'endCallMessage',
    'silenceTimeoutSeconds', 'maxDurationSeconds', 'backgroundSound',
    'forwardingPhoneNumber', 'clientMessages', 'serverMessages',
    'artifactPlan', 'analysisPlan', 'monitorPlan', 'startSpeakingPlan',
    'stopSpeakingPlan', 'credentialIds', 'server', 'tools', 'functions',
    'knowledgeBases', 'workflows', 'provider', 'voiceId', 'systemPrompt',
    'temperature', 'maxTokens', 'language', 'confidenceThreshold',
    'recordingEnabled', 'transcriptPlan', 'videoRecordingEnabled',
    'summaryPrompt', 'structuredDataPrompt', 'successEvaluationPrompt',
    'listenEnabled', 'controlEnabled', 'waitSeconds', 'numWords',
    'voiceSeconds', 'backoffSeconds', 'observabilityPlan',
    'transportConfigurations', 'credentials', 'hooks', 'variableValues',
    'endCallPhrases', 'voicemailMessage', 'voicemailDetection',
    'firstMessageMode', 'firstMessageInterruptionsEnabled',
    'endCallAfterSilence', 'backgroundDenoisingEnabled',
    'modelOutputInMessagesEnabled', 'stability', 'similarityBoost',
    'style', 'useSpeakerBoost', 'speed', 'pitch', 'emotion',
    'voiceGuidance', 'styleGuidance', 'textGuidance'
  ];

  const allText = document.body.innerText.toLowerCase();
  const foundKeywords = vapiKeywords.filter(keyword => 
    allText.includes(keyword.toLowerCase())
  );
  data.parameters = foundKeywords;

  // Extraire les exemples de code
  const codeBlocks = document.querySelectorAll('code, pre');
  codeBlocks.forEach(block => {
    const code = block.textContent.trim();
    if (code && code.length > 20) {
      data.examples.push({
        type: block.tagName.toLowerCase(),
        content: code.substring(0, 500), // Limiter la taille
        language: block.className || 'unknown'
      });
    }
  });

  // Extraire les schémas JSON
  const jsonBlocks = Array.from(codeBlocks).filter(block => {
    const text = block.textContent;
    return text.includes('{') && text.includes('}') && text.includes('"');
  });

  jsonBlocks.forEach(block => {
    const jsonText = block.textContent.trim();
    if ((jsonText.startsWith('{') || jsonText.startsWith('[')) && jsonText.length < 1000) {
      data.schemas.push({
        content: jsonText,
        context: block.closest('section')?.textContent?.substring(0, 100) || 'unknown'
      });
    }
  });

  // Extraire le contenu principal
  const mainContent = document.querySelector('main, .content, article, .documentation');
  if (mainContent) {
    data.content.text = mainContent.textContent.trim().substring(0, 2000);
  }

  return data;
};

// Retourner les données extraites
extractPageData();

🎯 URLS À SCRAPPER :
${VAPI_URLS.map((url, index) => `${index + 1}. ${url}`).join("\n")}

📊 PROGRESSION :
- Naviguez vers chaque URL avec mcp_puppeteer_navigate
- Exécutez le script d'extraction avec mcp_puppeteer_evaluate
- Sauvegardez les résultats pour consolidation finale
`);

module.exports = {
  VAPI_URLS,
  scrapedData,
  extractPageData: `
const extractPageData = () => {
  const data = {
    url: window.location.href,
    title: document.title,
    headings: [],
    parameters: [],
    examples: [],
    schemas: [],
    content: {}
  };

  // Extraire les titres
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach(h => {
    data.headings.push({
      level: h.tagName.toLowerCase(),
      text: h.textContent.trim(),
      id: h.id || null
    });
  });

  // Extraire les paramètres Vapi
  const vapiKeywords = [
    'transcriber', 'model', 'voice', 'firstMessage', 'endCallMessage',
    'silenceTimeoutSeconds', 'maxDurationSeconds', 'backgroundSound',
    'forwardingPhoneNumber', 'clientMessages', 'serverMessages',
    'artifactPlan', 'analysisPlan', 'monitorPlan', 'startSpeakingPlan',
    'stopSpeakingPlan', 'credentialIds', 'server', 'tools', 'functions',
    'knowledgeBases', 'workflows', 'provider', 'voiceId', 'systemPrompt',
    'temperature', 'maxTokens', 'language', 'confidenceThreshold',
    'recordingEnabled', 'transcriptPlan', 'videoRecordingEnabled',
    'summaryPrompt', 'structuredDataPrompt', 'successEvaluationPrompt',
    'listenEnabled', 'controlEnabled', 'waitSeconds', 'numWords',
    'voiceSeconds', 'backoffSeconds', 'observabilityPlan',
    'transportConfigurations', 'credentials', 'hooks', 'variableValues',
    'endCallPhrases', 'voicemailMessage', 'voicemailDetection',
    'firstMessageMode', 'firstMessageInterruptionsEnabled',
    'endCallAfterSilence', 'backgroundDenoisingEnabled',
    'modelOutputInMessagesEnabled', 'stability', 'similarityBoost',
    'style', 'useSpeakerBoost', 'speed', 'pitch', 'emotion',
    'voiceGuidance', 'styleGuidance', 'textGuidance'
  ];

  const allText = document.body.innerText.toLowerCase();
  const foundKeywords = vapiKeywords.filter(keyword => 
    allText.includes(keyword.toLowerCase())
  );
  data.parameters = foundKeywords;

  // Extraire les exemples de code
  const codeBlocks = document.querySelectorAll('code, pre');
  codeBlocks.forEach(block => {
    const code = block.textContent.trim();
    if (code && code.length > 20) {
      data.examples.push({
        type: block.tagName.toLowerCase(),
        content: code.substring(0, 500),
        language: block.className || 'unknown'
      });
    }
  });

  // Extraire les schémas JSON
  const jsonBlocks = Array.from(codeBlocks).filter(block => {
    const text = block.textContent;
    return text.includes('{') && text.includes('}') && text.includes('"');
  });

  jsonBlocks.forEach(block => {
    const jsonText = block.textContent.trim();
    if ((jsonText.startsWith('{') || jsonText.startsWith('[')) && jsonText.length < 1000) {
      data.schemas.push({
        content: jsonText,
        context: block.closest('section')?.textContent?.substring(0, 100) || 'unknown'
      });
    }
  });

  // Extraire le contenu principal
  const mainContent = document.querySelector('main, .content, article, .documentation');
  if (mainContent) {
    data.content.text = mainContent.textContent.trim().substring(0, 2000);
  }

  return data;
};

extractPageData();
  `,
};
