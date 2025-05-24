# 📋 Spécifications OpenAPI AlloKoli

Ce dossier contient les spécifications OpenAPI complètes de l'API AlloKoli.

## 📂 Fichiers Disponibles

### 🎯 Version Actuelle (Recommandée)
- **`allokoli-api-complete-final.yaml`** *(Version 2.0.0 - 786 lignes)*
  - Spécification concise et optimisée
  - Documentation complète des 12 services
  - 60+ endpoints documentés
  - **⭐ RECOMMANDÉ pour l'utilisation quotidienne**

### 🔧 Version Détaillée (Développement)
- **`allokoli-api-complete.yaml`** *(Version 2.0.0 - 2727 lignes)*
  - Spécification exhaustive avec tous les détails
  - Exemples étendus et métadonnées complètes
  - Parfait pour la génération de SDK
  - **🛠️ RECOMMANDÉ pour le développement avancé**

### 📚 Version Historique (Référence)
- **`allokoli-api.yaml`** *(Version 1.0.0 - 1422 lignes)*
  - Ancienne spécification (2 services seulement)
  - Conservée pour référence historique
  - **📖 Archive - ne pas utiliser pour de nouveaux projets**

## 🚀 Utilisation Rapide

### Swagger UI (Documentation Interactive)
```bash
# Ouvrir dans Swagger Editor
https://editor.swagger.io/
# Puis importer allokoli-api-complete-final.yaml
```

### Génération de Client SDK
```bash
# TypeScript
npx @openapitools/openapi-generator-cli generate \
  -i allokoli-api-complete-final.yaml \
  -g typescript-fetch \
  -o ./generated/typescript

# Python
npx @openapitools/openapi-generator-cli generate \
  -i allokoli-api-complete-final.yaml \
  -g python \
  -o ./generated/python
```

### Validation
```bash
# Valider la syntaxe YAML
npx swagger-cli validate allokoli-api-complete-final.yaml

# Ou utiliser le script PowerShell inclus
..\validate-openapi.ps1
```

## 🏗️ Services Documentés (12/12)

✅ **assistants** - Gestion des assistants vocaux IA  
✅ **knowledge-bases** - Bases de connaissances et recherche sémantique  
✅ **calls** - Historique et monitoring des appels  
✅ **phone-numbers** - Provisioning et gestion des numéros  
✅ **files** - Upload et gestion des fichiers  
✅ **analytics** - Métriques et rapports d'utilisation  
✅ **webhooks** - Événements temps réel  
✅ **workflows** - Configuration des flux conversationnels  
✅ **squads** - Gestion des équipes et collaboration  
✅ **functions** - Fonctions personnalisées pour assistants  
✅ **test-suites** - Tests automatisés et validation  
✅ **test** - Tests et monitoring système  

## 🔐 Authentification

Toutes les API utilisent l'authentification JWT Supabase :

```yaml
Authorization: Bearer <supabase-jwt-token>
```

## 🌐 Serveur de Production

```
Base URL: https://aiurboizarbbcpynmmgv.supabase.co/functions/v1
Projet: KOLI (Supabase Cloud)
Status: ✅ ACTIVE_HEALTHY
```

## 📊 Métriques de la Spécification

```
Version:        2.0.0
Services:       12
Endpoints:      60+
Méthodes HTTP:  65 (GET: 28, POST: 17, PATCH: 9, DELETE: 11)
Authentification: JWT Supabase
Conformité:     OpenAPI 3.1.0
```

## 📋 Changelog

### Version 2.0.0 (25 janvier 2025)
- ✨ **Nouvelle version complète** couvrant les 12 Edge Functions
- 📈 **+52 méthodes HTTP** ajoutées (13 → 65)
- 🏗️ **+10 services** documentés (2 → 12)
- 🔧 **Schemas Vapi** intégrés (VapiModel, VapiVoice)
- 📄 **Documentation** exhaustive avec exemples

### Version 1.0.0 (Historique)
- 📋 Spécification initiale (assistants + knowledge-bases)
- 🎯 13 endpoints de base

## 🤝 Contribution

Pour modifier ou étendre la spécification :

1. **Éditer** `allokoli-api-complete-final.yaml`
2. **Valider** avec `validate-openapi.ps1`
3. **Tester** avec Swagger UI
4. **Vérifier** la synchronisation avec le backend

## 📞 Support

Pour questions ou problèmes :
- 📧 **Email :** support@allokoli.com
- 📖 **Documentation :** `../DOCS/`
- 🐛 **Issues :** Repository GitHub

---

**🎯 Spécification OpenAPI AlloKoli v2.0.0 - Complète et Opérationnelle** 