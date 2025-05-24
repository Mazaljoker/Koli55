'use client';

import { useState } from 'react';
import { Button, Card, Select, Typography, Space, Divider, Alert, Spin } from 'antd';
import { PlayCircleOutlined, RobotOutlined, SettingOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

interface ConfiguratorResponse {
  success: boolean;
  data?: {
    prompts?: string[];
    descriptions?: Record<string, string>;
    prompt?: string;
    businessType?: string;
    assistantId?: string;
    vapiId?: string;
    message?: string;
  };
  error?: string;
}

export default function VapiConfiguratorPage() {
  const [selectedBusinessType, setSelectedBusinessType] = useState<string>('restaurant');
  const [loading, setLoading] = useState(false);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [descriptions, setDescriptions] = useState<Record<string, string>>({});
  const [currentPrompt, setCurrentPrompt] = useState<string>('');
  const [result, setResult] = useState<ConfiguratorResponse | null>(null);

  // Charger la liste des prompts au démarrage
  const loadPrompts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vapi-configurator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list-prompts' })
      });
      
      const data: ConfiguratorResponse = await response.json();
      if (data.success && data.data) {
        setPrompts(data.data.prompts || []);
        setDescriptions(data.data.descriptions || {});
      }
    } catch (error) {
      console.error('Erreur chargement prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger un prompt spécifique
  const loadPrompt = async (businessType: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/vapi-configurator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-prompt', businessType })
      });
      
      const data: ConfiguratorResponse = await response.json();
      if (data.success && data.data) {
        setCurrentPrompt(data.data.prompt || '');
      }
    } catch (error) {
      console.error('Erreur chargement prompt:', error);
    } finally {
      setLoading(false);
    }
  };

  // Créer un agent configurateur
  const createConfigurator = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/vapi-configurator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', businessType: selectedBusinessType })
      });
      
      const data: ConfiguratorResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Erreur création agent:', error);
      setResult({ success: false, error: 'Erreur de connexion' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Title level={1} className="text-indigo-900">
            <RobotOutlined className="mr-3" />
            Agent Vapi Configurateur
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Testez l&apos;assistant conversationnel d&apos;onboarding en 5 minutes
          </Paragraph>
        </div>

        {/* Configuration */}
        <Card className="mb-6 shadow-lg">
          <Title level={3}>
            <SettingOutlined className="mr-2" />
            Configuration
          </Title>
          
          <Space direction="vertical" size="large" className="w-full">
            <div>
              <Text strong>Type d&apos;activité :</Text>
              <Select
                value={selectedBusinessType}
                onChange={(value) => {
                  setSelectedBusinessType(value);
                  loadPrompt(value);
                }}
                className="w-full mt-2"
                size="large"
              >
                <Option value="general">🏢 Généraliste</Option>
                <Option value="restaurant">🍽️ Restaurant</Option>
                <Option value="salon">💄 Salon de beauté</Option>
                <Option value="artisan">🔧 Artisan</Option>
                <Option value="liberal">👔 Profession libérale</Option>
                <Option value="boutique">🛍️ Boutique</Option>
                <Option value="pme">🏭 PME</Option>
              </Select>
            </div>

            <div className="flex gap-4">
              <Button 
                type="primary" 
                size="large"
                onClick={loadPrompts}
                loading={loading}
              >
                Charger les prompts
              </Button>
              
              <Button 
                size="large"
                onClick={() => loadPrompt(selectedBusinessType)}
                loading={loading}
              >
                Voir le prompt
              </Button>
              
              <Button 
                type="primary" 
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={createConfigurator}
                loading={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                Créer l&apos;agent
              </Button>
            </div>
          </Space>
        </Card>

        {/* Prompts disponibles */}
        {prompts.length > 0 && (
          <Card className="mb-6 shadow-lg">
            <Title level={4}>📋 Prompts disponibles</Title>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prompts.map((prompt) => (
                <div key={prompt} className="p-4 bg-gray-50 rounded-lg">
                  <Text strong className="capitalize">{prompt}</Text>
                  <br />
                  <Text type="secondary" className="text-sm">
                    {descriptions[prompt] || 'Description non disponible'}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Prompt actuel */}
        {currentPrompt && (
          <Card className="mb-6 shadow-lg">
            <Title level={4}>🎯 Prompt pour {selectedBusinessType}</Title>
            <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
              <Text className="whitespace-pre-wrap font-mono text-sm">
                {currentPrompt}
              </Text>
            </div>
            <div className="mt-4">
              <Text type="secondary">
                Longueur : {currentPrompt.length} caractères
              </Text>
            </div>
          </Card>
        )}

        {/* Résultat */}
        {result && (
          <Card className="mb-6 shadow-lg">
            <Title level={4}>📊 Résultat</Title>
            {result.success ? (
              <Alert
                message="Succès !"
                description={
                  <div>
                    <p>{result.data?.message}</p>
                    {result.data?.assistantId && (
                      <p><strong>ID Assistant :</strong> {result.data.assistantId}</p>
                    )}
                    {result.data?.vapiId && (
                      <p><strong>ID Vapi :</strong> {result.data.vapiId}</p>
                    )}
                  </div>
                }
                type="success"
                showIcon
              />
            ) : (
              <Alert
                message="Erreur"
                description={result.error || 'Une erreur est survenue'}
                type="error"
                showIcon
              />
            )}
          </Card>
        )}

        {/* Instructions */}
        <Card className="shadow-lg">
          <Title level={4}>📚 Instructions</Title>
          <div className="space-y-4">
            <div>
              <Text strong>1. Sélectionnez un type d&apos;activité</Text>
              <br />
              <Text type="secondary">
                Choisissez le secteur d&apos;activité pour adapter le prompt de l&apos;agent configurateur.
              </Text>
            </div>
            
            <div>
              <Text strong>2. Visualisez le prompt</Text>
              <br />
              <Text type="secondary">
                Consultez le prompt spécialisé qui sera utilisé par l&apos;agent pour ce type d&apos;activité.
              </Text>
            </div>
            
            <div>
              <Text strong>3. Créez l&apos;agent</Text>
              <br />
              <Text type="secondary">
                Déployez l&apos;agent configurateur sur Vapi avec le prompt adapté.
              </Text>
            </div>
            
            <Divider />
            
            <Alert
              message="Prochaines étapes"
              description="Une fois l&apos;agent créé, vous pourrez l&apos;utiliser pour guider vos utilisateurs dans la création de leur assistant vocal personnalisé en moins de 5 minutes."
              type="info"
              showIcon
            />
          </div>
        </Card>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg">
              <Spin size="large" />
              <p className="mt-4 text-center">Traitement en cours...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 