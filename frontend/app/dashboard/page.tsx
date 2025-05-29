"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Typography,
  Row,
  Col,
  Card,
  Space,
  ConfigProvider,
  message,
} from "antd";
import {
  PlusCircle,
  Phone,
  Database,
  ChevronRight,
  Sparkles,
  Play,
} from "lucide-react";
import {
  UserOutlined,
  AudioOutlined,
  MessageOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import { MetricCard } from "@/components/ui/cards/MetricCard";
import { ChartPlaceholder } from "@/components/dashboard/ChartPlaceholder";

// Migration vers le SDK AlloKoli
import { useAlloKoliSDKWithAuth } from "../../lib/hooks/useAlloKoliSDK";
import { Assistant } from "../../lib/api/allokoli-sdk";
import { Button } from "@/components/ui/Button";

const { Title, Text, Paragraph } = Typography;

// Personnalisation du thème
const theme = {
  token: {
    colorPrimary: "#7745FF",
    colorSuccess: "#52c41a",
    colorError: "#FF6B6B",
    colorInfo: "#3ABFF8",
    colorWarning: "#faad14",
    colorTextBase: "#22223B",
    colorBgBase: "#ffffff",
    colorBorder: "#F0EDFF",
    borderRadius: 8,
  },
};

export default function DashboardPage() {
  const sdk = useAlloKoliSDKWithAuth();
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les assistants via le SDK
  useEffect(() => {
    fetchAssistants();
  }, []);

  const fetchAssistants = async () => {
    try {
      setLoading(true);
      setError(null);

      // Utiliser le SDK pour récupérer les assistants
      const response = await sdk.listAssistants({ limit: 10 });
      setAssistants(response.data);
    } catch (err: unknown) {
      console.error("Erreur lors du chargement des assistants:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");

      // Fallback avec des données mock en développement
      if (process.env.NODE_ENV === "development") {
        setAssistants([
          {
            id: "demo-1",
            name: "Assistant Service Client",
            model: { provider: "openai", model: "gpt-4o" },
            voice: {
              provider: "elevenlabs",
              voice_id: "allokoli-elevenlabs-voice-1",
            },
            language: "fr-FR",
            created_at: "2023-10-15T10:00:00Z",
            updated_at: "2023-10-15T10:00:00Z",
            firstMessage: "Bonjour, comment puis-je vous aider ?",
            instructions: "Vous êtes un assistant service client.",
          },
          {
            id: "demo-2",
            name: "Support Technique",
            model: { provider: "anthropic", model: "claude-3-opus" },
            voice: {
              provider: "elevenlabs",
              voice_id: "allokoli-elevenlabs-voice-2",
            },
            language: "fr-FR",
            created_at: "2023-11-20T10:00:00Z",
            updated_at: "2023-11-20T10:00:00Z",
            firstMessage: "Bonjour, je suis votre assistant technique.",
            instructions: "Vous êtes un assistant de support technique.",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Ces fonctions sont conservées pour utilisation future  // const handleDeleteAssistant = async (assistantId: string, assistantName: string) => {  //   try {  //     await sdk.deleteAssistant(assistantId);  //     message.success(`Assistant "${assistantName}" supprimé avec succès`);  //       //     // Actualiser la liste  //     setAssistants(prev => prev.filter(a => a.id !== assistantId));  //       //   } catch (err) {  //     console.error('Erreur lors de la suppression:', err);  //     message.error('Erreur lors de la suppression de l\'assistant');  //   }  // };  // const formatDate = (dateString: string) => {  //   return new Date(dateString).toLocaleDateString('fr-FR');  // };

  // Déterminer le statut d'un assistant
  const getAssistantStatus = (
    assistant: Assistant
  ): { status: string; color: string } => {
    if (!assistant.model || !assistant.language) {
      return { status: "draft", color: "#3ABFF8" };
    }

    if (assistant.metadata && "error" in assistant.metadata) {
      return { status: "error", color: "#FF6B6B" };
    }

    return { status: "active", color: "#4F3FF0" };
  };

  // Obtenir le modèle sous forme de string
  const getModelString = (model: Assistant["model"]): string => {
    if (typeof model === "string") return model;
    return model?.model || "Non défini";
  };

  // Colonnes du tableau des assistants
  const columns = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Assistant) => (
        <Link href={`/assistants/${record.id}`} style={{ color: "#22223B" }}>
          {text}
        </Link>
      ),
    },
    {
      title: "Modèle",
      dataIndex: "model",
      key: "model",
      render: (model: Assistant["model"]) => getModelString(model),
    },
    {
      title: "Statut",
      key: "status",
      render: (_: unknown, record: Assistant) => {
        const { status, color } = getAssistantStatus(record);
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Dernière activité",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (date: string) => {
        const now = new Date();
        const updatedAt = new Date(date);
        const diffInHours = Math.floor(
          (now.getTime() - updatedAt.getTime()) / (1000 * 60 * 60)
        );

        if (diffInHours < 1) return "Maintenant";
        if (diffInHours < 24) return `${diffInHours}h`;
        return `${Math.floor(diffInHours / 24)}j`;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Assistant) => (
        <Space>
          <Link href={`/assistants/${record.id}`}>
            <Button type="text" style={{ color: "#4F3FF0" }}>
              Gérer
            </Button>
          </Link>
          <Button
            type="text"
            style={{ color: "#4F3FF0" }}
            onClick={() => message.info("Simulation à venir")}
          >
            Simuler
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ConfigProvider theme={theme}>
      <Space direction="vertical" size={32} style={{ width: "100%" }}>
        {/* Titre du Dashboard */}
        <div>
          <Title level={3} style={{ color: "#22223B", margin: 0 }}>
            Tableau de bord
          </Title>
          <Text type="secondary" style={{ color: "#8586A5" }}>
            Bienvenue sur votre tableau de bord AlloKoli
          </Text>
        </div>

        {/* Grid Layout principal */}
        <Row gutter={[24, 24]}>
          {/* Partie gauche (2/3 sur desktop) */}
          <Col xs={24} lg={16}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              {/* Wizard Card - Carte principale avec fond glassmorphism */}
              <Card
                style={{
                  background: "rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                  border: "1px solid rgba(182, 163, 255, 0.25)",
                  borderRadius: 16,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to bottom right, #8F6FFF, #4F3FF0)",
                    opacity: 0.05,
                    zIndex: 0,
                  }}
                ></div>

                <div style={{ position: "relative", zIndex: 1 }}>
                  <Space align="center" style={{ marginBottom: 16 }}>
                    <Sparkles style={{ color: "#8F6FFF" }} size={20} />
                    <Title level={4} style={{ margin: 0 }}>
                      Assistant Wizard
                    </Title>
                  </Space>

                  <Paragraph style={{ color: "#8586A5", marginBottom: 24 }}>
                    Configurez rapidement un nouvel assistant pour votre équipe
                  </Paragraph>

                  <Card
                    style={{
                      marginBottom: 24,
                      background: "#ffffff",
                      border: "1px solid #F0EDFF",
                    }}
                  >
                    <Title level={5} style={{ marginBottom: 8 }}>
                      1. Sélectionnez un modèle
                    </Title>
                    <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
                      <Col span={12}>
                        <Button
                          style={{
                            width: "100%",
                            height: "auto",
                            padding: 12,
                            border: "1px solid #B6A3FF",
                            borderRadius: 8,
                            color: "#4F3FF0",
                            background: "#F7F8FF",
                          }}
                        >
                          Service Client
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          style={{
                            width: "100%",
                            height: "auto",
                            padding: 12,
                            border: "1px solid #B6A3FF",
                            borderRadius: 8,
                            color: "#4F3FF0",
                            background: "#F7F8FF",
                          }}
                        >
                          Commercial
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          style={{
                            width: "100%",
                            height: "auto",
                            padding: 12,
                            border: "1px solid #B6A3FF",
                            borderRadius: 8,
                            color: "#4F3FF0",
                            background: "#F7F8FF",
                          }}
                        >
                          Support Technique
                        </Button>
                      </Col>
                      <Col span={12}>
                        <Button
                          style={{
                            width: "100%",
                            height: "auto",
                            padding: 12,
                            border: "1px solid #B6A3FF",
                            borderRadius: 8,
                            color: "#4F3FF0",
                            background: "#F7F8FF",
                          }}
                        >
                          Sur mesure
                        </Button>
                      </Col>
                    </Row>
                  </Card>

                  <Space>
                    <Link href="/assistants/new">
                      <Button
                        type="primary"
                        icon={<Play size={16} />}
                        style={{
                          background:
                            "linear-gradient(135deg, #8F6FFF 0%, #4F3FF0 100%)",
                          border: "none",
                          borderRadius: 8,
                          height: 40,
                          fontWeight: 600,
                        }}
                      >
                        Commencer le wizard
                      </Button>
                    </Link>
                    <Text style={{ color: "#8586A5" }}>ou</Text>
                    <Link href="/dashboard/assistants">
                      <Button style={{ color: "#4F3FF0" }}>
                        Voir tous les assistants
                      </Button>
                    </Link>
                  </Space>
                </div>
              </Card>

              {/* Section Assistants récents */}
              <Card title="Assistants récents" style={{ borderRadius: 12 }}>
                {error && !assistants.length ? (
                  <Text type="secondary">
                    Erreur lors du chargement : {error}
                  </Text>
                ) : (
                  <Table
                    dataSource={assistants.slice(0, 5)}
                    columns={columns}
                    pagination={false}
                    loading={loading}
                    rowKey="id"
                    size="middle"
                  />
                )}
                {assistants.length > 5 && (
                  <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Link href="/dashboard/assistants">
                      <Button type="link">
                        Voir tous les assistants <ChevronRight size={14} />
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            </Space>
          </Col>

          {/* Partie droite (1/3 sur desktop) */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size={24} style={{ width: "100%" }}>
              {/* Statistiques rapides */}
              <Card title="Vue d'ensemble" style={{ borderRadius: 12 }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Assistants actifs</span>
                    <Text strong>
                      {
                        assistants.filter(
                          (a) => getAssistantStatus(a).status === "active"
                        ).length
                      }
                    </Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Total assistants</span>
                    <Text strong>{assistants.length}</Text>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span>Brouillons</span>
                    <Text strong>
                      {
                        assistants.filter(
                          (a) => getAssistantStatus(a).status === "draft"
                        ).length
                      }
                    </Text>
                  </div>
                </Space>
              </Card>

              {/* Actions rapides */}
              <Card title="Actions rapides" style={{ borderRadius: 12 }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Link href="/assistants/new">
                    <Button
                      type="primary"
                      icon={<PlusCircle size={16} />}
                      block
                      style={{ borderRadius: 8 }}
                    >
                      Nouvel assistant
                    </Button>
                  </Link>
                  <Link href="/dashboard/knowledge-bases">
                    <Button
                      icon={<Database size={16} />}
                      block
                      style={{ borderRadius: 8 }}
                    >
                      Bases de connaissances
                    </Button>
                  </Link>
                  <Link href="/dashboard/phone-numbers">
                    <Button
                      icon={<Phone size={16} />}
                      block
                      style={{ borderRadius: 8 }}
                    >
                      Numéros de téléphone
                    </Button>
                  </Link>
                </Space>
              </Card>

              {/* Guide de démarrage */}
              <Card title="Démarrage rapide" style={{ borderRadius: 12 }}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div>
                    <Text strong>1. Créez votre premier assistant</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Utilisez le wizard pour configurer rapidement
                    </Text>
                  </div>
                  <div>
                    <Text strong>2. Ajoutez une base de connaissances</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Enrichissez votre assistant avec vos données
                    </Text>
                  </div>
                  <div>
                    <Text strong>3. Configurez un numéro</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Rendez votre assistant accessible par téléphone
                    </Text>
                  </div>
                </Space>
              </Card>
            </Space>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Assistants Actifs"
              value="5"
              percentageChange={10}
              icon={<UserOutlined />}
              bgColorClass="bg-gradient-to-br from-allokoli-primary via-allokoli-secondary to-allokoli-accent"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Appels du Mois"
              value="1,230"
              percentageChange={-5}
              icon={<AudioOutlined />}
              bgColorClass="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Messages Traités"
              value="8,750"
              percentageChange={22}
              icon={<MessageOutlined />}
              bgColorClass="bg-gradient-to-br from-green-400 via-cyan-500 to-blue-500"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <MetricCard
              title="Taux de Satisfaction"
              value="92%"
              icon={<RiseOutlined />}
              bgColorClass="bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500"
            />
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={12}>
            <ChartPlaceholder
              title="Volume d'Appels sur 30 jours"
              description="Tendances des appels entrants et sortants."
            />
          </Col>
          <Col xs={24} lg={12}>
            <ChartPlaceholder
              title="Performance des Assistants"
              description="Répartition par assistant et satisfaction client."
              aspectRatio="16/9"
            />
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <ChartPlaceholder
              title="Activité Récente"
              description="Journal des derniers appels et interactions."
              aspectRatio="16/6"
            />
          </Col>
          <Col xs={24} lg={8}>
            <ChartPlaceholder
              title="Répartition des Sujets"
              description="Principaux sujets abordés."
              aspectRatio="16/6"
            />
          </Col>
        </Row>
      </Space>
    </ConfigProvider>
  );
}
