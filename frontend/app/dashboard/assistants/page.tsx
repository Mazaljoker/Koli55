"use client";

import React from "react";
import { Typography, Row, Col, Card, Avatar, Tooltip, Tag } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  PlayCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const { Title, Paragraph, Text } = Typography;

// Sample data - replace with actual data fetching
const assistantsData = [
  {
    id: "1",
    name: "Assistant Commercial Proactif",
    description: "Spécialisé dans la génération de leads et la qualification.",
    avatarUrl: undefined, // ou l'URL d'un avatar par défaut
    version: "1.2.0",
    status: "active",
    lastCall: "2024-07-28T10:30:00Z",
  },
  {
    id: "2",
    name: "Support Client Nuit",
    description:
      "Prend en charge les requêtes clients en dehors des heures de bureau.",
    avatarUrl: "/assets/avatar-female-2.png",
    version: "2.0.1",
    status: "active",
    lastCall: "2024-07-28T14:15:00Z",
  },
  {
    id: "3",
    name: "Assistant de Démonstration Produit",
    description: "Guide les utilisateurs à travers les fonctionnalités clés.",
    avatarUrl: "/assets/avatar-male-1.png",
    version: "1.0.0",
    status: "draft",
    lastCall: null,
  },
  {
    id: "4",
    name: "Collecteur de Feedback Post-Achat",
    description: "Sonde la satisfaction client après une commande.",
    avatarUrl: "/assets/avatar-female-3.png",
    version: "1.1.0",
    status: "active",
    lastCall: "2024-07-27T18:00:00Z",
  },
];

export default function MyAssistantsPage() {
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <Title level={2} className="!text-allokoli-text-primary !mb-1">
            Mes Assistants IA
          </Title>
          <Paragraph className="!text-allokoli-text-secondary">
            Gérez, configurez et suivez la performance de vos assistants
            AlloKoli.
          </Paragraph>
        </div>
        <Link href="/assistants/new">
          <Button
            variant="primary"
            icon={<PlusOutlined />}
            size="large"
            className="mt-4 sm:mt-0"
          >
            Nouvel Assistant
          </Button>
        </Link>
      </div>

      <Row gutter={[24, 24]}>
        {assistantsData.map((assistant) => (
          <Col key={assistant.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              className="glassmorphism assistant-card overflow-hidden shadow-lg rounded-xl h-full flex flex-col"
              cover={
                <div className="h-40 bg-gradient-to-br from-allokoli-primary via-allokoli-secondary to-allokoli-accent flex items-center justify-center">
                  <Avatar
                    size={80}
                    src={assistant.avatarUrl}
                    icon={!assistant.avatarUrl && <UserOutlined />}
                    className="border-4 border-white shadow-md bg-white text-allokoli-primary"
                  />
                </div>
              }
              actions={[
                <Tooltip title="Tester" key="play">
                  <Link href={`/assistants/${assistant.id}/test`} passHref>
                    <PlayCircleOutlined className="text-allokoli-primary hover:text-allokoli-accent" />
                  </Link>
                </Tooltip>,
                <Tooltip title="Modifier" key="edit">
                  <Link href={`/assistants/${assistant.id}/edit`} passHref>
                    <EditOutlined className="text-allokoli-secondary hover:text-allokoli-accent" />
                  </Link>
                </Tooltip>,
                <Tooltip title="Paramètres" key="settings">
                  <SettingOutlined className="text-gray-500 hover:text-allokoli-accent" />
                </Tooltip>,
              ]}
            >
              <Card.Meta
                title={
                  <Link
                    href={`/assistants/${assistant.id}`}
                    className="text-allokoli-text-primary hover:text-allokoli-primary transition-colors duration-200"
                  >
                    {assistant.name}
                  </Link>
                }
                description={
                  <Paragraph
                    type="secondary"
                    ellipsis={{ rows: 2 }}
                    className="!mb-0 !text-sm"
                  >
                    {assistant.description}
                  </Paragraph>
                }
                className="mb-4"
              />
              <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-1">
                  <Text strong className="text-xs text-allokoli-text-tertiary">
                    Version:
                  </Text>
                  <Text className="text-xs text-allokoli-text-secondary">
                    {assistant.version}
                  </Text>
                </div>
                <div className="flex justify-between items-center mb-1">
                  <Text strong className="text-xs text-allokoli-text-tertiary">
                    Statut:
                  </Text>
                  <Tag
                    color={assistant.status === "active" ? "green" : "orange"}
                    className="text-xs"
                  >
                    {assistant.status === "active" ? "Actif" : "Brouillon"}
                  </Tag>
                </div>
                <div className="flex justify-between items-center">
                  <Text strong className="text-xs text-allokoli-text-tertiary">
                    Dernier appel:
                  </Text>
                  <Text className="text-xs text-allokoli-text-secondary">
                    {assistant.lastCall
                      ? new Date(assistant.lastCall).toLocaleDateString(
                          "fr-FR",
                          { day: "2-digit", month: "2-digit", year: "2-digit" }
                        )
                      : "N/A"}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
