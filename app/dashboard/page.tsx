'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import supabase from '../../lib/supabaseClient';
import DashboardOverview from '../../components/dashboard/DashboardOverview';
import AssistantsList from '../../components/dashboard/AssistantsList';
import { Button } from '@tremor/react';
import { assistantsService, AssistantData } from '../../lib/api/assistantsService';

// Utiliser directement AssistantData du service pour éviter les incompatibilités de types
type Assistant = AssistantData;

export default function DashboardPage() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  // Métriques pour DashboardOverview (à compléter avec des données réelles)
  const [conversationsCount, setConversationsCount] = useState(0);
  const [apiCallsCount, setApiCallsCount] = useState(0);
  const [conversationsTrend, setConversationsTrend] = useState<'up' | 'down' | null>(null);
  const [apiCallsTrend, setApiCallsTrend] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    // Vérification de l'authentification au chargement de la page
    const checkAuthAndFetch = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Si l'utilisateur a un token d'authentification temporaire dans localStorage
      // (voir la page de login), considérer qu'il est authentifié, même si la session
      // n'est pas encore disponible
      const tempAuthToken = typeof window !== 'undefined' ? localStorage.getItem('temp_auth_token') : null;
      
      if (!session && !tempAuthToken) {
        console.log("Aucune session détectée dans la page dashboard, redirection vers login");
        router.push('/auth/login');
        return;
      }
      
      // Si nous avons un token temporaire, envoyons un en-tête pour le middleware
      if (tempAuthToken) {
        console.log("Token d'authentification temporaire détecté dans la page dashboard");
        // Le token temporaire ne sera utilisé qu'une fois
        localStorage.removeItem('temp_auth_token');
      }
      
      // La session est confirmée, continuer avec le chargement des données
      fetchAssistants();
      fetchDashboardMetrics();
      
      // Définir un timeout pour masquer le loader si la requête prend trop de temps
      const timeoutId = setTimeout(() => {
        if (loading) {
          console.log("Timeout atteint pour le chargement des assistants, arrêt du chargement");
          setLoading(false);
          setError("Le chargement des données a pris trop de temps. Vérifiez votre connexion ou réessayez plus tard.");
        }
      }, 10000); // 10 secondes de timeout
      
      return () => clearTimeout(timeoutId);
    };
    
    checkAuthAndFetch();
  }, [router]); // Ne pas inclure loading pour éviter une boucle infinie

  async function fetchAssistants() {
    setLoading(true);
    setError(null); // Reset error on new fetch
    try {
      // Utiliser le service Assistants pour récupérer la liste des assistants
      const response = await assistantsService.list({ action: 'listMine' });

      if (!response.success) {
        throw new Error(response.message || 'Failed to list assistants');
      }
      
      // S'assurer que response.data est un tableau, même s'il est null/undefined
      setAssistants(Array.isArray(response.data) ? response.data : []);
    } catch (err: any) {
      console.error('Error fetching assistants:', err);
      setError(err.message || 'Failed to load assistants');
      setAssistants([]); // Clear assistants on error
    } finally {
      setLoading(false);
    }
  }

  async function fetchDashboardMetrics() {
    try {
      // Cette fonction sera implémentée pour récupérer les métriques du dashboard
      // Pour l'instant, utilisons des données de test
      
      // Simulation de données pour les métriques
      setConversationsCount(15); // Exemple: 15 appels ces 30 derniers jours
      setApiCallsCount(120); // Exemple: 120 appels API ces 30 derniers jours
      
      // Tendances pour les indicateurs (à remplacer par des calculs réels)
      setConversationsTrend('up'); // Exemple: tendance à la hausse
      setApiCallsTrend('up'); // Exemple: tendance à la hausse
      
      // Plus tard, vous pourriez implémenter un appel à une API pour récupérer ces données
      // try {
      //   const response = await fetch('/api/dashboard/metrics');
      //   const data = await response.json();
      //   if (data.success) {
      //     setConversationsCount(data.conversationsCount);
      //     setApiCallsCount(data.apiCallsCount);
      //     setConversationsTrend(data.conversationsTrend);
      //     setApiCallsTrend(data.apiCallsTrend);
      //   }
      // } catch (apiError) {
      //   console.error('Error fetching metrics from API:', apiError);
      //   // En cas d'erreur, on utilise des valeurs par défaut (ci-dessus)
      // }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err);
      // Toujours afficher des données même en cas d'erreur
      setConversationsCount(0);
      setApiCallsCount(0);
      setConversationsTrend(null);
      setApiCallsTrend(null);
    }
  }

  const handleDeleteAssistant = async (assistantId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet assistant ? Cette action est irréversible.')) {
      return;
    }
    
    setDeletingId(assistantId);
    setError(null); // Reset error before new action
    try {
      // Utiliser le service Assistants pour supprimer un assistant
      const response = await assistantsService.delete(assistantId);

      if (!response.success) {
        throw new Error(response.message || `Failed to delete assistant with ID ${assistantId}`);
      }
      
      setAssistants(prevAssistants => prevAssistants.filter(a => a.id !== assistantId));
    } catch (err: any) {
      console.error('Error deleting assistant:', err);
      setError(err.message || 'Failed to delete assistant');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>
        <Link href="/assistants/new">
          <Button variant="primary">+ Créer un Assistant</Button>
        </Link>
      </div>

      <DashboardOverview 
        assistantsCount={assistants.length} 
        conversationsCount={conversationsCount} 
        apiCallsCount={apiCallsCount}
        conversationsTrend={conversationsTrend}
        apiCallsTrend={apiCallsTrend}
      />

      {error && !loading && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <p className="font-medium mb-1">Erreur:</p>
            <p>{error}</p>
          </div>
          <Button 
            variant="secondary" 
            className="mt-2 md:mt-0"
            onClick={() => {
              fetchAssistants();
              fetchDashboardMetrics();
            }}
            disabled={loading}
          >
            {loading ? 'Chargement...' : 'Réessayer'}
          </Button>
        </div>
      )}
      
      <AssistantsList 
        assistants={assistants} 
        loading={loading} 
        error={error} /* Pass error specific to list if needed, or rely on global */
        deletingId={deletingId} 
        onDelete={handleDeleteAssistant} 
      />
    </div>
  );
} 