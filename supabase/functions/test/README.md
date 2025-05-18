# Tests des Edge Functions Supabase

Ce dossier contient les outils et scripts pour tester les Edge Functions Supabase de l'application Koli55.

## Prérequis

1. Supabase CLI installé
2. Extension VS Code "REST Client" pour les fichiers `.http`
3. Variables d'environnement correctement configurées

## Configuration

1. Créez un fichier `.env.local` à la racine du projet avec les variables suivantes:

```env
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_clé_anon_supabase
VAPI_API_KEY=votre_clé_api_vapi
JWT_SECRET=votre_secret_jwt
```

2. Vérifiez la configuration avec le script de test:

```bash
node supabase/functions/test/test-env.js
```

## Démarrer le serveur Supabase local

```bash
# Si le serveur n'est pas encore démarré
supabase start

# Si vous avez mis à jour les variables d'environnement
supabase restart
```

## Déployer les fonctions localement

```bash
supabase functions serve --no-verify-jwt
```

Le drapeau `--no-verify-jwt` facilite le test en développement. Pour un test plus réaliste, omettez ce drapeau et utilisez un JWT valide.

## Utilisation des fichiers de test HTTP

Les fichiers `.http` peuvent être exécutés directement depuis VS Code avec l'extension REST Client.

Créez d'abord un fichier `supabase/functions/test/.env.http` pour stocker votre token d'authentification:

```
@supabase_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...votre_jwt_token...
```

Ensuite, ouvrez n'importe quel fichier `.http` et cliquez sur "Send Request" au-dessus de chaque requête.

## Fichiers de test disponibles

- `test-assistants.http` - Tests pour l'API des assistants (CRUD)
- Ajoutez d'autres fichiers pour tester les autres fonctions

## Génération d'un token JWT pour les tests

Pour générer un token JWT valide:

1. Connectez-vous à votre application dans un navigateur
2. Ouvrez la console développeur et exécutez:
   ```javascript
   const token = await supabase.auth.getSession()
   console.log(token.data.session.access_token)
   ```
3. Copiez ce token dans votre fichier `.env.http`

## Troubleshooting

### Erreurs CORS
Les erreurs CORS se produisent généralement lorsque vous appelez le service depuis un domaine différent. Vérifiez que les en-têtes CORS sont correctement configurés dans `shared/cors.ts`.

### Erreurs d'authentification
- Vérifiez que votre token JWT est valide et non expiré
- Assurez-vous que la variable `JWT_SECRET` correspond à celle de votre projet Supabase

### Erreurs 500
Les erreurs 500 indiquent généralement un problème de serveur. Vérifiez les logs Supabase pour plus de détails:

```bash
supabase logs
``` 