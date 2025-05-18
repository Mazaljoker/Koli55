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
 * Module de validation des données pour les fonctions Edge
 * 
 * Ce module fournit des fonctions pour valider les entrées avant traitement
 * et prévenir les injections SQL, XSS, etc.
 */

/**
 * Sanitize une chaîne pour éviter les injections SQL et XSS
 * @param input Chaîne à sanitizer
 * @returns Chaîne sanitizée
 */
export function sanitizeString(input: string | null | undefined): string {
  if (input === null || input === undefined) {
    return '';
  }
  
  // Convertir en chaîne si nécessaire
  const str = String(input);
  
  // Échapper les caractères spéciaux pour éviter les injections
  return str
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/`/g, '&#96;')
    .replace(/\$/g, '&#36;')
    .trim();
}

/**
 * Vérifie si une chaîne est un UUID valide
 * @param uuid Chaîne à vérifier
 * @returns true si la chaîne est un UUID valide, false sinon
 */
export function isValidUUID(uuid: string): boolean {
  if (!uuid) return false;
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

/**
 * Vérifie si une valeur est un nombre valide
 * @param value Valeur à vérifier
 * @returns true si la valeur est un nombre valide, false sinon
 */
export function isValidNumber(value: any): boolean {
  if (value === undefined || value === null) return false;
  return !isNaN(Number(value)) && isFinite(Number(value));
}

/**
 * Vérifie si un objet est sûr pour insertion en base de données
 * @param obj Objet à vérifier
 * @returns Objet nettoyé
 */
export function sanitizeObject(obj: any): any {
  if (!obj || typeof obj !== 'object') {
    return {};
  }
  
  const result: any = {};
  
  // Parcourir les propriétés de l'objet
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      
      // Sanitizer récursivement selon le type
      if (typeof value === 'string') {
        result[key] = sanitizeString(value);
      } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        result[key] = sanitizeObject(value);
      } else if (Array.isArray(value)) {
        result[key] = value.map(item => {
          if (typeof item === 'string') {
            return sanitizeString(item);
          } else if (typeof item === 'object' && item !== null) {
            return sanitizeObject(item);
          }
          return item;
        });
      } else {
        // Valeurs primitives (number, boolean, null, undefined)
        result[key] = value;
      }
    }
  }
  
  return result;
}

/**
 * Interface pour les résultats de validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Valide les données d'un assistant
 * @param data Données à valider
 * @returns Résultat de la validation
 */
export function validateAssistantData(data: any): ValidationResult {
  const errors: string[] = [];
  
  // Vérifier les champs obligatoires
  if (!data) {
    errors.push('No data provided');
    return { isValid: false, errors };
  }
  
  // Vérifier le nom (obligatoire)
  if (!data.name) {
    errors.push('Name is required');
  } else if (typeof data.name !== 'string') {
    errors.push('Name must be a string');
  } else if (data.name.length < 1 || data.name.length > 100) {
    errors.push('Name must be between 1 and 100 characters');
  }
  
  // Vérifier le modèle si spécifié
  if (data.model !== undefined) {
    if (typeof data.model !== 'string' && typeof data.model !== 'object') {
      errors.push('Model must be a string or an object');
    }
  }
  
  // Vérifier la langue si spécifiée
  if (data.language !== undefined && typeof data.language !== 'string') {
    errors.push('Language must be a string');
  }
  
  // Vérifier la voix si spécifiée
  if (data.voice !== undefined) {
    if (typeof data.voice !== 'string' && typeof data.voice !== 'object') {
      errors.push('Voice must be a string or an object');
    }
  }
  
  // Vérifier les paramètres numériques
  if (data.silence_timeout_seconds !== undefined && !isValidNumber(data.silence_timeout_seconds)) {
    errors.push('Silence timeout seconds must be a valid number');
  }
  
  if (data.max_duration_seconds !== undefined && !isValidNumber(data.max_duration_seconds)) {
    errors.push('Max duration seconds must be a valid number');
  }
  
  // Vérifier les paramètres booléens
  if (data.end_call_after_silence !== undefined && typeof data.end_call_after_silence !== 'boolean') {
    errors.push('End call after silence must be a boolean');
  }
  
  if (data.voice_reflection !== undefined && typeof data.voice_reflection !== 'boolean') {
    errors.push('Voice reflection must be a boolean');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Valide une requête d'API pour vérifier les permissions
 * @param userRole Rôle de l'utilisateur
 * @param userId ID de l'utilisateur
 * @param assistantUserId ID de l'utilisateur propriétaire de l'assistant (optionnel)
 * @param metadata Métadonnées de l'assistant (optionnel)
 * @returns Résultat de la validation
 */
export function validatePermissions(
  userRole: string, 
  userId: string | null,
  assistantUserId?: string | null,
  metadata?: any
): ValidationResult {
  const errors: string[] = [];
  
  // Vérifier si l'utilisateur est authentifié
  if (!userId) {
    errors.push('User must be authenticated');
    return { isValid: false, errors };
  }
  
  // Cas où on vérifie l'accès à un assistant existant
  if (assistantUserId) {
    // Les administrateurs ont accès à tous les assistants
    if (userRole === 'admin') {
      return { isValid: true, errors: [] };
    }
    
    // Les utilisateurs standard ont accès uniquement à leurs propres assistants
    if (userRole === 'authenticated' && userId !== assistantUserId) {
      errors.push('User does not have permission to access this assistant');
    }
    
    // Les utilisateurs de test ont accès uniquement aux assistants marqués comme 'is_test'
    if (userRole === 'test') {
      if (!metadata || metadata.is_test !== 'true') {
        errors.push('Test users can only access test assistants');
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
} 