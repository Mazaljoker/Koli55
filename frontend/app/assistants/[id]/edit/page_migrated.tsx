'use client';

import { useEffect, useState, useCallback } from 'react';import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button, Card, Title, Text } from '@tremor/react';

// Migration vers le SDK AlloKoli
import { useAlloKoliSDKWithAuth } from '../../../../lib/hooks/useAlloKoliSDK';
import { Assistant } from '../../../../lib/api/allokoli-sdk';

export default function EditAssistantPage() {  const params = useParams();
  const assistantId = params.id as string;
  const sdk = useAlloKoliSDKWithAuth();

  const [initialData, setInitialData] = useState<Partial<Assistant>>({});
  const [loading, setLoading] = useState(true);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <Text>Chargement du formulaire d&apos;édition...</Text>
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
          &larr; Retour aux détails de l&apos;assistant
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 mt-2">
          Modifier: {initialData.name || 'Assistant'}
        </h1>
      </div>
      
      <Card>
        <Title>Formulaire d&apos;édition en cours de migration</Title>
        <Text className="mt-4">
          Le formulaire d&apos;édition est en cours de migration vers le SDK AlloKoli.
          Pour le moment, veuillez utiliser la page de détails de l&apos;assistant pour effectuer des modifications.
        </Text>
        <div className="mt-6 text-center">
          <Link href={`/assistants/${assistantId}`}>
            <Button variant="primary">
              Retour aux détails de l&apos;assistant
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
} 