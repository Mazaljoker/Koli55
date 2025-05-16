'use client';

import { useAuth } from '../lib/auth';
import Link from 'next/link';

export default function Home() {
  const { user, signOut, loading } = useAuth();
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 md:p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">Koli55</h1>
          
          <div>
            {loading ? (
              <p>Chargement...</p>
            ) : user ? (
              <div className="flex gap-4 items-center">
                <span>Connecté : {user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-sm"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link href="/auth/login" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
                  Connexion
                </Link>
                <Link href="/auth/register" className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md">
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-xl mb-8">Intégration Vapi et Supabase</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="border border-gray-300 p-6 rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Assistants</h2>
            <p className="mb-4">Gérez vos assistants vocaux</p>
            <Link 
              href="/assistants"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              Voir les assistants
            </Link>
          </div>
          
          <div className="border border-gray-300 p-6 rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Workflows</h2>
            <p className="mb-4">Créez des flux d'appels avancés</p>
            <Link 
              href="/workflows"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              Voir les workflows
            </Link>
          </div>
          
          <div className="border border-gray-300 p-6 rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Numéros</h2>
            <p className="mb-4">Gérez vos numéros de téléphone</p>
            <Link 
              href="/phone-numbers"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              Voir les numéros
            </Link>
          </div>
          
          <div className="border border-gray-300 p-6 rounded-lg hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-bold mb-4">Appels</h2>
            <p className="mb-4">Historique et analyses des appels</p>
            <Link 
              href="/calls"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
            >
              Voir les appels
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 