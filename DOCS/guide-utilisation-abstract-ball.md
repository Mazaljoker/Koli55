# Guide d'Utilisation - Composant AbstractBall AlloKoli

## 📋 Vue d'Ensemble

Le composant **AbstractBall** est maintenant intégré dans l'interface configurateur d'AlloKoli. Il s'agit d'une sphère 3D interactive utilisant Three.js avec des shaders personnalisés qui réagit aux interactions vocales et aux états de session.

## 🎯 Fonctionnalités

### ✨ Effets Visuels
- **Sphère 3D animée** avec géométrie icosaédrique
- **Shaders personnalisés** avec bruit Perlin pour déformation
- **Post-processing** avec bloom et effets de lumière
- **Animations réactives** au volume audio et état de session
- **Couleurs personnalisables** selon la charte AlloKoli

### 🎮 Interactivité
- **Réaction au volume** : La sphère se déforme selon l'intensité vocale
- **État de session** : Taille et complexité adaptées selon l'activité
- **Rotation automatique** avec possibilité de contrôle caméra
- **Responsive** : S'adapte à toutes les tailles d'écran

## 🚀 Installation et Configuration

### 1. Installation Automatique
```powershell
# Exécuter le script d'installation
pwsh -File install-abstract-ball.ps1

# Tester l'installation
pwsh -File test-abstract-ball-installation.ps1
```

### 2. Vérification Manuelle
```powershell
# Vérifier la structure
ls frontend/components/examples/abstract-ball.tsx
ls frontend/app/configurateur/components/ConfiguratorGlob.tsx

# Vérifier les dépendances
cd frontend
npm list three @types/three
```

## 🎨 Utilisation dans le Code

### Import et Configuration de Base
```typescript
import AbstractBall from '@/components/examples/abstract-ball';

// Configuration par défaut
<AbstractBall 
  currentVolume={0}
  isSessionActive={false}
/>
```

### Configuration Avancée
```typescript
<AbstractBall 
  // Paramètres visuels
  chromaRGBr={7.5}
  chromaRGBg={5.0}
  chromaRGBb={7.0}
  
  // Animation Perlin
  perlinTime={25.0}
  perlinMorph={5.5}
  
  // Caméra
  cameraZoom={175}
  cameraSpeedX={0.1}
  cameraSpeedY={0.05}
  
  // Interaction
  currentVolume={volumeLevel}
  isSessionActive={sessionActive}
  
  // Style
  sphereWireframe={false}
  spherePoints={false}
/>
```

## 🔧 Paramètres de Configuration

### 🎨 Couleurs et Apparence
| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `chromaRGBr` | number | 7.5 | Intensité rouge (0-10) |
| `chromaRGBg` | number | 5.0 | Intensité verte (0-10) |
| `chromaRGBb` | number | 7.0 | Intensité bleue (0-10) |
| `sphereWireframe` | boolean | false | Mode wireframe |
| `spherePoints` | boolean | false | Mode points |
| `spherePsize` | number | 1.0 | Taille des points |

### 🌊 Animation Perlin
| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `perlinTime` | number | 25.0 | Vitesse d'animation |
| `perlinMorph` | number | 5.5 | Intensité déformation |
| `perlinDNoise` | number | 1.0 | Densité du bruit |

### 📹 Contrôle Caméra
| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `cameraZoom` | number | 175 | Distance de la caméra |
| `cameraSpeedX` | number | 0.0 | Vitesse rotation X |
| `cameraSpeedY` | number | 0.0 | Vitesse rotation Y |
| `cameraGuide` | boolean | false | Guides visuels |

### 🎤 Interaction Audio
| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `currentVolume` | number | 0 | Niveau audio (0-100) |
| `isSessionActive` | boolean | false | État de session active |

## 🎯 Intégration avec Vapi

### Hook Configurateur
```typescript
import { useVapiConfigurator } from '@/hooks/use-vapi-configurator';

function ConfiguratorPage() {
  const { 
    volumeLevel, 
    isSessionActive, 
    sessionState 
  } = useVapiConfigurator();

  return (
    <AbstractBall 
      currentVolume={volumeLevel}
      isSessionActive={isSessionActive}
      chromaRGBr={sessionState === 'listening' ? 9.0 : 7.5}
      chromaRGBg={sessionState === 'speaking' ? 8.0 : 5.0}
    />
  );
}
```

### États Visuels par Session
```typescript
const getGlobConfig = (sessionState: string) => {
  switch (sessionState) {
    case 'idle':
      return {
        chromaRGBr: 5.0,
        chromaRGBg: 5.0,
        chromaRGBb: 8.0,
        perlinMorph: 3.0
      };
    case 'listening':
      return {
        chromaRGBr: 8.0,
        chromaRGBg: 6.0,
        chromaRGBb: 4.0,
        perlinMorph: 7.0
      };
    case 'speaking':
      return {
        chromaRGBr: 9.0,
        chromaRGBg: 7.0,
        chromaRGBb: 3.0,
        perlinMorph: 9.0
      };
    default:
      return {};
  }
};
```

