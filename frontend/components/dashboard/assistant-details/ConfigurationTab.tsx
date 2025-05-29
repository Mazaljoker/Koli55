"use client";

import React from "react";
import {
  Card,
  Title,
  Text,
  Grid,
  Col,
  Flex,
  Metric,
  List,
  ListItem,
  Divider,
} from "@tremor/react";
import {
  CpuChipIcon,
  SpeakerWaveIcon,
  ChatBubbleBottomCenterIcon,
  DocumentTextIcon,
  PhoneArrowUpRightIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { Assistant } from "../../../lib/api/allokoli-sdk";

interface ConfigurationTabProps {
  assistant: Assistant;
}

const ConfigurationTab: React.FC<ConfigurationTabProps> = ({ assistant }) => {
  // Fonction utilitaire pour afficher "Non spécifié" si la valeur est vide
  const displayValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") {
      return "Non spécifié";
    }
    if (typeof value === "object") {
      return "Non spécifié";
    }
    return String(value);
  };

  // Récupérer les détails du modèle
  const modelName =
    typeof assistant.model === "string"
      ? assistant.model
      : assistant.model?.model;

  const modelProvider =
    typeof assistant.model === "object"
      ? assistant.model?.provider
      : modelName?.startsWith("gpt")
      ? "OpenAI"
      : modelName?.startsWith("claude")
      ? "Anthropic"
      : modelName?.startsWith("gemini")
      ? "Google"
      : "Inconnu";

  // Récupérer les détails de la voix
  const voiceId =
    typeof assistant.voice === "string"
      ? assistant.voice
      : assistant.voice?.voice_id;

  const voiceProvider =
    typeof assistant.voice === "object"
      ? assistant.voice?.provider
      : voiceId?.startsWith("eleven")
      ? "ElevenLabs"
      : voiceId?.startsWith("azure")
      ? "Azure"
      : "Inconnu";

  return (
    <div className="space-y-6">
      {/* Section Modèle d'IA */}
      <Card>
        <Flex alignItems="center" className="mb-4">
          <CpuChipIcon className="h-6 w-6 text-blue-600" />
          <Title className="ml-2">Modèle d&apos;IA</Title>
        </Flex>
        <Grid numItems={1} numItemsSm={2} className="gap-6">
          <Col>
            <Text className="text-gray-500">Fournisseur</Text>
            <Metric className="mt-1 text-base">
              {displayValue(modelProvider)}
            </Metric>
          </Col>
          <Col>
            <Text className="text-gray-500">Modèle</Text>
            <Metric className="mt-1 text-base">
              {displayValue(modelName)}
            </Metric>
          </Col>
        </Grid>

        <Divider />

        <Title className="text-sm mb-2">Paramètres du modèle</Title>
        <Grid numItems={1} numItemsSm={3} className="gap-6">
          <Col>
            <Text className="text-gray-500">Température</Text>
            <Metric className="mt-1 text-base">
              {(typeof assistant.model === "object"
                ? assistant.model?.temperature
                : null) || 0.7}
            </Metric>
          </Col>
          <Col>
            <Text className="text-gray-500">Tokens maximum</Text>
            <Metric className="mt-1 text-base">
              {(typeof assistant.model === "object"
                ? assistant.model?.max_tokens
                : null) || 1024}
            </Metric>
          </Col>
          <Col>
            <Text className="text-gray-500">Language</Text>
            <Metric className="mt-1 text-base">
              {displayValue(assistant.language)}
            </Metric>
          </Col>
        </Grid>

        <Divider />

        <Title className="text-sm mb-2">Instructions système</Title>
        <Card className="mt-2 bg-gray-50">
          <Text className="whitespace-pre-wrap">
            {assistant.instructions || "Aucune instruction spécifiée"}
          </Text>
        </Card>
      </Card>

      {/* Section Voix */}
      <Card>
        <Flex alignItems="center" className="mb-4">
          <SpeakerWaveIcon className="h-6 w-6 text-indigo-600" />
          <Title className="ml-2">Configuration de la voix</Title>
        </Flex>
        <Grid numItems={1} numItemsSm={2} className="gap-6">
          <Col>
            <Text className="text-gray-500">Fournisseur</Text>
            <Metric className="mt-1 text-base">
              {displayValue(voiceProvider)}
            </Metric>
          </Col>
          <Col>
            <Text className="text-gray-500">Voix</Text>
            <Metric className="mt-1 text-base">{displayValue(voiceId)}</Metric>
          </Col>
        </Grid>
      </Card>

      {/* Section Messages */}
      <Card>
        <Flex alignItems="center" className="mb-4">
          <ChatBubbleBottomCenterIcon className="h-6 w-6 text-green-600" />
          <Title className="ml-2">Messages</Title>
        </Flex>

        <Title className="text-sm mb-2">Message de bienvenue</Title>
        <Card className="mt-2 mb-6 bg-gray-50">
          <Text className="whitespace-pre-wrap">
            {assistant.firstMessage || "Aucun message de bienvenue spécifié"}
          </Text>
        </Card>

        <Title className="text-sm mb-2">Message de fin d&apos;appel</Title>
        <Card className="mt-2 bg-gray-50">
          <Text className="whitespace-pre-wrap">
            {(assistant.metadata as any)?.endCallMessage ||
              "Aucun message de fin spécifié"}
          </Text>
        </Card>
      </Card>

      {/* Section Paramètres avancés */}
      <Card>
        <Flex alignItems="center" className="mb-4">
          <DocumentTextIcon className="h-6 w-6 text-amber-600" />
          <Title className="ml-2">Paramètres avancés</Title>
        </Flex>

        <Grid numItems={1} numItemsSm={2} className="gap-6">
          <Col>
            <Text className="text-gray-500">Numéro de transfert</Text>
            <Flex className="mt-1 items-center gap-2">
              {(assistant.metadata as any)?.forwardingPhoneNumber ? (
                <>
                  <PhoneArrowUpRightIcon className="h-4 w-4 text-gray-500" />
                  <Metric className="text-base">
                    {(assistant.metadata as any).forwardingPhoneNumber}
                  </Metric>
                </>
              ) : (
                <Text className="text-gray-400">Non configuré</Text>
              )}
            </Flex>
          </Col>
          <Col>
            <Text className="text-gray-500">Timeout silence</Text>
            <Flex className="mt-1 items-center gap-2">
              <ClockIcon className="h-4 w-4 text-gray-500" />
              <Metric className="text-base">
                {assistant.silenceTimeoutSeconds || "5"} secondes
              </Metric>
            </Flex>
          </Col>
        </Grid>

        <Divider />

        <Title className="text-sm mb-2">Phrases de fin d&apos;appel</Title>
        <Card className="mt-2 bg-gray-50">
          <Text className="text-gray-500 mb-2">
            Ces phrases, si prononcées par l&apos;utilisateur, mettront fin à
            l&apos;appel
          </Text>
          {(assistant.metadata as any)?.endCallPhrases &&
          Array.isArray((assistant.metadata as any).endCallPhrases) &&
          (assistant.metadata as any).endCallPhrases.length > 0 ? (
            <List>
              {((assistant.metadata as any).endCallPhrases as string[]).map(
                (phrase, index) => (
                  <ListItem key={index}>
                    <Text className="font-medium">&quot;{phrase}&quot;</Text>
                  </ListItem>
                )
              )}
            </List>
          ) : (
            <Text className="text-gray-400">
              Aucune phrase de fin configurée
            </Text>
          )}
        </Card>
      </Card>

      {/* Section Intégrations */}
      <Card>
        <Flex alignItems="center" className="mb-4">
          <CpuChipIcon className="h-6 w-6 text-purple-600" />
          <Title className="ml-2">Intégrations</Title>
        </Flex>

        <Grid numItems={1} numItemsSm={2} className="gap-6">
          <Col>
            <Text className="text-gray-500">Bases de connaissances</Text>
            <div className="mt-2">
              <Text className="text-gray-400">Intégration à venir</Text>
            </div>
          </Col>
          <Col>
            <Text className="text-gray-500">Fonctions</Text>
            <div className="mt-2">
              <Text className="text-gray-400">Intégration à venir</Text>
            </div>
          </Col>
        </Grid>
      </Card>
    </div>
  );
};

export default ConfigurationTab;
