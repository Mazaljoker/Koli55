'use client';

import { createClient } from '@supabase/supabase-js';

// URL et clé pour l'instance Supabase Docker locale
// Par défaut, Supabase en local utilise ces valeurs
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9reWh3cWJvaGRqZWNodXh0Y3RiIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc4NzI2NDEsImV4cCI6MjAwMzQ0ODY0MX0.R7Sezuhy-s4xSE__vHx7X5eQwJNAp-8B_5q1qO4SzSU';

// Création du client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction pour vérifier la connexion à Supabase
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('health_check').select('*').limit(1);
    
    if (error) {
      console.error('Erreur de connexion à Supabase:', error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (err) {
    console.error('Exception lors de la vérification de connexion Supabase:', err);
    return { success: false, error: err };
  }
} 