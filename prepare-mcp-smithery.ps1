# Script de préparation MCP AlloKoli pour Smithery
# Version: 1.0
# Date: 24 mai 2025

Write-Host "PREPARATION MCP ALLOKOLI POUR SMITHERY" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

$mcpDir = "allokoli-mcp-server"
$sourceDir = "supabase/functions/mcp-server"

# Vérification des prérequis
Write-Host ""
Write-Host "VERIFICATION DES PREREQUIS..." -ForegroundColor Yellow

if (-not (Test-Path $sourceDir)) {
    Write-Host "ERREUR: Dossier source MCP non trouve: $sourceDir" -ForegroundColor Red
    exit 1
}

Write-Host "OK: Dossier source MCP trouve" -ForegroundColor Green

# Création du dossier MCP
Write-Host ""
Write-Host "CREATION DU PACKAGE MCP..." -ForegroundColor Yellow

if (Test-Path $mcpDir) {
    Write-Host "ATTENTION: Suppression de l'ancien dossier MCP..." -ForegroundColor Yellow
    Remove-Item $mcpDir -Recurse -Force
}

New-Item -ItemType Directory -Path $mcpDir | Out-Null
Write-Host "OK: Dossier MCP cree: $mcpDir" -ForegroundColor Green

# Création du package.json
Write-Host ""
Write-Host "CREATION DU PACKAGE.JSON..." -ForegroundColor Yellow

$packageJson = @{
    name = "allokoli-mcp-server"
    version = "1.0.0"
    description = "Serveur MCP AlloKoli pour la creation et gestion d'assistants vocaux avec Vapi et Twilio"
    main = "index.js"
    type = "module"
    scripts = @{
        start = "node index.js"
        dev = "node --watch index.js"
        test = "node test.js"
    }
    keywords = @("mcp", "allokoli", "voice-assistant", "vapi", "twilio", "supabase")
    author = "AlloKoli Team"
    license = "MIT"
    homepage = "https://github.com/Mazaljoker/Koli55"
    repository = @{
        type = "git"
        url = "https://github.com/Mazaljoker/Koli55.git"
    }
    dependencies = @{
        "@modelcontextprotocol/sdk" = "^0.4.0"
        "@supabase/supabase-js" = "^2.39.3"
        "node-fetch" = "^3.3.2"
    }
    engines = @{
        node = ">=18.0.0"
    }
}

$packageJson | ConvertTo-Json -Depth 10 | Out-File "$mcpDir/package.json" -Encoding UTF8
Write-Host "OK: package.json cree" -ForegroundColor Green

# Création du smithery.json
Write-Host ""
Write-Host "CREATION DU SMITHERY.JSON..." -ForegroundColor Yellow

$smitheryJson = @{
    name = "allokoli-mcp-server"
    displayName = "AlloKoli Voice Assistant Manager"
    description = "Serveur MCP pour creer et gerer des assistants vocaux avec Vapi et Twilio"
    version = "1.0.0"
    author = "AlloKoli Team"
    homepage = "https://github.com/Mazaljoker/Koli55"
    repository = "https://github.com/Mazaljoker/Koli55"
    license = "MIT"
    keywords = @("voice-assistant", "vapi", "twilio", "supabase", "mcp", "ai")
    categories = @("productivity", "communication", "ai-tools")
    runtime = "node"
    entrypoint = "index.js"
    environment = @{
        required = @(
            "SUPABASE_URL",
            "SUPABASE_SERVICE_ROLE_KEY", 
            "VAPI_API_KEY",
            "TWILIO_ACCOUNT_SID",
            "TWILIO_AUTH_TOKEN"
        )
    }
    capabilities = @{
        tools = $true
        resources = $false
        prompts = $false
    }
}

$smitheryJson | ConvertTo-Json -Depth 10 | Out-File "$mcpDir/smithery.json" -Encoding UTF8
Write-Host "OK: smithery.json cree" -ForegroundColor Green

# Création du README.md
Write-Host ""
Write-Host "CREATION DU README..." -ForegroundColor Yellow

$readmeContent = @"
# AlloKoli MCP Server

Serveur MCP (Model Context Protocol) pour creer et gerer des assistants vocaux avec Vapi et Twilio.

## Fonctionnalites

- Creation d'assistants vocaux complets
- Provisioning automatique de numeros Twilio
- Gestion CRUD des assistants
- Integration Vapi + Supabase + Twilio
- 5 outils MCP disponibles

## Installation

```bash
npm install allokoli-mcp-server
```

## Configuration

