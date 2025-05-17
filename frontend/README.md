# Koli55 Frontend

Ce dossier contient la partie frontend du projet Koli55, développée avec Next.js et Tailwind CSS.

## Utilisation avec Bolt

Ce dossier est conçu pour être utilisé avec [Bolt.diy](https://bolt.diy), un outil d'IA pour le développement d'interface utilisateur.

### Comment ouvrir ce projet avec Bolt

1. Ouvrez Bolt.diy
2. Sélectionnez "Open an existing project"
3. Parcourez jusqu'au dossier `frontend/` dans le projet Koli55
4. Cliquez sur "Open"

## Structure du projet

- `/src/app` - Pages de l'application (App Router de Next.js)
- `/src/components` - Composants réutilisables
- `/src/hooks` - Hooks personnalisés
- `/src/lib` - Bibliothèques et utilitaires, y compris le client Supabase

## Premiers pas

1. Créez un fichier `.env.local` basé sur `env.local.example`
2. Installez les dépendances avec `pnpm install`
3. Lancez le serveur de développement avec `pnpm dev`

## Technologies utilisées

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Supabase 