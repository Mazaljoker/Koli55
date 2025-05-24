# 🚀 Déploiement Edge Functions - Supabase Cloud Only

## ☁️ Approche 100% Cloud (Sans Docker)

Ce guide explique comment déployer nos Edge Functions Vapi directement via l'interface web Supabase, conformément à notre approche **Cloud Only**.

---

## 🎯 Prérequis

- ✅ Compte Supabase actif
- ✅ Projet Supabase créé sur [app.supabase.com](https://app.supabase.com)
- ✅ Accès au code source des fonctions

---

## 📋 Étapes de Déploiement

### 1. **Accès à l'Interface Web**

1. Ouvrez [app.supabase.com](https://app.supabase.com)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet AlloKoli

### 2. **Accès aux Edge Functions**

1. Dans le menu latéral, cliquez sur **"Edge Functions"**
2. Vous verrez la liste des fonctions existantes (si déjà déployées)

### 3. **Configuration des Variables d'Environnement**

Avant de déployer, configurez les secrets :

1. Allez dans **"Settings"** > **"API"**
2. Notez votre **Project URL** et **anon key**
3. Allez dans **"Settings"** > **"Environment Variables"**
4. Ajoutez les variables suivantes :

```env
VAPI_API_KEY=pk_your_vapi_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 🔧 Déploiement des Fonctions

### **Fonction 1: Assistants**

1. Cliquez sur **"Create Function"** ou **"New Function"**
2. Nom : `assistants`
3. Copiez le contenu de `supabase/functions/assistants/index.ts`
4. Cliquez sur **"Deploy"**

### **Fonction 2: Calls**

1. Créez une nouvelle fonction nommée `calls`
2. Copiez le contenu de `supabase/functions/calls/index.ts`
3. Déployez

### **Fonction 3: Phone Numbers**

1. Créez une nouvelle fonction nommée `phone-numbers`
2. Copiez le contenu de `supabase/functions/phone-numbers/index.ts`
3. Déployez

### **Fonction 4: Files**

1. Créez une nouvelle fonction nommée `files`
2. Copiez le contenu de `supabase/functions/files/index.ts`
3. Déployez

### **Fonction 5: Webhooks**

1. Créez une nouvelle fonction nommée `webhooks`
2. Copiez le contenu de `supabase/functions/webhooks/index.ts`
3. Déployez

---

## 📁 Fonctions Partagées (Shared)

Les fichiers dans `supabase/functions/shared/` doivent être intégrés dans chaque fonction :

### **CORS (shared/cors.ts)**

Ajoutez ce code au début de chaque fonction :

```typescript
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
}
```

### **Utilitaires Vapi (shared/vapi.ts)**

Intégrez les fonctions utilitaires directement dans chaque Edge Function ou créez une fonction séparée `shared-utils`.

---

## ✅ Vérification du Déploiement

### **Test de Connectivité**

1. Dans l'interface Edge Functions, cliquez sur votre fonction
2. Utilisez l'onglet **"Invocations"** pour tester
3. Ou utilisez PowerShell :

```powershell
# Test avec le nouveau script cloud
.\test-vapi-compatibility-cloud.ps1
```

### **URLs des Fonctions**

Vos fonctions seront accessibles via :
```
https://your-project.supabase.co/functions/v1/assistants
https://your-project.supabase.co/functions/v1/calls
https://your-project.supabase.co/functions/v1/phone-numbers
https://your-project.supabase.co/functions/v1/files
https://your-project.supabase.co/functions/v1/webhooks
```

---

## 📊 Monitoring et Logs

### **Visualisation des Logs**

1. Dans Edge Functions, sélectionnez votre fonction
2. Onglet **"Logs"** pour voir les appels en temps réel
3. Filtrez par niveau (info, error, warn)

### **Métriques de Performance**

1. Onglet **"Metrics"** pour voir :
   - Nombre d'invocations
   - Temps de réponse moyen
   - Taux d'erreur
   - Utilisation des ressources

---

## 🛠️ Dépannage

### **Problème : Fonction ne se déploie pas**

**Solution :**
1. Vérifiez la syntaxe TypeScript
2. Assurez-vous que tous les imports sont corrects
3. Vérifiez les logs de déploiement dans l'interface

### **Problème : Erreurs d'environnement**

**Solution :**
1. Vérifiez que toutes les variables sont configurées
2. Redéployez après modification des variables
3. Testez avec des valeurs temporaires

### **Problème : CORS Errors**

**Solution :**
1. Vérifiez que `corsHeaders` sont bien inclus
2. Gérez les requêtes OPTIONS
3. Testez depuis différents domaines

---

## 🔄 Mise à Jour des Fonctions

### **Processus de Mise à Jour**

1. Modifiez le code dans l'interface web
2. Ou copiez le nouveau code depuis votre repository
3. Cliquez sur **"Deploy"** pour la nouvelle version
4. Testez immédiatement après déploiement

### **Rollback en Cas de Problème**

1. Dans l'historique des versions, sélectionnez une version précédente
2. Cliquez sur **"Restore"** 
3. Testez le fonctionnement

---

## 📈 Bonnes Pratiques

### **Développement Cloud-First**

- ✅ Toujours développer en pensant cloud
- ✅ Tester chaque modification en temps réel
- ✅ Utiliser les logs pour déboguer
- ✅ Configurer les alertes de monitoring

### **Sécurité**

- 🔐 Utiliser les secrets Supabase pour les clés API
- 🛡️ Valider toutes les entrées utilisateur
- 🔍 Monitorer les accès et erreurs
- 🚫 Ne jamais exposer de secrets dans le code

### **Performance**

- ⚡ Optimiser les fonctions pour des réponses rapides
- 📊 Surveiller les métriques de performance
- 🔄 Implémenter la mise en cache si nécessaire
- 🎯 Limiter les appels API externes

---

## 📞 Support

### **En Cas de Problème**

1. **Logs Supabase** : Premier point de vérification
2. **Documentation Officielle** : [docs.supabase.com](https://docs.supabase.com)
3. **Community Support** : Discord/GitHub Supabase
4. **Notre Documentation** : Consultez les autres guides

### **Ressources Utiles**

- 🔗 [Edge Functions Docs](https://supabase.com/docs/guides/functions)
- 🔗 [Déploiement Guide](https://supabase.com/docs/guides/functions/deploy)
- 🔗 [Vapi.ai API Docs](https://docs.vapi.ai/)

---

## ✅ Checklist de Déploiement

Avant de passer en production :

- [ ] ✅ Toutes les fonctions déployées
- [ ] 🔑 Variables d'environnement configurées
- [ ] 🧪 Tests de compatibilité réussis
- [ ] 📊 Monitoring activé
- [ ] 🚨 Alertes configurées
- [ ] 📋 Documentation à jour
- [ ] 👥 Équipe formée sur l'interface

---

*Guide validé pour Supabase Cloud - Approche 100% Cloud Sans Docker*  
*Dernière mise à jour : {{ current_date }}* 