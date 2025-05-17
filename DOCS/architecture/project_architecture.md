# Architecture du projet

## Backend
- Supabase Functions (Deno)
- PostgreSQL Supabase avec RLS
- Auth Supabase (email + token)
- Appels sécurisés vers Vapi.ai via Edge Functions utilisant `@vapi-ai/sdk`

## Frontend
- Next.js
- Appels aux fonctions via `supabase.functions.invoke()`
- SDK Vapi client officiel `@vapi-ai/web` pour les intégrations directes

## Structure du backend
### Dossier `/supabase/functions`
- **Infrastructure commune**
  - `shared/cors.ts` - Gestion des headers CORS
  - `shared/auth.ts` - Vérification de l'authentification
  - `shared/errors.ts` - Gestion standardisée des erreurs
  - `shared/validation.ts` - Validation des données entrantes
  - `shared/vapi.ts` - Interfaces, types et fonctions pour l'API Vapi

- **Entités principales**
  - `assistants.ts` - Gestion des assistants Vapi
  - `calls.ts` - Gestion des appels téléphoniques
  - `messages.ts` - Gestion des messages dans les conversations
  - `phone-numbers.ts` - Gestion des numéros de téléphone
  - `knowledge-bases.ts` - Gestion des bases de connaissances
  - `files.ts` - Gestion des fichiers pour les bases de connaissances
  - `workflows.ts` - Configuration des flux conversationnels
  - `squads.ts` - Gestion des groupes d'assistants
  - `webhooks.ts` - Réception des événements Vapi
  - `functions.ts` - Outils utilisables par les assistants
  - `analytics.ts` - Métriques et statistiques d'usage
  - `organization.ts` - Gestion des paramètres d'organisation
  - `test-suites.ts` - Suites de tests pour les assistants
  - `test-suite-tests.ts` - Tests individuels
  - `test-suite-runs.ts` - Exécutions des tests

### Documentation des Edge Functions
Toutes les fonctions Edge ont été documentées avec un format standardisé qui comprend :
- Une description générale de la fonction
- La liste des endpoints gérés et leur description
- Pour chaque endpoint :
  - Les paramètres d'entrée (path params, query params, body, headers)
  - Les schémas de validation utilisés
  - La structure des réponses en cas de succès ou d'erreur
- Les interfaces TypeScript des structures de données manipulées

Cette documentation permet aux développeurs front-end de comprendre facilement comment interagir avec les fonctions Edge et quelles données attendre en retour.

## Flux de données
1. Le frontend appelle une fonction Edge via `supabase.functions.invoke()`
2. La fonction Edge authentifie la requête et vérifie les permissions
3. La fonction Edge interagit avec l'API Vapi via le SDK serveur
4. Les résultats sont stockés dans la base de données Supabase si nécessaire
5. La réponse est renvoyée au frontend

## Clients Vapi
- `lib/vapiClient.ts` - Wrapper du SDK client pour l'utilisation côté front-end
- `lib/vapiServerClient.ts` - Wrapper du SDK serveur pour l'utilisation dans les Edge Functions

## Sécurité
- Toutes les clés API Vapi sont stockées côté serveur uniquement
- Authentification via Supabase Auth avec middleware Next.js
- Règles RLS sur les tables Supabase
- Validation des entrées sur toutes les fonctions Edge 