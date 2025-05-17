# API Services Architecture

> **Documentation complète**: Pour une documentation détaillée de l'architecture des services API, veuillez consulter [Architecture des services API](/DOCS/api_services.md)

Cette directory contient une couche standardisée de services pour interfacer avec les Supabase Edge Functions dans notre plateforme Koli55.

## Résumé

Ces services fournissent :

- Une sécurité de type avec des interfaces TypeScript
- Une gestion cohérente des erreurs
- Un modèle standardisé d'opérations CRUD
- Une abstraction propre au-dessus des appels directs à `supabase.functions.invoke()`

## Utilisation

```typescript
// Import d'un service spécifique
import { assistantsService } from 'lib/api';

// Utilisation
const response = await assistantsService.create({ name: 'Mon Assistant' });

// ou en utilisant l'API globale
import api from 'lib/api';
const response = await api.assistants.create({ name: 'Mon Assistant' });
```

## Structure du projet

- Chaque service est implémenté dans son propre fichier (`xxxService.ts`)
- Tous les services sont regroupés et exportés depuis `index.ts`
- Chaque service suit un modèle cohérent pour les opérations CRUD et la gestion des erreurs 