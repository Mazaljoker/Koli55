# Allokoli

Allokoli est une plateforme no-code permettant à des professionnels de créer un assistant vocal IA en quelques minutes.

## Stack
- Frontend : Next.js + Supabase
- Backend : Supabase Edge Functions (Deno)
- API vocale : Vapi.ai
- Auth : Supabase Auth
- Base de données : Supabase PostgreSQL avec RLS

## État du projet
- ✅ **Phase 1** : Initialisation du projet (structure, dépendances)
- ✅ **Phase 2** : Documentation et contexte
- ✅ **Phase 3** : Authentification Supabase
- ✅ **Phase 4** : Intégration des SDKs Vapi (client et serveur)
- ✅ **Phase 5** : Développement des Supabase Edge Functions
- ✅ **Phase 6.0** : Création des tables de base de données
- ✅ **Phase 6.1** : Intégration frontend
- ✅ **Phase 6.2** : Migration structurelle complète
- 🔄 **Phase 7** : Documentation complète (en cours)
- 📅 **Phase 8-9** : Déploiement et lancement (à venir)

## Structure du projet

Ce projet suit une structure standardisée définie dans [DOCS/architecture/structure-standard.md](DOCS/architecture/structure-standard.md).

La structure du projet est organisée de la façon suivante :

- `/frontend` : Application Next.js principale (App Router)
- `/supabase` : Fonctions Edge et migrations Supabase
- `/lib` : Bibliothèques partagées
- `/DOCS` : Documentation complète du projet

## Configuration des variables d'environnement

Pour démarrer le projet, vous devez configurer les variables d'environnement nécessaires :

1. Créez un fichier `.env.local` à la racine du projet en vous basant sur `.env.example`
2. Configurez les variables Supabase et Vapi avec les valeurs appropriées :

```
# Frontend (publiques mais limitées)
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-cle-anon-publique

# Backend (privées)
SUPABASE_URL=https://votre-projet.supabase.co
SUPABASE_ANON_KEY=votre-cle-anon-publique
SUPABASE_SERVICE_ROLE_KEY=votre-cle-service-role-secrete
VAPI_API_KEY=votre-cle-api-vapi
```

⚠️ **IMPORTANT** : Ne jamais commiter les fichiers `.env.local` ou `.env` contenant des clés réelles.

## Documentation

Une documentation complète est disponible dans le dossier `/DOCS` :

### Guides pratiques
- [**Guide de développement**](/DOCS/development_guide.md) - Instructions pour les développeurs
- [**Guide de déploiement**](/DOCS/deployment.md) - Processus de déploiement local et production
- [**Roadmap du projet**](/DOCS/guides/todo.md) - Phases de développement et état d'avancement
- [**Guide Cursor**](/DOCS/guides/cursor_guide.md) - Utilisation de Cursor pour le développement

### Documentation technique
- [**Architecture du projet**](/DOCS/architecture/project_architecture.md) - Documentation de l'architecture globale
- [**Flux API**](/DOCS/architecture/api_flow.md) - Documentation des flux API
- [**Edge Functions**](/DOCS/architecture/edge_functions.md) - Documentation des Supabase Edge Functions
- [**Guide des Edge Functions**](/DOCS/architecture/edge_functions_guide.md) - Bonnes pratiques et conventions
- [**Intégration API Vapi**](/DOCS/api_integration.md) - Pattern standardisé d'intégration
- [**Assistants**](/DOCS/assistants.md) - Documentation spécifique sur les assistants vocaux

### Contexte du projet
- [**Contexte du projet**](/DOCS/context/project_context.md) - Objectifs, principes et technologies

### Diagrammes et visuels
- [**Architecture globale**](/DOCS/assets/architecture.md) - Diagramme d'architecture du projet
- [**Architecture des services API**](/DOCS/assets/api_service_architecture.md) - Diagramme des services API

## Fonctionnalités principales
- Création d'assistants vocaux IA via une interface no-code
- Gestion de conversations téléphoniques automatisées
- Intégration de bases de connaissances personnalisées
- Configuration de workflows conversationnels avancés
- Analyse des conversations et métriques d'utilisation

## Architecture
L'architecture du projet suit une approche en couches :

```
┌────────────────┐
│  UI (Next.js)  │
├────────────────┤
│ Frontend APIs  │ ← lib/api/*.ts
├────────────────┤
│ Edge Functions │ ← supabase/functions/
├────────────────┤
│    Vapi API    │
└────────────────┘
```

Cette architecture garantit la sécurité des clés API et permet une séparation claire des responsabilités.

## Démarrage rapide
```bash
# Installation des dépendances
pnpm install

# Lancement du serveur de développement
pnpm dev
```

## Développeurs
Pour contribuer au projet, consultez le [Guide de développement](/DOCS/development_guide.md).
