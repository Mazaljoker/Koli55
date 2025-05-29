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
  Table,
  Space,
  Modal,
  Form,
  Select,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  PhoneOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  SettingOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import Link from "next/link";

const { Title, Paragraph, Text } = Typography;
const { confirm } = Modal;

// Sample data - replace with actual data fetching
const phoneNumbersData = [
  {
    id: "pn-1",
    number: "+33 1 23 45 67 89",
    region: "France",
    status: "active",
    assignedAssistant: "Assistant Commercial Proactif",
    assistantId: "1",
    capabilities: ["Voix", "SMS"],
    lastActivity: "2024-07-28T15:00:00Z",
  },
  {
    id: "pn-2",
    number: "+33 9 87 65 43 21",
    region: "France",
    status: "inactive",
    assignedAssistant: null,
    assistantId: null,
    capabilities: ["Voix"],
    lastActivity: "2024-07-20T10:00:00Z",
  },
  {
    id: "pn-3",
    number: "+1 415 555 0100",
    region: "USA",
    status: "active",
    assignedAssistant: "Support Client Nuit",
    assistantId: "2",
    capabilities: ["Voix", "SMS", "MMS"],
    lastActivity: "2024-07-29T08:30:00Z",
  },
];

const assistantsSample = [
  { id: "1", name: "Assistant Commercial Proactif" },
  { id: "2", name: "Support Client Nuit" },
  { id: "3", name: "Assistant de Démonstration Produit" },
];

export default function PhoneNumbersPage() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingNumber, setEditingNumber] = React.useState<any>(null);
  const [form] = Form.useForm();

  const showAssignModal = (record?: any) => {
    setEditingNumber(record);
    form.setFieldsValue(
      record ? { assistantId: record.assistantId } : { assistantId: null }
    );
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        console.log(
          "Assigning assistant:",
          values.assistantId,
          "to number:",
          editingNumber?.id
        );
        // API call to assign assistant
        setIsModalOpen(false);
        setEditingNumber(null);
        // Refresh data or update state
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingNumber(null);
  };

  const showDeleteConfirm = (record: any) => {
    confirm({
      title: `Supprimer le numéro ${record.number}?`,
      icon: <ExclamationCircleFilled />,
      content:
        "Cette action est irréversible. Le numéro sera désactivé et ne pourra plus recevoir d'appels.",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk() {
        console.log("Deleting number", record.id);
        // API call to delete number
      },
    });
  };

  const columns = [
    {
      title: "Numéro",
      dataIndex: "number",
      key: "number",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Région",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Assistant Assigné",
      dataIndex: "assignedAssistant",
      key: "assignedAssistant",
      render: (text: string, record: any) =>
        text ? (
          <Link href={`/assistants/${record.assistantId}`}>{text}</Link>
        ) : (
          <Text type="secondary">Non assigné</Text>
        ),
    },
    {
      title: "Capacités",
      dataIndex: "capabilities",
      key: "capabilities",
      render: (capabilities: string[]) => (
        <>
          {capabilities.map((cap) => (
            <Tag key={cap} color="blue">
              {cap}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Statut",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Actif" : "Inactif"}
        </Tag>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Assigner un Assistant">
            <Button
              icon={<LinkOutlined />}
              onClick={() => showAssignModal(record)}
            />
          </Tooltip>
          <Tooltip title="Paramètres (Bientôt)">
            <Button icon={<SettingOutlined />} disabled />
          </Tooltip>
          <Tooltip title="Supprimer">
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => showDeleteConfirm(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex flex-col items-start justify-between mb-8 sm:flex-row sm:items-center">
        <div>
          <Title level={2} className="!text-allokoli-text-primary !mb-1">
            Numéros de Téléphone
          </Title>
          <Paragraph className="!text-allokoli-text-secondary">
            Gérez vos numéros et assignez-les à vos assistants IA.
          </Paragraph>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          className="mt-4 sm:mt-0"
          onClick={() =>
            Modal.info({
              title: "Acheter un numéro",
              content: "Cette fonctionnalité sera bientôt disponible.",
            })
          }
        >
          Acheter un Numéro
        </Button>
      </div>

      <Input
        placeholder="Rechercher un numéro ou un assistant..."
        prefix={<SearchOutlined className="text-gray-400" />}
        className="mb-6"
        size="large"
      />

      <Card className="shadow-lg glassmorphism rounded-xl">
        {phoneNumbersData.length === 0 ? (
          <Empty
            image={<PhoneOutlined className="text-6xl text-gray-400" />}
            imageStyle={{ height: 80 }}
            description={
              <Space direction="vertical" size="small">
                <Title level={4} className="!text-allokoli-text-secondary">
                  Aucun numéro de téléphone configuré.
                </Title>
                <Paragraph className="!text-allokoli-text-tertiary">
                  Achetez votre premier numéro pour commencer à recevoir des
                  appels.
                </Paragraph>
              </Space>
            }
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() =>
                Modal.info({
                  title: "Acheter un numéro",
                  content: "Cette fonctionnalité sera bientôt disponible.",
                })
              }
            >
              Acheter un Numéro
            </Button>
          </Empty>
        ) : (
          <Table
            columns={columns}
            dataSource={phoneNumbersData}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        )}
      </Card>

      <Modal
        title={
          editingNumber
            ? `Assigner un assistant à ${editingNumber.number}`
            : "Assigner un Assistant"
        }
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Assigner"
        cancelText="Annuler"
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="assignAssistantForm">
          <Form.Item
            name="assistantId"
            label="Sélectionner un Assistant"
            rules={[
              {
                required: true,
                message: "Veuillez sélectionner un assistant!",
              },
            ]}
          >
            <Select placeholder="Choisir un assistant">
              {assistantsSample.map((assistant) => (
                <Select.Option key={assistant.id} value={assistant.id}>
                  {assistant.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
