# Plan d'Intégration Frontend - Agent Configurateur AlloKoli

**Date :** 24 mai 2025  
**Version :** 1.0  
**Objectif :** Intégrer l'agent configurateur dans l'UI avec VapiBlocks et le composant Glob

## 🎯 Vue d'Ensemble

Intégration de l'agent configurateur AlloKoli (`46b73124-6624-45ab-89c7-d27ecedcb251`) dans l'interface utilisateur en utilisant :
- **VapiBlocks** : Composants UI pour Vapi Web SDK
- **Composant Glob** : Visualisation 3D interactive réactive à la voix
- **Next.js App Router** : Architecture frontend existante

## 📋 Ressources Disponibles

### VapiBlocks
- **Site** : [vapiblocks.com](https://www.vapiblocks.com/)
- **Starter Template** : [next-tailwind-vapi-starter](https://github.com/cameronking4/next-tailwind-vapi-starter)
- **Composant Glob** : [vapiblocks.com/components/glob](https://www.vapiblocks.com/components/glob)

### Agent Configurateur Existant
- **ID Vapi** : `46b73124-6624-45ab-89c7-d27ecedcb251`
- **Nom** : "AlloKoliConfig Restaurant"
- **Statut** : ✅ Opérationnel et testé

## 🏗️ Architecture d'Intégration

### Structure Frontend Proposée
```
frontend/
├── app/
│   ├── configurateur/
│   │   ├── page.tsx                 # Page principale configurateur
│   │   ├── components/
│   │   │   ├── ConfiguratorGlob.tsx # Composant Glob personnalisé
│   │   │   ├── ConfiguratorChat.tsx # Interface chat
│   │   │   ├── ConfiguratorSteps.tsx # Visualisation étapes
│   │   │   └── ConfiguratorResult.tsx # Affichage résultat JSON
│   │   └── styles/
│   │       └── configurator.css     # Styles spécifiques
├── components/
│   ├── vapi/
│   │   ├── use-vapi-configurator.ts # Hook personnalisé
│   │   └── VapiConfigProvider.tsx   # Provider contexte
└── lib/
    └── configurator/
        ├── types.ts                 # Types TypeScript
        └── utils.ts                 # Utilitaires
```

## 🎨 Design et UX

### Interface Principale
1. **Hero Section** avec Glob animé
2. **Chat Interface** pour interaction vocale
3. **Progress Tracker** (7 étapes)
4. **Result Display** avec JSON généré
5. **Action Buttons** (Déployer, Sauvegarder, Modifier)

### Composant Glob Personnalisé
```typescript
// ConfiguratorGlob.tsx
import React, { useState, useEffect } from 'react';
import AbstractBall from '@/components/examples/abstract-ball';
import useVapiConfigurator from '@/hooks/use-vapi-configurator';
import { Button } from '@/components/ui/button';
import { MicIcon, PhoneOff, Settings } from 'lucide-react';

const ConfiguratorGlob: React.FC = () => {
  const { 
    volumeLevel, 
    isSessionActive, 
    toggleCall, 
    currentStep,
    isListening 
  } = useVapiConfigurator();
  
  const [config, setConfig] = useState({
    perlinTime: 25.0,
    perlinDNoise: 1.0,
    chromaRGBr: 7.5,
    chromaRGBg: 5.0,
    chromaRGBb: 7.0,
    chromaRGBn: 0.5,
    chromaRGBm: 1.0,
    sphereWireframe: false,
    spherePoints: false,
    spherePsize: 1.0,
    cameraSpeedY: 0.0,
    cameraSpeedX: 0.0,
    cameraZoom: 175,
    cameraGuide: false,
    perlinMorph: 5.5,
  });

  // Animation basée sur l'état de la conversation
  useEffect(() => {
    if (isSessionActive && volumeLevel > 0) {
      // Animation active pendant que l'utilisateur parle
      setConfig(prev => ({
        ...prev,
        perlinTime: 100.0,
        perlinMorph: 25.0,
        chromaRGBr: 10.0,
        chromaRGBg: 8.0,
        chromaRGBb: 12.0,
      }));
    } else if (isSessionActive && isListening) {
      // Animation d'écoute
      setConfig(prev => ({
        ...prev,
        perlinTime: 50.0,
        perlinMorph: 15.0,
        chromaRGBr: 5.0,
        chromaRGBg: 10.0,
        chromaRGBb: 8.0,
      }));
    } else if (isSessionActive) {
      // Session active mais silencieuse
      setConfig(prev => ({
        ...prev,
        perlinTime: 25.0,
        perlinMorph: 10.0,
        chromaRGBr: 7.5,
        chromaRGBg: 5.0,
        chromaRGBb: 7.0,
      }));
    } else {
      // État inactif
      setConfig(prev => ({
        ...prev,
        perlinTime: 5.0,
        perlinMorph: 2.0,
        chromaRGBr: 3.0,
        chromaRGBg: 3.0,
        chromaRGBb: 3.0,
      }));
    }
  }, [isSessionActive, volumeLevel, isListening]);

  // Couleurs basées sur l'étape actuelle
  useEffect(() => {
    const stepColors = {
      0: { r: 7.5, g: 5.0, b: 7.0 }, // Accueil - Violet
      1: { r: 10.0, g: 5.0, b: 5.0 }, // Nom - Rouge
      2: { r: 8.0, g: 8.0, b: 5.0 }, // Cuisine - Orange
      3: { r: 5.0, g: 10.0, b: 5.0 }, // Services - Vert
      4: { r: 5.0, g: 8.0, b: 10.0 }, // Horaires - Bleu
      5: { r: 10.0, g: 8.0, b: 10.0 }, // Spécialités - Magenta
      6: { r: 8.0, g: 10.0, b: 8.0 }, // Génération - Vert clair
    };

    const colors = stepColors[currentStep] || stepColors[0];
    setConfig(prev => ({
      ...prev,
      chromaRGBr: colors.r,
      chromaRGBg: colors.g,
      chromaRGBb: colors.b,
    }));
  }, [currentStep]);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden">
      <AbstractBall {...config} />
      
      {/* Overlay avec contrôles */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4">
        <Button 
          onClick={toggleCall} 
          className={`rounded-full w-16 h-16 ${
            isSessionActive 
              ? 'bg-red-500 hover:bg-red-600' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSessionActive ? <PhoneOff size={24} /> : <MicIcon size={24} />}
        </Button>
        
        <Button 
          variant="outline" 
          className="rounded-full w-16 h-16 bg-white/10 backdrop-blur-sm"
        >
          <Settings size={24} />
        </Button>
      </div>

      {/* Indicateur d'étape */}
      <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
        <span className="text-white font-medium">
          Étape {currentStep + 1}/7
        </span>
      </div>
    </div>
  );
};

export default ConfiguratorGlob;
```

## 🔧 Hooks et Services

### Hook Configurateur Personnalisé
```typescript
// hooks/use-vapi-configurator.ts
import { useState, useEffect, useCallback } from 'react';
import useVapi from './use-vapi';

interface ConfiguratorState {
  currentStep: number;
  collectedData: Record<string, any>;
  isComplete: boolean;
  generatedConfig: any;
}

const useVapiConfigurator = () => {
  const vapi = useVapi({
    assistantId: "46b73124-6624-45ab-89c7-d27ecedcb251",
    // Configuration spécifique au configurateur
  });

  const [state, setState] = useState<ConfiguratorState>({
    currentStep: 0,
    collectedData: {},
    isComplete: false,
    generatedConfig: null,
  });

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);

  // Écouter les messages de l'assistant
  useEffect(() => {
    if (vapi.messages.length > 0) {
      const lastMessage = vapi.messages[vapi.messages.length - 1];
      
      // Analyser le message pour déterminer l'étape
      analyzeMessageForStep(lastMessage);
      
      // Ajouter au transcript
      setTranscript(prev => [...prev, lastMessage.content]);
    }
  }, [vapi.messages]);

  const analyzeMessageForStep = (message: any) => {
    const content = message.content.toLowerCase();
    
    // Logique pour déterminer l'étape basée sur le contenu
    if (content.includes('nom du restaurant')) {
      setState(prev => ({ ...prev, currentStep: 1 }));
    } else if (content.includes('type de cuisine')) {
      setState(prev => ({ ...prev, currentStep: 2 }));
    } else if (content.includes('services')) {
      setState(prev => ({ ...prev, currentStep: 3 }));
    } else if (content.includes('horaires')) {
      setState(prev => ({ ...prev, currentStep: 4 }));
    } else if (content.includes('spécialités')) {
      setState(prev => ({ ...prev, currentStep: 5 }));
    } else if (content.includes('configuration') || content.includes('json')) {
      setState(prev => ({ ...prev, currentStep: 6, isComplete: true }));
      
      // Extraire le JSON généré
      extractGeneratedConfig(content);
    }
  };

  const extractGeneratedConfig = (content: string) => {
    try {
      // Logique pour extraire le JSON du message
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const config = JSON.parse(jsonMatch[0]);
        setState(prev => ({ ...prev, generatedConfig: config }));
      }
    } catch (error) {
      console.error('Erreur extraction JSON:', error);
    }
  };

  const startConfiguration = useCallback(() => {
    setState({
      currentStep: 0,
      collectedData: {},
      isComplete: false,
      generatedConfig: null,
    });
    setTranscript([]);
    vapi.start();
  }, [vapi]);

  const resetConfiguration = useCallback(() => {
    setState({
      currentStep: 0,
      collectedData: {},
      isComplete: false,
      generatedConfig: null,
    });
    setTranscript([]);
    vapi.stop();
  }, [vapi]);

  return {
    ...vapi,
    ...state,
    isListening,
    transcript,
    startConfiguration,
    resetConfiguration,
  };
};

