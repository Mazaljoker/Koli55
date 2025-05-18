// Script pour tester les variables d'environnement nécessaires aux Edge Functions
// Exécuter ce script avant de lancer les tests pour s'assurer que tout est configuré correctement

console.log("=== Test des variables d'environnement pour les Edge Functions ===");

// Définition des variables requises
const requiredVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'VAPI_API_KEY',
  'JWT_SECRET'
];

// Vérification des variables d'environnement
const missingVars = [];
for (const varName of requiredVars) {
  const value = process.env[varName];
  if (!value) {
    missingVars.push(varName);
    console.error(`❌ Variable d'environnement manquante: ${varName}`);
  } else {
    // Masquer la valeur réelle pour la sécurité
    const maskedValue = value.length > 8 
      ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
      : '****';
    console.log(`✅ ${varName}: ${maskedValue}`);
  }
}

// Résumé final
if (missingVars.length === 0) {
  console.log("\n✅ Toutes les variables d'environnement requises sont définies");
  console.log("✅ Vous pouvez exécuter les tests d'Edge Functions");
} else {
  console.error(`\n❌ ${missingVars.length} variable(s) d'environnement manquante(s)`);
  console.error("❌ Veuillez définir ces variables avant d'exécuter les tests:");
  
  // Instructions pour configurer les variables manquantes
  console.log("\n=== Comment configurer les variables manquantes ===");
  console.log("1. Créez un fichier .env.local à la racine du projet");
  console.log("2. Ajoutez les variables manquantes au format: NOM_VARIABLE=valeur");
  console.log("3. Redémarrez le serveur Supabase avec `supabase start` ou `supabase restart`");
  
  // Exemple de contenu pour .env.local
  console.log("\nExemple de contenu pour .env.local:");
  console.log("```");
  for (const varName of missingVars) {
    console.log(`${varName}=votre_valeur_pour_${varName.toLowerCase()}`);
  }
  console.log("```");
  
  process.exit(1);
} 