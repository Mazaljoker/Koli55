# Assistants

## Vue d'ensemble
Les assistants sont au cœur de la plateforme Koli55. Un assistant est un agent IA vocal capable de mener des conversations téléphoniques automatisées avec les utilisateurs. Cette documentation détaille les fonctionnalités, l'intégration et l'utilisation des assistants.

## 🎉 État actuel (Phase 10.1 - COMPLÉTÉ + AGENT CONFIGURATEUR)

**✅ FONCTIONNALITÉ COMPLÈTEMENT OPÉRATIONNELLE + CONFIGURATEUR SPÉCIALISÉ**

- **Backend** : Edge Function `assistants` déployée (Version 29) et **100% compatible Vapi.ai**
- **Agent Configurateur** : ✅ **NOUVEAU** Template restaurant créé et opérationnel
- **Frontend** : Service `assistantsService` complètement testé et fonctionnel
- **Interface utilisateur** : Wizard de création d'assistant complet et opérationnel
- **Intégration** : Connexion frontend-backend validée et robuste

## 🚀 Agent Configurateur AlloKoli

### Vue d'ensemble
L'agent configurateur AlloKoli est un assistant spécialisé qui guide les professionnels dans la création d'assistants vocaux personnalisés pour leur secteur d'activité.

**✅ AGENT CONFIGURATEUR RESTAURANT OPÉRATIONNEL**

- **Nom** : "AlloKoliConfig Restaurant"
- **ID Vapi** : `46b73124-6624-45ab-89c7-d27ecedcb251`
- **Statut** : ✅ Créé et configuré avec succès
- **Secteur** : Restaurant (template spécialisé)

### Fonctionnalités du Configurateur

#### 1. Collecte d'Informations Structurée
Le configurateur guide l'utilisateur à travers un processus de collecte d'informations :

1. **Accueil et explication** du processus de création
2. **Nom du restaurant** - Identification de l'établissement
3. **Type de cuisine** - Spécialisation culinaire (italienne, japonaise, etc.)
4. **Services offerts** - Livraison, plats à emporter, réservations
5. **Horaires d'ouverture** - Planning de fonctionnement
6. **Spécialités de la maison** - Plats signature et recommandations

#### 2. Génération JSON Automatique
À la fin du processus, le configurateur génère automatiquement une configuration JSON complète basée sur les informations collectées :

```json
{
  "restaurant": {
    "name": "Restaurant Example",
    "cuisine_type": "italienne",
    "services": ["livraison", "plats_a_emporter"],
    "hours": {
      "monday": "11:00-22:00",
      "tuesday": "11:00-22:00"
    },
    "specialties": ["pizza margherita", "risotto aux champignons"]
  },
  "assistant_config": {
    "greeting": "Bonjour et bienvenue chez [Restaurant Name]",
    "capabilities": ["reservations", "menu_info", "hours_info"],
    "voice_settings": {
      "tone": "friendly",
      "language": "fr-FR"
    }
  }
}
```

#### 3. Prompt Système Optimisé

```
[Identity]  
Vous êtes AlloKoliConfig, un assistant expert en configuration d'agents vocaux pour restaurants. Guidez les restaurateurs, spécialisé dans la création de profils personnalisés pour chaque établissement.

[Style]  
Utilisez un ton informatif et amical. Assurez-vous d'être clair et engageant dans vos instructions.

[Response Guidelines]  
- Posez une question à la fois pour faciliter la collecte d'informations.
- Évitez les jargons techniques. Expliquez les étapes de manière simple et directe.  

[Task & Goals]  
1. Accueillez le restaurateur et expliquez brièvement le processus de création de l'assistant vocal.  
2. Demandez le nom du restaurant.  
3. Demandez le type de cuisine que l'établissement propose (par exemple, italienne, japonaise).  
4. Recueillez des informations sur les services offerts (comme la livraison, les plats à emporter, etc.).  
5. Demandez les horaires d'ouverture et de fermeture.  
6. Demandez les spécialités de la maison.
7. À la fin du processus, générez une configuration JSON complète basée sur les informations collectées.

[Error Handling / Fallback]  
- Si une réponse est incomplète ou peu claire, demandez des éclaircissements poliment.  
- En cas de problème technique lors de la génération du JSON, informez le restaurateur et proposez de réessayer.
```

### Tests et Validation

#### Scripts de Test Disponibles
1. **`test-configurateur-simple.ps1`** - Test de création de l'assistant configurateur
2. **`update-configurateur-prompt.ps1`** - Mise à jour du prompt système
3. **`test-edge-function-simple.ps1`** - Validation de l'Edge Function

#### Résultats de Tests
- **✅ Création réussie** : Assistant créé avec ID `46b73124-6624-45ab-89c7-d27ecedcb251`
- **✅ Prompt mis à jour** : Template restaurant validé et opérationnel
- **✅ API Vapi** : Connexion et synchronisation validées
- **✅ Edge Function** : Version 29 déployée et fonctionnelle

### Utilisation du Configurateur

