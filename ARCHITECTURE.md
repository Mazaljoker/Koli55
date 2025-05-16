# Architecture du projet

## Backend
- Supabase Functions (Deno)
- PostgreSQL Supabase avec RLS
- Auth Supabase (email + token)
- Appels sécurisés vers Vapi.ai via Edge Functions

## Frontend
- Next.js
- Appels aux fonctions via `supabase.functions.invoke()`
- SDK Vapi client généré à partir de l’OpenAPI JSON

## Dossier `/supabase/functions`
Contient 1 fichier par entité du backend (assistants, workflows, etc.)
