# Guide de développement

Ce document fournit les guidelines pour le développement et l'extension de la plateforme Koli55.

## Architecture du projet

Koli55 suit une architecture en couches :

```
┌────────────────┐
│  UI (Next.js)  │
├────────────────┤
│ Frontend APIs  │ ← lib/api/*.ts
├────────────────┤
│ Edge Functions │ ← supabase/functions/
├────────────────┤
│    Vapi API    │
└────────────────┘
```

### Structure des dossiers

- `/app` - Routes et pages Next.js (App Router)
- `/components` - Composants React réutilisables
- `/lib/api` - Services frontend pour l'accès aux APIs
- `/supabase/functions` - Edge Functions Supabase (Deno)
- `/DOCS` - Documentation du projet

## Standards de code

### Typescript

- Utilisez toujours des types explicites pour les paramètres et les retours de fonction
- Évitez l'utilisation de `any` sauf pour les fonctions de mapping
- Préférez les interfaces aux types pour les objets

### Conventions de nommage

- **Fichiers** : kebab-case pour les fichiers (ex: `knowledge-base.ts`)
- **Composants** : PascalCase pour les composants React (ex: `AssistantCard.tsx`)
- **Interfaces** : PascalCase avec préfixe "I" ou descriptif (ex: `VapiAssistant`)
- **Services** : camelCase avec suffixe "Service" (ex: `assistantsService`)

### Style de codage

- Utilisez des fonctions nommées plutôt que des fonctions fléchées anonymes
- Préférez la déstructuration pour accéder aux propriétés d'objets
- Utilisez des commentaires pour expliquer le "pourquoi", pas le "quoi"
- Importez uniquement ce dont vous avez besoin

## Extension du projet

### Ajout d'une nouvelle entité Vapi

Pour ajouter une nouvelle entité Vapi (ex: "campaigns") :

1. Définissez les interfaces dans `supabase/functions/shared/vapi.ts` :
   ```typescript
   export interface VapiCampaign {
     id: string;
     name: string;
     // Autres propriétés...
   }

   export interface CampaignCreateParams {
     // Propriétés pour la création...
   }
   ```

2. Créez le service frontend dans `lib/api/campaignsService.ts` :
   ```typescript
   import supabase from '../supabaseClient';
   
   export interface CreateCampaignPayload {
     // Propriétés...
   }
   
   export async function createCampaign(payload: CreateCampaignPayload): Promise<CampaignApiResponse> {
     // Implémentation...
   }
   
   export const campaignsService = {
     create: createCampaign,
     // Autres méthodes...
   };
   ```

3. Créez la fonction Edge dans `supabase/functions/campaigns/index.ts` :
   ```typescript
   import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
   import { corsHeaders } from '../shared/cors.ts'
   // Autres imports...
   
   // Documentation...
   
   // Fonctions de mapping...
   
   // Schémas de validation...
   
   serve(async (req: Request) => {
     // Implémentation...
   })
   ```

4. Testez votre implémentation :
   ```bash
   supabase functions serve campaigns
   ```

### Modification d'une entité existante

Pour modifier une entité existante (ex: ajouter un nouveau champ) :

1. Mettez à jour les interfaces dans `shared/vapi.ts`
2. Mettez à jour les fonctions de mapping dans la fonction Edge
3. Mettez à jour les schémas de validation pour le nouveau champ
4. Mettez à jour les services frontend avec les nouveaux types

## Tests et validation

### Tests unitaires

Pour ajouter des tests unitaires :

```typescript
// tests/unit/services/assistantsService.test.ts
import { assistantsService } from '../../../lib/api/assistantsService';

describe('assistantsService', () => {
  test('should create an assistant', async () => {
    // Implémentation du test...
  });
});
```

### Tests d'intégration

Pour tester l'intégration entre les services frontend et les Edge Functions :

```typescript
// tests/integration/assistants.test.ts
import { assistantsService } from '../../lib/api/assistantsService';

describe('Assistants Integration', () => {
  test('should create and retrieve an assistant', async () => {
    // Création d'un assistant de test
    const createResponse = await assistantsService.create({
      name: 'Test Assistant',
      // Autres propriétés...
    });
    
    expect(createResponse.success).toBe(true);
    
    // Récupération de l'assistant créé
    const getResponse = await assistantsService.getById(createResponse.data.id);
    
    expect(getResponse.success).toBe(true);
    expect(getResponse.data.name).toBe('Test Assistant');
  });
});
```

## Débogage

### Logs dans les Edge Functions

Utilisez les préfixes de log standardisés :

