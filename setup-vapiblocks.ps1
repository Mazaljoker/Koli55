# Script d'installation et configuration VapiBlocks pour AlloKoli
# Version: 1.0
# Date: 24 mai 2025

Write-Host "🚀 Installation VapiBlocks pour AlloKoli Configurateur" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Vérifier si nous sommes dans le bon répertoire
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis la racine du projet" -ForegroundColor Red
    Write-Host "Répertoire actuel: $(Get-Location)" -ForegroundColor Yellow
    exit 1
}

# Naviguer vers le dossier frontend
Set-Location frontend

Write-Host "📦 Installation des dépendances VapiBlocks..." -ForegroundColor Blue

# Installer les dépendances principales
$dependencies = @(
    "three",
    "gsap", 
    "@types/three",
    "lucide-react"
)

foreach ($dep in $dependencies) {
    Write-Host "  Installing $dep..." -ForegroundColor Yellow
    npm install $dep
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors de l'installation de $dep" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Dépendances installées avec succès" -ForegroundColor Green

# Créer les répertoires nécessaires
Write-Host "📁 Création de la structure de répertoires..." -ForegroundColor Blue

$directories = @(
    "app/configurateur",
    "app/configurateur/components",
    "app/configurateur/styles",
    "components/vapi",
    "components/examples",
    "hooks",
    "lib/configurator"
)

foreach ($dir in $directories) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  ✅ Créé: $dir" -ForegroundColor Green
    } else {
        Write-Host "  ℹ️  Existe déjà: $dir" -ForegroundColor Yellow
    }
}

# Créer le fichier de configuration environnement
Write-Host "⚙️  Configuration de l'environnement..." -ForegroundColor Blue

$envContent = @"
# Configuration VapiBlocks - AlloKoli Configurateur
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key_here
NEXT_PUBLIC_CONFIGURATOR_ASSISTANT_ID=46b73124-6624-45ab-89c7-d27ecedcb251
NEXT_PUBLIC_SUPABASE_URL=https://aiurboizarbbcpynmmgv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Mode développement
NEXT_PUBLIC_DEV_MODE=true
NEXT_PUBLIC_CONFIGURATOR_DEBUG=true
"@

if (-not (Test-Path ".env.local")) {
    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    Write-Host "  ✅ Fichier .env.local créé" -ForegroundColor Green
} else {
    Write-Host "  ℹ️  .env.local existe déjà - vérifiez la configuration" -ForegroundColor Yellow
}

# Créer le fichier de types TypeScript
Write-Host "📝 Création des types TypeScript..." -ForegroundColor Blue

$typesContent = @"
// Types pour le configurateur AlloKoli
export interface RestaurantConfig {
  name: string;
  cuisine_type: string;
  services: string[];
  hours: Record<string, string>;
  specialties: string[];
}

export interface AssistantConfig {
  name: string;
  greeting: string;
  capabilities: string[];
  voice_settings: {
    tone: string;
    language: string;
  };
}

export interface ConfiguratorResult {
  restaurant: RestaurantConfig;
  assistant_config: AssistantConfig;
}

export interface VapiGlobConfig {
  perlinTime: number;
  perlinDNoise: number;
  chromaRGBr: number;
  chromaRGBg: number;
  chromaRGBb: number;
  chromaRGBn: number;
  chromaRGBm: number;
  sphereWireframe: boolean;
  spherePoints: boolean;
  spherePsize: number;
  cameraSpeedY: number;
  cameraSpeedX: number;
  cameraZoom: number;
  cameraGuide: boolean;
  perlinMorph: number;
}
"@

$typesContent | Out-File -FilePath "lib/configurator/types.ts" -Encoding UTF8
Write-Host "  ✅ Types TypeScript créés" -ForegroundColor Green

# Créer le fichier utilitaires
$utilsContent = @"
// Utilitaires pour le configurateur AlloKoli
import { ConfiguratorResult } from './types';

