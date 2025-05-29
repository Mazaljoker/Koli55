#!/usr/bin/env ts-node

import { Project, SyntaxKind, Node } from "ts-morph";
import path from "path";
import fs from "fs";

/**
 * Script codemod pour migrer les couleurs hardcodées vers les design tokens
 * Remplace toutes les couleurs hexadécimales par les tokens appropriés
 */

// Mapping des couleurs hardcodées vers les tokens
const COLOR_MAPPINGS = {
  // Couleurs principales
  "#7C3AED": "var(--allokoli-primary-default)",
  "#7745FF": "var(--allokoli-primary-hover)",
  "#6D28D9": "var(--allokoli-primary-active)",
  "#A78BFA": "var(--allokoli-secondary-default)",
  "#9CB8FF": "var(--allokoli-primary-lighter)",
  "#8B5CF6": "var(--allokoli-secondary-hover)",

  // Couleurs sémantiques
  "#F59E0B": "var(--allokoli-accent-default)",
  "#10B981": "var(--allokoli-success-default)",
  "#EF4444": "var(--allokoli-error-default)",
  "#3B82F6": "var(--allokoli-info-default)",

  // Couleurs neutres
  "#FFFFFF": "var(--allokoli-pure-white)",
  "#000000": "var(--allokoli-pure-black)",
  "#F9FAFB": "var(--allokoli-gray-50)",
  "#F3F4F6": "var(--allokoli-gray-100)",
  "#E5E7EB": "var(--allokoli-gray-200)",
  "#D1D5DB": "var(--allokoli-gray-300)",
  "#9CA3AF": "var(--allokoli-gray-400)",
  "#6B7280": "var(--allokoli-gray-500)",
  "#4B5563": "var(--allokoli-gray-600)",
  "#374151": "var(--allokoli-gray-700)",
  "#1F2937": "var(--allokoli-gray-800)",
  "#111827": "var(--allokoli-gray-900)",

  // Couleurs spécifiques au thème
  "#1E1B2E": "var(--allokoli-dark-background)",
  "#2D2A40": "var(--allokoli-dark-surface)",
  "#F8FAFC": "var(--allokoli-light-surface)",
  "#1E293B": "var(--allokoli-light-textPrimary)",
  "#64748B": "var(--allokoli-light-textSecondary)",
  "#94A3B8": "var(--allokoli-light-textTertiary)",
  "#E2E8F0": "var(--allokoli-light-border)",
  "#F1F5F9": "var(--allokoli-light-borderSecondary)",

  // Couleurs de status
  "#52C41A": "var(--allokoli-success-default)",

  // Variantes de couleurs existantes (lowercase)
  "#7c3aed": "var(--allokoli-primary-default)",
  "#a78bfa": "var(--allokoli-secondary-default)",
  "#10b981": "var(--allokoli-success-default)",
  "#ef4444": "var(--allokoli-error-default)",
  "#3b82f6": "var(--allokoli-info-default)",
  "#ffffff": "var(--allokoli-pure-white)",
  "#9ca3af": "var(--allokoli-gray-400)",
  "#4b5563": "var(--allokoli-gray-600)",

  // Couleurs additionnelles trouvées
  "#6a3bd8": "var(--allokoli-primary-active)",
  "#5769FF": "var(--allokoli-secondary-hover)",
  "#666": "var(--allokoli-gray-500)",
  "#fff": "var(--allokoli-pure-white)",
} as const;

// Extensions de fichiers à traiter
const FILE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".css", ".scss"];

// Répertoires à exclure
const EXCLUDED_DIRS = ["node_modules", ".next", "dist", "build"];

class ColorTokenMigrator {
  private project: Project;
  private migratedFiles = 0;
  private migratedColors = 0;

  constructor() {
    this.project = new Project({
      tsConfigFilePath: "tsconfig.json",
    });
  }

  /**
   * Migre toutes les couleurs dans le projet
   */
  async migrateColors(): Promise<void> {
    console.log(
      "🎨 Début de la migration des couleurs vers les design tokens...\n"
    );

    // Traiter les fichiers TypeScript/JavaScript
    await this.migrateTypeScriptFiles();

    // Traiter les fichiers CSS
    await this.migrateCSSFiles();

    console.log(`\n✅ Migration terminée !`);
    console.log(`📁 Fichiers traités: ${this.migratedFiles}`);
    console.log(`🎨 Couleurs migrées: ${this.migratedColors}`);
  }

