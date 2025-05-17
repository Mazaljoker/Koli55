# Documentation Koli55

Bienvenue dans la documentation du projet Koli55, une plateforme no-code permettant à des professionnels de créer un assistant vocal IA en quelques minutes.

## Structure de la documentation

Cette documentation est organisée de la manière suivante :

### Guides pratiques

- [**Guide de développement**](development_guide.md) - Instructions complètes pour les développeurs travaillant sur le projet
- [**Guide de déploiement**](deployment.md) - Processus de déploiement local et en production
- [**Roadmap du projet**](guides/todo.md) - Phases de développement et état d'avancement
- [**Guide Cursor**](guides/cursor_guide.md) - Utilisation de Cursor pour le développement

### Documentation technique

- [**Architecture du projet**](architecture/project_architecture.md) - Documentation sur l'architecture globale du projet
- [**Flux API**](architecture/api_flow.md) - Documentation des flux d'interaction API
- [**Edge Functions**](architecture/edge_functions.md) - Documentation des Supabase Edge Functions
- [**Guide des Edge Functions**](architecture/edge_functions_guide.md) - Bonnes pratiques et conventions
- [**Intégration API Vapi**](api_integration.md) - Pattern standardisé pour l'intégration de l'API Vapi
- [**Assistants**](assistants.md) - Documentation spécifique sur les assistants vocaux

### Contexte du projet

- [**Contexte du projet**](context/project_context.md) - Objectifs, principes et technologies du projet

### Diagrammes et visuels

- [**Architecture globale**](assets/architecture.md) - Diagramme d'architecture du projet
- [**Workflow d'intégration**](assets/integration_workflow.md) - Flux de travail pour l'intégration avec Vapi
- [**Architecture des services API**](assets/api_service_architecture.md) - Diagramme des services API et leur intégration

### Documentation obsolète

- [**Documentation dépréciée**](deprecated/README.md) - Documentation qui a été remplacée par des versions plus récentes

## Comment maintenir cette documentation

1. Tous les fichiers de documentation utilisent le format Markdown (`.md`)
2. Chaque fois qu'une fonctionnalité est ajoutée ou modifiée, la documentation correspondante doit être mise à jour
3. Les exemples de code doivent être testés avant d'être ajoutés à la documentation
4. Les captures d'écran et diagrammes doivent être placés dans le dossier `/DOCS/assets/`
5. La documentation obsolète doit être déplacée dans le dossier `/DOCS/deprecated/` avec une note d'obsolescence

## Conventions de documentation

- Utilisez des titres clairs et hiérarchiques (# pour le titre principal, ## pour les sections, etc.)
- Incluez des exemples de code dans des blocs de code Markdown avec la syntaxe appropriée
- Utilisez des listes à puces pour les énumérations courtes et des listes numérotées pour les séquences
- Ajoutez des liens vers d'autres documents pertinents quand nécessaire

## Documentation externe

- [Documentation Vapi](https://docs.vapi.ai/)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Next.js](https://nextjs.org/docs) 