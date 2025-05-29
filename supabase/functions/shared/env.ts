/**
 * Utilitaire pour gérer les variables d'environnement dans Deno
 */
export class DenoEnv {
  static get(key: string): string | undefined {
    return Deno.env.get(key);
  }

  static set(key: string, value: string): void {
    Deno.env.set(key, value);
  }
}
