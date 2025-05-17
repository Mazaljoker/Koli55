# Architecture des Services API

Ce diagramme représente la structure de la couche de services API et son intégration dans l'architecture globale.

```
┌─────────────────────────────────────────────────────────────────┐
│                     Application Next.js                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────┐     ┌───────────────┐     ┌───────────────┐  │
│  │   Pages &     │     │  Components   │     │    Hooks &     │  │
│  │   Layouts     │     │               │     │    Utils       │  │
│  └───────┬───────┘     └───────┬───────┘     └───────┬───────┘  │
│          │                     │                     │          │
│          └─────────────┬───────┴─────────────┬───────┘          │
│                        │                     │                  │
│                        ▼                     ▼                  │
│          ┌─────────────────────────────────────────────┐       │
│          │            Couche de Services API           │       │
│          ├─────────────────────────────────────────────┤       │
│          │                                             │       │
│          │  ┌─────────────┐   ┌─────────────────────┐  │       │
│          │  │ API Types   │◄──┤ Services individuels │  │       │
│          │  └─────────────┘   │    (xxxService.ts)   │  │       │
│          │                    └──────────┬───────────┘  │       │
│          │                               │              │       │
│          │                    ┌──────────▼───────────┐  │       │
│          │                    │  index.ts (exports)  │  │       │
│          │                    └──────────┬───────────┘  │       │
│          │                               │              │       │
│          └───────────────────────────────┼──────────────┘       │
│                                          │                      │
└──────────────────────────────────────────┼──────────────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │  Supabase Client        │
                              │  supabase.functions     │
                              └───────────┬─────────────┘
                                          │
                                          ▼
                              ┌─────────────────────────┐
                              │  Supabase Edge Functions│
                              │  (Backend logic)        │
                              └─────────────────────────┘
```

## Flux de données

1. Les composants ou pages React appellent les services API
2. Les services formatent les requêtes et appellent les fonctions Edge via Supabase
3. Les Edge Functions exécutent la logique métier et accèdent à la base de données
4. Les réponses sont standardisées et typées via les interfaces TypeScript
5. Les composants reçoivent des données structurées et peuvent réagir en conséquence

## Avantages de cette architecture

- **Séparation des préoccupations** - La logique d'API est isolée des composants UI
- **Réutilisabilité** - Les services peuvent être utilisés dans plusieurs composants
- **Maintenance** - Les modifications d'API sont centralisées dans un seul endroit
- **Typesafe** - TypeScript garantit que les données correspondent aux attentes 