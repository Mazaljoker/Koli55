## 🏗️ Phase 1 — Initialisation du projet (Structure + Stack)
- [x] Créer le monorepo `allokoli/` avec la structure suivante :
  - `src/`, `supabase/functions/`, `public/`, `lib/`, etc.
- [x] Initialiser `pnpm` ou `npm` avec `package.json`
- [x] Installer les dépendances de base (Next.js, Supabase client, TailwindCSS)
- [x] Créer `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`

---

## 🧠 Phase 2 — Contexte & Documentation
- [x] Générer tous les fichiers `.md` internes (`README.md`, `CONTEXT.md`, `API_FLOW.md`, etc.)
- [x] Écrire les principes du projet (dans `CONTEXT.md`)
- [x] Ajouter un guide de collaboration avec Cursor dans `CURSOR_GUIDE.md`

---

## 🔐 Phase 3 — Authentification & Supabase
- [x] Créer le projet Supabase en ligne
- [x] Connecter le projet local à Supabase avec `supabase link`
- [x] Activer Supabase Auth (email/password ou magic link)
- [x] Ajouter le rôle `user` + les règles RLS de sécurité
- [x] Créer le client `lib/supabaseClient.ts`

---

## 🧩 Phase 4 — Intégration des SDKs Vapi (client et serveur)
- [x] Installer le SDK client Vapi via `pnpm add @vapi-ai/web`
- [x] Installer le SDK serveur Vapi via `pnpm add @vapi-ai/server-sdk`
- [x] Créer un wrapper client dans `lib/vapiClient.ts`
- [x] Créer un wrapper serveur pour les Edge Functions dans `lib/vapiServer.ts`
- [x] Configurer les clés d'API et les credentials Vapi

---

## 🧠 Phase 5 — Fonctions Supabase Edge (1 par route Vapi)

### 🔹 Infrastructure commune
- [x] `_shared/cors.ts` — Gestion des headers CORS
- [x] `_shared/auth.ts` — Vérification de l'authentification
- [x] `_shared/errors.ts` — Gestion standardisée des erreurs
- [x] `_shared/validation.ts` — Validation des données entrantes

