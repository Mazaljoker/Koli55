# Déploiement des Edge Functions

Ce guide explique comment déployer les Edge Functions Supabase pour l'application, y compris la configuration des variables d'environnement nécessaires.

## Prérequis

- [Supabase CLI](https://supabase.com/docs/guides/cli) installé
- Compte Supabase avec un projet existant
- Clé API Vapi pour les fonctionnalités d'assistants

## Configuration des variables d'environnement

Avant de déployer les Edge Functions, vous devez configurer les variables d'environnement nécessaires. Pour l'intégration Vapi, la variable clé est `VAPI_API_KEY`.

### Méthode 1: Via la CLI Supabase

```bash
# Connectez-vous à Supabase si ce n'est pas déjà fait
supabase login

# Définir la variable d'environnement pour les Edge Functions
supabase secrets set VAPI_API_KEY=votre_cle_vapi_ici --project-ref votre_ref_projet
```

### Méthode 2: Via le dashboard Supabase

1. Accédez à votre projet Supabase dans le dashboard
2. Allez dans **Settings > API**
3. Faites défiler jusqu'à la section **Edge Functions**
4. Cliquez sur **Add a new secret**
5. Entrez `VAPI_API_KEY` comme nom et votre clé API Vapi comme valeur
6. Cliquez sur **Save**

## Déploiement des Edge Functions

Une fois les variables d'environnement configurées, vous pouvez déployer les Edge Functions :

```bash
# Accédez au répertoire des fonctions
cd supabase/functions

# Déployez toutes les fonctions
supabase functions deploy --project-ref votre_ref_projet

# Ou déployez une fonction spécifique (par exemple, la fonction "assistants" uniquement)
supabase functions deploy assistants --project-ref votre_ref_projet
```

## Vérification du déploiement

Après le déploiement, vérifiez que les Edge Functions fonctionnent correctement :

```bash
# Obtenez la liste des fonctions déployées
supabase functions list --project-ref votre_ref_projet
```

Vous pouvez également tester la fonction `assistants` avec la commande curl :

```bash
curl -X POST https://votre_ref_projet.supabase.co/functions/v1/assistants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer VOTRE_SUPABASE_TOKEN" \
  -d '{"name":"Test Assistant","model":"gpt-4o","firstMessage":"Bonjour!"}'
```

## Troubleshooting

### Erreurs courantes

1. **Erreur 500 "VAPI_API_KEY is missing"** : La variable d'environnement n'est pas définie. Utilisez les méthodes ci-dessus pour la configurer.

2. **Erreur 401 "Unauthorized"** : Votre jeton d'autorisation est invalide ou manquant. Assurez-vous d'inclure un en-tête Authorization valide.

3. **Erreur dans les logs "Failed to connect to Vapi API"** : Vérifiez que votre clé API Vapi est valide et que le service Vapi est disponible.

### Consultation des logs

Pour voir les logs des Edge Functions :

```bash
# Logs en temps réel
supabase functions logs assistants --project-ref votre_ref_projet --follow

# Logs récents
supabase functions logs assistants --project-ref votre_ref_projet
```

## Ressources supplémentaires

- [Documentation Supabase sur les Edge Functions](https://supabase.com/docs/guides/functions)
- [Documentation de l'API Vapi](https://docs.vapi.ai/)
- [Guide du débogage des Edge Functions](https://supabase.com/docs/guides/functions/debugging) 