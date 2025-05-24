# Guide d'Utilisation - Agent Configurateur AlloKoli

**Version :** 1.0  
**Date :** 24 mai 2025  
**Statut :** ✅ OPÉRATIONNEL

## 🎯 Introduction

L'agent configurateur AlloKoli est un assistant vocal intelligent spécialement conçu pour guider les professionnels dans la création d'assistants vocaux personnalisés pour leur secteur d'activité. Ce guide détaille son utilisation, ses fonctionnalités et les meilleures pratiques.

## 📋 Informations Générales

### Identité de l'Agent
- **Nom** : AlloKoliConfig Restaurant
- **ID Vapi** : `46b73124-6624-45ab-89c7-d27ecedcb251`
- **Secteur** : Restaurant (template spécialisé)
- **Modèle IA** : GPT-4 (OpenAI)
- **Voix** : 11Labs (voiceId: `21m00Tcm4TlvDq8ikWAM`)

### Statut Technique
- **✅ Créé et déployé** sur la plateforme Vapi
- **✅ Synchronisé** avec la base de données Supabase
- **✅ Testé et validé** via scripts automatisés
- **✅ Prêt** pour utilisation en production

## 🚀 Fonctionnalités Principales

### 1. Processus de Configuration Guidée

L'agent configurateur suit un processus structuré en 7 étapes :

#### Étape 1 : Accueil et Explication
- **Objectif** : Présenter le processus et rassurer l'utilisateur
- **Durée** : 30-60 secondes
- **Message type** : "Bonjour ! Je suis AlloKoliConfig, votre guide pour créer un assistant vocal parfait pour votre restaurant..."

#### Étape 2 : Nom du Restaurant
- **Question** : "Quel est le nom de votre restaurant ?"
- **Validation** : Vérification que le nom est fourni
- **Utilisation** : Personnalisation des messages de l'assistant final

#### Étape 3 : Type de Cuisine
- **Question** : "Quel type de cuisine proposez-vous ?"
- **Exemples** : Italienne, japonaise, française, fusion, etc.
- **Utilisation** : Adaptation du vocabulaire et des recommandations

#### Étape 4 : Services Offerts
- **Question** : "Quels services proposez-vous ?"
- **Options** : Livraison, plats à emporter, réservations, service en salle
- **Utilisation** : Configuration des capacités de l'assistant

#### Étape 5 : Horaires d'Ouverture
- **Question** : "Quels sont vos horaires d'ouverture ?"
- **Format** : Jours de la semaine et heures
- **Utilisation** : Réponses automatiques sur la disponibilité

#### Étape 6 : Spécialités de la Maison
- **Question** : "Quelles sont vos spécialités ?"
- **Détails** : Plats signature, recommandations du chef
- **Utilisation** : Suggestions personnalisées aux clients

#### Étape 7 : Génération de Configuration
- **Action** : Création automatique du JSON de configuration
- **Contenu** : Toutes les informations collectées structurées
- **Livrable** : Configuration prête à déployer

### 2. Génération JSON Automatique

À la fin du processus, l'agent génère une configuration complète :

```json
{
  "restaurant": {
    "name": "La Bella Vista",
    "cuisine_type": "italienne",
    "services": [
      "livraison",
      "plats_a_emporter",
      "reservations",
      "service_en_salle"
    ],
    "hours": {
      "lundi": "11:30-14:30, 18:00-22:00",
      "mardi": "11:30-14:30, 18:00-22:00",
      "mercredi": "11:30-14:30, 18:00-22:00",
      "jeudi": "11:30-14:30, 18:00-22:00",
      "vendredi": "11:30-14:30, 18:00-23:00",
      "samedi": "11:30-14:30, 18:00-23:00",
      "dimanche": "fermé"
    },
    "specialties": [
      "Pizza Margherita au feu de bois",
      "Risotto aux champignons porcini",
      "Tiramisu maison",
      "Osso buco à la milanaise"
    ]
  },
  "assistant_config": {
    "name": "Assistant La Bella Vista",
    "greeting": "Bonjour et bienvenue chez La Bella Vista ! Comment puis-je vous aider aujourd'hui ?",
    "capabilities": [
      "reservations",
      "menu_info",
      "hours_info",
      "delivery_info",
      "specialties_recommendation"
    ],
    "voice_settings": {
      "tone": "friendly",
      "language": "fr-FR",
      "speed": "normal"
    },
    "business_rules": {
      "reservation_hours": "11:30-21:30",
      "delivery_radius": "5km",
      "minimum_order": "25€"
    }
  }
}
```

## 🛠️ Utilisation Pratique

### Via Appel Téléphonique

#### 1. Initier un Appel
```bash
# Via API Vapi
curl -X POST "https://api.vapi.ai/calls" \
  -H "Authorization: Bearer YOUR_VAPI_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "assistantId": "46b73124-6624-45ab-89c7-d27ecedcb251",
    "phoneNumber": "+33123456789"
  }'
```

#### 2. Déroulement de l'Appel
1. **Connexion** : L'agent se présente et explique le processus
2. **Questions** : Collecte guidée des informations (7 étapes)
3. **Validation** : Récapitulatif des informations collectées
4. **Génération** : Création de la configuration JSON
5. **Livraison** : Envoi de la configuration par email ou SMS

### Via Interface Web (À venir)

