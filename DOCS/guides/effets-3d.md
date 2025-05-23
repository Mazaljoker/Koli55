# Guide d'utilisation des effets 3D avec Framer Motion

Ce guide explique comment utiliser les composants d'effets 3D avancés créés avec Framer Motion pour enrichir l'interface utilisateur d'AlloKoli.

## Installation et configuration

Assurez-vous que framer-motion est installé dans le projet :

```bash
npm install framer-motion
# ou
pnpm add framer-motion
```

## Liste des composants disponibles

Les composants suivants sont disponibles dans `frontend/components/ui/3d-effects.tsx` et peuvent être importés via `frontend/components/ui/index.ts`.

### 1. TiltCard - Carte avec effet de tilt 3D

Une carte qui s'incline en fonction de la position de la souris avec un effet de lumière optionnel.

```tsx
import { TiltCard } from '../components/ui';

// Utilisation basique
<TiltCard
  title="Titre de la carte"
  hoverable
  tiltFactor={15} // Contrôle l'intensité de l'inclinaison
  glareEffect={true} // Ajoute un effet de reflet lumineux
>
  Contenu de la carte
</TiltCard>
```

**Props disponibles :**
- `tiltFactor`: Nombre (défaut: 15) - Intensité de l'inclinaison
- `glareEffect`: Booléen (défaut: true) - Active/désactive l'effet de reflet
- `glareColor`: Chaîne (défaut: 'rgba(255, 255, 255, 0.4)') - Couleur du reflet
- `perspective`: Nombre (défaut: 1000) - Perspective 3D
- Toutes les props d'un composant Card d'Ant Design

### 2. FloatingElement - Élément flottant

Un composant qui flotte doucement vers le haut et vers le bas en continu.

```tsx
import { FloatingElement } from '../components/ui';

<FloatingElement 
  amplitude={10} // Amplitude du flottement en pixels
  duration={4} // Durée d'un cycle complet en secondes
  delay={0} // Délai avant le début de l'animation
>
  <div>Je flotte !</div>
</FloatingElement>
```

**Props disponibles :**
- `amplitude`: Nombre (défaut: 10) - Amplitude du mouvement en pixels
- `duration`: Nombre (défaut: 4) - Durée d'un cycle complet en secondes
- `delay`: Nombre (défaut: 0) - Délai avant le début de l'animation
- `className`: Chaîne - Classes CSS additionnelles
- `style`: Objet - Styles inline additionnels

### 3. ParallaxContainer - Conteneur avec effet parallax

Un conteneur qui crée un effet de parallax basé sur la position de la souris.

```tsx
import { ParallaxContainer } from '../components/ui';

<ParallaxContainer sensitivity={20}>
  {/* Les éléments enfants se déplaceront à différentes vitesses */}
  <div>Couche arrière (se déplace peu)</div>
  <div>Couche milieu</div>
  <div>Couche avant (se déplace beaucoup)</div>
</ParallaxContainer>
```

**Props disponibles :**
- `sensitivity`: Nombre (défaut: 20) - Sensibilité du mouvement parallax
- `className`: Chaîne - Classes CSS additionnelles
- `style`: Objet - Styles inline additionnels

### 4. RotatingBadge - Badge rotatif

Un badge qui tourne autour d'un élément.

```tsx
import { RotatingBadge } from '../components/ui';

<RotatingBadge 
  count="NEW" 
  color="#7745FF"
  duration={12} // Durée d'une rotation complète en secondes
>
  <Card>
    Contenu avec un badge tournant
  </Card>
</RotatingBadge>
```

**Props disponibles :**
- `count`: ReactNode - Contenu du badge (texte ou élément)
- `duration`: Nombre (défaut: 12) - Durée d'une rotation complète en secondes
- `size`: 'default' | 'small' - Taille du badge
- `offset`: [number, number] - Décalage du badge [x, y]
- `color`: Chaîne - Couleur de fond du badge
- `className`: Chaîne - Classes CSS additionnelles

### 5. AnimatedBackground - Arrière-plan animé

Un arrière-plan avec un gradient qui change lentement.

```tsx
import { AnimatedBackground } from '../components/ui';

<AnimatedBackground 
  speed={6} // Vitesse de changement en secondes
  color1="rgba(119, 69, 255, 0.05)" 
  color2="rgba(87, 105, 255, 0.1)"
>
  Contenu sur fond animé
</AnimatedBackground>
```

**Props disponibles :**
- `speed`: Nombre (défaut: 6) - Vitesse de changement en secondes
- `color1`: Chaîne - Première couleur du gradient
- `color2`: Chaîne - Seconde couleur du gradient
- `className`: Chaîne - Classes CSS additionnelles
- `style`: Objet - Styles inline additionnels

### 6. AppearingElement - Élément apparaissant au scroll

Un élément qui apparaît avec une animation lorsqu'il entre dans la vue.

```tsx
import { AppearingElement } from '../components/ui';

<AppearingElement 
  direction="up" // Direction d'apparition
  distance={50} // Distance de déplacement en pixels
  duration={0.5} // Durée de l'animation en secondes
  delay={0} // Délai avant le début de l'animation
  once={true} // Si true, l'animation ne se produit qu'une fois
>
  Je vais apparaître depuis le bas !
</AppearingElement>
```

**Props disponibles :**
- `direction`: 'up' | 'down' | 'left' | 'right' (défaut: 'up') - Direction d'apparition
- `distance`: Nombre (défaut: 50) - Distance de déplacement en pixels
- `duration`: Nombre (défaut: 0.5) - Durée de l'animation en secondes
- `delay`: Nombre (défaut: 0) - Délai avant le début de l'animation
- `once`: Booléen (défaut: true) - Si true, l'animation ne se produit qu'une fois
- `threshold`: Nombre (défaut: 0.1) - Seuil de visibilité pour déclencher l'animation
- `className`: Chaîne - Classes CSS additionnelles
- `style`: Objet - Styles inline additionnels

## Initialisation des styles CSS

Pour garantir que tous les effets fonctionnent correctement, il faut initialiser les styles CSS. Dans votre page ou composant parent :

```tsx
import { useEffect } from 'react';
import { addMotionStyles } from '../components/ui';

export default function MyPage() {
  useEffect(() => {
    addMotionStyles();
  }, []);
  
  return (
    // Vos composants ici
  );
}
```

## Page de démonstration

Une page de démonstration est disponible pour visualiser tous ces effets en action :

```
/demo/3d-effects
```

## Bonnes pratiques

1. **Performance** : Ces effets 3D peuvent être coûteux en termes de performance. Utilisez-les avec parcimonie, surtout sur les appareils mobiles.
2. **Accessibilité** : Assurez-vous que ces effets n'interfèrent pas avec l'accessibilité. Considérez l'ajout d'une option pour désactiver les animations.
3. **Responsive** : Adaptez ou désactivez certains effets sur les petits écrans.
4. **Cohérence** : Utilisez ces effets de manière cohérente dans toute l'application pour une meilleure expérience utilisateur.

## Personnalisation

Tous les composants sont hautement personnalisables. N'hésitez pas à modifier le fichier source `frontend/components/ui/3d-effects.tsx` pour ajouter de nouvelles fonctionnalités ou ajuster les animations selon vos besoins. 