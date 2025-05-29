/**
 * Utilitaire pour normaliser les chemins d'URL des Edge Functions
 * Permet de gérer différents formats d'URL Supabase (v1, sans v1, etc.)
 */

/**
 * Extrait le nom de l'Edge Function et le chemin relatif à partir d'un chemin complet
 * Gère plusieurs formats d'URL Supabase
 * @param path Chemin complet de l'URL
 * @param functionName Nom de l'Edge Function à extraire
 * @returns {object} Objet contenant functionName et relativePath
 */
export function extractPathInfo(
  path: string,
  functionName: string
): {
  functionName: string;
  relativePath: string;
} {
  // Nettoyer le chemin
  path = path.replace(/\/+$/, ""); // Supprimer les slashes de fin

  // Différents patterns possibles pour les URLs Supabase
  const patterns = [
    `/functions/v1/${functionName}/`, // Format standard: /functions/v1/function-name/path
    `/${functionName}/`, // Format court: /function-name/path
    `/functions/${functionName}/`, // Format sans version: /functions/function-name/path
    `/rest/v1/functions/${functionName}/`, // Format REST API: /rest/v1/functions/function-name/path
  ];

  // Trouver quel pattern correspond
  let matchedPattern = "";
  for (const pattern of patterns) {
    if (path.includes(pattern)) {
      matchedPattern = pattern;
      break;
    }
  }

  // Si aucun pattern ne correspond, vérifier si c'est juste le nom de la fonction sans slash
  if (!matchedPattern) {
    const endOfPath =
      path.endsWith(`/${functionName}`) || path.endsWith(`/${functionName}/`);
    const functionInPath =
      path.includes(`/functions/v1/${functionName}`) ||
      path.includes(`/${functionName}`) ||
      path.includes(`/functions/${functionName}`) ||
      path.includes(`/rest/v1/functions/${functionName}`);

    if (endOfPath || functionInPath) {
      return {
        functionName,
        relativePath: "/",
      };
    }

    // Aucune correspondance trouvée, retourner chemin par défaut
    return {
      functionName,
      relativePath: path,
    };
  }

  // Extraire le chemin relatif
  const relativePath =
    path.substring(path.indexOf(matchedPattern) + matchedPattern.length - 1) ||
    "/";

  return {
    functionName,
    relativePath,
  };
}

/**
 * Construit une URL complète pour une Edge Function
 * @param basePath Base de l'URL (ex: https://xxx.supabase.co)
 * @param functionName Nom de l'Edge Function
 * @param relativePath Chemin relatif dans l'Edge Function
 * @returns URL complète
 */
export function buildFunctionUrl(
  basePath: string,
  functionName: string,
  relativePath: string
): string {
  // Normaliser les chemins
  basePath = basePath.replace(/\/+$/, "");
  relativePath = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;

  // Construire l'URL
  return `${basePath}/functions/v1/${functionName}${relativePath}`;
}

/**
 * Détermine si un chemin est destiné à une Edge Function spécifique
 * @param path Chemin de l'URL
 * @param functionName Nom de l'Edge Function à vérifier
 * @returns true si le chemin concerne cette fonction
 */
export function isPathForFunction(path: string, functionName: string): boolean {
  const normalizedPath = path.toLowerCase();
  const patterns = [
    `/functions/v1/${functionName}`,
    `/${functionName}`,
    `/functions/${functionName}`,
    `/rest/v1/functions/${functionName}`,
  ];

  return patterns.some((pattern) =>
    normalizedPath.includes(pattern.toLowerCase())
  );
}
