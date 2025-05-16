'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Title,
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Button,
  Text,
  Badge,
} from '@tremor/react';
import { PlusCircleIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Définir une interface pour la structure d'une base de connaissances
interface KnowledgeBase {
  id: string;
  name: string;
  description?: string; // Supposons qu'il y ait une description
  created_at: string;
  // Ajoutez d'autres champs si nécessaire selon votre schéma de BDD/API
}

const KnowledgeBases = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKnowledgeBases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: supabaseError } = await supabase.functions.invoke('knowledge-bases', {
        method: 'GET',
      });

      if (supabaseError) {
        throw supabaseError;
      }

      // Supposons que 'data' contient un tableau de bases de connaissances
      // ou que la réponse est directement le tableau. Ajustez selon la structure de votre API.
      if (data && Array.isArray(data.items)) { // J'assume que la fonction retourne un objet avec une clé 'items' contenant le tableau
        setKnowledgeBases(data.items);
      } else if (Array.isArray(data)) {
        setKnowledgeBases(data);
      } else {
        console.warn('Unexpected data format from API:', data);
        setKnowledgeBases([]); // ou gérer comme une erreur
      }

    } catch (e: any) {
      console.error('Erreur lors de la récupération des bases de connaissances:', e);
      setError(e.message || 'Une erreur est survenue.');
      setKnowledgeBases([]); // Réinitialiser en cas d'erreur
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchKnowledgeBases();
  }, [fetchKnowledgeBases]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette base de connaissances ?")) {
      try {
        const { error: deleteError } = await supabase.functions.invoke(`knowledge-bases/${id}`, {
          method: 'DELETE',
        });
        if (deleteError) throw deleteError;
        // Actualiser la liste après suppression
        setKnowledgeBases(prevKbs => prevKbs.filter(kb => kb.id !== id));
        // Afficher une notification de succès (à implémenter)
        alert('Base de connaissances supprimée avec succès !');
      } catch (e: any) {
        console.error('Erreur lors de la suppression:', e);
        alert(`Erreur lors de la suppression: ${e.message}`);
        // Afficher une notification d'erreur (à implémenter)
      }
    }
  };

  if (loading) {
    return (
      <Card className="mt-6">
        <Title>Gestion des Bases de Connaissances</Title>
        <Text className="mt-2">Chargement des bases de connaissances...</Text>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6">
        <Title>Gestion des Bases de Connaissances</Title>
        <Text color="red" className="mt-2">Erreur: {error}</Text>
        <Button onClick={fetchKnowledgeBases} className="mt-4">Réessayer</Button>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <Title>Gestion des Bases de Connaissances</Title>
        <Button 
          icon={PlusCircleIcon} 
          onClick={() => router.push('/dashboard/knowledge-bases/new')}
          className="mt-4 sm:mt-0"
        >
          Créer une base
        </Button>
      </div>
      
      {knowledgeBases.length === 0 && !loading ? (
        <Text className="mt-4 text-center py-8">
          Aucune base de connaissances trouvée. Commencez par en créer une !
        </Text>
      ) : (
        <Table className="mt-5">
          <TableHead>
            <TableRow>
              <TableHeaderCell>Nom</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>Date de création</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {knowledgeBases.map((kb) => (
              <TableRow key={kb.id}>
                <TableCell>{kb.name}</TableCell>
                <TableCell>
                  <Text>{kb.description || 'N/A'}</Text>
                </TableCell>
                <TableCell>
                  {new Date(kb.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell className="space-x-2">
                  <Button 
                    size="xs" 
                    variant="secondary" 
                    icon={EyeIcon} 
                    onClick={() => router.push(`/dashboard/knowledge-bases/${kb.id}`)} // TODO: Créer cette page de détail/vue
                    tooltip="Voir"
                  />
                  <Button 
                    size="xs" 
                    variant="secondary" 
                    icon={PencilIcon} 
                    onClick={() => router.push(`/dashboard/knowledge-bases/${kb.id}/edit`)} // TODO: Créer cette page d'édition
                    tooltip="Modifier"
                  />
                  <Button 
                    size="xs" 
                    variant="secondary" 
                    color="red" 
                    icon={TrashIcon} 
                    onClick={() => handleDelete(kb.id)}
                    tooltip="Supprimer"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
};

export default KnowledgeBases; 