'use client';

import React, { useEffect, useState } from 'react';
import { checkSupabaseConnection } from '../../lib/supabase/client';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

export function SupabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const result = await checkSupabaseConnection();
      
      if (result.success) {
        setStatus('connected');
      } else {
        setStatus('error');
        setError(
          result.error && typeof result.error === 'object' && 'message' in result.error 
            ? result.error.message as string 
            : 'Erreur inconnue'
        );
      }
    };

    checkConnection();
  }, []);

  return (
    <div className="flex items-center space-x-2">
      {status === 'loading' && (
        <>
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          <span className="text-sm text-gray-600">Vérification de la connexion Supabase...</span>
        </>
      )}
      
      {status === 'connected' && (
        <>
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-sm text-green-600">Connecté à Supabase</span>
        </>
      )}
      
      {status === 'error' && (
        <>
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-600">
            Erreur de connexion à Supabase{error ? `: ${error}` : ''}
          </span>
        </>
      )}
    </div>
  );
} 