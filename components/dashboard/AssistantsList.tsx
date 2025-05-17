'use client';

import Link from 'next/link';
import { 
  Table, 
  TableHead, 
  TableRow, 
  TableHeaderCell, 
  TableBody, 
  TableCell, 
  Text, 
  Button 
} from '@tremor/react';
import { AssistantData } from '../../lib/api/assistantsService';

// Utiliser le type AssistantData du service
type Assistant = AssistantData;

interface AssistantsListProps {
  assistants: Assistant[];
  loading: boolean;
  error: string | null;
  deletingId: string | null;
  onDelete: (assistantId: string) => void;
}

export default function AssistantsList({
  assistants,
  loading,
  error,
  deletingId,
  onDelete,
}: AssistantsListProps) {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
        Erreur: {error}
      </div>
    );
  }
  
  if (assistants.length === 0) {
    return (
      <div className="text-center py-8 bg-white p-6 rounded-lg shadow-md">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 className="text-lg font-medium text-gray-600 mb-2">Aucun assistant trouvé</h3>
        <p className="text-gray-500 mb-4">Vous n'avez pas encore créé d'assistants.</p>
        <Link href="/assistants/new">
          <Button variant="primary">Créer mon premier assistant</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Mes Assistants</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeaderCell>Nom</TableHeaderCell>
            <TableHeaderCell>Modèle</TableHeaderCell>
            <TableHeaderCell>Langue</TableHeaderCell>
            <TableHeaderCell>Créé le</TableHeaderCell>
            <TableHeaderCell className="text-right">Actions</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assistants.map((assistant) => (
            <TableRow key={assistant.id}>
              <TableCell>{assistant.name}</TableCell>
              <TableCell><Text>{assistant.model || 'N/A'}</Text></TableCell>
              <TableCell><Text>{assistant.language || 'N/A'}</Text></TableCell>
              <TableCell><Text>{new Date(assistant.created_at).toLocaleDateString()}</Text></TableCell>
              <TableCell className="text-right space-x-2">
                <Link href={`/assistants/${assistant.id}`} passHref>
                  <Button size="xs" variant="secondary" className="text-blue-600 hover:text-blue-700">
                    Voir
                  </Button>
                </Link>
                <Link href={`/assistants/${assistant.id}/edit`} passHref>
                  <Button size="xs" variant="secondary" className="text-yellow-600 hover:text-yellow-700">
                    Éditer
                  </Button>
                </Link>
                <Button 
                  size="xs" 
                  variant="secondary" 
                  color="red"
                  onClick={() => onDelete(assistant.id)}
                  disabled={deletingId === assistant.id}
                  className="text-red-600 hover:text-red-700"
                >
                  {deletingId === assistant.id ? 'Suppression...' : 'Supprimer'}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 