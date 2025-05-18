'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { assistantsService, CreateAssistantPayload } from '../../../../lib/api/assistantsService';
import MultiStepForm from '../../../components/ui/multi-step-form';

export default function NewAssistantPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (formData: Record<string, unknown>) => {
    setError(null);
    setLoading(true);
    try {
      // Préparer les données pour l'API
      const apiPayload: CreateAssistantPayload = {
        name: formData.name as string,
        model: {
          provider: formData.modelProvider as string,
          model: formData.modelName as string,
          systemPrompt: formData.systemPrompt as string,
        },
        voice: {
          provider: formData.voiceProvider as string,
          voiceId: formData.voiceId as string,
        },
        firstMessage: formData.firstMessage as string,
        // TODO: Amélioration future - Séparer les instructions du systemPrompt
        // Actuellement, on utilise le même texte pour les deux champs
        instructions: formData.systemPrompt as string,
      };

      // Vérification préalable des données
      if (!apiPayload.name?.trim()) {
        throw new Error("Le nom de l'assistant est requis");
      }

      console.log('Submitting assistant data:', apiPayload);
      
      // Utiliser le service pour créer l'assistant
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

  // Définition des étapes du formulaire pour notre assistant
  const formSteps = [
    {
      title: 'Informations de base',
      content: (
        <div>
          <h4 className="text-xl font-semibold mb-2">Informations de base</h4>
          <p className="text-gray-500 mb-4">Entrez les informations de base de votre assistant</p>
          
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l&apos;assistant
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ex: Assistant Commercial"
            />
          </div>
        </div>
      ),
      validationSchema: {
        required: ['name']
      }
    },
    {
      title: 'Modèle de langage',
      content: (
        <div>
          <h4 className="text-xl font-semibold mb-2">Modèle de langage</h4>
          <p className="text-gray-500 mb-4">Configurez le modèle d&apos;IA qui alimentera votre assistant</p>
          
          <div className="mb-4">
            <label htmlFor="modelProvider" className="block text-sm font-medium text-gray-700 mb-1">
              Fournisseur
            </label>
            <select
              id="modelProvider"
              name="modelProvider"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
              <option value="google">Google</option>
              <option value="cohere">Cohere</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="modelName" className="block text-sm font-medium text-gray-700 mb-1">
              Modèle
            </label>
            <select
              id="modelName"
              name="modelName"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="claude-3-opus-20240229">Claude 3 Opus</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 mb-1">
              Instructions système
            </label>
            <textarea
              id="systemPrompt"
              name="systemPrompt"
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Instructions détaillées pour guider le comportement de votre assistant"
              defaultValue="Vous êtes un assistant IA utile et sympathique."
            ></textarea>
          </div>
        </div>
      ),
      validationSchema: {
        required: ['modelProvider', 'modelName']
      }
    },
    {
      title: 'Voix',
      content: (
        <div>
          <h4 className="text-xl font-semibold mb-2">Configuration de la voix</h4>
          <p className="text-gray-500 mb-4">Sélectionnez la voix qui sera utilisée par votre assistant</p>
          
          <div className="mb-4">
            <label htmlFor="voiceProvider" className="block text-sm font-medium text-gray-700 mb-1">
              Fournisseur de voix
            </label>
            <select
              id="voiceProvider"
              name="voiceProvider"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="11labs">ElevenLabs</option>
              <option value="azure">Azure</option>
              <option value="deepgram">Deepgram</option>
              <option value="play.ht">Play.ht</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="voiceId" className="block text-sm font-medium text-gray-700 mb-1">
              Voix
            </label>
            <select
              id="voiceId"
              name="voiceId"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="jennifer">Jennifer</option>
              <option value="rachel">Rachel</option>
              <option value="antoine">Antoine</option>
              <option value="josh">Josh</option>
            </select>
          </div>
        </div>
      ),
      validationSchema: {
        required: ['voiceProvider', 'voiceId']
      }
    },
    {
      title: 'Messages',
      content: (
        <div>
          <h4 className="text-xl font-semibold mb-2">Messages de l'assistant</h4>
          <p className="text-gray-500 mb-4">Configurez les messages utilisés par votre assistant</p>
          
          <div className="mb-4">
            <label htmlFor="firstMessage" className="block text-sm font-medium text-gray-700 mb-1">
              Premier message
            </label>
            <textarea
              id="firstMessage"
              name="firstMessage"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Message d'accueil que dira votre assistant au début de la conversation"
              defaultValue="Bonjour ! Comment puis-je vous aider aujourd'hui ?"
            ></textarea>
          </div>
          
          <div className="mb-4">
            <label htmlFor="endCallMessage" className="block text-sm font-medium text-gray-700 mb-1">
              Message de fin d'appel
            </label>
            <textarea
              id="endCallMessage"
              name="endCallMessage"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Message que dira votre assistant avant de raccrocher (optionnel)"
              defaultValue="Merci pour votre appel. Au revoir !"
            ></textarea>
          </div>
        </div>
      ),
      validationSchema: {
        required: ['firstMessage']
      }
    }
  ];

  const initialValues = {
    name: '',
    modelProvider: 'openai',
    modelName: 'gpt-4o',
    systemPrompt: 'Vous êtes un assistant IA utile et sympathique.',
    voiceProvider: '11labs',
    voiceId: 'jennifer',
    firstMessage: 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
    endCallMessage: 'Merci pour votre appel. Au revoir !'
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Créer un nouvel Assistant</h1>
        <Link href="/assistants" className="text-blue-600 hover:text-blue-800">
          &larr; Retour aux Assistants
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          <p className="font-semibold">Erreur:</p>
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

      <div className="bg-white rounded-lg shadow-md">
        <MultiStepForm 
          steps={formSteps}
          initialValues={initialValues}
          onFinish={handleSubmit}
          loading={loading}
          finishButtonText="Créer l'assistant"
          nextButtonText="Suivant"
          prevButtonText="Précédent"
        />
      </div>
    </div>
  );
} 