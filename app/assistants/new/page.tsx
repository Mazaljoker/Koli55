'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import supabase from '../../../lib/supabaseClient';

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
      const { data: responseData, error: apiError } = await supabase.functions.invoke('assistants', {
        body: formData,
      });

      if (apiError) {
        console.error('Supabase function invoke error:', apiError);
        throw new Error(apiError.message || 'Failed to create assistant.');
      }

      if (responseData && responseData.success) {
        router.push(`/assistants/${responseData.data.id}`);
      } else {
        console.error('API error creating assistant:', responseData?.message);
        throw new Error(responseData?.message || 'Failed to create assistant due to an API error.');
      }

    } catch (err: any) {
      console.error('Client-side error creating assistant:', err);
      setError(err.message || 'An unexpected error occurred.');
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
        {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

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