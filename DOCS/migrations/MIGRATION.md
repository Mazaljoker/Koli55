# Plan de Migration et Refonte Frontend

## Historique des changements

1. **Ancien frontend déprécié** (18/05/2025)
   - Le dossier `/app` a été déplacé vers `/DEPRECATED`
   - Un fichier README a été ajouté dans `/app` pour indiquer la dépréciation

2. **Suppression du frontend temporaire** (18/05/2025)
   - Le dossier `/frontend` a été supprimé pour préparer une refonte complète
   - Tous les READMEs ont été mis à jour pour refléter cette suppression

## Plan de la refonte

### 1. Nouvelle architecture frontend (Prévu)

La nouvelle architecture frontend sera basée sur les principes suivants:
- App Router de Next.js
- Organisation modulaire des composants
- Séparation claire des responsabilités entre client et serveur
- Intégration optimisée avec les Edge Functions Supabase

### 2. Structure de dossiers prévue (Prévu)

```
/src
  /app           # App Router Next.js
  /components    # Composants React réutilisables
    /ui          # Composants d'interface utilisateur de base
    /features    # Composants spécifiques aux fonctionnalités
  /lib           # Bibliothèques et utilitaires
  /hooks         # Hooks React personnalisés
  /types         # Types TypeScript
  /styles        # Styles globaux et variables
  /utils         # Fonctions utilitaires
```

### 3. Étapes de la migration (À venir)

1. **Création de la structure de base**
   - Initialisation du nouveau projet Next.js
   - Configuration des dépendances et des outils
   - Mise en place de la structure de dossiers

2. **Développement des composants de base**
   - Système de design
   - Composants UI réutilisables
   - Mise en place de l'authentification

3. **Migration des fonctionnalités**
   - Développement des nouvelles pages et routes
   - Adaptation et amélioration des fonctionnalités existantes
   - Tests et validation

### 4. Timeline prévisionnelle

- **Phase 1**: Préparation et structure - Semaine 1
- **Phase 2**: Développement des composants de base - Semaines 2-3
- **Phase 3**: Implémentation des fonctionnalités - Semaines 4-6
- **Phase 4**: Tests et optimisation - Semaines 7-8
- **Phase 5**: Lancement et déploiement - Semaine 9

## Recommandations pour les développeurs

1. **Ne pas démarrer de nouveaux développements** sur l'ancien code
2. **Documenter toutes les fonctionnalités actuelles** pour faciliter leur migration
3. **Préparer des maquettes et spécifications** pour la nouvelle interface
4. **Attendre la mise en place** de la nouvelle structure avant de contribuer au frontend 