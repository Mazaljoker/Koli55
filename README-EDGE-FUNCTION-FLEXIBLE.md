# Framework d'Edge Function Flexible pour Supabase

Ce projet fournit un framework amélioré pour développer des Edge Functions Supabase plus robustes, avec une meilleure gestion des routes et de l'authentification.

## Fonctionnalités principales

- **Routage flexible** : gestion simplifiée des routes avec support pour les paramètres d'URL
- **Gestion avancée des chemins** : support pour différents formats d'URL Supabase
- **Authentification flexible** : JWT, clés API, et mode test
- **Middlewares** : support pour les middlewares globaux et par route
- **Gestion des erreurs standardisée** : formatage cohérent des erreurs
- **CORS intégré** : configuration CORS simplifiée

## Structure du projet

```
supabase/
  └── functions/
      ├── flexible-edge-function.ts      # Exemple d'Edge Function utilisant le framework
      └── shared/                        # Utilitaires partagés
          ├── auth-utils.ts              # Utilitaires d'authentification
          ├── cors.ts                    # Configuration CORS
          ├── edge-router.ts             # Système de routage
          ├── errors.ts                  # Gestion standardisée des erreurs
          ├── path-normalizer.ts         # Gestion des chemins d'URL
          └── response-helpers.ts        # Formatage des réponses
```

## Guide d'utilisation

### 1. Installation des utilitaires

Copiez les fichiers utilitaires dans le dossier `supabase/functions/shared/` de votre projet.

### 2. Création d'une Edge Function avec le framework

Voici un exemple simplifié d'utilisation du framework :

```typescript
// my-edge-function.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { EdgeRouter, loggerMiddleware } from "./shared/edge-router.ts";
import { corsHeaders } from "./shared/cors.ts";
import { isPathForFunction } from "./shared/path-normalizer.ts";

// Nom de cette Edge Function
const FUNCTION_NAME = "my-edge-function";

// Créer le routeur
const router = new EdgeRouter();

// Ajouter un middleware global pour la journalisation
router.use(loggerMiddleware());

// Définir les routes
router.get(
  "/hello",
  async (req, url) => {
    return new Response(JSON.stringify({ message: "Hello, World!" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
  false
); // false = pas d'authentification requise

// Route avec authentification et paramètre
router.get(
  "/users/:id",
  async (req, url, user) => {
    const userId = url.params.id;
    return new Response(
      JSON.stringify({
        message: `Utilisateur ${userId} demandé par ${user.email}`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  },
  true
); // true = authentification requise

// Handler principal
const handler = async (req: Request): Promise<Response> => {
  // Gestion CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const url = new URL(req.url);

    // Vérifier si cette requête est destinée à cette fonction
    if (!isPathForFunction(url.pathname, FUNCTION_NAME)) {
      return new Response(
        JSON.stringify({ error: "Edge Function non trouvée" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Traiter la requête avec le routeur
    return await router.handleRequest(req);
  } catch (error) {
    console.error("Erreur:", error);
    return new Response(
      JSON.stringify({ error: "Erreur interne du serveur" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

// Démarrer le serveur
serve(handler);
```

### 3. Authentification flexible

Le système d'authentification supporte plusieurs méthodes :

```typescript
import { AuthType, authenticateUser } from "./shared/auth-utils.ts";

// Exemple de route avec authentification personnalisée
router.get(
  "/protected",
  async (req, url) => {
    try {
      // Authentification avec JWT ou API Key, avec support du mode test
      const user = await authenticateUser(req, {
        authType: [AuthType.JWT, AuthType.API_KEY],
        requiredRole: ["admin", "manager"],
        allowTestMode: true,
      });

      return new Response(JSON.stringify({ message: "Accès autorisé", user }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }
  },
  false
); // false car nous gérons l'authentification manuellement
```

### 4. Déploiement

Pour déployer votre Edge Function améliorée, utilisez le script PowerShell fourni :

```powershell
./improve-edge-function.ps1
```

Ou utilisez directement la CLI Supabase :

```bash
supabase functions deploy my-edge-function --project-ref votre-ref-projet
```

## URLs supportées

Le framework supporte différents formats d'URL Supabase :

1. Format standard : `/functions/v1/ma-fonction/chemin`
2. Format court : `/ma-fonction/chemin`
3. Format sans version : `/functions/ma-fonction/chemin`
4. Format REST API : `/rest/v1/functions/ma-fonction/chemin`

## Remarques sur les navigateurs Web

Si vous prévoyez d'appeler vos Edge Functions depuis un navigateur web, assurez-vous que :

1. La configuration CORS est correcte
2. Vous fournissez l'en-tête `apikey` dans vos requêtes
3. Pour les fonctions authentifiées, vous incluez l'en-tête `Authorization: Bearer votre-token-jwt`

## Résolution des problèmes

### Edge Function inaccessible

Si votre Edge Function n'est pas accessible après le déploiement, vérifiez :

1. Les journaux de déploiement : `supabase functions logs --project-ref votre-ref-projet`
2. Que la fonction est bien déployée : `supabase functions list --project-ref votre-ref-projet`
3. Que vous utilisez les bons en-têtes d'authentification
4. Que vous avez configuré les variables d'environnement nécessaires

### Problèmes d'authentification

En cas de problèmes d'authentification :

1. Vérifiez que votre token JWT est valide
2. Assurez-vous d'envoyer le token dans l'en-tête `Authorization: Bearer votre-token`
3. Pour l'authentification par clé API, vérifiez que la clé est active dans votre base de données
4. Testez avec le mode test activé : ajoutez `?test=true` à l'URL ou l'en-tête `x-test-mode: true`

## Personnalisation

Vous pouvez facilement personnaliser ce framework en modifiant les fichiers utilitaires selon vos besoins spécifiques.
