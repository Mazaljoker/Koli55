# Documentation Koli55

Bienvenue dans la documentation du projet Koli55, une plateforme no-code permettant à des professionnels de créer un assistant vocal IA en quelques minutes.

## 🎉 État actuel du projet (Phase 10.1 - COMPLÉTÉ)

**✅ AVANCEMENT GLOBAL : ~75%**

- **Backend** : 1/15 Edge Functions déployée (assistants - Version 28) ✅ 100% compatible Vapi.ai
- **Frontend** : Interface principale complète ✅ Wizard assistants opérationnel
- **Tests** : Infrastructure configurée ✅ Tests de base fonctionnels
- **Documentation** : Technique complète ✅ Guides pratiques disponibles
- **Prochaine étape** : Déploiement progressif des 14 Edge Functions restantes

## Structure de la documentation

Cette documentation est organisée de la manière suivante :

### Guides pratiques

- [**Guide de développement**](development_guide.md) - Instructions complètes pour les développeurs travaillant sur le projet
- [**Guide de déploiement**](deployment.md) - Processus de déploiement local et en production ✅ **Mis à jour Phase 10.1**
- [**Roadmap du projet**](guides/todo.md) - Phases de développement et état d'avancement ✅ **Mis à jour Phase 10.1**
- [**Guide Cursor**](guides/cursor_guide.md) - Utilisation de Cursor pour le développement

### Documentation technique

- [**Architecture du projet**](architecture/project_architecture.md) - Documentation sur l'architecture globale du projet
- [**Flux API**](architecture/api_flow.md) - Documentation des flux d'interaction API
- [**Edge Functions**](architecture/edge_functions.md) - Documentation des Supabase Edge Functions
- [**Guide des Edge Functions**](architecture/edge_functions_guide.md) - Bonnes pratiques et conventions ✅ **Validées Phase 10.1**
- [**Intégration API Vapi**](api_integration.md) - Pattern standardisé pour l'intégration de l'API Vapi ✅ **100% compatible**
- [**Services API**](api_services.md) - Architecture des services API frontend ✅ **Mis à jour Phase 10.1**
- [**Assistants**](assistants.md) - Documentation spécifique sur les assistants vocaux ✅ **Mis à jour Phase 10.1 - FONCTIONNEL**

### Contexte du projet

- [**Contexte du projet**](context/project_context.md) - Objectifs, principes et technologies du projet

### Diagrammes et visuels

- [**Architecture globale**](assets/architecture.md) - Diagramme d'architecture du projet
- [**Workflow d'intégration**](assets/integration_workflow.md) - Flux de travail pour l'intégration avec Vapi
- [**Architecture des services API**](assets/api_service_architecture.md) - Diagramme des services API et leur intégration

### Guides spécialisés

- [**Effets 3D**](guides/effets-3d.md) - Guide d'utilisation des composants 3D avec Framer Motion
- [**Migration Ant Design**](guides/ant-design-migration.md) - Guide de migration vers Ant Design

### Documentation obsolète

- [**Documentation dépréciée**](deprecated/README.md) - Documentation qui a été remplacée par des versions plus récentes

## 🎯 Fonctionnalités opérationnelles

### ✅ Complètement fonctionnelles
1. **Création d'assistants** - Interface wizard complète + backend déployé
2. **Gestion d'assistants** - CRUD complet avec Edge Function active
3. **Interface utilisateur** - Dashboard principal et navigation
4. **Authentification** - Système Supabase Auth opérationnel
5. **Tests** - Infrastructure Jest configurée et tests de base

### 🔄 Prêtes pour déploiement
1. **Bases de connaissances** - Interface complète, backend structuré
2. **Gestion de fichiers** - Upload et traitement structurés
3. **Historique d'appels** - Monitoring et analytics structurés
4. **Workflows** - Configuration de flux conversationnels
5. **Numéros de téléphone** - Gestion et provisioning Vapi
6. **Webhooks** - Réception d'événements temps réel
7. **Gestion organisationnelle** - Équipes et permissions
8. **Analytics** - Métriques et rapports d'utilisation
9. **Tests automatisés** - Suites de tests pour assistants

## 📚 Corrections importantes (Phase 10.1)

### ✅ Corrections backend critiques
- **URLs API Vapi** : Suppression du préfixe `/v1/` erroné
- **Format de réponse** : Harmonisation avec le format Vapi standard `{ data: ... }`
- **Fonctions utilitaires** : `mapToVapiAssistantFormat`, `extractId`, `sanitizeString`
- **Upload de fichiers** : FormData complet avec multipart/form-data
- **Gestion d'erreurs** : Système robuste avec fallback et retry

### ✅ Validation de l'architecture
- **Backend-Frontend** : Connexion validée et opérationnelle
- **Authentification** : Sécurité testée et fonctionnelle
- **Edge Functions** : Pattern de déploiement établi et documenté
- **Services API** : Architecture standardisée et extensible

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
- **Marquez l'état des fonctionnalités** : ✅ (fonctionnel), 🔄 (prêt), ⏳ (en attente), 🚫 (bloqué)

## Prochaines priorités de développement

### Phase immédiate - Déploiement Edge Functions
1. **knowledge-bases** - Support des bases de connaissances (interface prête)
2. **files** - Gestion des fichiers et uploads
3. **calls** - Historique et monitoring des appels

### Phase suivante - Fonctionnalités avancées
4. **workflows** - Configuration de flux conversationnels
5. **phone-numbers** - Gestion des numéros Vapi
6. **webhooks** - Événements temps réel
7. **analytics** - Métriques et rapports détaillés

### Phase finale - Gestion et tests
8. **organization** et **squads** - Gestion multi-utilisateurs
9. **functions** - Outils personnalisés pour assistants
10. **test-suites** - Tests automatisés complets

## Documentation externe

- [Documentation Vapi](https://docs.vapi.ai/) ✅ **Intégration validée**
- [Documentation Supabase](https://supabase.com/docs) ✅ **Edge Functions opérationnelles**
- [Documentation Next.js](https://nextjs.org/docs) ✅ **Frontend configuré**

## Support et contribution

Pour toute question sur la documentation ou contribution au projet :
1. Consultez d'abord la [roadmap détaillée](guides/todo.md)
2. Vérifiez l'[état des services](api_services.md)
3. Suivez le [guide de développement](development_guide.md)
4. Respectez les [bonnes pratiques Edge Functions](architecture/edge_functions_guide.md) 