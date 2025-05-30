# Allokoli

Allokoli est une plateforme no-code permettant à des professionnels de créer un assistant vocal IA en quelques minutes.

## 🎯 **CONFIGURATEUR OPÉRATIONNEL** ✅

Le configurateur AlloKoli Expert est maintenant **100% déployé et fonctionnel** !

### 🚀 **Accès direct**

- **Test du configurateur** : [https://dashboard.vapi.ai/assistant/99cce75a-5b25-4925-bdcd-9287d350728e/test](https://dashboard.vapi.ai/assistant/99cce75a-5b25-4925-bdcd-9287d350728e/test)
- **Configuration** : [https://dashboard.vapi.ai/assistant/99cce75a-5b25-4925-bdcd-9287d350728e](https://dashboard.vapi.ai/assistant/99cce75a-5b25-4925-bdcd-9287d350728e)
- **Gestion des tools** : [https://dashboard.vapi.ai/tools](https://dashboard.vapi.ai/tools)

### 🔧 **Tools déployés**

- `analyzeBusinessContext` : Analyse automatique du secteur d'activité
- `listVoicesForBusiness` : Recommandations de voix par secteur
- `createAssistant` : Création automatique d'assistants vocaux

### 🌐 **Edge Functions actives**

- **URL** : `https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools`
- **Version** : 6 (ACTIVE)
- **Secteurs supportés** : Restaurant, Salon, Artisan, Commerce, Médical, Service

## Stack

- Frontend : Next.js 15.3.2 + Turbopack + Supabase
- Backend : Supabase Edge Functions (Deno) ✅ **DÉPLOYÉES**
- API vocale : Vapi.ai ✅ **CONFIGURÉE**
- Auth : Supabase Auth
- Base de données : Supabase PostgreSQL avec RLS
- Intégration : Model Context Protocol (MCP) pour Vapi et Supabase ✅ **OPÉRATIONNEL**

## ⚡ Performances optimisées avec Turbopack

- **Démarrage ultra-rapide** : 1.3s (vs 15s+ avant)
- **Hot Reload instantané** : Modifications appliquées quasi-instantanément
- **Compilation incrémentale** : Bundler Rust optimisé pour TypeScript

## État du projet

- ✅ **Phase 1** : Initialisation du projet (structure, dépendances)
- ✅ **Phase 2** : Documentation et contexte
- ✅ **Phase 3** : Authentification Supabase
- ✅ **Phase 4** : Intégration des SDKs Vapi (client et serveur)
- ✅ **Phase 5** : Développement des Supabase Edge Functions
- ✅ **Phase 6.0** : Création des tables de base de données
- ✅ **Phase 6.1** : Intégration frontend
- ✅ **Phase 6.2** : Migration structurelle complète
- ✅ **Phase 7** : Optimisation Turbopack et MCP
- ✅ **Phase 8** : **CONFIGURATEUR DÉPLOYÉ ET OPÉRATIONNEL** ✅
- 📅 **Phase 9** : Tests et optimisations (à venir)
- 📅 **Phase 10** : Déploiement frontend et lancement (à venir)

## 🚀 Intégration Model Context Protocol (MCP)

Le projet intègre MCP pour une orchestration avancée des services :

### Configuration MCP disponible

- **Vapi MCP Server** : Création et gestion d'assistants vocaux via des prompts naturels ✅ **OPÉRATIONNEL**
- **Supabase MCP** : Gestion de la base de données et des fonctions Edge ✅ **UTILISÉ**
- **GitHub MCP** : Automatisation des workflows de développement

### Utilisation avec Claude Desktop

Configuration dans `~/.cursor/mcp.json` :

```json
{
  "mcpServers": {
    "vapi-mcp": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.vapi.ai/mcp",
        "--header",
        "Authorization: Bearer ${VAPI_TOKEN}"
      ],
      "env": {
        "VAPI_TOKEN": "votre-clé-vapi"
      }
    },
    "supabase": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-supabase"],
      "env": {
        "SUPABASE_URL": "https://aiurboizarbbcpynmmgv.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "votre-service-role-key"
      }
    }
  }
}
```

## 🎯 **Fonctionnalités du Configurateur**

### **Analyse automatique**

Le configurateur analyse automatiquement l'activité du client et détermine le secteur optimal parmi :

- **Restaurant & Hôtellerie**
- **Salon de beauté & Bien-être**
- **Artisan & Réparation**
- **Commerce & Retail**
- **Médical & Santé**
- **Service client**

### **Recommandations intelligentes**

Pour chaque secteur, le configurateur recommande les 3 meilleures voix Azure :

- **Restaurant** : Denise (sophistiquée), Claude (conviviale), Vivienne (élégante)
- **Salon** : Brigitte (douce), Céline (rassurante), Denise (professionnelle)
- **Artisan** : Henri (confiant), Antoine (technique), Claude (professionnel)
- **Commerce** : Brigitte (accueillante), Denise (dynamique), Claude (claire)
- **Médical** : Claude (calme), Henri (professionnel), Denise (rassurante)
- **Service** : Denise (patiente), Claude (claire), Brigitte (empathique)

### **Création automatique**

Le configurateur crée automatiquement l'assistant vocal final avec :

- Configuration optimisée pour le secteur
- Voix recommandée sélectionnée
- Prompt personnalisé pour l'activité
- Paramètres techniques adaptés

## Structure du projet

Ce projet suit une structure standardisée définie dans [DOCS/architecture/structure-standard.md](DOCS/architecture/structure-standard.md).

La structure du projet est organisée de la façon suivante :

- `/frontend` : Application Next.js principale (App Router)
- `/supabase` : Fonctions Edge et migrations Supabase ✅ **DÉPLOYÉES**
- `/lib` : Bibliothèques partagées
- `/DOCS` : Documentation complète du projet

## Configuration des variables d'environnement

Pour démarrer le projet, vous devez configurer les variables d'environnement nécessaires :

1. Créez un fichier `.env.local` à la racine du projet en vous basant sur `.env.example`
2. Configurez les variables Supabase et Vapi avec les valeurs appropriées :

```bash
# Frontend (publiques mais limitées)
NEXT_PUBLIC_SUPABASE_URL=https://aiurboizarbbcpynmmgv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-publique

# Backend (privées)
SUPABASE_URL=https://aiurboizarbbcpynmmgv.supabase.co
SUPABASE_ANON_KEY=votre-cle-anon-publique
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role-secrete
VAPI_PRIVATE_KEY=37e5584f-31ce-4f77-baf2-5684682079ea
VAPI_API_KEY=votre-cle-api-vapi

# MCP (pour intégration Claude Desktop)
VAPI_TOKEN=votre-cle-api-vapi
```

⚠️ **IMPORTANT** : Ne jamais commiter les fichiers `.env.local` ou `.env` contenant des clés réelles.

## Démarrage rapide

### Prérequis

- Node.js 18+
- pnpm (gestionnaire de packages recommandé)

### Installation et démarrage

```bash
# Installation des dépendances (racine)
pnpm install

# Installation des dépendances frontend
cd frontend && pnpm install

# Lancement du serveur de développement avec Turbopack
pnpm dev
```

### **Test du configurateur**

Le configurateur est immédiatement testable :

```bash
# Test direct via Vapi Dashboard
# URL: https://dashboard.vapi.ai/assistant/99cce75a-5b25-4925-bdcd-9287d350728e/test

# Test des Edge Functions
.\test-edge-functions.ps1

# Création de nouveaux assistants
.\create-tools-separately.ps1
```

### Accès à l'application

- **Local :** http://localhost:3001
- **Réseau :** http://192.168.137.1:3001
- **Configurateur :** https://dashboard.vapi.ai/assistant/99cce75a-5b25-4925-bdcd-9287d350728e/test

### Commandes disponibles

```bash
# Développement avec Turbopack (recommandé)
pnpm dev

# Développement depuis le frontend uniquement
cd frontend && pnpm dev

# Build de production
pnpm build

# Linting
pnpm lint

# Scripts de déploiement et test
.\create-tools-separately.ps1        # Créer assistant avec tools
.\test-edge-functions.ps1           # Tester les Edge Functions
.\ALLOKOLI-CONFIGURATEUR-FINAL-SANS-TOOLS.ps1  # Configurateur intelligent
```

## Documentation

Une documentation complète est disponible dans le dossier `/DOCS` :

### Guides pratiques

- [**Guide de développement**](/DOCS/development_guide.md) - Instructions pour les développeurs
- [**Guide de déploiement**](/DOCS/deployment.md) - Processus de déploiement local et production
- [**Roadmap du projet**](/DOCS/guides/todo.md) - Phases de développement et état d'avancement
- [**Guide Cursor**](/DOCS/guides/cursor_guide.md) - Utilisation de Cursor pour le développement

### Documentation technique

- [**Architecture du projet**](/DOCS/architecture/project_architecture.md) - Documentation de l'architecture globale
- [**Flux API**](/DOCS/architecture/api_flow.md) - Documentation des flux API
- [**Edge Functions**](/DOCS/architecture/edge_functions.md) - Documentation des Supabase Edge Functions
- [**Guide des Edge Functions**](/DOCS/architecture/edge_functions_guide.md) - Bonnes pratiques et conventions
- [**Intégration API Vapi**](/DOCS/api_integration.md) - Pattern standardisé d'intégration
- [**Assistants**](/DOCS/assistants.md) - Documentation spécifique sur les assistants vocaux

### Contexte du projet

- [**Contexte du projet**](/DOCS/context/project_context.md) - Objectifs, principes et technologies

### Diagrammes et visuels

- [**Architecture globale**](/DOCS/assets/architecture.md) - Diagramme d'architecture du projet
- [**Architecture des services API**](/DOCS/assets/api_service_architecture.md) - Diagramme des services API

## Fonctionnalités principales

- Création d'assistants vocaux IA via une interface no-code
- Gestion de conversations téléphoniques automatisées
- Intégration de bases de connaissances personnalisées
- Configuration de workflows conversationnels avancés
- Analyse des conversations et métriques d'utilisation
- Orchestration via Model Context Protocol (MCP)

## Architecture

L'architecture du projet suit une approche en couches avec intégration MCP :

```
┌────────────────┐
│  UI (Next.js)  │ ← Turbopack optimisé
├────────────────┤
│ Frontend APIs  │ ← lib/api/*.ts
├────────────────┤
│ Edge Functions │ ← supabase/functions/
├────────────────┤
│   MCP Layer    │ ← Model Context Protocol
├────────────────┤
│    Vapi API    │ ← Assistant vocal
└────────────────┘
```

Cette architecture garantit la sécurité des clés API, permet une séparation claire des responsabilités, et offre une orchestration avancée via MCP.

## Développeurs

Pour contribuer au projet, consultez le [Guide de développement](/DOCS/development_guide.md).

## Dernières améliorations

- ✅ **Turbopack activé** : Performances de développement x10 plus rapides
- ✅ **MCP configuré** : Intégration Vapi, Supabase, et GitHub
- ✅ **Hot Reload optimisé** : Modifications instantanées
- ✅ **Structure stabilisée** : Prêt pour le développement intensif
