'use client';

import React from 'react';
import { Typography, Space, Card, Row, Col, Tag, Button, Divider } from 'antd';
import { motion } from 'framer-motion';
import { 
  User, 
  Brain, 
  Volume2, 
  MessageSquare, 
  Edit3,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { AssistantFormData } from '../../../../components/assistants/AssistantFormTypes';

const { Title, Paragraph, Text } = Typography;

interface SummaryStepProps {
  formData: AssistantFormData;
  onEdit: (stepKey: string) => void;
  onConfirm: () => void;
  loading?: boolean;
}

const SummaryStep: React.FC<SummaryStepProps> = ({ 
  formData, 
  onEdit, 
  onConfirm, 
  loading = false 
}) => {
  const summaryCards = [
    {
      key: 'identity',
      title: 'Identité',
      icon: <User className="h-5 w-5" />,
             items: [         { label: 'Nom', value: formData.name },       ]
    },
    {
      key: 'model',
      title: 'Modèle IA',
      icon: <Brain className="h-5 w-5" />,
      items: [
        { label: 'Fournisseur', value: formData.modelProvider },
        { label: 'Modèle', value: formData.modelName },
        { label: 'Température', value: formData.modelTemperature || '0.7' },
        { label: 'Tokens max', value: formData.modelMaxTokens || '1024' },
      ]
    },
    {
      key: 'voice',
      title: 'Voix',
      icon: <Volume2 className="h-5 w-5" />,
      items: [
        { label: 'Fournisseur', value: formData.voiceProvider },
        { label: 'Voix', value: formData.voiceId },
      ]
    },
    {
      key: 'messages',
      title: 'Messages',
      icon: <MessageSquare className="h-5 w-5" />,
      items: [
        { label: 'Message d\'accueil', value: formData.firstMessage },
        { label: 'Instructions', value: formData.systemPrompt },
      ]
    }
  ];

  const getProviderDisplayName = (provider: string) => {
    const providers: Record<string, string> = {
      'openai': 'OpenAI',
      'anthropic': 'Anthropic',
      'groq': 'Groq',
      'eleven-labs': 'ElevenLabs',
      'azure': 'Azure',
      'playht': 'PlayHT',
      'deepgram': 'Deepgram'
    };
    return providers[provider] || provider;
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return 'Non défini';
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="text-center">
          <Title level={3}>Récapitulatif de votre assistant</Title>
          <Paragraph type="secondary" className="text-lg">
            Vérifiez les paramètres avant de créer votre assistant. 
            Vous pouvez modifier chaque section en cliquant sur le bouton d&apos;édition.
          </Paragraph>
        </div>

        <Row gutter={[16, 16]}>
          {summaryCards.map((card, index) => (
            <Col xs={24} lg={12} key={card.key}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  className="h-full"
                  title={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="text-purple-600">
                          {card.icon}
                        </div>
                        <span>{card.title}</span>
                      </div>
                      <Button
                        type="text"
                        size="small"
                        icon={<Edit3 className="h-4 w-4" />}
                        onClick={() => onEdit(card.key)}
                        className="text-gray-500 hover:text-purple-600"
                      >
                        Modifier
                      </Button>
                    </div>
                  }
                  bodyStyle={{ padding: '16px' }}
                >
                  <Space direction="vertical" size="small" className="w-full">
                    {card.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start">
                        <Text className="text-gray-600 text-sm font-medium">
                          {item.label} :
                        </Text>
                        <div className="text-right max-w-xs">
                          {item.label.includes('Fournisseur') ? (
                            <Tag color="blue">{getProviderDisplayName(item.value)}</Tag>
                          ) : (
                            <Text className="text-sm">
                              {truncateText(item.value)}
                            </Text>
                          )}
                        </div>
                      </div>
                    ))}
                  </Space>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {/* Section de validation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                </div>
              </div>
              
              <Title level={4} className="!mb-2 text-purple-800">
                Prêt à créer votre assistant ?
              </Title>
              
              <Paragraph className="!mb-4 text-purple-600">
                Votre assistant {formData.name} sera créé avec ces paramètres. 
                Vous pourrez toujours le modifier après sa création.
              </Paragraph>

              <Divider />

              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Configuration validée</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Prêt pour les tests</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Déploiement automatique</span>
                  </div>
                </div>

                <Button
                  type="primary"
                  size="large"
                  loading={loading}
                  onClick={onConfirm}
                  className="!h-12 !px-8 !text-lg !font-semibold bg-gradient-to-r from-purple-600 to-blue-600 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {loading ? 'Création en cours...' : 'Créer l\'assistant'}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </Space>
    </motion.div>
  );
};

export default SummaryStep; 