export const exportConfiguration = (config: ConfiguratorResult): void => {
  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `assistant-config-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const saveSession = (data: any): void => {
  localStorage.setItem('configurator-session', JSON.stringify(data));
};

export const loadSession = (): any => {
  const saved = localStorage.getItem('configurator-session');
  return saved ? JSON.parse(saved) : null;
};

export const clearSession = (): void => {
  localStorage.removeItem('configurator-session');
};
"@

$utilsContent | Out-File -FilePath "lib/configurator/utils.ts" -Encoding UTF8
Write-Host "  ✅ Utilitaires créés" -ForegroundColor Green

# Créer le fichier de styles CSS
Write-Host "🎨 Création des styles CSS..." -ForegroundColor Blue

$stylesContent = @"
/* Styles spécifiques au configurateur AlloKoli */

.configurator-glob {
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, rgba(0, 0, 0, 0.8) 70%);
  backdrop-filter: blur(10px);
}

.configurator-chat {
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.configurator-step {
  transition: all 0.3s ease;
}

.configurator-step.active {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.configurator-transcript {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
}

.configurator-transcript::-webkit-scrollbar {
  width: 6px;
}

.configurator-transcript::-webkit-scrollbar-track {
  background: transparent;
}

.configurator-transcript::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.configurator-result {
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
"@

$stylesContent | Out-File -FilePath "app/configurateur/styles/configurator.css" -Encoding UTF8
Write-Host "  ✅ Styles CSS créés" -ForegroundColor Green

# Créer un README pour le configurateur
$readmeContent = @"
# Configurateur AlloKoli - Interface Frontend

## Vue d'ensemble

Interface utilisateur pour l'agent configurateur AlloKoli utilisant VapiBlocks et le composant Glob.

## Structure

- `app/configurateur/page.tsx` - Page principale
- `app/configurateur/components/` - Composants spécialisés
- `components/vapi/` - Composants Vapi réutilisables
- `hooks/use-vapi-configurator.ts` - Hook personnalisé
- `lib/configurator/` - Types et utilitaires

## Installation

1. Exécuter le script d'installation:
   ```bash
   pwsh -File setup-vapiblocks.ps1
   ```

2. Configurer les variables d'environnement dans `.env.local`

3. Installer le composant AbstractBall de VapiBlocks:
   - Copier depuis https://github.com/cameronking4/next-tailwind-vapi-starter
   - Placer dans `components/examples/abstract-ball.tsx`

## Utilisation

1. Naviguer vers `/configurateur`
2. Cliquer sur "Commencer" pour démarrer la configuration
3. Suivre les 7 étapes guidées
4. Exporter ou déployer la configuration générée

## Fonctionnalités

- ✅ Visualisation 3D interactive (Glob)
- ✅ Chat en temps réel avec l'assistant
- ✅ Progression visuelle des étapes
- ✅ Export de configuration JSON
- ✅ Déploiement automatique

## Agent Configurateur

- **ID**: 46b73124-6624-45ab-89c7-d27ecedcb251
- **Nom**: AlloKoliConfig Restaurant
- **Statut**: ✅ Opérationnel

## Support

Voir la documentation complète dans `/DOCS/plan-integration-frontend-configurateur.md`
"@

$readmeContent | Out-File -FilePath "app/configurateur/README.md" -Encoding UTF8
Write-Host "  ✅ README créé" -ForegroundColor Green

# Retourner au répertoire racine
Set-Location ..

Write-Host ""
Write-Host "🎉 Installation VapiBlocks terminée avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Blue
Write-Host "1. Configurer les clés API dans frontend/.env.local" -ForegroundColor Yellow
Write-Host "2. Installer le composant AbstractBall depuis VapiBlocks" -ForegroundColor Yellow
Write-Host "3. Tester l'interface: cd frontend && npm run dev" -ForegroundColor Yellow
Write-Host "4. Naviguer vers http://localhost:3000/configurateur" -ForegroundColor Yellow
Write-Host ""
Write-Host "📚 Documentation: DOCS/plan-integration-frontend-configurateur.md" -ForegroundColor Cyan
Write-Host "" 