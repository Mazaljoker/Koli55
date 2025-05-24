# Guide de Contribution pour AlloKoli

Merci de contribuer au projet AlloKoli! Voici les règles à suivre pour maintenir la qualité du code et la cohérence du projet.

## Règles Git Workflow

- Utiliser des branches descriptives pour chaque feature ou bugfix (exemple: `feature/ajout-auth`)
- Faire des commits atomiques avec des messages explicites en anglais
- Les pull requests doivent être relues avant merge
- La CI doit lancer les tests et vérifier la qualité du code avant tout merge sur main
- Aucun secret ou credential ne doit jamais être commité dans le repo

## Processus de Pull Request

1. Créez une branche à partir de `main` avec un nom descriptif
2. Développez votre fonctionnalité ou correction de bug
3. Testez localement votre code
4. Poussez votre branche et créez une pull request
5. Attendez la revue de code et les vérifications CI
6. Une fois approuvée, la PR peut être fusionnée

## Structure du Projet

Respectez la structure du projet telle que définie dans la documentation:

- `/frontend` : Application Next.js principale (App Router)
- `/supabase` : Fonctions Edge et migrations Supabase
- `/lib` : Bibliothèques partagées
- `/DOCS` : Documentation complète du projet

## Règles de Codage

Consultez les fichiers de documentation dans le dossier `/DOCS` pour les règles spécifiques concernant:
- Frontend (Next.js, Tailwind CSS, Ant Design)
- Backend (Supabase Edge Functions)
- Authentification et sécurité
- UI/UX

## Variables d'Environnement

Ne jamais committer les fichiers contenant des variables d'environnement (`.env`, `.env.local`). Utilisez les fichiers d'exemple (`.env.example`, `.env.local.example`) pour documenter les variables nécessaires.
