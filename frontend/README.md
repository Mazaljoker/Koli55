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
│   ├── assistants/
│   │   └── new/
│   │       └── _components/  # Composants spécifiques à cette page
│   ├── configurateur/
│   │   └── _components/      # Composants spécifiques à cette page
│   ├── landing-page.tsx # Page d'accueil
│   └── theme-provider.tsx # Provider pour le thème Ant Design
├── components/         # Composants React globaux et réutilisables
│   ├── layout/         # Layouts réutilisables
│   ├── ui/             # Composants UI de base
│   ├── assistants/     # Composants liés aux assistants
│   ├── forms/          # Composants de formulaires
│   └── wizards/        # Composants de wizards
├── lib/                # Utilitaires et services
│   ├── api/            # Clients API
│   ├── hooks/          # Custom hooks React
│   ├── utils/          # Fonctions utilitaires
│   └── supabase/       # Client Supabase
└── public/             # Fichiers statiques
```

## Organisation des composants

Ce projet utilise la **Stratégie "Root Project"** recommandée par Next.js :

### Principe

- **`/components`** (racine) : Tous les composants globaux et réutilisables
- **`/app`** : Uniquement pour le routage (pages, layouts, API routes)
- **`/app/[route]/_components`** : Composants spécifiques à une page (dossiers privés avec underscore)

### Avantages

- ✅ Séparation claire entre routage et composants
- ✅ Évite les conflits de routage Next.js
- ✅ Facilite la réutilisation des composants
- ✅ Structure prévisible et maintenable

### Conventions

1. **Composants globaux** → `components/[category]/ComponentName.tsx`
2. **Composants spécifiques** → `app/[route]/_components/ComponentName.tsx`
3. **Utiliser des dossiers privés** (`_components`) pour éviter les conflits de routage
4. **Imports absolus** avec les alias `@/components` et `@/lib`

## Migration Tailwind CSS → Ant Design

Le projet est en cours de migration de Tailwind CSS vers Ant Design. Les principes suivants sont appliqués :

1. Remplacer les classes Tailwind par des styles inline ou des props de composants Ant Design
2. Utiliser les composants Typography (Title, Text, Paragraph) pour la hiérarchie textuelle
3. Implémenter le système de grille Row/Col pour les layouts
4. Standardiser les espacements avec les tokens Ant Design (multiples de 8px)
5. Utiliser ConfigProvider pour la personnalisation du thème

Pour plus de détails, consultez le [Guide de migration complet](../DOCS/guides/ant-design-migration.md).

## Commandes disponibles

| Commande     | Description                                 |
| ------------ | ------------------------------------------- |
| `pnpm dev`   | Lancer le serveur de développement          |
| `pnpm build` | Construire l'application pour la production |
| `pnpm start` | Démarrer l'application en mode production   |
| `pnpm lint`  | Exécuter le linter ESLint                   |

## Configuration du thème

Le thème global d'Ant Design est configuré dans `app/theme-provider.tsx`. Les personnalisations spécifiques à certaines pages sont appliquées via des ConfigProvider locaux.
