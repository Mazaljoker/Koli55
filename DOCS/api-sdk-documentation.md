# Documentation API et SDK AlloKoli

## Vue d'ensemble

Ce document présente la documentation complète de l'API AlloKoli et de son SDK TypeScript. L'API AlloKoli permet de gérer des assistants vocaux IA via la plateforme Vapi, avec des fonctionnalités complètes pour les assistants, bases de connaissances, appels et numéros de téléphone.

## Architecture

### API Backend
- **Plateforme** : Edge Functions Supabase Cloud
- **Langage** : TypeScript/Deno
- **Authentification** : JWT Bearer tokens via Supabase Auth
- **Base URL** : `https://{project-id}.supabase.co/functions/v1`

### SDK Frontend
- **Langage** : TypeScript
- **Framework** : Compatible React/Next.js
- **Gestion d'état** : Hooks React personnalisés
- **Validation** : Types TypeScript stricts

## Spécification OpenAPI

### Localisation
- **Fichier principal** : `specs/allokoli-api.yaml`
- **Catalogue MCP** : `specs/_catalog/catalog.json`
- **Version** : OpenAPI 3.1.0

### Endpoints principaux

#### Assistants
- `GET /assistants` - Liste paginée des assistants
- `POST /assistants` - Création d'un nouvel assistant
- `GET /assistants/{id}` - Récupération d'un assistant
- `PATCH /assistants/{id}` - Mise à jour d'un assistant
- `DELETE /assistants/{id}` - Suppression d'un assistant

#### Bases de Connaissances
- `GET /knowledge-bases` - Liste paginée des bases de connaissances
- `POST /knowledge-bases` - Création d'une nouvelle base
- `GET /knowledge-bases/{id}` - Récupération d'une base
- `PATCH /knowledge-bases/{id}` - Mise à jour d'une base
- `DELETE /knowledge-bases/{id}` - Suppression d'une base
- `POST /knowledge-bases/{id}/query` - Interrogation sémantique
- `POST /knowledge-bases/{id}/files` - Ajout de fichier
- `DELETE /knowledge-bases/{id}/files/{fileId}` - Suppression de fichier

## SDK TypeScript

### Localisation
- **Fichier principal** : `frontend/lib/api/allokoli-sdk.ts`
- **Documentation** : `frontend/lib/api/README.md`
- **Hooks** : `frontend/lib/hooks/useAlloKoliSDK.ts`
- **Exemples** : `frontend/lib/api/examples/`

### Classes principales

#### `AlloKoliSDK`
Client principal pour interagir avec l'API AlloKoli.

```typescript
import { AlloKoliSDK } from '@/lib/api/allokoli-sdk';

const sdk = new AlloKoliSDK({
  baseUrl: 'https://project-id.supabase.co/functions/v1',
  authToken: 'jwt-token',
  timeout: 30000
});
```

#### `AlloKoliAPIError`
Classe d'erreur personnalisée pour les erreurs API.

```typescript
try {
  await sdk.getAssistant('invalid-id');
} catch (error) {
  if (error instanceof AlloKoliAPIError) {
    console.log(error.status, error.message, error.details);
  }
}
```

### Factory Functions

#### `createAlloKoliSDKWithSupabase`
Factory recommandée pour créer une instance SDK avec Supabase.

```typescript
import { createAlloKoliSDKWithSupabase } from '@/lib/api/allokoli-sdk';

const sdk = createAlloKoliSDKWithSupabase('project-id', 'auth-token');
```

### Hooks React

#### `useAlloKoliSDK`
Hook principal pour utiliser le SDK dans les composants React.

```typescript
import { useAlloKoliSDK } from '@/lib/hooks/useAlloKoliSDK';

function MyComponent() {
  const sdk = useAlloKoliSDK(authToken);
  // Utiliser le SDK...
}
```

#### `useAlloKoliSDKWithAuth`
Hook avec gestion automatique de l'authentification Supabase.

