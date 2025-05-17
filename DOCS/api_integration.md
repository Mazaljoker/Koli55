# Intégration API Vapi

Ce document décrit le pattern standardisé pour l'intégration de l'API Vapi dans le projet Koli55.

## Architecture d'intégration

L'intégration avec Vapi suit une architecture en trois couches :

1. **Frontend Services** : Services TypeScript qui exposent des méthodes typées pour interagir avec les Edge Functions
2. **Edge Functions** : Fonctions serverless Supabase qui communiquent avec l'API Vapi
3. **API Vapi** : API externe fournissant les fonctionnalités d'IA vocale

Cette architecture garantit la sécurité des clés API et permet une séparation claire des responsabilités.

## Pattern d'intégration standardisé

### 1. Définition des interfaces

Toutes les entités Vapi sont définies dans un fichier central `shared/vapi.ts` :

```typescript
// Types pour une entité (exemple: Workflow)
export interface VapiWorkflow {
  id: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface WorkflowCreateParams {
  name: string;
  description?: string;
  steps: WorkflowStep[];
  metadata?: Record<string, any>;
}

export interface WorkflowUpdateParams {
  name?: string;
  description?: string;
  steps?: WorkflowStep[];
  metadata?: Record<string, any>;
}
```

### 2. Services frontend

Un service frontend typique (`lib/api/entityService.ts`) suit cette structure :

```typescript
// Types pour les payloads d'entrée
export interface CreateEntityPayload {
  name: string;
  // Autres propriétés...
}

// Types pour les réponses d'API
export interface EntityData {
  id: string;
  name: string;
  // Autres propriétés...
}

export interface EntityApiResponse extends ApiResponse<EntityData> {}

// Fonctions du service
export async function createEntity(payload: CreateEntityPayload): Promise<EntityApiResponse> {
  try {
    const { data, error } = await supabase.functions.invoke('entity-name', {
      method: 'POST',
      body: payload,
    });

    if (error) {
      throw new Error(error.message || 'Failed to create entity');
    }

    return data as EntityApiResponse;
  } catch (error: any) {
    console.error('Error in createEntity:', error);
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
    };
  }
}

// Autres méthodes (getById, list, update, delete)...

// Objet service exporté pour faciliter l'usage
export const entityService = {
  create: createEntity,
  getById: getEntityById,
  list: listEntities,
  update: updateEntity,
  delete: deleteEntity,
};
```

### 3. Edge Functions

Chaque Edge Function (`supabase/functions/entity-name/index.ts`) suit ce pattern :

