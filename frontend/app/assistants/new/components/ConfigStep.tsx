'use client';

import React, { useState, useEffect } from 'react';
import { Form, Input, Typography, Space, Switch, Slider, Divider, Tag, InputNumber } from 'antd';
import { InfoCircleOutlined, SettingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { AssistantStepProps } from '../../../../components/assistants/AssistantFormTypes';

const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;

const ConfigStep: React.FC<AssistantStepProps> = ({ form }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Initialiser l'affichage avancé si des paramètres avancés sont déjà configurés
  useEffect(() => {
    const hasAdvancedSettings = 
      form.getFieldValue('modelTemperature') !== undefined ||
      form.getFieldValue('modelMaxTokens') !== undefined ||
      form.getFieldValue('endCallMessage') !== undefined ||
      form.getFieldValue('endCallPhrases') !== undefined;
    
    if (hasAdvancedSettings) {
      setShowAdvanced(true);
    }
  }, [form]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={3}>Configuration avancée</Title>
        
        <Paragraph type="secondary">
          Paramétrez le comportement spécifique et les fonctionnalités additionnelles
          de votre assistant.
        </Paragraph>
        
        {/* Configuration du message initial */}
        <Form.Item 
          name="firstMessage" 
          label="Message de bienvenue"
          tooltip="Ce message est prononcé par l'assistant au début de chaque appel"
          rules={[{ required: true, message: "Le message de bienvenue est requis" }]}
        >
          <TextArea 
            rows={3}
            placeholder="Bonjour, je suis [nom de l'assistant]. Comment puis-je vous aider aujourd'hui ?"
            className="glassmorphism-input"
          />
        </Form.Item>
        
        {/* Toggle pour les options avancées */}
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Switch 
            checked={showAdvanced} 
            onChange={(checked) => setShowAdvanced(checked)}
          />
          <Text onClick={() => setShowAdvanced(!showAdvanced)} style={{ cursor: 'pointer' }}>
            <SettingOutlined /> Mode avancé
          </Text>
        </div>
        
        {/* Options avancées (visibles uniquement si showAdvanced est true) */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
          >
            <Divider orientation="left">Paramètres avancés</Divider>
            
            {/* Température du modèle */}
            <Form.Item 
              name="modelTemperature" 
              label={
                <span>
                  Température
                  <Tag color="blue" style={{ marginLeft: '8px' }}>IA</Tag>
                </span>
              }
              tooltip="Contrôle la créativité des réponses. Valeur basse (0.2) = réponses plus cohérentes, valeur haute (0.8) = réponses plus variées et créatives."
              initialValue={0.7}
            >
              <Slider 
                min={0}
                max={1}
                step={0.1}
                marks={{
                  0: 'Précis',
                  0.5: 'Équilibré',
                  1: 'Créatif'
                }}
              />
            </Form.Item>
            
            {/* Nombre maximal de tokens */}
            <Form.Item 
              name="modelMaxTokens" 
              label={
                <span>
                  Longueur maximale des réponses
                  <Tag color="blue" style={{ marginLeft: '8px' }}>IA</Tag>
                </span>
              }
              tooltip="Limite la longueur des réponses générées par l'IA"
              initialValue={1024}
            >
              <InputNumber 
                min={256}
                max={4096}
                step={128}
                className="glassmorphism-input"
                style={{ width: '100%' }}
              />
            </Form.Item>
            
            {/* Message de fin d'appel */}
            <Form.Item 
              name="endCallMessage" 
              label="Message de fin d'appel"
              tooltip="Ce message est prononcé par l'assistant avant de raccrocher"
            >
              <Input 
                placeholder="Merci de votre appel. Au revoir et à bientôt !"
                className="glassmorphism-input"
              />
            </Form.Item>
            
            {/* Expressions pour terminer un appel */}
            <Form.Item 
              name="endCallPhrases" 
              label="Expressions de fin d'appel"
              tooltip="Ces phrases, si prononcées par l'utilisateur, mettront fin à l'appel automatiquement"
            >
              <TextArea 
                rows={2}
                placeholder="au revoir, merci beaucoup, terminé, fin de l'appel"
                className="glassmorphism-input"
              />
            </Form.Item>
            
            {/* Numéro de transfert */}
            <Form.Item 
              name="forwardingPhoneNumber" 
              label="Numéro de transfert"
              tooltip="Si spécifié, l'assistant pourra transférer l'appel vers ce numéro"
            >
              <Input 
                placeholder="+33612345678"
                className="glassmorphism-input"
              />
            </Form.Item>
            
            <Paragraph type="secondary" style={{ marginTop: '16px' }}>
              <InfoCircleOutlined style={{ marginRight: '8px' }} />
              Les paramètres avancés permettent d&apos;affiner le comportement de l&apos;assistant,
              mais les valeurs par défaut fonctionnent bien dans la plupart des cas.
            </Paragraph>
          </motion.div>
        )}
      </Space>
    </motion.div>
  );
};

export default ConfigStep; 