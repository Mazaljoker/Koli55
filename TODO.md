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
- [x] `shared/cors.ts` — Gestion des headers CORS
- [x] `shared/auth.ts` — Vérification de l'authentification
- [x] `shared/errors.ts` — Gestion standardisée des erreurs
- [x] `shared/validation.ts` — Validation des données entrantes

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
- 4 composants d'infrastructure partagée dans `shared/`
- 15 Edge Functions couvrant toutes les fonctionnalités de l'API Vapi
- Chaque Edge Function suit la même architecture avec authentification, validation, et gestion d'erreurs standardisée
- Le frontend pourra interagir avec ces fonctions via `supabase.functions.invoke()` sans jamais accéder directement à l'API Vapi

Pour les bonnes pratiques, leçons apprises et consignes de migration concernant les Edge Functions, veuillez consulter le fichier `EDGE_FUNCTIONS_GUIDE.md`.

---

## 💿 Phase 6.0 — Création de la Base de Données (Supabase Tables)
- [x] **Définir et créer la table `assistants`:**
  - [x] Champs suggérés : `id` (UUID, primary key), `vapi_assistant_id` (TEXT, nullable, unique, pour référence à l'ID Vapi si différent), `name` (TEXT, not null), `model` (TEXT), `language` (TEXT), `voice` (TEXT), `first_message` (TEXT), `system_prompt` (TEXT, nullable), `created_at` (TIMESTAMPTZ, default now()), `updated_at` (TIMESTAMPTZ, default now()).
  - [x] **Note Importante :** Aligner autant que possible les champs de la table avec les schémas de données de l'API Vapi pour les assistants.
  - [x] (Optionnel) Ajouter des index pertinents (ex: sur `vapi_assistant_id`).
- [x] **Adapter la fonction Edge `assistants` pour utiliser la table `assistants`:**
  - [x] `GET /assistants` (lister)
  - [x] `POST /assistants` (créer)
  - [x] `GET /assistants/:id` (récupérer)
  - [x] `PATCH /assistants/:id` (mettre à jour)
  - [x] `DELETE /assistants/:id` (supprimer)

### Méthodologie d'adaptation des Edge Functions (exemple `assistants`):
1.  **Définition du Schéma de Table Supabase:**
    *   Créer une table dans Supabase (ex: `public.assistants`) pour stocker les données de l'entité.
    *   Aligner les champs de la table avec les schémas de l'API Vapi, en ajoutant les champs internes nécessaires (`id`, `user_id`, `created_at`, `updated_at`, `vapi_entity_id`).
    *   Mettre en place les clés étrangères (ex: `user_id` vers `auth.users(id)`), les index, et les triggers (ex: pour `updated_at`).
2.  **Modification de la Fonction Edge (pour chaque route CRUD):**
    *   **`GET /entities` (Lister):**
        *   Récupérer l'utilisateur authentifié.
        *   Interroger la table Supabase pour lister les entités appartenant à l'utilisateur, avec pagination.
    *   **`POST /entities` (Créer):**
        *   Récupérer l'utilisateur authentifié.
        *   Valider les données d'entrée.
        *   Insérer les données initiales dans la table Supabase (avec `user_id`).
        *   Appeler l'API Vapi pour créer l'entité sur leur plateforme.
        *   Si succès Vapi, mettre à jour l'enregistrement Supabase avec le `vapi_entity_id` retourné par Vapi.
        *   Gérer les cas d'erreur (échec DB, échec Vapi, échec de la mise à jour Vapi ID).
    *   **`GET /entities/:id` (Récupérer par ID DB):**
        *   Récupérer l'utilisateur authentifié.
        *   Interroger la table Supabase par `id` et `user_id`.
    *   **`PATCH /entities/:id` (Mettre à jour par ID DB):**
        *   Récupérer l'utilisateur authentifié.
        *   Récupérer l'entité existante de Supabase (pour `vapi_entity_id` et vérification de propriété).
        *   Valider et préparer les données de mise à jour.
        *   Mettre à jour l'enregistrement dans Supabase.
        *   Si `vapi_entity_id` existe et que des champs pertinents ont changé, appeler l'API Vapi pour mettre à jour l'entité sur leur plateforme.
        *   Gérer les cas d'erreur.
    *   **`DELETE /entities/:id` (Supprimer par ID DB):**
        *   Récupérer l'utilisateur authentifié.
        *   Récupérer l'entité existante de Supabase (pour `vapi_entity_id` et vérification de propriété).
        *   Si `vapi_entity_id` existe, appeler l'API Vapi pour supprimer l'entité sur leur plateforme.
        *   Si succès Vapi (ou si pas de `vapi_entity_id`), supprimer l'enregistrement de Supabase.
        *   Gérer les cas d'erreur (surtout si la suppression Vapi échoue, décider si la suppression DB doit quand même avoir lieu).
3.  **Redéploiement de la fonction Edge** avec `supabase functions deploy <nom_fonction>`.

**Note Importante:** Cette méthodologie devra être appliquée aux autres fonctions Edge (`calls`, `messages`, etc.) lorsqu'elles seront migrées pour utiliser des tables Supabase dédiées.

- [ ] (À faire plus tard) Définir et créer d'autres tables nécessaires (ex: `workflows`, `calls`, `knowledge_bases`, `squads`, `analytics_data`, etc.) en suivant le même principe d'alignement avec les schémas Vapi.

---

## 🧪 Phase 6 — Intégration frontend initiale

### Pages à créer (Priorisation)

#### Tier 1: Essentiel pour Core Vapi Functionality & User Access
- [x] **Layout Principal (`app/layout.tsx`):** Structure globale, navigation, footer. (Marqué comme suffisant pour l'instant)
- [x] **Dashboard/Home Page (`app/page.tsx`):** Landing page post-login. (Simplifié pour l'instant)
- [x] **Authentification:**
  - [x] Login: `app/auth/login/page.tsx` (Logique de base implémentée)
  - [x] Register: `app/auth/register/page.tsx` (Logique de base implémentée)
  - [ ] (Optionnel) Forgot Password: `app/auth/forgot-password/page.tsx`
- [x] **Gestion des Assistants (CRUD UI):**
  - [x] Lister: `app/assistants/page.tsx`
    - [x] Implémenter la récupération des assistants via Supabase Functions.
  - [x] Créer: `app/assistants/new/page.tsx`
    - [x] Implémenter la soumission du formulaire de création via Supabase Functions.
  - [x] Voir détails: `app/assistants/[id]/page.tsx` (Implémenté)
  - [x] Éditer: `app/assistants/[id]/edit/page.tsx` (Implémenté)
  - [x] Implémenter la suppression d'un assistant depuis la liste ou la page de détails (Frontend)
- [ ] **Gestion des Workflows:** (Si UI distincte des Assistants)
  - [ ] Lister: `app/workflows/page.tsx`
  - [ ] Créer: `app/workflows/new/page.tsx`
  - [ ] Éditer: `app/workflows/[id]/edit/page.tsx`
  - [ ] Voir Détails: `app/workflows/[id]/page.tsx`
- [ ] **Interaction & Historique des Appels:**
  - [ ] Interface d'Appel (Composant/Modal majeur, ex: utilisant Vapi Blocks)
  - [ ] Logs/Historique des Appels: `app/calls/page.tsx`
  - [ ] Détails d'Appel: `app/calls/[callId]/page.tsx`
- [ ] **Composants UI Réutilisables (`components/`):**
  - [ ] Explorer la bibliothèque Vapi Blocks ([https://www.vapiblocks.com/docs](https://www.vapiblocks.com/docs)) pour les composants UI et le hook `use-vapi.ts` pour l'intégration client Vapi.
- [ ] **Intégration des Appels aux Edge Functions:** (Tâche continue pendant la création des pages)
- [ ] **Formulaires de Création/Édition:** (Tâche continue)

#### Tier 2: Fonctionnalités Vapi Avancées
- [ ] **Gestion des Appels (Calls):**
  - [ ] Lister: `app/calls/page.tsx`
  - [ ] Créer: `app/calls/new/page.tsx`
  - [ ] Éditer: `app/calls/[id]/edit/page.tsx`
  - [ ] Voir Détails: `app/calls/[callId]/page.tsx`

#### Tier 3: Configuration Essentielle & Gestion des Ressources
- [ ] **Gestion des Numéros de Téléphone:**
  - [ ] Lister: `app/phone-numbers/page.tsx`
  - [ ] Provisionner/Rechercher: `app/phone-numbers/provision/page.tsx`
- [ ] **Gestion des Bases de Connaissances:**
  - [ ] Lister: `app/knowledge-bases/page.tsx`
  - [ ] Créer: `app/knowledge-bases/new/page.tsx`
  - [ ] Éditer: `app/knowledge-bases/[id]/edit/page.tsx`
  - [ ] Gérer Fichiers (intégré à l'édition/détail)
- [ ] **Configuration des Webhooks:**
  - [ ] Lister/Gérer: `app/webhooks/page.tsx`

#### Tier 4: Administration Générale & Paramètres Utilisateur (Moins prioritaire pour l'intégration initiale)
- [ ] **Paramètres de l'Organisation:**
  - [ ] Voir/Éditer Détails & Limites: `app/organization/page.tsx`
- [ ] **Profil Utilisateur:**
  - [ ] Voir/Éditer Profil: `app/profile/page.tsx`

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