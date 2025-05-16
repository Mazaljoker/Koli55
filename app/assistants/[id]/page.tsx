'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import supabase from '../../../lib/supabaseClient'; // Corrigé: 3 niveaux pour remonter de app/assistants/[id]

// Define a type for the assistant details (can be expanded)
interface AssistantDetails {
  id: string;
  name: string;
  model?: string; // Les champs de la table sont nullable, donc optionnels ici
  language?: string;
  voice?: string;
  first_message?: string; // Note: snake_case from DB
  system_prompt?: string; // Note: snake_case from DB
  vapi_assistant_id?: string; // Note: snake_case from DB
  created_at?: string;
  updated_at?: string;
  // TODO: ajouter d'autres champs pertinents (metadata, tools_config, etc.)
}

export default function AssistantDetailsPage() {
  const params = useParams();
  const assistantId = params?.id as string; // Ceci est l'ID de la DB (UUID)
  const router = useRouter(); // Initialize router

  const [assistant, setAssistant] = useState<AssistantDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false); // State for delete button

  useEffect(() => {
    if (assistantId) {
      const fetchAssistantDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          // L'ID est passé dans le nom de la fonction pour correspondre à la route /assistants/:id
          const { data: responseData, error: apiError } = await supabase.functions.invoke(
            `assistants/${assistantId}`,
            { method: 'GET' }
          );

          if (apiError) {
            console.error('Supabase function invoke error:', apiError);
            throw new Error(apiError.message || 'Failed to fetch assistant details.');
          }

          if (responseData && responseData.success && responseData.data) {
            setAssistant(responseData.data as AssistantDetails);
          } else if (responseData && !responseData.success) {
            console.error('API error fetching assistant details:', responseData.message);
            setError(responseData.message || 'Assistant not found or access denied.');
            setAssistant(null); // Ensure assistant is null on error/failure
          } else {
            // This case implies responseData exists but isn't in the expected { success, data } format,
            // or responseData.data is missing when success is true.
            console.warn('Unexpected data format from assistant details function:', responseData);
            setError('Received unexpected data format from server.');
            setAssistant(null); // Ensure assistant is null
          }
        } catch (err: any) {
          console.error('Client-side error fetching assistant details:', err);
          setError(err.message || 'An unexpected error occurred.');
          setAssistant(null); // Ensure assistant is null on catch
        }
        setLoading(false);
      };
      fetchAssistantDetails();
    } else {
      // If assistantId is not available (e.g. params.id is undefined),
      // we might be waiting for router hydration or it's genuinely missing.
      // Setting loading to false here if it wasn't already, and an error if it persists.
      // This helps avoid showing "loading" forever if ID never arrives.
      // If it's just a brief moment before ID is available, the initial `loading` state covers it.
      setLoading(false);
      setError('Assistant ID is missing. Cannot fetch details.');
    }
  }, [assistantId]); // Only re-run if assistantId changes

  const handleDelete = async () => {
    if (!assistantId) {
      setError('Cannot delete: Assistant ID is missing.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this assistant? This action cannot be undone.')) {
      return;
    }
    setIsDeleting(true);
    setError(null); // Clear previous errors
    try {
      const { data: responseData, error: apiError } = await supabase.functions.invoke(
        `assistants/${assistantId}`,
        { method: 'DELETE' }
      );

      if (apiError) {
        console.error('Supabase function invoke error (delete):', apiError);
        throw new Error(apiError.message || 'Failed to delete assistant.');
      }

      if (responseData && responseData.success) {
        // alert('Assistant deleted successfully!'); // Optional success message
        router.push('/assistants'); // Redirect to the list page
      } else if (responseData && !responseData.success) {
        console.error('API error deleting assistant:', responseData.message);
        setError(responseData.message || 'Could not delete assistant.');
      } else {
        console.warn('Unexpected response from delete assistant function:', responseData);
        setError('Received an unexpected response from the server during deletion.');
      }
    } catch (err: any) {
      console.error('Client-side error deleting assistant:', err);
      setError(err.message || 'An unexpected error occurred while deleting.');
    }
    setIsDeleting(false);
  };

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
        <p className="text-gray-700 mt-6 text-lg">Loading assistant details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-600 bg-red-100 p-6 rounded-lg shadow-md text-xl">Error: {error}</p>
        <Link href="/assistants" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
          &larr; Back to Assistants List
        </Link>
      </div>
    );
  }

  if (!assistant) {
    // This state is reached if loading is false AND assistant is still null.
    // This can be due to an error (handled above, which also sets assistant to null),
    // or if the fetch completed successfully but no assistant was found (e.g., responseData.data was null/undefined),
    // or if assistantId was never available.
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-gray-700 bg-gray-100 p-6 rounded-lg shadow-md text-xl">
          {error ? error : 'Assistant not found or ID is unavailable.'}
        </p>
        <Link href="/assistants" className="mt-6 inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md">
          &larr; Back to Assistants List
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 md:mb-0">Assistant: <span className="text-blue-700 break-all">{assistant.name}</span></h1>
        <div className="flex space-x-3 self-start md:self-center">
          <Link href={`/assistants/${assistant.id}/edit`} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out text-lg">
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out text-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
          <Link href="/assistants" className="text-blue-700 hover:text-blue-800 py-2 px-4 border border-blue-700 rounded-md text-lg">
            &larr; Back to List
          </Link>
        </div>
      </div>

      {/* Display error message related to delete action if it occurs */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-center">
          <p>Error: {error}</p>
        </div>
      )}

      <div className="bg-white p-6 md:p-8 rounded-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 lg:gap-x-8 gap-y-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
            <p className="text-lg text-gray-900 font-semibold break-words">{assistant.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Database ID</h3>
            <p className="text-xs sm:text-sm text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded break-all">{assistant.id}</p>
          </div>
          {assistant.vapi_assistant_id && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Vapi Assistant ID</h3>
              <p className="text-xs sm:text-sm text-gray-700 font-mono bg-gray-100 px-2 py-1 rounded break-all">{assistant.vapi_assistant_id}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Language Model</h3>
            <p className="text-lg text-gray-900">{assistant.model || 'Not set'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Language</h3>
            <p className="text-lg text-gray-900">{assistant.language || 'Not set'}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Voice</h3>
            <p className="text-lg text-gray-900">{assistant.voice || 'Not set'}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-1">First Message (Greeting)</h3>
          <div className="text-lg text-gray-900 bg-gray-50 p-4 rounded-md whitespace-pre-wrap shadow-sm break-words">{assistant.first_message || 'Not set'}</div>
        </div>

        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-1">System Prompt (Instructions)</h3>
          <div className="text-lg text-gray-900 bg-gray-50 p-4 rounded-md whitespace-pre-wrap shadow-sm break-words">{assistant.system_prompt || 'Not set'}</div>
        </div>
        
        {(assistant.created_at || assistant.updated_at) && (
           <div className="text-xs text-gray-500 border-t pt-4 mb-8">
                {assistant.created_at && <p>Created: {new Date(assistant.created_at).toLocaleString()}</p>}
                {assistant.updated_at && <p>Last Updated: {new Date(assistant.updated_at).toLocaleString()}</p>}
           </div>
        )}

        {/* Placeholder for Tools, Knowledge Base, etc. */}
        <div className="mb-8">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Additional Configuration</h3>
          <p className="text-gray-400 italic text-sm">Display for Tools, Knowledge Base linking, and other metadata will be shown here when available.</p>
        </div>

        <div className="border-t pt-8 mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Actions</h3>
            <button 
                onClick={() => alert('Call functionality not implemented yet.')}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out text-lg disabled:opacity-60"
            >
                Start Call with this Assistant
            </button>
            <p className="text-sm text-gray-600 mt-3 italic">This will integrate with Vapi SDK/Blocks to initiate a call.</p>
        </div>

      </div>
    </div>
  );
} 