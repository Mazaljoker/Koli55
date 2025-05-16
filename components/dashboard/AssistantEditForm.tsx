'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, Card, TextInput, Textarea, Select, SelectItem, Title } from '@tremor/react';

// Interface pour les données du formulaire, similaire à AssistantFormData de la page de création
// et à l'interface Assistant de la page de détail.
// Les champs doivent correspondre à ce que votre API attend pour une mise à jour.
interface AssistantEditFormData {
  name: string;
  model: string;
  language: string;
  voice: string;
  first_message: string; // Convention de nommage de la BDD/API (snake_case)
  system_prompt: string; // Convention de nommage de la BDD/API (snake_case)
  // Ajoutez d'autres champs modifiables ici
  // Par exemple: server_url, tools, knowledge_base_id, etc.
}

interface AssistantEditFormProps {
  assistantId: string;
  initialData: Partial<AssistantEditFormData>; // Les données initiales peuvent être partielles ou complètes
  onSubmit: (formData: AssistantEditFormData) => Promise<void>; // La fonction de soumission est asynchrone
  loading: boolean; // État de chargement géré par la page parente
  error: string | null; // Erreur gérée par la page parente
}

export default function AssistantEditForm({
  assistantId,
  initialData,
  onSubmit,
  loading,
  error,
}: AssistantEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<AssistantEditFormData>({
    name: '',
    model: 'gpt-4o', // Valeur par défaut si non fournie
    language: 'en-US', // Valeur par défaut si non fournie
    voice: '',
    first_message: '',
    system_prompt: '',
    ...initialData, // Écrase les valeurs par défaut avec initialData
  });

  // Mettre à jour le formulaire si initialData change (par exemple, après un re-fetch)
  useEffect(() => {
    setFormData(prev => ({
      ...prev, // Garde les valeurs actuelles non écrasées
      name: initialData.name || prev.name || '',
      model: initialData.model || prev.model || 'gpt-4o',
      language: initialData.language || prev.language || 'en-US',
      voice: initialData.voice || prev.voice || '',
      first_message: initialData.first_message || prev.first_message || '',
      system_prompt: initialData.system_prompt || prev.system_prompt || '',
    }));
  }, [initialData]);

  const handleChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom de l'assistant</label>
          <TextInput
            id="name"
            name="name"
            value={formData.name}
            onValueChange={(value) => handleChange(value, 'name')}
            placeholder="Ex: Support Client IA"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Modèle de langage</label>
          <Select 
            id="model" 
            name="model" 
            value={formData.model} 
            onValueChange={(value) => handleChange(value, 'model')}
          >
            <SelectItem value="gpt-4o">GPT-4o (OpenAI)</SelectItem>
            <SelectItem value="gpt-4-turbo">GPT-4 Turbo (OpenAI)</SelectItem>
            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</SelectItem>
            {/* Ajoutez d'autres modèles si nécessaire */}
          </Select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Langue</label>
          <TextInput
            id="language"
            name="language"
            value={formData.language}
            onValueChange={(value) => handleChange(value, 'language')}
            placeholder="Ex: en-US, fr-FR"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="voice" className="block text-sm font-medium text-gray-700 mb-1">Voix (ID/Nom)</label>
          <TextInput
            id="voice"
            name="voice"
            value={formData.voice}
            onValueChange={(value) => handleChange(value, 'voice')}
            placeholder="Ex: eleven-multilingual-v2 (ElevenLabs), etc."
          />
          <p className="text-xs text-gray-500 mt-1">Consultez la documentation Vapi pour les voix disponibles.</p>
        </div>

        <div className="mb-6">
          <label htmlFor="first_message" className="block text-sm font-medium text-gray-700 mb-1">Message d'accueil</label>
          <Textarea
            id="first_message"
            name="first_message"
            rows={3}
            value={formData.first_message}
            onChange={handleTextAreaChange}
            placeholder="Bonjour ! Comment puis-je vous aider aujourd'hui ?"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="system_prompt" className="block text-sm font-medium text-gray-700 mb-1">Prompt Système (Instructions)</label>
          <Textarea
            id="system_prompt"
            name="system_prompt"
            rows={6}
            value={formData.system_prompt}
            onChange={handleTextAreaChange}
            placeholder="Vous êtes un assistant virtuel spécialisé dans..."
          />
        </div>
        
        {/* Placeholder pour d'autres champs: Tools, Knowledge Base, etc. */}
        <div className="mb-6 p-4 bg-gray-50 rounded-md border border-dashed border-gray-300">
          <p className="text-sm text-gray-500 text-center">
            D'autres options de configuration avancée (Tools, Knowledge Base, etc.) seront ajoutées ici.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3 mt-8 border-t pt-6">
          <Link href={`/assistants/${assistantId}`} passHref>
            <Button type="button" variant="secondary" disabled={loading}>
              Annuler
            </Button>
          </Link>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </Button>
        </div>
      </form>
    </Card>
  );
} 