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

  // Placeholder counts for DashboardOverview
  const [conversationsCount, setConversationsCount] = useState(0);
  const [apiCallsCount, setApiCallsCount] = useState(0);

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
    };
    
    checkAuthAndFetch();
  }, [router]);

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
          <Button variant="primary">Créer un assistant</Button>
        </Link>
      </div>

      <DashboardOverview 
        assistantsCount={assistants.length} 
        conversationsCount={conversationsCount} 
        apiCallsCount={apiCallsCount} 
      />

      {error && !loading && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          Erreur générale: {error}
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