L'intégration dans l'interface utilisateur permettra :
- **Chat en temps réel** avec l'agent configurateur
- **Interface visuelle** pour visualiser les étapes
- **Sauvegarde automatique** des informations
- **Preview** de l'assistant configuré

## 📊 Scripts de Test et Maintenance

### Scripts Disponibles

#### 1. Test de Création
```powershell
# test-configurateur-simple.ps1
# Teste la création de l'assistant configurateur
pwsh -File test-configurateur-simple.ps1
```

#### 2. Mise à Jour du Prompt
```powershell
# update-configurateur-prompt.ps1
# Met à jour le prompt système de l'agent
pwsh -File update-configurateur-prompt.ps1
```

#### 3. Test Edge Function
```powershell
# test-edge-function-simple.ps1
# Valide le fonctionnement de l'Edge Function
pwsh -File test-edge-function-simple.ps1
```

### Monitoring et Logs

#### Vérification du Statut
```typescript
// Via service assistants
const status = await assistantsService.getById("46b73124-6624-45ab-89c7-d27ecedcb251");
console.log("Statut configurateur:", status);
```

#### Logs Supabase
```bash
# Consulter les logs Edge Function
supabase logs --project-ref aiurboizarbbcpynmmgv --type edge-function
```

## 🎯 Cas d'Usage Types

### 1. Nouveau Restaurant
**Contexte** : Restaurant qui ouvre et souhaite un assistant vocal

**Processus** :
1. Appel de l'agent configurateur
2. Collecte des informations de base
3. Génération de la configuration
4. Déploiement de l'assistant personnalisé

**Durée** : 10-15 minutes

### 2. Restaurant Existant
**Contexte** : Restaurant établi qui veut moderniser sa prise de commandes

**Processus** :
1. Appel de l'agent configurateur
2. Adaptation aux services existants
3. Intégration avec les systèmes actuels
4. Formation du personnel

**Durée** : 15-20 minutes

### 3. Chaîne de Restaurants
**Contexte** : Plusieurs établissements avec des spécificités locales

**Processus** :
1. Configuration du template de base
2. Personnalisation par établissement
3. Déploiement centralisé
4. Gestion unifiée

**Durée** : 30-45 minutes par établissement

## 🔧 Personnalisation et Extensions

### Modification du Prompt

Pour adapter l'agent à d'autres secteurs :

```typescript
// Exemple pour un hôtel
const hotelPrompt = `
[Identity]  
Vous êtes AlloKoliConfig, un assistant expert en configuration d'agents vocaux pour hôtels. Guidez les hôteliers dans la création de profils personnalisés pour leur établissement.

[Task & Goals]  
1. Demandez le nom de l'hôtel
2. Demandez le type d'établissement (business, loisir, boutique)
3. Recueillez les services (spa, restaurant, room service)
4. Demandez les types de chambres disponibles
5. Collectez les équipements (piscine, salle de sport, wifi)
6. Générez la configuration JSON complète
`;
```

### Ajout de Fonctionnalités

```typescript
// Extension pour intégrations
const extendedConfig = {
  integrations: {
    pos_system: "Square",
    reservation_system: "OpenTable",
    delivery_platforms: ["UberEats", "Deliveroo"]
  },
  advanced_features: {
    multilingual: true,
    voice_recognition: true,
    sentiment_analysis: true
  }
};
```

## 📈 Métriques et Analytics

### KPIs de Performance
- **Taux de complétion** : % d'appels menés à terme
- **Temps moyen** : Durée de configuration
- **Satisfaction** : Note des utilisateurs
- **Taux d'adoption** : Assistants déployés après configuration

### Monitoring Technique
- **Uptime** : Disponibilité de l'agent
- **Latence** : Temps de réponse
- **Erreurs** : Taux d'échec des appels
- **Utilisation** : Nombre d'appels par jour

## 🚀 Prochaines Évolutions

### Templates Sectoriels
- **Hôtels** : Configuration pour établissements hôteliers
- **Services** : Assistants pour entreprises de services
- **Commerce** : Configuration pour boutiques
- **Santé** : Templates pour cabinets médicaux

### Améliorations Techniques
- **Interface graphique** : Wizard visuel
- **Multi-langues** : Support international
- **IA avancée** : Reconnaissance d'intention
- **Intégrations** : APIs tierces automatiques

### Fonctionnalités Business
- **Templates personnalisables** : Modification par secteur
- **Export/Import** : Sauvegarde de configurations
- **Analytics avancées** : Métriques détaillées
- **Support multi-tenant** : Gestion d'agences

## 📞 Support et Assistance

### Documentation Technique
- [Audit Documentation Configurateur](audit-documentation-configurateur.md)
- [Documentation Assistants](assistants.md)
- [Guide API Vapi](api_integration.md)

### Scripts et Outils
- `test-configurateur-simple.ps1` - Tests automatisés
- `update-configurateur-prompt.ps1` - Mise à jour
- `backend-health-check.ps1` - Monitoring système

### Contact Support
- **Logs** : Supabase Dashboard
- **API** : Documentation Vapi
- **Issues** : GitHub repository

---

**Guide créé le 24 mai 2025**  
**Version 1.0 - Agent Configurateur AlloKoli**  
**Statut : ✅ OPÉRATIONNEL ET DOCUMENTÉ** 