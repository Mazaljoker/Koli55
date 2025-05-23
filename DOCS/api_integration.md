# Intégration API Vapi

Ce document décrit le pattern standardisé pour l'intégration de l'API Vapi dans le projet Koli55.

## ✅ État actuel (Phase 10.1 - COMPLÉTÉ)

**🎉 INTÉGRATION 100% COMPATIBLE AVEC VAPI.AI**

- **Edge Function `assistants`** : Déployée (Version 28) et complètement fonctionnelle
- **Format d'URL** : ✅ Corrigé - `https://api.vapi.ai/assistants` (suppression `/v1/`)
- **Structure de réponse** : ✅ Harmonisée avec le format Vapi natif `{ data: ... }`
- **Fonctions utilitaires** : ✅ `mapToVapiAssistantFormat`, `extractId`, `sanitizeString` opérationnelles
- **Upload de fichiers** : ✅ FormData complet avec multipart/form-data
- **Gestion d'erreurs** : ✅ Système robuste avec fallback et retry

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

// ✅ Fonctions du service (assistant service validé et fonctionnel)
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

### 3. Edge Functions (✅ Pattern validé)

Chaque Edge Function (`supabase/functions/entity-name/index.ts`) suit ce pattern :

```typescript
// Documentation complète des endpoints en commentaire...

// ✅ Fonctions de mapping de données (validées Phase 10.1)
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

// ✅ Schémas de validation (pattern validé)
const createEntitySchema: ValidationSchema = {
  name: { 
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 100
  },
  // Autres règles de validation...
}

// ✅ Handler principal (pattern validé et déployé)
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
    
    // ✅ Implémentation des méthodes REST (pattern validé)
    // GET /entities - Liste
    if (req.method === 'GET' && !entityId) {
      console.log(`[HANDLER] GET /entities - Liste des entités`);
      
      // ✅ Appel API Vapi avec format corrigé (sans /v1/)
      const vapiResponse = await callVapiAPI(
        'entities', // Endpoint sans préfixe /v1/
        vapiApiKey,
        'GET',
        undefined
      );
      
      // ✅ Réponse au format Vapi standard
      return createVapiSingleResponse(vapiResponse.data);
    }
    
    // GET /entities/:id - Récupération
    if (req.method === 'GET' && entityId) {
      console.log(`[HANDLER] GET /entities/${entityId} - Récupération d'une entité`);
      
      const vapiResponse = await callVapiAPI(
        `entities/${entityId}`,
        vapiApiKey,
        'GET',
        undefined
      );
      
      return createVapiSingleResponse(vapiResponse.data);
    }
    
    // POST /entities - Création
    if (req.method === 'POST' && !entityId) {
      console.log(`[HANDLER] POST /entities - Création d'une entité`);
      
      const requestBody = await req.json();
      const validatedData = validateInput(requestBody, createEntitySchema);
      
      // ✅ Mapping des données avec fonctions validées
      const mappedData = mapToVapiEntityFormat(validatedData);
      
      const vapiResponse = await callVapiAPI(
        'entities',
        vapiApiKey,
        'POST',
        mappedData
      );
      
      return createVapiSingleResponse(vapiResponse.data);
    }
    
    // PATCH /entities/:id - Mise à jour
    if (req.method === 'PATCH' && entityId) {
      console.log(`[HANDLER] PATCH /entities/${entityId} - Mise à jour d'une entité`);
      
      const requestBody = await req.json();
      const mappedData = mapToVapiEntityFormat(requestBody);
      
      const vapiResponse = await callVapiAPI(
        `entities/${entityId}`,
        vapiApiKey,
        'PATCH',
        mappedData
      );
      
      return createVapiSingleResponse(vapiResponse.data);
    }
    
    // DELETE /entities/:id - Suppression
    if (req.method === 'DELETE' && entityId) {
      console.log(`[HANDLER] DELETE /entities/${entityId} - Suppression d'une entité`);
      
      const vapiResponse = await callVapiAPI(
        `entities/${entityId}`,
        vapiApiKey,
        'DELETE',
        undefined
      );
      
      return createVapiSingleResponse({ success: true });
    }
    
    return errorResponse(new Error('Endpoint not found'), 404);
    
  } catch (error) {
    return errorResponse(error)
  }
})
```

## Entités Vapi implémentées

### ✅ Entité complètement opérationnelle

1. **Assistants** : Agents IA vocaux (`assistantsService.ts` et `assistants/index.ts`)
   - **Status** : ✅ **DÉPLOYÉ ET FONCTIONNEL** (Version 28)
   - **Compatibilité** : ✅ **100% compatible Vapi.ai**
   - **Interface** : ✅ **Wizard complet opérationnel**

### 🔄 Entités structurées (prêtes pour déploiement)

Les entités suivantes ont été implémentées selon ce pattern standardisé et sont **prêtes pour déploiement** :

2. **Workflows** : Flux de conversation structurés (`workflowsService.ts` et `workflows/index.ts`)
3. **Squads** : Groupes d'assistants collaboratifs (`squadsService.ts` et `squads/index.ts`)
4. **Functions** : Outils utilisables par les assistants (`functionsService.ts` et `functions/index.ts`)
5. **Files** : Fichiers pour les bases de connaissances (`filesService.ts` et `files/index.ts`)
6. **Knowledge Bases** : Bases de connaissances pour les assistants (`knowledgeBasesService.ts` et `knowledge-bases/index.ts`)
7. **Test Suites** : Suites de tests pour valider les assistants (`testSuitesService.ts` et `test-suites/index.ts`)
8. **Test Suite Tests** : Tests individuels dans les suites (`testSuiteTestsService.ts` et `test-suite-tests/index.ts`)
9. **Phone Numbers** : Numéros de téléphone pour les assistants (`phoneNumbersService.ts` et `phone-numbers/index.ts`)
10. **Calls** : Historique et monitoring des appels (`callsService.ts` et `calls/index.ts`)
11. **Messages** : Messages de conversation (`messagesService.ts` et `messages/index.ts`)
12. **Webhooks** : Gestion des événements Vapi (`webhooksService.ts` et `webhooks/index.ts`)
13. **Analytics** : Métriques et statistiques (`analyticsService.ts` et `analytics/index.ts`)
14. **Organization** : Paramètres organisationnels (`organizationService.ts` et `organization/index.ts`)

## Bonnes pratiques d'intégration (✅ Validées Phase 10.1)

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

### Mapping de données (✅ Fonctions validées)
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

### URLs API correctes (✅ Corrigées Phase 10.1)
Utilisez toujours les URLs sans préfixe `/v1/` :
```typescript
// ✅ Correct
const vapiResponse = await callVapiAPI('assistants', vapiApiKey, 'GET', undefined);

