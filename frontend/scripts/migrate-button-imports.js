/**
 * Script de migration des imports Button vers le nouveau système unifié
 * Usage: node scripts/migrate-button-imports.js
 */

const fs = require("fs");
const path = require("path");

// Patterns d'imports à rechercher et remplacer
const PATTERNS = [
  {
    from: /import\s*{\s*Button\s*}\s*from\s*['"]@\/components\/ui\/Button['"];?/g,
    to: "import { Button } from '@/components/ui/buttons';",
    name: "Import principal @/components/ui/Button",
  },
  {
    from: /import\s*{\s*Button\s*}\s*from\s*['"]@\/components\/ui\/button['"];?/g,
    to: "import { Button } from '@/components/ui/buttons';",
    name: "Import @/components/ui/button (minuscule)",
  },
  {
    from: /import\s*{\s*Button\s*}\s*from\s*['"]\.\.?\/.*\/ui\/button['"];?/g,
    to: "import { Button } from '@/components/ui/buttons';",
    name: "Imports relatifs vers ui/button",
  },
  {
    from: /import\s*{\s*Button\s*}\s*from\s*['"].*\/components\/ui\/button['"];?/g,
    to: "import { Button } from '@/components/ui/buttons';",
    name: "Imports absolus vers components/ui/button",
  },
];

// Répertoires à scanner
const SCAN_DIRS = ["app", "components", "lib"];

// Extensions de fichiers à traiter
const FILE_EXTENSIONS = [".tsx", ".ts", ".jsx", ".js"];

/**
 * Parcourt récursivement un répertoire et retourne tous les fichiers
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) {
    return arrayOfFiles;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);

    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      const ext = path.extname(file);
      if (FILE_EXTENSIONS.includes(ext)) {
        arrayOfFiles.push(fullPath);
      }
    }
  });

  return arrayOfFiles;
}

/**
 * Migre un fichier en appliquant les patterns de remplacement
 */
function migrateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let hasChanges = false;
    let appliedPatterns = [];

    PATTERNS.forEach((pattern) => {
      if (pattern.from.test(content)) {
        content = content.replace(pattern.from, pattern.to);
        hasChanges = true;
        appliedPatterns.push(pattern.name);
      }
    });

    if (hasChanges) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✅ Migré: ${filePath}`);
      appliedPatterns.forEach((p) => console.log(`   └─ ${p}`));
      return true;
    }

    return false;
  } catch (error) {
    console.error(
      `❌ Erreur lors de la migration de ${filePath}:`,
      error.message
    );
    return false;
  }
}

/**
 * Fonction principale de migration
 */
function main() {
  console.log("🚀 Démarrage de la migration des imports Button...\n");

  let totalFiles = 0;
  let migratedFiles = 0;
  let allFiles = [];

  SCAN_DIRS.forEach((scanDir) => {
    if (!fs.existsSync(scanDir)) {
      console.log(`⚠️  Répertoire non trouvé: ${scanDir}`);
      return;
    }

    console.log(`📁 Scan du répertoire: ${scanDir}`);
    const files = getAllFiles(scanDir);
    allFiles = allFiles.concat(files);
  });

  console.log(`📋 ${allFiles.length} fichiers trouvés\n`);

  allFiles.forEach((file) => {
    totalFiles++;
    if (migrateFile(file)) {
      migratedFiles++;
    }
  });

  console.log("\n📊 Résumé de la migration:");
  console.log(`   • Fichiers scannés: ${totalFiles}`);
  console.log(`   • Fichiers migrés: ${migratedFiles}`);
  console.log(`   • Fichiers inchangés: ${totalFiles - migratedFiles}`);

  if (migratedFiles > 0) {
    console.log("\n✅ Migration terminée avec succès !");
    console.log("\n🔄 Prochaines étapes:");
    console.log("   1. Vérifiez que la compilation fonctionne: pnpm run build");
    console.log("   2. Testez les composants migrés");
    console.log(
      "   3. Supprimez les anciens fichiers Button si tout fonctionne"
    );
  } else {
    console.log("\n💡 Aucun import à migrer trouvé.");
  }
}

// Vérification des arguments
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
Usage: node scripts/migrate-button-imports.js

Ce script recherche et remplace automatiquement tous les imports 
du composant Button vers le nouveau système unifié.

Options:
  --help, -h    Affiche cette aide

Exemple:
  node scripts/migrate-button-imports.js
  `);
  process.exit(0);
}

// Exécution du script
main();
