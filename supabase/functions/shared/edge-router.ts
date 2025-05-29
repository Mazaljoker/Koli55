/**
 * Router pour Edge Functions Supabase
 * Simplifie la gestion des routes et de l'authentification
 */

import { corsHeaders } from "./cors.ts";
import { authenticate, AuthUser } from "./auth.ts";
import {
  errorResponse,
  internalError,
  notFoundError,
  validationError,
} from "./errors.ts";

// Types pour les routes
export type RouteHandler = (
  req: Request,
  url: URL,
  user?: AuthUser
) => Promise<Response>;
export type RouteMiddleware = (
  req: Request,
  url: URL
) => Promise<Response | null>;

export interface Route {
  method: string;
  pattern: RegExp | string;
  handler: RouteHandler;
  requireAuth?: boolean;
  middlewares?: RouteMiddleware[];
}

export class EdgeRouter {
  private routes: Route[] = [];
  private globalMiddlewares: RouteMiddleware[] = [];
  private notFoundHandler: RouteHandler = async () => {
    return new Response(JSON.stringify(notFoundError("Route non trouvée")), {
      status: 404,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  };

  // Ajouter une route
  public addRoute(route: Route): EdgeRouter {
    this.routes.push(route);
    return this;
  }

  // Raccourcis pour les méthodes HTTP communes
  public get(
    pattern: RegExp | string,
    handler: RouteHandler,
    requireAuth = true,
    middlewares: RouteMiddleware[] = []
  ): EdgeRouter {
    return this.addRoute({
      method: "GET",
      pattern,
      handler,
      requireAuth,
      middlewares,
    });
  }

  public post(
    pattern: RegExp | string,
    handler: RouteHandler,
    requireAuth = true,
    middlewares: RouteMiddleware[] = []
  ): EdgeRouter {
    return this.addRoute({
      method: "POST",
      pattern,
      handler,
      requireAuth,
      middlewares,
    });
  }

  public put(
    pattern: RegExp | string,
    handler: RouteHandler,
    requireAuth = true,
    middlewares: RouteMiddleware[] = []
  ): EdgeRouter {
    return this.addRoute({
      method: "PUT",
      pattern,
      handler,
      requireAuth,
      middlewares,
    });
  }

  public patch(
    pattern: RegExp | string,
    handler: RouteHandler,
    requireAuth = true,
    middlewares: RouteMiddleware[] = []
  ): EdgeRouter {
    return this.addRoute({
      method: "PATCH",
      pattern,
      handler,
      requireAuth,
      middlewares,
    });
  }

  public delete(
    pattern: RegExp | string,
    handler: RouteHandler,
    requireAuth = true,
    middlewares: RouteMiddleware[] = []
  ): EdgeRouter {
    return this.addRoute({
      method: "DELETE",
      pattern,
      handler,
      requireAuth,
      middlewares,
    });
  }

  // Ajouter un middleware global
  public use(middleware: RouteMiddleware): EdgeRouter {
    this.globalMiddlewares.push(middleware);
    return this;
  }

  // Définir un gestionnaire pour les routes non trouvées
  public setNotFoundHandler(handler: RouteHandler): EdgeRouter {
    this.notFoundHandler = handler;
    return this;
  }

  // Vérifier si une route correspond à un modèle
  private matchRoute(path: string, pattern: RegExp | string): boolean {
    if (pattern instanceof RegExp) {
      return pattern.test(path);
    }

    // Convertir les motifs de route avec paramètres (ex: /users/:id) en regex
    if (pattern.includes(":")) {
      const regexPattern = pattern
        .replace(/:[a-zA-Z0-9_]+/g, "([^/]+)")
        .replace(/\//g, "\\/");
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(path);
    }

    return path === pattern;
  }

  // Extraire les paramètres d'un chemin
  private extractParams(path: string, pattern: string): Record<string, string> {
    const params: Record<string, string> = {};

    if (!pattern.includes(":")) {
      return params;
    }

    const pathParts = path.split("/");
    const patternParts = pattern.split("/");

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(":")) {
        const paramName = patternParts[i].slice(1);
        params[paramName] = pathParts[i];
      }
    }

    return params;
  }

  // Méthode principale pour gérer une requête
  public async handleRequest(req: Request): Promise<Response> {
    // Gestion CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders, status: 204 });
    }

    try {
      const url = new URL(req.url);
      let path = url.pathname;

      // Normaliser le chemin
      path = path.replace(/\/+$/, "");
      if (path.includes("/functions/v1/")) {
        path = path.substring(
          path.indexOf("/functions/v1/") + "/functions/v1/".length
        );
      }

      // Exécuter les middlewares globaux
      for (const middleware of this.globalMiddlewares) {
        const response = await middleware(req, url);
        if (response) {
          return response;
        }
      }

      // Trouver une route correspondante
      for (const route of this.routes) {
        if (
          req.method === route.method &&
          this.matchRoute(path, route.pattern)
        ) {
          // Exécuter les middlewares de route
          if (route.middlewares) {
            for (const middleware of route.middlewares) {
              const response = await middleware(req, url);
              if (response) {
                return response;
              }
            }
          }

          // Authentification si nécessaire
          let user: AuthUser | undefined;
          if (route.requireAuth) {
            try {
              user = await authenticate(req);
            } catch (error) {
              return errorResponse(error);
            }
          }

          // Ajouter les paramètres d'URL à l'objet URL
          if (
            typeof route.pattern === "string" &&
            route.pattern.includes(":")
          ) {
            const params = this.extractParams(path, route.pattern);
            url.params = params;
          }

          // Exécuter le gestionnaire de route
          return await route.handler(req, url, user);
        }
      }

      // Aucune route trouvée
      return await this.notFoundHandler(req, url);
    } catch (error) {
      console.error("Erreur dans le routeur:", error);
      return errorResponse(internalError("Erreur interne du serveur"));
    }
  }
}

// Middleware pour la journalisation des requêtes
export function loggerMiddleware(): RouteMiddleware {
  return async (req: Request, url: URL) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${url.pathname}`);
    return null;
  };
}

// Middleware pour vérifier le mode de test
export function testModeMiddleware(): RouteMiddleware {
  return async (req: Request, url: URL) => {
    const isTestMode =
      url.searchParams.get("test") === "true" ||
      req.headers.get("x-test-mode") === "true";

    if (isTestMode) {
      console.log("Mode test activé pour cette requête");
      url.searchParams.set("__test_mode", "true");
    }

    return null;
  };
}

// Middleware pour valider les données de requête
export function validationMiddleware(schema: any): RouteMiddleware {
  return async (req: Request, url: URL) => {
    if (
      req.method === "POST" ||
      req.method === "PUT" ||
      req.method === "PATCH"
    ) {
      try {
        const contentType = req.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          return errorResponse(
            validationError("Content-Type doit être application/json")
          );
        }

        const body = await req.json();

        // Validation avec Zod ou autre validateur
        if (schema && typeof schema.parse === "function") {
          try {
            schema.parse(body);
          } catch (validationError) {
            return errorResponse(
              validationError("Données invalides", {
                details: validationError.errors,
              })
            );
          }
        }

        // Réinitialiser le corps de la requête pour les handlers
        req.json = () => Promise.resolve(body);
      } catch (error) {
        return errorResponse(validationError("Impossible de parser le JSON"));
      }
    }

    return null;
  };
}
