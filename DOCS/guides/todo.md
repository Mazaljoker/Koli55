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
- [x] `shared/vapi.ts` — Interfaces et fonctions d'appel à l'API Vapi

### 🔹 Documentation des Edge Functions
- [x] Documenter les interfaces et types pour chaque fonction dans `shared/vapi.ts`
- [x] Documenter les endpoints gérés par chaque fonction Edge
- [x] Documenter les variables d'entrée (requêtes) pour chaque endpoint
- [x] Documenter les variables de sortie (réponses) pour chaque endpoint
- [x] Référencer les schémas de validation dans la documentation

### 🔹 Implémentation des Edge Functions
- [x] Assistants (`assistants.ts`)
- [x] Appels (`calls.ts`)
- [x] Messages (`messages.ts`)
- [x] Numéros de téléphone (`phone-numbers.ts`)
- [x] Bases de connaissances (`knowledge-bases.ts`)
- [x] Fichiers (`files.ts`)
- [x] Workflows (`workflows.ts`)
- [x] Squads (`squads.ts`)
- [x] Test Suites (`test-suites.ts`)
- [x] Test Suite Tests (`test-suite-tests.ts`)
- [x] Test Suite Runs (`test-suite-runs.ts`)
- [x] Webhooks (`webhooks.ts`)
- [x] Fonctions/Tools (`functions.ts`)
- [x] Analytics (`analytics.ts`)
- [x] Organisation (`organization.ts`)

---

## 💿 Phase 6.0 — Création de la Base de Données (Supabase Tables)
- [x] **Définir et créer la table `assistants`**
- [x] **Adapter la fonction Edge `assistants` pour utiliser la table `assistants`**
- [ ] **Définir et créer d'autres tables nécessaires** (ex: `workflows`, `calls`, etc.)

---

## 🧪 Phase 6.1 — Intégration frontend initiale
- [x] **Layout Principal** (`app/layout.tsx`)
- [x] **Dashboard/Home Page** (`app/page.tsx`)
- [x] **Authentification** (login, register)
- [ ] **Création et gestion des assistants**
- [ ] **Gestion des bases de connaissances**
- [ ] **Configuration des workflows**
- [ ] **Visualisation des métriques d'appel**

---

## 📚 Phase 7 — Documentation complète
- [x] **Structure de documentation** dans `/DOCS`
- [x] **README principal** pour présenter le projet
- [x] **Documentation des assistants** (`DOCS/assistants.md`)
- [x] **Guide de déploiement** (`DOCS/deployment.md`)
- [x] **Guide d'intégration API** (`DOCS/api_integration.md`)
- [x] **Guide de développement** (`DOCS/development_guide.md`)
- [ ] **Génération de diagrammes** pour la documentation
- [ ] **Exemples complets** pour chaque entité
- [ ] **Tutoriels pas-à-pas** pour les cas d'usage courants

---

## 🚀 Phase 8 — Déploiement et tests finaux
- [ ] **Tests d'intégration** pour les fonctionnalités clés
- [ ] **Déploiement sur Vercel** (frontend)
- [ ] **Déploiement sur Supabase** (Edge Functions)
- [ ] **Tests utilisateurs** avec un groupe restreint
- [ ] **Correction des bugs** identifiés lors des tests

---

## 🎯 Phase 9 — Lancement et amélioration continue
- [ ] **Lancement officiel** de la plateforme
- [ ] **Collecte de feedback** des premiers utilisateurs
- [ ] **Itérations rapides** sur les fonctionnalités prioritaires
- [ ] **Optimisation des performances** (frontend et backend)
- [ ] **Documentation utilisateur** complète et tutoriels vidéo 