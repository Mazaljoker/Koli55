'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Typography, Alert, Form } from 'antd';
import { assistantsService, CreateAssistantPayload } from '../../../../lib/api/assistantsService';
import AssistantWizard from '../../../components/assistants/AssistantWizard';
import { AssistantFormData } from '../../../components/assistants/AssistantFormTypes';

// Import des composants d'étape créés
import NameStep from './components/NameStep';
import ModelStep from './components/ModelStep';
import VoiceStep from './components/VoiceStep';
import ConfigStep from './components/ConfigStep';

// Import des styles
import './styles/wizard.css';
import './styles/page.css';

const { Title } = Typography;

export default function NewAssistantPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm<AssistantFormData>();

  const handleSubmit = async (formData: AssistantFormData) => {
    setError(null);
    setLoading(true);
    try {
      // Préparer les données pour l'API
      const apiPayload = {
        name: formData.name,
        model: {
          provider: formData.modelProvider,
          model: formData.modelName,
          systemPrompt: formData.systemPrompt,
          temperature: formData.modelTemperature,
          maxTokens: formData.modelMaxTokens,
        },
        voice: {
          provider: formData.voiceProvider,
          voiceId: formData.voiceId,
        },
        firstMessage: formData.firstMessage,
        instructions: formData.systemPrompt,
        // Ces propriétés seront gérées par le backend même si elles ne sont pas
        // dans le type CreateAssistantPayload
        metadata: {
          endCallMessage: formData.endCallMessage,
          endCallPhrases: formData.endCallPhrases
            ? formData.endCallPhrases.split(',').map(phrase => phrase.trim()) 
            : [],
          forwardingPhoneNumber: formData.forwardingPhoneNumber
        }
      } as CreateAssistantPayload;

      // Vérification préalable des données
      if (!apiPayload.name?.trim()) {
        throw new Error("Le nom de l'assistant est requis");
      }

      console.log('Submitting assistant data:', apiPayload);
      
      // Utiliser le service pour créer l'assistant
      const response = await assistantsService.create(apiPayload);

      console.log('Response from API:', response);
      
      if (!response.success) {
        console.error('API error creating assistant:', response);
        throw new Error(
          response.message || 
          (response.vapi_error ? `Vapi error: ${response.vapi_error}` : 'Failed to create assistant due to an API error.')
        );
      }

      if (response.data) {
        console.log('Assistant created successfully:', response.data);
        router.push(`/assistants/${response.data.id}`);
      } else {
        throw new Error('No assistant data returned from API');
      }

    } catch (err: unknown) {
      console.error('Client-side error creating assistant:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError(`Error: ${errorMessage}`);
    }
    setLoading(false);
  };

  // Définition des étapes du formulaire avec nos nouveaux composants
  const wizardSteps = [
    {
      key: 'basic',
      title: 'Informations de base',
      description: 'Identifiez votre assistant',
      content: <NameStep form={form} />,
      validationSchema: {
        required: ['name']
      }
    },
    {
      key: 'model',
      title: 'Modèle IA',
      description: 'Choisissez le modèle d\'IA',
      content: <ModelStep form={form} />,
      validationSchema: {
        required: ['modelProvider', 'modelName', 'systemPrompt']
      }
    },
    {
      key: 'voice',
      title: 'Voix',
      description: 'Personnalisez la voix',
      content: <VoiceStep form={form} />,
      validationSchema: {
        required: ['voiceProvider', 'voiceId']
      }
    },
    {
      key: 'advanced',
      title: 'Configuration',
      description: 'Paramètres avancés',
      content: <ConfigStep form={form} />,
      validationSchema: {
        required: ['firstMessage']
      }
    }
  ];

  return (
    <div className="assistant-creation-page">
      <div className="header">
        <Title level={2}>Créer un nouvel assistant</Title>
      </div>
      
      {error && (
        <Alert
          message="Erreur"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: 24 }}
        />
      )}
      
      <AssistantWizard
        steps={wizardSteps}
        onSubmit={handleSubmit}
        loading={loading}
        finishButtonText="Créer l'assistant"
        initialValues={{
          modelProvider: 'openai',
          modelName: 'gpt-4o',
          modelTemperature: 0.7,
          modelMaxTokens: 1024,
          voiceProvider: '11labs',
          voiceId: 'jennifer',
          firstMessage: "Bonjour, je suis votre assistant. Comment puis-je vous aider aujourd'hui ?"
        }}
        form={form}
      />
    </div>
  );
} 