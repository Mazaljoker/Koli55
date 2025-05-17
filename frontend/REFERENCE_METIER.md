# REFERENCE METIER

Ce document contient les références techniques pour les différentes entités du projet Koli55.

## Entité Assistant (supabase.functions.invoke('assistants'))

### Payload POST
```json
{
  "name": "string",
  "description": "string",
  "voice": "elevenlabs" | "google" | "...",
  "language": "fr" | "en"
}
```

### Réponse GET
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "voice": "string",
    "language": "string",
    "status": "active" | "inactive"
  }
]
```

⚠️ Auth obligatoire : toutes les routes exigent que l'utilisateur soit connecté (via supabase.auth).

## Entité Workflow (supabase.functions.invoke('workflows'))

### Payload POST
```json
{
  "name": "string",
  "description": "string",
  "assistant_id": "string",
  "config": "object"
}
```

### Réponse GET
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "assistant_id": "string",
    "config": "object",
    "status": "active" | "inactive",
    "created_at": "timestamp"
  }
]
```

⚠️ Auth obligatoire : toutes les routes exigent que l'utilisateur soit connecté (via supabase.auth).

## Entité Call (supabase.functions.invoke('calls'))

### Payload POST
```json
{
  "assistant_id": "string",
  "phone_number_id": "string",
  "workflow_id": "string",
  "customer_number": "string"
}
```

### Réponse GET
```json
[
  {
    "id": "string",
    "assistant_id": "string",
    "phone_number_id": "string",
    "workflow_id": "string",
    "customer_number": "string",
    "status": "in_progress" | "completed" | "failed",
    "started_at": "timestamp",
    "ended_at": "timestamp",
    "duration": "number"
  }
]
```

⚠️ Auth obligatoire : toutes les routes exigent que l'utilisateur soit connecté (via supabase.auth).

## Entité Knowledge Base (supabase.functions.invoke('knowledge-bases'))

### Payload POST
```json
{
  "name": "string",
  "description": "string",
  "type": "text" | "file" | "url",
  "content": "string" | "object"
}
```

### Réponse GET
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "type": "text" | "file" | "url",
    "content": "string" | "object",
    "status": "active" | "inactive",
    "created_at": "timestamp",
    "updated_at": "timestamp"
  }
]
```

⚠️ Auth obligatoire : toutes les routes exigent que l'utilisateur soit connecté (via supabase.auth).

## Entité User (supabase.auth)

### Inscription (auth.signUp)
```json
{
  "email": "string",
  "password": "string",
  "options": {
    "data": {
      "name": "string",
      "organization_id": "string"
    }
  }
}
```

### Connexion (auth.signIn)
```json
{
  "email": "string",
  "password": "string"
}
```

### Réponse User
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "organization_id": "string",
  "role": "admin" | "user",
  "created_at": "timestamp",
  "last_sign_in_at": "timestamp"
}
```

⚠️ Après connexion, un token JWT est automatiquement utilisé pour authentifier les requêtes aux autres fonctions Supabase.

## Entité Message (supabase.functions.invoke('messages'))

### Payload POST
```json
{
  "call_id": "string",
  "content": "string",
  "role": "assistant" | "user" | "system"
}
```

### Réponse GET
```json
[
  {
    "id": "string",
    "call_id": "string",
    "content": "string",
    "role": "assistant" | "user" | "system",
    "created_at": "timestamp"
  }
]
```

⚠️ Auth obligatoire : toutes les routes exigent que l'utilisateur soit connecté (via supabase.auth).

## Entité Phone Number (supabase.functions.invoke('phone-numbers'))

### Payload POST
```json
{
  "number": "string",
  "provider": "twilio" | "other",
  "status": "active" | "inactive"
}
```

### Réponse GET
```json
[
  {
    "id": "string",
    "number": "string",
    "provider": "string",
    "status": "active" | "inactive",
    "created_at": "timestamp"
  }
]
```

⚠️ Auth obligatoire : toutes les routes exigent que l'utilisateur soit connecté (via supabase.auth).

## Entité Organization (supabase.functions.invoke('organization'))

### Payload POST
```json
{
  "name": "string",
  "plan": "free" | "pro" | "enterprise"
}
```

### Réponse GET
```json
[
  {
    "id": "string",
    "name": "string",
    "plan": "free" | "pro" | "enterprise",
    "created_at": "timestamp",
    "owner_id": "string"
  }
]
```

⚠️ Auth obligatoire : toutes les routes exigent que l'utilisateur soit connecté (via supabase.auth).

## Entité Analytics (supabase.functions.invoke('analytics'))

### Payload POST
```json
{
  "event_type": "string",
  "event_data": "object",
  "user_id": "string"
}
```

### Réponse GET
```json
[
  {
    "id": "string",
    "event_type": "string",
    "event_data": "object",
    "user_id": "string",
    "created_at": "timestamp"
  }
]
```

⚠️ Auth obligatoire : toutes les routes exigent que l'utilisateur soit connecté (via supabase.auth).

## Entité Files (supabase.functions.invoke('files'))

### Payload POST
```json
{
  "filename": "string",
  "content_type": "string",
  "size": "number",
  "knowledge_base_id": "string"
}
```

### Réponse GET
```json
[
  {
    "id": "string",
    "filename": "string",
    "content_type": "string",
    "size": "number",
    "knowledge_base_id": "string",
    "status": "processing" | "ready" | "error",
    "created_at": "timestamp"
  }
]
```

⚠️ Auth obligatoire : toutes les routes exigent que l'utilisateur soit connecté (via supabase.auth).

## Entité Webhook (supabase.functions.invoke('webhooks'))

### Payload POST
```json
{
  "url": "string",
  "events": ["string"],
  "secret": "string"
}
```

### Réponse GET
```json
[
  {
    "id": "string",
    "url": "string",
    "events": ["string"],
    "secret": "string",
    "created_at": "timestamp",
    "status": "active" | "inactive"
  }
]
```

⚠️ Auth obligatoire : toutes les routes exigent que l'utilisateur soit connecté (via supabase.auth).

## Entité Squad (supabase.functions.invoke('squads'))

### Payload POST
```json
{
  "name": "string",
  "description": "string",
  "members": ["string"]
}
```

### Réponse GET
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "members": ["string"],
    "created_at": "timestamp"
  }
]
```

⚠️ Auth obligatoire : toutes les routes exigent que l'utilisateur soit connecté (via supabase.auth).

## Entités de Test (supabase.functions.invoke('test-suites'))

### Payload POST Test Suite
```json
{
  "name": "string",
  "description": "string"
}
```

### Réponse GET Test Suite
```json
[
  {
    "id": "string",
    "name": "string",
    "description": "string",
    "created_at": "timestamp"
  }
]
```

### Payload POST Test Suite Test
```json
{
  "test_suite_id": "string",
  "name": "string",
  "description": "string",
  "config": "object"
}
```

### Payload POST Test Suite Run
```json
{
  "test_suite_id": "string"
}
```

⚠️ Auth obligatoire : toutes les routes exigent que l'utilisateur soit connecté (via supabase.auth). 