/**
 * Utilitaires d'authentification avancés pour Edge Functions
 * Supporte différentes méthodes d'authentification
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { authenticationError, authorizationError } from "./errors.ts";

// Interface définissant l'utilisateur authentifié
export interface AuthUser {
  id: string;
  email: string;
  role: string;
  organization_id?: string;
}

// Types d'authentification supportés
export enum AuthType {
  JWT = "jwt", // Token JWT standard Supabase
  API_KEY = "api_key", // Clé API (header 'apikey')
  NONE = "none", // Pas d'authentification
}

// Options pour les fonctions d'authentification
export interface AuthOptions {
  authType?: AuthType | AuthType[]; // Type d'authentification à utiliser
  requiredRole?: string | string[]; // Rôle(s) requis pour l'accès
  allowTestMode?: boolean; // Autoriser le mode test
}

/**
 * Extrait le token JWT de la requête
 * @param req Requête entrante
 * @returns Token JWT ou null si non trouvé
 */
export function extractJwtToken(req: Request): string | null {
  // Vérifier le header Authorization
  const authHeader =
    req.headers.get("Authorization") || req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  // Vérifier dans les cookies
  const cookieHeader = req.headers.get("Cookie") || req.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith("sb-access-token=")) {
        return cookie.substring("sb-access-token=".length);
      }
    }
  }

  return null;
}

/**
 * Extrait la clé API de la requête
 * @param req Requête entrante
 * @returns Clé API ou null si non trouvée
 */
export function extractApiKey(req: Request): string | null {
  // Vérifier le header apikey
  const apiKey = req.headers.get("apikey") || req.headers.get("x-api-key");
  return apiKey || null;
}

/**
 * Vérifie si le mode test est activé
 * @param req Requête entrante
 * @returns True si en mode test
 */
export function isTestMode(req: Request): boolean {
  const url = new URL(req.url);
  return (
    url.searchParams.get("test") === "true" ||
    req.headers.get("x-test-mode") === "true"
  );
}

/**
 * Crée un utilisateur fictif pour le mode test
 * @returns Utilisateur de test
 */
export function createTestUser(): AuthUser {
  return {
    id: "test-user-id",
    email: "test@allokoli.com",
    role: "admin", // En mode test, l'utilisateur a tous les droits
    organization_id: "test-org-id",
  };
}

/**
 * Authentifie un utilisateur avec JWT Supabase
 * @param jwt Token JWT
 * @returns Informations utilisateur authentifié
 */
export async function authenticateWithJwt(jwt: string): Promise<AuthUser> {
  try {
    // Récupération des variables d'environnement
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    if (!supabaseUrl || !supabaseAnonKey) {
      throw authenticationError("Configuration Supabase manquante");
    }

    // Création du client Supabase
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Validation du JWT
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(jwt);

    if (error || !user) {
      throw authenticationError("Token JWT invalide", {
        error: error?.message,
      });
    }

    // Construction de l'objet utilisateur
    const userData: AuthUser = {
      id: user.id,
      email: user.email || "",
      role: (user.app_metadata?.role as string) || "user",
      organization_id:
        (user.app_metadata?.organization_id as string) || undefined,
    };

    return userData;
  } catch (error) {
    if (error.code && error.message) {
      throw error; // Déjà formaté
    }
    throw authenticationError("Erreur lors de l'authentification JWT", {
      error: error.message,
    });
  }
}

/**
 * Authentifie un utilisateur avec une clé API
 * @param apiKey Clé API
 * @returns Informations utilisateur authentifié
 */
export async function authenticateWithApiKey(
  apiKey: string
): Promise<AuthUser> {
  try {
    // Récupération des variables d'environnement
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw authenticationError("Configuration Supabase manquante");
    }

    // Création du client Supabase avec la clé service
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Vérifier si la clé API existe dans la table api_keys
    const { data, error } = await supabase
      .from("api_keys")
      .select("id, user_id, permissions")
      .eq("key", apiKey)
      .eq("is_active", true)
      .single();

    if (error || !data) {
      throw authenticationError("Clé API invalide ou inactive");
    }

    // Récupérer les informations de l'utilisateur
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id, email, role, organization_id")
      .eq("id", data.user_id)
      .single();

    if (userError || !userData) {
      throw authenticationError("Utilisateur associé à la clé API introuvable");
    }

    return {
      id: userData.id,
      email: userData.email,
      role: userData.role || "user",
      organization_id: userData.organization_id,
    };
  } catch (error) {
    if (error.code && error.message) {
      throw error; // Déjà formaté
    }
    throw authenticationError("Erreur lors de l'authentification par clé API", {
      error: error.message,
    });
  }
}

/**
 * Vérifie si l'utilisateur a un rôle requis
 * @param user Utilisateur authentifié
 * @param requiredRole Rôle(s) requis
 * @returns True si l'utilisateur a le rôle requis
 */
export function hasRequiredRole(
  user: AuthUser,
  requiredRole?: string | string[]
): boolean {
  if (!requiredRole) {
    return true; // Pas de rôle requis
  }

  if (user.role === "admin") {
    return true; // Admin a toujours accès
  }

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(user.role);
  }

  return user.role === requiredRole;
}

/**
 * Authentifie un utilisateur avec plusieurs méthodes possibles
 * @param req Requête entrante
 * @param options Options d'authentification
 * @returns Utilisateur authentifié ou erreur
 */
export async function authenticateUser(
  req: Request,
  options: AuthOptions = {}
): Promise<AuthUser> {
  // Options par défaut
  const authTypes = options.authType || [AuthType.JWT, AuthType.API_KEY];
  const authTypesArray = Array.isArray(authTypes) ? authTypes : [authTypes];

  // Vérifier le mode test si autorisé
  if (options.allowTestMode && isTestMode(req)) {
    return createTestUser();
  }

  // Essayer chaque méthode d'authentification dans l'ordre
  const errors: any[] = [];

  for (const authType of authTypesArray) {
    try {
      let user: AuthUser;

      switch (authType) {
        case AuthType.JWT:
          const jwt = extractJwtToken(req);
          if (jwt) {
            user = await authenticateWithJwt(jwt);

            // Vérifier les rôles requis
            if (!hasRequiredRole(user, options.requiredRole)) {
              throw authorizationError(
                "Rôle insuffisant pour accéder à cette ressource"
              );
            }

            return user;
          }
          break;

        case AuthType.API_KEY:
          const apiKey = extractApiKey(req);
          if (apiKey) {
            user = await authenticateWithApiKey(apiKey);

            // Vérifier les rôles requis
            if (!hasRequiredRole(user, options.requiredRole)) {
              throw authorizationError(
                "Rôle insuffisant pour accéder à cette ressource"
              );
            }

            return user;
          }
          break;

        case AuthType.NONE:
          // Aucune authentification requise
          return {
            id: "anonymous",
            email: "anonymous@allokoli.com",
            role: "anonymous",
          };
      }
    } catch (error) {
      errors.push(error);
    }
  }

  // Si on arrive ici, aucune méthode n'a fonctionné
  if (errors.length > 0) {
    throw errors[0]; // Retourner la première erreur
  }

  // Aucune authentification fournie
  throw authenticationError("Authentification requise");
}
