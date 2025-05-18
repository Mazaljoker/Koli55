# Roadmap pour atteindre 100% de fonctionnalité de l'Edge Function Assistants

## Progrès réalisés

### ✅ Résolution du problème de mappage camelCase/snake_case
- [x] Diagnostic du problème du trigger PostgreSQL essayant d'accéder aux champs camelCase inexistants
- [x] Modification de la migration SQL pour désactiver temporairement le trigger problématique
- [x] Adaptation du code de la fonction Edge pour gérer directement la conversion camelCase/snake_case
- [x] Tests des opérations CRUD de base (création, lecture, mise à jour, suppression) avec succès

### ✅ Configuration des clés API Vapi
- [x] Documentation des méthodes de configuration des clés API Vapi
- [x] Implémentation de multiples méthodes pour l'utilisation des clés API:
  - Via les variables d'environnement
  - Via les en-têtes HTTP
  - Via le corps de la requête
- [x] Stockage des clés dans la table `config` de la base de données

### ✅ Mécanisme de génération de JWT pour l'authentification
- [x] Diagnostic précis de l'erreur "invalid claim: missing sub claim"
- [x] Création d'un script PowerShell (`generate-valid-token.ps1`) pour générer des JWT avec claim 'sub' valide
- [x] Développement d'un script de test (`test-edge-assistants.ps1`) utilisant les JWT générés
- [x] Tests réussis des opérations CRUD avec authentification JWT complète
- [x] Documentation des solutions d'authentification dans README_VAPI_CONFIG.md

### ✅ Intégration du claim 'sub' JWT pour l'identification des utilisateurs
- [x] Implémentation de la fonction `extractUserFromJWT` pour extraire les informations utilisateur
- [x] Modification de la fonction Edge pour valider les JWT et extraire le claim 'sub'
- [x] Association du claim 'sub' au champ user_id des assistants lors de leur création
- [x] Tests réussis de création d'assistants avec l'ID utilisateur correct

### ✅ Correction de l'erreur "Cannot POST /v1/assistants" de l'API Vapi
- [x] Diagnostic du problème lié aux URLs incorrectes avec le préfixe '/v1/'
- [x] Vérification de la documentation de l'API Vapi confirmant que les endpoints corrects sont sans préfixe
- [x] Modification de la fonction `callVapiAPI` pour retirer automatiquement le préfixe '/v1/' des URLs
- [x] Tests de création d'assistants réussis avec les URLs corrigées

## Phase 1: Finalisation des problèmes d'authentification
- [x] Diagnostiquer précisément l'erreur "invalid claim: missing sub claim"
- [x] Créer un mécanisme fiable pour générer des JWT valides contenant le claim 'sub'
- [x] Mettre à jour la fonction Edge pour gérer dynamiquement les claims JWT dans l'authentification
- [x] Implémenter l'extraction et la validation du claim 'sub' du JWT pour l'identification des utilisateurs
- [x] Implémenter la validation des claims 'role' pour la gestion des permissions:
  - [x] Définir les rôles d'accès: `user`, `admin`, `test`
  - [x] Attribuer des permissions spécifiques à chaque rôle via RLS
  - [x] Implémenter la logique de validation des rôles dans les politiques RLS
- [x] Créer un rôle spécifique `test` avec des permissions appropriées:
  - [x] Limitation aux assistants marqués comme 'is_test' dans les métadonnées
  - [x] Capacité de créer/modifier/supprimer uniquement les assistants de test
  - [ ] Limite de quota plus élevée pour les tests automatisés
- [ ] Configurer l'authentification pour les utilisateurs réels:
  - [ ] Créer un processus d'enregistrement et d'authentification utilisateur complet
  - [ ] Implémenter la gestion des profils utilisateurs avec préférences
  - [ ] Mettre en place des limites de quota par utilisateur
  - [ ] Configurer des règles d'audit pour la traçabilité des actions

## Phase 2: Résolution des problèmes d'intégration Vapi
- [x] Configurer les variables d'environnement dans Supabase
- [x] Corriger l'erreur "Cannot POST /v1/assistants" lors de l'intégration Vapi:
  - ✅ Problème résolu: L'API Vapi n'utilise pas de préfixe '/v1/' dans ses URLs
  - ✅ Modification de la fonction callVapiAPI pour corriger automatiquement les URLs
- [x] Diagnostic et correction du problème avec le champ `end_call_after_silence`:
  - ✅ Création d'une migration pour ajouter la colonne dans la table `assistants`
  - ✅ Test de la compatibilité entre le schéma de la table et l'API Vapi
  - ✅ Mise à jour de la vue `assistants_api_view` pour gérer la conversion camelCase/snake_case
- [x] Mettre à jour l'intégration vers la dernière version de l'API Vapi:
  - ✅ Vérification de la documentation Vapi pour les changements d'API récents
  - ✅ Adaptation des interfaces AssistantCreateParams et AssistantUpdateParams
  - ✅ Maintien de la compatibilité avec les champs legacy
