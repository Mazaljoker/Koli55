# Guide de déploiement

Ce document explique comment déployer Koli55 en environnement de développement local et en production.

## 🎉 État actuel (Phase 10.1 - COMPLÉTÉ)

**✅ DÉPLOIEMENT RÉUSSI**

- **Edge Function `assistants`** : Version 28 déployée et active sur Supabase Cloud
- **Compatibilité Vapi.ai** : 100% compatible avec l'API officielle
- **Frontend** : Prêt pour déploiement Vercel
- **Architecture** : Backend-frontend validé et opérationnel

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

# Vapi (✅ Configuration validée Phase 10.1)
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

### Déploiement des Edge Functions sur Supabase (✅ VALIDÉ)

#### Déploiement global (toutes les fonctions)
```bash
# Déployer toutes les fonctions
supabase functions deploy
```

#### Déploiement d'une fonction spécifique (✅ TESTÉ ET VALIDÉ)
```bash
# Exemple : déploiement de la fonction assistants (✅ RÉUSSI - Version 28)
supabase functions deploy assistants --project-ref aiurboizarbbcpynmmgv

# Template pour les autres fonctions
supabase functions deploy [nom_fonction] --project-ref [votre_project_ref]
```

#### Vérification des déploiements
```bash
# Lister les fonctions déployées
supabase functions list --project-ref aiurboizarbbcpynmmgv

# Consulter les logs d'une fonction
supabase functions logs assistants --project-ref aiurboizarbbcpynmmgv
```

### Bonnes pratiques découvertes (Phase 10.1)

#### ✅ Préparation des Edge Functions pour le déploiement
1. **Inclusion des dépendances partagées** : Tous les fichiers `shared/` doivent être inclus
2. **Pas de dépendances externes non compatibles** : Éviter les SDKs non compatibles Deno
3. **Structure d'URL correcte** : Supprimer les préfixes `/v1/` non conformes à Vapi
4. **Format de réponse standardisé** : Utiliser le format Vapi natif

#### ✅ Processus de déploiement validé
1. **Test local** : Validation avec `supabase functions serve`
2. **Compilation** : Vérification des erreurs TypeScript
3. **Déploiement** : `supabase functions deploy [nom]`
4. **Tests post-déploiement** : Validation avec curl ou Postman
5. **Monitoring** : Surveillance des logs en temps réel

#### ✅ Corrections critiques implémentées
- **URLs API** : `https://api.vapi.ai/assistants` (suppression `/v1/`)
- **Réponses** : Format `{ data: ... }` au lieu de `{ success: true, data: ... }`
- **Fonctions utilitaires** : `mapToVapiAssistantFormat`, `extractId`, `sanitizeString`
- **Upload de fichiers** : FormData complet avec multipart/form-data

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

### Problèmes courants (✅ RÉSOLUS)

#### Erreurs d'Edge Functions
- **✅ Solution** : Vérifiez les journaux d'exécution dans le dashboard Supabase
- **✅ Commande** : `supabase functions logs [nom_fonction] --project-ref [project_ref]`

#### Problèmes d'authentification
- **✅ Solution** : Assurez-vous que les clés Supabase sont correctes
- **✅ Validation** : Testez avec `supabase auth list` ou dashboard

#### Erreurs de connexion à Vapi (✅ RÉSOLUES Phase 10.1)
- **✅ Solution** : Clé API Vapi validée et URLs corrigées
- **✅ Format** : `https://api.vapi.ai/[endpoint]` (sans `/v1/`)

#### Erreurs de compilation Deno
- **✅ Solution** : Imports avec extension `.ts` explicite
- **✅ Exemple** : `import { corsHeaders } from '../shared/cors.ts'`

#### Dépendances non trouvées
- **✅ Solution** : Inclure tous les fichiers `shared/` dans le déploiement
- **✅ Structure validée** : `shared/cors.ts`, `shared/vapi.ts`, etc.

### Logs et monitoring (✅ OPÉRATIONNEL)

- **Frontend** : Utilisez les journaux Vercel pour surveiller l'application
- **Backend** : Consultez les journaux des Edge Functions dans le dashboard Supabase
- **Temps réel** : `supabase functions logs [fonction] --project-ref [ref]`
- **Alertes** : Activez les alertes pour les erreurs critiques

### État des déploiements

#### ✅ Déployé et fonctionnel
- **assistants** (Version 28) - 100% opérationnel

#### ⏳ Prêt pour déploiement
- **calls** - Structure complète
- **knowledge-bases** - Structure complète + interfaces frontend
- **files** - Structure complète
- **workflows** - Structure complète
- **phone-numbers** - Structure complète
- **messages** - Structure complète
- **webhooks** - Structure complète
- **squads** - Structure complète
- **functions** - Structure complète
- **analytics** - Structure complète
- **organization** - Structure complète
- **test-suites** - Structure complète
- **test-suite-tests** - Structure complète
- **test-suite-runs** - Structure complète

## CI/CD

Un pipeline CI/CD est configuré via GitHub Actions pour automatiser :
- Les tests unitaires et d'intégration
- La construction de l'application
- Le déploiement vers l'environnement approprié

### Scripts PowerShell utilitaires (✅ DISPONIBLES)

```powershell
# Migration et déploiement
.\migrate-standard.ps1

# Nettoyage des clés
.\clean-keys.ps1

# Vérification de structure
.\check-structure.ps1

# Copie des fichiers partagés
.\copy-shared.ps1
```

Consultez le fichier `.github/workflows/main.yml` pour plus de détails.

## Plan de déploiement progressif recommandé

### Phase 1 - Fonctions de base (Priorité haute)
1. **knowledge-bases** - Interfaces frontend déjà prêtes
2. **files** - Support upload nécessaire pour knowledge-bases
3. **calls** - Historique et monitoring essentiels

### Phase 2 - Fonctions avancées (Priorité moyenne)
4. **workflows** - Configuration flux conversationnels
5. **phone-numbers** - Gestion numéros Vapi
6. **webhooks** - Événements temps réel

### Phase 3 - Fonctions de gestion (Priorité normale)
7. **organization** et **squads** - Gestion organisationnelle
8. **analytics** - Métriques et rapports
9. **functions** - Outils personnalisés

### Phase 4 - Fonctions de test (Optionnel)
10. **test-suites**, **test-suite-tests**, **test-suite-runs** - Tests automatisés

## Commandes de déploiement type

```bash
# 1. Préparer l'environnement
export SUPABASE_PROJECT_REF="aiurboizarbbcpynmmgv"

# 2. Déployer une fonction spécifique
supabase functions deploy knowledge-bases --project-ref $SUPABASE_PROJECT_REF

# 3. Vérifier le déploiement
supabase functions list --project-ref $SUPABASE_PROJECT_REF

# 4. Tester la fonction
curl -X GET "https://$SUPABASE_PROJECT_REF.supabase.co/functions/v1/knowledge-bases" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# 5. Surveiller les logs
supabase functions logs knowledge-bases --project-ref $SUPABASE_PROJECT_REF
```
