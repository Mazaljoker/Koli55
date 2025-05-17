# Guide de déploiement

Ce document explique comment déployer Koli55 en environnement de développement local et en production.

## Prérequis

- Node.js 18+ (LTS recommandé)
- pnpm 10.11.0+
- Compte Supabase
- Compte Vapi.ai avec clé API
- Git

## Variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anonyme_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_supabase

# Vapi
VAPI_API_KEY=votre_clé_api_vapi
NEXT_PUBLIC_VAPI_PUBLIC_KEY=votre_clé_publique_vapi

# Sécurité
EDGE_FUNCTIONS_JWT_SECRET=secret_pour_jwt_edge_functions
```

## Déploiement local

### Installation des dépendances

```bash
# Installation des packages
pnpm install
```

### Configuration de Supabase

1. Installez la CLI Supabase :
   ```bash
   pnpm add -g supabase
   ```

2. Initialisez Supabase localement :
   ```bash
   supabase init
   supabase start
   ```

3. Liez votre projet à Supabase :
   ```bash
   supabase link --project-ref votre_reference_projet
   ```

### Démarrage du serveur de développement

```bash
pnpm dev
```

L'application sera disponible à l'adresse `http://localhost:3000`.

### Déploiement des Edge Functions

Pour tester les Edge Functions localement :

```bash
cd supabase/functions
supabase functions serve --env-file ../../.env.local
```

## Déploiement en production

### Préparation au déploiement

1. Construisez l'application :
   ```bash
   pnpm build
   ```

2. Vérifiez que tout fonctionne correctement :
   ```bash
   pnpm start
   ```

### Déploiement sur Vercel

1. Connectez votre dépôt à Vercel
2. Configurez les variables d'environnement dans l'interface Vercel
3. Déployez l'application

### Déploiement des Edge Functions sur Supabase

```bash
# Déployer toutes les fonctions
supabase functions deploy

# Déployer une fonction spécifique
supabase functions deploy nom_de_la_fonction
```

### Configuration du domaine personnalisé

1. Ajoutez votre domaine dans les paramètres de votre projet Vercel
2. Configurez les enregistrements DNS selon les instructions de Vercel
3. Activez le certificat SSL/TLS

## Structure des environnements

### Environnements recommandés

- **Développement** : Environnement local pour le développement
- **Staging** : Environnement pour les tests et la validation
- **Production** : Environnement pour les utilisateurs finaux

### Configuration multi-environnements pour Supabase

Pour chaque environnement, créez un projet Supabase distinct :

```bash
# Pour lier à l'environnement de staging
supabase link --project-ref ref_projet_staging --config-file supabase/staging.json

# Pour lier à l'environnement de production
supabase link --project-ref ref_projet_production --config-file supabase/production.json
```

## Dépannage

### Problèmes courants

- **Erreurs d'Edge Functions** : Vérifiez les journaux d'exécution dans le dashboard Supabase
- **Problèmes d'authentification** : Assurez-vous que les clés Supabase sont correctes
- **Erreurs de connexion à Vapi** : Vérifiez la validité de votre clé API Vapi

### Logs et monitoring

- Utilisez les journaux Vercel pour surveiller l'application frontend
- Consultez les journaux des Edge Functions dans le dashboard Supabase
- Activez les alertes pour les erreurs critiques

## CI/CD

Un pipeline CI/CD est configuré via GitHub Actions pour automatiser :
- Les tests unitaires et d'intégration
- La construction de l'application
- Le déploiement vers l'environnement approprié

Consultez le fichier `.github/workflows/main.yml` pour plus de détails.
