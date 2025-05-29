// frontend/app/configurateur/page.tsx
"use client";

import React, { Suspense } from "react";
import { Typography, Spin } from "antd";
import { motion } from "framer-motion";
import ConfiguratorGlob from "./components/ConfiguratorGlob";
import ConfiguratorChat from "./components/ConfiguratorChat";
import ConfiguratorSteps from "./components/ConfiguratorSteps";
import ConfiguratorResult from "./components/ConfiguratorResult";
import { useVapiConfigurator } from "@/lib/hooks/useVapiConfigurator";

const { Title, Paragraph } = Typography;

const ConfiguratorPage: React.FC = () => {
  const { currentStep, configuratorData, isCallActive } = useVapiConfigurator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="container px-4 py-8 mx-auto">
        {/* Header */}
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title level={1} className="mb-4 text-white">
            Configurateur AlloKoli
          </Title>
          <Paragraph className="max-w-2xl mx-auto text-xl text-gray-300">
            Créez votre assistant vocal personnalisé en conversant avec notre
            IA. Vocal ou texte, c&apos;est vous qui choisissez !
          </Paragraph>

          {/* Indicateur de statut */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <div
              className={`w-3 h-3 rounded-full ${
                isCallActive ? "bg-green-400 animate-pulse" : "bg-gray-400"
              }`}
            />
            <span className="text-sm text-gray-300">
              {isCallActive ? "Assistant actif" : "Assistant en attente"}
            </span>
          </div>
        </motion.div>

        {/* Layout principal */}
        <div className="grid grid-cols-1 gap-8 mb-8 lg:grid-cols-2">
          {/* Colonne gauche - Visualisation */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Suspense
              fallback={
                <div className="h-[600px] bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl flex items-center justify-center">
                  <Spin size="large" />
                </div>
              }
            >
              <ConfiguratorGlob />
            </Suspense>

            <ConfiguratorSteps currentStep={currentStep} />
          </motion.div>

          {/* Colonne droite - Chat */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <ConfiguratorChat />
          </motion.div>
        </div>

        {/* Résultat - Affiché seulement si la configuration est complète */}
        {configuratorData.isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ConfiguratorResult
              generatedConfig={configuratorData}
              isComplete={configuratorData.isComplete}
              onDeploy={(config) => {
                console.log("Déploiement:", config);
                // Logique de déploiement
              }}
              onExport={(config) => {
                console.log("Export:", config);
                // Logique d'export
              }}
            />
          </motion.div>
        )}

        {/* Instructions d'utilisation */}
        <motion.div
          className="p-6 mt-12 border bg-white/5 backdrop-blur-sm rounded-xl border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Title level={3} className="mb-4 text-white">
            Comment utiliser le configurateur ?
          </Title>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-blue-500/20">
                <span className="font-bold text-blue-400">1</span>
              </div>
              <Paragraph className="text-sm text-gray-300">
                <strong className="text-white">Cliquez sur "Commencer"</strong>
                <br />
                Lancez la conversation vocale ou utilisez le mode texte
              </Paragraph>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-purple-500/20">
                <span className="font-bold text-purple-400">2</span>
              </div>
              <Paragraph className="text-sm text-gray-300">
                <strong className="text-white">Répondez aux questions</strong>
                <br />
                L&apos;assistant vous guide étape par étape dans la
                configuration
              </Paragraph>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-3 rounded-full bg-green-500/20">
                <span className="font-bold text-green-400">3</span>
              </div>
              <Paragraph className="text-sm text-gray-300">
                <strong className="text-white">Déployez votre assistant</strong>
                <br />
                Exportez la configuration ou déployez directement sur AlloKoli
              </Paragraph>
            </div>
          </div>

          <div className="p-4 mt-6 border rounded-lg bg-blue-500/10 border-blue-500/20">
            <Paragraph className="mb-0 text-sm text-blue-200">
              💡 <strong>Astuce :</strong> Vous pouvez passer du mode vocal au
              mode texte à tout moment en cliquant sur l&apos;icône de volume
              dans l&apos;interface de chat.
            </Paragraph>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ConfiguratorPage;
