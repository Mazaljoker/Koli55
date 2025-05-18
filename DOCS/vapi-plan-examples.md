# Exemples de plans Vapi validés

Ce document contient des exemples pratiques de configurations d'assistants Vapi qui ont été testées et validées. Utilisez ces exemples comme point de départ pour vos propres configurations.

## Configurations de base

### Assistant minimal fonctionnel

```json
{
  "name": "Assistant Minimal",
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

### Assistant avec voix ElevenLabs

```json
{
  "name": "Assistant ElevenLabs",
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
    "provider": "11labs",
    "voiceId": "21m00Tcm4TlvDq8ikWAM",
    "speed": 1.0
  },
  "firstMessage": "Bonjour, comment puis-je vous aider aujourd'hui?"
}
```

## Plans avancés validés

### stopSpeakingPlan - Plan d'interruption

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

**Utilisation avec create-vapi-assistant.ps1**:

```powershell
./create-vapi-assistant.ps1 -Name "Assistant Interruptible" `
  -StopSpeakingPlan "{`"interruptionPhrases`":[`"stop`",`"attends`",`"excuse-moi`"]}" `
  -DeleteAfterTest
```

### messagePlan - Plan de messages d'inactivité

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

**Utilisation avec create-vapi-assistant.ps1**:

```powershell
./create-vapi-assistant.ps1 -Name "Assistant Proactif" `
  -MessagePlan "{`"idleMessages`":[`"Êtes-vous toujours là?`"], `"idleTimeoutSeconds`": 15}" `
  -DeleteAfterTest
```

## Configurations recommandées mais non testées

### startSpeakingPlan - Plan de prise de parole

```json
{
  "startSpeakingPlan": {
    "confidenceThreshold": 0.7,
    "delayMs": 500,
    "preferContentCompletion": true
  }
}
```

### analysisPlan - Plan d'analyse

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

### artifactPlan - Plan d'artefacts

```json
{
  "artifactPlan": {
    "recordingEnabled": true,
    "transcriptEnabled": true,
    "callReportEnabled": true,
    "summaryEnabled": true
  }
}
```

### monitorPlan - Plan de supervision

```json
{
  "monitorPlan": {
    "listenEnabled": true,
    "controlEnabled": true
  }
}
```

### voicemailDetection - Détection de messagerie vocale

```json
{
  "voicemailDetection": {
    "provider": "google",
    "backoffPlan": {
      "startAtSeconds": 2,
      "frequencySeconds": 1,
      "maxRetries": 3
    }
  }
}
```

## Assistant complet (combinaison des plans validés)

```json
{
  "name": "Assistant Complet",
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "Tu es un assistant francophone professionnel et serviable."
      }
    ]
  },
  "voice": {
    "provider": "azure",
    "voiceId": "fr-FR-DeniseNeural"
  },
  "firstMessage": "Bonjour, je suis votre assistant. Comment puis-je vous aider aujourd'hui?",
  "stopSpeakingPlan": {
    "interruptionPhrases": ["stop", "attends", "excuse-moi", "un instant"]
  },
  "messagePlan": {
    "idleMessages": ["Êtes-vous toujours là?", "Avez-vous besoin d'aide supplémentaire?"],
    "idleTimeoutSeconds": 15
  }
}
```

## Plans avancés complexes (modèles de référence)

Ces exemples représentent les structures complètes des plans avancés selon la documentation Vapi. Ils peuvent nécessiter des ajustements pour fonctionner correctement dans votre environnement.

### stopSpeakingPlan complet

```json
{
  "stopSpeakingPlan": {
    "numWords": 0,
    "voiceSeconds": 0.2,
    "backoffSeconds": 1,
    "acknowledgementPhrases": [
      "je comprends", "je vois", "j'ai compris", "je vous écoute",
      "je suis avec vous", "d'accord", "ok", "bien sûr", "entendu"
    ],
    "interruptionPhrases": [
      "stop", "arrêtez", "silence", "mais", "non", "attendez", 
      "pause", "excusez-moi", "pardon", "un instant"
    ]
  }
}
```

### startSpeakingPlan complet

```json
{
  "startSpeakingPlan": {
    "waitSeconds": 0.4,
    "smartEndpointingPlan": {
      "provider": "vapi"
    },
    "customEndpointingRules": [
      {
        "type": "assistant",
        "regex": "question\\?",
        "timeoutSeconds": 1.1
      }
    ],
    "transcriptionEndpointingPlan": {
      "onPunctuationSeconds": 0.1,
      "onNoPunctuationSeconds": 1.5,
      "onNumberSeconds": 0.5
    },
    "smartEndpointingEnabled": true
  }
}
```

### messagePlan complet

```json
{
  "messagePlan": {
    "idleMessages": [
      "Êtes-vous toujours là?",
      "Avez-vous besoin d'aide supplémentaire?",
      "Je suis toujours à l'écoute si vous avez d'autres questions."
    ],
    "idleMessageMaxSpokenCount": 3,
    "idleMessageResetCountOnUserSpeechEnabled": true,
    "idleTimeoutSeconds": 15,
    "silenceTimeoutMessage": "Je vais terminer cet appel puisque je n'entends plus rien. N'hésitez pas à rappeler si vous avez d'autres questions."
  }
}
```

### analysisPlan complet

```json
{
  "analysisPlan": {
    "summaryPlan": {
      "messages": [
        {
          "role": "system",
          "content": "Résumez cette conversation de manière concise."
        }
      ],
      "enabled": true,
      "timeoutSeconds": 10
    },
    "structuredDataPlan": {
      "messages": [
        {
          "role": "system",
          "content": "Extrayez les informations importantes de cette conversation."
        }
      ],
      "enabled": true,
      "schema": {
        "type": "object",
        "properties": {
          "name": {"type": "string"},
          "email": {"type": "string"},
          "intent": {"type": "string"}
        }
      },
      "timeoutSeconds": 10
    },
    "successEvaluationPlan": {
      "rubric": "NumericScale",
      "messages": [
        {
          "role": "system",
          "content": "Évaluez le succès de cette conversation sur une échelle de 1 à 10."
        }
      ],
      "enabled": true,
      "timeoutSeconds": 10
    }
  }
}
```

### artifactPlan complet

```json
{
  "artifactPlan": {
    "recordingEnabled": true,
    "recordingFormat": "wav;l16",
    "videoRecordingEnabled": false,
    "pcapEnabled": true,
    "pcapS3PathPrefix": "/pcaps",
    "transcriptPlan": {
      "enabled": true,
      "assistantName": "Assistant",
      "userName": "Client"
    },
    "recordingPath": "recordings/"
  }
}
```

### voicemailDetection complet

```json
{
  "voicemailDetection": {
    "provider": "google",
    "backoffPlan": {
      "startAtSeconds": 1.1,
      "frequencySeconds": 1.1,
      "maxRetries": 3
    },
    "beepMaxAwaitSeconds": 2.0
  }
}
```

### transcriber complet

```json
{
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
    "language": "fr",
    "realtimeUrl": "realtimeUrl",
    "wordBoost": [
      "bonjour", "merci", "au revoir"
    ]
  }
}
```

### voice complet (avec chunking et fallback)

```json
{
  "voice": {
    "provider": "azure",
    "voiceId": "fr-FR-DeniseNeural",
    "cachingEnabled": true,
    "chunkPlan": {
      "enabled": true,
      "minCharacters": 30,
      "punctuationBoundaries": [
        "。", "，", ".", "!", "?", ";", "،", "۔", "।", "॥", "|", "||", ",", ":"
      ],
      "formatPlan": {
        "enabled": true,
        "numberToDigitsCutoff": 2025
      }
    },
    "fallbackPlan": {
      "voices": [
        {
          "provider": "11labs",
          "voiceId": "21m00Tcm4TlvDq8ikWAM",
          "cachingEnabled": true
        }
      ]
    },
    "speed": 1.1
  }
}
```

## Configuration complète de référence

Cette configuration complète peut être utilisée comme référence, mais n'est pas recommandée telle quelle car elle contient des paramètres qui peuvent causer des erreurs 400 Bad Request.

```json
{
  "name": "Assistant Complet Avancé",
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "emotionRecognitionEnabled": true,
    "maxTokens": 2048,
    "messages": [
      {
        "role": "system",
        "content": "Tu es un assistant francophone professionnel et serviable."
      }
    ],
    "temperature": 0.7
  },
  "voice": {
    "provider": "azure",
    "voiceId": "fr-FR-DeniseNeural",
    "cachingEnabled": true,
    "speed": 1.0
  },
  "firstMessage": "Bonjour, je suis votre assistant. Comment puis-je vous aider aujourd'hui?",
  "firstMessageInterruptionsEnabled": true,
  "firstMessageMode": "assistant-speaks-first",
  "stopSpeakingPlan": {
    "interruptionPhrases": ["stop", "attends", "excuse-moi", "un instant"]
  },
  "messagePlan": {
    "idleMessages": ["Êtes-vous toujours là?", "Avez-vous besoin d'aide supplémentaire?"],
    "idleTimeoutSeconds": 15
  },
  "transcriber": {
    "provider": "assembly-ai",
    "language": "fr"
  }
}
```

## Configuration hautement fiable

Cette configuration a été testée et validée comme étant très fiable. Elle utilise uniquement les fonctionnalités qui ont été confirmées comme fonctionnant parfaitement dans l'API Vapi. Nous recommandons de l'utiliser comme base pour tous les nouveaux assistants.

```json
{
  "name": "Assistant Fiable",
  "model": {
    "provider": "openai",
    "model": "gpt-4o",
    "messages": [
      {
        "role": "system",
        "content": "Tu es un assistant francophone professionnel, serviable et concis. Tu dois répondre de façon claire et directe, en évitant les longueurs inutiles."
      }
    ],
    "temperature": 0.7
  },
  "voice": {
    "provider": "azure",
    "voiceId": "fr-FR-DeniseNeural"
  },
  "firstMessage": "Bonjour, je suis votre assistant. Comment puis-je vous aider aujourd'hui?",
  "firstMessageMode": "assistant-speaks-first",
  "stopSpeakingPlan": {
    "interruptionPhrases": [
      "stop", "attends", "excuse-moi", "un instant", "pause", 
      "laisse-moi parler", "j'ai une question", "je comprends"
    ]
  },
  "messagePlan": {
    "idleMessages": [
      "Êtes-vous toujours là?", 
      "Avez-vous besoin d'aide supplémentaire?",
      "Je suis à votre écoute si vous avez d'autres questions."
    ],
    "idleTimeoutSeconds": 20
  }
}
```

**Utilisation avec create-vapi-assistant.ps1:**

```powershell
./create-vapi-assistant.ps1 -Name "Assistant Fiable Production" `
  -SystemPrompt "Tu es un assistant francophone professionnel, serviable et concis. Tu dois répondre de façon claire et directe." `
  -Voice "azure-fr-FR-DeniseNeural" `
  -FirstMessage "Bonjour, je suis votre assistant. Comment puis-je vous aider aujourd'hui?" `
  -FirstMessageMode "assistant-speaks-first" `
  -StopSpeakingPlan "{`"interruptionPhrases`":[`"stop`", `"attends`", `"excuse-moi`", `"un instant`"]}" `
  -MessagePlan "{`"idleMessages`":[`"Êtes-vous toujours là?`", `"Avez-vous besoin d'aide?`"], `"idleTimeoutSeconds`": 20}"
```

## Combinaisons à éviter

Nos tests ont montré que les paramètres suivants peuvent générer des erreurs 400 Bad Request :

1. SilenceTimeoutSeconds
2. MaxDurationSeconds
3. EndCallAfterSilence
4. Transcriber complexe
5. Voice avec chunkPlan ou fallbackPlan 
6. ArtifactPlan complexe

Il est recommandé d'éviter ces paramètres ou de les tester individuellement et avec précaution. 