# API Services Architecture

Cette documentation décrit l'architecture des services d'API pour notre plateforme Koli55, qui fournit une couche d'abstraction standardisée pour interagir avec les Supabase Edge Functions.

> **Visualisation de l'architecture**: Pour une représentation visuelle de cette architecture, consultez le [diagramme architectural](assets/api_service_architecture.md).

## Vue d'ensemble

Notre couche de services API offre une abstraction propre au-dessus des appels directs aux fonctions Supabase, avec les avantages suivants :

- Sécurité de type avec des interfaces TypeScript pour toutes les requêtes et réponses
- Gestion cohérente des erreurs
- Parsing centralisé des réponses
- Modèles standardisés pour les opérations CRUD

## État actuel des services (Mise à jour Phase 10.1)

### ✅ Services complètement opérationnels

- **assistantsService** - **🎉 COMPLÈTEMENT TESTÉ ET FONCTIONNEL**
  - Création, mise à jour, suppression et interrogation d'assistants
  - Configuration des paramètres d'IA
  - **Edge Function déployée** (Version 28) et **100% compatible Vapi.ai**
  - **Intégration frontend complète** avec wizard de création fonctionnel
  - **Gestion d'erreurs robuste** avec fallback et retry

### 🔄 Services structurés (attente déploiement Edge Functions)

**📍 Statut** : Services créés avec architecture complète mais non testés faute d'Edge Functions déployées

#### Principales entités métier

- **knowledgeBaseService** - Gestion des bases de connaissances
  - ✅ CRUD complet avec gestion upload
  - ✅ Types et interfaces détaillés
  - ⏳ **En attente** : Déploiement Edge Function `knowledge-bases`
  
- **messagesService** - Gestion des messages de conversation
  - ✅ Structure CRUD complète
  - ⏳ **En attente** : Déploiement Edge Function `messages`

- **callsService** - Opérations liées aux appels téléphoniques
  - ✅ Historique et monitoring des appels structuré
  - ✅ Métriques et analytics intégrées
  - ⏳ **En attente** : Déploiement Edge Function `calls`

#### Gestion organisationnelle

- **organizationService** - Gestion des organisations
  - ✅ Structure complète avec types TypeScript
  - ⏳ **En attente** : Déploiement Edge Function `organization`

- **squadsService** - Gestion des équipes
  - ✅ CRUD complet structuré
  - ⏳ **En attente** : Déploiement Edge Function `squads`
  
#### Infrastructure et utilités

- **filesService** - Opérations de fichiers
  - ✅ Téléchargement et récupération structurés
  - ⏳ **En attente** : Déploiement Edge Function `files`

- **workflowsService** - Définition et exécution des workflows
  - ✅ Architecture complète avec méthode execute
  - ⏳ **En attente** : Déploiement Edge Function `workflows`

- **webhooksService** - Gestion des webhooks
  - ✅ Configuration et suivi structurés
  - ⏳ **En attente** : Déploiement Edge Function `webhooks`

- **phoneNumbersService** - Provisionnement et gestion des numéros de téléphone
  - ✅ CRUD complet avec recherche et provisioning
  - ⏳ **En attente** : Déploiement Edge Function `phone-numbers`

- **analyticsService** - Données d'analytique et d'utilisation
  - ✅ Structure de base avec métriques
  - ⏳ **En attente** : Déploiement Edge Function `analytics`

#### Tests et extensions

- **testSuitesService** - Gestion des suites de tests
  - ✅ CRUD complet structuré
  - ⏳ **En attente** : Déploiement Edge Function `test-suites`

- **testSuiteTestsService** - Tests individuels au sein des suites
  - ✅ Structure complète
  - ⏳ **En attente** : Déploiement Edge Function `test-suite-tests`

- **testSuiteRunsService** - Résultats d'exécution pour les suites de tests
  - ✅ Architecture de base structurée
  - ⏳ **En attente** : Déploiement Edge Function `test-suite-runs`

- **functionsService** - Gestion des définitions de fonctions/outils
  - ✅ CRUD structuré avec types
  - ⏳ **En attente** : Déploiement Edge Function `functions`

- **customFunctionsService** - Invocation de fonctions personnalisées
  - ✅ Appel dynamique structuré
  - ⏳ **En attente** : Déploiement Edge Function `functions`

## Structure commune des services

Chaque service suit une structure commune :

