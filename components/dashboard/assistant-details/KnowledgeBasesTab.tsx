'use client';

import { Card, Title, Text, Button, List, ListItem, Flex, Divider, Grid, Col } from '@tremor/react';
import { AssistantData } from '../../../lib/api/assistantsService';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DocumentTextIcon, DocumentPlusIcon, PlusIcon, LinkIcon } from '@heroicons/react/24/outline';

interface KnowledgeBase {
  id: string;
  name: string;
  file_count: number;
  description?: string;
}

interface Function {
  id: string;
  name: string;
  description: string;
}

interface KnowledgeBasesTabProps {
  assistant: AssistantData;
}

export default function KnowledgeBasesTab({ assistant }: KnowledgeBasesTabProps) {
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [functions, setFunctions] = useState<Function[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledgeBasesAndTools();
  }, [assistant.id]);

  const fetchKnowledgeBasesAndTools = async () => {
    setLoading(true);
    try {
      // Simulation de données pour les bases de connaissances et outils
      // Dans une implémentation réelle, vous feriez un appel API ici
      
      // Générer des KB fictives
      const mockKnowledgeBases: KnowledgeBase[] = [];
      
      // Utiliser les KB configurées dans l'assistant si disponibles
      if (assistant.tools_config?.knowledgeBases?.length) {
        assistant.tools_config.knowledgeBases.forEach((kbId, index) => {
          mockKnowledgeBases.push({
            id: kbId,
            name: `Base de connaissances ${index + 1}`,
            file_count: Math.floor(Math.random() * 20) + 1,
            description: index === 0 ? 'Base de connaissances principale pour cet assistant' : undefined
          });
        });
      } else {
        // Si aucune KB n'est configurée, ajouter des exemples
        mockKnowledgeBases.push(
          {
            id: 'kb_example_1',
            name: 'Exemple de base de connaissances',
            file_count: 5,
            description: 'Cette KB est donnée à titre d\'exemple. Vous n\'avez pas encore lié de base de connaissances.'
          }
        );
      }
      
      setKnowledgeBases(mockKnowledgeBases);
      
      // Générer des fonctions fictives
      const mockFunctions: Function[] = [];
      
      // Utiliser les fonctions configurées dans l'assistant si disponibles
      if (assistant.tools_config?.functions?.length) {
        assistant.tools_config.functions.forEach((funcId, index) => {
          mockFunctions.push({
            id: funcId,
            name: `Fonction ${index + 1}`,
            description: `Description de la fonction ${index + 1}`
          });
        });
      } else {
        // Si aucune fonction n'est configurée, ajouter des exemples
        mockFunctions.push(
          {
            id: 'func_example',
            name: 'Exemple de fonction',
            description: 'Cet assistant n\'a pas encore de fonctions configurées.'
          }
        );
      }
      
      setFunctions(mockFunctions);
    } catch (error) {
      console.error('Error fetching knowledge bases and tools:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bases de Connaissances */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title>Bases de Connaissances Liées</Title>
          <Button icon={LinkIcon} variant="secondary" size="sm">
            Gérer les liaisons
          </Button>
        </div>
        
        {knowledgeBases.length === 0 ? (
          <div className="py-4 text-center">
            <Text>Aucune base de connaissances liée à cet assistant.</Text>
            <Button icon={PlusIcon} variant="light" className="mt-2">
              Lier une base de connaissances
            </Button>
          </div>
        ) : (
          <List>
            {knowledgeBases.map((kb) => (
              <ListItem key={kb.id}>
                <Flex justifyContent="start" className="gap-4">
                  <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                  <div className="flex-grow">
                    <Link href={`/dashboard/knowledge-bases/${kb.id}`} className="text-blue-600 hover:underline">
                      <Text className="font-medium">{kb.name}</Text>
                    </Link>
                    {kb.description && (
                      <Text className="text-gray-500 text-sm">{kb.description}</Text>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    <Text className="font-medium">{kb.file_count} fichier{kb.file_count > 1 ? 's' : ''}</Text>
                    <div className="flex gap-2 mt-1">
                      <Button size="xs" variant="light">
                        Explorer
                      </Button>
                      <Button size="xs" variant="light" icon={DocumentPlusIcon}>
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </Flex>
              </ListItem>
            ))}
          </List>
        )}
      </Card>

      {/* Fonctions */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <Title>Fonctions (Outils) Activées</Title>
          <Button icon={LinkIcon} variant="secondary" size="sm">
            Gérer les fonctions
          </Button>
        </div>
        
        {functions.length === 0 || (functions.length === 1 && functions[0].id === 'func_example') ? (
          <div className="py-4 text-center">
            <Text>Aucune fonction active pour cet assistant.</Text>
            <Button icon={PlusIcon} variant="light" className="mt-2">
              Ajouter une fonction
            </Button>
          </div>
        ) : (
          <Grid numItemsMd={2} className="gap-4">
            {functions.map((func) => (
              <Col key={func.id}>
                <Card className="border-l-4 border-blue-500">
                  <Text className="font-medium">{func.name}</Text>
                  <Text className="text-gray-500 text-sm mt-1">{func.description}</Text>
                  <Text className="text-gray-400 text-xs mt-2">ID: {func.id}</Text>
                </Card>
              </Col>
            ))}
          </Grid>
        )}
      </Card>

      {/* Workflows (si applicable) */}
      {assistant.tools_config?.workflows && assistant.tools_config.workflows.length > 0 && (
        <Card>
          <div className="flex justify-between items-center mb-4">
            <Title>Workflows</Title>
            <Button icon={LinkIcon} variant="secondary" size="sm">
              Gérer les workflows
            </Button>
          </div>
          
          <List>
            {assistant.tools_config.workflows.map((workflow, index) => (
              <ListItem key={index}>
                <Flex justifyContent="start" className="gap-4">
                  <div className="flex-grow">
                    <Text className="font-medium">Workflow {index + 1}</Text>
                    <Text className="text-gray-500 text-sm">ID: {workflow}</Text>
                  </div>
                  <Button size="xs" variant="light">
                    Détails
                  </Button>
                </Flex>
              </ListItem>
            ))}
          </List>
        </Card>
      )}
    </div>
  );
} 