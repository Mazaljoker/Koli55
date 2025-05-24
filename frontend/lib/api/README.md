# SDK AlloKoli - Documentation

Le SDK AlloKoli est un client TypeScript pour interagir avec l'API AlloKoli. Il fournit une interface typée et facile à utiliser pour gérer les assistants vocaux IA, les bases de connaissances et autres ressources de la plateforme.

## Installation

Le SDK est inclus dans le projet frontend. Importez-le simplement :

```typescript
import { AlloKoliSDK, createAlloKoliSDKWithSupabase } from '@/lib/api/allokoli-sdk';
```

## Configuration

### Configuration basique

```typescript
import { AlloKoliSDK } from '@/lib/api/allokoli-sdk';

const sdk = new AlloKoliSDK({
  baseUrl: 'https://your-project-id.supabase.co/functions/v1',
  authToken: 'your-jwt-token',
  timeout: 30000, // optionnel, 30s par défaut
  headers: { // optionnel
    'X-Custom-Header': 'value'
  }
});
```

### Configuration avec Supabase (recommandée)

```typescript
import { createAlloKoliSDKWithSupabase } from '@/lib/api/allokoli-sdk';

const sdk = createAlloKoliSDKWithSupabase(
  'your-project-id',
  'your-jwt-token' // optionnel, peut être défini plus tard
);

// Mettre à jour le token plus tard
sdk.setAuthToken('new-jwt-token');
```

## Utilisation

### Gestion des Assistants

#### Lister les assistants

```typescript
try {
  const response = await sdk.listAssistants({
    page: 1,
    limit: 20
  });
  
  console.log('Assistants:', response.data);
  console.log('Pagination:', response.pagination);
} catch (error) {
  if (error instanceof AlloKoliAPIError) {
    console.error('Erreur API:', error.message, error.status);
  }
}
```

#### Créer un assistant

```typescript
const newAssistant = await sdk.createAssistant({
  name: 'Mon Assistant',
  model: {
    provider: 'openai',
    model: 'gpt-4',
    temperature: 0.7
  },
  voice: {
    provider: 'eleven-labs',
    voiceId: 'voice-id-here'
  },
  language: 'fr',
  firstMessage: 'Bonjour ! Comment puis-je vous aider ?',
  instructions: 'Tu es un assistant utile et bienveillant.',
  silenceTimeoutSeconds: 30,
  maxDurationSeconds: 1800,
  endCallAfterSilence: true,
  recordingSettings: {
    createRecording: true,
    saveRecording: false
  }
});

console.log('Assistant créé:', newAssistant.data);
```

#### Récupérer un assistant

```typescript
const assistant = await sdk.getAssistant('assistant-uuid');
console.log('Assistant:', assistant.data);
```

#### Mettre à jour un assistant

```typescript
const updatedAssistant = await sdk.updateAssistant('assistant-uuid', {
  name: 'Nouveau nom',
  instructions: 'Nouvelles instructions'
});
```

#### Supprimer un assistant

```typescript
await sdk.deleteAssistant('assistant-uuid');
```

### Gestion des Bases de Connaissances

#### Lister les bases de connaissances

```typescript
const knowledgeBases = await sdk.listKnowledgeBases({
  page: 1,
  limit: 10
});
```

#### Créer une base de connaissances

```typescript
const newKB = await sdk.createKnowledgeBase({
  name: 'Ma Base de Connaissances',
  description: 'Description de la base',
  metadata: {
    category: 'support'
  }
});
```

#### Interroger une base de connaissances

```typescript
const queryResult = await sdk.queryKnowledgeBase('kb-uuid', {
  query: 'Comment configurer un assistant ?',
  top_k: 5,
  similarity_threshold: 0.7
});

console.log('Résultats:', queryResult.data.results);
```

#### Ajouter un fichier à une base de connaissances

```typescript
await sdk.addFileToKnowledgeBase('kb-uuid', 'file-uuid');
```