#### Via API
```typescript
// Appel de l'assistant configurateur
const configResponse = await assistantsService.call({
  assistantId: "46b73124-6624-45ab-89c7-d27ecedcb251",
  phoneNumber: "+33123456789"
});
```

#### Via Interface Web
Le configurateur peut être intégré dans l'interface utilisateur pour guider les nouveaux utilisateurs dans la création de leur premier assistant.

### Prochaines Évolutions

#### Templates Additionnels
- **Hôtels** - Configuration pour établissements hôteliers
- **Services** - Assistants pour entreprises de services
- **Commerce** - Configuration pour boutiques et magasins
- **Santé** - Templates pour cabinets médicaux

#### Améliorations Prévues
- **Interface graphique** - Wizard visuel pour le configurateur
- **Templates personnalisables** - Modification des prompts par secteur
- **Export/Import** - Sauvegarde et partage de configurations
- **Analytics** - Métriques d'utilisation du configurateur

## Structure d'un assistant
Un assistant Vapi intégré dans Koli55 possède les caractéristiques suivantes :

```typescript
interface VapiAssistant {
  id: string;
  name: string;
  model?: {
    provider: string; // 'openai', 'anthropic', 'cohere', 'azure', etc.
    model: string; // 'gpt-4o', 'claude-3-opus-20240229', etc.
    systemPrompt?: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
  };
  voice?: {
    provider: string; // 'elevenlabs', 'deepgram', 'openai', etc.
    voiceId: string; // ID spécifique au provider
  };
  firstMessage?: string;
  tools?: {
    functions?: string[]; // IDs des fonctions
    knowledgeBases?: string[]; // IDs des bases de connaissances
    workflows?: string[]; // IDs des workflows
  };
  forwardingPhoneNumber?: string;
  recordingSettings?: {
    createRecording: boolean;
    saveRecording: boolean;
  };
  metadata?: Record<string, any>;
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
  created_at: string;
  updated_at: string;
}
```

## Fonctionnalités des assistants

### Modèles disponibles
Les assistants Koli55 prennent en charge plusieurs modèles d'IA :
- **OpenAI** : GPT-4o, GPT-4, GPT-3.5
- **Anthropic** : Claude 3 Opus, Claude 3 Sonnet, Claude 3 Haiku
- **Cohere** : Command, Command Light

### Voix disponibles
Les assistants peuvent utiliser différentes technologies de synthèse vocale :
- **ElevenLabs** : Voix premium de haute qualité
- **OpenAI** : Voix TTS d'OpenAI
- **Deepgram** : Options de voix variées

### Outils et intégrations
Un assistant peut utiliser les outils suivants :
- **Fonctions personnalisées** : Exécution d'actions spécifiques ⏳ (en attente déploiement)
- **Bases de connaissances** : Accès à des informations contextuelles ⏳ (en attente déploiement)
- **Workflows** : Séquences de conversation prédéfinies ⏳ (en attente déploiement)

## Flux d'intégration avec Vapi (✅ PLEINEMENT FONCTIONNEL)

### 1. Création d'un assistant
```typescript
// ✅ Interface utilisateur complète disponible à /assistants/new
import { assistantsService } from 'lib/api';

const response = await assistantsService.create({
  name: "Assistant de réservation",
  model: {
    provider: "openai",
    model: "gpt-4o",
    systemPrompt: "Vous êtes un assistant de réservation..."
  },
  voice: {
    provider: "elevenlabs",
    voiceId: "voice_id_here"
  },
  firstMessage: "Bonjour, comment puis-je vous aider aujourd'hui?"
});

// ✅ Gestion d'erreurs robuste avec fallback
if (response.success) {
  console.log('Assistant créé avec succès:', response.data);
} else {
  console.error('Erreur:', response.message);
}
```

### 2. Récupération d'un assistant
```typescript
// ✅ Récupération avec gestion d'erreurs complète
const response = await assistantsService.getById("assistant_id_here");

if (response.success) {
  console.log('Assistant récupéré:', response.data);
}
```

### 3. Mise à jour d'un assistant
```typescript
// ✅ Mise à jour partielle supportée
const response = await assistantsService.update("assistant_id_here", {
  name: "Nouveau nom",
  firstMessage: "Nouveau message d'accueil"
});
```

### 4. Suppression d'un assistant
```typescript
// ✅ Suppression sécurisée avec confirmation
const response = await assistantsService.delete("assistant_id_here");
```

### 5. Liste des assistants avec pagination
```typescript
// ✅ Pagination et filtres supportés
const response = await assistantsService.list({
  page: 1,
  limit: 10
});

if (response.success) {
  console.log('Assistants:', response.data);
  console.log('Pagination:', response.pagination);
}
```

## Interface utilisateur (✅ COMPLÈTE)

### Wizard de création d'assistant
**Location** : `/app/assistants/new`

Le wizard de création offre une expérience utilisateur complète avec :

- **✅ Étape 1 - Informations de base** : Nom, description, instructions
- **✅ Étape 2 - Modèle IA** : Sélection du provider et du modèle
- **✅ Étape 3 - Configuration vocale** : Choix de la voix et des paramètres
- **✅ Étape 4 - Paramètres avancés** : Configuration détaillée

