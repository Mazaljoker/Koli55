# 🧪 Guide de Test Compatibilité Vapi.ai

## 🎯 Objectif

Ce guide vous explique comment tester la compatibilité de notre backend AlloKoli avec l'API officielle Vapi.ai pour garantir une intégration parfaite.

---

## 🚀 Démarrage Rapide

### 1. **Test Automatique (Recommandé)**

```powershell
# Exécuter le script de test complet
.\test-vapi-compatibility.ps1
```

### 2. **Test Manuel**

```bash
# Déployer la fonction de test
supabase functions deploy test-vapi-compatibility

# Exécuter le test
curl -X POST https://your-project.supabase.co/functions/v1/test-vapi-compatibility \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

---

## 📋 Prérequis

### **Outils Requis**
- ✅ [Supabase CLI](https://supabase.com/docs/guides/cli) installé
- ✅ Projet Supabase configuré
- ✅ PowerShell (pour le script automatique)

### **Variables d'Environnement**
```env
VAPI_API_KEY=pk_your_vapi_key_here
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_URL=https://your-project.supabase.co
```

### **Installation des Dépendances**
```bash
# Installer Supabase CLI (si pas déjà fait)
npm install -g supabase

# Se connecter à Supabase
supabase login

# Initialiser le projet (si pas déjà fait)
supabase init
```

---

## 🔧 Tests Disponibles

### **Test 1: Structure URL** 🌐
- ✅ Vérification que les URLs n'utilisent pas `/v1/`
- ✅ Conformité avec `https://api.vapi.ai/{endpoint}`

### **Test 2: Authentification** 🔑
- ✅ Présence de la clé API Vapi
- ✅ Format Bearer Token correct
- ✅ Headers d'authentification valides

### **Test 3: Headers HTTP** 📡
- ✅ `Authorization: Bearer {token}`
- ✅ `Content-Type: application/json`
- ✅ `Accept: application/json`

### **Test 4: Couverture Endpoints** 📋
- ✅ Tous les endpoints Vapi implémentés
- ✅ Méthodes HTTP correctes (GET, POST, PATCH, DELETE)

### **Test 5: Format de Réponse** 🔄
- ✅ Analyse du format de données
- 📝 Recommandations d'alignement

---

## 📊 Interprétation des Résultats

### **Statuts Possibles**

| Statut | Signification | Action |
|--------|---------------|---------|
| ✅ `compatible` | 100% compatible | 🚀 Prêt pour production |
| ⚠️ `issues_found` | Problèmes mineurs | 🔧 Voir recommandations |
| ❌ `error` | Problèmes critiques | 🛠️ Corrections requises |

### **Exemple de Rapport**

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "overall_status": "compatible",
  "tests_run": 5,
  "tests_passed": 5,
  "issues": [],
  "recommendations": [
    "Tester avec données réelles",
    "Surveiller les logs Vapi"
  ]
}
```

---

## 🛠️ Résolution des Problèmes

### **Erreur: Fonction non déployée**
```bash
# Vérifier le statut des fonctions
supabase functions list

# Re-déployer si nécessaire
supabase functions deploy test-vapi-compatibility
```

### **Erreur: Clé API manquante**
```bash
# Vérifier les variables d'environnement
echo $VAPI_API_KEY

# Définir la clé API (remplacer par votre clé)
export VAPI_API_KEY="pk_your_key_here"
```

### **Erreur: Timeout/Connection**
```bash
# Vérifier la connectivité
curl -I https://api.vapi.ai

# Vérifier les logs Supabase
supabase functions logs test-vapi-compatibility
```

### **Erreur: Permissions Supabase**
```bash
# Vérifier l'authentification
supabase auth status

# Re-se connecter si nécessaire
supabase login
```

---

## 🔍 Tests Avancés

### **Test d'Endpoints Spécifiques**

```typescript
// Tester un endpoint particulier
const testAssistants = await callVapiAPI('assistants', 'GET');
console.log('Test assistants:', testAssistants);

// Tester la création d'assistant
const newAssistant = await vapiAssistants.create({
  name: "Test Assistant",
  model: { provider: "openai", model: "gpt-4" }
});
```

### **Test de Charge**

```bash
# Tester plusieurs appels simultanés
for i in {1..10}; do
  curl -X POST https://your-project.supabase.co/functions/v1/test-vapi-compatibility \
    -H "Authorization: Bearer $SUPABASE_ANON_KEY" &
done
wait
```

### **Test en Environnement de Production**

```bash
# Variables pour production
export SUPABASE_URL="https://your-prod-project.supabase.co"
export VAPI_API_KEY="sk_your_production_key"

# Exécuter le test
.\test-vapi-compatibility.ps1
```

---

## 📈 Monitoring et Métriques

### **Logs à Surveiller**

```bash
# Logs des Edge Functions
supabase functions logs --follow

# Logs spécifiques à Vapi
supabase functions logs test-vapi-compatibility
```

### **Métriques Importantes**

- 🕐 **Latence des appels** : < 500ms
- 📊 **Taux de succès** : > 99%
- 🔄 **Retry rate** : < 1%
- 🚫 **Erreurs 4xx/5xx** : < 0.1%

### **Alertes Recommandées**

```yaml
# Exemple de configuration d'alertes
alerts:
  - name: "Vapi API Errors"
    condition: "error_rate > 5%"
    severity: "high"
  
  - name: "Vapi High Latency"
    condition: "avg_latency > 1000ms"
    severity: "medium"
```

---

## 🔄 Intégration Continue

### **Script de CI/CD**

```yaml
# .github/workflows/vapi-compatibility.yml
name: Vapi Compatibility Test
on: [push, pull_request]

jobs:
  test-vapi:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Supabase
        run: |
          npm install -g supabase
          supabase login --token ${{ secrets.SUPABASE_ACCESS_TOKEN }}
      
      - name: Deploy Test Function
        run: supabase functions deploy test-vapi-compatibility
      
      - name: Run Compatibility Tests
        run: |
          curl -X POST ${{ secrets.SUPABASE_URL }}/functions/v1/test-vapi-compatibility \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
```

### **Tests Pré-déploiement**

```bash
# Script à exécuter avant chaque déploiement
./pre-deploy-check.sh

# Contenu du script:
# 1. Test de compatibilité Vapi
# 2. Test de régression des fonctions
# 3. Validation de la configuration
```

---

## 📚 Ressources Supplémentaires

### **Documentation Officielle**
- 📘 [Vapi.ai API Docs](https://docs.vapi.ai/)
- 🔗 [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- 🛠️ [Custom Tools Vapi](https://docs.vapi.ai/tools/custom-tools)

### **Notre Documentation**
- 🏗️ [Architecture Backend](./architecture/)
- 🔧 [Guide Configuration](./guides/)
- 📋 [Rapport de Compatibilité](./vapi-compatibility-report.md)

### **Support**
- 💬 [Discord AlloKoli](#)
- 📧 [Support Email](#)
- 🐛 [Issue Tracker](#)

---

## ✅ Checklist Finale

Avant de passer en production, vérifiez :

- [ ] ✅ Tous les tests de compatibilité passent
- [ ] 🔑 Variables d'environnement configurées
- [ ] 🌐 Endpoints testés individuellement
- [ ] 📊 Monitoring en place
- [ ] 🚨 Alertes configurées
- [ ] 📋 Documentation à jour
- [ ] 👥 Équipe formée sur les tests

---

*Dernière mise à jour : {{ current_date }}*  
*Guide validé avec Vapi.ai API v1.0* 