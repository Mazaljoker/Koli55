# Configuration Supabase pour AlloKoli

Ce dossier contient les utilitaires pour se connecter à Supabase Cloud.

## Configuration

Pour que l'application fonctionne correctement avec Supabase Cloud, vous devez créer un fichier `.env.local` à la racine du projet frontend avec les variables suivantes :

```
# Variables d'environnement pour Supabase Cloud
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre-clé-anon-publique
```

Ces valeurs se trouvent dans le dashboard de votre projet Supabase Cloud.

## Clés API Supabase Cloud

Pour trouver les clés API de votre projet Supabase Cloud :

1. Accédez au dashboard Supabase : https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans "Project Settings" > "API"
4. Vous y trouverez votre "anon public key" et autres clés d'API

## Accès au projet Supabase

Pour accéder à votre projet Supabase Cloud, connectez-vous sur https://app.supabase.com et sélectionnez votre projet.

## Utilisation

Le client Supabase est initialisé dans le fichier `client.ts` et exporté pour être utilisé dans toute l'application. Il est configuré pour se connecter exclusivement à Supabase Cloud via les variables d'environnement.

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