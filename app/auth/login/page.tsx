'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import supabase from '../../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Vérifier si l'utilisateur est déjà connecté au chargement de la page
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        console.log("Session détectée au chargement de la page de login, redirection vers dashboard");
        // Si l'utilisateur est déjà connecté, le rediriger vers le dashboard
        localStorage.setItem('auth_redirect_attempted', 'true');
        router.push('/dashboard');
      } else {
        // Vérifier si nous venons d'essayer de nous connecter
        const justAuthenticated = localStorage.getItem('just_authenticated');
        if (justAuthenticated === 'true') {
          console.log("Retour sur login après authentification réussie, tentative de secours");
          localStorage.removeItem('just_authenticated');
          // Ajouter un token temporaire pour contourner le problème
          localStorage.setItem('temp_auth_token', 'true');
          router.push('/dashboard');
        }
      }
    };
    
    checkSession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login handleSubmit started');
    setError('');
    setLoading(true);
    try {
      console.log('Attempting Supabase sign-in with email:', email);
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      console.log('Supabase sign-in completed. Data:', data, 'Error:', signInError);

      if (signInError) {
        console.error('Supabase signInError:', signInError);
        throw signInError;
      }
      
      console.log('Sign-in successful, attempting to redirect to /dashboard');
      
      // Attendre un court instant pour permettre à la session d'être complètement établie
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Vérifier que la session est bien établie avant de rediriger
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      console.log('Session après login:', currentSession);
      
      // Marquer que nous venons de nous authentifier avec succès
      localStorage.setItem('just_authenticated', 'true');
      
      if (currentSession) {
        // Stockage temporaire pour contourner les problèmes de middleware
        localStorage.setItem('temp_auth_token', 'true');
        router.push('/dashboard');
        console.log('Redirection to /dashboard initiated');
      } else {
        console.error('Session not established after login');
        setError('Problème de session. Veuillez réessayer.');
      }
    } catch (err: any) {
      console.error('Login error in catch block:', err);
      setError(err.message || 'Failed to login. Please check your credentials.');
    }
    setLoading(false);
    console.log('Login handleSubmit finished');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md shadow-sm disabled:opacity-50 transition duration-150 ease-in-out"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
} 