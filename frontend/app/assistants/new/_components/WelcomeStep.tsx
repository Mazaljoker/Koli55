"use client";

import React from "react";
import { Typography, Space, Card } from "antd";
import { motion } from "framer-motion";
import { Sparkles, Zap, Users, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";

const { Title, Paragraph } = Typography;

interface WelcomeStepProps {
  onStart: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({ onStart }) => {
  const features = [
    {
      icon: <Zap className="w-6 h-6 text-purple-600" />,
      title: "Création rapide",
      description: "Votre assistant opérationnel en 5 minutes",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Templates prêts",
      description: "Templates optimisés par secteur d'activité",
    },
    {
      icon: <PhoneCall className="w-6 h-6 text-green-600" />,
      title: "Test immédiat",
      description: "Testez votre assistant directement depuis votre navigateur",
    },
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
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-purple-600" />
              <div className="absolute rounded-full -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 blur opacity-30 animate-pulse"></div>
            </div>
          </motion.div>

          <Title
            level={1}
            className="!mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            Créez votre Assistant IA
          </Title>

          <Paragraph className="max-w-2xl mx-auto text-lg text-gray-600">
            Bienvenue dans le wizard de création AlloKoli ! Nous allons créer
            ensemble votre assistant vocal IA personnalisé en quelques étapes
            simples et intuitives.
          </Paragraph>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid max-w-4xl grid-cols-1 gap-6 mx-auto md:grid-cols-3"
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className="transition-all duration-300 border-0 shadow-lg hover:shadow-xl bg-gradient-to-br from-white to-gray-50"
              bodyStyle={{ padding: "24px" }}
            >
              <div className="text-center">
                <div className="mb-3">{feature.icon}</div>
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
            variant="primary"
            size="large"
            onClick={onStart}
            className="!h-14 !px-12 !text-lg !font-semibold bg-gradient-to-r from-purple-600 to-blue-600 border-0 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            C&apos;est parti !
          </Button>

          <Paragraph className="mt-4 text-sm text-gray-500">
            {" "}
            ⏱️ Temps estimé : 5 minutes{" "}
          </Paragraph>
        </motion.div>

        {/* Progress Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="max-w-md p-4 mx-auto text-left rounded-lg bg-purple-50"
        >
          <Paragraph className="!mb-1 text-sm font-medium text-purple-800">
            📋 Ce que nous allons configurer :
          </Paragraph>
          <Paragraph className="!mb-0 text-xs text-purple-600">
            Template • Identité • Voix • Messages • Base de connaissances • Test
            en direct
          </Paragraph>
        </motion.div>
      </Space>
    </motion.div>
  );
};

export default WelcomeStep;
