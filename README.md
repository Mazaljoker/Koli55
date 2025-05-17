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
- 🔄 **Phase 6.1** : Intégration frontend (en cours)
- 🔄 **Phase 7** : Documentation complète (en cours)
- 📅 **Phase 8-9** : Déploiement et lancement (à venir)

## ⚠️ Note importante : Migration de structure

Le dossier `/app` est désormais **déprécié**. Tous les nouveaux développements doivent être effectués dans le dossier `/frontend`. Le dossier `/app` est conservé temporairement pour des raisons de compatibilité, mais sera supprimé dans une version future.

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