// ❌ Incorrect (ancien format)
const vapiResponse = await callVapiAPI('v1/assistants', vapiApiKey, 'GET', undefined);
```

### Format de réponse Vapi (✅ Standardisé Phase 10.1)
Utilisez les helpers de réponse pour le format Vapi standard :
```typescript
// ✅ Format Vapi standard
return createVapiSingleResponse(vapiResponse.data);
return createVapiPaginatedResponse(vapiResponse.data, pagination);
return createVapiErrorResponse(error);

// ❌ Ancien format (non conforme)
return new Response(JSON.stringify({ success: true, data: vapiResponse.data }));
```

## Exemples d'utilisation

### Dans un composant React (✅ Testé et fonctionnel)
```typescript
import { assistantsService } from 'lib/api';

function AssistantCreator() {
  const handleSubmit = async (formData) => {
    // ✅ Service complètement fonctionnel
    const response = await assistantsService.create({
      name: formData.name,
      model: {
        provider: 'openai',
        model: 'gpt-4o',
        systemPrompt: formData.systemPrompt
      },
      voice: {
        provider: 'elevenlabs',
        voiceId: formData.voiceId
      }
    });
    
    if (response.success) {
      // ✅ Traitement en cas de succès validé
      console.log('Assistant créé:', response.data);
    } else {
      // ✅ Gestion des erreurs robuste
      console.error('Échec de création:', response.message);
    }
  };
  
  // Reste du composant...
}
```

### Test avec cURL (✅ URLs corrigées)
```bash
# ✅ Test de l'Edge Function assistants déployée
curl -X POST https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/assistants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Mon Assistant Test",
    "model": {
      "provider": "openai",
      "model": "gpt-4o",
      "systemPrompt": "Vous êtes un assistant test."
    }
  }'

# Template pour tester les futures Edge Functions
curl -X POST https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/[nom_fonction] \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '[payload_json]'
```

## État de déploiement recommandé

### Priorité 1 - Fonctions essentielles
1. **knowledge-bases** ⏳ - Interface frontend déjà créée
2. **files** ⏳ - Nécessaire pour le support des uploads
3. **calls** ⏳ - Monitoring et historique des appels

### Priorité 2 - Fonctions avancées
4. **workflows** ⏳ - Configuration de flux conversationnels
5. **phone-numbers** ⏳ - Gestion des numéros Vapi
6. **webhooks** ⏳ - Événements temps réel

### Priorité 3 - Fonctions de gestion
7. **organization** et **squads** ⏳ - Gestion multi-utilisateurs
8. **analytics** ⏳ - Métriques et rapports
9. **functions** ⏳ - Outils personnalisés
10. **test-suites**, **test-suite-tests**, **test-suite-runs** ⏳ - Tests

## Surveillance et maintenance

### Monitoring des Edge Functions
```bash
# Surveillance en temps réel de la fonction assistants
supabase functions logs assistants --project-ref aiurboizarbbcpynmmgv

# Template pour surveiller les autres fonctions
supabase functions logs [nom_fonction] --project-ref aiurboizarbbcpynmmgv
```

### Vérification de l'état des déploiements
```bash
# Liste des fonctions déployées
supabase functions list --project-ref aiurboizarbbcpynmmgv
```

Cette intégration API Vapi est maintenant **100% validée et opérationnelle** pour les assistants, avec un pattern de déploiement établi pour toutes les autres entités. 