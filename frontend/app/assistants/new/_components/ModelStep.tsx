'use client';

import React, { useState, useEffect } from 'react';
import { Form, Select, Typography, Input, Tooltip, Card } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { 
  AssistantStepProps, 
  AI_PROVIDERS, 
  AI_MODELS,
  SYSTEM_PROMPT_TEMPLATES
} from '../../../../components/assistants/AssistantFormTypes';

const { Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const ModelStep: React.FC<AssistantStepProps> = ({ form }) => {
  const [selectedProvider, setSelectedProvider] = useState<string>(form.getFieldValue('modelProvider') || 'openai');
  const [availableModels, setAvailableModels] = useState(AI_MODELS[selectedProvider] || []);

  useEffect(() => {
    // Mettre à jour les modèles disponibles quand le provider change
    const models = AI_MODELS[selectedProvider] || [];
    setAvailableModels(models);
    
    // Si le modèle actuel n'est pas disponible avec le nouveau provider,
    // sélectionner le premier modèle disponible
    const currentModel = form.getFieldValue('modelName');
    const modelExists = models.some(m => m.value === currentModel);
    
    if (!modelExists && models.length > 0) {
      form.setFieldsValue({ modelName: models[0].value });
    }
  }, [selectedProvider, form]);

  const handleProviderChange = (value: string) => {
    setSelectedProvider(value);
  };

  const applyTemplate = (templateKey: string) => {
    const template = SYSTEM_PROMPT_TEMPLATES[templateKey as keyof typeof SYSTEM_PROMPT_TEMPLATES];
    if (template) {
      form.setFieldsValue({ systemPrompt: template });
    }
  };

  return (
    <div className="wizard-form-section">
      {/* Section: Choix du fournisseur */}
      <Card 
        title="Fournisseur du modèle" 
        bordered={false} 
        className="mb-4"
        style={{ marginBottom: '24px' }}
      >
        <Paragraph style={{ marginBottom: '16px' }}>
          Choisissez le fournisseur du modèle d&apos;intelligence artificielle qui alimentera votre assistant.
        </Paragraph>
        
        <Form.Item 
          name="modelProvider" 
          rules={[{ required: true, message: "Le fournisseur est requis" }]}
        >
          <Select 
            size="large"
            onChange={handleProviderChange}
            style={{ width: '100%' }}
          >
            {AI_PROVIDERS.map(provider => (
              <Option key={provider.value} value={provider.value}>
                {provider.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Card>
      
      {/* Section: Choix du modèle spécifique */}
      <Card 
        title="Modèle" 
        bordered={false} 
        className="mb-4"
        style={{ marginBottom: '24px' }}
      >
        <Paragraph style={{ marginBottom: '16px' }}>
          Sélectionnez le modèle spécifique qui déterminera les capacités et la qualité des réponses.
        </Paragraph>
        
        <Form.Item 
          name="modelName" 
          rules={[{ required: true, message: "Le modèle est requis" }]}
        >
          <Select 
            size="large"
            style={{ width: '100%' }}
          >
            {availableModels.map(model => (
              <Option key={model.value} value={model.value}>
                <div style={{ padding: '4px 0' }}>
                  <div style={{ fontWeight: 500 }}>{model.label}</div>
                  {model.description && (
                    <div className="option-description">
                      {model.description}
                    </div>
                  )}
                </div>
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Card>
      
      {/* Section: Instructions */}
      <Card 
        title="Instructions système"
        bordered={false}
        className="mb-4"
        extra={
          <Tooltip title="Utilisez un modèle prédéfini">
            <Select 
              size="small"
              placeholder="Templates"
              style={{ width: 160 }}
              onChange={applyTemplate}
            >
              <Option value="assistant">Assistant général</Option>
              <Option value="customerService">Service client</Option>
              <Option value="sales">Commercial</Option>
            </Select>
          </Tooltip>
        }
      >
        <Paragraph style={{ marginBottom: '16px' }}>
          Ces instructions définissent la personnalité et les compétences de votre assistant.
          Soyez précis et détaillé pour obtenir les meilleurs résultats.
        </Paragraph>

        <Form.Item 
          name="systemPrompt" 
          rules={[{ required: true, message: "Les instructions système sont requises" }]}
          tooltip={{
            title: "Ces instructions définissent la personnalité et les compétences de l'assistant",
            icon: <InfoCircleOutlined />
          }}
        >
          <TextArea 
            rows={8}
            placeholder="Instructions détaillées pour guider le comportement de votre assistant"
          />
        </Form.Item>
      </Card>
    </div>
  );
};

export default ModelStep; 