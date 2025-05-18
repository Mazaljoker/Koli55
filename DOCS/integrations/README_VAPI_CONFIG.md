# Configuration de Vapi dans le projet Koli55

Ce guide explique comment configurer et utiliser les clés API Vapi dans le projet Koli55.

## Clés API Vapi

Pour l'intégration avec l'API Vapi, deux clés sont nécessaires :

- **Clé API privée** : `b913fdd5-3a43-423b-aff7-2b093b7b6759`
  - Utilisée pour appeler l'API Vapi depuis les fonctions Edge Supabase
  - Doit être conservée secrète

- **Clé API publique** : `dca5b90b-8c26-4959-9ffd-b1abe1b42e1f`
  - Peut être utilisée dans le frontend pour initialiser le widget Vapi
  - Peut être exposée au client

## Méthodes de configuration

Le projet prend en charge plusieurs méthodes pour configurer les clés API Vapi :

### 1. Variables d'environnement dans Supabase Edge Functions

Configurez les variables d'environnement dans le conteneur Supabase :

```bash
# Exécutez ce script pour ajouter les clés à la base de données
./set-supabase-env.ps1
```

### 2. En-têtes HTTP

Les fonctions Edge acceptent également les clés API dans les en-têtes HTTP :

```
X-Vapi-API-Key: b913fdd5-3a43-423b-aff7-2b093b7b6759
```

### 3. Corps de la requête

Vous pouvez inclure la clé API dans le corps de la requête :

```json
{
  "name": "Mon Assistant",
  "vapi_api_key": "b913fdd5-3a43-423b-aff7-2b093b7b6759"
}
```

## Résolution des problèmes

### Erreur "record 'new' has no field 'firstMessage'"

Si vous rencontrez cette erreur lors de la création d'assistants, c'est probablement lié au trigger PostgreSQL qui tente d'accéder aux champs en camelCase.

**Solution** : Nous avons désactivé temporairement le trigger de mappage des champs pour éviter ce problème :

```sql
-- Désactiver le trigger
DROP TRIGGER IF EXISTS assistant_field_mapping ON assistants;
```

Le code de la fonction Edge gère maintenant directement la conversion camelCase/snake_case lors de l'insertion, sans s'appuyer sur le trigger PostgreSQL.

Si vous souhaitez réactiver le trigger plus tard, exécutez :

```sql
-- Réactiver le trigger
CREATE TRIGGER assistant_field_mappingBEFORE INSERT OR UPDATE ON assistants
FOR EACH ROW
EXECUTE FUNCTION map_assistant_fields();
```

### Erreur "Cannot POST /v1/assistants"

Cette erreur se produisait lorsque l'API Vapi recevait des requêtes avec un préfixe '/v1/' dans les URLs, car l'API Vapi n'utilise pas ce préfixe contrairement à d'autres APIs.

**Solution** :

1. Nous avons corrigé la fonction `callVapiAPI` pour supprimer automatiquement le préfixe '/v1/' des URLs :

```typescript
// Correction du chemin de l'API: retirer le préfixe v1 s'il est présent
const sanitizedEndpoint = endpoint.startsWith('/v1/')
  ? endpoint.replace('/v1/', '/')
  : endpoint;
const url = `https://api.vapi.ai${sanitizedEndpoint}`;
```

2. Les endpoints corrects pour l'API Vapi sont :
   - POST /assistant (pour créer un assistant)
   - GET /assistants (pour lister les assistants)
   - GET/PATCH/DELETE /assistant/{id} (pour manipuler un assistant spécifique)

### Erreur avec le champ `end_call_after_silence`

Cette erreur se produit lorsque la table `assistants` dans Supabase n'a pas la colonne `end_call_after_silence`, mais que l'API Vapi s'attend à recevoir ce champ.

**Solution** :

1. Nous avons créé une migration pour ajouter les colonnes manquantes dans la table `assistants` :

```sql
-- Ajouter la colonne si elle n'existe pas
ALTER TABLE assistants ADD COLUMN IF NOT EXISTS end_call_after_silence BOOLEAN DEFAULT NULL;
```

2. La vue `assistants_api_view` a été mise à jour pour gérer correctement la conversion entre snake_case et camelCase :

```sql
CREATE OR REPLACE VIEW assistants_api_view AS
SELECT
  ...
  end_call_after_silence AS "endCallAfterSilence",
  ...
FROM assistants;
```

3. Pour appliquer cette migration et tester la solution :

```bash
# Exécuter la migration pour mettre à jour le schéma
./test-assistants-migration.ps1

# Tester l'API Vapi
./test-vapi-create-assistant.ps1
```

Grâce à cette correction, les fonctions Edge sont désormais compatibles avec l'API Vapi et peuvent créer et gérer des assistants correctement.

### Erreur "invalid claim: missing sub claim"

Cette erreur se produit lorsque les fonctions Edge Supabase tentent de vérifier un token JWT qui ne contient pas le claim "sub" (subject), nécessaire pour identifier l'utilisateur.

**Solutions** :

1. **Solution immédiate** : Utilisez l'option `--no-verify-jwt` lors du lancement des fonctions Edge en développement :

```bash
supabase functions serve --no-verify-jwt
```

2. **Solution recommandée** : Générez un token JWT valide avec le claim "sub" en utilisant notre script :

```bash
# Génère un token avec un claim 'sub' valide et le stocke dans jwt-token.txt
./generate-valid-token.ps1
```

3. **Pour les tests** : Utilisez le script de test qui vérifie automatiquement la présence du claim "sub" :

```bash
# Teste toutes les opérations CRUD avec un token JWT valide
./test-edge-assistants.ps1
```

## Tests

Vous pouvez utiliser les scripts suivants pour tester l'intégration avec l'API Vapi :

```bash
# Test rapide des endpoints sans authentification JWT
./test-curl-assistants.ps1

# Test complet avec vérification d'authentification JWT
./test-edge-assistants.ps1
```

Ces scripts testent les points d'extrémité de la fonction Edge `assistants` avec les opérations CRUD. 