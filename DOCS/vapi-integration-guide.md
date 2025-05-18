# Guide d'intégration Vapi pour Koli55

Ce guide explique en détail comment intégrer et utiliser l'API Vapi dans le projet Koli55. Il couvre la configuration, l'utilisation et les bonnes pratiques pour créer des assistants vocaux performants.

## Table des matières

1. [Configuration de l'environnement](#configuration-de-lenvironnement)
2. [Création d'un assistant Vapi](#création-dun-assistant-vapi)
3. [Formats des providers de voix](#formats-des-providers-de-voix)
4. [Plans avancés d'assistant](#plans-avancés-dassistant)
5. [Mise à jour et suppression d'assistants](#mise-à-jour-et-suppression-dassistants)
6. [Configuration des numéros de téléphone](#configuration-des-numéros-de-téléphone)
7. [Script utilitaire de création d'assistants](#script-utilitaire-de-création-dassistants)
8. [Résolution des problèmes courants](#résolution-des-problèmes-courants)
9. [Fonctionnalités testées et validées](#fonctionnalités-testées-et-validées)
10. [Structure complète d'un assistant](#structure-complète-dun-assistant)

## Configuration de l'environnement

### Variables d'environnement

Pour utiliser l'API Vapi, configurez ces variables d'environnement dans votre environnement Supabase Edge Functions :

```bash
VAPI_API_KEY=b913fdd5-3a43-423b-aff7-2b093b7b6759
```

### Edge Functions Supabase

Dans les Edge Functions Supabase, l'API Vapi est accessible via les modules importés du fichier `shared/vapi.ts` :

```typescript
import { callVapiAPI, mapToVapiAssistantFormat } from '../shared/vapi';
```

## Création d'un assistant Vapi

### Configuration minimale fiable

Voici la configuration minimale testée et confirmée fonctionnelle pour créer un assistant Vapi :

```javascript
const assistantData = {
  name: "Assistant Test",
  model: {
    provider: "openai",
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Tu es un assistant francophone serviable."
      }
    ]
  },
  voice: {
    provider: "azure",
    voiceId: "fr-FR-DeniseNeural"
  },
  firstMessage: "Bonjour, comment puis-je vous aider aujourd'hui?"
};
```

### Exemple d'appel à l'API

Pour créer un assistant via Edge Function :

```typescript
// Format d'entrée (depuis la requête frontend)
const inputData = {
  name: "Mon Assistant",
  model: "gpt-4o",
  system_prompt: "Tu es un assistant francophone serviable.",
  voice: "azure-fr-FR-DeniseNeural",
  first_message: "Bonjour, comment puis-je vous aider aujourd'hui?"
};

// Convertir au format attendu par l'API Vapi
const vapiAssistantData = mapToVapiAssistantFormat(inputData);

// Appel à l'API Vapi
const assistant = await callVapiAPI('/assistant', 'POST', vapiAssistantData);
```

## Formats des providers de voix

### Noms de providers corrects

| Provider | Nom à utiliser | Exemple d'ID de voix | État |
|----------|----------------|----------------------|------|
| ElevenLabs | `11labs` (pas `elevenlabs`) | `21m00Tcm4TlvDq8ikWAM` (Rachel) | ✅ Testé et fonctionnel |
| PlayHT | `play.ht` (pas `playht`) | `s3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-amazon/manifest.json` | ⚠️ Non testé |
| Azure | `azure` | `fr-FR-DeniseNeural` | ✅ Testé et fonctionnel |
| OpenAI | `openai` | `alloy` | ⚠️ Non testé |

### Configuration de voix ElevenLabs validée

```javascript
voice: {
  provider: "11labs",
  voiceId: "21m00Tcm4TlvDq8ikWAM"  // Rachel
}
```

### Configuration de voix Azure validée

```javascript
voice: {
  provider: "azure",
  voiceId: "fr-FR-DeniseNeural"
}
```

## Plans avancés d'assistant

Les plans avancés permettent de personnaliser le comportement de l'assistant. Chaque plan est implémenté comme un objet JSON qui peut être passé lors de la création ou de la mise à jour d'un assistant.

### Plan d'interruption (stopSpeakingPlan)

Ce plan permet de configurer comment l'assistant réagit quand l'utilisateur l'interrompt pendant qu'il parle.

```javascript
stopSpeakingPlan: {
  interruptionPhrases: ["stop", "attends", "excuse-moi", "un instant"],
  confidenceThreshold: 0.7,  // Optionnel: niveau de confiance pour la détection
  delayMs: 300,              // Optionnel: délai avant de s'arrêter
  waitForPauseInInterruption: true  // Optionnel: attendre une pause après l'interruption
}
```

**État** : ✅ Configuration simple validée et fonctionnelle.

### Plan de messages (messagePlan)

Ce plan permet de configurer des messages d'inactivité envoyés lorsque l'utilisateur reste silencieux.

```javascript
messagePlan: {
  idleMessages: [
    "Êtes-vous toujours là?",
    "Avez-vous besoin d'aide supplémentaire?"
  ],
  idleTimeoutSeconds: 15  // Intervalle en secondes avant d'envoyer un message
}
```

**État** : ✅ Configuration simple validée et fonctionnelle.

### Plan de prise de parole (startSpeakingPlan)

Ce plan définit comment l'assistant commence à parler lorsqu'il détecte que l'utilisateur a fini.

```javascript
startSpeakingPlan: {
  confidenceThreshold: 0.7,  // Niveau de confiance pour démarrer
  delayMs: 500,              // Délai avant de commencer à parler
  preferContentCompletion: true,  // Attendre que l'utilisateur complète sa phrase
  stopTracking: {
    durationMs: 2000,          // Durée de suivi
    confidenceThreshold: 0.8   // Seuil de confiance pour arrêter de suivre
  }
}
```

**État** : ⚠️ Partiellement testé, utiliser avec précaution.

### Plan d'analyse (analysisPlan)

Ce plan permet d'activer différentes analyses sur la conversation.

```javascript
analysisPlan: {
  summaryEnabled: true,       // Génère un résumé de l'appel
  topicsEnabled: true,        // Identifie les sujets discutés
  entitiesEnabled: true,      // Extrait les entités nommées
  sentimentEnabled: true      // Analyse le sentiment de la conversation
}
```

**État** : ⚠️ Non testé exhaustivement, utiliser avec précaution.

### Plan d'artefacts (artifactPlan)

Ce plan définit quels artefacts sont générés à la fin de l'appel.

```javascript
artifactPlan: {
  recordingEnabled: true,     // Enregistrement audio
  transcriptEnabled: true,    // Transcription textuelle
  callReportEnabled: true,    // Rapport d'appel
  sentimentEnabled: true,     // Analyse de sentiment
  topicsEnabled: true,        // Analyse de sujets
  entitiesEnabled: true,      // Extraction d'entités
  summaryEnabled: true        // Résumé de l'appel
}
```

**État** : ⚠️ Non testé, fonctionnalité avancée.

### Plan de supervision (monitorPlan)

Ce plan permet de configurer les options de supervision en temps réel.

```javascript
monitorPlan: {
  listenEnabled: true,    // Permettre l'écoute en direct
  controlEnabled: true    // Permettre le contrôle en direct
}
```

**État** : ⚠️ Non testé, fonctionnalité avancée.

### Détection de messagerie vocale (voicemailDetection)

Cette configuration permet de détecter les messageries vocales et d'adapter le comportement.

```javascript
voicemailDetection: {
  provider: "google",
  backoffPlan: {
    startAtSeconds: 2,
    frequencySeconds: 1,
    maxRetries: 3
  },
  beepMaxAwaitSeconds: 5
}
```

**État** : ⚠️ Non testé, fonctionnalité avancée.

## Mise à jour et suppression d'assistants

### Mise à jour d'un assistant

Pour mettre à jour un assistant existant (fonctionnalités de base uniquement) :

```typescript
// Données de mise à jour
const updateData = {
  name: "Assistant Mis à Jour",
  firstMessage: "Bonjour, je suis l'assistant mis à jour. Comment puis-je vous aider?"
};

// Convertir au format Vapi
const vapiUpdateData = mapToVapiAssistantFormat(updateData);

// Appel à l'API Vapi
const updatedAssistant = await callVapiAPI(`/assistant/${assistantId}`, 'PATCH', vapiUpdateData);
```

**État** : ✅ Validé pour les modifications de base comme le nom et le message d'accueil.

### Suppression d'un assistant

Pour supprimer un assistant :

```typescript
// Appel à l'API Vapi
await callVapiAPI(`/assistant/${assistantId}`, 'DELETE');
```

**État** : ✅ Validé et fonctionnel.

## Configuration des numéros de téléphone

Pour lier un assistant à un numéro de téléphone Vapi :

```typescript
// Obtenir la liste des numéros de téléphone
const phoneNumbers = await callVapiAPI('/phoneNumber', 'GET');

// Mettre à jour un numéro de téléphone pour utiliser un assistant
const updateData = {
  assistantId: "assistant_id_here"
};

await callVapiAPI(`/phoneNumber/${phoneNumberId}`, 'PATCH', updateData);
```

**État** : ⚠️ Non testé, utiliser selon la documentation officielle Vapi.

## Script utilitaire de création d'assistants

Un script PowerShell `create-vapi-assistant.ps1` est disponible pour faciliter la création et les tests d'assistants Vapi avec différentes configurations, y compris les plans avancés.

### Paramètres de base

```powershell
./create-vapi-assistant.ps1 -Name "Mon Assistant" -SystemPrompt "Tu es un assistant serviable." -Voice "azure-fr-FR-DeniseNeural" -FirstMessage "Bonjour, comment puis-je vous aider?"
```

### Paramètres pour les plans avancés

Le script prend en charge tous les plans avancés via des paramètres spécifiques :

```powershell
./create-vapi-assistant.ps1 -Name "Assistant Complet" `
  -SystemPrompt "Tu es un assistant professionnel." `
  -Voice "azure-fr-FR-DeniseNeural" `
  -StopSpeakingPlan "{\"interruptionPhrases\":[\"stop\", \"attends\"]}" `
  -MessagePlan "{\"idleMessages\":[\"Êtes-vous toujours là?\"], \"idleTimeoutSeconds\": 15}" `
  -SilenceTimeoutSeconds 30 `
  -DeleteAfterTest
```

### Exemples de configurations testées

#### Plan d'interruption simple (validé)

```powershell
./create-vapi-assistant.ps1 -Name "Assistant Interruptible" `
  -StopSpeakingPlan "{\"interruptionPhrases\":[\"stop\", \"attends\", \"excuse-moi\"]}" `
  -DeleteAfterTest
```

#### Plan de messages d'inactivité (validé)

```powershell
./create-vapi-assistant.ps1 -Name "Assistant Proactif" `
  -MessagePlan "{\"idleMessages\":[\"Êtes-vous toujours là?\",\"Avez-vous besoin d'aide?\"], \"idleTimeoutSeconds\": 15}" `
  -DeleteAfterTest
```

#### Plan d'analyse (non testé)

```powershell
./create-vapi-assistant.ps1 -Name "Assistant Analytique" `
  -AnalysisPlan "{\"summaryEnabled\": true, \"topicsEnabled\": true, \"sentimentEnabled\": true}" `
  -DeleteAfterTest
```

#### Paramètres de durée d'appel

```powershell
./create-vapi-assistant.ps1 -Name "Assistant Temporisé" `
  -SilenceTimeoutSeconds 30 `
  -MaxDurationSeconds 300 `
  -EndCallAfterSilence `
  -DeleteAfterTest
```

## Résolution des problèmes courants

### Erreur "Provider 'elevenlabs' not found"

**Problème**: ElevenLabs est référencé avec un nom incorrect.

**Solution**: Utilisez `11labs` au lieu de `elevenlabs` pour le provider.

```javascript
// Incorrect
voice: {
  provider: "elevenlabs",  // INCORRECT
  voiceId: "rachel"
}

// Correct
voice: {
  provider: "11labs",  // CORRECT
  voiceId: "21m00Tcm4TlvDq8ikWAM"
}
```

### Erreur "Cannot POST /v1/assistants"

**Problème**: L'URL de l'API Vapi utilisée contient un préfixe `/v1/` incorrect.

**Solution**: Utilisez les endpoints sans préfixe `/v1/`.

```typescript
// Incorrect
const assistant = await callVapiAPI('/v1/assistants', 'POST', data);  // INCORRECT

// Correct
const assistant = await callVapiAPI('/assistant', 'POST', data);  // CORRECT
```

### Erreur 400 Bad Request avec les plans avancés

**Problème**: L'API Vapi rejette certains plans avancés avec des configurations complexes.

**Solution**: 
1. Utilisez les configurations simples validées documentées ci-dessus
2. Testez progressivement chaque paramètre en cas de problème
3. Consultez la documentation officielle Vapi pour les formats exacts
4. Utilisez le script `create-vapi-assistant.ps1` qui facilite le test des différentes configurations

## Fonctionnalités testées et validées

| Fonctionnalité | État | Commentaire |
|----------------|------|-------------|
| Création d'assistant avec Azure | ✅ Validé | Fonctionne comme prévu |
| Création d'assistant avec ElevenLabs (11labs) | ✅ Validé | Fonctionne comme prévu |
| Mise à jour de base (nom, premier message) | ✅ Validé | Fonctionne comme prévu |
| Suppression d'assistant | ✅ Validé | Fonctionne comme prévu |
| stopSpeakingPlan (interruptionPhrases) | ✅ Validé | Configuration simple fonctionne bien |
| messagePlan (idleMessages) | ✅ Validé | Configuration simple fonctionne bien |
| messagePlan avec idleTimeoutSeconds | ✅ Validé | Fonctionne comme prévu |
| firstMessageMode | ✅ Validé | Modes "assistant-speaks-first" fonctionne |
| firstMessageInterruptionsEnabled | ⚠️ Non testé | À tester dans un dialogue réel |
| Transcriber (assembly-ai) | ❌ Problématique | Génère des erreurs 400 Bad Request |
| Voice avec chunkPlan | ❌ Problématique | Génère des erreurs 400 Bad Request |
| Voice avec fallbackPlan | ❌ Problématique | Génère des erreurs 400 Bad Request |
| SilenceTimeoutSeconds | ❌ Problématique | Génère des erreurs 400 Bad Request |
| MaxDurationSeconds | ❌ Problématique | Génère des erreurs 400 Bad Request |
| EndCallAfterSilence | ❌ Problématique | Génère des erreurs 400 Bad Request |
| analysisPlan | ⚠️ Non testé | Utiliser avec précaution |
| startSpeakingPlan | ⚠️ Non testé | Utiliser avec précaution |
| stopSpeakingPlan complexe | ⚠️ Non testé | Utiliser avec précaution |
| artifactPlan | ⚠️ Non testé | Utiliser avec précaution |
| monitorPlan | ⚠️ Non testé | Utiliser avec précaution |
| voicemailDetection | ⚠️ Non testé | Utiliser avec précaution |
| VoiceReflection | ⚠️ Non testé | Utiliser avec précaution |

### Configurations prioritaires recommandées

Basé sur nos tests, nous recommandons de se concentrer sur ces configurations qui ont été validées comme fonctionnelles :

1. **Configuration du modèle (model)** - Toujours fonctionnel
2. **Configuration de la voix (voice)** - Toujours fonctionnel avec Azure et ElevenLabs (formats simples)
3. **Plan d'interruption simple (stopSpeakingPlan)** - Fonctionne bien avec la liste d'phrases
4. **Plan de messages d'inactivité (messagePlan)** - Fonctionne bien avec les messages et le délai
5. **Mode de premier message (firstMessageMode)** - Fonctionne bien avec "assistant-speaks-first"

Pour les autres configurations avancées, il est recommandé de les tester individuellement avant de les utiliser en production, car elles peuvent générer des erreurs 400 Bad Request selon les combinaisons utilisées.

## Exemples validés de plans avancés

### stopSpeakingPlan - Version simple (validée)

```json
{
  "stopSpeakingPlan": {
    "interruptionPhrases": [
      "stop",
      "attends",
      "excuse-moi",
      "un instant"
    ]
  }
}
```

### messagePlan - Version simple (validée)

```json
{
  "messagePlan": {
    "idleMessages": [
      "Êtes-vous toujours là?",
      "Avez-vous besoin d'aide supplémentaire?"
    ],
    "idleTimeoutSeconds": 15
  }
}
```

### startSpeakingPlan - Version recommandée

```json
{
  "startSpeakingPlan": {
    "confidenceThreshold": 0.7,
    "delayMs": 500,
    "preferContentCompletion": true
  }
}
```

### analysisPlan - Version recommandée

```json
{
  "analysisPlan": {
    "summaryEnabled": true,
    "topicsEnabled": true,
    "entitiesEnabled": true,
    "sentimentEnabled": true
  }
}
```

## Structure complète d'un assistant

Voici un exemple de configuration complète recommandée pour un assistant Vapi robuste avec plans avancés :

```javascript
{
  name: "Assistant Complet",
  model: {
    provider: "openai",
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "Tu es un assistant francophone professionnel et serviable. Tu réponds de manière concise et efficace."
      }
    ]
  },
  voice: {
    provider: "azure",
    voiceId: "fr-FR-DeniseNeural"
  },
  firstMessage: "Bonjour, je suis votre assistant. Comment puis-je vous aider aujourd'hui?",
  stopSpeakingPlan: {
    interruptionPhrases: ["stop", "attends", "excuse-moi", "un instant"]
  },
  messagePlan: {
    idleMessages: ["Êtes-vous toujours là?", "Avez-vous besoin d'aide supplémentaire?"],
    idleTimeoutSeconds: 15
  },
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: 300,
  endCallAfterSilence: true
}
```

Pour les fonctionnalités avancées plus complexes, référez-vous à la [documentation officielle de Vapi](https://docs.vapi.ai/api-reference/assistants/create), et testez chaque configuration individuellement avant de les combiner pour l'utilisation en production. 