# Référence des paramètres Vapi pour les assistants

Ce document fournit une référence complète des paramètres disponibles pour la création et mise à jour d'assistants via l'API Vapi. Utilisez-le comme guide lors de l'implémentation d'assistants dans le projet Koli55.

## Structure complète d'un assistant Vapi

```json
{
  "id": "id",
  "orgId": "orgId",
  "createdAt": "2024-01-15T09:30:00Z",
  "updatedAt": "2024-01-15T09:30:00Z",
  "name": "name",
  
  "transcriber": {
    "provider": "assembly-ai",
    "confidenceThreshold": 0.4,
    "disablePartialTranscripts": true,
    "endUtteranceSilenceThreshold": 1.1,
    "fallbackPlan": {
      "transcribers": [
        {
          "provider": "assembly-ai",
          "confidenceThreshold": 0.4
        }
      ]
    },
    "language": "en",
    "realtimeUrl": "realtimeUrl",
    "wordBoost": ["wordBoost"]
  },
  
  "model": {
    "provider": "anyscale",
    "model": "model",
    "emotionRecognitionEnabled": true,
    "knowledgeBase": {
      "server": {
        "url": "url",
        "timeoutSeconds": 20,
        "backoffPlan": {
          "maxRetries": 0,
          "type": { "key": "value" },
          "baseDelaySeconds": 1
        }
      }
    },
    "knowledgeBaseId": "knowledgeBaseId",
    "maxTokens": 1.1,
    "messages": [
      { "role": "assistant" }
    ],
    "numFastTurns": 1.1,
    "temperature": 1.1,
    "toolIds": ["toolIds"],
    "tools": [
      {
        "type": "dtmf",
        "async": false
      }
    ]
  },
  
  "voice": {
    "provider": "azure",
    "voiceId": "andrew",
    "cachingEnabled": true,
    "chunkPlan": {
      "enabled": true,
      "minCharacters": 30,
      "punctuationBoundaries": ["。", "，", ".", "!", "?", ";", "،", "۔", "।", "॥", "|", "||", ",", ":"],
      "formatPlan": {
        "enabled": true,
        "numberToDigitsCutoff": 2025
      }
    },
    "fallbackPlan": {
      "voices": [
        {
          "provider": "azure",
          "voiceId": "andrew",
          "cachingEnabled": true
        }
      ]
    },
    "speed": 1.1
  },
  
  "firstMessage": "Hello! How can I help you today?",
  "firstMessageInterruptionsEnabled": true,
  "firstMessageMode": "assistant-speaks-first",
  
  "voicemailDetection": {
    "provider": "google",
    "backoffPlan": {
      "startAtSeconds": 1.1,
      "frequencySeconds": 1.1,
      "maxRetries": 1.1
    },
    "beepMaxAwaitSeconds": 1.1
  },
  
  "clientMessages": [
    "conversation-update", "function-call", "hang", "model-output",
    "speech-update", "status-update", "transfer-update", "transcript",
    "tool-calls", "user-interrupted", "voice-input", "workflow.node.started"
  ],
  
  "serverMessages": [
    "conversation-update", "end-of-call-report", "function-call", "hang",
    "speech-update", "status-update", "tool-calls", "transfer-destination-request",
    "user-interrupted"
  ],
  
  "silenceTimeoutSeconds": 30,
  "maxDurationSeconds": 600,
  "backgroundSound": "off",
  "backgroundDenoisingEnabled": false,
  "modelOutputInMessagesEnabled": false,
  
  "transportConfigurations": [
    {
      "provider": "twilio",
      "timeout": 60,
      "record": false,
      "recordingChannels": "mono"
    }
  ],
  
  "observabilityPlan": {
    "provider": "langfuse",
    "tags": ["tags"],
    "metadata": { "key": "value" }
  },
  
  "credentials": [
    {
      "provider": "11labs",
      "apiKey": "apiKey",
      "name": "name"
    }
  ],
  
  "hooks": [
    {
      "on": "call.ending",
      "do": [{ "type": "transfer" }],
      "filters": [
        {
          "type": "oneOf",
          "key": "key",
          "oneOf": ["oneOf"]
        }
      ]
    }
  ],
  
  "voicemailMessage": "voicemailMessage",
  "endCallMessage": "endCallMessage",
  "endCallPhrases": ["endCallPhrases"],
  
  "compliancePlan": {
    "hipaaEnabled": true,
    "pciEnabled": true
  },
  
  "metadata": { "key": "value" },
  
  "analysisPlan": {
    "summaryPlan": {
      "messages": [{ "key": "value" }],
      "enabled": true,
      "timeoutSeconds": 1.1
    },
    "structuredDataPlan": {
      "messages": [{ "key": "value" }],
      "enabled": true,
      "schema": { "type": "string" },
      "timeoutSeconds": 1.1
    },
    "structuredDataMultiPlan": [
      {
        "key": "key",
        "plan": {}
      }
    ],
    "successEvaluationPlan": {
      "rubric": "NumericScale",
      "messages": [{ "key": "value" }],
      "enabled": true,
      "timeoutSeconds": 1.1
    }
  },
  
  "artifactPlan": {
    "recordingEnabled": true,
    "recordingFormat": "wav;l16",
    "videoRecordingEnabled": false,
    "pcapEnabled": true,
    "pcapS3PathPrefix": "/pcaps",
    "transcriptPlan": {
      "enabled": true,
      "assistantName": "assistantName",
      "userName": "userName"
    },
    "recordingPath": "recordingPath"
  },
  
  "messagePlan": {
    "idleMessages": ["idleMessages"],
    "idleMessageMaxSpokenCount": 1.1,
    "idleMessageResetCountOnUserSpeechEnabled": true,
    "idleTimeoutSeconds": 1.1,
    "silenceTimeoutMessage": "silenceTimeoutMessage"
  },
  
  "startSpeakingPlan": {
    "waitSeconds": 0.4,
    "smartEndpointingPlan": {
      "provider": "vapi"
    },
    "customEndpointingRules": [
      {
        "type": "assistant",
        "regex": "regex",
        "timeoutSeconds": 1.1
      }
    ],
    "transcriptionEndpointingPlan": {
      "onPunctuationSeconds": 0.1,
      "onNoPunctuationSeconds": 1.5,
      "onNumberSeconds": 0.5
    },
    "smartEndpointingEnabled": true
  },
  
  "stopSpeakingPlan": {
    "numWords": 0,
    "voiceSeconds": 0.2,
    "backoffSeconds": 1,
    "acknowledgementPhrases": [
      "i understand", "i see", "i got it", "i hear you", "im listening",
      "im with you", "right", "okay", "ok", "sure", "alright",
      "got it", "understood", "yeah", "yes", "uh-huh", "mm-hmm",
      "gotcha", "mhmm", "ah", "yeah okay", "yeah sure"
    ],
    "interruptionPhrases": [
      "stop", "shut", "up", "enough", "quiet", "silence", "but", "dont",
      "not", "no", "hold", "wait", "cut", "pause", "nope", "nah",
      "nevermind", "never", "bad", "actually"
    ]
  },
  
  "monitorPlan": {
    "listenEnabled": false,
    "controlEnabled": false
  },
  
  "credentialIds": ["credentialIds"],
  
  "server": {
    "url": "url",
    "timeoutSeconds": 20,
    "secret": "secret",
    "headers": { "key": "value" },
    "backoffPlan": {
      "maxRetries": 0,
      "type": { "key": "value" },
      "baseDelaySeconds": 1
    }
  },
  
  "keypadInputPlan": {
    "enabled": true,
    "timeoutSeconds": 1.1,
    "delimiters": "#"
  }
}
```

