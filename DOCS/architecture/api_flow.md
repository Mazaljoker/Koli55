# Flux API

## Flux généraux

### Authentification
1. L'utilisateur se connecte via `auth/login`
2. Supabase Auth génère un JWT
3. Le middleware Next.js vérifie le JWT sur les routes protégées
4. Les Edge Functions vérifient le JWT via `_shared/auth.ts`

### Appel à une fonction Edge
1. Le frontend appelle `supabase.functions.invoke('nom-fonction', { data: {...} })`
2. La requête est authentifiée avec le JWT de l'utilisateur
3. La fonction Edge traite la demande et interagit avec Vapi via le SDK serveur
4. La réponse est renvoyée au frontend

## Flux par fonctionnalité

### Création d'un assistant
1. Le frontend appelle `supabase.functions.invoke('assistants', { method: 'POST', data: {...} })`
2. La fonction `assistants.ts` utilise le SDK serveur Vapi via `vapiServerClient.ts`
3. L'assistant est créé dans Vapi et ses détails sont stockés dans la DB Supabase
4. L'ID et les détails de l'assistant sont retournés au frontend

### Configuration d'un workflow
1. Le frontend appelle `supabase.functions.invoke('workflows', { method: 'POST', data: {...} })`
2. La fonction `workflows.ts` configure les étapes de conversation via le SDK Vapi
3. Le workflow est enregistré dans Vapi et référencé dans Supabase
4. L'ID et les détails du workflow sont retournés au frontend

### Gestion des numéros de téléphone
1. Le frontend appelle `supabase.functions.invoke('phone-numbers', { method: 'POST', action: 'search' })`
2. La recherche de numéros disponibles est effectuée via le SDK Vapi
3. L'utilisateur choisit un numéro et le provisionne via un second appel
4. Le numéro est attribué à un assistant ou workflow spécifique

### Appel vocal
1. Un appel arrive sur un numéro Vapi
2. Vapi envoie un webhook à `webhooks.ts` via `POST /receive`
3. La fonction `webhooks.ts` enregistre le début de l'appel dans Supabase
4. La conversation est gérée par Vapi selon la configuration de l'assistant
5. Les événements de la conversation sont envoyés en temps réel via webhooks
6. À la fin de l'appel, les métadonnées et transcriptions sont stockées dans Supabase

### Intégration d'une base de connaissances
1. Le frontend télécharge un fichier via `supabase.functions.invoke('files', { method: 'POST', data: {...} })`
2. Le fichier est traité et stocké dans Vapi via la fonction `files.ts`
3. L'utilisateur associe le fichier à une base de connaissances via `knowledge-bases.ts`
4. L'assistant peut désormais accéder aux informations contenues dans le fichier

## Intégration SDK
### SDK Client (`@vapi-ai/web`)
- Utilisé dans l'interface utilisateur pour les prévisualisations et tests
- Paramétré via `lib/vapiClient.ts`
- Permet d'effectuer des appels de test directement depuis le navigateur
- Utilisé pour les démonstrations et les tests en temps réel

### SDK Serveur (`@vapi-ai/server-sdk`)
- Utilisé dans les Edge Functions pour les opérations CRUD
- Paramétré via `lib/vapiServerClient.ts`
- Authentification sécurisée côté serveur
- Permet d'accéder à toutes les fonctionnalités de l'API Vapi

## Documentation des Edge Functions
Toutes les Edge Functions ont été soigneusement documentées avec un format standardisé qui détaille :
- Les endpoints gérés par chaque fonction
- Les variables d'entrée (Request) pour chaque endpoint, y compris :
  - Les paramètres de chemin (path params)
  - Les paramètres de requête (query params)
  - La structure du corps de la requête (body)
  - Les en-têtes requis (headers)
  - Les schémas de validation utilisés
- Les variables de sortie (Response) pour chaque endpoint, y compris :
  - La structure de la réponse en cas de succès
  - La structure de la réponse en cas d'erreur
- Les interfaces TypeScript des structures de données manipulées

Cette documentation facilite l'intégration frontend en fournissant une référence claire des données attendues et retournées par chaque endpoint. 