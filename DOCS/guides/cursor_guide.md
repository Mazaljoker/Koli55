"""# 🧠 Guide Cursor pour le projet Allokoli

Ce fichier est destiné à t'aider à tirer le meilleur parti de l'IA de Cursor pour développer plus vite et plus proprement Allokoli.

---

## 🚀 Comment Cursor fonctionne

Cursor lit automatiquement :
- `README.md`, `TODO.md`, `CURSOR_GUIDE.md`, `ARCHITECTURE.md`, etc.
- Les fichiers `.md` ouverts ou liés à ceux que tu modifies
- Les commentaires dans ton code TypeScript

Il utilise ces données pour :
- Générer du code ou des fonctions
- Ajouter des tests
- Corriger ou refactorer du code
- Te proposer une explication ou une suggestion adaptée au projet

---

## 📁 Structure du projet

```
Koli55/
├── app/                  # Interface utilisateur Next.js (App Router)
│   ├── assistants/       # Pages de gestion des assistants
│   ├── workflows/        # Pages de gestion des workflows
│   ├── layout.tsx        # Layout principal
│   └── page.tsx          # Page d'accueil
├── components/           # Composants UI réutilisables
├── lib/                  # Bibliothèques et utilitaires
│   ├── supabaseClient.ts # Client Supabase configuré
│   ├── vapiClient.ts     # Client Vapi.ai pour le frontend
│   ├── vapiServerClient.ts # Client Vapi.ai pour les Edge Functions
│   └── logger.ts         # Utilitaires de logging
├── public/               # Ressources statiques
├── supabase/             # Backend Supabase
│   └── functions/        # Edge Functions (Phase 5)
│       ├── _shared/      # Utilitaires partagés entre fonctions
│       │   ├── cors.ts   # Gestion des CORS
│       │   ├── auth.ts   # Middleware d'authentification
│       │   ├── errors.ts # Gestion standardisée des erreurs
│       │   └── validation.ts # Validation des entrées
│       ├── assistants.ts # Gestion des assistants
│       ├── calls.ts      # Gestion des appels
│       ├── messages.ts   # Gestion des messages
│       ├── phone-numbers.ts # Gestion des numéros
│       ├── knowledge-bases.ts # Bases de connaissances
│       ├── files.ts      # Gestion des fichiers
│       ├── workflows.ts  # Gestion des workflows
│       ├── squads.ts     # Gestion des équipes d'assistants
│       ├── webhooks.ts   # Point d'entrée des événements Vapi
│       └── ...           # Autres fonctions (analytics, etc.)
└── DOCS/                 # Documentation détaillée
```

## ✅ Bonnes pratiques Cursor

### 1. Structure de projet lisible
- Nomme les dossiers logiquement (`assistants/`, `calls/`, `webhooks/`, etc.)
- Chaque Edge Function = 1 fichier dans `supabase/functions/`
- Utilise le dossier `_shared` pour le code réutilisable entre fonctions

### 2. Commence chaque fichier par un commentaire clair
```ts
/**
 * Fonction Supabase Edge pour la gestion des assistants Vapi
 * Endpoints:
 * - GET / - Liste tous les assistants
 * - GET /:id - Récupère un assistant par ID
 * - POST / - Crée un nouvel assistant
 * - PATCH /:id - Met à jour un assistant
 * - DELETE /:id - Supprime un assistant
 */
```

### 3. Conventions pour les Edge Functions (Phase 5)
- Utiliser Deno et les standards Supabase pour les Edge Functions
- Structurer chaque fonction pour gérer différentes méthodes HTTP
- Intégrer systématiquement l'authentification via `_shared/auth.ts`
- Utiliser `_shared/errors.ts` pour les réponses d'erreur standardisées
- Valider toutes les entrées avec `_shared/validation.ts`
- Tester les fonctions localement avec `supabase functions serve`

### 4. Pattern d'implémentation des Edge Functions
```ts
// Exemple de structure pour une fonction Edge
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'
import { authenticate } from '../_shared/auth.ts'
import { validateInput } from '../_shared/validation.ts'
import { errorResponse } from '../_shared/errors.ts'
import { vapiServerClient } from '../_shared/vapiServer.ts'

serve(async (req) => {
  // Gestion des CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Authentification
    const user = await authenticate(req)
    
    // Routage basique
    const url = new URL(req.url)
    const path = url.pathname.split('/')
    const id = path[path.length - 1]
    
    // Gestion des différentes méthodes HTTP
    if (req.method === 'GET') {
      // ...
    } else if (req.method === 'POST') {
      // ...
    } else if (req.method === 'PATCH') {
      // ...
    } else if (req.method === 'DELETE') {
      // ...
    }
    
  } catch (error) {
    return errorResponse(error)
  }
})
```

### 5. Demandes à Cursor
- Sois spécifique dans tes requêtes ("Crée une Edge Function pour gérer les assistants")
- Mentionne les technologies concernées ("en utilisant Deno et le SDK Vapi")
- Précise le contexte ("pour implémenter l'endpoint GET /:id")