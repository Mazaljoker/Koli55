import { z } from "zod";

// Schéma de validation pour les variables d'environnement
const envSchema = z.object({
  // Configuration Supabase (obligatoires)
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL doit être une URL valide"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY est obligatoire"),

  // Configuration Vapi (optionnelles en développement)
  VAPI_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_VAPI_PUBLIC_KEY: z.string().min(1).optional(),

  // Configuration Application
  NODE_ENV: z
    .enum(["development", "staging", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_APP_NAME: z.string().default("AlloKoli"),

  // Configuration Base de Données
  DATABASE_URL: z.string().url().optional(),

  // Configuration Email (optionnelles)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),

  // Configuration Analytics (optionnelles)
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),

  // Configuration Monitoring (optionnelles)
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Variables de développement
  NEXT_PUBLIC_DEBUG: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
  NEXT_PUBLIC_USE_DEMO_DATA: z
    .string()
    .transform((val) => val === "true")
    .default("false"),
});

// Type dérivé du schéma
export type Environment = z.infer<typeof envSchema>;

// Fonction de validation sécurisée
function validateEnv(): Environment {
  const isDebugMode = process.env.NEXT_PUBLIC_DEBUG === "true";

  // DEBUG: Affichage conditionnel des variables d'environnement
  if (isDebugMode) {
    console.log("=== DÉBOGAGE VARIABLES D'ENVIRONNEMENT ===");
    console.log(
      "NEXT_PUBLIC_SUPABASE_URL:",
      process.env.NEXT_PUBLIC_SUPABASE_URL
    );
    console.log(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY:",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? "SET (longueur: " +
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length +
            ")"
        : "NOT SET"
    );
    console.log("NODE_ENV:", process.env.NODE_ENV);

    // Filtrer correctement les variables côté client vs serveur
    const isClient = typeof window !== "undefined";
    const allEnvKeys = Object.keys(process.env);
    const nextPublicKeys = allEnvKeys.filter((key) =>
      key.startsWith("NEXT_PUBLIC_")
    );

    console.log("Environnement:", isClient ? "CLIENT" : "SERVER");
    console.log("Toutes les variables NEXT_PUBLIC_*:", nextPublicKeys);
    console.log("Total variables process.env:", allEnvKeys.length);
    console.log("=== FIN DÉBOGAGE ===");
  }

  try {
    // Créer un objet avec les variables explicitement définies
    const envObject = {
      ...process.env,
      // Forcer les variables Supabase si elles ne sont pas dans process.env
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      NEXT_PUBLIC_SUPABASE_ANON_KEY:
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    };

    if (isDebugMode) {
      console.log("=== DÉBOGAGE OBJECT FINAL ===");
      console.log(
        "envObject.NEXT_PUBLIC_SUPABASE_URL:",
        envObject.NEXT_PUBLIC_SUPABASE_URL
      );
      console.log(
        "envObject.NEXT_PUBLIC_SUPABASE_ANON_KEY:",
        envObject.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "SET" : "NOT SET"
      );
      console.log("=== FIN DÉBOGAGE OBJECT ===");
    }

    return envSchema.parse(envObject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("\n");

      console.error(
        `❌ Configuration d'environnement invalide:\n${errorMessages}`
      );

      // En développement, utiliser des valeurs par défaut si possible
      if (process.env.NODE_ENV === "development") {
        console.warn(
          "⚠️ Mode développement: utilisation de valeurs par défaut pour continuer"
        );
        return envSchema.parse({
          ...process.env,
          NEXT_PUBLIC_SUPABASE_URL:
            process.env.NEXT_PUBLIC_SUPABASE_URL ||
            "https://placeholder.supabase.co",
          NEXT_PUBLIC_SUPABASE_ANON_KEY:
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key",
        });
      }

      throw new Error(
        `Configuration d'environnement invalide:\n${errorMessages}`
      );
    }
    throw error;
  }
}

// Variables d'environnement validées - à utiliser dans toute l'application
export const env = validateEnv();

// Utilitaires
export const isDevelopment = env.NODE_ENV === "development";
export const isProduction = env.NODE_ENV === "production";
export const isStaging = env.NODE_ENV === "staging";
export const isTest = env.NODE_ENV === "test";

// Configuration conditionnelle pour le mode développement
export const devConfig = {
  skipVapiValidation: isDevelopment && !env.VAPI_API_KEY,
  useDemoData: env.NEXT_PUBLIC_USE_DEMO_DATA,
  enableDebug: env.NEXT_PUBLIC_DEBUG,
};

// Export des URLs et configurations fréquemment utilisées
export const appConfig = {
  supabase: {
    url: env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
  vapi: {
    privateKey: env.VAPI_API_KEY,
    publicKey: env.NEXT_PUBLIC_VAPI_PUBLIC_KEY,
  },
  app: {
    name: env.NEXT_PUBLIC_APP_NAME,
    url: env.NEXT_PUBLIC_APP_URL,
  },
};
