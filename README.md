# Koli55

Projet d'intégration Vapi et Supabase pour créer des assistants IA vocaux.

## Structure du projet

Le projet est en cours de réorganisation majeure:

- **`DEPRECATED/`**: Contient l'ancien code qui était auparavant dans le dossier `app/`
  - Ce code est conservé à des fins de référence mais ne doit pas être modifié

- **`supabase/`**: Configuration et code côté serveur pour Supabase
  - `functions/`: Edge Functions Supabase
  - `migrations/`: Migrations de base de données

- **`lib/`**: Bibliothèques et utilitaires partagés
  - `api/`: Fonctions d'accès à l'API

## ⚠️ Refonte en cours

**ATTENTION**: Le frontend est en cours de refonte complète.

- ✅ Le dossier `app/` a été déplacé vers `DEPRECATED/`
- ✅ Le dossier `frontend/` a été supprimé
- 🔄 Un nouveau frontend sera développé prochainement

## Développement

Pour lancer le projet en développement (après la reconstruction du frontend) :

```bash
pnpm dev
```

## Construction

Pour construire le projet :

```bash
pnpm build
```

## Déploiement

Pour déployer le projet :

```bash
pnpm start
```

## Notes importantes

1. **Ne pas utiliser le dossier `app/`** - Ce dossier est déprécié
2. **Ne pas modifier les fichiers dans `DEPRECATED/`** - Ces fichiers sont conservés uniquement pour référence
3. **Attendre la nouvelle structure frontend** avant de commencer tout nouveau développement

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
- 🔄 **Phase 6.1** : Refonte complète du frontend (en cours)
- 🔄 **Phase 7** : Documentation complète (en cours)
- 📅 **Phase 8-9** : Déploiement et lancement (à venir)

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
│  UI (Next.js)  │ ← EN COURS DE REFONTE
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

# Lancement du serveur de développement (après reconstruction du frontend)
pnpm dev
```

## Développeurs
Pour contribuer au projet, consultez le [Guide de développement](/DOCS/development_guide.md).