```typescript
import { useAlloKoliSDKWithAuth } from '@/lib/hooks/useAlloKoliSDK';

function MyComponent() {
  const sdk = useAlloKoliSDKWithAuth();
  // Le token est géré automatiquement
}
```

## Types TypeScript

### Types principaux

#### `Assistant`
```typescript
interface Assistant {
  id: string;
  name: string;
  model: VapiModel;
  voice: VapiVoice;
  language?: string;
  firstMessage?: string;
  instructions?: string;
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
  recordingSettings?: RecordingSettings;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}
```

#### `VapiModel`
```typescript
type VapiModel = string | {
  provider: 'openai' | 'anthropic' | 'groq' | 'azure-openai';
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
};
```

#### `VapiVoice`
```typescript
type VapiVoice = string | {
  provider: 'azure' | 'eleven-labs' | 'playht' | 'deepgram' | 'openai';
  voiceId: string;
  speed?: number;
  stability?: number;
};
```

#### `KnowledgeBase`
```typescript
interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  model?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  files?: KnowledgeBaseFile[];
  created_at: string;
  updated_at: string;
}
```

### Types de réponse

#### `PaginatedResponse<T>`
```typescript
interface PaginatedResponse<T> extends SuccessResponse {
  data: T[];
  pagination: PaginationMeta;
}
```

#### `SingleResponse<T>`
```typescript
interface SingleResponse<T> extends SuccessResponse {
  data: T;
}
```

## Exemples d'utilisation

### Gestion des assistants

```typescript
// Lister les assistants
const assistants = await sdk.listAssistants({ page: 1, limit: 20 });

// Créer un assistant
const newAssistant = await sdk.createAssistant({
  name: 'Mon Assistant',
  model: { provider: 'openai', model: 'gpt-4' },
  voice: { provider: 'eleven-labs', voiceId: 'voice-id' },
  language: 'fr'
});

// Mettre à jour un assistant
await sdk.updateAssistant('assistant-id', {
  name: 'Nouveau nom'
});

// Supprimer un assistant
await sdk.deleteAssistant('assistant-id');
```

### Gestion des bases de connaissances

```typescript
// Créer une base de connaissances
const kb = await sdk.createKnowledgeBase({
  name: 'Ma Base de Connaissances',
  description: 'Description'
});

// Interroger une base de connaissances
const results = await sdk.queryKnowledgeBase('kb-id', {
  query: 'Comment configurer un assistant ?',
  top_k: 5,
  similarity_threshold: 0.7
});

// Ajouter un fichier
await sdk.addFileToKnowledgeBase('kb-id', 'file-id');
```

## Gestion des erreurs

### Types d'erreurs
- **401** : Token JWT manquant ou invalide
- **404** : Ressource non trouvée
- **400** : Données de validation invalides
- **500** : Erreur serveur interne

### Exemple de gestion
```typescript
try {
  const assistant = await sdk.getAssistant('id');
} catch (error) {
  if (error instanceof AlloKoliAPIError) {
    switch (error.status) {
      case 401:
        // Rediriger vers la connexion
        break;
      case 404:
        // Afficher message "non trouvé"
        break;
      case 400:
        // Afficher erreurs de validation
        console.log(error.details);
        break;
    }
  }
}
```

## Configuration

### Variables d'environnement
```env
NEXT_PUBLIC_SUPABASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Configuration Supabase
```typescript
// supabase/config.ts
export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  projectId: process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!
};
```

## Intégration MCP OpenAPI

### Catalogue
Le catalogue MCP OpenAPI est configuré dans `specs/_catalog/catalog.json` et permet :
- Découverte automatique des endpoints
- Génération de documentation
- Validation des schémas
- Tests automatisés

### Utilisation MCP
```typescript
// Rechercher des opérations
const operations = await mcp.searchOperations('assistant');

// Charger un schéma
const schema = await mcp.loadSchema('allokoli-api.yaml', 'Assistant');

