'use client';

import React, { useEffect, useState } from 'react';
import { checkSupabaseConnection } from '../../lib/supabase/client';
import { AlertCircle, CheckCircle, InfoIcon, Loader2 } from 'lucide-react';

export function SupabaseStatus() {
  const [status, setStatus] = useState<'loading' | 'connected' | 'warning' | 'error'>('loading');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const result = await checkSupabaseConnection();
        
        if (result.success) {
          setStatus('connected');
          if (result.warning) {
            setStatus('warning');
            setMessage(result.warning);
          }
        } else {
          setStatus('error');
          
          // Gestion améliorée des erreurs
          if (result.error) {
            if (typeof result.error === 'object') {
              if ('message' in result.error) {
                setMessage(result.error.message as string);
              } else if ('code' in result.error) {
                setMessage(`Erreur ${result.error.code}: Vérifiez votre fichier .env.local`);
              } else {
                setMessage(JSON.stringify(result.error).substring(0, 100));
              }
            } else {
              setMessage(String(result.error));
            }
          } else {
            setMessage('Erreur inconnue de connexion à Supabase');
          }
        }
      } catch (error) {
        setStatus('error');
        setMessage('Exception lors de la vérification: ' + (error instanceof Error ? error.message : String(error)));
      }
    };

    checkConnection();
  }, []);

  const renderStatusContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span className="text-sm text-gray-600">Vérification de la connexion Supabase Cloud...</span>
          </>
        );
      
      case 'connected':
        return (
          <>
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm text-green-600">Connecté à Supabase Cloud</span>
          </>
        );
      
      case 'warning':
        return (
          <>
            <InfoIcon className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-amber-600">
              Connecté à Supabase Cloud avec avertissement: {message}
            </span>
          </>
        );
      
      case 'error':
        return (
          <>
            <AlertCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm text-red-600">
              Erreur de connexion à Supabase Cloud{message ? `: ${message}` : ''}
            </span>
            <div className="mt-1 text-xs text-gray-500">
              Vérifiez vos variables d'environnement dans <code>.env.local</code> et assurez-vous qu'elles pointent vers votre projet Supabase Cloud.
            </div>
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2">
        {renderStatusContent()}
      </div>
    </div>
  );
} 