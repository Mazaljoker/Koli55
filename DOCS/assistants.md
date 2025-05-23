# Assistants

## Vue d'ensemble
Les assistants sont au cœur de la plateforme Koli55. Un assistant est un agent IA vocal capable de mener des conversations téléphoniques automatisées avec les utilisateurs. Cette documentation détaille les fonctionnalités, l'intégration et l'utilisation des assistants.

## 🎉 État actuel (Phase 10.1 - COMPLÉTÉ)

**✅ FONCTIONNALITÉ COMPLÈTEMENT OPÉRATIONNELLE**

- **Backend** : Edge Function `assistants` déployée (Version 28) et **100% compatible Vapi.ai**
- **Frontend** : Service `assistantsService` complètement testé et fonctionnel
- **Interface utilisateur** : Wizard de création d'assistant complet et opérationnel
- **Intégration** : Connexion frontend-backend validée et robuste

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
