'use client';

import React, { useState } from 'react';
import { Typography, Space, Card, Row, Col, Badge } from 'antd';import { motion } from 'framer-motion';import {   PhoneCall,   CalendarCheck2,   HelpCircle,   Truck,   Settings,   Users,  MessageCircle} from 'lucide-react';
import { AssistantStepProps } from '../../../../components/assistants/AssistantFormTypes';

const { Title, Paragraph } = Typography;

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
  defaultSettings: {
    modelProvider: string;
    modelName: string;
    voiceProvider: string;
    voiceId: string;
    firstMessage: string;
    instructions: string;
  };
}

const templates: Template[] = [
  {
    id: 'receptionist',
    name: 'Standardiste',
    description: 'Accueil téléphonique professionnel et transfert d\'appels',
    icon: <PhoneCall className="h-8 w-8" />,
    popular: true,
    features: ['Accueil personnalisé', 'Transfert d\'appels', 'Prise de messages', 'Horaires d\'ouverture'],
    defaultSettings: {
      modelProvider: 'openai',
      modelName: 'gpt-4o',
      voiceProvider: 'eleven-labs',
      voiceId: 'jennifer',
      firstMessage: 'Bonjour, vous êtes bien chez [Nom de l\'entreprise]. Comment puis-je vous aider ?',
      instructions: 'Vous êtes un standardiste professionnel. Accueillez chaleureusement les appelants, identifiez leurs besoins et transférez vers le bon service.'
    }
  },
  {
    id: 'appointment',
    name: 'Prise de RDV',
    description: 'Gestion automatisée des rendez-vous et planning',
    icon: <CalendarCheck2 className="h-8 w-8" />,
    popular: true,
    features: ['Consultation d\'agenda', 'Prise de RDV', 'Rappels automatiques', 'Gestion des annulations'],
    defaultSettings: {
      modelProvider: 'openai',
      modelName: 'gpt-4o',
      voiceProvider: 'eleven-labs',
      voiceId: 'sarah',
      firstMessage: 'Bonjour ! Je peux vous aider à prendre rendez-vous. Quel service vous intéresse ?',
      instructions: 'Vous gérez les rendez-vous. Proposez des créneaux disponibles, confirmez les informations et programmez les RDV.'
    }
  },
  {
    id: 'faq',
    name: 'FAQ',
    description: 'Réponses automatiques aux questions fréquentes',
    icon: <HelpCircle className="h-8 w-8" />,
    features: ['Base de connaissances', 'Réponses instantanées', 'Escalade vers humain', 'Apprentissage continu'],
    defaultSettings: {
      modelProvider: 'openai',
      modelName: 'gpt-4o',
      voiceProvider: 'eleven-labs',
      voiceId: 'rachel',
      firstMessage: 'Bonjour ! J\'ai accès à notre base de connaissances. Quelle est votre question ?',
      instructions: 'Vous répondez aux questions fréquentes en utilisant la base de connaissances. Si vous ne savez pas, proposez un transfert vers un humain.'
    }
  },
  {
    id: 'customer-service',
    name: 'Service Client',
    description: 'Support client complet et résolution de problèmes',
    icon: <Truck className="h-8 w-8" />,
    features: ['Suivi de commandes', 'Retours/échanges', 'Support technique', 'Escalade intelligente'],
    defaultSettings: {
      modelProvider: 'openai',
      modelName: 'gpt-4o',
      voiceProvider: 'eleven-labs',
      voiceId: 'chris',
      firstMessage: 'Bonjour, je suis votre assistant service client. Comment puis-je vous aider aujourd\'hui ?',
      instructions: 'Vous aidez les clients avec leurs demandes : commandes, retours, support technique. Soyez empathique et orienté solution.'
    }
  },
  {
    id: 'sales',
    name: 'Commercial',
    description: 'Qualification de prospects et support commercial',
    icon: <Users className="h-8 w-8" />,
    features: ['Qualification prospects', 'Présentation produits', 'Prise de coordonnées', 'Planification démonstrations'],
    defaultSettings: {
      modelProvider: 'openai',
      modelName: 'gpt-4o',
      voiceProvider: 'eleven-labs',
      voiceId: 'adam',
      firstMessage: 'Bonjour ! Merci de votre intérêt pour nos solutions. Comment puis-je vous renseigner ?',
      instructions: 'Vous qualifiez les prospects commerciaux. Identifiez leurs besoins, présentez les solutions adaptées et planifiez des rendez-vous.'
    }
  },
  {
    id: 'custom',
    name: 'Personnalisé',
    description: 'Configuration sur mesure selon vos besoins',
    icon: <Settings className="h-8 w-8" />,
    features: ['Configuration libre', 'Templates personnalisés', 'Logique métier', 'Intégrations spécifiques'],
    defaultSettings: {
      modelProvider: 'openai',
      modelName: 'gpt-4o',
      voiceProvider: 'eleven-labs',
      voiceId: 'jennifer',
      firstMessage: 'Bonjour, comment puis-je vous aider ?',
      instructions: 'Vous êtes un assistant IA. Aidez l\'utilisateur de manière professionnelle et efficace.'
    }
  }
];

