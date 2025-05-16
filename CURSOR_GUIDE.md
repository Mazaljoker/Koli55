"""# 🧠 Guide Cursor pour le projet Allokoli

Ce fichier est destiné à t’aider à tirer le meilleur parti de l’IA de Cursor pour développer plus vite et plus proprement Allokoli.

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

## ✅ Bonnes pratiques Cursor

### 1. Structure de projet lisible
- Nomme les dossiers logiquement (`assistants/`, `calls/`, `webhooks/`, etc.)
- Chaque Edge Function = 1 fichier dans `supabase/functions/`

### 2. Commence chaque fichier par un commentaire clair
```ts
// Fonction Supabase pour créer, modifier et lister les assistants Vapi