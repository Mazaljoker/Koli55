'use client';

import React, { useEffect } from 'react';
import { Form, Input, Typography, Space } from 'antd';
import { motion } from 'framer-motion';
import { AssistantStepProps } from '../../../../components/assistants/AssistantFormTypes';

const { Text, Paragraph, Title } = Typography;

const NameStep: React.FC<AssistantStepProps> = ({ form, isActive }) => {
  useEffect(() => {
    if (isActive && !form.getFieldValue('name')) {
      setTimeout(() => {
        const inputElement = document.querySelector('input[id="name"]');
        if (inputElement) {
          (inputElement as HTMLInputElement).focus();
        }
      }, 100);
    }
  }, [isActive, form]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={3}>Name your assistant</Title>
        
        <Paragraph type="secondary">
          Donnez un nom à votre assistant pour l&apos;identifier facilement. Choisissez un nom qui reflète 
          son rôle ou sa personnalité.
        </Paragraph>
        
        <Form.Item 
          name="name" 
          label="Nom de l'assistant"
          rules={[
            { required: true, message: "Le nom de l'assistant est requis" },
            { min: 2, message: "Le nom doit comporter au moins 2 caractères" }
          ]}
        >
          <Input 
            placeholder="Ex: Assistant Commercial"
            className="glassmorphism-input"
            size="large"
          />
        </Form.Item>
        
        <Text type="secondary" className="input-description">
          Ce nom sera utilisé dans l&apos;interface et lors des communications avec les utilisateurs
        </Text>
      </Space>
    </motion.div>
  );
};

export default NameStep; 