- [ ] Implémenter un mécanisme de synchronisation robuste:
  - Créer un système de file d'attente pour les opérations Vapi
  - Développer un mécanisme de récupération après échec
  - Mettre en place un système de vérification de l'état de synchronisation

## Phase 3: Restauration des mécanismes de sécurité
- [x] Rétablir la contrainte de clé étrangère avec gestion des cas nulls:
  ```sql
  -- Résolution des problèmes avec les enregistrements existants
  UPDATE public.assistants SET user_id = NULL
  WHERE user_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM auth.users WHERE id = assistants.user_id
  );
  
  -- Ajout de la contrainte
  ALTER TABLE assistants ADD CONSTRAINT assistants_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  ```
- [x] Reconfigurer la Row Level Security (RLS) avec des politiques différenciées:
  ```sql
  -- Activation de RLS
  ALTER TABLE assistants ENABLE ROW LEVEL SECURITY;
  
  -- Politique pour les utilisateurs standard (accès uniquement à leurs assistants)
  CREATE POLICY users_manage_own_assistants ON assistants
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
    
  -- Politique pour les administrateurs (accès complet)
  CREATE POLICY admins_manage_all_assistants ON assistants
    USING (auth.jwt() ->> 'role' = 'admin')
    WITH CHECK (auth.jwt() ->> 'role' = 'admin');
    
  -- Politique pour les utilisateurs de test (accès limité)
  CREATE POLICY test_users_access_test_assistants ON assistants
    USING (auth.jwt() ->> 'role' = 'test' AND metadata->>'is_test' = 'true')
    WITH CHECK (auth.jwt() ->> 'role' = 'test' AND metadata->>'is_test' = 'true');
  ```
- [x] Implémenter une validation de sécurité côté application:
  - [x] Double vérification des permissions dans le code Edge Function
  - [x] Validation des entrées pour prévenir les injections
  - [x] Sanitation des données avant stockage en base de données

## Phase 4: Tests complets en environnement de développement
- [x] Tests de base des opérations CRUD fonctionnels avec le script `test-curl-assistants.ps1`
- [x] Création d'un script de test automatisé complet (`test-edge-assistants.ps1`) 
- [ ] Développer une suite de tests de sécurité:
  - Tests de pénétration sur les points d'API
  - Vérification des fuites d'informations sensibles
  - Tests d'escalade de privilèges
- [ ] Créer des utilisateurs de test avec différents rôles dans Supabase Auth:
  - Utilisateur standard avec quota limité
  - Utilisateur premium avec fonctionnalités avancées
  - Utilisateur administrateur avec accès complet
- [ ] Tester les scénarios d'erreur et de charge:
  - Tests de charge avec simulation de trafic élevé
  - Tests de résilience (délais d'attente, pannes réseau)
  - Tests des limites (quotas, rate limiting)

## Phase 5: Optimisations et finitions
- [ ] Optimiser les requêtes de base de données:
  - Ajouter des index sur les champs fréquemment utilisés
  - Optimiser les requêtes JOIN et les filtres
  - Implémenter des requêtes partielles pour les grandes collections
- [ ] Implémenter un système de mise en cache:
  - Cache Redis pour les données fréquemment accédées
  - Stratégie d'invalidation de cache efficace
  - Cache côté client avec ETags
- [ ] Améliorer les performances et la journalisation:
  - Mesures de performance précises (temps de réponse, utilisation CPU/mémoire)
  - Journalisation structurée avec niveaux de détail configurables
  - Alertes automatiques sur les problèmes de performance

## Phase 6: Préparation pour la production
- [ ] Configurer un environnement de staging:
  - Infrastructure identique à la production
  - Séparation complète des données de test et de production
  - Processus de déploiement automatisé avec validation
- [ ] Mettre en place un monitoring complet:
  - Tableaux de bord de surveillance temps réel
  - Alertes automatiques sur les métriques critiques
  - Suivi des indicateurs de performance clés (KPIs)
- [ ] Implémenter des processus de sauvegarde et récupération:
  - Sauvegardes automatiques incrémentielles
  - Procédures de récupération testées
  - Plan de reprise d'activité documenté

## Phase 7: Déploiement et validation en production
- [ ] Déployer la version finale en production:
  - Déploiement progressif (canary release)
  - Surveillance accrue pendant la période de transition
  - Procédure de rollback préparée
- [ ] Valider les fonctionnalités en production:
  - Tests de smoke post-déploiement
  - Vérification des intégrations externes
  - Validation des performances sous charge réelle

## Critères de succès
1. ✅ Opérations CRUD de base fonctionnelles en mode développement
2. ✅ Opérations CRUD fonctionnelles avec authentification JWT
3. [ ] Intégration Vapi fonctionnelle et fiable avec gestion d'erreurs robuste
4. [ ] Sécurité complète avec RLS et validation des permissions
5. [ ] Documentation exhaustive couvrant API, architecture et déploiement
6. [ ] Couverture de tests > 90% avec tests automatisés
7. [ ] Performance optimale avec temps de réponse < 300ms à 95e percentile 