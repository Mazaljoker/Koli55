# Guide des Fonctions Supabase Edge

## ✅ Conclusion de la Phase 5
La Phase 5 est maintenant complète ! Nous avons implémenté avec succès :
- 4 composants d'infrastructure partagée dans `shared/`
- 15 Edge Functions couvrant toutes les fonctionnalités de l'API Vapi
- Chaque Edge Function suit la même architecture avec authentification, validation, et gestion d'erreurs standardisée
- Le frontend pourra interagir avec ces fonctions via `supabase.functions.invoke()` sans jamais accéder directement à l'API Vapi

## Bonnes pratiques découvertes pour les Edge Functions :
- ✅ Utiliser un seul dossier pour les utilitaires partagés (`shared/` sans underscore)
- ✅ Toujours utiliser l'extension `.ts` pour les imports internes
- ✅ Passer systématiquement 4 arguments à `callVapiAPI` (avec `undefined` pour `body` si non utilisé)
- ✅ Typer explicitement les paramètres et retours de fonctions
- ✅ Utiliser les schémas de validation pour chaque endpoint
- ✅ Ne pas utiliser le SDK Vapi (incompatible avec Deno/Supabase)
- ✅ Utiliser des appels HTTP directs via `fetch` avec la fonction utilitaire `callVapiAPI`
- ✅ Créer des interfaces TypeScript pour les paramètres et réponses d'API

## Leçons apprises :
- Les imports dans Deno/Supabase doivent avoir l'extension `.ts` explicite
- Le dossier partagé doit s'appeler `shared/` (pas `_shared/`)
- Les imports internes doivent être relatifs (ex: `../shared/cors.ts`)
- Les imports externes doivent être complets (ex: `https://deno.land/std@0.168.0/http/server.ts`)
- Pas de SDK externe non compatible avec Deno (comme le SDK Vapi)
- Convertir les paramètres de pagination en Record<string, number> pour l'API
- Utiliser des interfaces TypeScript pour une meilleure type safety

---

## 🛠️ Consignes de migration Edge Functions Vapi

### Bonnes pratiques pour la migration
- **Utiliser uniquement des appels HTTP directs** (`fetch`) vers l'API Vapi dans les Edge Functions, pas le SDK Vapi (incompatible avec Deno/Supabase).
- Centraliser la logique d'appel HTTP dans une fonction utilitaire partagée (`callVapiAPI`).
- Factoriser les headers CORS, l'authentification, la gestion d'erreur et la validation dans le dossier `_shared/`.
- Toujours typer explicitement les paramètres de fonction (évite les erreurs TypeScript/Deno).
- Utiliser des schémas de validation pour chaque endpoint (création, update, query, etc.).

### Erreurs courantes à éviter
- **Noms réservés** : ne jamais utiliser `delete`, `update`, etc. comme noms de variables ou fonctions. Préférer `deleteAssistant`, `updateKnowledgeBase`, etc.
- **Imports** :
  - Toujours utiliser des chemins relatifs avec l'extension `.ts` pour les imports dans Deno/Supabase (ex : `../shared/cors.ts`).
  - Ne pas importer de `.js` ou de modules non compatibles Deno.
- **Appels à callVapiAPI** :
  - Toujours passer 4 arguments (`endpoint`, `apiKey`, `method`, `body`), même si `body` est `undefined` pour les requêtes GET/DELETE.
  - **Pas de double await** : ne pas faire `await (await callVapiAPI(...))`.
  - **Pas de VapiClient** : ne pas instancier ou utiliser `VapiClient` dans les Edge Functions (SDK non supporté).

### Processus de migration recommandé
1. **Copier la structure de la fonction `/assistants`** (qui fonctionne) pour chaque nouvelle fonction.
2. **Supprimer tout import ou usage du SDK Vapi**.
3. **Injecter la fonction utilitaire `callVapiAPI`** si elle n'est pas déjà partagée.
4. **Adapter tous les endpoints** pour correspondre à la documentation Vapi (vérifier les chemins et méthodes HTTP).
5. **Renommer les variables/fonctions problématiques** (reserved words).
6. **Déployer et tester chaque fonction individuellement** avec `supabase functions deploy <nom>` et un outil comme Postman/cURL.
7. **Vérifier les logs** avec `supabase functions logs <nom>` en cas d'erreur.
8. **Documenter chaque endpoint** (format, params, réponses) pour faciliter l'intégration frontend.

### Rappels
- Toujours relire et tester manuellement après migration automatique.
- Mettre à jour la documentation technique à chaque modification majeure.
- Utiliser le dashboard Supabase pour vérifier le bon déploiement et l'authentification.
- Préparer des scripts de rollback en cas de problème de migration. 