const TemplateStep: React.FC<AssistantStepProps> = ({ form }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template.id);
    
    // Pré-remplir le formulaire avec les valeurs du template
    form.setFieldsValue({
      template: template.id,
      name: template.name,
      modelProvider: template.defaultSettings.modelProvider,
      modelName: template.defaultSettings.modelName,
      voiceProvider: template.defaultSettings.voiceProvider,
      voiceId: template.defaultSettings.voiceId,
      firstMessage: template.defaultSettings.firstMessage,
      systemPrompt: template.defaultSettings.instructions,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div className="text-center">
          <Title level={3}>Quel type d&apos;assistant souhaitez-vous ?</Title>
          <Paragraph type="secondary" className="text-lg">
            Choisissez un template optimisé pour votre secteur d&apos;activité. 
            Vous pourrez personnaliser tous les paramètres par la suite.
          </Paragraph>
        </div>

        <Row gutter={[16, 16]}>
          {templates.map((template, index) => (
            <Col xs={24} md={12} lg={8} key={template.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card
                  hoverable
                  className={`h-full cursor-pointer transition-all duration-300 ${
                    selectedTemplate === template.id
                      ? 'border-purple-500 shadow-lg ring-2 ring-purple-200'
                      : 'hover:border-purple-300 hover:shadow-md'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                  bodyStyle={{ padding: '24px' }}
                >
                  <div className="relative">
                    {template.popular && (
                      <Badge.Ribbon text="Populaire" color="purple" className="absolute -top-6 -right-6">
                        <div></div>
                      </Badge.Ribbon>
                    )}
                    
                    <Space direction="vertical" size="middle" className="w-full">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-lg ${
                          selectedTemplate === template.id 
                            ? 'bg-purple-100 text-purple-600' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {template.icon}
                        </div>
                        <div>
                          <Title level={4} className="!mb-1">
                            {template.name}
                          </Title>
                        </div>
                      </div>
                      
                      <Paragraph className="!mb-3 text-gray-600 text-sm">
                        {template.description}
                      </Paragraph>
                      
                      <div className="space-y-1">
                        {template.features.slice(0, 3).map((feature, idx) => (
                          <div key={idx} className="flex items-center text-xs text-gray-500">
                            <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                        {template.features.length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{template.features.length - 3} autres fonctionnalités
                          </div>
                        )}
                      </div>
                    </Space>
                  </div>
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        {selectedTemplate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="bg-purple-50 rounded-lg p-4 border border-purple-200"
          >
            <div className="flex items-start space-x-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <MessageCircle className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <Paragraph className="!mb-1 font-medium text-purple-800">
                  Template sélectionné : {templates.find(t => t.id === selectedTemplate)?.name}
                </Paragraph>
                <Paragraph className="!mb-0 text-sm text-purple-600">
                  Les paramètres ont été pré-configurés pour ce type d&apos;assistant. 
                  Vous pourrez les personnaliser dans les étapes suivantes.
                </Paragraph>
              </div>
            </div>
          </motion.div>
        )}
      </Space>
    </motion.div>
  );
};

export default TemplateStep; 