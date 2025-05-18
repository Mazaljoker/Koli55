# Plan d'implémentation: Amélioration du formulaire de création d'assistant

Ce document détaille le plan d'implémentation pour compléter le formulaire de création d'assistant avec toutes les options disponibles via l'API Vapi.

## Contexte

Le formulaire actuel (`app/assistants/new/page.tsx`) est une version minimale qui ne contient pas toutes les options de configuration disponibles dans l'API Vapi. Notre objectif est de créer une expérience utilisateur complète permettant de configurer tous les aspects d'un assistant vocal.

## Objectifs

1. Permettre la configuration complète des assistants Vapi
2. Offrir une interface utilisateur intuitive et organisée
3. Implémenter une validation robuste des formulaires
4. Fournir des conseils contextuels pour aider l'utilisateur

## Structure du formulaire à implémenter

Le formulaire sera organisé en sections distinctes:

### 1. Informations de base
- Nom de l'assistant
- Description/Notes (pour référence interne)

### 2. Configuration du modèle LLM
- Sélection du fournisseur (OpenAI, Anthropic, etc.)
- Sélection du modèle spécifique (GPT-4o, Claude 3 Opus, etc.)
- Température (0-1)
- Top-P (0-1)
- Limite de tokens

### 3. Configuration vocale
- Sélection du fournisseur (ElevenLabs, OpenAI, etc.)
- Sélection de la voix spécifique
- Langue
- Options de personnalisation (vitesse, ton)

### 4. Interaction et comportement
- Message initial (première réponse de l'assistant)
- Instructions système (prompt système)
- Durée maximale d'appel
- Délai de silence avant fin d'appel
- Options de réflexion vocale

### 5. Intégration aux bases de connaissances
- Sélection des bases de connaissances à associer
- Poids/priorité pour chaque base

### 6. Options avancées
- Numéro de téléphone de transfert
- Métadonnées personnalisées
- Paramètres d'enregistrement

## Étapes d'implémentation

1. **Structure du formulaire**
   - Réorganiser le formulaire existant en sections avec des onglets ou accordéons
   - Ajouter un état pour chaque section du formulaire

2. **Champs et validation**
   - Implémenter tous les champs du formulaire
   - Ajouter la validation pour chaque champ
   - Intégrer des messages d'erreur contextuels

3. **Interface utilisateur améliorée**
   - Ajouter des tooltips pour expliquer chaque option
   - Implémenter des contrôles intuitifs (sliders pour la température, etc.)
   - Fournir des valeurs par défaut recommandées

4. **Intégration API**
   - Mettre à jour la fonction de soumission pour inclure tous les champs
   - Gérer correctement la transformation des données avant l'envoi
   - Améliorer la gestion des erreurs API

5. **Prévisualisations et tests**
   - Ajouter une section de résumé avant soumission
   - Intégrer un moyen de tester les paramètres vocaux
   - Prévisualiser les instructions système

## Considérations techniques

- Utiliser des bibliothèques de formulaires comme `react-hook-form` pour la gestion des états
- Implémenter une validation côté client avec `zod` ou similaire
- Sauvegarder l'état du formulaire localement pour éviter la perte de données
- Utiliser des requêtes API pour charger dynamiquement les options disponibles (ex: voix, modèles)

## Extensions futures

- Sauvegarde de modèles d'assistants pour réutilisation
- Duplication d'assistants existants
- Import/export de configurations
- Suggestions d'exemples de prompts système

## Détails d'implémentation

```tsx
// Structure de données pour le formulaire complet
interface CompleteAssistantFormData {
  // Informations de base
  name: string;
  description?: string;
  
  // Configuration du modèle
  modelConfig: {
    provider: string;
    model: string;
    temperature?: number;
    topP?: number;
    maxTokens?: number;
  };
  
  // Configuration vocale
  voiceConfig: {
    provider: string;
    voiceId: string;
    language: string;
    speed?: number;
    tone?: string;
  };
  
  // Interaction
  firstMessage: string;
  instructions: string;
  maxDurationSeconds?: number;
  silenceTimeoutSeconds?: number;
  voiceReflection?: boolean;
  
  // Intégration
  knowledgeBases?: string[];
  
  // Options avancées
  forwardingPhoneNumber?: string;
  metadata?: Record<string, any>;
  recordingSettings?: {
    createRecording: boolean;
    saveRecording: boolean;
  };
}
```

## Ressources et références

- [Documentation de l'API Vapi](https://docs.vapi.ai/)
- [Exemples de prompts système](https://docs.vapi.ai/system-prompts)
- [Options de voix disponibles](https://docs.vapi.ai/voices) 