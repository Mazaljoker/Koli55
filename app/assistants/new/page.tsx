'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { assistantsService, CreateAssistantPayload } from '../../../lib/api/assistantsService';

// Define a type for the assistant form data (can be expanded)
interface AssistantFormData {
  name: string;
  model: string; // e.g., 'gpt-3.5-turbo', 'gpt-4'
  language: string; // e.g., 'en-US', 'fr-FR'
  voice: string; // Voice model name/ID
  firstMessage: string; // Initial message from the assistant
  instructions: string; // Added for system_prompt
  // Add more fields as per Vapi assistant configuration
  // e.g., systemPrompt, tools, knowledgeBaseId, etc.
}

export default function NewAssistantPage() {
  const [formData, setFormData] = useState<AssistantFormData>({
    name: '',
    model: 'gpt-4o', // Default value
    language: 'en-US', // Default value
    voice: '', // Vapi might have default or specific voice IDs
    firstMessage: 'Hello! How can I help you today?', // Default value
    instructions: 'You are a helpful assistant.', // Added
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Préparer les données pour l'API en utilisant le type défini dans assistantsService
      const apiPayload: CreateAssistantPayload = {
        name: formData.name,
      };

      // Vérification préalable des données
      if (!apiPayload.name.trim()) {
        throw new Error("Le nom de l'assistant est requis");
      }

      console.log('Submitting assistant data:', apiPayload);
      
      // Utiliser le service au lieu de l'appel direct à l'API
      const response = await assistantsService.create(apiPayload);

      console.log('Response from API:', response);
      
      if (!response.success) {
        console.error('API error creating assistant:', response);
        throw new Error(
          response.message || 
          (response.vapi_error ? `Vapi error: ${response.vapi_error}` : 'Failed to create assistant due to an API error.')
        );
      }

      if (response.data) {
        console.log('Assistant created successfully:', response.data);
        router.push(`/assistants/${response.data.id}`);
      } else {
        throw new Error('No assistant data returned from API');
      }

    } catch (err: any) {
      console.error('Client-side error creating assistant:', err);
      const errorMessage = err.message || 'An unexpected error occurred.';
      setError(`Error: ${errorMessage}`);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Create New Assistant</h1>
        <Link href="/assistants" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Assistants
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
            <details className="mt-2">
              <summary className="cursor-pointer text-sm font-medium">Voir les détails techniques</summary>
              <pre className="mt-2 p-2 bg-red-50 text-xs overflow-auto whitespace-pre-wrap">
                Si cette erreur persiste, vérifiez les éléments suivants:
                1. La variable VAPI_API_KEY est configurée dans les variables d'environnement de Supabase
                2. Vous êtes correctement authentifié
                3. Les données du formulaire sont valides (nom non vide, etc.)
              </pre>
            </details>
          </div>
        )}

        {/* Assistant Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Assistant Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Customer Support Bot"
          />
        </div>

        {/* Model Selection (Example) */}
        <div className="mb-4">
          <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">Language Model</label>
          <select
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4o">GPT-4o</option>
            {/* Add other models as needed */}
          </select>
        </div>

        {/* Language */}
        <div className="mb-4">
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <input
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., en-US, fr-FR"
          />
        </div>

        {/* Voice */}
        <div className="mb-4">
          <label htmlFor="voice" className="block text-sm font-medium text-gray-700 mb-1">Voice ID/Name</label>
          <input
            type="text"
            id="voice"
            name="voice"
            value={formData.voice}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Vapi voice model ID"
          />
        </div>

        {/* First Message */}
        <div className="mb-6">
          <label htmlFor="firstMessage" className="block text-sm font-medium text-gray-700 mb-1">First Message (Greeting)</label>
          <textarea
            id="firstMessage"
            name="firstMessage"
            rows={3}
            value={formData.firstMessage}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Hello! How can I assist you today?"
          />
        </div>
        
        {/* Placeholder for more fields: System Prompt, Tools, Knowledge Base, etc. */}
        <div className="mb-6 p-4 bg-gray-50 rounded-md border border-dashed border-gray-300">
          <p className="text-sm text-gray-500 text-center">
            More assistant configuration fields (System Prompt, Tools, Knowledge Base linking, etc.) will be added here.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <Link href="/assistants" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm disabled:opacity-50 transition duration-150 ease-in-out"
          >
            {loading ? 'Creating...' : 'Create Assistant'}
          </button>
        </div>
      </form>
    </div>
  );
} 