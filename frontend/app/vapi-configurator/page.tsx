"use client";

import { useState } from "react";
import {
  Card,
  Select,
  Typography,
  Space,
  Divider,
  Alert,
  Spin,
  Progress,
  List,
  Tag,
} from "antd";
import {
  PlayCircleOutlined,
  RobotOutlined,
  SettingOutlined,
  StopOutlined,
  ExportOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useVapiConfigurator } from "@/lib/hooks/useVapiConfigurator";
import { Button } from "@/components/ui/Button";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

export default function VapiConfiguratorPage() {
  const [selectedBusinessType, setSelectedBusinessType] =
    useState<string>("restaurant");

  // Utilisation du hook amélioré
  const {
    // État
    isCallActive,
    isSpeaking,
    isListening,
    volumeLevel,
    messages,
    currentStep,
    error,
    isLoading,
    isConnected,
    configuratorData,
    stepProgress,
    steps,

    // Actions
    startCall,
    stopCall,
    sendMessage,
    resetConversation,
    exportConfiguration,
  } = useVapiConfigurator({
    enableDebug: true,
  });

  // Messages d'interface utilisateur basés sur l'étape
  const getStepMessage = (step: number) => {
    switch (step) {
      case steps.WELCOME:
        return "🏠 Prêt à commencer";
      case steps.RESTAURANT_NAME:
        return "🏪 Nom du restaurant";
      case steps.CUISINE_TYPE:
        return "🍽️ Type de cuisine";
      case steps.SERVICES:
        return "🚚 Services proposés";
      case steps.HOURS:
        return "🕐 Horaires d'ouverture";
      case steps.SPECIALTIES:
        return "⭐ Spécialités";
      case steps.CONTACT_INFO:
        return "📞 Informations de contact";
      case steps.BUSINESS_GOALS:
        return "🎯 Objectifs business";
      case steps.REVIEW_CONFIG:
        return "📋 Révision configuration";
      case steps.COMPLETE:
        return "✅ Configuration terminée";
      default:
        return "📍 Étape inconnue";
    }
  };

  const handleExport = () => {
    const config = exportConfiguration();
    if (config) {
      // Télécharger le fichier JSON
      const blob = new Blob([JSON.stringify(config, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `allokoli-config-${
        configuratorData.restaurantName || "restaurant"
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <Title level={1} className="text-indigo-900">
            <RobotOutlined className="mr-3" />
            Agent Vapi Configurateur
          </Title>
          <Paragraph className="text-lg text-gray-600">
            Créez votre assistant conversationnel en temps réel avec Vapi
          </Paragraph>

          {/* Indicateur de connexion */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${
                isConnected
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              />
              <Text className="text-sm font-medium">
                {isConnected ? "Connecté" : "Déconnecté"}
              </Text>
            </div>

            {isCallActive && (
              <div className="flex items-center gap-2 px-3 py-1 text-blue-800 bg-blue-100 rounded-full">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <Text className="text-sm font-medium">Appel en cours</Text>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Panneau de contrôle */}
          <div className="lg:col-span-1">
            <Card className="sticky shadow-lg top-6">
              <Title level={3}>
                <SettingOutlined className="mr-2" />
                Contrôles
              </Title>

              {/* Erreurs */}
              {error && (
                <Alert
                  type="error"
                  message="Erreur"
                  description={error}
                  className="mb-4"
                  closable
                />
              )}

              {/* Progression */}
              <div className="mb-6">
                <Text strong>Progression de la configuration</Text>
                <Progress
                  percent={Math.round(stepProgress)}
                  status={configuratorData.isComplete ? "success" : "active"}
                  className="mt-2"
                />
                <Text type="secondary" className="text-sm">
                  {getStepMessage(currentStep)} ({Math.round(stepProgress)}%)
                </Text>
              </div>

              {/* Contrôles d'appel */}
              <Space direction="vertical" size="large" className="w-full">
                {!isCallActive ? (
                  <Button
                    variant="primary"
                    size="large"
                    icon={<PlayCircleOutlined />}
                    onClick={startCall}
                    isLoading={isLoading}
                    disabled={!isConnected}
                    className="w-full"
                  >
                    Démarrer la configuration
                  </Button>
                ) : (
                  <Button
                    danger
                    size="large"
                    icon={<StopOutlined />}
                    onClick={stopCall}
                    className="w-full"
                  >
                    Arrêter l'appel
                  </Button>
                )}

                <Button
                  size="large"
                  icon={<ReloadOutlined />}
                  onClick={resetConversation}
                  className="w-full"
                  disabled={isLoading}
                >
                  Recommencer
                </Button>

                {configuratorData.isComplete && (
                  <Button
                    variant="secondary"
                    size="large"
                    icon={<ExportOutlined />}
                    onClick={handleExport}
                    className="w-full text-green-700 border-green-300 bg-green-50 hover:bg-green-100"
                  >
                    Exporter la configuration
                  </Button>
                )}
              </Space>

              {/* Indicateurs audio */}
              {isCallActive && (
                <div className="p-4 mt-6 rounded-lg bg-gray-50">
                  <div className="flex items-center justify-between mb-2">
                    <Text strong>Audio</Text>
                    <div className="flex gap-2">
                      {isSpeaking && (
                        <Tag color="green">🎤 Assistant parle</Tag>
                      )}
                      {isListening && <Tag color="blue">👂 Écoute</Tag>}
                    </div>
                  </div>

                  {volumeLevel > 0 && (
                    <div>
                      <Text type="secondary">Niveau audio</Text>
                      <Progress
                        percent={volumeLevel * 100}
                        size="small"
                        showInfo={false}
                        strokeColor="#52c41a"
                      />
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Zone principale */}
          <div className="space-y-6 lg:col-span-2">
            {/* Conversation */}
            <Card className="shadow-lg" title="💬 Conversation en temps réel">
              <div className="space-y-3 overflow-y-auto max-h-96">
                {messages.length === 0 ? (
                  <div className="py-8 text-center text-gray-500">
                    <RobotOutlined className="mb-2 text-4xl" />
                    <Paragraph>
                      Démarrez la conversation pour voir les messages apparaître
                      ici.
                    </Paragraph>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${
                        msg.type === "assistant"
                          ? "bg-blue-50 border-l-4 border-blue-400"
                          : msg.type === "user"
                          ? "bg-green-50 border-l-4 border-green-400"
                          : "bg-gray-50 border-l-4 border-gray-400"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {msg.type === "assistant" && (
                            <RobotOutlined className="text-blue-600" />
                          )}
                          {msg.type === "user" && (
                            <span className="text-green-600">👤</span>
                          )}
                          {msg.type === "system" && (
                            <span className="text-gray-600">⚙️</span>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <Text
                              strong
                              className={
                                msg.type === "assistant"
                                  ? "text-blue-700"
                                  : msg.type === "user"
                                  ? "text-green-700"
                                  : "text-gray-700"
                              }
                            >
                              {msg.type === "assistant"
                                ? "Assistant"
                                : msg.type === "user"
                                ? "Vous"
                                : "Système"}
                            </Text>
                            <Text type="secondary" className="text-xs">
                              {msg.timestamp.toLocaleTimeString()}
                            </Text>
                          </div>
                          <Text className="whitespace-pre-wrap">
                            {msg.message}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            {/* Configuration collectée */}
            <Card className="shadow-lg" title="📊 Données collectées">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {configuratorData.restaurantName && (
                  <div className="p-3 rounded-lg bg-blue-50">
                    <Text strong className="text-blue-700">
                      🏪 Restaurant
                    </Text>
                    <br />
                    <Text>{configuratorData.restaurantName}</Text>
                  </div>
                )}

                {configuratorData.cuisineType && (
                  <div className="p-3 rounded-lg bg-green-50">
                    <Text strong className="text-green-700">
                      🍽️ Cuisine
                    </Text>
                    <br />
                    <Text>{configuratorData.cuisineType}</Text>
                  </div>
                )}

                {configuratorData.services &&
                  configuratorData.services.length > 0 && (
                    <div className="p-3 rounded-lg bg-purple-50">
                      <Text strong className="text-purple-700">
                        🚚 Services
                      </Text>
                      <br />
                      <div className="mt-1">
                        {configuratorData.services.map((service, index) => (
                          <Tag key={index} color="purple" className="mb-1">
                            {service}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}

                {configuratorData.hours &&
                  Object.keys(configuratorData.hours).length > 0 && (
                    <div className="p-3 rounded-lg bg-orange-50">
                      <Text strong className="text-orange-700">
                        🕐 Horaires
                      </Text>
                      <br />
                      {Object.entries(configuratorData.hours).map(
                        ([day, hours]) => (
                          <div key={day} className="text-sm">
                            <Text strong>{day}:</Text> {hours}
                          </div>
                        )
                      )}
                    </div>
                  )}

                {configuratorData.specialties &&
                  configuratorData.specialties.length > 0 && (
                    <div className="p-3 rounded-lg bg-red-50">
                      <Text strong className="text-red-700">
                        ⭐ Spécialités
                      </Text>
                      <br />
                      <div className="mt-1">
                        {configuratorData.specialties.map(
                          (specialty, index) => (
                            <Tag key={index} color="red" className="mb-1">
                              {specialty}
                            </Tag>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {configuratorData.phoneNumber && (
                  <div className="p-3 rounded-lg bg-cyan-50">
                    <Text strong className="text-cyan-700">
                      📞 Téléphone
                    </Text>
                    <br />
                    <Text>{configuratorData.phoneNumber}</Text>
                  </div>
                )}

                {configuratorData.businessGoals &&
                  configuratorData.businessGoals.length > 0 && (
                    <div className="p-3 rounded-lg bg-yellow-50">
                      <Text strong className="text-yellow-700">
                        🎯 Objectifs
                      </Text>
                      <br />
                      <div className="mt-1">
                        {configuratorData.businessGoals.map((goal, index) => (
                          <Tag key={index} color="gold" className="mb-1">
                            {goal}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {configuratorData.confidence > 0 && (
                <div className="p-3 mt-4 rounded-lg bg-gray-50">
                  <Text strong>Niveau de confiance des données</Text>
                  <Progress
                    percent={configuratorData.confidence}
                    status={
                      configuratorData.confidence > 80 ? "success" : "active"
                    }
                    className="mt-2"
                  />
                </div>
              )}
            </Card>

            {/* Configuration finale */}
            {configuratorData.isComplete && (
              <Card
                className="border-green-300 shadow-lg"
                title="🎉 Configuration finale"
              >
                <Alert
                  type="success"
                  message="Configuration terminée avec succès !"
                  description="Votre assistant vocal est prêt à être déployé."
                  className="mb-4"
                />

                <div className="p-4 rounded-lg bg-gray-50">
                  <Text strong>Aperçu JSON :</Text>
                  <pre className="mt-2 overflow-x-auto text-sm">
                    {JSON.stringify(configuratorData, null, 2)}
                  </pre>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
