# Architecture de Koli55

Ce diagramme représente l'architecture globale du projet Koli55.

```
┌─────────────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                          │
│                                                                 │
│  ┌─────────────────┐   ┌─────────────────┐   ┌──────────────┐   │
│  │   Pages (App)   │   │   Components    │   │     Hooks     │   │
│  └────────┬────────┘   └────────┬────────┘   └──────┬───────┘   │
│           │                     │                    │           │
│           └───────────┬─────────┴──────────┬────────┘           │
│                       │                    │                     │
│               ┌───────┴────────┐  ┌───────┴────────┐            │
│               │  API Services  │  │    Utilities   │            │
│               └───────┬────────┘  └────────────────┘            │
└───────────────────────┼───────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Supabase Edge Functions (Deno)                   │
│                                                                 │
│  ┌──────────────┐ ┌───────────────┐ ┌─────────────────────────┐ │
│  │ Auth & CORS  │ │  Validation   │ │  Edge Function Router   │ │
│  └──────┬───────┘ └───────┬───────┘ └───────────┬─────────────┘ │
│         │                 │                     │               │
│  ┌──────┴─────────────────┴─────────────────────┴─────────────┐ │
│  │                                                             │ │
│  │                 Entity-specific Handlers                    │ │
│  │  ┌───────────┐ ┌────────────┐ ┌───────────┐ ┌────────────┐ │ │
│  │  │ Assistants│ │ Workflows  │ │ Squads    │ │ Functions  │ │ │
│  │  └───────────┘ └────────────┘ └───────────┘ └────────────┘ │ │
│  │                                                             │ │
│  │  ┌───────────┐ ┌────────────┐ ┌───────────┐ ┌────────────┐ │ │
│  │  │ Knowledge │ │ Calls      │ │ Files     │ │ Tests      │ │ │
│  │  └───────────┘ └────────────┘ └───────────┘ └────────────┘ │ │
│  └─────────────────────────────┬───────────────────────────────┘ │
└───────────────────────────────┬┼───────────────────────────────┘
                                │└┼─┐
                                │ │ │
┌───────────────────────────────┼┐│ │
│          Supabase Database    ││││                              │
│  ┌─────────────────────────┐  ││││                              │
│  │      PostgreSQL DB      │◄─┘│││                              │
│  └─────────────────────────┘   │││                              │
│                                │││                              │
│  ┌─────────────────────────┐  ││││                              │
│  │        Supabase Auth    │◄─┘││                              │
│  └─────────────────────────┘   ││                              │
└────────────────────────────────┘│                              │
                                  │
┌────────────────────────────────┐│
│             Vapi API            ││                              │
│  ┌─────────────────────────┐   ││                              │
│  │   Voice Assistants      │◄──┘│                              │
│  └─────────────────────────┘    │                              │
│                                 │                              │
│  ┌─────────────────────────┐   │                              │
│  │   Telephony Services    │◄──┘                              │
│  └─────────────────────────┘                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Flux de données

1. L'utilisateur interagit avec l'interface Next.js
2. Les services API dans le frontend font des appels aux Edge Functions Supabase
3. Les Edge Functions authentifient et valident les requêtes
4. Les données sont persistées dans la base de données Supabase
5. Les Edge Functions communiquent avec l'API Vapi
6. Les résultats sont retournés au frontend pour affichage

## Structure des fichiers clés

- `/app` - Routes et pages Next.js
- `/components` - Composants d'interface utilisateur réutilisables
- `/lib/api` - Services frontend pour l'accès aux API
- `/supabase/functions` - Edge Functions Supabase
  - `/shared` - Utilitaires communs
  - Chaque fonction Edge encapsule une entité Vapi (assistants, workflows, etc.)
- `/DOCS` - Documentation complète du projet 