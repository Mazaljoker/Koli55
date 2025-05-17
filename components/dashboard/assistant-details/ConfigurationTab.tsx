'use client';

import { Card, Title, Text, Grid, Col } from '@tremor/react';
import { AssistantData } from '../../../lib/api/assistantsService';

interface ConfigurationTabProps {
  assistant: AssistantData;
}

export default function ConfigurationTab({ assistant }: ConfigurationTabProps) {
  // Extraire les détails du modèle si c'est un objet
  const modelDetails = typeof assistant.model === 'string'
    ? { provider: 'N/A', model: assistant.model }
    : assistant.model || { provider: 'N/A', model: 'N/A' };

  // Extraire les détails de la voix si c'est un objet
  const voiceDetails = typeof assistant.voice === 'string'
    ? { provider: 'N/A', voiceId: assistant.voice }
    : assistant.voice || { provider: 'N/A', voiceId: 'N/A' };

  const formatJsonString = (jsonString: string | undefined) => {
    if (!jsonString) return 'N/A';
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      return jsonString; // Si ce n'est pas un JSON valide, renvoyer la chaîne d'origine
    }
  };

  return (
    <div className="space-y-6">
      {/* Informations Générales */}
      <Card>
        <Title className="mb-4">Informations Générales</Title>
        <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
          <Col>
            <Text className="font-medium">Nom</Text>
            <Text>{assistant.name}</Text>
          </Col>
          <Col>
            <Text className="font-medium">Langue</Text>
            <Text>{assistant.language || 'N/A'}</Text>
          </Col>
          <Col>
            <Text className="font-medium">Date de création</Text>
            <Text>{new Date(assistant.created_at).toLocaleDateString()}</Text>
          </Col>
          <Col>
            <Text className="font-medium">Dernière mise à jour</Text>
            <Text>{assistant.updated_at ? new Date(assistant.updated_at).toLocaleDateString() : 'N/A'}</Text>
          </Col>
          <Col>
            <Text className="font-medium">ID Assistant</Text>
            <Text className="break-all">{assistant.id}</Text>
          </Col>
          <Col>
            <Text className="font-medium">ID Vapi</Text>
            <Text className="break-all">{assistant.vapi_assistant_id || 'N/A'}</Text>
          </Col>
        </Grid>

        {assistant.firstMessage && (
          <div className="mt-4">
            <Text className="font-medium">Premier Message</Text>
            <div className="mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
              {assistant.firstMessage}
            </div>
          </div>
        )}
      </Card>

      {/* Modèle IA */}
      <Card>
        <Title className="mb-4">Modèle IA</Title>
        <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
          <Col>
            <Text className="font-medium">Provider</Text>
            <Text>{modelDetails.provider}</Text>
          </Col>
          <Col>
            <Text className="font-medium">Modèle</Text>
            <Text>{modelDetails.model}</Text>
          </Col>
          {modelDetails.temperature !== undefined && (
            <Col>
              <Text className="font-medium">Température</Text>
              <Text>{modelDetails.temperature}</Text>
            </Col>
          )}
          {modelDetails.topP !== undefined && (
            <Col>
              <Text className="font-medium">Top P</Text>
              <Text>{modelDetails.topP}</Text>
            </Col>
          )}
          {modelDetails.maxTokens !== undefined && (
            <Col>
              <Text className="font-medium">Max Tokens</Text>
              <Text>{modelDetails.maxTokens}</Text>
            </Col>
          )}
        </Grid>

        {assistant.instructions && (
          <div className="mt-4">
            <Text className="font-medium">Prompt Système (Instructions)</Text>
            <div className="mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
              {assistant.instructions}
            </div>
          </div>
        )}

        {modelDetails.systemPrompt && modelDetails.systemPrompt !== assistant.instructions && (
          <div className="mt-4">
            <Text className="font-medium">System Prompt</Text>
            <div className="mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
              {modelDetails.systemPrompt}
            </div>
          </div>
        )}
      </Card>

      {/* Voix */}
      <Card>
        <Title className="mb-4">Configuration de la Voix</Title>
        <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
          <Col>
            <Text className="font-medium">Provider de Voix</Text>
            <Text>{voiceDetails.provider}</Text>
          </Col>
          <Col>
            <Text className="font-medium">ID de la Voix</Text>
            <Text>{voiceDetails.voiceId}</Text>
          </Col>
          <Col>
            <Text className="font-medium">Détails Vapi de la Voix</Text>
            <div className="mt-2 text-xs font-mono overflow-x-auto">
              <pre>{formatJsonString(assistant.vapi_voice_details)}</pre>
            </div>
          </Col>
        </Grid>
      </Card>

      {/* Comportement d'Appel */}
      <Card>
        <Title className="mb-4">Comportement d'Appel</Title>
        <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
          <Col>
            <Text className="font-medium">Numéro de transfert</Text>
            <Text>{assistant.forwarding_phone_number || 'N/A'}</Text>
          </Col>
          <Col>
            <Text className="font-medium">Timeout de Silence (s)</Text>
            <Text>{assistant.silence_timeout_seconds || 'N/A'}</Text>
          </Col>
          <Col>
            <Text className="font-medium">Durée Maximum (s)</Text>
            <Text>{assistant.max_duration_seconds || 'N/A'}</Text>
          </Col>
          <Col>
            <Text className="font-medium">Terminer l'appel après silence</Text>
            <Text>{assistant.end_call_after_silence ? 'Oui' : 'Non'}</Text>
          </Col>
          <Col>
            <Text className="font-medium">Réflexion de Voix</Text>
            <Text>{assistant.voice_reflection ? 'Activée' : 'Désactivée'}</Text>
          </Col>
        </Grid>
      </Card>

      {/* Enregistrement */}
      <Card>
        <Title className="mb-4">Paramètres d'Enregistrement</Title>
        <Grid numItemsMd={2} numItemsLg={3} className="gap-6">
          <Col>
            <Text className="font-medium">Créer Enregistrement</Text>
            <Text>{assistant.recording_settings?.createRecording ? 'Oui' : 'Non'}</Text>
          </Col>
          <Col>
            <Text className="font-medium">Sauvegarder Enregistrement</Text>
            <Text>{assistant.recording_settings?.saveRecording ? 'Oui' : 'Non'}</Text>
          </Col>
        </Grid>
      </Card>

      {/* Outils (tools_config) */}
      <Card>
        <Title className="mb-4">Outils</Title>
        
        {assistant.tools_config?.knowledgeBases && assistant.tools_config.knowledgeBases.length > 0 && (
          <div className="mb-4">
            <Text className="font-medium">Bases de Connaissances</Text>
            <ul className="mt-2 pl-5 list-disc">
              {assistant.tools_config.knowledgeBases.map((kb, index) => (
                <li key={index} className="text-blue-600 hover:underline cursor-pointer">
                  {kb}
                </li>
              ))}
            </ul>
          </div>
        )}

        {assistant.tools_config?.functions && assistant.tools_config.functions.length > 0 && (
          <div className="mb-4">
            <Text className="font-medium">Fonctions</Text>
            <ul className="mt-2 pl-5 list-disc">
              {assistant.tools_config.functions.map((func, index) => (
                <li key={index}>{func}</li>
              ))}
            </ul>
          </div>
        )}

        {assistant.tools_config?.workflows && assistant.tools_config.workflows.length > 0 && (
          <div>
            <Text className="font-medium">Workflows</Text>
            <ul className="mt-2 pl-5 list-disc">
              {assistant.tools_config.workflows.map((workflow, index) => (
                <li key={index}>{workflow}</li>
              ))}
            </ul>
          </div>
        )}

        {(!assistant.tools_config?.knowledgeBases?.length && 
          !assistant.tools_config?.functions?.length && 
          !assistant.tools_config?.workflows?.length) && (
          <Text>Aucun outil configuré pour cet assistant.</Text>
        )}
      </Card>

      {/* Métadonnées */}
      {assistant.metadata && Object.keys(assistant.metadata).length > 0 && (
        <Card>
          <Title className="mb-4">Métadonnées</Title>
          <div className="bg-gray-50 p-3 rounded-md">
            <pre className="text-xs overflow-x-auto font-mono">
              {JSON.stringify(assistant.metadata, null, 2)}
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
} 