'use client';

import React, { useState } from 'react';
import VapiFormBuilder from './vapi-form-builder';
import { Card, Tabs, Alert, Typography } from 'antd';

const { Title } = Typography;
const { TabPane } = Tabs;

// Schéma JSON pour un assistant Vapi
const assistantSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Nom de l\'assistant'
    },
    model: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
          enum: ['openai', 'anthropic', 'google', 'cohere', 'azure'],
          description: 'Fournisseur du modèle'
        },
        model: {
          type: 'string',
          description: 'Nom du modèle (ex: gpt-4o, claude-3-opus-20240229)'
        },
        systemPrompt: {
          type: 'string',
          description: 'Instructions systèmes pour l\'assistant'
        },
        temperature: {
          type: 'number',
          description: 'Température de génération (0-1)'
        },
        maxTokens: {
          type: 'number',
          description: 'Nombre maximum de tokens à générer'
        }
      },
      required: ['provider', 'model']
    },
    voice: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
          enum: ['11labs', 'azure', 'deepgram', 'play.ht', 'openai'],
          description: 'Fournisseur de voix'
        },
        voiceId: {
          type: 'string',
          description: 'Identifiant de la voix'
        },
        speed: {
          type: 'number',
          description: 'Vitesse de la parole (0.5-2.0)'
        }
      },
      required: ['provider', 'voiceId']
    },
    firstMessage: {
      type: 'string',
      description: 'Premier message que l\'assistant dira lors d\'un appel'
    },
    firstMessageMode: {
      type: 'string',
      enum: [
        'assistant-speaks-first', 
        'assistant-speaks-first-with-model-generated-message', 
        'assistant-waits-for-user'
      ],
      description: 'Mode de premier message'
    },
    voicemailMessage: {
      type: 'string',
      description: 'Message laissé sur la messagerie vocale'
    },
    endCallMessage: {
      type: 'string',
      description: 'Message prononcé avant de raccrocher'
    },
    endCallFunctionEnabled: {
      type: 'boolean',
      description: 'Activer la fonction de fin d\'appel automatique'
    },
    silenceTimeoutSeconds: {
      type: 'number',
      description: 'Durée de silence avant de considérer l\'appel comme terminé (secondes)'
    },
    maxDurationSeconds: {
      type: 'number',
      description: 'Durée maximale d\'un appel (secondes)'
    },
    forwardingPhoneNumber: {
      type: 'string',
      description: 'Numéro de téléphone pour transférer l\'appel'
    },
    metadata: {
      type: 'object',
      properties: {},
      description: 'Métadonnées personnalisées'
    },
    recordingSettings: {
      type: 'object',
      properties: {
        createRecording: {
          type: 'boolean',
          description: 'Créer un enregistrement de l\'appel'
        },
        saveRecording: {
          type: 'boolean',
          description: 'Sauvegarder l\'enregistrement'
        }
      }
    },
    transcriber: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
          enum: ['deepgram', 'openai', 'azure'],
          description: 'Fournisseur pour la transcription'
        },
        language: {
          type: 'string',
          description: 'Langue de la transcription (ex: fr-FR)'
        },
        wordBoost: {
          type: 'array',
          items: {
            type: 'string'
          },
          description: 'Mots à favoriser dans la transcription'
        }
      },
      required: ['provider']
    }
  },
  required: ['name', 'model', 'voice']
};

interface VapiAssistantFormProps {
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  loading?: boolean;
}

const VapiAssistantForm: React.FC<VapiAssistantFormProps> = ({
  initialValues = {},
  onSubmit,
  loading = false
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  // Séparation du schéma en sections pour les onglets
  const basicSchema = {
    type: 'object',
    properties: {
      name: assistantSchema.properties.name,
      model: assistantSchema.properties.model,
      voice: assistantSchema.properties.voice
    },
    required: ['name', 'model', 'voice']
  };

  const messagesSchema = {
    type: 'object',
    properties: {
      firstMessage: assistantSchema.properties.firstMessage,
      firstMessageMode: assistantSchema.properties.firstMessageMode,
      voicemailMessage: assistantSchema.properties.voicemailMessage,
      endCallMessage: assistantSchema.properties.endCallMessage
    }
  };

  const callSettingsSchema = {
    type: 'object',
    properties: {
      endCallFunctionEnabled: assistantSchema.properties.endCallFunctionEnabled,
      silenceTimeoutSeconds: assistantSchema.properties.silenceTimeoutSeconds,
      maxDurationSeconds: assistantSchema.properties.maxDurationSeconds,
      forwardingPhoneNumber: assistantSchema.properties.forwardingPhoneNumber,
      recordingSettings: assistantSchema.properties.recordingSettings
    }
  };

  const advancedSchema = {
    type: 'object',
    properties: {
      transcriber: assistantSchema.properties.transcriber,
      metadata: assistantSchema.properties.metadata
    }
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  return (
    <div>
      <Title level={3}>Configuration de l&apos;Assistant Vapi</Title>
      
      <Alert 
        message="Création d'un assistant vocal Vapi" 
        description="Configurez les paramètres de votre assistant en utilisant les onglets ci-dessous. Les champs obligatoires sont marqués avec un astérisque (*)" 
        type="info" 
        showIcon 
        style={{ marginBottom: '20px' }}
      />
      
      <Card>
        <Tabs defaultActiveKey="basic" onChange={handleTabChange}>
          <TabPane tab="Informations de base" key="basic">
            <VapiFormBuilder 
              schema={basicSchema} 
              initialValues={initialValues} 
              onSubmit={onSubmit}
              loading={loading}
              submitButtonText={activeTab === 'basic' ? 'Enregistrer et continuer' : 'Enregistrer'}
            />
          </TabPane>
          
          <TabPane tab="Messages" key="messages">
            <VapiFormBuilder 
              schema={messagesSchema} 
              initialValues={initialValues} 
              onSubmit={onSubmit}
              loading={loading}
              submitButtonText={activeTab === 'messages' ? 'Enregistrer et continuer' : 'Enregistrer'}
            />
          </TabPane>
          
          <TabPane tab="Paramètres d'appel" key="callSettings">
            <VapiFormBuilder 
              schema={callSettingsSchema} 
              initialValues={initialValues} 
              onSubmit={onSubmit}
              loading={loading}
              submitButtonText={activeTab === 'callSettings' ? 'Enregistrer et continuer' : 'Enregistrer'}
            />
          </TabPane>
          
          <TabPane tab="Avancé" key="advanced">
            <VapiFormBuilder 
              schema={advancedSchema} 
              initialValues={initialValues} 
              onSubmit={onSubmit}
              loading={loading}
              submitButtonText="Enregistrer"
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default VapiAssistantForm; 