'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Title, Text } from '@tremor/react';

// Migration vers le SDK AlloKoli
import { useAlloKoliSDKWithAuth } from '../../../../lib/hooks/useAlloKoliSDK';
import { Assistant, AssistantUpdate } from '../../../../lib/api/allokoli-sdk';
import AssistantEditForm from '../../../../components/dashboard/AssistantEditForm';



export default function EditAssistantPage() {
  const router = useRouter();
  const params = useParams();
  const assistantId = params.id as string;
  const sdk = useAlloKoliSDKWithAuth();

  const [initialData, setInitialData] = useState<Partial<Assistant>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssistantData = useCallback(async () => {
    if (!assistantId) return;
    setLoading(true);
    setError(null);
    
    try {
      // Utiliser le SDK pour récupérer l'assistant
      const response = await sdk.getAssistant(assistantId);
      setInitialData(response.data);
      
    } catch (err: unknown) {
      console.error('Erreur chargement assistant:', err);
      setError(err instanceof Error ? err.message : 'Impossible de charger les données de l\'assistant.');
    } finally {
      setLoading(false);
    }
  }, [assistantId, sdk]);

  useEffect(() => {
    fetchAssistantData();
  }, [fetchAssistantData]);

  const handleFormSubmit = async (formData: AssistantUpdate) => {
    setSubmitting(true);
    setError(null);
    
    try {
      // Utiliser le SDK pour mettre à jour l'assistant
      await sdk.updateAssistant(assistantId, formData);
      
      // Rediriger vers la page de détails
      router.push(`/assistants/${assistantId}`);
      
    } catch (err: unknown) {
      console.error('Erreur mise à jour assistant:', err);
      setError(err instanceof Error ? err.message : 'Impossible de mettre à jour l\'assistant.');
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

  if (error && !initialData.id) {
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
                        <h1 className="text-3xl font-bold text-gray-800 mt-2">          Modifier: {initialData.name || 'Assistant'}        </h1>      </div>            <Card>        <Text className="text-center py-8">          Formulaire d&apos;édition en cours de migration vers le SDK AlloKoli.          <br />          Veuillez utiliser la page de détails de l&apos;assistant pour les modifications.        </Text>        <div className="mt-4 text-center">          <Link href={`/assistants/${assistantId}`}>            <Button variant="primary">              Retour aux détails            </Button>          </Link>        </div>      </Card>
    </div>
  );
} 