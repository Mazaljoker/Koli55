// frontend/app/configurateur/components/ConfiguratorResult.tsx
"use client";

import React, { useState } from "react";
import { Card, Typography, Space, notification } from "antd";
import {
  Download,
  Copy,
  Rocket,
  Eye,
  EyeOff,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

const { Title, Paragraph, Text } = Typography;

interface ConfiguratorData {
  restaurantName?: string;
  cuisineType?: string;
  services?: string[];
  hours?: Record<string, string>;
  specialties?: string[];
  isComplete: boolean;
}

interface ConfiguratorResultProps {
  generatedConfig?: ConfiguratorData;
  isComplete?: boolean;
  onDeploy?: (config: any) => void;
  onExport?: (config: any) => void;
}

const ConfiguratorResult: React.FC<ConfiguratorResultProps> = ({
  generatedConfig,
  isComplete = false,
  onDeploy,
  onExport,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  // Générer la configuration complète pour l'assistant
  const generateAssistantConfig = () => {
    const restaurantName =
      generatedConfig?.restaurantName || "Votre Restaurant";
    const cuisineType = generatedConfig?.cuisineType || "cuisine moderne";
    const services = generatedConfig?.services || [];
    const specialties = generatedConfig?.specialties || [];

    return {
      restaurant: {
        name: restaurantName,
        cuisine_type: cuisineType,
        services: services,
        hours: generatedConfig?.hours || {},
        specialties: specialties,
      },
      assistant_config: {
        name: `Assistant ${restaurantName}`,
        greeting: `Bonjour et bienvenue chez ${restaurantName} ! Comment puis-je vous aider aujourd'hui ?`,
        systemPrompt: `Tu es l'assistant vocal de ${restaurantName}, un restaurant de ${cuisineType}. 

INFORMATIONS SUR LE RESTAURANT:
- Nom: ${restaurantName}
- Type de cuisine: ${cuisineType}
- Services: ${services.join(", ")}
- Spécialités: ${specialties.join(", ")}

CAPACITÉS:
- Réserver une table
- Fournir des informations sur le menu et les spécialités
- Indiquer les horaires d'ouverture
- Informer sur les services disponibles (livraison, click & collect, etc.)
- Transférer vers un humain si nécessaire

INSTRUCTIONS:
- Sois chaleureux et professionnel
- Mets en valeur les spécialités de la maison
- Guide les clients vers une réservation ou commande
- Sois précis sur les horaires et services disponibles`,
        voice: {
          provider: "eleven-labs",
          voiceId: "jennifer",
          settings: {
            tone: "friendly",
            language: "fr-FR",
          },
        },
        capabilities: [
          "reservations",
          "menu_info",
          "hours_info",
          "services_info",
          "human_transfer",
        ],
      },
    };
  };

  const assistantConfig = generateAssistantConfig();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(assistantConfig, null, 2)
      );
      notification.success({
        message: "Configuration copiée",
        description: "La configuration a été copiée dans le presse-papiers",
        duration: 3,
      });
    } catch (error) {
      console.error("Erreur copie:", error);
      notification.error({
        message: "Erreur de copie",
        description: "Impossible de copier la configuration",
        duration: 3,
      });
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(assistantConfig, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `assistant-${assistantConfig.restaurant.name
      .toLowerCase()
      .replace(/\s+/g, "-")}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    notification.success({
      message: "Configuration exportée",
      description: "Le fichier de configuration a été téléchargé",
      duration: 3,
    });

    if (onExport) {
      onExport(assistantConfig);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);

    try {
      // Simulation du déploiement - remplacer par l'appel API réel
      await new Promise((resolve) => setTimeout(resolve, 2000));

      notification.success({
        message: "Assistant déployé !",
        description: `L'assistant ${assistantConfig.restaurant.name} est maintenant opérationnel`,
        duration: 5,
      });

      if (onDeploy) {
        onDeploy(assistantConfig);
      }
    } catch (error) {
      console.error("Erreur déploiement:", error);
      notification.error({
        message: "Erreur de déploiement",
        description: "Impossible de déployer l'assistant pour le moment",
        duration: 3,
      });
    } finally {
      setIsDeploying(false);
    }
  };

  if (!isComplete && !generatedConfig?.isComplete) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="p-6 border bg-white/10 backdrop-blur-sm border-white/20 rounded-xl"
    >
      {/* Header avec animation de succès */}
      <div className="mb-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="flex items-center justify-center w-16 h-16 mx-auto mb-4 border rounded-full bg-green-500/20 border-green-500/30"
        >
          <CheckCircle size={32} className="text-green-400" />
        </motion.div>

        <Title level={2} className="mb-2 text-white">
          🎉 Configuration terminée !
        </Title>
        <Paragraph className="text-lg text-gray-300">
          Votre assistant vocal pour{" "}
          <strong className="text-white">
            {assistantConfig.restaurant.name}
          </strong>{" "}
          est prêt
        </Paragraph>
      </div>

      {/* Résumé de la configuration */}
      <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-3">
        <Card className="border bg-blue-500/20 border-blue-500/30">
          <div className="text-center">
            <Title level={4} className="mb-2 text-blue-200">
              Restaurant
            </Title>
            <Text className="block font-medium text-white">
              {assistantConfig.restaurant.name}
            </Text>
            <Text className="text-sm text-blue-200">
              {assistantConfig.restaurant.cuisine_type}
            </Text>
          </div>
        </Card>

        <Card className="border bg-green-500/20 border-green-500/30">
          <div className="text-center">
            <Title level={4} className="mb-2 text-green-200">
              Services
            </Title>
            <Text className="block font-medium text-white">
              {assistantConfig.restaurant.services.length} service
              {assistantConfig.restaurant.services.length > 1 ? "s" : ""}
            </Text>
            <Text className="text-sm text-green-200">
              {assistantConfig.restaurant.services.slice(0, 2).join(", ")}
              {assistantConfig.restaurant.services.length > 2 && "..."}
            </Text>
          </div>
        </Card>

        <Card className="border bg-purple-500/20 border-purple-500/30">
          <div className="text-center">
            <Title level={4} className="mb-2 text-purple-200">
              Spécialités
            </Title>
            <Text className="block font-medium text-white">
              {assistantConfig.restaurant.specialties.length} spécialité
              {assistantConfig.restaurant.specialties.length > 1 ? "s" : ""}
            </Text>
            <Text className="text-sm text-purple-200">
              {assistantConfig.restaurant.specialties.slice(0, 1).join(", ")}
              {assistantConfig.restaurant.specialties.length > 1 && "..."}
            </Text>
          </div>
        </Card>
      </div>

      {/* Configuration JSON (optionnel) */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-3">
            <Title level={4} className="mb-0 text-white">
              Configuration JSON
            </Title>
            <Button
              onClick={handleCopy}
              className="text-white border-white/20 hover:bg-white/10"
              icon={<Copy size={16} />}
            >
              Copier
            </Button>
          </div>
          <div className="p-4 overflow-y-auto border border-gray-700 rounded-lg bg-gray-900/50 max-h-96">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              {JSON.stringify(assistantConfig, null, 2)}
            </pre>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <Space className="justify-center w-full" size="large">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-white border-white/20 hover:bg-white/10"
          icon={isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
        >
          {isExpanded ? "Masquer" : "Voir"} la config
        </Button>

        <Button
          onClick={handleExport}
          className="text-blue-400 border-blue-500 hover:bg-blue-500/10"
          icon={<Download size={16} />}
        >
          Exporter JSON
        </Button>

        <Button
          onClick={handleDeploy}
          loading={isDeploying}
          className="text-white border-0 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          icon={<Rocket size={16} />}
        >
          {isDeploying ? "Déploiement..." : "Déployer Assistant"}
        </Button>
      </Space>

      {/* Message de succès */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-4 mt-6 border rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20"
      >
        <div className="flex items-start gap-3">
          <Sparkles size={20} className="text-green-400 mt-0.5" />
          <div>
            <Text className="block mb-1 font-medium text-green-200">
              Félicitations ! Votre assistant est configuré
            </Text>
            <Text className="text-sm text-gray-300">
              Votre assistant vocal comprend maintenant votre restaurant et peut
              : gérer les réservations, informer sur le menu, indiquer les
              horaires et mettre en valeur vos spécialités. Il est prêt à être
              déployé !
            </Text>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ConfiguratorResult;
