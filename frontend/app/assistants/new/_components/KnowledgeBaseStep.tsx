"use client";

import React, { useState } from "react";
import { Typography, Space, Card, Upload, List, Tag, message } from "antd";
import { motion } from "framer-motion";
import {
  Database,
  FileText,
  Upload as UploadIcon,
  Plus,
  X,
  BookOpen,
  Lightbulb,
} from "lucide-react";
import { AssistantStepProps } from "../../../../components/assistants/AssistantFormTypes";
import { Button as AntButton } from "antd";

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

interface KnowledgeItem {
  id: string;
  name: string;
  type: "file" | "text" | "url";
  content?: string;
  size?: string;
}

const KnowledgeBaseStep: React.FC<AssistantStepProps> = ({ form }) => {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeItem[]>([]);
  const [isAddingText, setIsAddingText] = useState(false);
  const [textContent, setTextContent] = useState("");

  const handleFileUpload = (info: any) => {
    const { file } = info;
    if (file.status === "done") {
      const newItem: KnowledgeItem = {
        id: `file_${Date.now()}`,
        name: file.name,
        type: "file",
        size: `${(file.size / 1024).toFixed(1)} KB`,
      };
      setKnowledgeItems((prev) => [...prev, newItem]);
      message.success(`${file.name} ajouté avec succès`);
    }
  };

  const handleAddText = () => {
    if (!textContent.trim()) {
      message.warning("Veuillez saisir du contenu");
      return;
    }

    const newItem: KnowledgeItem = {
      id: `text_${Date.now()}`,
      name: `Texte personnalisé ${
        knowledgeItems.filter((i) => i.type === "text").length + 1
      }`,
      type: "text",
      content: textContent,
      size: `${textContent.length} caractères`,
    };

    setKnowledgeItems((prev) => [...prev, newItem]);
    setTextContent("");
    setIsAddingText(false);
    message.success("Contenu texte ajouté");
  };

  const handleRemoveItem = (id: string) => {
    setKnowledgeItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "file":
        return "blue";
      case "text":
        return "green";
      case "url":
        return "orange";
      default:
        return "default";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "file":
        return <FileText className="w-4 h-4" />;
      case "text":
        return <BookOpen className="w-4 h-4" />;
      case "url":
        return <Database className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <div className="text-center">
          <Title level={3}>Base de connaissances (optionnel)</Title>
          <Paragraph type="secondary" className="text-lg">
            Enrichissez votre assistant avec des documents, FAQ ou informations
            spécifiques. Cette étape est entièrement optionnelle.
          </Paragraph>
        </div>

        {/* Zone d'upload et actions */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Upload de fichiers */}
          <Card
            title={
              <div className="flex items-center space-x-2">
                <UploadIcon className="w-5 h-5 text-blue-600" />
                <span>Importer des fichiers</span>
              </div>
            }
          >
            <Dragger
              name="files"
              multiple
              action="/api/upload" // À implémenter
              accept=".pdf,.doc,.docx,.txt,.md"
              onChange={handleFileUpload}
              showUploadList={false}
              className="border-2 border-gray-300 border-dashed hover:border-purple-400"
            >
              <div className="p-6 text-center">
                <UploadIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <Paragraph className="!mb-2">
                  Glissez-déposez vos fichiers ici ou{" "}
                  <span className="text-purple-600">
                    cliquez pour parcourir
                  </span>
                </Paragraph>
                <Text type="secondary" className="text-sm">
                  PDF, DOC, TXT, MD (max 10MB)
                </Text>
              </div>
            </Dragger>
          </Card>

          {/* Ajout de texte */}
          <Card
            title={
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-green-600" />
                <span>Ajouter du contenu</span>
              </div>
            }
          >
            {!isAddingText ? (
              <div className="p-6 text-center">
                <Lightbulb className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <Paragraph className="!mb-4">
                  Ajoutez directement du texte, une FAQ ou des informations
                  importantes
                </Paragraph>
                <AntButton
                  type="dashed"
                  icon={<Plus className="w-4 h-4" />}
                  onClick={() => setIsAddingText(true)}
                  block
                >
                  Ajouter du contenu texte
                </AntButton>
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={textContent}
                  onChange={(e) => setTextContent(e.target.value)}
                  placeholder="Tapez votre contenu ici... (ex: FAQ, procédures, informations produits)"
                  className="w-full h-32 p-3 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <div className="flex space-x-2">
                  <AntButton
                    type="primary"
                    onClick={handleAddText}
                    disabled={!textContent.trim()}
                  >
                    Ajouter
                  </AntButton>
                  <AntButton
                    onClick={() => {
                      setIsAddingText(false);
                      setTextContent("");
                    }}
                  >
                    Annuler
                  </AntButton>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Liste des éléments ajoutés */}
        {knowledgeItems.length > 0 && (
          <Card
            title={
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-purple-600" />
                  <span>Contenu ajouté ({knowledgeItems.length})</span>
                </div>
              </div>
            }
          >
            <List
              dataSource={knowledgeItems}
              renderItem={(item) => (
                <List.Item>
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center space-x-3">
                      <div className="text-gray-500">
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <Text strong>{item.name}</Text>
                        {item.size && (
                          <div className="text-sm text-gray-500">
                            {item.size}
                          </div>
                        )}
                      </div>
                      <Tag color={getTypeColor(item.type)}>
                        {item.type.toUpperCase()}
                      </Tag>
                    </div>
                    <AntButton
                      type="text"
                      size="small"
                      icon={<X className="w-4 h-4" />}
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-gray-400 hover:text-red-500"
                    />
                  </div>
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* Information sur la base de connaissances */}
        <Card className="border-purple-200 bg-purple-50">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Lightbulb className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <Paragraph className="!mb-2 font-medium text-purple-800">
                💡 Conseils pour une base de connaissances efficace
              </Paragraph>
              <ul className="space-y-1 text-sm text-purple-600">
                <li>• Ajoutez des FAQ pour les questions courantes</li>
                <li>• Incluez des procédures et guides spécifiques</li>
                <li>• Organisez le contenu par thématiques claires</li>
                <li>• Vous pourrez ajouter plus de contenu après création</li>
              </ul>
            </div>
          </div>
        </Card>
      </Space>
    </motion.div>
  );
};

export default KnowledgeBaseStep;
