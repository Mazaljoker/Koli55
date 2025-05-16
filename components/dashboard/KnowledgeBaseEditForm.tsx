'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  TextInput,
  Textarea,
  Title,
  Text,
  Grid,
} from '@tremor/react';
import { ArrowLeftIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Interface pour les données initiales et le formulaire
interface KnowledgeBaseData {
  id?: string; // L'ID peut ne pas être présent dans le formData pour la création, mais utile pour l'édition
  name: string;
  description?: string;
  // Autres champs si pertinents
}

interface KnowledgeBaseEditFormProps {
  knowledgeBaseId: string;
  initialData: Partial<KnowledgeBaseData>; // Les données initiales peuvent être partielles ou complètes
}

const KnowledgeBaseEditForm: React.FC<KnowledgeBaseEditFormProps> = ({ knowledgeBaseId, initialData }) => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  // Initialiser formData avec une structure complète pour éviter les undefined sur les champs contrôlés
  const [formData, setFormData] = useState<KnowledgeBaseData>({
    name: '',
    description: '',
    ...initialData, // Étaler initialData après les valeurs par défaut
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Mettre à jour formData si initialData change (par exemple, après chargement asynchrone)
    setFormData(currentFormData => ({
        ...currentFormData, // Conserver les modifications locales si elles existent
        name: initialData.name || currentFormData.name || '',
        description: initialData.description || currentFormData.description || '',
    }));
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setSuccess(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const updatedFields: Partial<KnowledgeBaseData> = {};
    // Comparer avec initialData (tel qu'il était au moment du chargement du composant)
    // pour ne patcher que les champs réellement modifiés.
    if (formData.name !== initialData.name) {
      updatedFields.name = formData.name;
    }
    if (formData.description !== initialData.description) {
      updatedFields.description = formData.description;
    }
    
    if (Object.keys(updatedFields).length === 0) {
      setSuccess("Aucune modification détectée.");
      setLoading(false);
      return;
    }

    try {
      const { data: updatedKb, error: supabaseError } = await supabase.functions.invoke(
        `knowledge-bases/${knowledgeBaseId}`,
        {
          method: 'PATCH',
          body: updatedFields,
        }
      );

      if (supabaseError) {
        throw supabaseError;
      }

      setSuccess("Base de connaissances '" + (updatedKb?.name || formData.name) + "' mise à jour avec succès !");
      setTimeout(() => {
        router.push(`/dashboard/knowledge-bases/${knowledgeBaseId}`);
        router.refresh();
      }, 2000);

    } catch (e: any) {
      console.error('Erreur lors de la mise à jour de la base de connaissances:', e);
      setError(e.message || 'Une erreur est survenue lors de la mise à jour.');
    } finally {
      setLoading(false);
    }
  };
  
  // Afficher un état de chargement simple si le nom n'est pas encore dans formData (via initialData)
  // Cela suppose que `name` est un champ obligatoire et sera présent une fois initialData chargé.
  if (!formData.name && initialData.name === undefined) { 
    return (
        <Card className="mt-6"><Text>Chargement des données du formulaire...</Text></Card>
    );
  }

  return (
    <Card className="mt-6">
      <div className="flex items-center mb-6">
        <Button 
          icon={ArrowLeftIcon} 
          variant="light" 
          onClick={() => router.push(`/dashboard/knowledge-bases/${knowledgeBaseId}`)}
          className="mr-2"
        >
          Retour aux détails
        </Button>
        <Title>Modifier la Base de Connaissances: {initialData.name || formData.name || ''}</Title>
      </div>

      <form onSubmit={handleSubmit}>
        <Grid numItemsMd={2} numItemsSm={1} className="gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-tremor-content-strong">
              Nom de la base de connaissances <span className="text-red-500">*</span>
            </label>
            <TextInput
              id="name"
              name="name"
              value={formData.name || ''} 
              onChange={handleChange}
              placeholder="Ex: Support Produit XYZ"
              required
              className="mt-1"
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-tremor-content-strong">
              Description (optionnel)
            </label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''} 
              onChange={handleChange}
              placeholder="Décrivez brièvement le contenu ou l'objectif de cette base de connaissances."
              rows={4}
              className="mt-1"
            />
          </div>
        </Grid>

        {error && (
          <div className="mt-4 p-3 rounded-md bg-red-50 border border-red-200">
            <div className="flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" aria-hidden="true" />
                <Text color="red">{error}</Text>
            </div>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 rounded-md bg-green-50 border border-green-200">
            <div className="flex items-center">
                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" aria-hidden="true" />
                <Text color="green">{success}</Text>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end space-x-2">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => router.push(`/dashboard/knowledge-bases/${knowledgeBaseId}`)} 
            disabled={loading}
          >
            Annuler
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            Enregistrer les Modifications
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default KnowledgeBaseEditForm; 