export default useVapiConfigurator;
```

## 📱 Interface Utilisateur

### Page Principale Configurateur
```typescript
// app/configurateur/page.tsx
'use client';

import React from 'react';
import ConfiguratorGlob from './components/ConfiguratorGlob';
import ConfiguratorChat from './components/ConfiguratorChat';
import ConfiguratorSteps from './components/ConfiguratorSteps';
import ConfiguratorResult from './components/ConfiguratorResult';
import { VapiConfigProvider } from '@/components/vapi/VapiConfigProvider';

const ConfiguratorPage: React.FC = () => {
  return (
    <VapiConfigProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Configurateur AlloKoli
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Créez votre assistant vocal personnalisé en quelques minutes grâce à notre guide intelligent
            </p>
          </div>

          {/* Layout principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Colonne gauche - Visualisation */}
            <div className="space-y-6">
              <ConfiguratorGlob />
              <ConfiguratorSteps />
            </div>

            {/* Colonne droite - Chat et contrôles */}
            <div className="space-y-6">
              <ConfiguratorChat />
            </div>
          </div>

          {/* Résultat */}
          <ConfiguratorResult />
        </div>
      </div>
    </VapiConfigProvider>
  );
};

export default ConfiguratorPage;
```

### Composant Chat Interface
```typescript
// app/configurateur/components/ConfiguratorChat.tsx
import React from 'react';
import useVapiConfigurator from '@/hooks/use-vapi-configurator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, RotateCcw } from 'lucide-react';

