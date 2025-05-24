/**
 * Validation des données entrantes pour les Edge Functions
 * Utilitaires pour valider les structures de données et paramètres
 */

import { validationError } from './errors.ts'

/**
 * Interface définissant les règles de validation
 */
export interface ValidationRule {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'object' | 'array';
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enum?: any[];
  validate?: (value: any) => boolean;
  message?: string;
}

/**
 * Type définissant un schéma de validation
 */
export type ValidationSchema = Record<string, ValidationRule>;

/**
 * Valide un objet contre un schéma de validation
 * @param data Données à valider
 * @param schema Schéma de validation
 * @throws {FormattedError} Si la validation échoue
 */
export function validateInput<T extends Record<string, any>>(
  data: T, 
  schema: ValidationSchema
): T {
  const errors: Record<string, string> = {};
  
  // Parcours de chaque champ du schéma
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Vérification si le champ est requis
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors[field] = rules.message || `Le champ '${field}' est requis`;
      continue;
    }
    
    // Si le champ n'est pas fourni et n'est pas requis, on passe
    if (value === undefined || value === null) {
      continue;
    }
    
    // Validation du type
    if (rules.type) {
      let typeValid = true;
      switch (rules.type) {
        case 'string':
          typeValid = typeof value === 'string';
          break;
        case 'number':
          typeValid = typeof value === 'number' && !isNaN(value);
          break;
        case 'boolean':
          typeValid = typeof value === 'boolean';
          break;
        case 'object':
          typeValid = typeof value === 'object' && !Array.isArray(value);
          break;
        case 'array':
          typeValid = Array.isArray(value);
          break;
      }
      
      if (!typeValid) {
        errors[field] = rules.message || `Le champ '${field}' doit être de type ${rules.type}`;
        continue;
      }
    }
    
    // Validation de longueur pour les chaînes
    if (typeof value === 'string') {
      if (rules.minLength !== undefined && value.length < rules.minLength) {
        errors[field] = rules.message || `Le champ '${field}' doit contenir au moins ${rules.minLength} caractères`;
        continue;
      }
      
      if (rules.maxLength !== undefined && value.length > rules.maxLength) {
        errors[field] = rules.message || `Le champ '${field}' ne peut pas dépasser ${rules.maxLength} caractères`;
        continue;
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors[field] = rules.message || `Le format du champ '${field}' est invalide`;
        continue;
      }
    }
    
    // Validation min/max pour les nombres
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors[field] = rules.message || `Le champ '${field}' doit être supérieur ou égal à ${rules.min}`;
        continue;
      }
      
      if (rules.max !== undefined && value > rules.max) {
        errors[field] = rules.message || `Le champ '${field}' doit être inférieur ou égal à ${rules.max}`;
        continue;
      }
    }
    
    // Validation d'énumération
    if (rules.enum && !rules.enum.includes(value)) {
      errors[field] = rules.message || `La valeur '${value}' n'est pas autorisée pour le champ '${field}'`;
      continue;
    }
    
    // Validation personnalisée
    if (rules.validate && !rules.validate(value)) {
      errors[field] = rules.message || `La validation a échoué pour le champ '${field}'`;
      continue;
    }
  }
  
  // Si des erreurs sont présentes, on lance une exception
  if (Object.keys(errors).length > 0) {
    throw validationError('Validation des données échouée', { errors });
  }
  
  return data;
}

/**
 * Valide les paramètres de pagination
 * @param params Paramètres de requête avec page et limit
 * @returns Paramètres de pagination validés
 */
export function validatePagination(params: URLSearchParams): { page: number, limit: number } {
  const pageParam = params.get('page');
  const limitParam = params.get('limit');
  
  let page = 1;
  let limit = 20;
  
  if (pageParam) {
    const parsedPage = parseInt(pageParam, 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      page = parsedPage;
    }
  }
  
  if (limitParam) {
    const parsedLimit = parseInt(limitParam, 10);
    if (!isNaN(parsedLimit) && parsedLimit > 0 && parsedLimit <= 100) {
      limit = parsedLimit;
    }
  }
  
  return { page, limit };
}

/**
 * Extrait et valide un identifiant à partir d'une URL
 * @param url URL contenant l'identifiant
 * @param position Position de l'identifiant dans le chemin (par défaut le dernier segment)
 * @returns Identifiant validé
 * @throws {FormattedError} Si l'identifiant est invalide ou manquant
 */
export function extractId(url: URL, position = -1): string {
  const pathSegments = url.pathname.split('/').filter(segment => segment);
  const id = position < 0 ? pathSegments[pathSegments.length + position] : pathSegments[position];
  
  if (!id) {
    throw validationError('Identifiant manquant dans l\'URL');
  }
  
  return id;
}

/**
 * Sanitise une chaîne de caractères
 * @param input Chaîne à sanitiser
 * @returns Chaîne sanitisée
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
}

/**
 * Sanitise un objet en nettoyant toutes ses propriétés string
 * @param obj Objet à sanitiser
 * @returns Objet sanitisé
 */
export function sanitizeObject(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  return obj;
}

/**
 * Vérifie si une chaîne est un UUID valide
 * @param id Chaîne à vérifier
 * @returns true si c'est un UUID valide
 */
export function isValidUUID(id: string): boolean {
  if (typeof id !== 'string') return false;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * Valide les données d'un assistant
 * @param data Données de l'assistant à valider
 * @returns Résultat de validation
 */
export function validateAssistantData(data: any): { isValid: boolean; errors?: string[] } {
  const errors: string[] = [];
  
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.push('Le nom de l\'assistant est requis');
  }
  
  if (data.name && data.name.length > 100) {
    errors.push('Le nom de l\'assistant ne peut pas dépasser 100 caractères');
  }
  
  // Validation optionnelle du modèle
  if (data.model && typeof data.model === 'object') {
    if (!data.model.provider || !data.model.model) {
      errors.push('Le modèle doit contenir un provider et un model');
    }
  }
  
  // Validation optionnelle de la voix
  if (data.voice && typeof data.voice === 'object') {
    if (!data.voice.provider || !data.voice.voiceId) {
      errors.push('La voix doit contenir un provider et un voiceId');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}

/**
 * Valide les permissions d'accès à une ressource
 * @param userRole Rôle de l'utilisateur
 * @param userId ID de l'utilisateur
 * @param resourceUserId ID du propriétaire de la ressource
 * @param metadata Métadonnées de la ressource
 * @returns Résultat de validation des permissions
 */
export function validatePermissions(
  userRole: string,
  userId: string,
  resourceUserId: string | null,
  metadata?: any
): { isValid: boolean; errors?: string[] } {
  const errors: string[] = [];
  
  // Les administrateurs ont accès à tout
  if (userRole === 'admin') {
    return { isValid: true };
  }
  
  // Les utilisateurs peuvent accéder à leurs propres ressources
  if (userId === resourceUserId) {
    return { isValid: true };
  }
  
  // Les utilisateurs de test ne peuvent accéder qu'aux ressources de test
  if (userRole === 'test') {
    if (!metadata || metadata.is_test !== 'true') {
      errors.push('Accès refusé aux ressources non-test');
    }
  }
  
  // Si resourceUserId est null et qu'on est en mode développement, autoriser
  if (!resourceUserId && userRole === 'authenticated') {
    return { isValid: true };
  }
  
  if (errors.length === 0 && userId !== resourceUserId) {
    errors.push('Accès refusé à cette ressource');
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
} 