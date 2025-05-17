'use client';

import React, { useState } from 'react';
import {
  Card,
  Title,
  Text,
  Grid,
  Col,
  Button,
  Flex,
  Metric,
  Subtitle,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Icon,
  Dialog,
  DialogPanel
} from '@tremor/react';
import { ArrowLeftIcon, PencilIcon, DocumentPlusIcon, TrashIcon, ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import KnowledgeBaseFileUpload from './KnowledgeBaseFileUpload';
import { knowledgeBaseService, KnowledgeBaseFile, KnowledgeBaseData } from '../../lib/api/knowledgeBaseService';

// Interface pour un fichier associé à une base de connaissances
// Utiliser le type KnowledgeBaseFile du service

// Mise à jour de l'interface KnowledgeBase pour inclure les fichiers
// Utiliser le type KnowledgeBaseData du service
type KnowledgeBase = KnowledgeBaseData;

interface KnowledgeBaseDetailProps {
  knowledgeBase: KnowledgeBase | null;
  onFileChange?: () => void; // Callback pour rafraîchir les données après une action sur un fichier
}

const KnowledgeBaseDetail: React.FC<KnowledgeBaseDetailProps> = ({ knowledgeBase, onFileChange }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isDeletingFile, setIsDeletingFile] = useState<string | null>(null); // Pour l'état de chargement de suppression
  const [showUploadModal, setShowUploadModal] = useState(false);

  if (!knowledgeBase) {
    return (
      <Card className="mt-6">
        <Text>Aucune donnée de base de connaissances à afficher.</Text>
      </Card>
    );
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!knowledgeBase || !knowledgeBase.id) return;
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le fichier "${knowledgeBase.files?.find(f => f.id === fileId)?.filename || fileId}" ? Cette action est irréversible.`)) {
      setIsDeletingFile(fileId);
      try {
        // Utiliser le service plutôt que l'appel direct à l'API
        const response = await knowledgeBaseService.deleteFile(knowledgeBase.id, fileId);
        
        if (!response.success) {
          throw new Error(response.message || `Failed to delete file ${fileId}`);
        }
        
        alert('Fichier supprimé avec succès.');
        if (onFileChange) {
            onFileChange(); // Appeler le callback pour rafraîchir
        } else {
            router.refresh(); // Fallback si le callback n'est pas fourni
        }
      } catch (e: any) {
        console.error('Erreur lors de la suppression du fichier:', e);
        alert(`Erreur lors de la suppression du fichier: ${e.message}`);
      } finally {
        setIsDeletingFile(null);
      }
    }
  };

  // Fonction pour formater la taille des fichiers
  const formatFileSize = (bytes?: number): string => {
    if (bytes === undefined || bytes === null) return 'N/A';
    if (bytes === 0) return '0 Octets';
    const k = 1024;
    const sizes = ['Octets', 'Ko', 'Mo', 'Go', 'To'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleUploadComplete = () => {
    setShowUploadModal(false);
    if (onFileChange) {
      onFileChange();
    }
  };

  return (
    <>
      <div className="mb-6">
        <Button 
          icon={ArrowLeftIcon} 
          variant="light" 
          onClick={() => router.push('/dashboard/knowledge-bases')}
        >
          Retour à la liste
        </Button>
      </div>

      <Card className="mb-6">
        <Flex alignItems="start" className="mb-4">
          <div>
            <Title>{knowledgeBase.name}</Title>
            <Text>ID: {knowledgeBase.id}</Text>
          </div>
          <div className="space-x-2">
            <Button 
              icon={PencilIcon} 
              variant="secondary"
              onClick={() => router.push(`/dashboard/knowledge-bases/${knowledgeBase.id}/edit`)}
            >
              Modifier les infos
            </Button>
          </div>
        </Flex>

        {knowledgeBase.description && (
          <div className="mb-6">
            <Subtitle>Description</Subtitle>
            <Text className="mt-1 p-3 bg-tremor-background-subtle rounded-tremor-small">
              {knowledgeBase.description}
            </Text>
          </div>
        )}

        <Grid numItemsMd={2} numItemsSm={1} className="gap-6 mt-6">
          <Card>
            <Text>Date de Création</Text>
            <Metric>{new Date(knowledgeBase.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</Metric>
          </Card>
          {knowledgeBase.updated_at && (
            <Card>
              <Text>Dernière Modification</Text>
              <Metric>{new Date(knowledgeBase.updated_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}</Metric>
            </Card>
          )}
          <Card>
            <Text>Nombre de Fichiers</Text>
            <Metric>{knowledgeBase.files?.length ?? 0}</Metric>
          </Card>
        </Grid>
      </Card>

      {/* Section pour lister et gérer les fichiers */}
      <Card className="mt-6">
        <Flex alignItems="center" justifyContent="between" className="mb-4">
            <Title>Fichiers Associés</Title>
            <Button 
                icon={ArrowUpTrayIcon}
                onClick={() => setShowUploadModal(true)}
            >
                Ajouter un Fichier
            </Button>
        </Flex>

        {(knowledgeBase.files && knowledgeBase.files.length > 0) ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Nom du Fichier</TableHeaderCell>
                <TableHeaderCell>Type</TableHeaderCell>
                <TableHeaderCell>Taille</TableHeaderCell>
                <TableHeaderCell>Ajouté le</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {knowledgeBase.files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.filename}</TableCell>
                  <TableCell>{file.metadata?.type || 'N/A'}</TableCell>
                  <TableCell>{formatFileSize(file.size_bytes)}</TableCell>
                  <TableCell>{file.created_at ? new Date(file.created_at).toLocaleDateString('fr-FR') : 'N/A'}</TableCell>
                  <TableCell>
                    <Button 
                      size="xs" 
                      variant="secondary" 
                      color="red" 
                      icon={TrashIcon} 
                      onClick={() => handleDeleteFile(file.id)}
                      loading={isDeletingFile === file.id}
                      disabled={isDeletingFile === file.id}
                      tooltip="Supprimer le fichier"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Text className="mt-2 text-center py-4">
            Aucun fichier associé à cette base de connaissances pour le moment.
          </Text>
        )}
      </Card>

      <Dialog open={showUploadModal} onClose={() => setShowUploadModal(false)} static={true}>
        <DialogPanel className="sm:max-w-lg">
            <Flex alignItems="center" justifyContent="between" className="mb-4">
                <Title>Ajouter un Fichier à "{knowledgeBase.name}"</Title>
                <Button icon={XMarkIcon} variant="light" onClick={() => setShowUploadModal(false)} />
            </Flex>
          <KnowledgeBaseFileUpload 
            knowledgeBaseId={knowledgeBase.id} 
            onUploadComplete={handleUploadComplete} 
          />
        </DialogPanel>
      </Dialog>
    </>
  );
};

export default KnowledgeBaseDetail; 