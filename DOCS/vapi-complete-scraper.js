/**
 * 🎯 VAPI DOCUMENTATION COMPLETE SCRAPER
 * =====================================
 *
 * Script pour scrapper TOUTE la documentation Vapi et créer une base de connaissances
 * complète pour l'assistant configurateur AlloKoli.
 *
 * Usage: node vapi-complete-scraper.js
 * Output: ./vapi-knowledge-base.json
 */

const puppeteer = require("puppeteer");
const fs = require("fs").promises;
const path = require("path");

// Configuration du scrapper
const SCRAPER_CONFIG = {
  baseUrl: "https://docs.vapi.ai",
  outputFile: "./DOCS/vapi-knowledge-base.json",
  delay: 2000, // Délai entre les requêtes pour éviter le rate limiting
  maxRetries: 3,
  userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
};

// URLs principales à scrapper
const VAPI_URLS = [
  // API Reference - Core
  "/api-reference/assistants/create",
  "/api-reference/assistants/update",
  "/api-reference/assistants/list",
  "/api-reference/assistants/get",
  "/api-reference/assistants/delete",

  // API Reference - Calls
  "/api-reference/calls/create",
  "/api-reference/calls/list",
  "/api-reference/calls/get",
  "/api-reference/calls/update",
  "/api-reference/calls/delete",

  // API Reference - Phone Numbers
  "/api-reference/phone-numbers/create",
  "/api-reference/phone-numbers/list",
  "/api-reference/phone-numbers/get",
  "/api-reference/phone-numbers/update",
  "/api-reference/phone-numbers/delete",

  // API Reference - Tools
  "/api-reference/tools/create",
  "/api-reference/tools/list",
  "/api-reference/tools/get",
  "/api-reference/tools/update",
  "/api-reference/tools/delete",

  // Configuration Guides
  "/assistants",
  "/voices",
  "/models",
  "/tools",
  "/knowledge-bases",
  "/workflows",
  "/functions",

  // Advanced Features
  "/tools/mcp",
  "/tools/function-calling",
  "/tools/webhooks",
  "/analytics",
  "/monitoring",
  "/observability",

  // SDK Documentation
  "/sdk/web",
  "/sdk/python",
  "/sdk/node",
  "/sdk/react",

  // Integration Guides
  "/integrations",
  "/webhooks",
  "/real-time",
  "/streaming",

  // Voice Providers
  "/voices/11labs",
  "/voices/openai",
  "/voices/playht",
  "/voices/rime-ai",
  "/voices/deepgram",
  "/voices/azure",
  "/voices/cartesia",
  "/voices/lmnt",

  // Model Providers
  "/models/openai",
  "/models/anthropic",
  "/models/together-ai",
  "/models/anyscale",
  "/models/openrouter",
  "/models/perplexity-ai",
  "/models/deepinfra",
  "/models/groq",
  "/models/custom-llm",

  // Transcription
  "/transcription/deepgram",
  "/transcription/assembly-ai",
  "/transcription/gladia",
  "/transcription/talkscriber",

  // Examples & Use Cases
  "/examples",
  "/use-cases",
  "/quickstart",
  "/tutorials",
];

class VapiDocScraper {
  constructor() {
    this.browser = null;
    this.page = null;
    this.scrapedData = {
      metadata: {
        scrapedAt: new Date().toISOString(),
        totalPages: 0,
        version: "1.0.0",
      },
      pages: {},
      parameters: {},
      examples: {},
      schemas: {},
    };
  }