## 🎨 Personnalisation Avancée

### Thèmes de Couleurs AlloKoli
```typescript
// Thème principal AlloKoli
const allokoliTheme = {
  chromaRGBr: 7.5, // Orange AlloKoli
  chromaRGBg: 5.0, // Vert secondaire
  chromaRGBb: 7.0  // Bleu accent
};

// Thème restaurant
const restaurantTheme = {
  chromaRGBr: 9.0, // Rouge chaleureux
  chromaRGBg: 6.0, // Orange appétissant
  chromaRGBb: 3.0  // Jaune doré
};

// Thème nuit
const nightTheme = {
  chromaRGBr: 3.0, // Rouge sombre
  chromaRGBg: 3.0, // Vert sombre
  chromaRGBb: 8.0  // Bleu nuit
};
```

### Animations Personnalisées
```typescript
// Animation pulsation
const pulseAnimation = {
  perlinTime: 15.0,
  perlinMorph: 8.0,
  cameraSpeedY: 0.02
};

// Animation rotation
const rotationAnimation = {
  cameraSpeedX: 0.05,
  cameraSpeedY: 0.03,
  perlinTime: 30.0
};

// Animation réactive
const reactiveAnimation = (volume: number) => ({
  perlinMorph: 5.0 + (volume / 10),
  chromaRGBr: 7.5 + (volume / 20),
  perlinTime: 25.0 - (volume / 5)
});
```

## 🔧 Dépannage

### Problèmes Courants

#### 1. Sphère ne s'affiche pas
```typescript
// Vérifier les dépendances
npm list three @types/three

// Vérifier l'import
import AbstractBall from '@/components/examples/abstract-ball';

// Vérifier le conteneur
<div style={{ width: '100%', height: '400px' }}>
  <AbstractBall />
</div>
```

#### 2. Erreurs de compilation
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install

# Vérifier TypeScript
npx tsc --noEmit --skipLibCheck
```

#### 3. Performance lente
```typescript
// Réduire la complexité
<AbstractBall 
  cameraZoom={200}  // Plus loin
  perlinTime={40.0} // Plus lent
  // Désactiver post-processing si nécessaire
/>
```

### Logs de Debug
```typescript
// Activer les logs Three.js
console.log('Three.js version:', THREE.REVISION);

// Vérifier WebGL
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');
console.log('WebGL support:', !!gl);
```

## 📱 Responsive Design

### Adaptation Mobile
```typescript
const isMobile = window.innerWidth < 768;

<AbstractBall 
  cameraZoom={isMobile ? 200 : 175}
  perlinMorph={isMobile ? 4.0 : 5.5}
  // Réduire les effets sur mobile
/>
```

### Adaptation Tablette
```typescript
const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

<AbstractBall 
  cameraZoom={isTablet ? 185 : 175}
  // Configuration intermédiaire
/>
```

## 🚀 Déploiement

### Build Production
```bash
cd frontend
npm run build

# Vérifier la taille du bundle
npm run analyze
```

### Optimisations
```typescript
// Lazy loading du composant
const AbstractBall = lazy(() => import('@/components/examples/abstract-ball'));

// Avec Suspense
<Suspense fallback={<div>Chargement...</div>}>
  <AbstractBall />
</Suspense>
```

## 📚 Ressources

### Documentation Three.js
- [Three.js Documentation](https://threejs.org/docs/)
- [Shader Material](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- [Post-processing](https://threejs.org/docs/#manual/en/introduction/How-to-use-post-processing)

### VapiBlocks
- [Repository VapiBlocks](https://github.com/cameronking4/VapiBlocks)
- [Exemples de composants](https://vapiblocks.com/examples)

### AlloKoli
- [Documentation complète](./index-documentation-complete.md)
- [Guide configurateur](./guide-configurateur-allokoli.md)
- [Plan d'intégration](./plan-integration-frontend-configurateur.md)

---

## ✅ Checklist d'Installation

- [ ] Script `install-abstract-ball.ps1` exécuté
- [ ] Test `test-abstract-ball-installation.ps1` passé
- [ ] Dépendances Three.js installées
- [ ] Composant AbstractBall créé
- [ ] ConfiguratorGlob mis à jour
- [ ] Interface testée sur http://localhost:3000/configurateur
- [ ] Interactions vocales fonctionnelles
- [ ] Responsive testé sur mobile/tablette

**🎉 Le composant AbstractBall est maintenant pleinement intégré dans AlloKoli !** 