#### Retirer un fichier d'une base de connaissances

```typescript
await sdk.removeFileFromKnowledgeBase('kb-uuid', 'file-uuid');
```

## Gestion des Erreurs

Le SDK utilise une classe d'erreur personnalisée `AlloKoliAPIError` :

```typescript
import { AlloKoliAPIError } from '@/lib/api/allokoli-sdk';

try {
  await sdk.getAssistant('invalid-uuid');
} catch (error) {
  if (error instanceof AlloKoliAPIError) {
    console.error('Status:', error.status);
    console.error('Message:', error.message);
    console.error('Code:', error.code);
    console.error('Details:', error.details);
    
    // Gestion spécifique par code d'erreur
    switch (error.status) {
      case 401:
        // Token expiré ou invalide
        break;
      case 404:
        // Ressource non trouvée
        break;
      case 400:
        // Données invalides
        break;
    }
  }
}
```

## Utilitaires

### Vérification de santé de l'API

```typescript
const health = await sdk.healthCheck();
console.log('Status:', health.status); // 'healthy' ou 'unhealthy'
```

### Validation d'UUID

```typescript
import { isValidUUID } from '@/lib/api/allokoli-sdk';

if (isValidUUID('some-string')) {
  // C'est un UUID valide
}
```

### Validation de numéro de téléphone

```typescript
import { isValidPhoneNumber } from '@/lib/api/allokoli-sdk';

if (isValidPhoneNumber('+33123456789')) {
  // Numéro valide au format E.164
}
```

## Intégration avec React

### Hook personnalisé pour les assistants

```typescript
// hooks/useAssistants.ts
import { useState, useEffect } from 'react';
import { useAlloKoliSDK } from './useAlloKoliSDK';
import type { Assistant, PaginationParams } from '@/lib/api/allokoli-sdk';

export function useAssistants(params: PaginationParams = {}) {
  const sdk = useAlloKoliSDK();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssistants() {
      try {
        setLoading(true);
        const response = await sdk.listAssistants(params);
        setAssistants(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
      } finally {
        setLoading(false);
      }
    }

    fetchAssistants();
  }, [params.page, params.limit]);

  return { assistants, loading, error };
}
```

### Hook pour le SDK

```typescript
// hooks/useAlloKoliSDK.ts
import { useMemo } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { createAlloKoliSDKWithSupabase } from '@/lib/api/allokoli-sdk';

export function useAlloKoliSDK() {
  const supabase = useSupabaseClient();
  const user = useUser();

  return useMemo(() => {
    const projectId = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!;
    const authToken = user?.access_token;
    
    return createAlloKoliSDKWithSupabase(projectId, authToken);
  }, [user?.access_token]);
}
```

## Types TypeScript

Le SDK exporte tous les types nécessaires :

```typescript
import type {
  Assistant,
  AssistantCreate,
  AssistantUpdate,
  KnowledgeBase,
  KnowledgeBaseCreate,
  KnowledgeBaseUpdate,
  KnowledgeBaseQuery,
  QueryResult,
  VapiModel,
  VapiVoice,
  PaginationMeta,
  PaginatedResponse,
  SingleResponse,
  AlloKoliAPIError
} from '@/lib/api/allokoli-sdk';
```

## Configuration d'environnement

Ajoutez ces variables à votre `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Bonnes Pratiques

1. **Gestion des erreurs** : Toujours encapsuler les appels SDK dans des try-catch
2. **Authentification** : Mettre à jour le token quand l'utilisateur se connecte/déconnecte
3. **Pagination** : Utiliser la pagination pour les listes importantes
4. **Validation** : Utiliser les helpers de validation avant les appels API
5. **Types** : Utiliser les types TypeScript fournis pour une meilleure sécurité

## Exemples Complets

Voir le dossier `examples/` pour des exemples d'utilisation complète du SDK dans différents contextes React. 