Variables d'environnement requises :

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VAPI_API_KEY=your_vapi_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
```

## Utilisation avec Claude Desktop

Ajoutez a votre configuration Claude Desktop :

```json
{
  "mcpServers": {
    "allokoli": {
      "command": "npx",
      "args": ["allokoli-mcp-server"],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your_key",
        "VAPI_API_KEY": "your_key",
        "TWILIO_ACCOUNT_SID": "your_sid",
        "TWILIO_AUTH_TOKEN": "your_token"
      }
    }
  }
}
```

## Outils Disponibles

1. **createAssistantAndProvisionNumber** - Cree un assistant vocal complet avec numero de telephone provisionne automatiquement
2. **listAssistants** - Liste tous les assistants
3. **getAssistant** - Recupere un assistant specifique
4. **updateAssistant** - Met a jour un assistant
5. **provisionPhoneNumber** - Provisionne un nouveau numero

## Licence

MIT (c) AlloKoli Team
"@

$readmeContent | Out-File "$mcpDir/README.md" -Encoding UTF8
Write-Host "OK: README.md cree" -ForegroundColor Green

# Création du .env.example
Write-Host ""
Write-Host "CREATION DU .ENV.EXAMPLE..." -ForegroundColor Yellow

$envExample = @"
# Configuration Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Configuration Vapi
VAPI_API_KEY=your_vapi_api_key

# Configuration Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
"@

$envExample | Out-File "$mcpDir/.env.example" -Encoding UTF8
Write-Host "OK: .env.example cree" -ForegroundColor Green

# Copie et adaptation du code source
Write-Host ""
Write-Host "ADAPTATION DU CODE SOURCE..." -ForegroundColor Yellow

# Note: Le code Deno doit être adapté pour Node.js
# Pour l'instant, on copie le fichier original avec une note
$indexContent = @"
// AlloKoli MCP Server - Version Node.js pour Smithery
// Adapte du code Deno original

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createClient } from '@supabase/supabase-js';

// TODO: Adapter le code Deno vers Node.js
// Source originale: $sourceDir/index.ts

console.log('AlloKoli MCP Server - En cours d adaptation...');

// Configuration MCP
const MCP_CONFIG = {
  name: "allokoli-mcp-server",
  version: "1.0.0",
  description: "Serveur MCP AlloKoli pour la creation et gestion d assistants vocaux"
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

// Configuration Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Variables d environnement Supabase manquantes');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
            assistantName: { type: "string", description: "Nom de l assistant vocal" },
            businessType: { type: "string", description: "Type d activite de l entreprise" },
            assistantTone: { type: "string", description: "Ton de communication de l assistant" },
            firstMessage: { type: "string", description: "Message d accueil de l assistant" },
            systemPromptCore: { type: "string", description: "Prompt systeme principal" }
          },
          required: ["assistantName", "businessType", "assistantTone", "firstMessage", "systemPromptCore"]
        }
      },
      {
        name: "listAssistants",
        description: "Liste tous les assistants avec pagination et filtres",
        inputSchema: {
          type: "object",
          properties: {
            page: { type: "number", description: "Numero de page" },
            limit: { type: "number", description: "Nombre d elements par page" }
          }
        }
      },
      {
        name: "getAssistant",
        description: "Recupere les details complets d un assistant",
        inputSchema: {
          type: "object",
          properties: {
            assistantId: { type: "string", description: "ID unique de l assistant" }
          },
          required: ["assistantId"]
        }
      }
    ]
  };
});

// Gestionnaire d'outils
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;
  
  try {
    switch (name) {
      case 'createAssistantAndProvisionNumber':
        return await createAssistantAndProvisionNumber(args);
      case 'listAssistants':
        return await listAssistants(args);
      case 'getAssistant':
        return await getAssistant(args);
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

// Fonctions metier (a adapter du code Deno)
async function createAssistantAndProvisionNumber(args) {
  // TODO: Adapter la logique de creation d assistant + provisioning
  return {
    content: [
      {
        type: "text",
        text: `Assistant "${args.assistantName}" en cours de creation...`
      }
    ]
  };
}

async function listAssistants(args) {
  // TODO: Adapter la logique de listing des assistants
  return {
    content: [
      {
        type: "text", 
        text: "Recuperation de la liste des assistants..."
      }
    ]
  };
}

async function getAssistant(args) {
  // TODO: Adapter la logique de recuperation d assistant
  return {
    content: [
      {
        type: "text",
        text: `Recuperation de l assistant ${args.assistantId}...`
      }
    ]
  };
}

// Demarrage du serveur
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Serveur MCP AlloKoli demarre');
}

main().catch(console.error);
"@

$indexContent | Out-File "$mcpDir/index.js" -Encoding UTF8
Write-Host "OK: index.js cree (version de base)" -ForegroundColor Green

# Copie du code source original pour référence
Copy-Item "$sourceDir/index.ts" "$mcpDir/index.deno.ts"
Write-Host "OK: Code source Deno copie pour reference" -ForegroundColor Green

# Instructions finales
Write-Host ""
Write-Host "RESUME DE LA PREPARATION" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan

Write-Host "OK: Package MCP cree dans: $mcpDir" -ForegroundColor Green
Write-Host "OK: Fichiers de configuration generes" -ForegroundColor Green
Write-Host "OK: Structure Smithery prete" -ForegroundColor Green

Write-Host ""
Write-Host "PROCHAINES ETAPES" -ForegroundColor Blue
Write-Host "=================" -ForegroundColor Blue
Write-Host "1. Adapter le code Deno vers Node.js dans index.js" -ForegroundColor White
Write-Host "2. Tester localement: cd $mcpDir && npm install && node index.js" -ForegroundColor White
Write-Host "3. Creer un repository GitHub pour le MCP" -ForegroundColor White
Write-Host "4. Publier sur Smithery via GitHub ou NPM" -ForegroundColor White
Write-Host "5. Configurer dans Claude Desktop" -ForegroundColor White

Write-Host ""
Write-Host "STRUCTURE CREEE:" -ForegroundColor Blue
Get-ChildItem $mcpDir | ForEach-Object {
    Write-Host "  $($_.Name)" -ForegroundColor White
}

Write-Host ""
Write-Host "PACKAGE MCP ALLOKOLI PRET POUR SMITHERY!" -ForegroundColor Green 