## Configuration minimale fonctionnelle

Pour créer un assistant fonctionnel, voici la configuration minimale requise :

```json
{
  "name": "Assistant Test",
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "Tu es un assistant francophone serviable."
      }
    ]
  },
  "voice": {
    "provider": "azure",
    "voiceId": "fr-FR-DeniseNeural"
  },
  "firstMessage": "Bonjour, comment puis-je vous aider aujourd'hui?"
}
```

## Points importants à noter

1. **Providers de voix**:
   - Pour ElevenLabs, utiliser `11labs` (pas `elevenlabs`)
   - Les voix Azure fonctionnent bien (ex: `fr-FR-DeniseNeural`, `en-US-JennyNeural`)

2. **Ordre de complexité recommandé**:
   - Commencer par la configuration minimale
   - Ajouter progressivement les fonctionnalités avancées
   - Tester chaque nouvel ajout séparément

3. **Paramètres à éviter initialement**:
   - Les plans avancés complexes comme `startSpeakingPlan` et `stopSpeakingPlan`
   - Les configurations de transcripteur personnalisées 
   - Les configurations de reconnaissance d'émotions

4. **Paramètres stables**:
   - `firstMessage`
   - Configuration de base du modèle
   - Configuration de base de la voix
   - Paramètres de timeout basiques

## Exemples de configurations pour cas d'usage spécifiques

### Assistant français avec reconnaissance d'instructions d'interruption

```json
{
  "name": "Assistant Français Interruptible",
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "Tu es un assistant francophone serviable qui répond de façon concise."
      }
    ]
  },
  "voice": {
    "provider": "azure",
    "voiceId": "fr-FR-DeniseNeural"
  },
  "firstMessage": "Bonjour, comment puis-je vous aider aujourd'hui?",
  "stopSpeakingPlan": {
    "interruptionPhrases": [
      "stop", "attends", "excuse-moi", "un instant", "s'il te plaît"
    ]
  }
}
```

### Assistant avec messages d'inactivité

```json
{
  "name": "Assistant avec rappels d'inactivité",
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "Tu es un assistant serviable et patient."
      }
    ]
  },
  "voice": {
    "provider": "azure",
    "voiceId": "fr-FR-DeniseNeural"
  },
  "firstMessage": "Bonjour, comment puis-je vous aider aujourd'hui?",
  "messagePlan": {
    "idleMessages": [
      "Êtes-vous toujours là?",
      "Avez-vous besoin d'aide supplémentaire?",
      "N'hésitez pas à me poser une question si vous avez besoin d'aide."
    ],
    "idleTimeoutSeconds": 15
  }
}
``` 