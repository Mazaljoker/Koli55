# Configurateur AlloKoli - Interface Frontend

## Vue d'ensemble

Interface utilisateur pour l'agent configurateur AlloKoli utilisant VapiBlocks et le composant Glob.

## Structure

- pp/configurateur/page.tsx - Page principale
- pp/configurateur/components/ - Composants spécialisés
- components/vapi/ - Composants Vapi réutilisables
- hooks/use-vapi-configurator.ts - Hook personnalisé
- lib/configurator/ - Types et utilitaires

## Installation

1. Exécuter le script d'installation:
   `ash
   pwsh -File setup-vapiblocks.ps1
   `

2. Configurer les variables d'environnement dans .env.local

3. Installer le composant AbstractBall de VapiBlocks:
   - Copier depuis https://github.com/cameronking4/next-tailwind-vapi-starter
   - Placer dans components/examples/abstract-ball.tsx

## Utilisation

1. Naviguer vers /configurateur
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

Voir la documentation complète dans /DOCS/plan-integration-frontend-configurateur.md
