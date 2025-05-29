# 🔧 Intégration AlloKoli MCP dans Cursor - GUIDE COMPLET

## 🎯 ARCHITECTURE HYBRIDE : Edge Function + MCP Server

Votre projet utilise une **architecture hybride** avec :

- **Edge Function Supabase** (Deno/TypeScript) pour les opérations backend
- **Serveur MCP Node.js** pour l'intégration Cursor/Claude Desktop

## 📋 ÉTAPES PRÉALABLES OBLIGATOIRES

### 🚀 Étape 1: Déploiement de l'Edge Function

Avant d'utiliser le MCP, l'edge function doit être déployée :

```bash
# 1. Se positionner dans le projet
cd C:\allokoli\pipecat\Koli55

# 2. Déployer l'edge function AlloKoli
supabase functions deploy allokoli-mcp --project-ref aiurboizarbbcpynmmgv

# 3. Configurer les variables d'environnement Supabase
supabase secrets set VAPI_API_KEY=your_vapi_api_key --project-ref aiurboizarbbcpynmmgv
supabase secrets set TWILIO_ACCOUNT_SID=your_twilio_sid --project-ref aiurboizarbbcpynmmgv
supabase secrets set TWILIO_AUTH_TOKEN=your_twilio_token --project-ref aiurboizarbbcpynmmgv
```

### 🔧 Étape 2: Test de l'Edge Function

Vérifiez que l'edge function fonctionne :

```bash
# Test de l'endpoint
curl -X POST https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/allokoli-mcp \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"action": "listAssistants", "userId": "test"}'
```

### 🎯 Étape 3: Configuration du Serveur MCP

Le serveur MCP doit pointer vers l'edge function déployée :

```bash
# 1. Installer le serveur MCP
cd allokoli-mcp-server
npm install

# 2. Créer le fichier .env local
cp .env.example .env

# 3. Configurer les variables
```

**Fichier `.env` requis :**

```env
# Edge Function Supabase (OBLIGATOIRE)
SUPABASE_URL=https://aiurboizarbbcpynmmgv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# API Keys (pour accès direct si nécessaire)
VAPI_API_KEY=your_vapi_api_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# Mode de fonctionnement
MCP_MODE=hybrid  # hybrid, edge-only, direct
EDGE_FUNCTION_URL=https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/allokoli-mcp
```

## 🔧 CONFIGURATION CURSOR OPTIMISÉE

### 📍 Localisation du Fichier MCP

Votre fichier de configuration Cursor :

```
C:\Users\USER\.cursor\mcp.json
```

### 🎯 Configuration Complète pour Architecture Hybride

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--access-token",
        "sbp_7fd49ef538d9d190a9c548001692347a5f624ce3"
      ]
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\USER\\.cursor"
      ]
    },
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"]
    },
    "puppeteer": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-puppeteer"]
    },
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    },
    "@reapi/mcp-openapi": {
      "command": "npx",
      "args": ["-y", "@reapi/mcp-openapi@latest", "--dir", "./specs"],
      "env": {}
    },
    "allokoli": {
      "command": "node",
      "args": ["C:\\allokoli\\pipecat\\Koli55\\allokoli-mcp-server\\index.js"],
      "env": {
        "SUPABASE_URL": "https://aiurboizarbbcpynmmgv.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMzc1NzU5NCwiZXhwIjoyMDQ5MzMzNTk0fQ.your_actual_key",
        "SUPABASE_ANON_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NTc1OTQsImV4cCI6MjA0OTMzMzU5NH0.your_actual_anon_key",
        "VAPI_API_KEY": "your_vapi_api_key",
        "TWILIO_ACCOUNT_SID": "your_twilio_sid",
        "TWILIO_AUTH_TOKEN": "your_twilio_token",
        "MCP_MODE": "hybrid",
        "EDGE_FUNCTION_URL": "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/allokoli-mcp"
      },
      "disabled": false,
      "description": "🏆 Serveur MCP AlloKoli PERFECTION - Architecture hybride Edge Function + MCP"
    }
  }
}
```

## 🔑 VARIABLES D'ENVIRONNEMENT CRITIQUES

### 🎯 Clés Supabase (OBLIGATOIRES)

```bash
# Service Role Key (accès complet)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Anon Key (accès public)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Où les trouver :**

