'use client';

import React from 'react';
import VapiFormBuilder from './vapi-form-builder';
import { Card, Alert, Typography, Steps, Space } from 'antd';
import { useState } from 'react';
import { CloudUploadOutlined, DatabaseOutlined, SettingOutlined } from '@ant-design/icons';
import { Button } from "@/components/ui/Button";

const { Title } = Typography;
const { Step } = Steps;

// Schéma JSON pour une base de connaissances Vapi
const knowledgeBaseSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      description: 'Nom de la base de connaissances'
    },
    description: {
      type: 'string',
      description: 'Description de la base de connaissances'
    },
    model: {
      type: 'object',
      properties: {
        provider: {
          type: 'string',
          enum: ['openai', 'cohere'],
          description: 'Fournisseur du modèle d\'embedding'
        },
        model: {
          type: 'string',
          enum: ['text-embedding-3-small', 'text-embedding-3-large', 'embed-english-v3.0', 'embed-multilingual-v3.0'],
          description: 'Modèle d\'embedding à utiliser'
        },
        dimensions: {
          type: 'number',
          description: 'Dimensions des embeddings (laissez vide pour utiliser la valeur par défaut du modèle)'
        }
      },
      required: ['provider', 'model']
    },
    metadata: {
      type: 'object',
      properties: {},
      description: 'Métadonnées personnalisées (optionnel)'
    }
  },
  required: ['name', 'model']
};

// Schéma pour le formulaire de téléchargement de fichier
const fileUploadSchema = {
  type: 'object',
  properties: {
    file_purpose: {
      type: 'string',
      enum: ['knowledge-bases'],
      default: 'knowledge-bases',
      description: 'Objectif du fichier'
    }
  }
};

// Schéma pour les paramètres de requête
const querySettingsSchema = {
  type: 'object',
  properties: {
    top_k: {
      type: 'number',
      description: 'Nombre de résultats à retourner',
      default: 5
    },
    similarity_threshold: {
      type: 'number',
      description: 'Seuil de similarité (0-1)',
      default: 0.7
    }
  }
};

interface VapiKnowledgeBaseFormProps {
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void;
  onFileUpload?: (file: File) => Promise<void>;
  loading?: boolean;
}

const VapiKnowledgeBaseForm: React.FC<VapiKnowledgeBaseFormProps> = ({
  initialValues = {},
  onSubmit,
  onFileUpload,
  loading = false
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, unknown>>(initialValues);

  const handleBaseInfoSubmit = (values: Record<string, unknown>) => {
    setFormData({...formData, ...values});
    setCurrentStep(1);
  };

  const handleFileUploadSubmit = (values: Record<string, unknown>) => {
    setFormData({...formData, files: values});
    // Si la fonction onFileUpload est fournie et qu'un fichier est disponible dans le formulaire
    if (onFileUpload && formData.fileInstance) {
      // Appeler la fonction de téléchargement avec le fichier
      onFileUpload(formData.fileInstance as File)
        .then(() => {
          // Passer à l'étape suivante après le téléchargement
          setCurrentStep(2);
        })
        .catch(error => {
          console.error("Erreur lors du téléchargement du fichier:", error);
          // Gérer l'erreur si nécessaire
        });
    } else {
      // Si pas de fonction de téléchargement ou pas de fichier, simplement passer à l'étape suivante
      setCurrentStep(2);
    }
  };

  const handleQuerySettingsSubmit = (values: Record<string, unknown>) => {
    const finalData = {...formData, querySettings: values};
    setFormData(finalData);
    // Soumettre le formulaire complet
    onSubmit(finalData);
  };

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1);
  };
  
  const handleFileChange = (file: File) => {
    // Stocker le fichier dans formData pour qu'il soit disponible lors de la soumission
    setFormData({...formData, fileInstance: file});
  };

  const steps = [
    {
      title: 'Informations de base',
      icon: <DatabaseOutlined />,
      content: (
        <VapiFormBuilder 
          schema={knowledgeBaseSchema} 
          initialValues={formData} 
          onSubmit={handleBaseInfoSubmit}
          loading={loading}
          submitButtonText="Suivant"
        />
      )
    },
    {
      title: 'Ajouter des fichiers',
      icon: <CloudUploadOutlined />,
      content: (
        <Card>
          <Alert
            message="Ajout de fichiers"
            description="Téléchargez les fichiers qui seront utilisés pour alimenter votre base de connaissances. Formats pris en charge : PDF, DOCX, TXT, CSV, JSON."
            type="info"
            showIcon
            style={{ marginBottom: '20px' }}
          />
          
          {onFileUpload ? (
            <div style={{ marginBottom: '20px' }}>
              <label htmlFor="file-upload" style={{ display: 'block', marginBottom: '8px' }}>
                Sélectionner un fichier à télécharger:
              </label>
              <input 
                id="file-upload"
                type="file" 
                onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
                accept=".pdf,.docx,.txt,.csv,.json"
                aria-describedby="file-upload-help"
              />
              <p id="file-upload-help" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                Formats acceptés: PDF, DOCX, TXT, CSV, JSON
              </p>
            </div>
          ) : null}
          
          <VapiFormBuilder 
            schema={fileUploadSchema}
            initialValues={{file_purpose: 'knowledge-bases'}}
            onSubmit={handleFileUploadSubmit}
            loading={loading}
            submitButtonText="Suivant"
          />
          
          <Space style={{ marginTop: '16px' }}>
            <Button onClick={handlePrevious}>Précédent</Button>
          </Space>
        </Card>
      )
    },
    {
      title: 'Paramètres de requête',
      icon: <SettingOutlined />,
      content: (
        <Card>
          <Alert
            message="Paramètres de requête"
            description="Configurez les paramètres utilisés lors de l'interrogation de votre base de connaissances."
            type="info"
            showIcon
            style={{ marginBottom: '20px' }}
          />
          
          <VapiFormBuilder 
            schema={querySettingsSchema}
            initialValues={formData.querySettings as Record<string, unknown> || {top_k: 5, similarity_threshold: 0.7}}
            onSubmit={handleQuerySettingsSubmit}
            loading={loading}
            submitButtonText="Terminer"
          />
          
          <Space style={{ marginTop: '16px' }}>
            <Button onClick={handlePrevious}>Précédent</Button>
          </Space>
        </Card>
      )
    }
  ];

  return (
    <div>
      <Title level={3}>Configuration de la Base de Connaissances</Title>
      
      <Alert 
        message="Création d'une base de connaissances Vapi" 
        description="Suivez les étapes pour configurer votre base de connaissances. Vous pourrez y ajouter des documents qui seront utilisés pour enrichir les réponses de vos assistants." 
        type="info" 
        showIcon 
        style={{ marginBottom: '20px' }}
      />
      
      <Steps current={currentStep} style={{ marginBottom: '24px' }}>
        {steps.map(item => (
          <Step key={item.title} title={item.title} icon={item.icon} />
        ))}
      </Steps>
      
      <div>{steps[currentStep].content}</div>
    </div>
  );
};

export default VapiKnowledgeBaseForm; 