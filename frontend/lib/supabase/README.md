# Configuration Supabase pour AlloKoli

Ce dossier contient les utilitaires pour se connecter à Supabase, qui fonctionne en local via Docker.

## Configuration

Pour que l'application fonctionne correctement avec l'instance Supabase locale, vous devez créer un fichier `.env.local` à la racine du projet frontend avec les variables suivantes :

```
# Variables d'environnement pour Supabase local (Docker)
NEXT_PUBLIC_SUPABASE_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reWh3cWJvaGRqZWNodXh0Y3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc4NzI2NDEsImV4cCI6MjAwMzQ0ODY0MX0.R7Sezuhy-s4xSE__vHx7X5eQwJNAp-8B_5q1qO4SzSU
```

Ces valeurs correspondent aux paramètres par défaut d'une instance Supabase en local.

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