1. Aller sur [supabase.com](https://supabase.com)
2. Projet `aiurboizarbbcpynmmgv`
3. Settings > API
4. Copier `service_role` et `anon` keys

### 🎯 Clés API Externes

```bash
# Vapi (pour assistants vocaux)
VAPI_API_KEY=vapi_key_...

# Twilio (pour numéros de téléphone)
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
```

## 🚀 PROCÉDURE DE DÉMARRAGE COMPLÈTE

### 1️⃣ Vérification des Prérequis

```bash
# Vérifier Node.js
node --version  # >= 18.0.0

# Vérifier Supabase CLI
supabase --version

# Vérifier les edge functions
supabase functions list --project-ref aiurboizarbbcpynmmgv
```

### 2️⃣ Déploiement Edge Function

```bash
cd C:\allokoli\pipecat\Koli55

# Déployer la fonction
supabase functions deploy allokoli-mcp --project-ref aiurboizarbbcpynmmgv

# Configurer les secrets
supabase secrets set VAPI_API_KEY=your_key --project-ref aiurboizarbbcpynmmgv
supabase secrets set TWILIO_ACCOUNT_SID=your_sid --project-ref aiurboizarbbcpynmmgv
supabase secrets set TWILIO_AUTH_TOKEN=your_token --project-ref aiurboizarbbcpynmmgv
```

### 3️⃣ Configuration MCP Server

```bash
cd allokoli-mcp-server

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Éditer .env avec vos vraies clés

# Tester le serveur
node index.js --test
```

### 4️⃣ Configuration Cursor

```bash
# Éditer le fichier MCP
notepad C:\Users\USER\.cursor\mcp.json

# Ajouter la configuration AlloKoli (voir section précédente)
```

### 5️⃣ Redémarrage et Test

```bash
# Redémarrer Cursor complètement
# Puis tester dans Cursor :
```

## 🧪 TESTS DE VALIDATION

### Test 1: Connexion Edge Function

```
Peux-tu vérifier la connexion à l'edge function AlloKoli ?
```

### Test 2: Création d'Assistant

```
Crée un assistant vocal pour une pizzeria italienne nommée "Bella Napoli"
```

### Test 3: Listing des Assistants

```
Liste tous mes assistants vocaux avec leurs détails
```

### Test 4: Provisioning de Numéro

```
Provisionne un numéro de téléphone français pour mon assistant
```

### Test 5: Fonctionnalités Avancées

```
Crée un workflow de prise de rendez-vous avec 3 étapes
```

## 🔍 DÉPANNAGE SPÉCIALISÉ

### ❌ Problème : Edge Function Non Accessible

**Symptômes :** Erreurs 404 ou timeout
**Solution :**

```bash
# Vérifier le déploiement
supabase functions list --project-ref aiurboizarbbcpynmmgv

# Redéployer si nécessaire
supabase functions deploy allokoli-mcp --project-ref aiurboizarbbcpynmmgv
```

### ❌ Problème : Variables d'Environnement

**Symptômes :** Erreurs d'authentification
**Solution :**

```bash
# Vérifier les secrets Supabase
supabase secrets list --project-ref aiurboizarbbcpynmmgv

# Reconfigurer si nécessaire
supabase secrets set VAPI_API_KEY=new_key --project-ref aiurboizarbbcpynmmgv
```

### ❌ Problème : MCP Non Détecté

**Symptômes :** Serveur MCP non visible dans Cursor
**Solution :**

1. Vérifier le chemin absolu dans `mcp.json`
2. Tester le serveur manuellement : `node index.js`
3. Vérifier les permissions de fichier
4. Redémarrer Cursor complètement

### ❌ Problème : Erreurs de Syntaxe JSON

**Symptômes :** MCP ne se charge pas
**Solution :**

```bash
# Valider la syntaxe JSON
python -m json.tool C:\Users\USER\.cursor\mcp.json
```

## 🎯 ARCHITECTURE OPTIMALE

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Cursor IDE    │───▶│   MCP Server     │───▶│  Edge Function  │
│                 │    │   (Node.js)      │    │   (Supabase)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │   Direct APIs    │    │   Database      │
                       │  (Vapi/Twilio)   │    │   (Supabase)    │
                       └──────────────────┘    └─────────────────┘
```

## ✅ CHECKLIST FINALE

- [ ] Edge function déployée sur Supabase
- [ ] Variables d'environnement configurées
- [ ] Serveur MCP installé et testé
- [ ] Fichier `mcp.json` configuré avec chemins absolus
- [ ] Cursor redémarré complètement
- [ ] Tests de base réussis
- [ ] Accès aux 63 endpoints Vapi confirmé

## 🎊 RÉSULTAT ATTENDU

Après cette configuration, vous aurez :

✅ **Accès complet** aux 63 endpoints Vapi  
✅ **Architecture hybride** optimisée  
✅ **Performance maximale** avec edge functions  
✅ **Intégration transparente** dans Cursor  
✅ **Gestion robuste** des erreurs

---

**🏆 PERFECTION TECHNIQUE ET OPÉRATIONNELLE GARANTIE !**
