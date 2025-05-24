'use client';

import React, { useState } from 'react';
import { 
  Card, Title, Text, Grid, Table, TableHead, 
  TableHeaderCell, TableBody, TableRow, TableCell, 
  Badge, Button, Flex, Divider
} from '@tremor/react';
import { 
  DocumentTextIcon, PlusIcon, LinkIcon, TrashIcon,
  PaperClipIcon, ArrowUpTrayIcon
} from '@heroicons/react/24/outline';
import { Assistant } from '../../../lib/api/allokoli-sdk';

interface KnowledgeBasesTabProps {
  assistant: Assistant;
}

// Type pour une base de connaissances
interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  fileCount: number;
  updated: string;
  connected: boolean;
}

// Type pour un fichier dans une base de connaissances
interface KBFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploaded: string;
}

const KnowledgeBasesTab: React.FC<KnowledgeBasesTabProps> = ({ assistant }) => {
  const [selectedKB, setSelectedKB] = useState<KnowledgeBase | null>(null);
  
  // Données fictives pour les bases de connaissances (à remplacer par des données réelles via SDK)
  const kbMockData: KnowledgeBase[] = [
    {
      id: 'kb_1',
      name: 'Documentation Produits',
      description: 'Documentation technique et commerciale des produits',
      fileCount: 12,
      updated: '2024-07-05T14:32:10',
      connected: true
    },
    {
      id: 'kb_2',
      name: 'FAQ Support Client',
      description: 'Questions fréquentes et leurs réponses',
      fileCount: 8,
      updated: '2024-07-01T10:15:22',
      connected: true
    },
    {
      id: 'kb_3',
      name: 'Base articles blog',
      description: 'Articles du blog corporate et études de cas',
      fileCount: 24,
      updated: '2024-06-15T16:05:00',
      connected: false
    }
  ];
  
  // Données fictives pour les fichiers (à remplacer par des données réelles via SDK)
  const filesMockData: KBFile[] = [
    {
      id: 'file_001',
      name: 'Catalogue_Produits_2024.pdf',
      size: '4.2 MB',
      type: 'PDF',
      uploaded: '2024-07-05T14:32:10'
    },
    {
      id: 'file_002',
      name: 'Guide_Installation.docx',
      size: '1.8 MB',
      type: 'DOCX',
      uploaded: '2024-07-02T09:15:22'
    },
    {
      id: 'file_003',
      name: 'Tarifs_2024.xlsx',
      size: '2.1 MB',
      type: 'XLSX',
      uploaded: '2024-06-30T11:05:00'
    },
    {
      id: 'file_004',
      name: 'Specifications_Techniques.pdf',
      size: '5.7 MB',
      type: 'PDF',
      uploaded: '2024-06-28T16:45:33'
    }
  ];
  
  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Vérifier si une base de connaissances est connectée à l'assistant
  const isConnected = (kbId: string) => {
    // TODO: Implémenter avec le SDK knowledge-bases quand disponible
    return kbMockData.find(kb => kb.id === kbId)?.connected || false;
  };
  
  // Gérer la connexion/déconnexion d'une base de connaissances
  const toggleKBConnection = (kb: KnowledgeBase) => {
    console.log(`${kb.connected ? 'Déconnecter' : 'Connecter'} la base ${kb.name}`);
    // TODO: Implémenter avec le SDK AlloKoli
    // const updatedKBs = kbMockData.map(k => 
    //   k.id === kb.id ? { ...k, connected: !k.connected } : k
    // );
  };
  
  // Gérer la sélection d'une base de connaissances pour voir ses fichiers
  const handleSelectKB = (kb: KnowledgeBase) => {
    setSelectedKB(kb);
  };
  
  // Fermer la vue détaillée d'une base de connaissances
  const handleCloseKBDetails = () => {
    setSelectedKB(null);
  };

  return (
    <div className="space-y-6">
      {/* Vue principale des bases de connaissances */}
      {!selectedKB ? (
        <>
          <Card>
            <Flex justifyContent="between" alignItems="center" className="mb-6">
              <div>
                <Title>Bases de connaissances</Title>
                <Text className="mt-2">
                  Connexion des sources de connaissances pour alimenter votre assistant
                </Text>
              </div>
              <Button 
                icon={PlusIcon} 
                variant="primary"
                size="md"
              >
                Nouvelle base
              </Button>
            </Flex>
            
            <Grid numItems={1} numItemsMd={2} numItemsLg={3} className="gap-6">
              {kbMockData.map((kb) => (
                <Card key={kb.id} decoration="top" decorationColor={isConnected(kb.id) ? "green" : "gray"}>
                  <Flex justifyContent="between" alignItems="start">
                    <div>
                      <Title className="text-base truncate">{kb.name}</Title>
                      <Text className="text-xs mt-1 text-gray-500">
                        {kb.fileCount} fichiers • Mis à jour le {formatDate(kb.updated)}
                      </Text>
                    </div>
                    {isConnected(kb.id) && (
                      <Badge color="green" size="xs">Connectée</Badge>
                    )}
                  </Flex>
                  
                  {kb.description && (
                    <Text className="mt-3 text-sm line-clamp-2">{kb.description}</Text>
                  )}
                  
                  <Flex justifyContent="between" className="mt-4">
                    <Button 
                      size="xs" 
                      variant="light"
                      icon={DocumentTextIcon}
                      onClick={() => handleSelectKB(kb)}
                    >
                      Détails
                    </Button>
                    
                    <Button 
                      size="xs" 
                      variant={isConnected(kb.id) ? "secondary" : "primary"}
                      icon={LinkIcon}
                      onClick={() => toggleKBConnection(kb)}
                    >
                      {isConnected(kb.id) ? 'Déconnecter' : 'Connecter'}
                    </Button>
                  </Flex>
                </Card>
              ))}
            </Grid>
          </Card>

          {/* Informations sur l'assistant */}
          <Card>
            <Title className="text-base">Configuration actuelle</Title>
            <Text className="mt-2 text-sm text-gray-600">
              Assistant: {assistant.name}
            </Text>
            <Text className="text-sm text-gray-600">
              Bases connectées: {kbMockData.filter(kb => kb.connected).length} / {kbMockData.length}
            </Text>
          </Card>
        </>
      ) : (
        /* Vue détaillée d'une base de connaissances */
        <Card>
          <Flex justifyContent="between" alignItems="center" className="mb-6">
            <div>
              <Title>{selectedKB.name}</Title>
              <Text className="mt-1">{selectedKB.description}</Text>
            </div>
            <Flex className="gap-2">
              <Button 
                variant="secondary"
                onClick={handleCloseKBDetails}
              >
                Retour
              </Button>
              <Button 
                icon={ArrowUpTrayIcon}
                variant="primary"
              >
                Ajouter fichiers
              </Button>
            </Flex>
          </Flex>
          
          <Divider />
          
          <div className="mt-6">
            <Title className="text-lg mb-4">Fichiers ({filesMockData.length})</Title>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Nom du fichier</TableHeaderCell>
                  <TableHeaderCell>Type</TableHeaderCell>
                  <TableHeaderCell>Taille</TableHeaderCell>
                  <TableHeaderCell>Date d&apos;ajout</TableHeaderCell>
                  <TableHeaderCell>Actions</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filesMockData.map((file) => (
                  <TableRow key={file.id}>
                    <TableCell>
                      <Flex alignItems="center" className="gap-2">
                        <PaperClipIcon className="h-4 w-4 text-gray-500" />
                        <Text className="font-medium">{file.name}</Text>
                      </Flex>
                    </TableCell>
                    <TableCell>
                      <Badge color="blue" size="xs">{file.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Text>{file.size}</Text>
                    </TableCell>
                    <TableCell>
                      <Text className="text-sm">{formatDate(file.uploaded)}</Text>
                    </TableCell>
                    <TableCell>
                      <Button 
                        icon={TrashIcon}
                        variant="light"
                        size="xs"
                        color="red"
                      >
                        Supprimer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default KnowledgeBasesTab; 