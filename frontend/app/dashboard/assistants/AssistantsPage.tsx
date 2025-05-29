'use client';

import { Table, Space, Tag, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Migration vers le SDK AlloKoli
import { useAlloKoliSDKWithAuth } from '../../../lib/hooks/useAlloKoliSDK';
import { Assistant } from '../../../lib/api/allokoli-sdk';
import { Button } from "@/components/ui/Button";

export default function AssistantsPage() {
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
      const response = await sdk.listAssistants();
      setAssistants(response.data);
      
    } catch (err: unknown) {
      console.error('Erreur lors du chargement des assistants:', err);
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      
      // Fallback avec des données mock en développement
      if (process.env.NODE_ENV === 'development') {
        setAssistants([
          {
            id: 'demo-1',
            name: 'Assistant Service Client',
            model: 'gpt-4o',
            voice: 'jennifer',
            language: 'fr-FR',
            created_at: '2023-10-15T10:00:00Z',
            updated_at: '2023-10-15T10:00:00Z',
            firstMessage: 'Bonjour, comment puis-je vous aider ?',
            instructions: 'Vous êtes un assistant service client.',
          },
          {
            id: 'demo-2',
            name: 'Assistant Support Technique',
            model: 'claude-3-opus',
            voice: 'jennifer',
            language: 'fr-FR',
            created_at: '2023-11-20T10:00:00Z',
            updated_at: '2023-11-20T10:00:00Z',
            firstMessage: 'Bonjour, je suis votre assistant technique.',
            instructions: 'Vous êtes un assistant de support technique.',
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un assistant
  const handleDeleteAssistant = async (assistantId: string, assistantName: string) => {
    try {
      await sdk.deleteAssistant(assistantId);
      message.success(`Assistant "${assistantName}" supprimé avec succès`);
      
      // Actualiser la liste
      setAssistants(prev => prev.filter(a => a.id !== assistantId));
      
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      message.error('Erreur lors de la suppression de l\'assistant');
    }
  };

  // Confirmer la suppression
  const confirmDelete = (assistant: Assistant) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'assistant "${assistant.name}" ? Cette action est irréversible.`)) {
      handleDeleteAssistant(assistant.id, assistant.name);
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Déterminer le statut d'un assistant
  const getAssistantStatus = (assistant: Assistant): 'active' | 'draft' => {
    if (!assistant.model || !assistant.language) {
      return 'draft';
    }
    return 'active';
  };

  const columns = [
    {
      title: 'Nom',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Assistant) => (
        <Link href={`/assistants/${record.id}`} className="text-allokoli-purple-700 hover:text-allokoli-purple-900">
          {text}
        </Link>
      ),
    },
    {
      title: 'Modèle',
      dataIndex: 'model',
      key: 'model',
      render: (model: string | { model?: string }) => {
        return typeof model === 'string' ? model : model?.model || 'Non spécifié';
      },
    },
    {
      title: 'Langue',
      dataIndex: 'language',
      key: 'language',
    },
    {
      title: 'Date de création',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Statut',
      key: 'status',
      render: (_: unknown, record: Assistant) => {
        const status = getAssistantStatus(record);
        const color = status === 'active' ? 'green' : 'geekblue';
        const bgClass = status === 'active' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
        
        return (
          <>
            <Tag color={color} className="hidden md:inline-flex">{status.toUpperCase()}</Tag>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold md:hidden ${bgClass}`}>
              {status.toUpperCase()}
            </span>
          </>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Assistant) => (
        <Space size="small">
          <Link href={`/assistants/${record.id}/edit`}>
            <Button 
              icon={<EditOutlined />} 
              size="small" 
              variant="ghost"
              className="text-allokoli-blue-600 hover:text-allokoli-blue-800"
            >
              Modifier
            </Button>
          </Link>
          <Button 
            icon={<DeleteOutlined />} 
            size="small" 
            variant="ghost" 
            danger
            onClick={() => confirmDelete(record)}
          >
            Supprimer
          </Button>
        </Space>
      ),
    },
  ];

  if (error && assistants.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Erreur de chargement</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button variant="primary" onClick={fetchAssistants}>
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-allokoli-purple-800">Mes Assistants</h1>
          <p className="text-allokoli-blue-700 mt-2">Créez et gérez vos assistants IA conversationnels</p>
        </div>
        <Link href="/assistants/new">
          <Button 
            variant="primary" 
            icon={<PlusOutlined />}
            className="bg-gradient-to-r from-allokoli-purple-600 to-allokoli-purple-700 border-none shadow-md hover:shadow-lg"
          >
            Nouvel Assistant
          </Button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table 
          columns={columns} 
          dataSource={assistants} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          className="overflow-x-auto"
        />
      </div>
      
      <div className="bg-allokoli-purple-50 p-6 rounded-lg mt-6 border border-allokoli-purple-200">
        <h3 className="text-lg font-semibold text-allokoli-purple-800 mb-3">Ressources pour vos assistants</h3>
        <p className="text-gray-700 mb-4">
          Les assistants peuvent être connectés à des bases de connaissances, des numéros de téléphone et utiliser différents modèles d&apos;IA.
        </p>
        <div className="flex flex-wrap gap-4 mt-4">
          <Button className="text-allokoli-purple-700 border-allokoli-purple-300">
            Tutoriels
          </Button>
          <Button className="text-allokoli-purple-700 border-allokoli-purple-300">
            Documentation API
          </Button>
          <Button className="text-allokoli-purple-700 border-allokoli-purple-300">
            Exemples de scripts
          </Button>
        </div>
      </div>
    </div>
  );
} 