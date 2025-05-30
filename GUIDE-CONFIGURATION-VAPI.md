# 🔧 Guide de Configuration Vapi + Alternatives à Vercel

## 📋 Problème Actuel

- ❌ Erreur 401 Unauthorized avec l'API Vapi
- ❌ Pas de compte Vercel pour le webhook

## 🔑 Étape 1 : Configuration API Vapi

### 1.1 Récupérer la Clé API

1. **Connectez-vous** à https://dashboard.vapi.ai
2. **Allez dans** "API Keys" (menu de gauche)
3. **Créez une nouvelle clé** ou copiez une existante
4. **Format attendu** : `vapi_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### 1.2 Tester la Clé

1. **Modifiez** `add-tools-simple.ps1`
2. **Remplacez** `VOTRE_VRAIE_CLE_API_ICI` par votre clé
3. **Exécutez** : `pwsh -File add-tools-simple.ps1`

## 🌐 Étape 2 : Alternatives pour le Webhook

### Option A : Utiliser ngrok (Test Local)

**Avantages :** Gratuit, rapide pour tester
**Inconvénients :** URL temporaire

```bash
# 1. Installer ngrok
npm install -g ngrok

# 2. Démarrer le frontend local
cd frontend
npm run dev

# 3. Exposer le localhost avec ngrok
ngrok http 3000

# 4. Utiliser l'URL ngrok comme webhook
# Exemple: https://abc123.ngrok.io/api/vapi/webhook
```

### Option B : Deployer sur Netlify (Gratuit)

**Avantages :** Gratuit, permanent, simple
**Inconvénients :** Pas de serverless functions (seulement frontend)

```bash
# 1. Créer un compte sur netlify.com
# 2. Connecter votre repo GitHub
# 3. Déployer automatiquement
```

### Option C : Utiliser Railway (Gratuit)

**Avantages :** Gratuit, serverless functions supportées
**Inconvénients :** Plus complexe que Vercel

```bash
# 1. Créer un compte sur railway.app
# 2. Connecter le repo
# 3. Déployer
```

### Option D : Pas de Webhook (Pour l'instant)

**Pour commencer, on peut ajouter les tools SANS webhook**

Les tools seront configurés mais ne pourront pas être appelés automatiquement.
Parfait pour tester la configuration de base.

## 🚀 Plan de Déploiement Recommandé

### Phase 1 : Configuration API Vapi ✅

1. ✅ Récupérer clé API valide
2. ✅ Ajouter tools sans webhook
3. ✅ Vérifier que l'assistant a les tools

### Phase 2 : Déploiement Simple

1. 🔄 Créer compte Vercel/Netlify/Railway (5 min)
2. 🔄 Déployer le frontend (10 min)
3. 🔄 Configurer le webhook URL
4. 🔄 Tester le flow complet

### Phase 3 : Tests & Validation

1. 🔄 Test conversation complète
2. 🔄 Validation tools
3. 🔄 Interface utilisateur

## 📝 Actions Immédiates

**Maintenant :**

1. **Récupérez votre clé API Vapi** valide
2. **Modifiez** `add-tools-simple.ps1` avec la bonne clé
3. **Testez** : `pwsh -File add-tools-simple.ps1`

**Ensuite (5-10 minutes) :**

1. **Créez un compte Vercel** gratuit sur https://vercel.com
2. **Déployez le frontend** en 1 clic
3. **Configurez le webhook** avec la nouvelle URL

## 🎯 Résultat Attendu

Une fois l'étape 1 réussie, vous devriez voir :

```
✅ Assistant trouvé !
   Nom: AlloKoli Configurateur Expert
   ID: 46b73124-6624-45ab-89c7-d27ecedcb251
   Tools actuels: 0

✅ Tools ajoutés avec succès !
   Tools configurés: 3
```

**L'assistant aura alors les 3 tools configurés et pourra être testé !**