### 🔹 Assistants
- [x] `assistants.ts` — CRUD complet des assistants
  - [x] **GET /** — Lister tous les assistants (avec pagination)
  - [x] **GET /:id** — Récupérer un assistant par ID
  - [x] **POST /** — Créer un nouvel assistant
  - [x] **PATCH /:id** — Mettre à jour un assistant
  - [x] **DELETE /:id** — Supprimer un assistant

### 🔹 Appels (Calls)
- [x] `calls.ts` — Gestion complète des appels
  - [x] **GET /** — Lister les appels (avec filtres et pagination)
  - [x] **GET /:id** — Récupérer un appel par ID
  - [x] **POST /** — Créer un nouvel appel
  - [x] **PATCH /:id** — Mettre à jour un appel
  - [x] **DELETE /:id** — Supprimer un appel
  - [x] **POST /:id/end** — Terminer un appel actif
  - [x] **GET /:id/listen** — Écouter les événements d'un appel en streaming (SSE)

### 🔹 Messages
- [x] `messages.ts` — Gestion des messages pendant les appels
  - [x] **GET /:callId** — Lister les messages d'un appel
  - [x] **POST /:callId** — Ajouter un message à un appel
  - [x] **GET /:messageId** — Récupérer un message par ID

### 🔹 Numéros de téléphone
- [x] `phone-numbers.ts` — Gestion complète des numéros
  - [x] **GET /** — Lister tous les numéros disponibles
  - [x] **GET /:id** — Récupérer un numéro par ID
  - [x] **POST /** — Provisionner un nouveau numéro
  - [x] **PATCH /:id** — Mettre à jour un numéro
  - [x] **DELETE /:id** — Libérer un numéro
  - [x] **POST /search** — Rechercher des numéros disponibles
  - [x] **POST /provision** — Provisionner un numéro avec un fournisseur spécifique

### 🔹 Bases de connaissances
- [x] `knowledge-bases.ts` — Gestion des bases de connaissances
  - [x] **GET /** — Lister toutes les bases
  - [x] **GET /:id** — Récupérer une base par ID
  - [x] **POST /** — Créer une nouvelle base
  - [x] **PATCH /:id** — Mettre à jour une base
  - [x] **DELETE /:id** — Supprimer une base
  - [x] **POST /:id/query** — Interroger une base
  - [x] **POST /:id/files** — Ajouter un fichier à une base
  - [x] **DELETE /:id/files/:fileId** — Retirer un fichier d'une base

### 🔹 Fichiers
- [x] `files.ts` — Gestion des fichiers pour les bases de connaissances
  - [x] **GET /** — Lister tous les fichiers
  - [x] **GET /:id** — Récupérer les métadonnées d'un fichier
  - [x] **POST /** — Télécharger un nouveau fichier
  - [x] **DELETE /:id** — Supprimer un fichier
  - [x] **GET /:id/content** — Récupérer le contenu d'un fichier

### 🔹 Workflows
- [x] `workflows.ts` — Gestion des flux conversationnels
  - [x] **GET /** — Lister tous les workflows
  - [x] **GET /:id** — Récupérer un workflow par ID
  - [x] **POST /** — Créer un nouveau workflow
  - [x] **PATCH /:id** — Mettre à jour un workflow
  - [x] **DELETE /:id** — Supprimer un workflow
  - [x] **POST /:id/execute** — Exécuter un workflow

### 🔹 Squads
- [x] `squads.ts` — Gestion des équipes d'assistants
  - [x] **GET /** — Lister toutes les équipes
  - [x] **GET /:id** — Récupérer une équipe par ID
  - [x] **POST /** — Créer une nouvelle équipe
  - [x] **PATCH /:id** — Mettre à jour une équipe
  - [x] **DELETE /:id** — Supprimer une équipe
  - [x] **POST /:id/members** — Ajouter des membres à une équipe
  - [x] **DELETE /:id/members/:memberId** — Retirer un membre d'une équipe

### 🔹 Test Suites
- [x] `test-suites.ts` — Gestion des suites de tests
  - [x] **GET /** — Lister toutes les suites de tests
  - [x] **GET /:id** — Récupérer une suite de tests par ID
  - [x] **POST /** — Créer une nouvelle suite de tests
  - [x] **PATCH /:id** — Mettre à jour une suite de tests
  - [x] **DELETE /:id** — Supprimer une suite de tests

### 🔹 Test Suite Tests
- [x] `test-suite-tests.ts` — Gestion des tests individuels
  - [x] **GET /:suiteId** — Lister tous les tests d'une suite
  - [x] **GET /:suiteId/:testId** — Récupérer un test par ID
  - [x] **POST /:suiteId** — Créer un nouveau test dans une suite
  - [x] **PATCH /:suiteId/:testId** — Mettre à jour un test
  - [x] **DELETE /:suiteId/:testId** — Supprimer un test

### 🔹 Test Suite Runs
- [x] `test-suite-runs.ts` — Gestion des exécutions de tests
  - [x] **GET /:suiteId** — Lister toutes les exécutions d'une suite
  - [x] **GET /:suiteId/:runId** — Récupérer une exécution par ID
  - [x] **POST /:suiteId** — Démarrer une nouvelle exécution de tests
  - [x] **PATCH /:suiteId/:runId** — Mettre à jour une exécution
  - [x] **DELETE /:suiteId/:runId** — Supprimer une exécution

### 🔹 Webhooks
- [x] `webhooks.ts` — Gestion des webhooks et événements
  - [x] **GET /** — Lister tous les webhooks
  - [x] **GET /:id** — Récupérer un webhook par ID
  - [x] **POST /** — Créer un nouveau webhook
  - [x] **PATCH /:id** — Mettre à jour un webhook
  - [x] **DELETE /:id** — Supprimer un webhook
  - [x] **POST /:id/ping** — Tester un webhook
  - [x] **POST /receive** — Point d'entrée pour les événements Vapi

### 🔹 Fonctions (Tools)
- [x] `functions.ts` — Gestion des fonctions utilisables par les assistants
  - [x] **GET /** — Lister toutes les fonctions
  - [x] **GET /:id** — Récupérer une fonction par ID
  - [x] **POST /** — Créer une nouvelle fonction
  - [x] **PATCH /:id** — Mettre à jour une fonction
  - [x] **DELETE /:id** — Supprimer une fonction

### 🔹 Analytics
- [x] `analytics.ts` — Métriques et statistiques
  - [x] **GET /calls** — Obtenir des métriques sur les appels
  - [x] **GET /usage** — Récupérer les statistiques d'utilisation
  - [x] **GET /calls/:id/timeline** — Obtenir la chronologie d'un appel

### 🔹 Organisation
- [x] `organization.ts` — Gestion de l'organisation
  - [x] **GET /** — Récupérer les détails de l'organisation
  - [x] **PATCH /** — Mettre à jour l'organisation
  - [x] **GET /limits** — Obtenir les limites d'utilisation

---

## ✅ Phase 5 — Conclusion
La Phase 5 est maintenant complète ! Nous avons implémenté avec succès :
- 4 composants d'infrastructure partagée dans `_shared/`
- 15 Edge Functions couvrant toutes les fonctionnalités de l'API Vapi
- Chaque Edge Function suit la même architecture avec authentification, validation, et gestion d'erreurs standardisée
- Le frontend pourra interagir avec ces fonctions via `supabase.functions.invoke()` sans jamais accéder directement à l'API Vapi

### Prochaines étapes avant la Phase 6 :
- ✅ Déployer les fonctions Edge avec `supabase functions deploy`
  - ✅ Fonction de test
  - ✅ Fonction shared (utilitaires partagés)
  - ✅ Fonction assistants
  - ✅ Fonction calls
  - ✅ Tester la function assistant jusque vapi si possble
  - ✅ Fonction knowledge-bases
  - ⬜ Déployer les autres fonctions pour webhook, etc.

### Bonnes pratiques découvertes pour les Edge Functions :
- ✅ Utiliser un seul dossier pour les utilitaires partagés (`_shared/`)
- ✅ Toujours utiliser l'extension `.ts` pour les imports internes
- ✅ Passer systématiquement 4 arguments à `callVapiAPI` (avec `undefined` pour `body` si non utilisé)
- ✅ Typer explicitement les paramètres et retours de fonctions
- ✅ Utiliser les schémas de validation pour chaque endpoint

### Prochaines fonctions à déployer :
- ⬜ webhooks
- ⬜ files
- ⬜ workflows
- ⬜ squads
- ⬜ functions
- ⬜ organization
- ⬜ analytics
- ⬜ test-suites
- ⬜ test-suite-tests
- ⬜ test-suite-runs

### Instructions détaillées pour le déploiement des fonctions Edge

Pour déployer correctement toutes les fonctions Edge dans Supabase, suivez ces étapes :

1. **Restructurer les fichiers des fonctions**
   - Créer un dossier pour chaque fonction dans `supabase/functions/`
   - Déplacer chaque fonction dans son propre dossier avec un fichier `index.ts`
   - Exemple : `supabase/functions/assistants.ts` → `supabase/functions/assistants/index.ts`

2. **Mettre à jour les imports**
   - Corriger les chemins d'imports pour les utilitaires partagés
   - Utiliser des chemins relatifs comme `../shared/cors.ts` au lieu de `./_shared/cors.js`

3. **Gérer le code partagé**
   - Créer une fonction `shared` pour exporter tous les utilitaires communs
   - Importer de cette fonction partagée dans toutes les autres fonctions

4. **Déployer avec authentification**
   - Définir les variables d'environnement requises : `supabase secrets set VAPI_API_KEY=your_key`
   - Déployer chaque fonction : `supabase functions deploy <nom-fonction>`
   - Configurer les autorisations dans le dashboard Supabase

5. **Tester les fonctions déployées**
   - Utiliser un outil comme Postman ou cURL avec l'en-tête d'authentification approprié
   - Format : `Authorization: Bearer <anon-key ou service-role-key>`
   - Tester différents endpoints et vérifier les réponses

6. **Déboguer les problèmes**
   - Utiliser `supabase functions logs <nom-fonction>` pour voir les logs d'exécution
   - Créer des fonctions de test simples pour isoler les problèmes

En suivant ce processus méthodique, vous pourrez déployer et tester efficacement toutes les fonctions Edge.

---

## 🛠️ Consignes de migration Edge Functions Vapi

### Bonnes pratiques pour la migration
- **Utiliser uniquement des appels HTTP directs** (`fetch`) vers l'API Vapi dans les Edge Functions, pas le SDK Vapi (incompatible avec Deno/Supabase).
- Centraliser la logique d'appel HTTP dans une fonction utilitaire partagée (`callVapiAPI`).
- Factoriser les headers CORS, l'authentification, la gestion d'erreur et la validation dans le dossier `_shared/`.
- Toujours typer explicitement les paramètres de fonction (évite les erreurs TypeScript/Deno).
- Utiliser des schémas de validation pour chaque endpoint (création, update, query, etc.).

### Erreurs courantes à éviter
- **Noms réservés** : ne jamais utiliser `delete`, `update`, etc. comme noms de variables ou fonctions. Préférer `deleteAssistant`, `updateKnowledgeBase`, etc.
- **Imports** :
  - Toujours utiliser des chemins relatifs avec l'extension `.ts` pour les imports dans Deno/Supabase (ex : `../shared/cors.ts`).
  - Ne pas importer de `.js` ou de modules non compatibles Deno.
- **Appels à callVapiAPI** :
  - Toujours passer 4 arguments (`endpoint`, `apiKey`, `method`, `body`), même si `body` est `undefined` pour les requêtes GET/DELETE.
  - **Pas de double await** : ne pas faire `await (await callVapiAPI(...))`.
  - **Pas de VapiClient** : ne pas instancier ou utiliser `VapiClient` dans les Edge Functions (SDK non supporté).

### Processus de migration recommandé
1. **Copier la structure de la fonction `/assistants`** (qui fonctionne) pour chaque nouvelle fonction.
2. **Supprimer tout import ou usage du SDK Vapi**.
3. **Injecter la fonction utilitaire `callVapiAPI`** si elle n'est pas déjà partagée.
4. **Adapter tous les endpoints** pour correspondre à la documentation Vapi (vérifier les chemins et méthodes HTTP).
5. **Renommer les variables/fonctions problématiques** (reserved words).
6. **Déployer et tester chaque fonction individuellement** avec `supabase functions deploy <nom>` et un outil comme Postman/cURL.
7. **Vérifier les logs** avec `supabase functions logs <nom>` en cas d'erreur.
8. **Documenter chaque endpoint** (format, params, réponses) pour faciliter l'intégration frontend.

### Rappels
- Toujours relire et tester manuellement après migration automatique.
- Mettre à jour la documentation technique à chaque modification majeure.
- Utiliser le dashboard Supabase pour vérifier le bon déploiement et l'authentification.
- Préparer des scripts de rollback en cas de problème de migration.

---

## 🧪 Phase 6 — Intégration frontend initiale
- [ ] Créer les pages `app/assistants/`, `app/workflows/`, etc.
- [ ] Créer les composants UI réutilisables (`components/`)
- [ ] Intégrer les appels aux Edge Functions
- [ ] Ajouter les formulaires de création/édition d'assistants

---

## 🎙️ Phase 7 — Vapi Call Flow
- [ ] Générer un assistant test via l'UI
- [ ] Déployer un numéro de téléphone (via Vapi ou Twilio)
- [ ] Configurer le webhook `POST /webhooks` dans le dashboard Vapi
- [ ] Tester un appel complet et vérifier la base de données Supabase

---

## 🔁 Phase 8 — Tests, Debug & Logs
- [ ] Ajouter la gestion des logs dans `logs.ts` (Supabase)
- [ ] Ajouter un système de monitoring (ex. `lib/logger.ts`)
- [ ] Simuler différents cas de conversation
- [ ] Écrire des tests fonctionnels pour `assistants`, `calls`, `webhooks`

---

## 🚀 Phase 9 — Déploiement
- [ ] Déployer le frontend (Vercel, Netlify ou Docker)
- [ ] Déployer les fonctions Supabase avec `supabase functions deploy`
- [ ] Ajouter un domaine personnalisé
- [ ] Vérifier la scalabilité des appels vocaux (limites API Vapi)

---

## 🧩 Phase 10 — Add-ons & No-code
- [ ] Ajouter une interface drag-and-drop (ReactFlow)
- [ ] Ajouter une intégration Make.com / Zapier via webhook Supabase
- [ ] Ajouter des assistants templates (secrétaire, médecin, avocat…)
- [ ] Générer des assistants en moins de 5 minutes (UX simplifiée)