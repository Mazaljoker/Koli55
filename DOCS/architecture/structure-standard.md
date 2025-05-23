# Structure Standard du Projet AlloKoli

## Objectif

Ce document définit la structure officielle du projet AlloKoli pour garantir la clarté, la maintenabilité et la cohérence entre tous les développeurs.

---

## Arborescence recommandée

```
Koli55/
│
├── frontend/                # Tout le code Next.js (App Router, composants, hooks, styles, etc.)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   ├── styles/
│   ├── hooks/
│   ├── context/
│   ├── types/
│   ├── package.json
│   └── ... (autres fichiers Next.js)
│
├── supabase/                # Uniquement la partie Edge Functions, migrations, policies, etc.
│   ├── functions/
│   │   ├── assistants/
│   │   │   └── index.ts    # La SEULE source de vérité pour la fonction assistants
│   │   ├── ... (autres fonctions edge)
│   ├── migrations/
│   ├── shared/             # Code partagé pour les fonctions edge
│   └── ... (autres dossiers supabase)
│
├── backend/                 # (Optionnel) Pour du code backend pur Node.js, scripts, outils, mais PAS de fonctions edge supabase ici !
│   ├── lib/
│   └── ... (autres utilitaires backend, si besoin)
│
├── DOCS/                    # Documentation technique, guides, etc.
│
├── .env                     # Variables d'environnement globales (jamais de secret ici, juste des clés publiques)
├── .env.example
├── README.md
├── package.json             # (scripts globaux, outils, etc.)
└── ... (autres fichiers racine)
```

---

## Règles à respecter

- **Une seule source de vérité pour les Edge Functions** :
  Toutes les fonctions Supabase Edge doivent être dans `supabase/functions/` et **jamais** dans `backend/`.
- **Pas de duplication de code de fonction** :
  Si tu veux partager du code entre plusieurs fonctions, mets-le dans `supabase/shared/` et importe-le.
- **Le backend pur (Node.js, scripts, etc.)** va dans `backend/` mais ne doit jamais contenir de fonctions Edge Supabase.
- **Le frontend** ne doit jamais contenir de logique backend ou de fonctions Edge.
- **Les migrations, policies, seeds** restent dans `supabase/migrations/`.
- **Les variables d'environnement** :
  - `.env` à la racine pour les variables partagées (jamais de secrets privés ici)
  - Les secrets (clé Vapi, etc.) doivent être configurés dans l'interface Supabase Cloud, jamais dans le code.

---

## Bonnes pratiques

- **Documenter** toute nouvelle fonction ou modification majeure dans ce dossier `DOCS/`.
- **Nommer clairement** les dossiers et fichiers selon leur usage (voir conventions Next.js et Supabase).
- **Ne jamais commiter de secrets** dans le code ou dans `.env`.
- **Utiliser des branches descriptives** pour chaque feature ou bugfix (voir règles Git).
- **Vérifier la cohérence** de la structure avant tout merge.

---

## Pourquoi cette structure :

- **Clarté** : On sait toujours où modifier/déployer une fonction Edge.
- **Maintenance** : Plus de bug de « quelle version est déployée ? ».
- **Onboarding** : Un nouveau dev comprend tout de suite où coder quoi.
- **CI/CD** : Plus simple à automatiser (tests, déploiement, etc.).

---

## À faire en cas de refonte ou migration

1. Déplacer tout le code de fonction Edge (ex : `assistants/index.ts`) dans `supabase/functions/assistants/index.ts`.
2. Supprimer tout dossier `supabase/functions` ou `functions` dans `backend/`.
3. Déplacer le code partagé entre fonctions Edge dans `supabase/shared/`.
4. Vérifier que tous les imports dans les Edge Functions pointent bien vers `supabase/shared/` ou des dépendances node_modules.
5. Nettoyer le backend : garder ici uniquement les scripts, outils, ou API Node.js qui ne sont pas des Edge Functions Supabase.
6. Mettre à jour les scripts de déploiement pour ne déployer que depuis `supabase/functions/`.
7. Documenter la structure dans le `README.md` pour que toute l'équipe suive la même logique.

---

**Ce fichier fait foi pour toute l'équipe. Toute modification de structure doit être validée et documentée ici.** 