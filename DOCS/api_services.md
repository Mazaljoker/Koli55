# API Services Architecture

Cette documentation décrit l'architecture des services d'API pour notre plateforme Koli55, qui fournit une couche d'abstraction standardisée pour interagir avec les Supabase Edge Functions.

> **Visualisation de l'architecture**: Pour une représentation visuelle de cette architecture, consultez le [diagramme architectural](assets/api_service_architecture.md).

## Vue d'ensemble

Notre couche de services API offre une abstraction propre au-dessus des appels directs aux fonctions Supabase, avec les avantages suivants :

- Sécurité de type avec des interfaces TypeScript pour toutes les requêtes et réponses
- Gestion cohérente des erreurs
- Parsing centralisé des réponses
- Modèles standardisés pour les opérations CRUD

## Services disponibles

Les services suivants sont disponibles dans le répertoire `lib/api` :

### Principales entités métier

- **assistantsService** - Gestion des assistants IA
  - Création, mise à jour, suppression et interrogation d'assistants
  - Configuration des paramètres d'IA
  
- **knowledgeBaseService** - Gestion des bases de connaissances
  - Création et gestion des bases de connaissances
  - Ajout et suppression de fichiers
  - Interrogation sémantique des bases de connaissances
  
- **messagesService** - Gestion des messages de conversation
  - Création et listage des messages
  - Suivi des conversations avec l'assistant

- **callsService** - Opérations liées aux appels téléphoniques
  - Initiation et gestion des appels
  - Récupération des métadonnées et des transcriptions

### Gestion organisationnelle

- **organizationService** - Gestion des organisations
  - Création et configuration des organisations
  - Gestion des membres et des invitations
  - Paramètres organisationnels

- **squadsService** - Gestion des équipes
  - Création et gestion des équipes au sein d'une organisation
  - Ajout et suppression de membres
  
### Infrastructure et utilités

- **filesService** - Opérations de fichiers
  - Téléchargement et récupération de fichiers
  - Gestion des métadonnées

- **workflowsService** - Définition et exécution des workflows
  - Création de workflows automatisés
  - Déclenchement et suivi des exécutions

- **webhooksService** - Gestion des webhooks
  - Configuration des endpoints de notification
  - Suivi des livraisons de webhook

- **phoneNumbersService** - Provisionnement et gestion des numéros de téléphone
  - Achat et configuration des numéros
  - Attribution aux assistants

- **analyticsService** - Données d'analytique et d'utilisation
  - Suivi des événements
  - Rapports d'utilisation et tendances

### Tests et extensions

- **testSuitesService** - Gestion des suites de tests
  - Création et configuration des suites de tests
  - Exécution des tests

- **testSuiteTestsService** - Tests individuels au sein des suites
  - Définition des cas de test
  - Gestion des entrées et sorties attendues

- **testSuiteRunsService** - Résultats d'exécution pour les suites de tests
  - Consultation des résultats de tests
  - Suivi des succès et échecs

- **functionsService** - Gestion des définitions de fonctions/outils
  - Création et mise à jour des fonctions personnalisées
  - Configuration des paramètres

- **customFunctionsService** - Invocation de fonctions personnalisées
  - Appel dynamique de fonctions
  - Récupération des résultats d'exécution

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

Voici comment utiliser ces services dans vos composants :

```typescript
// Importer le service
import { assistantsService } from 'lib/api';

// Dans un composant ou une fonction
const createAssistant = async () => {
  const payload = {
    name: 'Mon Assistant',
    instructions: 'Vous êtes un assistant utile.',
  };
  
  const response = await assistantsService.create(payload);
  
  if (response.success) {
    // Traiter le cas de succès avec response.data
    console.log('Assistant créé :', response.data);
  } else {
    // Traiter le cas d'erreur avec response.message
    console.error('Échec de création de l\'assistant :', response.message);
  }
};
```

## Contribution et extension

Lors de l'ajout de nouveaux services :

1. Suivre les modèles établis pour l'implémentation des services
2. Créer des interfaces TypeScript appropriées pour tous les payloads et réponses
3. Inclure des commentaires JSDoc appropriés pour toutes les fonctions publiques
4. Regrouper les fonctions du service dans un objet exporté
5. Mettre à jour le fichier principal `index.ts` pour exporter à la fois le service et ses types

## Index des services

Tous les services sont regroupés et exportés depuis `lib/api/index.ts`, ce qui permet d'y accéder facilement :

```typescript
// Import de services spécifiques
import { assistantsService, knowledgeBaseService } from 'lib/api';

// Ou import de tous les services comme un objet
import api from 'lib/api';
api.assistants.create(payload);
``` 