  /**
   * Migre les fichiers TypeScript/JavaScript
   */
  private async migrateTypeScriptFiles(): Promise<void> {
    const sourceFiles = this.project.getSourceFiles();

    for (const sourceFile of sourceFiles) {
      const filePath = sourceFile.getFilePath();

      if (this.shouldProcessFile(filePath)) {
        let hasChanges = false;

        // Traiter tous les nœuds du fichier
        sourceFile.forEachDescendant((node) => {
          if (this.migrateNodeColors(node)) {
            hasChanges = true;
          }
        });

        if (hasChanges) {
          await sourceFile.save();
          this.migratedFiles++;
          console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
        }
      }
    }
  }

  /**
   * Migre un nœud spécifique si il contient des couleurs
   */
  private migrateNodeColors(node: Node): boolean {
    let hasChanges = false;

    // Traiter les string literals
    if (Node.isStringLiteral(node)) {
      const originalValue = node.getLiteralValue();
      const newValue = this.replaceColorsInString(originalValue);

      if (newValue !== originalValue) {
        node.setLiteralValue(newValue);
        hasChanges = true;
        this.migratedColors++;
      }
    }

    // Traiter les template literals
    else if (Node.isTemplateExpression(node)) {
      const originalText = node.getText();
      const newText = this.replaceColorsInString(originalText);

      if (newText !== originalText) {
        node.replaceWithText(newText);
        hasChanges = true;
        this.migratedColors++;
      }
    }

    return hasChanges;
  }

  /**
   * Migre les fichiers CSS
   */
  private async migrateCSSFiles(): Promise<void> {
    const cssFiles = this.findCSSFiles(".");

    for (const filePath of cssFiles) {
      if (this.shouldProcessFile(filePath)) {
        const content = fs.readFileSync(filePath, "utf8");
        const newContent = this.replaceColorsInString(content);

        if (newContent !== content) {
          fs.writeFileSync(filePath, newContent, "utf8");
          this.migratedFiles++;
          console.log(`✅ ${path.relative(process.cwd(), filePath)}`);
        }
      }
    }
  }

  /**
   * Trouve tous les fichiers CSS dans un répertoire
   */
  private findCSSFiles(dir: string): string[] {
    const files: string[] = [];

    const traverse = (currentDir: string) => {
      const items = fs.readdirSync(currentDir);

      for (const item of items) {
        const fullPath = path.join(currentDir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !EXCLUDED_DIRS.includes(item)) {
          traverse(fullPath);
        } else if (
          stat.isFile() &&
          (item.endsWith(".css") || item.endsWith(".scss"))
        ) {
          files.push(fullPath);
        }
      }
    };

    traverse(dir);
    return files;
  }

  /**
   * Remplace les couleurs dans une chaîne de caractères
   */
  private replaceColorsInString(text: string): string {
    let result = text;

    // Remplacer toutes les couleurs hardcodées
    for (const [hexColor, token] of Object.entries(COLOR_MAPPINGS)) {
      // Pattern pour matcher les couleurs avec ou sans guillemets
      const patterns = [
        new RegExp(`["']${this.escapeRegex(hexColor)}["']`, "gi"),
        new RegExp(`\\b${this.escapeRegex(hexColor)}\\b`, "gi"),
      ];

      for (const pattern of patterns) {
        if (pattern.test(result)) {
          result = result.replace(pattern, (match) => {
            // Garder les guillemets si ils étaient présents
            if (match.startsWith('"') || match.startsWith("'")) {
              return `"${token}"`;
            }
            return token;
          });
          this.migratedColors++;
        }
      }
    }

    return result;
  }

  /**
   * Échappe les caractères spéciaux pour regex
   */
  private escapeRegex(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Détermine si un fichier doit être traité
   */
  private shouldProcessFile(filePath: string): boolean {
    // Exclure les répertoires
    if (EXCLUDED_DIRS.some((dir) => filePath.includes(dir))) {
      return false;
    }

    // Inclure seulement les extensions supportées
    return FILE_EXTENSIONS.some((ext) => filePath.endsWith(ext));
  }
}

// Fonction principale
async function main() {
  try {
    const migrator = new ColorTokenMigrator();
    await migrator.migrateColors();
  } catch (error) {
    console.error("❌ Erreur lors de la migration:", error);
    process.exit(1);
  }
}

// Exécuter si appelé directement
if (require.main === module) {
  main();
}

export { ColorTokenMigrator };
