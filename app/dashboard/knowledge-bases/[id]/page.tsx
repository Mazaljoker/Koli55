'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import KnowledgeBaseDetail from '@/components/dashboard/KnowledgeBaseDetail';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Title, Text, Card, Button } from '@tremor/react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

// Interface pour un fichier associé
interface KnowledgeBaseFile {
  id: string;
  name: string;
  type?: string;
  size?: number;
  created_at?: string;
}

// Interface pour les données d'une base de connaissances, incluant les fichiers
interface KnowledgeBaseData {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at?: string;
  file_count?: number;
  files?: KnowledgeBaseFile[]; // S'assurer que cela correspond à ce que l'API retourne
}

export default function KnowledgeBaseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const kbId = Array.isArray(params.id) ? params.id[0] : params.id;

  const fetchKnowledgeBaseDetails = useCallback(async () => {
    if (!kbId) {
      setError("ID de la base de connaissances manquant.");
      setLoading(false);
      return;
    }
    // Important: Remettre setLoading à true ici pour les re-fetch
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
         setKnowledgeBase(data as KnowledgeBaseData); 
         // Si l'API ne retourne pas directement `files`, il faudrait un autre appel ici pour les fichiers
         // ou ajuster l'API `GET knowledge-bases/:id` pour inclure les fichiers.
         // Pour l'instant, on suppose que `data` contient `files`.
      } else {
        console.warn('Format de données inattendu pour les détails de la KB:', data);
        setError('Base de connaissances non trouvée ou format de réponse incorrect.');
        setKnowledgeBase(null);
      }

    } catch (e: any) {
      console.error('Erreur lors de la récupération des détails de la base de connaissances:', e);
      setError(e.message || 'Une erreur est survenue.');
      setKnowledgeBase(null);
    } finally {
      setLoading(false);
    }
  }, [supabase, kbId]); // kbId est une dépendance

  useEffect(() => {
    if (kbId) { // S'assurer que kbId est défini avant de lancer le fetch
      fetchKnowledgeBaseDetails();
    }
  }, [kbId, fetchKnowledgeBaseDetails]); // Ajouter kbId ici pour que l'effet se relance si l'ID change directement

  // Le bouton de retour est maintenant géré dans KnowledgeBaseDetail, plus besoin ici.
  // const BackButton = () => (...);

  if (loading && !knowledgeBase) { // Afficher le chargement initial seulement si knowledgeBase n'est pas encore défini
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        {/* Optionnel: un back button simple ici si on veut avant que KnowledgeBaseDetail ne s'affiche */}
        <div className="mb-6">
            <Button 
                icon={ArrowLeftIcon} 
                variant="light" 
                onClick={() => router.push('/dashboard/knowledge-bases')}
            >
                Retour à la liste
            </Button>
        </div>
        <Card className="mt-6">
          <Title>Chargement des détails...</Title>
          <Text className="mt-2">Veuillez patienter.</Text>
        </Card>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <div className="mb-6">
            <Button 
                icon={ArrowLeftIcon} 
                variant="light" 
                onClick={() => router.push('/dashboard/knowledge-bases')}
            >
                Retour à la liste
            </Button>
        </div>
        <Card className="mt-6">
          <Title>Erreur</Title>
          <Text color="red" className="mt-2">{error}</Text>
          <Button onClick={fetchKnowledgeBaseDetails} className="mt-4">Réessayer</Button>
        </Card>
      </main>
    );
  }

  if (!knowledgeBase) { // Si knowledgeBase est null après le chargement et sans erreur (devrait être couvert par l'erreur normalement)
    return (
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <div className="mb-6">
            <Button 
                icon={ArrowLeftIcon} 
                variant="light" 
                onClick={() => router.push('/dashboard/knowledge-bases')}
            >
                Retour à la liste
            </Button>
        </div>
         <Card className="mt-6">
          <Title>Base de Connaissances Non Trouvée</Title>
          <Text className="mt-2">Impossible de charger les détails de cette base de connaissances.</Text>
        </Card>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <KnowledgeBaseDetail 
        knowledgeBase={knowledgeBase} 
        onFileChange={fetchKnowledgeBaseDetails} // Passer la fonction de fetch pour le rafraîchissement
      />
    </main>
  );
} 