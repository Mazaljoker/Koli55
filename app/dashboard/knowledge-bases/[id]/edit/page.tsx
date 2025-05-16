'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import KnowledgeBaseEditForm from '@/components/dashboard/KnowledgeBaseEditForm';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Title, Text, Card, Button } from '@tremor/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Interface pour les données d'une base de connaissances
interface KnowledgeBaseData {
  id: string;
  name: string;
  description?: string;
  // Inclure d'autres champs si nécessaire
}

export default function EditKnowledgeBasePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [initialData, setInitialData] = useState<Partial<KnowledgeBaseData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const kbId = Array.isArray(params.id) ? params.id[0] : params.id;

  const fetchKnowledgeBaseData = useCallback(async () => {
    if (!kbId) {
      setError("ID de la base de connaissances manquant pour l'édition.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke(
        `knowledge-bases/${kbId}`,
        {
          method: 'GET',
        }
      );

      if (supabaseError) {
        throw supabaseError;
      }
      
      if (data) {
        setInitialData(data as KnowledgeBaseData); // Assumer que data est l'objet KB complet
      } else {
        setError('Base de connaissances non trouvée ou format de réponse incorrect.');
        setInitialData({});
      }

    } catch (e: any) {
      console.error('Erreur lors de la récupération des données de la base de connaissances:', e);
      setError(e.message || 'Une erreur est survenue lors du chargement des données.');
    } finally {
      setLoading(false);
    }
  }, [supabase, kbId]);

  useEffect(() => {
    fetchKnowledgeBaseData();
  }, [fetchKnowledgeBaseData]);

  // Bouton de retour générique
  const BackButton = () => (
    <div className="mb-6">
      <Button 
        icon={ArrowLeftIcon} 
        variant="light" 
        onClick={() => router.push(kbId ? `/dashboard/knowledge-bases/${kbId}` : '/dashboard/knowledge-bases')}
      >
        {kbId ? 'Retour aux détails' : 'Retour à la liste'}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <main className="p-4 md:p-10 mx-auto max-w-4xl">
        <BackButton />
        <Card className="mt-6">
          <Title>Chargement des données pour l'édition...</Title>
          <Text className="mt-2">Veuillez patienter.</Text>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4 md:p-10 mx-auto max-w-4xl">
        <BackButton />
        <Card className="mt-6">
          <Title>Erreur</Title>
          <Text color="red" className="mt-2">{error}</Text>
          <Button onClick={fetchKnowledgeBaseData} className="mt-4">Réessayer</Button>
        </Card>
      </main>
    );
  }

  if (!initialData.id && !loading) { // Si après chargement, initialData est vide ou sans ID
    return (
      <main className="p-4 md:p-10 mx-auto max-w-4xl">
        <BackButton />
        <Card className="mt-6">
          <Title>Base de Connaissances Non Trouvée</Title>
          <Text className="mt-2">Impossible de charger les données pour l'édition.</Text>
        </Card>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-4xl">
      {kbId && <KnowledgeBaseEditForm knowledgeBaseId={kbId} initialData={initialData} />}
    </main>
  );
} 