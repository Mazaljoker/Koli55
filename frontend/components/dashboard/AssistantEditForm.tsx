'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, Alert, Space, Row, Col, Switch, InputNumber } from 'antd';
import { SaveOutlined, ReloadOutlined } from '@ant-design/icons';
import { validateCreateAssistant } from '@/lib/schemas';

const { TextArea } = Input;
const { Option } = Select;

interface AssistantData {
  id: string;
  name: string;
  model: string;
  language: string;
  voice?: string;
  first_message?: string;
  system_prompt?: string;
  instructions?: string;
  firstMessage?: string;
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
  created_at: string;
  updated_at?: string;
}

interface AssistantEditFormProps {
  assistantId?: string;
  initialData: Partial<AssistantData>;
  onSubmit: (formData: Omit<AssistantData, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

interface FormValues {
  name: string;
  model: string;
  language: string;
  voice: string;
  firstMessage: string;
  instructions: string;
  silenceTimeoutSeconds?: number;
  maxDurationSeconds?: number;
  endCallAfterSilence?: boolean;
  voiceReflection?: boolean;
}

// Options pour les modèles AI
const MODEL_OPTIONS = [
  { provider: 'openai', model: 'gpt-4', label: 'GPT-4 (OpenAI)' },
  { provider: 'openai', model: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (OpenAI)' },
  { provider: 'anthropic', model: 'claude-3-opus', label: 'Claude 3 Opus (Anthropic)' },
  { provider: 'anthropic', model: 'claude-3-sonnet', label: 'Claude 3 Sonnet (Anthropic)' },
];

// Options pour les voix
const VOICE_OPTIONS = [
  { provider: 'elevenlabs', voiceId: 'pNInz6obpgDQGcFmaJgB', label: 'Adam (ElevenLabs)' },
  { provider: 'elevenlabs', voiceId: 'ErXwobaYiN019PkySvjV', label: 'Antoni (ElevenLabs)' },
  { provider: 'azure', voiceId: 'fr-FR-DeniseNeural', label: 'Denise (Azure - Français)' },
  { provider: 'azure', voiceId: 'fr-FR-HenriNeural', label: 'Henri (Azure - Français)' },
];

// Options pour les langues
const LANGUAGE_OPTIONS = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'de', label: 'Deutsch' },
  { value: 'it', label: 'Italiano' },
];

export default function AssistantEditForm({ 
  initialData, 
  onSubmit, 
  loading = false, 
  error 
}: AssistantEditFormProps) {
  const [form] = Form.useForm();
  const [validationErrors, setValidationErrors] = useState<Array<{ field: string; message: string }>>([]);

  useEffect(() => {
    // Normaliser les données initiales pour le formulaire
    const normalizedData = {
      name: initialData.name || '',
      model: initialData.model || 'gpt-3.5-turbo',
      language: initialData.language || 'fr',
      voice: initialData.voice || 'pNInz6obpgDQGcFmaJgB',
      firstMessage: initialData.first_message || initialData.firstMessage || '',
      instructions: initialData.system_prompt || initialData.instructions || '',
      silenceTimeoutSeconds: initialData.silenceTimeoutSeconds || 30,
      maxDurationSeconds: initialData.maxDurationSeconds || 1800,
      endCallAfterSilence: initialData.endCallAfterSilence || false,
      voiceReflection: initialData.voiceReflection || false,
    };

    form.setFieldsValue(normalizedData);
  }, [initialData, form]);

  const handleSubmit = async (values: FormValues) => {
    setValidationErrors([]);

    // Transformer les données pour le format attendu par l'API
    const transformedData = {
      name: values.name,
      model: values.model,
      language: values.language,
      voice: values.voice,
      firstMessage: values.firstMessage,
      instructions: values.instructions,
      silenceTimeoutSeconds: values.silenceTimeoutSeconds,
      maxDurationSeconds: values.maxDurationSeconds,
      endCallAfterSilence: values.endCallAfterSilence,
      voiceReflection: values.voiceReflection,
    };

    // Validation avec Zod
    const validation = validateCreateAssistant(transformedData);
    
    if (!validation.success && validation.error?.details) {
      setValidationErrors(validation.error.details);
      return;
    }

    try {
      await onSubmit(transformedData);
    } catch (err) {
      console.error('Erreur lors de la soumission:', err);
    }
  };

  const handleReset = () => {
    form.resetFields();
    setValidationErrors([]);
  };

  return (
    <Card 
      title={`Modifier l&apos;assistant: ${initialData.name || 'Assistant'}`}
      extra={
        <Space>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            Réinitialiser
          </Button>
        </Space>
      }
    >
      {error && (
        <Alert
          message="Erreur"
          description={error}
          type="error"
          closable
          style={{ marginBottom: 16 }}
        />
      )}

      {validationErrors.length > 0 && (
        <Alert
          message="Erreurs de validation"
          description={
            <ul>
              {validationErrors.map((err, index) => (
                <li key={index}>
                  <strong>{err.field}:</strong> {err.message}
                </li>
              ))}
            </ul>
          }
          type="error"
          closable
          onClose={() => setValidationErrors([])}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        disabled={loading}
        size="large"
      >
        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Nom de l'assistant"
              name="name"
              rules={[
                { required: true, message: 'Le nom est obligatoire' },
                { min: 3, message: 'Le nom doit contenir au moins 3 caractères' },
                { max: 100, message: 'Le nom ne peut pas dépasser 100 caractères' }
              ]}
            >
              <Input placeholder="Ex: Assistant Commercial" />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Langue"
              name="language"
              rules={[{ required: true, message: 'La langue est obligatoire' }]}
            >
              <Select placeholder="Sélectionnez une langue">
                {LANGUAGE_OPTIONS.map(lang => (
                  <Option key={lang.value} value={lang.value}>
                    {lang.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Modèle IA"
              name="model"
              rules={[{ required: true, message: 'Le modèle est obligatoire' }]}
            >
              <Select placeholder="Sélectionnez un modèle">
                {MODEL_OPTIONS.map(model => (
                  <Option key={`${model.provider}-${model.model}`} value={model.model}>
                    {model.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Voix"
              name="voice"
              rules={[{ required: true, message: 'La voix est obligatoire' }]}
            >
              <Select placeholder="Sélectionnez une voix">
                {VOICE_OPTIONS.map(voice => (
                  <Option key={voice.voiceId} value={voice.voiceId}>
                    {voice.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Premier message"
          name="firstMessage"
          rules={[
            { required: true, message: 'Le premier message est obligatoire' },
            { min: 10, message: 'Le premier message doit contenir au moins 10 caractères' },
            { max: 500, message: 'Le premier message ne peut pas dépasser 500 caractères' }
          ]}
        >
          <TextArea
            rows={3}
            placeholder="Bonjour ! Je suis votre assistant vocal. Comment puis-je vous aider aujourd'hui ?"
            showCount
            maxLength={500}
          />
        </Form.Item>

        <Form.Item
          label="Instructions système"
          name="instructions"
          rules={[
            { required: true, message: 'Les instructions sont obligatoires' },
            { min: 20, message: 'Les instructions doivent contenir au moins 20 caractères' },
            { max: 2000, message: 'Les instructions ne peuvent pas dépasser 2000 caractères' }
          ]}
        >
          <TextArea
            rows={6}
            placeholder="Vous êtes un assistant vocal professionnel. Votre rôle est de..."
            showCount
            maxLength={2000}
          />
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              label="Timeout de silence (secondes)"
              name="silenceTimeoutSeconds"
              tooltip="Temps d'attente avant de considérer que l'utilisateur a fini de parler"
            >
              <InputNumber
                min={1}
                max={300}
                placeholder="30"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              label="Durée maximale d'appel (secondes)"
              name="maxDurationSeconds"
              tooltip="Durée maximale de l'appel en secondes"
            >
              <InputNumber
                min={60}
                max={3600}
                placeholder="1800"
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[16, 0]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="endCallAfterSilence"
              valuePropName="checked"
            >
              <Switch /> <span style={{ marginLeft: 8 }}>Terminer l'appel après un silence prolongé</span>
            </Form.Item>
          </Col>

          <Col xs={24} md={12}>
            <Form.Item
              name="voiceReflection"
              valuePropName="checked"
            >
              <Switch /> <span style={{ marginLeft: 8 }}>Activer la réflexion vocale</span>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ marginTop: 32 }}>
          <Space>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
            <Button onClick={handleReset} disabled={loading}>
              Annuler
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
} 