# 🎤 Guide Agent Vapi Configurateur - AlloKoli

## 📋 Vue d'ensemble

L'Agent Vapi Configurateur est le cœur de l'expérience "5-Minute Voice Wizard" d'AlloKoli. Il s'agit d'un assistant conversationnel intelligent qui guide les utilisateurs dans la création de leur assistant vocal personnalisé en moins de 5 minutes.

### 🎯 Objectifs
- **Onboarding rapide** : Configuration complète en moins de 5 minutes
- **Conversation naturelle** : Interface vocale intuitive et pédagogue
- **Adaptation intelligente** : Prompts spécialisés selon le secteur d'activité
- **Déploiement automatique** : Création et provisionnement automatiques

### 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Utilisateur   │◄──►│ Agent Vapi       │◄──►│ Serveur MCP     │
│   (Vocal/Web)   │    │ Configurateur    │    │ (Edge Function) │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │                        │
                                ▼                        ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │ Webhook Handler  │    │ Base Supabase   │
                       │ (Edge Function)  │    │ + API Vapi      │
                       └──────────────────┘    └─────────────────┘
```

## 🚀 Déploiement

### Prérequis
- Supabase CLI installé et configuré
- Accès au projet Supabase Cloud
- Clés API Vapi et Twilio configurées

### Déploiement automatique
```powershell
# Déploiement avec type d'activité spécifique
.\deploy-vapi-configurator.ps1 -BusinessType "restaurant"

# Déploiement en mode force (ignore les erreurs non critiques)
.\deploy-vapi-configurator.ps1 -BusinessType "general" -Force

# Déploiement avec logs détaillés
.\deploy-vapi-configurator.ps1 -BusinessType "salon" -Verbose
```

### Déploiement manuel
```bash
# 1. Déployer les Edge Functions
supabase functions deploy vapi-configurator --no-verify-jwt
supabase functions deploy vapi-configurator-webhook --no-verify-jwt

# 2. Configurer les variables d'environnement
supabase secrets set VAPI_API_KEY=your_vapi_key
supabase secrets set TWILIO_ACCOUNT_SID=your_twilio_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_twilio_token
```

## 🎯 Types d'Activité Supportés

### 1. **Restaurant** (`restaurant`)
- **Spécialités** : Réservations, menu, horaires, commandes
- **Ton** : Chaleureux et gourmand
- **Fonctionnalités** : Prise de réservations, infos menu, livraison

### 2. **Salon de Coiffure/Beauté** (`salon`)
- **Spécialités** : Rendez-vous, services, tarifs, produits
- **Ton** : Élégant et rassurant
- **Fonctionnalités** : Planning RDV, services disponibles, politique annulation

### 3. **Artisan du Bâtiment** (`artisan`)
- **Spécialités** : Urgences, devis, zones d'intervention
- **Ton** : Direct, efficace, rassurant
- **Fonctionnalités** : Qualification urgence/devis, prise de coordonnées

### 4. **Profession Libérale** (`liberal`)
- **Spécialités** : Consultations, expertise, qualification
- **Ton** : Professionnel, discret, organisé
- **Fonctionnalités** : Filtrage appels, RDV consultation, domaines expertise

### 5. **Boutique/Commerce** (`boutique`)
- **Spécialités** : Produits, horaires, promotions, click & collect
- **Ton** : Accueillant, serviable, enthousiaste
- **Fonctionnalités** : Infos produits, disponibilité, services

### 6. **PME Généraliste** (`pme`)
- **Spécialités** : Service client polyvalent
- **Ton** : Professionnel, clair, adaptable
- **Fonctionnalités** : FAQ, prise de messages, redirection

### 7. **Généraliste** (`general`)
- **Spécialités** : Base universelle
- **Ton** : Accueillant et pédagogue
- **Fonctionnalités** : Configuration guidée adaptative

## 🔧 API Reference

### Endpoint Principal
```
POST https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/vapi-configurator
```

### Actions Disponibles

#### 1. Créer un Agent Configurateur
```json
{
  "action": "create",
  "businessType": "restaurant"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "assistantId": "uuid",
    "vapiId": "vapi_assistant_id",
    "message": "Assistant configurateur créé avec succès",
    "prompt": "Prompt spécialisé utilisé"
  }
}
```

#### 2. Récupérer un Prompt Spécifique
```json
{
  "action": "get-prompt",
  "businessType": "salon"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "prompt": "Prompt complet pour salon...",
    "businessType": "salon"
  }
}
```

#### 3. Lister Tous les Prompts
```json
{
  "action": "list-prompts"
}
```

**Réponse :**
```json
{
  "success": true,
  "data": {
    "prompts": ["general", "restaurant", "salon", "artisan", "liberal", "boutique", "pme"],
    "descriptions": {
      "general": "Prompt généraliste pour tous types d'entreprises",
      "restaurant": "Spécialisé pour restaurants, pizzerias, cafés",
      // ...
    }
  }
}
```

### Webhook Handler
```
POST https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/vapi-configurator-webhook
```

Traite les webhooks Vapi pour :
- `function-call` : Appels de fonction (création d'assistant)
- `call-start` : Début de session de configuration
- `call-end` : Fin de session
- `transcript` : Transcriptions en temps réel
- `hang` : Appel raccroché

## 🧪 Tests

### Tests Automatiques
```powershell
# Tests de base
.\test-vapi-configurator.ps1

