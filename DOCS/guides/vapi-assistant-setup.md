# Guide de configuration et débogage des assistants Vapi

Ce guide explique comment configurer l'environnement pour créer des assistants Vapi depuis l'interface web.

## Configuration requise

1. Un compte Vapi (https://vapi.ai) avec une clé API valide
2. Supabase Edge Functions configurées correctement

## Variables d'environnement

Pour que la création d'assistants fonctionne, vous devez configurer la variable d'environnement `VAPI_API_KEY` dans votre projet Supabase.

### Configuration dans Supabase

1. Connectez-vous à votre dashboard Supabase
2. Allez dans Settings > API
3. Dans la section "Project Settings", sous "Edge Functions"
4. Ajoutez une nouvelle variable nommée `VAPI_API_KEY` et définissez sa valeur avec votre clé API Vapi

## Tests et débogage

### Problèmes courants

1. **Erreur "VAPI_API_KEY is missing"** : Vérifiez que la variable d'environnement est correctement configurée dans Supabase.

2. **Erreur "Failed to create assistant"** : Vérifiez les logs Supabase pour plus de détails. Il pourrait s'agir d'un problème avec l'API Vapi ou avec la structure des données envoyées.

### Tester l'Edge Function localement

Si vous voulez tester l'Edge Function localement avec Supabase CLI:

1. Créez un fichier `.env.local.vapi` contenant:

```
VAPI_API_KEY=votre_cle_vapi_ici
```

2. Lancez la fonction en utilisant:

```bash
cd supabase/functions
supabase functions serve assistants --env-file ../../.env.local.vapi
```

3. Testez l'API avec curl ou Postman:

```bash
curl -X POST http://localhost:54321/functions/v1/assistants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_TOKEN_SUPABASE" \
  -d '{"name":"Test Assistant","model":"gpt-4o","voice":"elevenlabs-rachel","firstMessage":"Bonjour!"}'
```

## Structure de la requête pour créer un assistant

```json
{
  "name": "Nom de l'assistant",
  "model": "gpt-4o",
  "language": "fr-FR",
  "voice": "elevenlabs-rachel",
  "firstMessage": "Bonjour! Comment puis-je vous aider?",
  "instructions": "Vous êtes un assistant virtuel serviable et concis.",
  "silenceTimeoutSeconds": 5,
  "maxDurationSeconds": 300,
  "voiceReflection": true
}
```

## Vérification du flux de données

1. L'interface web envoie les données à l'API Next.js
2. L'API Next.js (via assistantsService.ts) envoie les données à l'Edge Function Supabase
3. L'Edge Function:
   - Crée un enregistrement dans la table `assistants` de Supabase
   - Envoie une requête à l'API Vapi pour créer l'assistant
   - Met à jour l'enregistrement dans la table `assistants` avec l'ID Vapi

Si l'étape avec Vapi échoue, l'assistant sera créé dans la base de données mais sans ID Vapi. Vous pourrez le synchroniser manuellement plus tard. 