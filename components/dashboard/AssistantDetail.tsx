'use client';

import { Card, Title, Text, Metric, Grid, Col } from '@tremor/react';

// Correspond à l'interface Assistant dans app/assistants/[id]/page.tsx
interface Assistant {
  id: string;
  name: string;
  model: string;
  language: string;
  voice?: string;
  system_prompt?: string;
  first_message?: string;
  created_at: string;
  updated_at?: string;
  // Ajoutez d'autres champs ici au fur et à mesure que vous les gérez
}

interface AssistantDetailProps {
  assistant: Assistant;
}

export default function AssistantDetail({ assistant }: AssistantDetailProps) {
  return (
    <Card>
      <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
        <Col>
          <Title>ID de l'Assistant</Title>
          <Text>{assistant.id}</Text>
        </Col>
        <Col>
          <Title>Modèle LLM</Title>
          <Text>{assistant.model}</Text>
        </Col>
        <Col>
          <Title>Langue</Title>
          <Text>{assistant.language}</Text>
        </Col>
        <Col>
          <Title>Voix</Title>
          <Text>{assistant.voice || 'Non définie'}</Text>
        </Col>
        <Col>
          <Title>Créé le</Title>
          <Text>{new Date(assistant.created_at).toLocaleDateString()}</Text>
        </Col>
        {assistant.updated_at && (
          <Col>
            <Title>Mis à jour le</Title>
            <Text>{new Date(assistant.updated_at).toLocaleDateString()}</Text>
          </Col>
        )}
      </Grid>

      {assistant.first_message && (
        <div className="mt-6">
          <Title>Message d'Accueil</Title>
          <Text className="mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
            {assistant.first_message}
          </Text>
        </div>
      )}

      {assistant.system_prompt && (
        <div className="mt-6">
          <Title>Prompt Système (Instructions)</Title>
          <Text className="mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
            {assistant.system_prompt}
          </Text>
        </div>
      )}

      {/* Ajoutez ici d'autres sections pour les détails supplémentaires */}
      {/* Par exemple: Tools, Knowledge Base, Stats spécifiques, etc. */}
      <div className="mt-8 border-t pt-6">
        <Title>Actions Avancées</Title>
        <Text className="italic text-gray-500 mt-2">
          Des actions comme "Tester l'assistant", "Voir les appels associés" ou "Dupliquer" seront bientôt disponibles ici.
        </Text>
      </div>
    </Card>
  );
} 