# Tests avec type spécifique
.\test-vapi-configurator.ps1 -BusinessType "restaurant"

# Tests interactifs (création réelle d'agent)
.\test-vapi-configurator.ps1 -Interactive

# Tests avec logs détaillés
.\test-vapi-configurator.ps1 -Verbose
```

### Tests Manuels

#### Test 1 : Récupération des Prompts
```bash
curl -X POST https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/vapi-configurator \
  -H "Content-Type: application/json" \
  -d '{"action": "list-prompts"}'
```

#### Test 2 : Prompt Spécifique
```bash
curl -X POST https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/vapi-configurator \
  -H "Content-Type: application/json" \
  -d '{"action": "get-prompt", "businessType": "restaurant"}'
```

## 🎭 Processus de Configuration

### Étapes de l'Onboarding

1. **Introduction et Nom**
   - Accueil utilisateur
   - Demande du nom de l'assistant

2. **Type d'Activité**
   - Identification du secteur
   - Adaptation du prompt

3. **Ton de l'Assistant**
   - Choix du style de communication
   - Personnalisation selon l'entreprise

4. **Message d'Accueil**
   - Configuration du premier message
   - Exemples adaptés au secteur

5. **Objectifs et Fonctionnalités**
   - Définition des tâches principales
   - Configuration des capacités spécifiques

6. **Informations Entreprise**
   - Collecte des données de base
   - Horaires, adresse, contact

7. **Récapitulatif et Confirmation**
   - Validation des informations
   - Confirmation avant création

8. **Création et Déploiement**
   - Appel du serveur MCP
   - Provisionnement du numéro
   - Notification de succès

### Function Call vers MCP

Quand l'utilisateur confirme, l'agent appelle :

```json
{
  "name": "createAssistantAndProvisionNumber",
  "parameters": {
    "assistantName": "Assistant Restaurant Le Gourmet",
    "businessType": "restaurant",
    "assistantTone": "chaleureux et professionnel",
    "firstMessage": "Bonjour, Restaurant Le Gourmet, comment puis-je vous aider ?",
    "systemPromptCore": "Vous êtes l'assistant du Restaurant Le Gourmet...",
    "canTakeReservations": true,
    "canTakeAppointments": false,
    "canTransferCall": true,
    "companyName": "Restaurant Le Gourmet",
    "address": "123 Rue de la Gastronomie, Paris",
    "phoneNumber": "+33123456789",
    "email": "contact@legourmet.fr",
    "openingHours": "Mardi-Dimanche 12h-14h et 19h-22h",
    "endCallMessage": "Merci pour votre appel, à bientôt au Restaurant Le Gourmet !"
  }
}
```

## 🔍 Monitoring et Analytics

### Métriques Collectées

- **Sessions de configuration** : Nombre, durée, taux de succès
- **Types d'activité** : Répartition des secteurs
- **Temps de configuration** : Analyse des performances
- **Erreurs** : Tracking des échecs et causes

### Logs Disponibles

```sql
-- Sessions de configuration
SELECT * FROM configurator_sessions 
WHERE created_at >= NOW() - INTERVAL '24 hours';

-- Assistants créés via configurateur
SELECT * FROM assistants 
WHERE is_configurator = true 
ORDER BY created_at DESC;
```

## 🚨 Dépannage

### Erreurs Communes

#### 1. **Erreur VAPI_API_KEY**
```
Erreur: VAPI_API_KEY non configurée
```
**Solution :**
```bash
supabase secrets set VAPI_API_KEY=your_key
```

#### 2. **Timeout de Création**
```
Erreur: Timeout lors de la création de l'assistant
```
**Solution :**
- Vérifier la connectivité Vapi
- Contrôler les quotas API
- Réessayer avec un délai

#### 3. **Prompt Non Trouvé**
```
Erreur: Prompt non trouvé pour le type d'activité
```
**Solution :**
- Vérifier le type d'activité supporté
- Utiliser "general" comme fallback

### Vérifications de Santé

```powershell
# Test complet de l'agent
.\test-vapi-configurator.ps1 -Verbose

# Vérification des logs Supabase
supabase functions logs vapi-configurator

# Test de connectivité
curl -X POST https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/vapi-configurator \
  -H "Content-Type: application/json" \
  -d '{"action": "list-prompts"}'
```

## 📚 Ressources

### Documentation Connexe
- [Prompts Spécialisés](./prompts/Vapi_Configurateur_Prompts.md)
- [Serveur MCP](./mcp-server-guide.md)
- [API Vapi](https://docs.vapi.ai/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)

### Scripts Utiles
- `deploy-vapi-configurator.ps1` : Déploiement automatique
- `test-vapi-configurator.ps1` : Tests automatisés
- `deploy-mcp-server.ps1` : Déploiement serveur MCP

### Support
- **Logs** : `supabase functions logs vapi-configurator`
- **Monitoring** : Dashboard Supabase
- **Tests** : Scripts PowerShell automatisés

---

## 🎉 Conclusion

L'Agent Vapi Configurateur représente l'innovation clé d'AlloKoli : transformer la complexité de la configuration d'un assistant vocal en une conversation naturelle de 5 minutes. 

**Prochaines étapes :**
1. Déployer l'interface web d'onboarding
2. Intégrer avec le dashboard utilisateur
3. Optimiser les prompts selon les retours utilisateurs
4. Ajouter de nouveaux types d'activité

🚀 **L'avenir de l'onboarding vocal commence maintenant !** 