// Charger une opération
const operation = await mcp.loadOperation('allokoli-api.yaml', 'listAssistants');
```

## Tests et validation

### Validation des types
Le SDK utilise TypeScript strict pour la validation des types à la compilation.

### Validation runtime
Les helpers de validation sont disponibles :
```typescript
import { isValidUUID, isValidPhoneNumber } from '@/lib/api/allokoli-sdk';

if (isValidUUID(id)) {
  // ID valide
}

if (isValidPhoneNumber('+33123456789')) {
  // Numéro valide
}
```

### Health check
```typescript
const health = await sdk.healthCheck();
console.log(health.status); // 'healthy' ou 'unhealthy'
```

## Bonnes pratiques

1. **Authentification** : Toujours vérifier et mettre à jour les tokens
2. **Gestion d'erreurs** : Encapsuler tous les appels dans try-catch
3. **Pagination** : Utiliser la pagination pour les grandes listes
4. **Types** : Utiliser les types TypeScript fournis
5. **Performance** : Utiliser les hooks React pour la mise en cache
6. **Sécurité** : Ne jamais exposer les tokens côté client

## Maintenance

### Mise à jour de l'API
1. Modifier `specs/allokoli-api.yaml`
2. Rafraîchir le catalogue MCP
3. Mettre à jour le SDK si nécessaire
4. Tester les changements

### Mise à jour du SDK
1. Modifier `frontend/lib/api/allokoli-sdk.ts`
2. Mettre à jour les types si nécessaire
3. Tester avec les composants existants
4. Mettre à jour la documentation

## Support

Pour toute question ou problème :
- Consulter la documentation dans `frontend/lib/api/README.md`
- Voir les exemples dans `frontend/lib/api/examples/`
- Vérifier les types dans le SDK
- Utiliser les outils de développement du navigateur pour déboguer

# SDK Client AlloKoli v2.0

Ce document décrit comment utiliser le SDK client TypeScript pour interagir avec l'API AlloKoli.

## Introduction

Le SDK AlloKoli permet d'interagir facilement avec l'API AlloKoli depuis une application frontend TypeScript/JavaScript. Il fournit des méthodes typées pour tous les endpoints disponibles dans l'API, avec une gestion intégrée de l'authentification via Supabase.

## Installation

Le SDK est intégré au projet et ne nécessite pas d'installation séparée. Il est disponible dans le dossier `frontend/lib/api/allokoli-sdk.ts`.

## Utilisation de base

### Création d'une instance du SDK

```typescript
import { createAlloKoliSDK, createAlloKoliSDKWithSupabase } from 'lib/api/allokoli-sdk';

// Méthode 1: Configuration manuelle
const sdk = createAlloKoliSDK({
  baseUrl: 'https://aiurboizarbbcpynmmgv.supabase.co/functions/v1',
  authToken: 'votre-token-jwt',
  timeout: 30000, // optionnel, valeur par défaut
});

// Méthode 2: Configuration avec Supabase
const sdk = createAlloKoliSDKWithSupabase(
  'aiurboizarbbcpynmmgv', // Project ID Supabase
  'votre-token-jwt' // optionnel
);
```

### Utilisation avec React Hooks

Pour une intégration facile avec React, utilisez les hooks fournis:

```typescript
import { useAlloKoliSDK, useAlloKoliSDKWithAuth } from 'lib/hooks/useAlloKoliSDK';

// Hook 1: Avec token manuel
const MyComponent = ({ token }) => {
  const sdk = useAlloKoliSDK(token);
  
  // Utilisation du SDK...
};

// Hook 2: Avec authentification automatique via Supabase
const MyAuthComponent = () => {
  const sdk = useAlloKoliSDKWithAuth();
  
  // Utilisation du SDK...
};
```

## Fonctionnalités principales

### Gestion des assistants

```typescript
// Lister les assistants avec pagination
const { data: assistants, pagination } = await sdk.listAssistants({ page: 1, limit: 20 });

// Récupérer un assistant par ID
const { data: assistant } = await sdk.getAssistant('550e8400-e29b-41d4-a716-446655440000');

