## 🏗️ Phase 1 — Initialisation du projet (Structure + Stack)
- [ ] Créer le monorepo `allokoli/` avec la structure suivante :
  - `src/`, `supabase/functions/`, `public/`, `lib/`, etc.
- [ ] Initialiser `pnpm` ou `npm` avec `package.json`
- [ ] Installer les dépendances de base (Next.js, Supabase client, TailwindCSS)
- [ ] Créer `tsconfig.json`, `tailwind.config.ts`, `postcss.config.js`

---

## 🧠 Phase 2 — Contexte & Documentation
- [ ] Générer tous les fichiers `.md` internes (`README.md`, `CONTEXT.md`, `API_FLOW.md`, etc.)
- [ ] Écrire les principes du projet (dans `CONTEXT.md`)
- [ ] Ajouter un guide de collaboration avec Cursor dans `CURSOR_GUIDE.md`

---

## 🔐 Phase 3 — Authentification & Supabase
- [ ] Créer le projet Supabase en ligne
- [ ] Connecter le projet local à Supabase avec `supabase link`
- [ ] Activer Supabase Auth (email/password ou magic link)
- [ ] Ajouter le rôle `user` + les règles RLS de sécurité
- [ ] Créer le client `lib/supabaseClient.ts`

---

## 🧩 Phase 4 — Génération du SDK Vapi (client)
- [ ] Télécharger la spec OpenAPI de Vapi (`https://api.vapi.ai/api-json`)
- [ ] Générer un SDK TypeScript avec Orval
- [ ] Organiser le code généré dans `lib/vapiClient.ts`

---

## 🧠 Phase 5 — Fonctions Supabase Edge (1 par route Vapi)

### 🔹 Assistants
- [ ] `assistants.ts` — GET / POST / PATCH / DELETE

### 🔹 Calls
- [ ] `calls.ts` — GET / POST / PATCH / DELETE

### 🔹 Phone Numbers
- [ ] `phone-numbers.ts` — GET / POST / PATCH / DELETE

### 🔹 Knowledge Bases
- [ ] `knowledge-base.ts` — GET / POST / PATCH / DELETE

### 🔹 Workflows
- [ ] `workflows.ts` — GET / POST / PATCH / DELETE

### 🔹 Webhooks
- [ ] `webhooks.ts` — Gestion des events Vapi (server/client messages)

### 🔹 Tools / Files / Logs / Analytics
- [ ] Créer les fichiers correspondants dans `functions/` si utilisés

---

## 🧪 Phase 6 — Intégration frontend initiale
- [ ] Créer les pages `app/assistants/`, `app/workflows/`, etc.
- [ ] Créer les composants UI réutilisables (`components/`)
- [ ] Intégrer les appels aux Edge Functions
- [ ] Ajouter les formulaires de création/édition d’assistants

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
"""