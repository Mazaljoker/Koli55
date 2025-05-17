# Documentation des Supabase Edge Functions

## Infrastructure partagée

### _shared/cors.ts
Gestion des headers CORS pour permettre les requêtes cross-origin.

### _shared/auth.ts
Middleware d'authentification pour vérifier que l'utilisateur est connecté et a les droits appropriés.

### _shared/errors.ts
Gestion standardisée des erreurs et formatage des réponses d'erreur.

### _shared/validation.ts
Validation des données entrantes pour toutes les fonctions Edge.

## Entités principales

### assistants.ts
Gère les opérations CRUD sur les assistants Vapi.
- **GET /** — Liste tous les assistants avec pagination
- **GET /:id** — Récupère un assistant par ID
- **POST /** — Crée un nouvel assistant
- **PATCH /:id** — Met à jour un assistant existant
- **DELETE /:id** — Supprime un assistant

### calls.ts
Gestion des appels téléphoniques effectués via Vapi.
- **GET /** — Liste les appels avec filtres et pagination
- **GET /:id** — Récupère un appel par ID
- **POST /** — Crée un nouvel appel
- **PATCH /:id** — Met à jour un appel
- **DELETE /:id** — Supprime un appel
- **POST /:id/end** — Termine un appel actif
- **GET /:id/listen** — Écoute les événements d'un appel en streaming (SSE)

### messages.ts
Gestion des messages dans les conversations.
- **GET /:callId** — Liste les messages d'un appel
- **POST /:callId** — Ajoute un message à un appel
- **GET /:messageId** — Récupère un message par ID

### phone-numbers.ts
Gère l'attribution et la configuration des numéros de téléphone.
- **GET /** — Liste tous les numéros disponibles
- **GET /:id** — Récupère un numéro par ID
- **POST /** — Provisionne un nouveau numéro
- **PATCH /:id** — Met à jour un numéro
- **DELETE /:id** — Libère un numéro
- **POST /search** — Recherche des numéros disponibles
- **POST /provision** — Provisionne un numéro avec un fournisseur spécifique

### knowledge-bases.ts
Gestion des bases de connaissances pour les assistants.
- **GET /** — Liste toutes les bases
- **GET /:id** — Récupère une base par ID
- **POST /** — Crée une nouvelle base
- **PATCH /:id** — Met à jour une base
- **DELETE /:id** — Supprime une base
- **POST /:id/query** — Interroge une base
- **POST /:id/files** — Ajoute un fichier à une base
- **DELETE /:id/files/:fileId** — Retire un fichier d'une base

### files.ts
Gestion des fichiers pour les bases de connaissances.
- **GET /** — Liste tous les fichiers
- **GET /:id** — Récupère les métadonnées d'un fichier
- **POST /** — Télécharge un nouveau fichier
- **DELETE /:id** — Supprime un fichier
- **GET /:id/content** — Récupère le contenu d'un fichier

### workflows.ts
Configuration des flux conversationnels complexes.
- **GET /** — Liste tous les workflows
- **GET /:id** — Récupère un workflow par ID
- **POST /** — Crée un nouveau workflow
- **PATCH /:id** — Met à jour un workflow
- **DELETE /:id** — Supprime un workflow
- **POST /:id/execute** — Exécute un workflow

### squads.ts
Gestion des groupes d'assistants travaillant ensemble.
- **GET /** — Liste toutes les équipes
- **GET /:id** — Récupère une équipe par ID
- **POST /** — Crée une nouvelle équipe
- **PATCH /:id** — Met à jour une équipe
- **DELETE /:id** — Supprime une équipe
- **POST /:id/members** — Ajoute des membres à une équipe
- **DELETE /:id/members/:memberId** — Retire un membre d'une équipe

### test-suites.ts
Gestion des suites de tests pour évaluer les assistants.
- **GET /** — Liste toutes les suites de tests
- **GET /:id** — Récupère une suite de tests par ID
- **POST /** — Crée une nouvelle suite de tests
- **PATCH /:id** — Met à jour une suite de tests
- **DELETE /:id** — Supprime une suite de tests

### test-suite-tests.ts
Gestion des tests individuels au sein des suites.
- **GET /:suiteId** — Liste tous les tests d'une suite
- **GET /:suiteId/:testId** — Récupère un test par ID
- **POST /:suiteId** — Crée un nouveau test dans une suite
- **PATCH /:suiteId/:testId** — Met à jour un test
- **DELETE /:suiteId/:testId** — Supprime un test

### test-suite-runs.ts
Gestion des exécutions des suites de tests.
- **GET /:suiteId** — Liste toutes les exécutions d'une suite
- **GET /:suiteId/:runId** — Récupère une exécution par ID
- **POST /:suiteId** — Démarre une nouvelle exécution de tests
- **PATCH /:suiteId/:runId** — Met à jour une exécution
- **DELETE /:suiteId/:runId** — Supprime une exécution

### webhooks.ts
Gestion des webhooks pour recevoir les événements Vapi.
- **GET /** — Liste tous les webhooks
- **GET /:id** — Récupère un webhook par ID
- **POST /** — Crée un nouveau webhook
- **PATCH /:id** — Met à jour un webhook
- **DELETE /:id** — Supprime un webhook
- **POST /:id/ping** — Teste un webhook
- **POST /receive** — Point d'entrée pour les événements Vapi

### functions.ts
Outils et fonctions utilisables par les assistants.
- **GET /** — Liste toutes les fonctions
- **GET /:id** — Récupère une fonction par ID
- **POST /** — Crée une nouvelle fonction
- **PATCH /:id** — Met à jour une fonction
- **DELETE /:id** — Supprime une fonction

### analytics.ts
Métriques et statistiques sur l'utilisation de la plateforme.
- **GET /calls** — Obtient des métriques sur les appels
- **GET /usage** — Récupère les statistiques d'utilisation
- **GET /calls/:id/timeline** — Obtient la chronologie d'un appel

### organization.ts
Gestion des paramètres au niveau de l'organisation.
- **GET /** — Récupère les détails de l'organisation
- **PATCH /** — Met à jour l'organisation
- **GET /limits** — Obtient les limites d'utilisation
