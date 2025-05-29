"use client";

import React from "react";
import {
  Typography,
  Button,
  Empty,
  Card,
  Row,
  Col,
  Tag,
  Input,
  Space,
} from "antd";
import {
  PlusOutlined,
  BookOutlined,
  FileTextOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;

// Sample data - replace with actual data fetching
const knowledgeBasesData = [
  {
    id: "kb-1",
    name: "FAQ Produit Alpha",
    description:
      "Contient toutes les questions fréquemment posées sur le produit Alpha.",
    itemCount: 150,
    lastUpdated: "2024-07-25T14:00:00Z",
    type: "FAQ",
    status: "active",
  },
  {
    id: "kb-2",
    name: "Documentation Technique API V2",
    description: "Spécifications complètes et guides pour l'API V2.",
    itemCount: 85,
    lastUpdated: "2024-07-28T09:30:00Z",
    type: "Docs",
    status: "active",
  },
  {
    id: "kb-3",
    name: "Scripts de Vente Téléphonique",
    description: "Argumentaires et réponses types pour l'équipe commerciale.",
    itemCount: 40,
    lastUpdated: "2024-06-10T11:00:00Z",
    type: "Scripts",
    status: "archived",
  },
];

export default function KnowledgeBasesPage() {
  // const [searchTerm, setSearchTerm] = useState("");
  // const filteredData = knowledgeBasesData.filter(kb => kb.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <Title level={2} className="!text-allokoli-text-primary !mb-1">
            Bases de Connaissances
          </Title>
          <Paragraph className="!text-allokoli-text-secondary">
            Gérez les sources d'information pour vos assistants IA.
          </Paragraph>
        </div>
        <Space className="mt-4 sm:mt-0">
          <Button type="default" icon={<UploadOutlined />} size="large">
            Importer des Fichiers
          </Button>
          <Link href="/dashboard/knowledge-bases/new">
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Nouvelle Base
            </Button>
          </Link>
        </Space>
      </div>

      <Input
        placeholder="Rechercher une base de connaissances..."
        prefix={<SearchOutlined className="text-gray-400" />}
        // onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-6"
        size="large"
      />

      {knowledgeBasesData.length === 0 ? (
        <Card className="glassmorphism shadow-lg rounded-xl">
          <Empty
            image={<BookOutlined className="text-6xl text-gray-400" />}
            imageStyle={{ height: 80 }}
            description={
              <Space direction="vertical" size="small">
                <Title level={4} className="!text-allokoli-text-secondary">
                  Aucune base de connaissances trouvée.
                </Title>
                <Paragraph className="!text-allokoli-text-tertiary">
                  Commencez par créer votre première base de connaissances pour
                  alimenter vos assistants.
                </Paragraph>
              </Space>
            }
          >
            <Link href="/dashboard/knowledge-bases/new">
              <Button type="primary" icon={<PlusOutlined />}>
                Créer une Base de Connaissances
              </Button>
            </Link>
          </Empty>
        </Card>
      ) : (
        <Row gutter={[24, 24]}>
          {knowledgeBasesData.map((kb) => (
            <Col key={kb.id} xs={24} md={12} lg={8}>
              <Card
                hoverable
                className="glassmorphism shadow-lg rounded-xl h-full flex flex-col"
                title={
                  <Space>
                    <FileTextOutlined className="text-allokoli-primary" />{" "}
                    <Link
                      href={`/dashboard/knowledge-bases/${kb.id}`}
                      className="text-allokoli-text-primary hover:text-allokoli-primary"
                    >
                      {kb.name}
                    </Link>
                  </Space>
                }
                extra={
                  <Tag color={kb.status === "active" ? "cyan" : "gold"}>
                    {kb.status === "active" ? "Active" : "Archivée"}
                  </Tag>
                }
              >
                <Paragraph
                  type="secondary"
                  ellipsis={{ rows: 2 }}
                  className="!text-sm !mb-3 flex-grow"
                >
                  {kb.description}
                </Paragraph>
                <div className="text-xs text-allokoli-text-tertiary space-y-1">
                  <div>
                    <Text strong>Type:</Text> {kb.type}
                  </div>
                  <div>
                    <Text strong>Éléments:</Text> {kb.itemCount}
                  </div>
                  <div>
                    <Text strong>Dernière MàJ:</Text>{" "}
                    {new Date(kb.lastUpdated).toLocaleDateString("fr-FR")}
                  </div>
                </div>
                <Space className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 w-full justify-end">
                  <Button type="link" size="small">
                    Gérer
                  </Button>
                  <Button type="link" size="small" danger>
                    Supprimer
                  </Button>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
