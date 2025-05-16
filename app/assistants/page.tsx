'use client';

import { useAuth } from '../../lib/auth';
import Link from 'next/link';

export default function AssistantsPage() {
  const { user } = useAuth();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Mes Assistants</h1>
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          Retour à l'accueil
        </Link>
      </div>
      
      <p className="mb-6">Bienvenue, {user?.email} ! Voici vos assistants vocaux.</p>
      
      <div className="flex justify-end mb-6">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Nouvel Assistant
        </button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-4">
        <p className="text-gray-500 text-center py-8">
          Vous n'avez pas encore d'assistants. Créez-en un pour commencer.
        </p>
      </div>
    </div>
  );
} 