**Fonctionnalités** :
- Interface glassmorphism avec design moderne
- Validation en temps réel à chaque étape
- Navigation fluide entre les étapes
- Gestion d'erreurs avec messages contextualisés
- Sauvegarde automatique des données
- Preview des paramètres avant création

### Pages de gestion
- **✅ Liste des assistants** : `/dashboard/assistants` - Interface complète avec cartes interactives
- **✅ Détail d'assistant** : `/assistants/[id]` - Vue détaillée avec onglets de configuration
- **✅ Édition d'assistant** : `/assistants/[id]/edit` - Interface de modification

## Bonnes pratiques

### Prompts système efficaces
- Soyez spécifique sur le rôle et les capacités de l'assistant
- Définissez clairement les limites et les domaines d'expertise
- Incluez des exemples de dialogues typiques

### Configuration optimale
- Utilisez une `temperature` plus basse (0.2-0.5) pour des réponses cohérentes
- Activez `voiceReflection` pour une expérience plus naturelle
- Réglez `silenceTimeoutSeconds` entre 5 et 10 secondes pour un bon équilibre

### Intégration avec d'autres entités
- ⏳ **Bases de connaissances** : Disponible après déploiement de l'Edge Function `knowledge-bases`
- ⏳ **Fonctions personnalisées** : Disponible après déploiement de l'Edge Function `functions`
- ⏳ **Workflows** : Disponible après déploiement de l'Edge Function `workflows`

## Dépannage et monitoring

### État du service (Phase 10.1)
- **✅ Backend déployé** : Edge Function Version 28 active
- **✅ API Vapi** : 100% compatible avec la nouvelle structure
- **✅ Frontend** : Service complètement testé et fonctionnel
- **✅ Gestion d'erreurs** : Système de fallback et retry opérationnel

### Problèmes courants résolus
- **✅ URLs API correctes** : Suppression du préfixe `/v1/` erroné
- **✅ Format de réponse** : Harmonisation avec le format Vapi standard
- **✅ Fonctions de mapping** : `mapToVapiAssistantFormat` opérationnelle
- **✅ Validation** : Fonctions `extractId` et `sanitizeString` implémentées

### Logs de débogage
Les logs du serveur incluent des informations détaillées avec des préfixes standardisés :
- `[HANDLER]` - Entrée dans un gestionnaire d'endpoint
- `[MAPPING]` - Transformation des données
- `[VAPI_SUCCESS]` - Appel API réussi
- `[VAPI_ERROR]` - Erreur dans l'appel API

### Accès aux logs
```bash
# Logs de l'Edge Function en temps réel
supabase functions logs assistants --project-ref aiurboizarbbcpynmmgv
```

## Exemple complet d'utilisation

```typescript
import { assistantsService } from 'lib/api';

// Création complète d'un assistant
const createCompleteAssistant = async () => {
  try {
    const assistantData = {
      name: "Assistant Support Client",
      model: {
        provider: "openai",
        model: "gpt-4o",
        systemPrompt: `Vous êtes un assistant de support client pour Koli55.
        Votre rôle est d'aider les utilisateurs avec leurs questions sur la plateforme.
        Restez professionnel, sympathique et fournissez des réponses précises.`,
        temperature: 0.3,
        maxTokens: 150
      },
      voice: {
        provider: "elevenlabs",
        voiceId: "21m00Tcm4TlvDq8ikWAM" // Rachel voice
      },
      firstMessage: "Bonjour ! Je suis votre assistant support Koli55. Comment puis-je vous aider aujourd'hui ?",
      silenceTimeoutSeconds: 8,
      maxDurationSeconds: 1800, // 30 minutes max
      endCallAfterSilence: true,
      voiceReflection: true,
      recordingSettings: {
        createRecording: true,
        saveRecording: true
      }
    };

    const response = await assistantsService.create(assistantData);
    
    if (response.success) {
      console.log('✅ Assistant créé avec succès:', response.data);
      return response.data;
    } else {
      console.error('❌ Erreur de création:', response.message);
      return null;
    }
  } catch (error) {
    console.error('❌ Erreur inattendue:', error);
    return null;
  }
};

// Utilisation
const newAssistant = await createCompleteAssistant();
```

## Roadmap des améliorations

### Prochaines fonctionnalités (dépendantes du déploiement d'autres Edge Functions)
1. **Intégration bases de connaissances** - Permettre aux assistants d'accéder à des documents
2. **Fonctions personnalisées** - Ajout d'outils spécialisés aux assistants
3. **Workflows complexes** - Configuration de flux de conversation avancés
4. **Analytics détaillées** - Métriques de performance des assistants
5. **Tests automatisés** - Suites de tests pour valider les assistants

### Améliorations de l'interface
1. **Templates d'assistants** - Modèles préconfigurés par secteur
2. **Mode prévisualisation** - Test des assistants depuis l'interface
3. **Import/Export** - Sauvegarde et partage de configurations
4. **Collaboration** - Gestion multi-utilisateurs des assistants
