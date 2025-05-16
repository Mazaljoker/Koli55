'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation'; // To get the [id] from the URL and for navigation
import supabase from '../../../../lib/supabaseClient'; // Adjusted path

// Interface for assistant data, similar to AssistantDetails but for form
interface AssistantEditData {
  name: string;
  model?: string;
  language?: string;
  voice?: string;
  first_message?: string;
  system_prompt?: string; // Added for instructions
  // Add other editable fields as necessary
}

export default function EditAssistantPage() {
  const params = useParams();
  const assistantId = params?.id as string;
  const router = useRouter();

  const [formData, setFormData] = useState<AssistantEditData>({
    name: '',
    model: 'gpt-3.5-turbo', // Default or load from fetched data
    language: 'en-US',      // Default or load from fetched data
    voice: '',              // Default or load from fetched data
    first_message: '',     // Default or load from fetched data
    system_prompt: '',     // Default or load from fetched data
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // For submission loading
  const [fetching, setFetching] = useState(true); // For loading initial data

  useEffect(() => {
    if (assistantId) {
      const fetchAssistantDetails = async () => {
        setFetching(true);
        setError(null);
        try {
          const { data: responseData, error: apiError } = await supabase.functions.invoke(
            `assistants/${assistantId}`,
            { method: 'GET' }
          );

          if (apiError) {
            console.error('Supabase function invoke error (fetch details):', apiError);
            throw new Error(apiError.message || 'Failed to fetch assistant details.');
          }

          if (responseData && responseData.success && responseData.data) {
            const assistant = responseData.data;
            setFormData({
              name: assistant.name || '',
              model: assistant.model || 'gpt-3.5-turbo',
              language: assistant.language || 'en-US',
              voice: assistant.voice || '',
              first_message: assistant.first_message || '',
              system_prompt: assistant.system_prompt || '',
            });
          } else if (responseData && !responseData.success) {
            console.error('API error fetching assistant details:', responseData.message);
            setError(responseData.message || 'Assistant not found or could not be loaded.');
          } else {
            console.warn('Unexpected data format from assistant details function:', responseData);
            setError('Received unexpected data format from server when fetching details.');
          }
        } catch (err: any) {
          console.error('Client-side error fetching assistant details:', err);
          setError(err.message || 'An unexpected error occurred while fetching details.');
        }
        setFetching(false);
      };
      fetchAssistantDetails();
    } else {
      setFetching(false);
      setError('Assistant ID is missing. Cannot load details to edit.');
    }
  }, [assistantId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Ensure all required fields are present if necessary, or rely on backend validation
      // The formData should align with what the PATCH endpoint expects.
      const { data: responseData, error: apiError } = await supabase.functions.invoke(
        `assistants/${assistantId}`,
        {
          method: 'PATCH',
          body: formData, // Send the entire form data
        }
      );

      if (apiError) {
        console.error('Supabase function invoke error (update assistant):', apiError);
        throw new Error(apiError.message || 'Failed to update assistant.');
      }

      if (responseData && responseData.success) {
        // Optionally, show a success message before redirecting
        // alert('Assistant updated successfully!');
        router.push(`/assistants/${assistantId}`); // Redirect to the details page
      } else if (responseData && !responseData.success) {
        console.error('API error updating assistant:', responseData.message);
        setError(responseData.message || 'Could not update assistant.');
      } else {
        console.warn('Unexpected data format from update assistant function:', responseData);
        setError('Received unexpected data format from server when updating.');
      }
    } catch (err: any) {
      console.error('Client-side error updating assistant:', err);
      setError(err.message || 'An unexpected error occurred while updating.');
    }
    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600 mx-auto"></div>
        <p className="text-gray-700 mt-6 text-lg">Loading assistant details for editing...</p>
      </div>
    );
  }

  // if (error && fetching) { // This condition might be too specific, error can be non-blocking for form display
  // If an error occurred during fetch, and we still want to show it prominently before the form:
  if (fetching && error) { // Error during the initial load of data
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 bg-red-100 p-6 rounded-lg shadow-md text-xl">Error loading assistant data: {error}</p>
        <Link href={`/assistants/${assistantId}`} className="mt-6 inline-block text-blue-600 hover:text-blue-800">
          &larr; Back to Assistant Details
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Edit Assistant: <span className="text-blue-600">{formData.name || assistantId}</span></h1>
        <Link href="/assistants" className="text-blue-600 hover:text-blue-800">
          &larr; Back to Assistants
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
        {error && !fetching && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>} {/* Show form error only if not initial fetching error */}

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

        {/* Model Selection */}
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
          <label htmlFor="first_message" className="block text-sm font-medium text-gray-700 mb-1">First Message (Greeting)</label>
          <textarea
            id="first_message"
            name="first_message" // Use snake_case to match state and DB
            rows={3}
            value={formData.first_message}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Hello! How can I assist you today?"
          />
        </div>

        {/* System Prompt / Instructions */}
        <div className="mb-6">
          <label htmlFor="system_prompt" className="block text-sm font-medium text-gray-700 mb-1">System Prompt (Instructions)</label>
          <textarea
            id="system_prompt"
            name="system_prompt" // Use snake_case to match state and DB
            rows={5} // Make it a bit taller
            value={formData.system_prompt}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="You are a helpful assistant. Your goal is to..."
          />
        </div>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-md border border-dashed border-gray-300">
          <p className="text-sm text-gray-500 text-center">
            More assistant configuration fields will be added here.
          </p>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <Link href="/assistants" className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading || fetching}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm disabled:opacity-50 transition duration-150 ease-in-out"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
} 