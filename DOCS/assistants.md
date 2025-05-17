# Assistants

## Vue d'ensemble
Les assistants sont au cœur de la plateforme Koli55. Un assistant est un agent IA vocal capable de mener des conversations téléphoniques automatisées avec les utilisateurs. Cette documentation détaille les fonctionnalités, l'intégration et l'utilisation des assistants.

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
- **Fonctions personnalisées** : Exécution d'actions spécifiques
- **Bases de connaissances** : Accès à des informations contextuelles
- **Workflows** : Séquences de conversation prédéfinies

## Flux d'intégration avec Vapi

1. **Création d'un assistant** :
   ```typescript
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
   ```

2. **Récupération d'un assistant** :
   ```typescript
   const response = await assistantsService.getById("assistant_id_here");
   ```

3. **Mise à jour d'un assistant** :
   ```typescript
   const response = await assistantsService.update("assistant_id_here", {
     name: "Nouveau nom",
     firstMessage: "Nouveau message d'accueil"
   });
   ```

4. **Suppression d'un assistant** :
   ```typescript
   const response = await assistantsService.delete("assistant_id_here");
   ```

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
- Associez une base de connaissances pour des réponses contextuelles
- Configurez des fonctions pour des actions personnalisées
- Utilisez des workflows pour des conversations structurées

## Dépannage

### Problèmes courants
- **Assistant non disponible** : Vérifiez le statut dans le dashboard Vapi
- **Réponses incohérentes** : Ajustez le prompt système et la temperature
- **Problèmes de voix** : Vérifiez les crédits du fournisseur de synthèse vocale

### Logs de débogage
Les logs du serveur incluent des informations détaillées avec des préfixes standardisés :
- `[HANDLER]` - Entrée dans un gestionnaire d'endpoint
- `[MAPPING]` - Transformation des données
- `[VAPI_SUCCESS]` - Appel API réussi
- `[VAPI_ERROR]` - Erreur dans l'appel API
