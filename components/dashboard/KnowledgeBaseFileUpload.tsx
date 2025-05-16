'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import {
  Button,
  Text,
  Card,
  Title
} from '@tremor/react';
import { ArrowUpTrayIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface KnowledgeBaseFileUploadProps {
  knowledgeBaseId: string;
  onUploadComplete: () => void; // Callback pour rafraîchir la liste des fichiers
  // onClose?: () => void; // Optionnel, si ce composant est utilisé dans une modale
}

const KnowledgeBaseFileUpload: React.FC<KnowledgeBaseFileUploadProps> = ({ 
  knowledgeBaseId,
  onUploadComplete,
  // onClose 
}) => {
  const supabase = createClientComponentClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
    setError(null); // Réinitialiser les erreurs lors du changement de fichier
    setSuccess(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier à téléverser.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData();
    formData.append('file', selectedFile); // Le nom 'file' doit correspondre à ce que votre API attend

    try {
      // Note: Supabase functions.invoke avec FormData peut nécessiter des ajustements
      // dans la fonction Edge pour gérer correctement `multipart/form-data`.
      // Il est souvent plus simple de passer le contenu du fichier en base64 ou d'utiliser
      // Supabase Storage pour l'upload, puis de lier le fichier à la KB.
      // Pour l'instant, on tente avec FormData.
      const { data, error: supabaseError } = await supabase.functions.invoke(
        `knowledge-bases/${knowledgeBaseId}/files`,
        {
          method: 'POST',
          body: formData,
          // Les headers 'Content-Type': 'multipart/form-data' sont généralement gérés par le navigateur
          // lors de l'envoi de FormData, mais avec functions.invoke, cela peut être plus complexe.
          // Si cela échoue, envisagez Supabase Storage.
        }
      );

      if (supabaseError) {
        throw supabaseError;
      }

      setSuccess(`Fichier "${selectedFile.name}" téléversé avec succès !`);
      setSelectedFile(null); // Réinitialiser le champ de fichier
      if (document.getElementById('file-upload-input')) {
        (document.getElementById('file-upload-input') as HTMLInputElement).value = '';
      }
      onUploadComplete(); // Appeler le callback
      // if (onClose) onClose(); // Fermer la modale si applicable

    } catch (e: any) {
      console.error('Erreur lors du téléversement du fichier:', e);
      setError(e.message || 'Une erreur est survenue lors du téléversement.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto mt-4">
      {/* <Title className="mb-4">Ajouter un Fichier à la Base de Connaissances</Title> */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="file-upload-input" className="block text-sm font-medium text-tremor-content-strong mb-1">
            Sélectionner un fichier
          </label>
          <input 
            id="file-upload-input"
            type="file" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-tremor-content-subtle file:mr-4 file:py-2 file:px-4 file:rounded-tremor-small file:border-0 file:text-sm file:font-semibold file:bg-tremor-brand-faint file:text-tremor-brand hover:file:bg-tremor-brand-muted dark:file:bg-dark-tremor-brand-faint dark:hover:file:bg-dark-tremor-brand-muted dark:file:text-dark-tremor-brand"
            // Vous pouvez ajouter un attribut `accept` ici, ex: accept=".pdf,.txt,.md"
          />
          {selectedFile && (
            <Text className="mt-2 text-xs">Fichier sélectionné: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} Ko)</Text>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-md bg-red-50 border border-red-200">
            <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" aria-hidden="true" />
                <Text color="red">{error}</Text>
            </div>
          </div>
        )}
        {success && (
          <div className="p-3 rounded-md bg-green-50 border border-green-200">
            <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" aria-hidden="true" />
                <Text color="green">{success}</Text>
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          icon={ArrowUpTrayIcon} 
          loading={uploading} 
          disabled={uploading || !selectedFile}
          className="w-full"
        >
          Téléverser le Fichier
        </Button>
      </form>
    </Card>
  );
};

export default KnowledgeBaseFileUpload; 