// Créer un assistant
const { data: newAssistant } = await sdk.createAssistant({
  name: 'Nouvel Assistant',
  model: 'gpt-4o', // ou objet VapiModel pour plus d'options
  voice: 'elevenlabs-voice-id', // ou objet VapiVoice pour plus d'options
  firstMessage: 'Bonjour ! Comment puis-je vous aider aujourd'hui ?'
});

// Mettre à jour un assistant
const { data: updatedAssistant } = await sdk.updateAssistant('550e8400-e29b-41d4-a716-446655440000', {
  name: 'Assistant Modifié',
  firstMessage: 'Message d'accueil mis à jour'
});

// Supprimer un assistant
const { success } = await sdk.deleteAssistant('550e8400-e29b-41d4-a716-446655440000');
```

### Gestion des bases de connaissances

```typescript
// Lister les bases de connaissances
const { data: knowledgeBases, pagination } = await sdk.listKnowledgeBases({ page: 1, limit: 20 });

// Récupérer une base de connaissances par ID
const { data: knowledgeBase } = await sdk.getKnowledgeBase('550e8400-e29b-41d4-a716-446655440001');

// Créer une base de connaissances
const { data: newKnowledgeBase } = await sdk.createKnowledgeBase({
  name: 'Nouvelle Base de Connaissances',
  description: 'Description de la base de connaissances'
});

// Mettre à jour une base de connaissances
const { data: updatedKnowledgeBase } = await sdk.updateKnowledgeBase('550e8400-e29b-41d4-a716-446655440001', {
  name: 'Base Mise à Jour',
  description: 'Description mise à jour'
});

// Supprimer une base de connaissances
const { success } = await sdk.deleteKnowledgeBase('550e8400-e29b-41d4-a716-446655440001');

// Interroger une base de connaissances
const { data: queryResult } = await sdk.queryKnowledgeBase('550e8400-e29b-41d4-a716-446655440001', {
  query: 'Comment configurer un assistant ?',
  limit: 5
});
```

### Vérification de l'état du système

```typescript
// Vérifier l'état du système
const health = await sdk.healthCheck();
console.log(`Statut système: ${health.system_status.database}`);
```

## Gestion des erreurs

Le SDK utilise une classe d'erreur personnalisée `AlloKoliAPIError` qui capture les détails des erreurs renvoyées par l'API.

```typescript
try {
  const { data } = await sdk.getAssistant('id-inexistant');
} catch (error) {
  if (error instanceof AlloKoliAPIError) {
    console.error(`Erreur ${error.status}: ${error.message}`);
    console.error('Code:', error.code);
    console.error('Détails:', error.details);
  }
}
```

## Types de données

Le SDK fournit des interfaces TypeScript pour tous les objets manipulés par l'API:

- `Assistant`: Représentation complète d'un assistant
- `AssistantCreate`: Données pour créer un assistant
- `AssistantUpdate`: Données pour mettre à jour un assistant
- `KnowledgeBase`: Représentation complète d'une base de connaissances
- `KnowledgeBaseCreate`: Données pour créer une base de connaissances
- `KnowledgeBaseUpdate`: Données pour mettre à jour une base de connaissances
- `VapiModel`: Configuration du modèle d'IA (simple string ou objet détaillé)
- `VapiVoice`: Configuration de la voix (simple string ou objet détaillé)

## Mise à jour du SDK

Le SDK est généré à partir de la spécification OpenAPI de l'API AlloKoli. Pour mettre à jour le SDK après une modification de l'API:

```bash
npm run update-api
```

Ce script utilise le fichier `specs/allokoli-api-complete-final.yaml` pour régénérer le SDK client.

## Changelog

### v2.0.0
- Support complet de la spécification API v2.0.0
- Mise à jour des types et des interfaces pour correspondre à la nouvelle API
- Amélioration de la gestion des erreurs
- Support amélioré des modèles et voix Vapi
- Simplification des signatures de méthodes

### v1.0.0
- Version initiale du SDK 