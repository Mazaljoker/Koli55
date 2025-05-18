# Plan d'implémentation: Page de détail des assistants

Ce document détaille le plan d'implémentation pour créer la page de détail des assistants, qui permettra de visualiser toutes les informations d'un assistant, ses statistiques d'utilisation, et de le tester directement.

## Contexte

Après avoir complété le formulaire de création d'assistant, nous devons maintenant implémenter la page qui permettra de visualiser un assistant existant, de consulter ses statistiques et de le tester. Cette page devra être accessible via le chemin `/assistants/[id]`.

## Objectifs

1. Visualiser toutes les informations d'un assistant existant
2. Afficher les statistiques d'utilisation et les métriques d'appel
3. Permettre de tester l'assistant directement depuis l'interface
4. Fournir des liens vers l'édition et la suppression de l'assistant
5. Afficher les bases de connaissances associées

## Structure de la page à implémenter

La page sera organisée en sections distinctes:

### 1. En-tête avec informations générales
- Nom et description de l'assistant
- Date de création et dernière modification
- Boutons d'action: Éditer, Tester, Supprimer

### 2. Onglets pour naviguer entre les différentes vues
- Détails: Configuration complète de l'assistant
- Statistiques: Métriques d'utilisation et graphiques
- Appels récents: Historique des conversations
- Test: Interface de test vocal et textuel

### 3. Vue Détails
- Affichage des paramètres de modèle (fournisseur, modèle, température, etc.)
- Configuration vocale (fournisseur, voix, langue, etc.)
- Paramètres d'interaction (message initial, instructions système, etc.)
- Bases de connaissances associées
- Options avancées (numéro de transfert, enregistrement, etc.)

### 4. Vue Statistiques
- Nombre total d'appels
- Durée moyenne des appels
- Taux de résolution (si disponible)
- Graphiques d'utilisation dans le temps
- Heures de pointe d'utilisation

### 5. Vue Appels récents
- Tableau des appels récents avec date, durée et statut
- Possibilité d'écouter les enregistrements si disponibles
- Visualisation du transcript d'appel

### 6. Vue Test
- Interface de test vocal avec micro
- Possibilité d'envoyer des messages textuels
- Historique de la conversation de test
- Visualisation des réponses de l'assistant

## Étapes d'implémentation

1. **Structure de base de la page**
   - Créer `app/assistants/[id]/page.tsx`
   - Implémenter le chargement des données de l'assistant
   - Mettre en place l'interface à onglets

2. **Récupération des données**
   - Utiliser `assistantsService.getById` pour récupérer les détails de l'assistant
   - Implémenter un nouveau service pour récupérer les statistiques
   - Créer un service pour récupérer l'historique des appels

3. **Vues et composants**
   - Implémenter chaque onglet comme un composant séparé
   - Créer des composants de graphiques pour les statistiques
   - Développer l'interface de test vocal

4. **Intégration Vapi pour les tests**
   - Intégrer le SDK client Vapi pour les tests vocaux
   - Gérer l'authentification et l'initialisation du client
   - Implémenter les callbacks pour les événements d'appel

5. **Interface utilisateur et expérience**
   - Ajouter des tooltips et des explications contextuelles
   - Implémenter des retours visuels pendant les tests
   - Gérer le succès et les erreurs de façon élégante

## Considérations techniques

- Utiliser des composants React SERVER pour l'affichage statique et CLIENT uniquement pour les parties interactives
- Mettre en cache les données statiques pour optimiser les performances
- Utiliser les états locaux pour la session de test
- Gérer l'authentification pour assurer que seul le propriétaire peut voir les détails

## Extensions futures

- Possibilité de dupliquer un assistant existant
- Export des statistiques d'utilisation
- Tableau de bord avancé pour l'analyse des appels
- Intégration d'une fonctionnalité de feedback sur les appels

## Détails d'implémentation

```tsx
// Structure de base du fichier app/assistants/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AssistantData } from '../../../lib/api/assistantsService';
import { assistantsService } from '../../../lib/api/assistantsService';
import { callsService } from '../../../lib/api/callsService';
import { TabView, TabPanel } from '../../../components/ui/Tabs';
import AssistantDetails from '../../../components/dashboard/assistant-details/AssistantDetails';
import AssistantStats from '../../../components/dashboard/assistant-details/AssistantStats';
import AssistantCalls from '../../../components/dashboard/assistant-details/AssistantCalls';
import AssistantTester from '../../../components/dashboard/assistant-details/AssistantTester';

// Types pour les statistiques et les appels
interface AssistantStats {
  totalCalls: number;
  averageDuration: number;
  successRate: number;
  // autres métriques...
}

interface CallRecord {
  id: string;
  startTime: string;
  duration: number;
  status: string;
  recordingUrl?: string;
  // autres propriétés...
}

export default function AssistantDetailPage({ params }: { params: { id: string } }) {
  const [assistant, setAssistant] = useState<AssistantData | null>(null);
  const [stats, setStats] = useState<AssistantStats | null>(null);
  const [calls, setCalls] = useState<CallRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Charger les données de l'assistant
    const fetchAssistantData = async () => {
      try {
        setLoading(true);
        const response = await assistantsService.getById(params.id);
        
        if (!response.success) {
          throw new Error(response.message || 'Failed to load assistant');
        }
        
        setAssistant(response.data);
        
        // Charger les statistiques et les appels
        await Promise.all([
          fetchAssistantStats(params.id),
          fetchAssistantCalls(params.id)
        ]);
        
      } catch (err: any) {
        console.error('Error loading assistant:', err);
        setError(err.message || 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssistantData();
  }, [params.id]);

  // Fonctions auxiliaires pour charger les données supplémentaires
  const fetchAssistantStats = async (assistantId: string) => {
    // Implémentation à compléter quand le service sera disponible
    // Utiliser des données fictives pour le moment
    setStats({
      totalCalls: 24,
      averageDuration: 143, // secondes
      successRate: 0.92, // 92%
    });
  };
  
  const fetchAssistantCalls = async (assistantId: string) => {
    // Implémentation à compléter quand le service sera disponible
    // Utiliser des données fictives pour le moment
    setCalls([
      {
        id: 'call-1',
        startTime: new Date().toISOString(),
        duration: 132,
        status: 'completed',
      },
      // Autres appels fictifs...
    ]);
  };

  const handleEditClick = () => {
    router.push(`/assistants/${params.id}/edit`);
  };
  
  const handleDeleteClick = async () => {
    // Implémenter la confirmation et la suppression
  };
  
  const handleTestClick = () => {
    // Basculer vers l'onglet de test
    setActiveTab(3);
  };

  // Rendu principal
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Le contenu de la page ici */}
    </div>
  );
}
```

## Ressources et références

- [Documentation de l'API Vapi](https://docs.vapi.ai/)
- [Exemples d'intégration du SDK client Vapi](https://docs.vapi.ai/web-sdk)
- [Composants de graphiques pour React](https://recharts.org/) 