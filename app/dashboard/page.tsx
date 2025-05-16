'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import supabase from '../../lib/supabaseClient';
import DashboardOverview from '../../components/dashboard/DashboardOverview';
import AssistantsList from '../../components/dashboard/AssistantsList';
import { Button } from '@tremor/react';

interface Assistant {
  id: string;
  name: string;
  model: string;
  language: string;
  created_at: string;
}

export default function DashboardPage() {
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Placeholder counts for DashboardOverview
  const [conversationsCount, setConversationsCount] = useState(0);
  const [apiCallsCount, setApiCallsCount] = useState(0);

  useEffect(() => {
    fetchAssistants();
    // In a real app, you would also fetch conversation and API call counts
    // For now, we use placeholder values.
    // fetchDashboardStats(); 
  }, []);

  async function fetchAssistants() {
    setLoading(true);
    setError(null); // Reset error on new fetch
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('assistants', {
        body: { action: 'listMine' }
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }
      // Ensure data is an array, even if it's null/undefined from the function
      setAssistants(Array.isArray(data) ? data : []); 
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
      const { error: supabaseError } = await supabase.functions.invoke('assistants', {
        body: { action: 'delete', id: assistantId }
      });

      if (supabaseError) {
        throw new Error(supabaseError.message);
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