```typescript
// Documentation complète des endpoints en commentaire...

// Fonctions de mapping de données
function mapToVapiEntityFormat(entityData: any): EntityCreateParams | EntityUpdateParams {
  console.log(`[MAPPING] mapToVapiEntityFormat - Input: ${JSON.stringify(entityData, null, 2)}`);
  
  const payload: EntityCreateParams | EntityUpdateParams = {};
  
  if (entityData.name !== undefined) {
    payload.name = entityData.name;
  }
  
  // Mapping d'autres propriétés...
  
  console.log(`[MAPPING] mapToVapiEntityFormat - Output: ${JSON.stringify(payload, null, 2)}`);
  return payload;
}

// Schémas de validation
const createEntitySchema: ValidationSchema = {
  name: { 
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 100
  },
  // Autres règles de validation...
}

// Handler principal
serve(async (req: Request) => {
  // Gestion CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 })
  }

  try {
    // Authentification
    const user = await authenticate(req)
    
    // Routage et extraction des paramètres
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/').filter(segment => segment)
    const entityId = pathSegments.length >= 2 ? pathSegments[1] : null
    
    // Implémentation des méthodes REST
    // GET /entities - Liste
    if (req.method === 'GET' && !entityId) {
      console.log(`[HANDLER] GET /entities - Liste des entités`);
      // Implémentation...
    }
    
    // GET /entities/:id - Récupération
    if (req.method === 'GET' && entityId) {
      console.log(`[HANDLER] GET /entities/${entityId} - Récupération d'une entité`);
      // Implémentation...
    }
    
    // POST /entities - Création
    if (req.method === 'POST' && !entityId) {
      console.log(`[HANDLER] POST /entities - Création d'une entité`);
      // Implémentation...
    }
    
    // PATCH /entities/:id - Mise à jour
    if (req.method === 'PATCH' && entityId) {
      console.log(`[HANDLER] PATCH /entities/${entityId} - Mise à jour d'une entité`);
      // Implémentation...
    }
    
    // DELETE /entities/:id - Suppression
    if (req.method === 'DELETE' && entityId) {
      console.log(`[HANDLER] DELETE /entities/${entityId} - Suppression d'une entité`);
      // Implémentation...
    }
    
  } catch (error) {
    return errorResponse(error)
  }
})
```

## Entités Vapi implémentées

Les entités suivantes ont été implémentées selon ce pattern standardisé :

1. **Assistants** : Agents IA vocaux (`assistantsService.ts` et `assistants/index.ts`)
2. **Workflows** : Flux de conversation structurés (`workflowsService.ts` et `workflows/index.ts`)
3. **Squads** : Groupes d'assistants collaboratifs (`squadsService.ts` et `squads/index.ts`)
4. **Functions** : Outils utilisables par les assistants (`functionsService.ts` et `functions/index.ts`)
5. **Files** : Fichiers pour les bases de connaissances (`filesService.ts` et `files/index.ts`)
6. **Knowledge Bases** : Bases de connaissances pour les assistants (`knowledgeBasesService.ts` et `knowledge-bases/index.ts`)
7. **Test Suites** : Suites de tests pour valider les assistants (`testSuitesService.ts` et `test-suites/index.ts`)
8. **Test Suite Tests** : Tests individuels dans les suites (`testSuiteTestsService.ts` et `test-suite-tests/index.ts`)
9. **Phone Numbers** : Numéros de téléphone pour les assistants (`phoneNumbersService.ts` et `phone-numbers/index.ts`)

## Bonnes pratiques d'intégration

### Logging standardisé
Utilisez des préfixes de log cohérents :
- `[HANDLER]` - Pour les entrées dans les gestionnaires d'endpoint
- `[MAPPING]` - Pour les transformations de données
- `[VAPI_SUCCESS]` - Pour les appels API réussis
- `[VAPI_ERROR]` - Pour les erreurs d'appel API

### Gestion des erreurs
Capturez et transformez toutes les erreurs avec `errorResponse()` pour garantir un format cohérent :
```typescript
try {
  // Code susceptible de générer une erreur
} catch (error) {
  return errorResponse(error);
}
```

### Validation des entrées
Validez toujours les données entrantes avec les schémas de validation :
```typescript
const validatedData = validateInput(data, createEntitySchema);
```

### Mapping de données
Utilisez des fonctions de mapping dédiées pour transformer les données entre le format frontend et le format Vapi :
```typescript
const mappedData = mapToVapiEntityFormat(validatedData);
```

### Métadonnées utilisateur
Ajoutez toujours les métadonnées utilisateur pour faciliter le suivi et la sécurité :
```typescript
validatedData.metadata = {
  ...validatedData.metadata,
  user_id: user.id,
  organization_id: user.organization_id || user.id
};
```

## Exemples d'utilisation

### Dans un composant React
```typescript
import { workflowsService } from 'lib/api/workflowsService';

function WorkflowCreator() {
  const handleSubmit = async (formData) => {
    const response = await workflowsService.create({
      name: formData.name,
      description: formData.description,
      steps: formData.steps
    });
    
    if (response.success) {
      // Traitement en cas de succès
    } else {
      // Gestion des erreurs
    }
  };
  
  // Reste du composant...
}
```

### Test avec cURL
```bash
curl -X POST https://your-project.supabase.co/functions/v1/workflows \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"Mon workflow","description":"Description","steps":[...]}'
``` 