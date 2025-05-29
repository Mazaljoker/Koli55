# 🚀 Guide de Déploiement MCP AlloKoli sur Smithery

## 📋 Vue d'ensemble

Guide pour déployer ton serveur MCP (Model Context Protocol) AlloKoli sur **Smithery** et l'utiliser dans **Claude Desktop**.

## 🛠️ Outils MCP Disponibles

1. **createAssistantAndProvisionNumber** - Création complète d'assistant + numéro
2. **provisionPhoneNumber** - Provisioning de numéros Twilio
3. **listAssistants** - Liste des assistants avec pagination
4. **getAssistant** - Détails d'un assistant spécifique
5. **updateAssistant** - Mise à jour d'assistant

## 🚀 Processus de Déploiement

### Étape 1: Préparation
```powershell
powershell -ExecutionPolicy Bypass -File prepare-mcp-smithery.ps1
```

### Étape 2: Adaptation du Code
```powershell
powershell -ExecutionPolicy Bypass -File adapt-deno-to-nodejs.ps1
```

### Étape 3: Validation
```powershell
powershell -ExecutionPolicy Bypass -File deploy-mcp-smithery.ps1
```

### Étape 4: Repository GitHub
```powershell
powershell -ExecutionPolicy Bypass -File create-github-repo-mcp.ps1
```

## 🔧 Configuration Smithery

1. Aller sur [smithery.ai](https://smithery.ai)
2. Se connecter avec GitHub
3. Ajouter le repository `allokoli-mcp-server`
4. Configurer les variables d'environnement :

```env
SUPABASE_URL=https://aiurboizarbbcpynmmgv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VAPI_API_KEY=your_vapi_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

5. Publier le package

## 🖥️ Configuration Claude Desktop

Ajouter à `~/.claude_desktop_config.json` :

```json
{
  "mcpServers": {
    "allokoli": {
      "command": "npx",
      "args": ["allokoli-mcp-server"],
      "env": {
        "SUPABASE_URL": "https://aiurboizarbbcpynmmgv.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "your_key",
        "VAPI_API_KEY": "your_key",
        "TWILIO_ACCOUNT_SID": "your_sid",
        "TWILIO_AUTH_TOKEN": "your_token"
      }
    }
  }
}
```

## ✅ Test

Dans Claude Desktop :
```
Peux-tu créer un assistant vocal pour un restaurant italien nommé "Bella Vista" ?
```

## 🎯 Résultat

Une fois déployé, tu pourras créer et gérer des assistants vocaux directement depuis Claude Desktop avec provisioning automatique des numéros de téléphone.

---

**🎉 MCP AlloKoli prêt pour Smithery et Claude Desktop !** 