const ConfiguratorChat: React.FC = () => {
  const {
    isSessionActive,
    transcript,
    currentStep,
    startConfiguration,
    resetConfiguration,
    toggleCall,
  } = useVapiConfigurator();

  const stepTitles = [
    "Accueil",
    "Nom du restaurant",
    "Type de cuisine",
    "Services offerts",
    "Horaires d'ouverture",
    "Spécialités",
    "Configuration générée"
  ];

  return (
    <Card className="h-[600px] bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <span>Assistant Configurateur</span>
          <div className="flex gap-2">
            <Button
              onClick={toggleCall}
              variant={isSessionActive ? "destructive" : "default"}
              size="sm"
            >
              {isSessionActive ? <MicOff size={16} /> : <Mic size={16} />}
              {isSessionActive ? "Arrêter" : "Commencer"}
            </Button>
            <Button
              onClick={resetConfiguration}
              variant="outline"
              size="sm"
            >
              <RotateCcw size={16} />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col h-full">
        {/* Étape actuelle */}
        <div className="mb-4 p-3 bg-blue-500/20 rounded-lg">
          <h3 className="text-white font-medium">
            {stepTitles[currentStep]}
          </h3>
        </div>

        {/* Transcript */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {transcript.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg ${
                index % 2 === 0
                  ? 'bg-blue-500/20 text-white' // Assistant
                  : 'bg-green-500/20 text-white ml-8' // Utilisateur
              }`}
            >
              <p className="text-sm">{message}</p>
            </div>
          ))}
        </div>

        {/* Instructions */}
        <div className="p-3 bg-gray-500/20 rounded-lg">
          <p className="text-gray-300 text-sm">
            {!isSessionActive 
              ? "Cliquez sur 'Commencer' pour démarrer la configuration"
              : "Parlez clairement et attendez les questions de l'assistant"
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfiguratorChat;
```

### Composant Progress Steps
```typescript
// app/configurateur/components/ConfiguratorSteps.tsx
import React from 'react';
import useVapiConfigurator from '@/hooks/use-vapi-configurator';
import { Card, CardContent } from '@/components/ui/card';
import { Check, Circle } from 'lucide-react';

const ConfiguratorSteps: React.FC = () => {
  const { currentStep, isComplete } = useVapiConfigurator();

  const steps = [
    { title: "Accueil", description: "Présentation du processus" },
    { title: "Restaurant", description: "Nom de l'établissement" },
    { title: "Cuisine", description: "Type de spécialité" },
    { title: "Services", description: "Livraison, réservations..." },
    { title: "Horaires", description: "Planning d'ouverture" },
    { title: "Spécialités", description: "Plats signature" },
    { title: "Configuration", description: "Génération finale" },
  ];

  return (
    <Card className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardContent className="p-6">
        <h3 className="text-white font-semibold mb-4">Progression</h3>
        <div className="space-y-3">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStep 
                  ? 'bg-green-500' 
                  : index === currentStep 
                    ? 'bg-blue-500' 
                    : 'bg-gray-500/30'
              }`}>
                {index < currentStep ? (
                  <Check size={16} className="text-white" />
                ) : (
                  <Circle size={16} className="text-white" />
                )}
              </div>
              <div className="flex-1">
                <h4 className={`font-medium ${
                  index <= currentStep ? 'text-white' : 'text-gray-400'
                }`}>
                  {step.title}
                </h4>
                <p className={`text-sm ${
                  index <= currentStep ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfiguratorSteps;
```

## 🚀 Déploiement et Configuration

### Installation VapiBlocks
```bash
# Cloner le starter template
git clone https://github.com/cameronking4/next-tailwind-vapi-starter.git vapi-configurator

cd vapi-configurator

# Installer les dépendances
npm install

# Ajouter les dépendances spécifiques
npm install three gsap lucide-react
```

### Configuration Environnement
```env
# .env.local
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key
NEXT_PUBLIC_CONFIGURATOR_ASSISTANT_ID=46b73124-6624-45ab-89c7-d27ecedcb251
NEXT_PUBLIC_SUPABASE_URL=https://aiurboizarbbcpynmmgv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Structure de Fichiers
```
frontend/
├── app/
│   ├── configurateur/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── ConfiguratorGlob.tsx
│   │       ├── ConfiguratorChat.tsx
│   │       ├── ConfiguratorSteps.tsx
│   │       └── ConfiguratorResult.tsx
├── components/
│   ├── examples/
│   │   └── abstract-ball.tsx      # Composant Glob de VapiBlocks
│   ├── ui/                        # Composants UI (shadcn/ui)
│   └── vapi/
│       ├── VapiConfigProvider.tsx
│       └── use-vapi-configurator.ts
├── hooks/
│   └── use-vapi.ts               # Hook VapiBlocks original
└── lib/
    └── configurator/
        ├── types.ts
        └── utils.ts
```

## 📊 Fonctionnalités Avancées

### 1. Sauvegarde de Session
```typescript
// Sauvegarde automatique dans localStorage
const saveSession = (data: any) => {
  localStorage.setItem('configurator-session', JSON.stringify(data));
};

const loadSession = () => {
  const saved = localStorage.getItem('configurator-session');
  return saved ? JSON.parse(saved) : null;
};
```

### 2. Export de Configuration
```typescript
// Export JSON et déploiement direct
const exportConfiguration = (config: any) => {
  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'assistant-config.json';
  a.click();
};
```

### 3. Intégration avec Backend
```typescript
// Déploiement automatique via Edge Function
const deployAssistant = async (config: any) => {
  const response = await fetch('/api/assistants', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  return response.json();
};
```

## 🎯 Timeline de Développement

### Phase 1 (Semaine 1)
- [ ] Setup VapiBlocks starter template
- [ ] Intégration composant Glob
- [ ] Hook configurateur de base
- [ ] Interface chat simple

### Phase 2 (Semaine 2)
- [ ] Système de progression (7 étapes)
- [ ] Animations Glob réactives
- [ ] Transcript en temps réel
- [ ] Sauvegarde de session

### Phase 3 (Semaine 3)
- [ ] Export de configuration
- [ ] Intégration backend
- [ ] Tests et optimisations
- [ ] Documentation utilisateur

### Phase 4 (Semaine 4)
- [ ] Déploiement production
- [ ] Monitoring et analytics
- [ ] Feedback utilisateurs
- [ ] Améliorations UX

## 📈 Métriques de Succès

### Techniques
- **Temps de chargement** : < 3s
- **Réactivité Glob** : < 100ms
- **Taux d'erreur** : < 1%
- **Compatibilité** : Chrome, Firefox, Safari

### Utilisateur
- **Taux de complétion** : > 80%
- **Temps de configuration** : < 15 minutes
- **Satisfaction** : > 4/5
- **Taux d'adoption** : > 60%

## 🔧 Maintenance et Support

### Monitoring
- Analytics de session
- Logs d'erreurs frontend
- Métriques de performance
- Feedback utilisateurs

### Documentation
- Guide d'utilisation
- Troubleshooting
- API documentation
- Vidéos tutoriels

---

**Plan créé le 24 mai 2025**  
**Version 1.0 - Intégration Frontend Configurateur**  
**Statut : ✅ PRÊT POUR DÉVELOPPEMENT** 