```typescript
console.log(`[HANDLER] GET /entities - Liste des entités`);
console.log(`[MAPPING] Input: ${JSON.stringify(data)}`);
console.log(`[VAPI_SUCCESS] Created entity: ${entity.id}`);
console.error(`[VAPI_ERROR] Failed to create entity: ${error.message}`);
```

### Débogage côté frontend

Utilisez l'extension Redux DevTools pour inspecter les requêtes Supabase :

1. Installez l'extension Redux DevTools dans votre navigateur
2. Dans le panneau DevTools, activez "Trace Supabase Requests"
3. Observez les requêtes et réponses en temps réel

## Sécurité

### Validation des entrées

Toutes les entrées utilisateur doivent être validées :

```typescript
const createEntitySchema: ValidationSchema = {
  name: { 
    type: 'string',
    required: true,
    minLength: 3,
    maxLength: 100
  },
  // Autres validations...
}

const validatedData = validateInput(data, createEntitySchema);
```

### Protection des clés API

- Stockez toujours les clés API dans les variables d'environnement
- N'exposez jamais la clé API Vapi côté client
- Utilisez les Edge Functions comme proxy sécurisé

## Documentation

### Documentation du code

Suivez ce format pour documenter les fonctions :

```typescript
/**
 * Crée un nouvel assistant
 * 
 * @param payload - Données pour la création de l'assistant
 * @returns Promise avec le résultat de l'opération
 */
export async function createAssistant(payload: CreateAssistantPayload): Promise<AssistantApiResponse> {
  // Implémentation...
}
```

### Documentation des Edge Functions

Chaque Edge Function doit avoir une documentation complète en tête du fichier :

```typescript
/**
 * Fonction Supabase Edge pour la gestion des assistants Vapi
 * 
 * Endpoints:
 * - GET /assistants - Liste tous les assistants
 * - GET /assistants/:id - Récupère un assistant par ID
 * - POST /assistants - Crée un nouvel assistant
 * - PATCH /assistants/:id - Met à jour un assistant
 * - DELETE /assistants/:id - Supprime un assistant
 * 
 * Variables d'Entrée (Request):
 * ...
 * 
 * Variables de Sortie (Response):
 * ...
 */
```

## Workflow de développement

1. **Planification** : Définir la nouvelle fonctionnalité ou modification
2. **Interfaces** : Mettre à jour ou créer les interfaces TypeScript
3. **Edge Function** : Implémenter la logique côté serveur
4. **Service Frontend** : Créer le service pour accéder à la fonction Edge
5. **UI** : Développer les composants d'interface utilisateur
6. **Tests** : Écrire et exécuter les tests unitaires et d'intégration
7. **Documentation** : Mettre à jour la documentation
8. **Revue de code** : Faire réviser par un autre développeur
9. **Déploiement** : Déployer les modifications

## Ressources

- [Documentation Vapi](https://docs.vapi.ai/)
- [Documentation Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Documentation Next.js](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Priorités de développement actuelles

Suite à l'analyse de l'état du projet, les priorités de développement sont les suivantes :

### 1. Compléter les fonctionnalités essentielles

#### Assistants
- Compléter le formulaire de création d'assistant avec toutes les options Vapi
- Implémenter la page de détail des assistants
- Ajouter une interface pour tester les assistants directement dans l'application
- Finaliser la page d'édition des assistants

#### Bases de connaissances
- Finaliser la création des bases de connaissances
- Implémenter l'upload de fichiers dans les bases de connaissances
- Permettre la liaison entre assistants et bases de connaissances

### 2. Améliorations techniques

- Mettre en place un environnement de staging
- Compléter la suite de tests pour les fonctionnalités clés
- Optimiser les requêtes aux Edge Functions
- Améliorer la gestion des erreurs et l'expérience utilisateur

### 3. Documentation

- Créer des guides d'utilisation détaillés
- Produire des diagrammes d'architecture et de flux
- Documenter l'API complète

## Comment contribuer aux priorités actuelles

1. Référez-vous au fichier `DOCS/guides/todo.md` pour voir les tâches marquées comme prioritaires
2. Consultez les documents spécifiques comme `DOCS/assistants.md` pour les détails d'implémentation
3. Suivez les conventions de code et les bonnes pratiques décrites dans ce guide
4. Effectuez des tests approfondis avant de soumettre votre code

Avant de commencer à travailler sur une nouvelle fonctionnalité, assurez-vous qu'elle fait partie des priorités actuelles et qu'elle n'est pas déjà en cours de développement par un autre membre de l'équipe. 