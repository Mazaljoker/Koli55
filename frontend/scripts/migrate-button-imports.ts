#!/usr/bin/env ts-node

import {
  Project,
  SyntaxKind,
  ImportDeclaration,
  ImportSpecifier,
} from "ts-morph";
import path from "path";

/**
 * Script de migration des imports Button vers le composant canonique
 * Migre tous les imports Button vers @/components/ui/Button
 */

const CANONICAL_BUTTON_IMPORT = "@/components/ui/Button";

// Patterns d'imports à migrer
const MIGRATION_PATTERNS = [
  // Import depuis antd
  {
    from: "antd",
    namedImport: "Button",
    description: "Ant Design Button",
  },
  // Import depuis l'ancien composant forms
  {
    from: "@/components/ui/forms/Button",
    namedImport: "Button",
    description: "Forms Button (ancien)",
  },
  // Import depuis antd/es/button (namespace import)
  {
    from: "antd/es/button",
    defaultImport: true,
    description: "Ant Design Button (namespace)",
  },
];

interface MigrationStats {
  filesProcessed: number;
  importsChanged: number;
  fileChanges: { file: string; changes: string[] }[];
}

function migrateButtonImports(projectPath: string): MigrationStats {
  console.log(`🔄 Démarrage de la migration des imports Button...`);
  console.log(`📁 Chemin du projet: ${projectPath}`);

  // Créer le projet ts-morph
  const project = new Project({
    tsConfigFilePath: path.join(projectPath, "tsconfig.json"),
  });

  const stats: MigrationStats = {
    filesProcessed: 0,
    importsChanged: 0,
    fileChanges: [],
  };

  // Obtenir tous les fichiers TypeScript/TSX
  const sourceFiles = project.getSourceFiles([
    "**/*.ts",
    "**/*.tsx",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ]);

  console.log(`📄 ${sourceFiles.length} fichiers à analyser`);

  sourceFiles.forEach((sourceFile) => {
    const filePath = sourceFile.getFilePath();
    const relativePath = path.relative(projectPath, filePath);
    const fileChanges: string[] = [];
    let hasChanges = false;

    // Analyser les imports
    const importDeclarations = sourceFile.getImportDeclarations();

    importDeclarations.forEach((importDecl) => {
      const moduleSpecifier = importDecl.getModuleSpecifierValue();

      // Vérifier chaque pattern de migration
      MIGRATION_PATTERNS.forEach((pattern) => {
        if (moduleSpecifier === pattern.from) {
          if (pattern.namedImport) {
            // Gestion des imports nommés (e.g., import { Button } from 'antd')
            const namedImports = importDecl.getNamedImports();
            const buttonImport = namedImports.find(
              (imp) => imp.getName() === pattern.namedImport
            );

            if (buttonImport) {
              // Vérifier si l'import canonique existe déjà
              const existingCanonicalImport = importDeclarations.find(
                (decl) =>
                  decl.getModuleSpecifierValue() === CANONICAL_BUTTON_IMPORT
              );

              if (existingCanonicalImport) {
                // L'import canonique existe, supprimer seulement Button de l'import actuel
                if (namedImports.length === 1) {
                  // Si Button est le seul import, supprimer toute la déclaration
                  importDecl.remove();
                  fileChanges.push(
                    `Supprimé: import { Button } from "${pattern.from}"`
                  );
                } else {
                  // Supprimer seulement Button de la liste des imports
                  buttonImport.remove();
                  fileChanges.push(
                    `Retiré Button de: import { ... } from "${pattern.from}"`
                  );
                }
              } else {
                // Créer le nouvel import canonique
                if (namedImports.length === 1) {
                  // Remplacer toute la déclaration
                  importDecl.setModuleSpecifier(CANONICAL_BUTTON_IMPORT);
                  fileChanges.push(
                    `Migré: "${pattern.from}" → "${CANONICAL_BUTTON_IMPORT}"`
                  );
                } else {
                  // Retirer Button et ajouter un nouvel import
                  buttonImport.remove();
                  sourceFile.addImportDeclaration({
                    moduleSpecifier: CANONICAL_BUTTON_IMPORT,
                    namedImports: ["Button"],
                  });
                  fileChanges.push(
                    `Extrait Button vers: "${CANONICAL_BUTTON_IMPORT}"`
                  );
                }
              }

              hasChanges = true;
              stats.importsChanged++;
            }
          } else if (pattern.defaultImport) {
            // Gestion des imports par défaut (e.g., import Button from 'antd/es/button')
            const defaultImport = importDecl.getDefaultImport();
            if (defaultImport && defaultImport.getText() === "Button") {
              // Vérifier si l'import canonique existe déjà
              const existingCanonicalImport = importDeclarations.find(
                (decl) =>
                  decl.getModuleSpecifierValue() === CANONICAL_BUTTON_IMPORT
              );

              if (!existingCanonicalImport) {
                // Remplacer par l'import canonique
                importDecl.setModuleSpecifier(CANONICAL_BUTTON_IMPORT);
                importDecl.removeDefaultImport();
                importDecl.addNamedImport("Button");
                fileChanges.push(
                  `Migré namespace: "${pattern.from}" → "${CANONICAL_BUTTON_IMPORT}"`
                );
              } else {
                // Supprimer l'import existant
                importDecl.remove();
                fileChanges.push(
                  `Supprimé namespace dupliqué: "${pattern.from}"`
                );
              }

              hasChanges = true;
              stats.importsChanged++;
            }
          }
        }
      });
    });

    if (hasChanges) {
      stats.filesProcessed++;
      stats.fileChanges.push({
        file: relativePath,
        changes: fileChanges,
      });

      // Sauvegarder les modifications
      sourceFile.saveSync();
      console.log(`✅ ${relativePath} - ${fileChanges.length} changement(s)`);
    }
  });

  return stats;
}

function printMigrationReport(stats: MigrationStats) {
  console.log("\n📊 RAPPORT DE MIGRATION");
  console.log("========================");
  console.log(`📄 Fichiers traités: ${stats.filesProcessed}`);
  console.log(`🔄 Imports migrés: ${stats.importsChanged}`);

  if (stats.fileChanges.length > 0) {
    console.log("\n📝 DÉTAILS DES MODIFICATIONS:");
    stats.fileChanges.forEach(({ file, changes }) => {
      console.log(`\n📁 ${file}:`);
      changes.forEach((change) => {
        console.log(`   • ${change}`);
      });
    });
  }

  console.log("\n✨ Migration terminée avec succès!");
}

// Exécution du script
function main() {
  const args = process.argv.slice(2);
  const cwdIndex = args.indexOf("--cwd");

  let projectPath = process.cwd();
  if (cwdIndex !== -1 && args[cwdIndex + 1]) {
    projectPath = path.resolve(args[cwdIndex + 1]);
  }

  try {
    const stats = migrateButtonImports(projectPath);
    printMigrationReport(stats);

    if (stats.filesProcessed === 0) {
      console.log("ℹ️  Aucun import Button à migrer trouvé.");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    process.exit(1);
  }
}

// Exécuter seulement si ce script est appelé directement
if (require.main === module) {
  main();
}
