/**
 * Middleware d'authentification pour les Edge Functions Supabase
 * Vérifie les JWT et extrait les informations de l'utilisateur
 */

// @deno-types="https://esm.sh/@supabase/supabase-js@2"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { authenticationError, authorizationError } from './errors.ts'

// Interface définissant l'utilisateur authentifié
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  organization_id?: string;
}

// Déclaration pour Deno namespace
declare global {
  interface Window {
    Deno: {
      env: {
        get(key: string): string | undefined;
      };
    };
  }
}

// Utilitaire pour accéder à Deno avec typage
const DenoEnv = {
  get: (key: string): string | undefined => {
    // @ts-ignore - Deno existe dans l'environnement d'exécution
    return typeof Deno !== 'undefined' ? Deno.env.get(key) : undefined;
  }
};

/**
 * Authentifie une requête entrante et retourne les informations utilisateur
 * @param req Requête entrante
 * @returns Informations de l'utilisateur authentifié
 * @throws {FormattedError} Si l'authentification échoue
 */
export async function authenticate(req: Request): Promise<AuthUser> {
  // Récupération du JWT
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    throw authenticationError('Token d\'authentification manquant')
  }

  // Format: Bearer <token>
  const jwt = authHeader.replace('Bearer ', '')
  if (!jwt) {
    throw authenticationError('Format de token invalide')
  }

  try {
    // Création d'un client Supabase pour valider le token
    const supabaseUrl = DenoEnv.get('SUPABASE_URL') || ''
    const supabaseAnonKey = DenoEnv.get('SUPABASE_ANON_KEY') || ''
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw authenticationError('Configuration Supabase manquante')
    }
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey)

    // Validation du JWT
    const { data: { user }, error } = await supabase.auth.getUser(jwt)

    if (error || !user) {
      throw authenticationError('Utilisateur non authentifié', { error: error?.message })
    }

    // Récupération des métadonnées utilisateur
    const userData: AuthUser = {
      id: user.id,
      email: user.email || '',
      role: (user.app_metadata?.role as string) || 'user',
      organization_id: (user.app_metadata?.organization_id as string) || undefined,
    }

    return userData
  } catch (error: unknown) {
    // Typage de l'erreur pour l'accès aux propriétés
    const err = error as { code?: string; message?: string };
    if (err.code && err.message) {
      throw error // Déjà formaté par les fonctions d'erreur
    }
    throw authenticationError('Erreur lors de l\'authentification', { error: err.message || 'Erreur inconnue' })
  }
}

/**
 * Vérifie si l'utilisateur a un rôle administrateur
 * @param user Informations de l'utilisateur authentifié
 * @returns true si l'utilisateur est admin
 * @throws {FormattedError} Si l'utilisateur n'est pas admin
 */
export function verifyAdmin(user: AuthUser): boolean {
  if (user.role !== 'admin') {
    throw authorizationError('Accès non autorisé: rôle administrateur requis')
  }
  return true
}

/**
 * Vérifie que l'utilisateur appartient à l'organisation spécifiée
 * @param user Informations de l'utilisateur authentifié
 * @param organizationId ID de l'organisation à vérifier
 * @returns true si l'utilisateur appartient à l'organisation
 * @throws {FormattedError} Si l'utilisateur n'appartient pas à l'organisation
 */
export function verifyOrganization(user: AuthUser, organizationId: string): boolean {
  if (user.organization_id !== organizationId && user.role !== 'admin') {
    throw authorizationError('Accès non autorisé: organisation incorrecte')
  }
  return true
} 