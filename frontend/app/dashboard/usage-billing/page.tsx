"use client";

import React from "react";
import {
  Typography,
  Card,
  Table,
  Tag,
  Button,
  Space,
  Row,
  Col,
  Statistic,
  Alert,
} from "antd";
import {
  DownloadOutlined,
  CreditCardOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const invoiceColumns = [
  {
    title: "ID Facture",
    dataIndex: "id",
    key: "id",
    render: (text: string) => (
      <Link href={`/dashboard/usage-billing/invoice/${text}`}>{text}</Link>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Montant",
    dataIndex: "amount",
    key: "amount",
    render: (amount: number) => `${amount.toFixed(2)} €`,
  },
  {
    title: "Statut",
    dataIndex: "status",
    key: "status",
    render: (status: string) => (
      <Tag
        color={
          status === "Payée"
            ? "green"
            : status === "En attente"
            ? "orange"
            : "red"
        }
      >
        {status.toUpperCase()}
      </Tag>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_: any, record: any) => (
      <Button
        icon={<DownloadOutlined />}
        onClick={() => console.log("Download invoice", record.id)}
      >
        Télécharger
      </Button>
    ),
  },
];

const invoiceData = [
  {
    key: "1",
    id: "INV-2024-007",
    date: "2024-07-01",
    amount: 79.99,
    status: "Payée",
  },
  {
    key: "2",
    id: "INV-2024-006",
    date: "2024-06-01",
    amount: 79.99,
    status: "Payée",
  },
  {
    key: "3",
    id: "INV-2024-005",
    date: "2024-05-01",
    amount: 59.99,
    status: "Payée",
  },
];

export default function UsageBillingPage() {
  return (
    <div className="w-full">
      <Title level={2} className="!text-allokoli-text-primary !mb-6">
        Utilisation & Facturation
      </Title>

      <Row gutter={[24, 24]} className="mb-6">
        <Col xs={24} md={8}>
          <Card className="h-full shadow-lg glassmorphism rounded-xl">
            <Statistic
              title="Solde Actuel"
              value={12.5}
              precision={2}
              prefix="€"
              valueStyle={{ color: "#cf1322" }}
            />
            <Paragraph className="!text-allokoli-text-secondary !text-xs mt-2">
              Prochaine facture le 01/08/2024.
            </Paragraph>
            <Button
              type="primary"
              icon={<CreditCardOutlined />}
              className="w-full mt-3"
            >
              Recharger le Compte
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="h-full shadow-lg glassmorphism rounded-xl">
            <Statistic
              title="Utilisation ce mois-ci"
              value={68.75}
              precision={2}
              prefix="€"
              valueStyle={{ color: "#3f8600" }}
            />
            <Paragraph className="!text-allokoli-text-secondary !text-xs mt-2">
              Basé sur votre plan Pro.
            </Paragraph>
            <Button
              type="default"
              icon={<HistoryOutlined />}
              className="w-full mt-3"
            >
              Voir l'historique détaillé
            </Button>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card className="h-full shadow-lg glassmorphism rounded-xl">
            <Title level={5}>Votre Plan Actuel</Title>
            <Paragraph className="!font-semibold text-allokoli-primary text-lg">
              Plan Pro
            </Paragraph>
            <ul className="space-y-1 text-xs list-disc list-inside text-allokoli-text-secondary">
              <li>10,000 minutes d'appel</li>
              <li>Assistants illimités</li>
              <li>Support prioritaire</li>
            </ul>
            <Button type="link" className="p-0 mt-3">
              Gérer l'abonnement
            </Button>
          </Card>
        </Col>
      </Row>

      <Card
        title="Historique des Factures"
        className="shadow-lg glassmorphism rounded-xl"
      >
        <Table
          columns={invoiceColumns}
          dataSource={invoiceData}
          pagination={{ pageSize: 5 }}
        />
      </Card>

      <Alert
        message="Mise à jour des tarifs"
        description="Nos tarifs seront mis à jour à partir du 1er Septembre 2024. Consultez notre page de tarification pour plus de détails."
        type="warning"
        showIcon
        className="mt-6 glassmorphism"
      />
    </div>
  );
}

// Minimal Link component for the table until full routing is set up
const Link: React.FC<React.PropsWithChildren<{ href: string }>> = ({
  href,
  children,
}) => (
  <a
    href={href}
    onClick={(e) => {
      e.preventDefault();
      console.log(`Navigating to ${href}`);
    }}
    style={{ color: "var(--allokoli-primary)" }}
  >
    {children}
  </a>
);
