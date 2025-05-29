#!/usr/bin/env node

import { Project, SourceFile, SyntaxKind, JsxAttribute } from "ts-morph";
import path from "path";

// Configuration du projet
const project = new Project({
  tsConfigFilePath: path.resolve(__dirname, "../tsconfig.json"),
});

// Ajouter tous les fichiers TypeScript/TSX du projet
project.addSourceFilesAtPaths("app/**/*.{ts,tsx}");
project.addSourceFilesAtPaths("components/**/*.{ts,tsx}");

let fixedFiles = 0;
let totalFixes = 0;

// Fonction pour corriger les props Button dans un fichier
function fixButtonPropsInFile(sourceFile: SourceFile): boolean {
  let hasChanges = false;

  // Trouver tous les éléments JSX
  const jsxSelfClosingElements = sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxSelfClosingElement
  );
  const jsxOpeningElements = sourceFile.getDescendantsOfKind(
    SyntaxKind.JsxOpeningElement
  );

  const allElements = [...jsxSelfClosingElements, ...jsxOpeningElements];

  for (const element of allElements) {
    const tagName = element.getTagNameNode().getText();

    // Ne traiter que les éléments Button
    if (tagName !== "Button") continue;

    const attributes = element.getAttributes();

    for (const attr of attributes) {
      if (attr.getKind() !== SyntaxKind.JsxAttribute) continue;

      const jsxAttr = attr as JsxAttribute;
      const nameNode = jsxAttr.getNameNode();
      const attrName = nameNode.getText();

      // Corriger loading -> isLoading
      if (attrName === "loading") {
        nameNode.replaceWithText("isLoading");
        hasChanges = true;
        totalFixes++;
        console.log(
          `Fixed 'loading' -> 'isLoading' in ${sourceFile.getFilePath()}`
        );
      }

      // Corriger type -> variant
      if (attrName === "type") {
        const initializer = jsxAttr.getInitializer();
        if (initializer?.getKind() === SyntaxKind.StringLiteral) {
          const value = initializer.getText().replace(/['"]/g, "");
          // Ne corriger que si c'est une valeur de variant Button (pas un type HTML)
          if (
            [
              "primary",
              "secondary",
              "outline",
              "ghost",
              "outlined",
              "dashed",
              "text",
              "link",
              "default",
            ].includes(value)
          ) {
            nameNode.replaceWithText("variant");

            // Corriger outlined -> outline
            if (value === "outlined") {
              initializer.replaceWithText('"outline"');
            }
            // Mapper les types Ant Design vers nos variants
            else if (value === "dashed") {
              initializer.replaceWithText('"outline"');
            } else if (value === "text") {
              initializer.replaceWithText('"ghost"');
            } else if (value === "link") {
              initializer.replaceWithText('"ghost"');
            }
            // default -> secondary
            else if (value === "default") {
              initializer.replaceWithText('"secondary"');
            }

            hasChanges = true;
            totalFixes++;
            console.log(
              `Fixed 'type="${value}"' -> 'variant' in ${sourceFile.getFilePath()}`
            );
          }
        }
      }
    }
  }

  return hasChanges;
}

// Traiter tous les fichiers
for (const sourceFile of project.getSourceFiles()) {
  const filePath = sourceFile.getFilePath();

  // Ignorer node_modules et .next
  if (filePath.includes("node_modules") || filePath.includes(".next")) {
    continue;
  }

  console.log(`Processing: ${filePath}`);

  if (fixButtonPropsInFile(sourceFile)) {
    fixedFiles++;
  }
}

// Sauvegarder les changements
project.saveSync();

console.log(`\n✅ Migration completed!`);
console.log(`📁 Files processed: ${project.getSourceFiles().length}`);
console.log(`🔧 Files fixed: ${fixedFiles}`);
console.log(`✨ Total fixes: ${totalFixes}`);
