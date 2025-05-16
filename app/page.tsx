'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import supabase from '../lib/supabaseClient';

export default function LandingPage() {
  const [showMore, setShowMore] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    
    checkSession();
  }, []);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Conversations intelligentes avec vos <span className="text-blue-600">Assistants IA</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Créez des assistants vocaux personnalisés grâce à l'IA pour automatiser votre service client, augmenter vos ventes et optimiser vos opérations.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                Accéder au Dashboard
              </Link>
            ) : (
              <>
                <Link href="/assistants/new" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors">
                  Créer un Assistant
                </Link>
                <Link href="/auth/register" className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md border border-blue-200 hover:bg-blue-50 transition-colors">
                  S'inscrire
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Feature preview image */}
        <div className="relative mx-auto max-w-5xl rounded-lg shadow-xl overflow-hidden">
          <div className="bg-gray-800 aspect-video flex items-center justify-center">
            <div className="p-8 text-center">
              <svg className="w-20 h-20 text-blue-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
              </svg>
              <h3 className="text-2xl font-semibold text-white mb-2">Aperçu de l'interface</h3>
              <p className="text-gray-300">Interface intuitive pour créer et gérer vos assistants</p>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Fonctionnalités principales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Assistants Personnalisables</h3>
              <p className="text-gray-600">Créez des assistants sur mesure avec des personnalités et capacités adaptées à vos besoins.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="p-6 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Intégration simple</h3>
              <p className="text-gray-600">Intégrez facilement vos assistants à vos systèmes existants et applications web ou mobiles.</p>
            </div>
            
            {/* Feature 3 */}
            <div className="p-6 border border-gray-100 rounded-lg hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyses détaillées</h3>
              <p className="text-gray-600">Suivez les performances de vos assistants et obtenez des insights précieux sur les interactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à démarrer ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">Créez votre premier assistant en quelques minutes et transformez votre service client dès aujourd'hui.</p>
          <div className="flex flex-wrap justify-center gap-4">
            {isLoggedIn ? (
              <Link href="/dashboard" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100 transition-colors">
                Accéder au Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/register" className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100 transition-colors">
                  Commencer gratuitement
                </Link>
                <Link href="/auth/login" className="px-6 py-3 bg-transparent text-white font-semibold rounded-md border border-white hover:bg-blue-700 transition-colors">
                  Se connecter
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-white mb-2">Koli55</h3>
              <p>Assistants IA pour votre entreprise</p>
            </div>
            <div>
              <ul className="flex gap-6">
                {isLoggedIn ? (
                  <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                ) : (
                  <>
                    <li><Link href="/auth/login" className="hover:text-white transition-colors">Connexion</Link></li>
                    <li><Link href="/auth/register" className="hover:text-white transition-colors">Inscription</Link></li>
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-800 text-center">
            <p>© {new Date().getFullYear()} Koli55. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 