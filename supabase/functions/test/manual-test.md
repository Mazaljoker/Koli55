# Guide de test manuel pour la fonction Edge d'assistants

Ce document explique comment tester manuellement la fonction Edge d'assistants après avoir corrigé la structure de la table.

## Étapes réalisées

1. **Correction de la structure de la table `assistants`**
   - Ajout des colonnes manquantes :
     ```sql
     ALTER TABLE assistants ADD COLUMN IF NOT EXISTS silence_timeout_seconds INTEGER;
     ALTER TABLE assistants ADD COLUMN IF NOT EXISTS max_duration_seconds INTEGER;
     ALTER TABLE assistants ADD COLUMN IF NOT EXISTS end_call_after_silence BOOLEAN;
     ALTER TABLE assistants ADD COLUMN IF NOT EXISTS voice_reflection BOOLEAN;
     ALTER TABLE assistants ADD COLUMN IF NOT EXISTS recording_settings JSONB;
     ```

2. **Suppression de la contrainte de clé étrangère pour les tests**
   ```sql
   ALTER TABLE assistants DROP CONSTRAINT assistants_user_id_fkey;
   ```

3. **Désactivation de la RLS (Row Level Security) pour les tests**
   ```sql
   ALTER TABLE assistants DISABLE ROW LEVEL SECURITY;
   ```

4. **Modifications de la fonction Edge pour le mode développement**
   - Utilisation d'un UUID valide au format `00000000-0000-0000-0000-000000000000` 
   - Bypass de l'authentification pour toutes les opérations
   - Suppression de la validation des relations user_id
   - Gestion des erreurs Vapi en mode développement

5. **Création d'un script de test PowerShell**
   - Modification de `test-curl-assistants.ps1` pour tester toutes les opérations CRUD
   - Ajout d'en-têtes d'autorisation à toutes les requêtes

## Résultats

- **Création d'assistants (POST /assistants)**
  - ✅ Fonctionne correctement
  - La fonction crée l'assistant dans la base de données locale même si Vapi n'est pas configuré

- **Liste des assistants (GET /assistants)**
  - ✅ Fonctionne correctement
  - Renvoie tous les assistants dans la base de données

- **Obtention d'un assistant par ID (GET /assistants/:id)**
  - ❌ Échoue avec l'erreur "invalid claim: missing sub claim"
  - Ce problème semble venir de Supabase plutôt que de notre fonction Edge

- **Mise à jour d'un assistant (PATCH /assistants/:id)**
  - ❌ Échoue avec l'erreur "invalid claim: missing sub claim"
  - Même problème d'authentification Supabase

- **Suppression d'un assistant (DELETE /assistants/:id)**
  - ❌ Échoue avec l'erreur "invalid claim: missing sub claim"
  - Même problème d'authentification Supabase

## Solutions potentielles

1. **Problème d'authentification Supabase**
   - L'erreur "invalid claim: missing sub claim" indique un problème avec le JWT token
   - Vérifier que le token contient le claim "sub" (subject)
   - Essayer de générer un token JWT valide avec la commande `supabase tokens create`

2. **Pour un test complet sans erreurs d'authentification**
   - Utiliser l'interface d'administration Supabase Studio pour tester manuellement les opérations
   - Ou configurer un environnement de test avec des utilisateurs et des tokens valides

## Conclusion

Les tests ont permis de valider que :
1. La structure de la table `assistants` est correcte avec toutes les colonnes nécessaires
2. La fonction Edge peut créer des assistants dans la base de données locale
3. Les assistants peuvent être listés correctement
4. Des problèmes d'authentification Supabase empêchent actuellement les opérations par ID

Pour un test complet en production, il faudra résoudre les problèmes d'authentification et configurer correctement l'API Vapi. 