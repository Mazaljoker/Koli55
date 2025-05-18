'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '../../../../lib/supabaseClient';
import AssistantEditForm from '../../../../components/dashboard/AssistantEditForm';
import { Button, Card, Title, Text } from '@tremor/react';

// Interface pour les données de l'assistant, en s'assurant que les noms de champs
// correspondent à ce que l'API/DB utilise (ex: snake_case pour first_message, system_prompt)
interface AssistantData {
  id: string;
  name: string;
  model: string;
  language: string;
  voice?: string;
  first_message?: string; 
  system_prompt?: string;
  created_at: string;
  updated_at?: string;
  // Ajoutez d'autres champs si nécessaire
}

// Pour le formulaire, nous pourrions avoir besoin d'une interface légèrement différente
// ou s'assurer que AssistantEditForm gère bien la correspondance.
// Pour l'instant, nous utilisons AssistantData pour initialData.

export default function EditAssistantPage() {
  const router = useRouter();
  const params = useParams();
  const assistantId = params.id as string;

  const [initialData, setInitialData] = useState<Partial<AssistantData>>({});
  const [loading, setLoading] = useState(true); // Chargement initial des données
  const [submitting, setSubmitting] = useState(false); // Soumission du formulaire
  const [error, setError] = useState<string | null>(null);

  const fetchAssistantData = useCallback(async () => {
    if (!assistantId) return;
    setLoading(true);
    setError(null);
    try {
      // L'appel à la fonction Deno assistants pour GET /assistants/:id
      // se fait via invoke avec le chemin dans le nom de la fonction
      const { data, error: supabaseError } = await supabase.functions.invoke(
        `assistants/${assistantId}`,
        { method: 'GET' }
      );

      if (supabaseError) {
        // Gérer les erreurs de l'appel de fonction, par exemple si la fonction elle-même crashe
        if (typeof supabaseError.message === 'string' && supabaseError.message.includes('Function not found')) {
            setError(`La ressource assistants/${assistantId} n\'a pas été trouvée. Vérifiez le nom de la fonction et le déploiement.`);
        } else {
            throw supabaseError;
        }
      }

      // La fonction Deno GET /assistants/:id retourne { success: boolean, data: AssistantData | null, message?: string }
      // Nous devons vérifier la structure de la réponse `data` renvoyée par `invoke`
      if (data && data.success) {
        setInitialData(data.data); // data.data contient l'assistant
      } else if (data && !data.success) {
        throw new Error(data.message || 'Assistant non trouvé ou erreur de récupération.');
      } else if (!data && !supabaseError) { // Cas où invoke réussit mais data est null/undefined
        throw new Error('Aucune donnée retournée pour l\'assistant.');
      }

    } catch (err: any) {
      console.error('Erreur chargement assistant:', err);
      setError(err.message || 'Impossible de charger les données de l\'assistant.');
    } finally {
      setLoading(false);
    }
  }, [assistantId]);

  useEffect(() => {
    fetchAssistantData();
  }, [fetchAssistantData]);

  const handleFormSubmit = async (formData: Omit<AssistantData, 'id' | 'created_at' | 'updated_at'>) => {
    setSubmitting(true);
    setError(null);
    try {
      const { error: supabaseError } = await supabase.functions.invoke(
        `assistants/${assistantId}`, 
        {
          method: 'PATCH',
          body: formData // Envoyer formData directement, la fonction Deno s'en chargera
        }
      );

      if (supabaseError) throw supabaseError;
      
      // La fonction PATCH devrait également retourner un { success, data, message }
      // Pour l'instant, nous redirigeons si pas d'erreur.
      router.push(`/assistants/${assistantId}`);
    } catch (err: any) {
      console.error('Erreur mise à jour assistant:', err);
      setError(err.message || 'Impossible de mettre à jour l\'assistant.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <Text>Chargement du formulaire d'édition...</Text>
      </div>
    );
  }

  if (error && !initialData.id) { // Erreur critique si on n'a pas pu charger les données initiales
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto bg-red-50">
          <Title className="text-red-700">Erreur de chargement</Title>
          <Text className="text-red-600">{error}</Text>
          <div className="mt-6 flex justify-between">
            <Button onClick={fetchAssistantData} variant="light" disabled={loading}>
              Réessayer
            </Button>
            <Link href={`/assistants/${assistantId}`} passHref>
              <Button variant="secondary">Annuler</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/assistants/${assistantId}`} className="text-blue-600 hover:text-blue-800">
          &larr; Retour aux détails de l'assistant
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">Modifier: {initialData.name || 'Assistant'}</h1>
      </div>
      
      <AssistantEditForm 
        assistantId={assistantId}
        initialData={initialData} 
        onSubmit={handleFormSubmit} 
        loading={submitting} 
        error={error} // Erreur de soumission, l'erreur de chargement est gérée au-dessus
      />
    </div>
  );
} 