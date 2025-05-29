# Script d'adaptation Deno vers Node.js pour MCP AlloKoli
# Version: 1.0
# Date: 24 mai 2025

Write-Host "ADAPTATION DENO VERS NODE.JS POUR MCP ALLOKOLI" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

$mcpDir = "allokoli-mcp-server"
$sourceFile = "$mcpDir/index.deno.ts"
$targetFile = "$mcpDir/index.js"

# Vérification des fichiers
Write-Host ""
Write-Host "VERIFICATION DES FICHIERS..." -ForegroundColor Yellow

if (-not (Test-Path $sourceFile)) {
    Write-Host "ERREUR: Fichier source non trouve: $sourceFile" -ForegroundColor Red
    exit 1
}

Write-Host "OK: Fichier source trouve" -ForegroundColor Green

# Lecture du code source Deno
Write-Host ""
Write-Host "LECTURE DU CODE SOURCE DENO..." -ForegroundColor Yellow

$denoContent = Get-Content $sourceFile -Raw -Encoding UTF8
Write-Host "OK: Code source lu ($(($denoContent -split "`n").Count) lignes)" -ForegroundColor Green

# Adaptation du code
Write-Host ""
Write-Host "ADAPTATION DU CODE..." -ForegroundColor Yellow

# Remplacement des imports Deno par Node.js
$nodeContent = $denoContent

# Remplacer les imports Deno
$nodeContent = $nodeContent -replace "import \{ createClient \} from 'https://esm\.sh/@supabase/supabase-js@2\.39\.3';", "import { createClient } from '@supabase/supabase-js';"
$nodeContent = $nodeContent -replace "import \{ corsHeaders \} from '\.\./shared/cors\.ts';", "// CORS headers - a adapter pour Node.js"
$nodeContent = $nodeContent -replace "import \{ createErrorResponse, createSuccessResponse \} from '\.\./shared/response-helpers\.ts';", "// Response helpers - a adapter pour Node.js"
$nodeContent = $nodeContent -replace "import \{ validateSupabaseAuth \} from '\.\./shared/auth\.ts';", "// Auth validation - a adapter pour Node.js"

# Remplacer les imports de schemas
$nodeContent = $nodeContent -replace "import \{[^}]+\} from '\.\./shared/zod-schemas\.ts';", "// Zod schemas - a adapter pour Node.js"

# Remplacer Deno.env par process.env
$nodeContent = $nodeContent -replace "Deno\.env\.get\('([^']+)'\)", "process.env.$1"

# Remplacer btoa par Buffer.from().toString('base64')
$nodeContent = $nodeContent -replace "btoa\(([^)]+)\)", "Buffer.from($1).toString('base64')"

# Ajouter les imports MCP au début
$mcpImports = @"
// AlloKoli MCP Server - Version Node.js adaptee pour Smithery
// Adapte automatiquement du code Deno original

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Configuration MCP
const MCP_CONFIG = {
  name: "allokoli-mcp-server",
  version: "1.0.0",
  description: "Serveur MCP AlloKoli pour la creation et gestion d'assistants vocaux"
};

// Initialisation du serveur MCP
const server = new Server(
  {
    name: MCP_CONFIG.name,
    version: MCP_CONFIG.version,
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

"@

# Extraire les fonctions principales du code Deno
$functionsStart = $nodeContent.IndexOf("/**")
if ($functionsStart -gt 0) {
    $functionsContent = $nodeContent.Substring($functionsStart)
    
    # Nettoyer le code des commentaires TypeScript
    $functionsContent = $functionsContent -replace "// @ts-nocheck[^\n]*\n", ""
    $functionsContent = $functionsContent -replace "import[^;]+;", ""
    
    # Adapter les types TypeScript
    $functionsContent = $functionsContent -replace ": Promise<[^>]+>", ""
    $functionsContent = $functionsContent -replace ": [A-Za-z]+Config", ""
    $functionsContent = $functionsContent -replace ": [A-Za-z]+Request", ""
    $functionsContent = $functionsContent -replace "type [A-Za-z]+", "// type"
    
    # Créer le gestionnaire principal MCP
    $mcpHandlers = @"
// Outils MCP
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: "createAssistantAndProvisionNumber",
        description: "Cree un assistant vocal complet avec numero de telephone provisionne automatiquement",
        inputSchema: {
          type: "object",
          properties: {
            assistantName: { type: "string", description: "Nom de l'assistant vocal" },
            businessType: { type: "string", description: "Type d'activite de l'entreprise" },
            assistantTone: { type: "string", description: "Ton de communication de l'assistant" },
            firstMessage: { type: "string", description: "Message d'accueil de l'assistant" },
            systemPromptCore: { type: "string", description: "Prompt systeme principal" },
            canTakeReservations: { type: "boolean", description: "L'assistant peut-il prendre des reservations" },
            canTakeAppointments: { type: "boolean", description: "L'assistant peut-il prendre des rendez-vous" },
            canTransferCall: { type: "boolean", description: "L'assistant peut-il transferer des appels" },
            companyName: { type: "string", description: "Nom de l'entreprise (optionnel)" },
            address: { type: "string", description: "Adresse de l'entreprise (optionnel)" },
            phoneNumber: { type: "string", description: "Numero de telephone de l'entreprise (optionnel)" },
            email: { type: "string", description: "Email de l'entreprise (optionnel)" },
            openingHours: { type: "string", description: "Horaires d'ouverture (optionnel)" }
          },
          required: ["assistantName", "businessType", "assistantTone", "firstMessage", "systemPromptCore"]
        }
      },
      {
        name: "provisionPhoneNumber",
        description: "Provisionne un nouveau numero de telephone via Twilio",
        inputSchema: {
          type: "object",
          properties: {
            country: { type: "string", description: "Code pays (ex: FR, US)" },
            areaCode: { type: "string", description: "Indicatif regional (optionnel)" },
            contains: { type: "string", description: "Pattern de recherche dans le numero (optionnel)" },
            assistantId: { type: "string", description: "ID de l'assistant a associer (optionnel)" }
          }
        }
      },
      {
        name: "listAssistants",
        description: "Liste tous les assistants avec pagination et filtres",
        inputSchema: {
          type: "object",
          properties: {
            page: { type: "number", description: "Numero de page" },
            limit: { type: "number", description: "Nombre d'elements par page" },
            search: { type: "string", description: "Recherche par nom (optionnel)" },
            sector: { type: "string", description: "Filtrer par secteur d'activite (optionnel)" }
          }
        }
      },
      {
        name: "getAssistant",
        description: "Recupere les details complets d'un assistant",
        inputSchema: {
          type: "object",
          properties: {
            assistantId: { type: "string", description: "ID unique de l'assistant" }
          },
          required: ["assistantId"]
        }
      },
      {
        name: "updateAssistant",
        description: "Met a jour les proprietes d'un assistant existant",
        inputSchema: {
          type: "object",
          properties: {
            assistantId: { type: "string", description: "ID unique de l'assistant" },
            updates: {
              type: "object",
              properties: {
                name: { type: "string", description: "Nouveau nom de l'assistant" },
                systemPrompt: { type: "string", description: "Nouveau prompt systeme" },
                firstMessage: { type: "string", description: "Nouveau message d'accueil" },
                endCallMessage: { type: "string", description: "Nouveau message de fin d'appel" },
                isActive: { type: "boolean", description: "Statut actif/inactif" }
              }
            }
          },
          required: ["assistantId", "updates"]
        }
      }
    ]
  };
});

// Gestionnaire d'outils
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    // Simulation d'authentification (a adapter)
    const userId = 'user-demo';
    
    switch (name) {
      case 'createAssistantAndProvisionNumber':
        return await createAssistantAndProvisionNumber(args, userId);
      case 'provisionPhoneNumber':
        return await provisionPhoneNumber(args, userId);
      case 'listAssistants':
        return await listAssistants(args, userId);
      case 'getAssistant':
        return await getAssistant(args, userId);
      case 'updateAssistant':
        return await updateAssistant(args, userId);
      default:
        throw new Error(`Outil inconnu: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Erreur: ${error.message}`
        }
      ],
      isError: true
    };
  }
});

"@

    # Ajouter le démarrage du serveur MCP
    $mcpStartup = @"

// Demarrage du serveur MCP
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Serveur MCP AlloKoli demarre');
}

main().catch(console.error);
"@

    # Assembler le code final
    $finalContent = $mcpImports + "`n" + $mcpHandlers + "`n" + $functionsContent + $mcpStartup
    
    # Nettoyer le code final
    $finalContent = $finalContent -replace "export default[^;]+;", ""
    $finalContent = $finalContent -replace "Deno\.serve\([^}]+\}\);", ""
    
    # Écrire le fichier final
    $finalContent | Out-File $targetFile -Encoding UTF8
    Write-Host "OK: Code adapte et sauvegarde" -ForegroundColor Green
}

Write-Host ""
Write-Host "VERIFICATION DU RESULTAT..." -ForegroundColor Yellow

if (Test-Path $targetFile) {
    $lines = (Get-Content $targetFile).Count
    Write-Host "OK: Fichier Node.js cree ($lines lignes)" -ForegroundColor Green
} else {
    Write-Host "ERREUR: Fichier Node.js non cree" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "ADAPTATION TERMINEE!" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
Write-Host "Fichier source: $sourceFile" -ForegroundColor White
Write-Host "Fichier cible:  $targetFile" -ForegroundColor White
Write-Host ""
Write-Host "PROCHAINES ETAPES:" -ForegroundColor Blue
Write-Host "1. cd $mcpDir" -ForegroundColor White
Write-Host "2. npm install" -ForegroundColor White
Write-Host "3. node index.js (pour tester)" -ForegroundColor White 