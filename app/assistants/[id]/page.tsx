'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../../lib/supabaseClient';
import AssistantDetail from '../../../components/dashboard/AssistantDetail'; // Assurez-vous que le chemin est correct
import { Button, Card, Title, Text } from '@tremor/react';

// Définir une interface plus complète pour les détails de l'assistant, 
// similaire à ce que votre fonction Supabase retournerait pour un GET by ID.
interface Assistant {
  id: string;
  name: string;
  model: string; // ex: 'gpt-4o'
  language: string; // ex: 'en-US'
  voice?: string; // ex: 'elevenlabs-adam' (peut être optionnel si Vapi a un défaut)
  system_prompt?: string; // Instructions pour l'assistant
  first_message?: string; // Message initial
  // Ajoutez tous les champs pertinents que Vapi/votre backend fournit
  // Par exemple:
  // tools?: any[]; // Pour les fonctions externes
  // knowledge_base_id?: string;
  // server_url?: string;
  // recording_enabled?: boolean;
  // max_duration_seconds?: number;
  created_at: string;
  updated_at?: string;
  // ... autres champs de Vapi
}

export default function AssistantDetailPage() {
  const router = useRouter();
  const params = useParams();
  const assistantId = params.id as string;

  const [assistant, setAssistant] = useState<Assistant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (assistantId) {
      fetchAssistantDetails();
    }
  }, [assistantId]);

  async function fetchAssistantDetails() {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('assistants', {
        body: { action: 'getById', id: assistantId },
      });

      if (supabaseError) {
        console.error('Supabase function invoke error:', supabaseError);
        throw new Error(supabaseError.message || 'Failed to fetch assistant details.');
      }

      if (data) {
        setAssistant(data);
      } else {
        throw new Error('Assistant not found or no data returned.');
      }
    } catch (err: any) {
      console.error('Client-side error fetching assistant details:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <Text>Chargement des détails de l'assistant...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto bg-red-50">
          <Title className="text-red-700">Erreur</Title>
          <Text className="text-red-600">{error}</Text>
          <div className="mt-6">
            <Button onClick={() => router.push('/dashboard')} variant="secondary">
              Retour au Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Text>Aucun détail d'assistant trouvé.</Text>
         <div className="mt-6">
            <Button onClick={() => router.push('/dashboard')} variant="secondary">
              Retour au Dashboard
            </Button>
          </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
            &larr; Retour au Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-2">Détails de: {assistant.name}</h1>
        </div>
        <Link href={`/assistants/${assistantId}/edit`}>
           <Button variant="primary">Modifier l'assistant</Button>
        </Link>
      </div>
      <AssistantDetail assistant={assistant} />
    </div>
  );
} 