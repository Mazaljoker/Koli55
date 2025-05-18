# Composants de Layout

Ce dossier contient les composants de layout principaux de l'application AlloKoli.

## DashboardLayout

`DashboardLayout.tsx` est le layout principal utilisé pour toutes les pages du tableau de bord.

### Caractéristiques

- Interface moderne avec effet glassmorphism
- Sidebar responsive et rétractable
- Système de navigation avec icônes
- Header fixe avec actions rapides
- Thème personnalisé Ant Design
- Layout fluide et adaptatif

### Exemple d'utilisation

```tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function MaPage() {
  return (
    <DashboardLayout>
      <div>Contenu de ma page</div>
    </DashboardLayout>
  );
}
```

### Migration Tailwind CSS → Ant Design

La migration du DashboardLayout implique :

1. **Remplacement des classes Tailwind** par des styles inline ou des propriétés de composants Ant Design :
   - Utilisation de `Layout`, `Sider`, `Header`, et `Content` d'Ant Design
   - Styles inline avec objets JavaScript pour remplacer les classes utilitaires Tailwind

2. **Thème personnalisé** :
   - Définition des tokens de couleur cohérents
   - Utilisation de `ConfigProvider` pour l'application du thème 
   - Tokens spécifiques pour les composants de layout (`bodyBg`, `colorBgHeader`)

3. **Variables de style réutilisables** :
   - Définition d'objets de style comme `glassmorphismStyle` pour la réutilisation

## MainLayout

`MainLayout.tsx` est un layout secondaire utilisé pour les pages moins complexes.

## Bonnes pratiques

- Centraliser les styles partagés entre composants
- Utiliser `theme.useToken()` pour accéder aux tokens de thème dans les composants
- Respecter l'échelle de 8px pour les espacements
- Favoriser la composition de petits composants réutilisables 