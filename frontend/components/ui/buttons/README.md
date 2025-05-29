# Système de Boutons Unifié - AlloKoli

## 🎯 Objectif

Ce système de boutons unifié remplace tous les composants Button existants dans l'application pour assurer une cohérence visuelle et comportementale.

## 🚀 Utilisation de base

```tsx
import { Button } from '@/components/ui/buttons';

// Bouton simple
<Button>Cliquer ici</Button>

// Bouton avec variante
<Button variant="secondary">Annuler</Button>

// Bouton avec icône
<Button leftIcon={<Plus />}>Ajouter</Button>

// Bouton avec action asynchrone
<Button
  asyncAction={async () => await saveData()}
  loadingText="Sauvegarde..."
>
  Sauvegarder
</Button>
```

## 🎨 Variantes disponibles

- **`primary`** (défaut) : Bouton principal bleu
- **`secondary`** : Bouton secondaire gris
- **`outline`** : Bouton avec bordure
- **`ghost`** : Bouton transparent
- **`destructive`** : Bouton d'action destructive (rouge)

## 📏 Tailles disponibles

- **`sm`** : Petit (h-8, px-3, py-1.5)
- **`md`** (défaut) : Moyen (h-10, px-4, py-2)
- **`lg`** : Grand (h-12, px-6, py-3)

## ⚙️ Props principales

| Prop          | Type                                                                | Défaut      | Description                   |
| ------------- | ------------------------------------------------------------------- | ----------- | ----------------------------- |
| `variant`     | `'primary' \| 'secondary' \| 'outline' \| 'ghost' \| 'destructive'` | `'primary'` | Style visuel                  |
| `size`        | `'sm' \| 'md' \| 'lg'`                                              | `'md'`      | Taille du bouton              |
| `loading`     | `boolean`                                                           | `false`     | État de chargement            |
| `asyncAction` | `() => Promise<void>`                                               | -           | Action asynchrone automatique |
| `loadingText` | `string`                                                            | -           | Texte pendant le chargement   |
| `leftIcon`    | `ReactNode`                                                         | -           | Icône à gauche                |
| `rightIcon`   | `ReactNode`                                                         | -           | Icône à droite                |
| `fullWidth`   | `boolean`                                                           | `false`     | Bouton pleine largeur         |
| `disabled`    | `boolean`                                                           | `false`     | Bouton désactivé              |

## 🔄 Gestion des états asynchrones

Le composant gère automatiquement les actions asynchrones :

```tsx
<Button
  asyncAction={async () => {
    await fetch("/api/data", { method: "POST" });
  }}
  loadingText="Envoi en cours..."
>
  Envoyer
</Button>
```

## 🎪 Hook useAsyncButton

Pour une gestion plus avancée des états asynchrones :

```tsx
import { useAsyncButton } from "@/components/ui/buttons/hooks/useAsyncButton";

function MyComponent() {
  const { loading, error, execute } = useAsyncButton({
    onSuccess: () => toast.success("Succès !"),
    onError: (err) => toast.error(err.message),
  });

  return (
    <Button
      loading={loading}
      onClick={() =>
        execute(async () => {
          // Votre action async ici
        })
      }
    >
      Action complexe
    </Button>
  );
}
```

## 📋 Exemples d'utilisation

### Formulaire de base

```tsx
<div className="flex gap-2">
  <Button variant="outline" onClick={onCancel}>
    Annuler
  </Button>
  <Button asyncAction={onSubmit} loadingText="Envoi..." disabled={!isValid}>
    Confirmer
  </Button>
</div>
```

### Boutons avec icônes

```tsx
import { Plus, Download, Settings, Trash2 } from "lucide-react";

<div className="flex gap-2">
  <Button leftIcon={<Plus />}>Ajouter</Button>
  <Button rightIcon={<Download />} variant="outline">
    Télécharger
  </Button>
  <Button variant="ghost" size="sm">
    <Settings className="h-4 w-4" />
  </Button>
  <Button variant="destructive" leftIcon={<Trash2 />}>
    Supprimer
  </Button>
</div>;
```

### Navigation

```tsx
<Button variant="ghost" fullWidth onClick={() => router.push("/dashboard")}>
  Retour au tableau de bord
</Button>
```

## 🚨 Migration depuis les anciens boutons

Remplacez tous les imports existants :

```tsx
// ❌ Ancien
import { Button } from "@/components/ui/button";

// ✅ Nouveau
import { Button } from "@/components/ui/buttons";
```

## 🎨 Personnalisation

Le système utilise Tailwind CSS avec des classes modulaires. Pour personnaliser :

1. Modifiez les variantes dans `buttonVariants`
2. Ajoutez de nouvelles tailles ou variantes selon les besoins
3. Utilisez la prop `className` pour des modifications ponctuelles

## 🧪 Tests avec Storybook

Tous les composants sont documentés dans Storybook :

```bash
npm run storybook
```

Naviguez vers **UI > Buttons > Button** pour voir tous les exemples interactifs.
