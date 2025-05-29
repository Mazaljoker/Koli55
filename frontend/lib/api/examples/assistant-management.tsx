/**
 * Exemple d'utilisation du SDK AlloKoli pour la gestion des assistants
 *
 * Ce composant démontre comment utiliser le SDK dans un contexte React
 * avec gestion d'état, erreurs et interface utilisateur.
 */

"use client";

import React, { useState, useEffect } from "react";
import { Card, Form, Input, Select, message, Modal, Table, Space } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import {
  createAlloKoliSDKWithSupabase,
  type Assistant,
  type AssistantCreate,
  type AssistantUpdate,
  AlloKoliAPIError,
} from "../allokoli-sdk";
import { Button } from "@/components/ui/Button";

const { Option } = Select;
const { TextArea } = Input;

// Configuration du SDK (en pratique, ceci serait dans un hook ou contexte)
const sdk = createAlloKoliSDKWithSupabase(
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_ID!
  // Le token sera mis à jour dynamiquement via setAuthToken()
);

interface AssistantManagementProps {
  authToken?: string;
}

export default function AssistantManagement({
  authToken,
}: AssistantManagementProps) {
  // État local
  const [assistants, setAssistants] = useState<Assistant[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );

  // Formulaire Ant Design
  const [form] = Form.useForm();

  // Mettre à jour le token d'authentification
  useEffect(() => {
    if (authToken) {
      sdk.setAuthToken(authToken);
    }
  }, [authToken]);

  // Charger les assistants au montage du composant
  useEffect(() => {
    loadAssistants();
  }, []);

  /**
   * Charge la liste des assistants
   */
  const loadAssistants = async () => {
    try {
      setLoading(true);
      const response = await sdk.listAssistants({ page: 1, limit: 50 });
      setAssistants(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des assistants:", error);
      if (error instanceof AlloKoliAPIError) {
        message.error(`Erreur ${error.status}: ${error.message}`);
      } else {
        message.error("Erreur inconnue lors du chargement");
      }
    } finally {
      setLoading(false);
    }
  };

  /**
   * Ouvre le modal pour créer un nouvel assistant
   */
  const handleCreate = () => {
    setModalMode("create");
    setSelectedAssistant(null);
    form.resetFields();
    // Valeurs par défaut
    form.setFieldsValue({
      language: "fr",
      endCallAfterSilence: true,
      voiceReflection: false,
      silenceTimeoutSeconds: 30,
      maxDurationSeconds: 1800,
      recordingSettings: {
        createRecording: true,
        saveRecording: false,
      },
    });
    setModalVisible(true);
  };

  /**
   * Ouvre le modal pour éditer un assistant
   */
  const handleEdit = (assistant: Assistant) => {
    setModalMode("edit");
    setSelectedAssistant(assistant);
    form.setFieldsValue({
      ...assistant,
      // Gestion des modèles et voix complexes
      model:
        typeof assistant.model === "string"
          ? assistant.model
          : assistant.model.model,
      modelProvider:
        typeof assistant.model === "object"
          ? assistant.model.provider
          : "openai",
      voice:
        typeof assistant.voice === "string"
          ? assistant.voice
          : assistant.voice.voice_id,
      voiceProvider:
        typeof assistant.voice === "object"
          ? assistant.voice.provider
          : "eleven-labs",
    });
    setModalVisible(true);
  };

  /**
   * Ouvre le modal pour voir les détails d'un assistant
   */
  const handleView = (assistant: Assistant) => {
    setModalMode("view");
    setSelectedAssistant(assistant);
    setModalVisible(true);
  };

  /**
   * Supprime un assistant avec confirmation
   */
  const handleDelete = (assistant: Assistant) => {
    Modal.confirm({
      title: "Supprimer l'assistant",
      content: `Êtes-vous sûr de vouloir supprimer l'assistant "${assistant.name}" ?`,
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk: async () => {
        try {
          await sdk.deleteAssistant(assistant.id);
          message.success("Assistant supprimé avec succès");
          loadAssistants(); // Recharger la liste
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          if (error instanceof AlloKoliAPIError) {
            message.error(`Erreur ${error.status}: ${error.message}`);
          } else {
            message.error("Erreur lors de la suppression");
          }
        }
      },
    });
  };

  /**
   * Soumet le formulaire (création ou modification)
   */
  const handleSubmit = async (values: any) => {
    try {
      setSubmitting(true);

      // Préparer les données selon le format attendu par l'API
      const assistantData: AssistantCreate | AssistantUpdate = {
        name: values.name,
        model:
          values.modelProvider && values.modelProvider !== "simple"
            ? {
                provider: values.modelProvider,
                model: values.model,
                temperature: values.temperature,
                maxTokens: values.maxTokens,
              }
            : values.model,
        voice:
          values.voiceProvider && values.voiceProvider !== "simple"
            ? {
                provider: values.voiceProvider,
                voice_id: values.voice,
                speed: values.voiceSpeed,
                stability: values.voiceStability,
              }
            : values.voice,
        language: values.language,
        firstMessage: values.firstMessage,
        instructions: values.instructions,
        silenceTimeoutSeconds: values.silenceTimeoutSeconds,
        maxDurationSeconds: values.maxDurationSeconds,
        endCallAfterSilence: values.endCallAfterSilence,
        voiceReflection: values.voiceReflection,
        recordingSettings: values.recordingSettings,
      };

      if (modalMode === "create") {
        await sdk.createAssistant(assistantData as AssistantCreate);
        message.success("Assistant créé avec succès");
      } else {
        await sdk.updateAssistant(
          selectedAssistant!.id,
          assistantData as AssistantUpdate
        );
        message.success("Assistant mis à jour avec succès");
      }

      setModalVisible(false);
      loadAssistants(); // Recharger la liste
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      if (error instanceof AlloKoliAPIError) {
        message.error(`Erreur ${error.status}: ${error.message}`);
      } else {
        message.error("Erreur lors de la sauvegarde");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Configuration des colonnes du tableau
  const columns = [
    {
      title: "Nom",
      dataIndex: "name",
      key: "name",
      sorter: (a: Assistant, b: Assistant) => a.name.localeCompare(b.name),
    },
    {
      title: "Modèle",
      dataIndex: "model",
      key: "model",
      render: (model: any) =>
        typeof model === "string" ? model : `${model.provider}/${model.model}`,
    },
    {
      title: "Langue",
      dataIndex: "language",
      key: "language",
    },
    {
      title: "Créé le",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString("fr-FR"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, assistant: Assistant) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleView(assistant)}
            size="small"
          >
            Voir
          </Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(assistant)}
            size="small"
          >
            Modifier
          </Button>
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(assistant)}
            danger
            size="small"
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion des Assistants</h1>
        <Button
          variant="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
        >
          Nouvel Assistant
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={assistants}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total: ${total} assistants`,
          }}
        />
      </Card>

      {/* Modal pour créer/éditer/voir un assistant */}
      <Modal
        title={
          modalMode === "create"
            ? "Nouvel Assistant"
            : modalMode === "edit"
            ? "Modifier l'Assistant"
            : "Détails de l'Assistant"
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={
          modalMode === "view"
            ? [
                <Button key="close" onClick={() => setModalVisible(false)}>
                  Fermer
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={() => setModalVisible(false)}>
                  Annuler
                </Button>,
                <Button
                  key="submit"
                  variant="primary"
                  isLoading={submitting}
                  onClick={() => form.submit()}
                >
                  {modalMode === "create" ? "Créer" : "Mettre à jour"}
                </Button>,
              ]
        }
        width={800}
      >
        {modalMode === "view" && selectedAssistant ? (
          // Mode visualisation
          <div className="space-y-4">
            <div>
              <strong>Nom:</strong> {selectedAssistant.name}
            </div>
            <div>
              <strong>ID:</strong> {selectedAssistant.id}
            </div>
            <div>
              <strong>Modèle:</strong>{" "}
              {JSON.stringify(selectedAssistant.model, null, 2)}
            </div>
            <div>
              <strong>Voix:</strong>{" "}
              {JSON.stringify(selectedAssistant.voice, null, 2)}
            </div>
            <div>
              <strong>Langue:</strong> {selectedAssistant.language}
            </div>
            <div>
              <strong>Premier message:</strong> {selectedAssistant.firstMessage}
            </div>
            <div>
              <strong>Instructions:</strong> {selectedAssistant.instructions}
            </div>
            <div>
              <strong>Créé le:</strong>{" "}
              {new Date(selectedAssistant.created_at).toLocaleString("fr-FR")}
            </div>
          </div>
        ) : (
          // Mode création/édition
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              label="Nom de l'assistant"
              rules={[{ required: true, message: "Le nom est requis" }]}
            >
              <Input placeholder="Mon Assistant IA" />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="modelProvider" label="Fournisseur de modèle">
                <Select placeholder="Sélectionner un fournisseur">
                  <Option value="openai">OpenAI</Option>
                  <Option value="anthropic">Anthropic</Option>
                  <Option value="groq">Groq</Option>
                  <Option value="azure-openai">Azure OpenAI</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="model"
                label="Modèle"
                rules={[{ required: true, message: "Le modèle est requis" }]}
              >
                <Input placeholder="gpt-4" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item name="voiceProvider" label="Fournisseur de voix">
                <Select placeholder="Sélectionner un fournisseur">
                  <Option value="eleven-labs">Eleven Labs</Option>
                  <Option value="azure">Azure</Option>
                  <Option value="playht">PlayHT</Option>
                  <Option value="deepgram">Deepgram</Option>
                  <Option value="openai">OpenAI</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="voice"
                label="ID de la voix"
                rules={[{ required: true, message: "La voix est requise" }]}
              >
                <Input placeholder="voice-id-here" />
              </Form.Item>
            </div>

            <Form.Item name="language" label="Langue">
              <Select>
                <Option value="fr">Français</Option>
                <Option value="en">Anglais</Option>
                <Option value="es">Espagnol</Option>
                <Option value="de">Allemand</Option>
              </Select>
            </Form.Item>

            <Form.Item name="firstMessage" label="Premier message">
              <TextArea
                rows={2}
                placeholder="Bonjour ! Comment puis-je vous aider aujourd'hui ?"
              />
            </Form.Item>

            <Form.Item name="instructions" label="Instructions système">
              <TextArea
                rows={4}
                placeholder="Tu es un assistant utile et bienveillant..."
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="silenceTimeoutSeconds"
                label="Timeout de silence (secondes)"
              >
                <Input type="number" min={1} max={600} />
              </Form.Item>

              <Form.Item
                name="maxDurationSeconds"
                label="Durée maximale (secondes)"
              >
                <Input type="number" min={10} max={3600} />
              </Form.Item>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  );
}