  async init() {
    console.log("🚀 Initialisation du scrapper Vapi...");

    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });

    this.page = await this.browser.newPage();
    await this.page.setUserAgent(SCRAPER_CONFIG.userAgent);
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async scrapePage(url) {
    const fullUrl = `${SCRAPER_CONFIG.baseUrl}${url}`;
    console.log(`📄 Scrapping: ${fullUrl}`);

    try {
      await this.page.goto(fullUrl, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Attendre que le contenu soit chargé
      await this.page.waitForTimeout(SCRAPER_CONFIG.delay);

      // Extraire toutes les données de la page
      const pageData = await this.page.evaluate(() => {
        const data = {
          url: window.location.href,
          title: document.title,
          headings: [],
          parameters: [],
          examples: [],
          schemas: [],
          content: {},
          navigation: [],
        };

        // Extraire les titres et structure
        const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
        headings.forEach((h) => {
          data.headings.push({
            level: h.tagName.toLowerCase(),
            text: h.textContent.trim(),
            id: h.id || null,
          });
        });

        // Extraire les paramètres API
        const paramElements = document.querySelectorAll(
          '[data-testid*="parameter"], .parameter'
        );
        paramElements.forEach((el) => {
          const paramText = el.textContent.trim();
          if (paramText) {
            data.parameters.push(paramText);
          }
        });

        // Extraire les exemples de code
        const codeBlocks = document.querySelectorAll("code, pre");
        codeBlocks.forEach((block) => {
          const code = block.textContent.trim();
          if (code && code.length > 10) {
            data.examples.push({
              type: block.tagName.toLowerCase(),
              content: code,
              language: block.className || "unknown",
            });
          }
        });

        // Extraire les schémas JSON
        const jsonBlocks = Array.from(codeBlocks).filter((block) => {
          const text = block.textContent;
          return text.includes("{") && text.includes("}") && text.includes('"');
        });

        jsonBlocks.forEach((block) => {
          try {
            const jsonText = block.textContent.trim();
            if (jsonText.startsWith("{") || jsonText.startsWith("[")) {
              data.schemas.push({
                content: jsonText,
                context:
                  block.closest("section")?.textContent?.substring(0, 100) ||
                  "unknown",
              });
            }
          } catch (e) {
            // Ignore les erreurs de parsing JSON
          }
        });

        // Extraire la navigation
        const navLinks = document.querySelectorAll(
          'nav a, .sidebar a, [role="navigation"] a'
        );
        navLinks.forEach((link) => {
          if (link.href && link.textContent.trim()) {
            data.navigation.push({
              text: link.textContent.trim(),
              href: link.href,
              isActive:
                link.classList.contains("active") ||
                link.getAttribute("aria-current") === "page",
            });
          }
        });

        // Extraire le contenu textuel principal
        const mainContent = document.querySelector(
          "main, .content, article, .documentation"
        );
        if (mainContent) {
          data.content.text = mainContent.textContent.trim();
          data.content.html = mainContent.innerHTML;
        }

        return data;
      });

      this.scrapedData.pages[url] = pageData;
      this.scrapedData.metadata.totalPages++;

      console.log(
        `✅ Page scrapée: ${pageData.title} (${pageData.parameters.length} paramètres, ${pageData.examples.length} exemples)`
      );
    } catch (error) {
      console.error(
        `❌ Erreur lors du scrapping de ${fullUrl}:`,
        error.message
      );
      this.scrapedData.pages[url] = {
        error: error.message,
        url: fullUrl,
        scrapedAt: new Date().toISOString(),
      };
    }
  }

  async scrapeAll() {
    console.log(`🎯 Début du scrapping de ${VAPI_URLS.length} pages Vapi...`);

    for (let i = 0; i < VAPI_URLS.length; i++) {
      const url = VAPI_URLS[i];
      console.log(`📊 Progression: ${i + 1}/${VAPI_URLS.length}`);

      await this.scrapePage(url);

      // Délai entre les requêtes
      if (i < VAPI_URLS.length - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, SCRAPER_CONFIG.delay)
        );
      }
    }
  }

  async generateKnowledgeBase() {
    console.log("🧠 Génération de la base de connaissances...");

    // Consolider tous les paramètres
    const allParameters = new Set();
    const allExamples = [];
    const allSchemas = [];

    Object.values(this.scrapedData.pages).forEach((page) => {
      if (page.parameters) {
        page.parameters.forEach((param) => allParameters.add(param));
      }
      if (page.examples) {
        allExamples.push(...page.examples);
      }
      if (page.schemas) {
        allSchemas.push(...page.schemas);
      }
    });

    this.scrapedData.parameters.all = Array.from(allParameters);
    this.scrapedData.examples.all = allExamples;
    this.scrapedData.schemas.all = allSchemas;

    // Créer des catégories de paramètres
    this.scrapedData.parameters.categories = {
      assistant: this.scrapedData.parameters.all.filter(
        (p) =>
          p.toLowerCase().includes("assistant") ||
          p.toLowerCase().includes("firstmessage") ||
          p.toLowerCase().includes("endcall")
      ),
      voice: this.scrapedData.parameters.all.filter(
        (p) =>
          p.toLowerCase().includes("voice") ||
          p.toLowerCase().includes("speech") ||
          p.toLowerCase().includes("audio")
      ),
      model: this.scrapedData.parameters.all.filter(
        (p) =>
          p.toLowerCase().includes("model") ||
          p.toLowerCase().includes("llm") ||
          p.toLowerCase().includes("temperature")
      ),
      transcription: this.scrapedData.parameters.all.filter(
        (p) =>
          p.toLowerCase().includes("transcrib") ||
          p.toLowerCase().includes("speech") ||
          p.toLowerCase().includes("recognition")
      ),
      tools: this.scrapedData.parameters.all.filter(
        (p) =>
          p.toLowerCase().includes("tool") ||
          p.toLowerCase().includes("function") ||
          p.toLowerCase().includes("webhook")
      ),
      monitoring: this.scrapedData.parameters.all.filter(
        (p) =>
          p.toLowerCase().includes("monitor") ||
          p.toLowerCase().includes("analys") ||
          p.toLowerCase().includes("observ")
      ),
    };

    console.log(`✅ Base de connaissances générée:`);
    console.log(`   📄 ${this.scrapedData.metadata.totalPages} pages`);
    console.log(
      `   🔧 ${this.scrapedData.parameters.all.length} paramètres uniques`
    );
    console.log(
      `   📝 ${this.scrapedData.examples.all.length} exemples de code`
    );
    console.log(`   📋 ${this.scrapedData.schemas.all.length} schémas JSON`);
  }

  async saveData() {
    const outputPath = path.resolve(SCRAPER_CONFIG.outputFile);
    await fs.writeFile(
      outputPath,
      JSON.stringify(this.scrapedData, null, 2),
      "utf8"
    );
    console.log(`💾 Données sauvegardées dans: ${outputPath}`);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      await this.init();
      await this.scrapeAll();
      await this.generateKnowledgeBase();
      await this.saveData();

      console.log("🎉 Scrapping terminé avec succès !");
      console.log(`📊 Statistiques finales:`);
      console.log(
        `   - Pages scrapées: ${this.scrapedData.metadata.totalPages}`
      );
      console.log(
        `   - Paramètres trouvés: ${this.scrapedData.parameters.all.length}`
      );
      console.log(
        `   - Exemples collectés: ${this.scrapedData.examples.all.length}`
      );
    } catch (error) {
      console.error("❌ Erreur lors du scrapping:", error);
    } finally {
      await this.close();
    }
  }
}

// Exécution du script
if (require.main === module) {
  const scraper = new VapiDocScraper();
  scraper.run().catch(console.error);
}

module.exports = VapiDocScraper;
