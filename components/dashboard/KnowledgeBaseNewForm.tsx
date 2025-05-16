'use client';

import React, { useState } from 'react';
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
import { ArrowLeftIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface KnowledgeBaseFormData {
  name: string;
  description: string;
  // Ajoutez d'autres champs si votre API les requiert pour la création
}

const KnowledgeBaseNewForm = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [formData, setFormData] = useState<KnowledgeBaseFormData>({
    name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { data: newKb, error: supabaseError } = await supabase.functions.invoke(
        'knowledge-bases',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (supabaseError) {
        throw supabaseError;
      }

      setSuccess("Base de connaissances '" + (newKb?.name || formData.name) + "' créée avec succès !");
      // Optionnel: réinitialiser le formulaire
      setFormData({ name: '', description: '' });
      // Rediriger vers la liste ou la page de détail après un court délai
      setTimeout(() => {
        // Idéalement, newKb.id devrait être utilisé si retourné par l'API
        // Pour l'instant, on retourne à la liste
        router.push('/dashboard/knowledge-bases');
        router.refresh(); // Pour s'assurer que la liste est mise à jour
      }, 2000);

    } catch (e: any) {
      console.error('Erreur lors de la création de la base de connaissances:', e);
      setError(e.message || 'Une erreur est survenue lors de la création.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-6">
      <div className="flex items-center mb-6">
        <Button 
          icon={ArrowLeftIcon} 
          variant="light" 
          onClick={() => router.push('/dashboard/knowledge-bases')}
          className="mr-2"
        >
          Retour
        </Button>
        <Title>Créer une Nouvelle Base de Connaissances</Title>
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
              value={formData.name}
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
              value={formData.description}
              onChange={handleChange}
              placeholder="Décrivez brièvement le contenu ou l'objectif de cette base de connaissances."
              rows={4}
              className="mt-1"
            />
          </div>
        </Grid>

        {error && (
          <Text color="red" className="mt-4">{error}</Text>
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
            onClick={() => router.push('/dashboard/knowledge-bases')} 
            disabled={loading}
          >
            Annuler
          </Button>
          <Button type="submit" loading={loading} disabled={loading}>
            Créer la Base de Connaissances
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default KnowledgeBaseNewForm; 