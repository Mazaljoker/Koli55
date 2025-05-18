# Configuration Supabase pour AlloKoli

Ce dossier contient les utilitaires pour se connecter à Supabase, qui fonctionne en local via Docker.

## Configuration

Pour que l'application fonctionne correctement avec l'instance Supabase locale, vous devez créer un fichier `.env.local` à la racine du projet frontend avec les variables suivantes :

```
# Variables d'environnement pour Supabase local (Docker)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

Ces valeurs correspondent aux paramètres par défaut d'une instance Supabase en local.

## Clés API Supabase locales

Si vous avez besoin de trouver les clés API spécifiques à votre instance locale :

1. Accédez au Supabase Studio : http://localhost:54323
2. Connectez-vous (email et mot de passe par défaut : `admin@admin.com` / `admin`)
3. Allez dans "Project Settings" > "API"
4. Vous y trouverez votre "anon public key" et "service_role key"

## Ports Supabase Docker

- **54321** : API REST et authentification
- **54323** : Interface Supabase Studio (dashboard d'administration)

Pour accéder au Studio Supabase, ouvrez `http://localhost:54323` dans votre navigateur.

## Utilisation

Le client Supabase est initialisé dans le fichier `client.ts` et exporté pour être utilisé dans toute l'application. Il est configuré pour se connecter à l'instance Docker locale par défaut, mais utilisera les variables d'environnement si elles sont définies.

```typescript
import { supabase } from '../lib/supabase/client';

// Exemple d'utilisation
const { data, error } = await supabase.from('table_name').select('*');
```

## Vérification de la connexion

Vous pouvez utiliser le composant `SupabaseStatus` pour afficher l'état de la connexion à Supabase :

```tsx
import { SupabaseStatus } from '../components/ui/supabase-status';

// Dans votre composant
<SupabaseStatus />
``` 