# Workflow d'intégration Vapi

Ce diagramme illustre le flux de travail standard pour l'intégration avec l'API Vapi.

```
┌──────────────────┐     ┌────────────────────┐     ┌───────────────────┐
│                  │     │                    │     │                   │
│  UI Composants   │────►│ Frontend Services  │────►│  Edge Functions   │
│                  │     │                    │     │                   │
└──────────────────┘     └────────────────────┘     └─────────┬─────────┘
                                                              │
                                                              │
                                                              ▼
┌──────────────────┐     ┌────────────────────┐     ┌───────────────────┐
│                  │     │                    │     │                   │
│     Réponse      │◄────│ Traitement données │◄────│     API Vapi      │
│                  │     │                    │     │                   │
└──────────────────┘     └────────────────────┘     └───────────────────┘
```

## Étapes du workflow

1. **Interaction utilisateur** : L'utilisateur interagit avec les composants UI React
2. **Services frontend** : Les services API (`lib/api/*.ts`) construisent et envoient les requêtes
3. **Edge Functions** : Les fonctions Supabase Edge (`supabase/functions/`) traitent les requêtes
4. **Mapping et validation** : Les données sont validées et transformées au format Vapi
5. **Appel API Vapi** : Les Edge Functions appellent l'API Vapi avec les données transformées
6. **Traitement des réponses** : Les réponses Vapi sont traitées et formatées
7. **Affichage** : Les données sont renvoyées au frontend pour affichage

## Exemple concret : Création d'un assistant

```
Frontend                         Edge Function                      Vapi API
┌─────────┐                      ┌─────────────┐                   ┌─────────┐
│         │ 1. Requête           │             │ 3. Appel API      │         │
│         │ ──────────────────►  │             │ ─────────────────►│         │
│ React   │                      │ assistants  │                   │ API     │
│         │ 5. Réponse           │             │ 4. Réponse        │         │
│         │ ◄────────────────────│             │ ◄─────────────────│         │
└─────────┘                      └─────────────┘                   └─────────┘
     ▲                                  │
     │                                  │
     │                                  ▼
     │                           ┌─────────────┐
     │                           │             │
     └───────────────────────────│ Supabase DB │
               6. Affichage      │             │
                                 └─────────────┘
                                   2. Stockage
```

## Particularités du pattern d'intégration

- **Fonctions de mapping** : Chaque entité possède des fonctions dédiées pour transformer les données (`mapToVapiEntityFormat`)
- **Logging standardisé** : Utilisation de préfixes de log cohérents (`[HANDLER]`, `[MAPPING]`, `[VAPI_SUCCESS]`, `[VAPI_ERROR]`)
- **Validation** : Validation systématique des données entrantes avec des schémas définis
- **Gestion d'erreurs uniforme** : Utilisation de `errorResponse()` pour garantir un format d'erreur cohérent
- **Métadonnées utilisateur** : Ajout automatique des identifiants utilisateur dans les métadonnées 