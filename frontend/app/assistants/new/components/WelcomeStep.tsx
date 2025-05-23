'use client';

import React from 'react';
import { Typography, Space, Button, Card } from 'antd';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Users, PhoneCall } from 'lucide-react';

const { Title, Paragraph } = Typography;

interface WelcomeStepProps {
  onStart: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onStart }) => {
  const features = [
    {
      icon: <Zap className="h-6 w-6 text-purple-600" />,
      title: "Création rapide",
      description: "Votre assistant opérationnel en 5 minutes"
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Templates prêts",
      description: "Templates optimisés par secteur d'activité"
    },
    {
      icon: <PhoneCall className="h-6 w-6 text-green-600" />,
      title: "Test immédiat",
      description: "Testez votre assistant directement depuis votre navigateur"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <Space direction="vertical" size={32} className="w-full">
        {/* Hero Section */}
        <div>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6"
          >
            <div className="relative inline-block">
              <Sparkles className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-30 animate-pulse"></div>
            </div>
          </motion.div>
          
          <Title level={1} className="!mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Créez votre Assistant IA
          </Title>
          
          <Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bienvenue dans le wizard de création AlloKoli ! Nous allons créer ensemble votre assistant vocal IA 
            personnalisé en quelques étapes simples et intuitives.
          </Paragraph>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50"
              bodyStyle={{ padding: '24px' }}
            >
              <div className="text-center">
                <div className="mb-3">
                  {feature.icon}
                </div>
                <Title level={4} className="!mb-2 !text-gray-800">
                  {feature.title}
                </Title>
                <Paragraph className="!mb-0 text-gray-600 text-sm">
                  {feature.description}
                </Paragraph>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="pt-8"
        >
          <Button
            type="primary"
            size="large"
            onClick={onStart}
            className="!h-14 !px-12 !text-lg !font-semibold bg-gradient-to-r from-purple-600 to-blue-600 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Sparkles className="h-5 w-5 mr-2" />
                         C&apos;est parti !
          </Button>
          
                     <Paragraph className="mt-4 text-sm text-gray-500">             ⏱️ Temps estimé : 5 minutes           </Paragraph>
        </motion.div>

        {/* Progress Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="bg-purple-50 rounded-lg p-4 text-left max-w-md mx-auto"
        >
          <Paragraph className="!mb-1 text-sm font-medium text-purple-800">
            📋 Ce que nous allons configurer :
          </Paragraph>
          <Paragraph className="!mb-0 text-xs text-purple-600">
            Template • Identité • Voix • Messages • Base de connaissances • Test en direct
          </Paragraph>
        </motion.div>
      </Space>
    </motion.div>
  );
};

export default WelcomeStep; 