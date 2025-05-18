# AlloKoli Frontend

Ce répertoire contient l'application frontend d'AlloKoli, développée avec Next.js et Ant Design.

## Technologies

- **Framework**: Next.js 15 avec App Router
- **UI Framework**: Ant Design 5
- **State Management**: React Context API
- **Authentification**: Supabase Auth
- **API Client**: Custom Fetch avec SWR pour le data fetching

## Structure du projet

```
frontend/
├── app/                # Routes Next.js (App Router)
│   ├── dashboard/      # Interface après connexion
│   ├── landing-page.tsx # Page d'accueil
│   └── theme-provider.tsx # Provider pour le thème Ant Design
├── components/         # Composants React
│   ├── layout/         # Layouts réutilisables
│   └── ui/             # Composants UI
├── lib/                # Utilitaires et services
│   ├── api/            # Clients API
│   ├── hooks/          # Custom hooks React
│   └── supabase/       # Client Supabase
└── public/             # Fichiers statiques
```

## Migration Tailwind CSS → Ant Design

Le projet est en cours de migration de Tailwind CSS vers Ant Design. Les principes suivants sont appliqués :

1. Remplacer les classes Tailwind par des styles inline ou des props de composants Ant Design
2. Utiliser les composants Typography (Title, Text, Paragraph) pour la hiérarchie textuelle
3. Implémenter le système de grille Row/Col pour les layouts
4. Standardiser les espacements avec les tokens Ant Design (multiples de 8px)
5. Utiliser ConfigProvider pour la personnalisation du thème

Pour plus de détails, consultez le [Guide de migration complet](../DOCS/guides/ant-design-migration.md).

## Commandes disponibles

| Commande | Description |
|----------|-------------|
| `pnpm dev` | Lancer le serveur de développement |
| `pnpm build` | Construire l'application pour la production |
| `pnpm start` | Démarrer l'application en mode production |
| `pnpm lint` | Exécuter le linter ESLint |

## Configuration du thème

Le thème global d'Ant Design est configuré dans `app/theme-provider.tsx`. Les personnalisations spécifiques à certaines pages sont appliquées via des ConfigProvider locaux.
