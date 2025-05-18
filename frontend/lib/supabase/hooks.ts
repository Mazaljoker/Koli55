'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabase-client';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

// Hook pour gérer la session utilisateur avec Supabase
export function useSupabaseAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Récupérer la session actuelle
    const fetchSession = async () => {
      try {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setSession(session);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    // Exécuter la fonction au chargement
    fetchSession();
    
    // S'abonner aux changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
        setSession(session);
      }
    );

    // Nettoyer l'abonnement
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fonction pour se connecter avec email/mot de passe
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour se déconnecter
  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    session,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!session,
  };
} 