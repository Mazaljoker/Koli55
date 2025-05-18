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

### 🔹 Tests et qualité
- [x] Créer une structure de test pour les Edge Functions (`supabase/functions/test/`)
- [x] Développer des fichiers de test HTTP pour chaque fonction principale
- [x] Créer des scripts d'aide au test (`run-tests.ps1`, `test-env.js`)
- [x] Documenter la procédure de test des Edge Functions

---

## 💿 Phase 6.0 — Création de la Base de Données (Supabase Tables)
- [x] **Définir et créer la table `assistants`**
- [x] **Adapter la fonction Edge `assistants` pour utiliser la table `assistants`**
- [ ] **Définir et créer d'autres tables nécessaires** (ex: `workflows`, `calls`, etc.)

---

## 🔄 Phase 6.1 — Refonte complète du frontend
- [x] **Migration du code déprécié**
  - [x] Déplacer le dossier `app/` vers `DEPRECATED/`
  - [x] Supprimer le dossier `frontend/` temporaire
  - [x] Mettre à jour la documentation pour refléter ces changements
- [ ] **Planification de la nouvelle architecture**
  - [x] Définir la structure de dossiers (voir `MIGRATION.md`)
  - [ ] Définir les standards de composants et de code
  - [ ] Créer des maquettes ou wireframes pour les interfaces clés
- [ ] **Création de la nouvelle structure**
  - [ ] Initialiser le nouveau projet Next.js
  - [ ] Configurer TailwindCSS avec les thèmes et styles de base
  - [ ] Mettre en place les composants UI de base
- [ ] **Développement des fonctionnalités principales**
  - [ ] **Authentification**
    - [ ] Page de connexion
    - [ ] Page d'inscription
    - [ ] Récupération de mot de passe
  - [ ] **Layout et navigation**
    - [ ] Layout principal avec sidebar responsive
    - [ ] Navigation entre les différentes sections
  - [ ] **Gestion des assistants**
    - [ ] Liste des assistants
    - [ ] Création d'assistant
    - [ ] Détail d'un assistant
    - [ ] Test d'un assistant
    - [ ] Édition d'un assistant
  - [ ] **Gestion des bases de connaissances**
    - [ ] Création et édition de bases de connaissances
    - [ ] Upload de fichiers
  - [ ] **Dashboard et statistiques**
    - [ ] Vue d'ensemble des assistants
    - [ ] Métriques d'utilisation
  - [ ] **Paramètres et configuration**
    - [ ] Profil utilisateur
    - [ ] Paramètres du compte
    - [ ] Clés API

---

## 📚 Phase 7 — Documentation complète
- [x] **Structure de documentation** dans `/DOCS`
- [x] **README principal** pour présenter le projet
- [x] **Documentation des assistants** (`DOCS/assistants.md`)
- [x] **Documentation du processus de migration** (`MIGRATION.md`)
- [x] **Guide de déploiement** (`DOCS/deployment.md`)
- [x] **Guide d'intégration API** (`DOCS/api_integration.md`)
- [x] **Guide de développement** (`DOCS/development_guide.md`)
- [x] **Documentation des routes** (`ROUTES.md`)
- [ ] **Exemples et guides d'utilisation**
  - [ ] **TODO PRIORITAIRE:** Guide complet de création d'un assistant avec options avancées
  - [ ] **TODO PRIORITAIRE:** Tutoriel d'intégration d'une base de connaissances
  - [ ] Tutoriel d'utilisation des webhooks
  - [ ] Exemples de personnalisation d'assistants
- [ ] **Diagrammes et visuels**
  - [ ] **TODO PRIORITAIRE:** Diagramme de l'architecture complète
  - [ ] Diagramme du flux utilisateur
  - [ ] Diagramme des interactions API
- [ ] **Tutoriels pas-à-pas** pour les cas d'usage courants
- [ ] **Documentation de la nouvelle architecture frontend**
  - [ ] Guide des composants
  - [ ] Standards de code
  - [ ] Workflow de développement

---

## 🚀 Phase 8 — Déploiement et tests finaux
- [ ] **Mise en place des environnements**
  - [ ] **TODO PRIORITAIRE:** Configuration de l'environnement de staging
  - [ ] Configuration de l'environnement de production
- [ ] **Tests unitaires et d'intégration**
  - [ ] **TODO PRIORITAIRE:** Tests des fonctionnalités clés (authentification, création d'assistant)
  - [ ] Tests des Edge Functions
  - [ ] Tests de l'interface utilisateur
- [ ] **Déploiement**
  - [ ] Déploiement sur Vercel (frontend)
  - [ ] Déploiement sur Supabase (Edge Functions)
- [ ] **Tests utilisateurs**
  - [ ] **TODO PRIORITAIRE:** Tests avec un groupe restreint (5-10 utilisateurs)
  - [ ] Collecte et analyse du feedback
  - [ ] Correction des bugs identifiés

---

## 🎯 Phase 9 — Lancement et amélioration continue
- [ ] **Préparation au lancement**
  - [ ] Finalisation des corrections de bugs critiques
  - [ ] Mise en place des outils de monitoring (Sentry, Datadog, etc.)
  - [ ] Préparation des documents légaux (CGU, mentions légales)
- [ ] **Lancement officiel**
  - [ ] Annonce sur les réseaux sociaux
  - [ ] Communication aux partenaires et beta-testeurs
- [ ] **Suivi post-lancement**
  - [ ] Collecte de feedback des premiers utilisateurs
  - [ ] Analyse des métriques d'utilisation
  - [ ] Identification des axes d'amélioration prioritaires
- [ ] **Itérations et évolutions**
  - [ ] Améliorations de l'UI/UX basées sur le feedback
  - [ ] Ajout de fonctionnalités demandées par les utilisateurs
  - [ ] Optimisation des performances (frontend et backend) 