1. **Types d'entrée** - Interfaces pour les payloads de création/mise à jour
2. **Types de réponse** - Interfaces pour les données retournées
3. **Fonctions de service** - Implémentations des opérations CRUD
4. **Objet service groupé** - Objet exporté qui regroupe toutes les fonctions

## Structure des réponses

Tous les services retournent des réponses avec une structure cohérente :

```typescript
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  pagination?: PaginationData;
}

interface PaginationData {
  total: number;
  limit: number;
  page: number;
  has_more: boolean;
}
```

## Gestion des erreurs

Tous les services gèrent les erreurs de manière cohérente :

1. Les erreurs réseau/API sont capturées et transformées en réponses d'erreur
2. Les erreurs de fonction Supabase sont transformées en réponses d'erreur
3. Le statut succès/erreur est clairement indiqué avec le drapeau `success`

## Utilisation typique

### Service fonctionnel (assistants)

```typescript
// Import du service opérationnel
import { assistantsService } from 'lib/api';

// Dans un composant ou une fonction
const createAssistant = async () => {
  const payload = {
    name: 'Mon Assistant',
    model: {
      provider: 'openai',
      model: 'gpt-4o',
      systemPrompt: 'Vous êtes un assistant utile.'
    },
    voice: {
      provider: '11labs',
      voiceId: 'voice_id_here'
    }
  };
  
  const response = await assistantsService.create(payload);
  
  if (response.success) {
    // ✅ Traitement réussi - Service complètement fonctionnel
    console.log('Assistant créé :', response.data);
  } else {
    // Gestion des erreurs avec response.message
    console.error('Échec de création de l\'assistant :', response.message);
  }
};
```

### Services en attente de déploiement

```typescript
// Import d'un service structuré mais non déployé
import { workflowsService } from 'lib/api';

// ⚠️ Ce service est structuré mais nécessite le déploiement de l'Edge Function 'workflows'
const createWorkflow = async () => {
  const payload = {
    name: 'Mon Workflow',
    description: 'Description du workflow',
    steps: [/* étapes du workflow */]
  };
  
  // Cette fonction retournera une erreur tant que l'Edge Function n'est pas déployée
  const response = await workflowsService.create(payload);
  
  if (response.success) {
    console.log('Workflow créé :', response.data);
  } else {
    // Probablement une erreur de fonction non trouvée
    console.error('Échec :', response.message);
  }
};
```

## Prochaines étapes de déploiement

### Priorité 1 - Fonctions de base
1. **knowledge-bases** - Nécessaire pour les interfaces déjà créées
2. **files** - Support des uploads de fichiers
3. **calls** - Historique et monitoring des appels

### Priorité 2 - Fonctions avancées
4. **workflows** - Configuration des flux conversationnels
5. **phone-numbers** - Gestion des numéros Vapi
6. **webhooks** - Réception des événements Vapi

### Priorité 3 - Fonctions de gestion
7. **organization** et **squads** - Gestion organisationnelle
8. **analytics** - Métriques et rapports
9. **functions** - Outils personnalisés
10. **test-suites**, **test-suite-tests**, **test-suite-runs** - Tests

## Contribution et extension

Lors de l'ajout de nouveaux services :

1. Suivre les modèles établis pour l'implémentation des services
2. Créer des interfaces TypeScript appropriées pour tous les payloads et réponses
3. Inclure des commentaires JSDoc appropriés pour toutes les fonctions publiques
4. Regrouper les fonctions du service dans un objet exporté
5. **S'assurer que l'Edge Function correspondante est déployée avant les tests**
6. Mettre à jour le fichier principal `index.ts` pour exporter à la fois le service et ses types

## Index des services

Tous les services sont regroupés et exportés depuis `lib/api/index.ts`, ce qui permet d'y accéder facilement :

```typescript
// Import de services spécifiques
import { assistantsService, knowledgeBaseService } from 'lib/api';

// Ou import de tous les services comme un objet
import api from 'lib/api';
api.assistants.create(payload); // ✅ Fonctionnel
api.workflows.create(payload);  // ⚠️ Nécessite déploiement Edge Function
```

## 📊 Résumé de l'état actuel

- **Services complètement fonctionnels** : ✅ **1/15** (assistantsService)
- **Services structurés et prêts** : 🔄 **14/15** (en attente Edge Functions)
- **Architecture globale** : ✅ **100% complète**
- **Prochaine étape** : **Déploiement progressif des 14 Edge Functions restantes** 