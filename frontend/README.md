# Koli55 - Frontend

Application construite avec Next.js, Ant Design et Supabase.

## Technologies

- **Next.js** : Framework React avec rendu côté serveur
- **Ant Design** : Bibliothèque de composants UI
- **Supabase** : Backend as a Service pour l'authentification et la base de données
- **TypeScript** : Support de typage statique
- **Tailwind CSS** : Utilitaires CSS pour le styling
- **Framer Motion** : Animations fluides

## Structure du projet

- `/app` : Pages de l'application (App Router)
- `/components` : Composants réutilisables
  - `/layout` : Composants de mise en page
  - `/ui` : Composants d'interface utilisateur
- `/lib` : Utilitaires et logique partagée
  - `/supabase` : Client et hooks Supabase

## Installation

```bash
# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Créer un fichier .env.local à la racine du projet avec :
NEXT_PUBLIC_SUPABASE_URL=votre-url-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anonyme-supabase

# Lancer le serveur de développement
npm run dev
```

## Développement

L'application utilise l'architecture App Router de Next.js. Chaque dossier dans `/app` représente une route, avec un fichier `page.tsx` pour le contenu de la page.

### Conventions

- Les composants serveur sont les composants par défaut
- Les composants client sont marqués avec `'use client'` en haut du fichier
- Les fichiers sont en kebab-case, les composants en PascalCase

## Pages principales

- **/** : Page d'accueil
- **/dashboard** : Tableau de bord avec statistiques
- **/applications** : Gestion des applications

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
