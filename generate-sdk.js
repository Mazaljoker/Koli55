/**
 * Script pour générer le SDK client AlloKoli à partir de la spécification OpenAPI
 * 
 * Usage: node generate-sdk.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');

// Chemin vers la spécification OpenAPI
const SPEC_PATH = path.join(__dirname, 'specs', 'allokoli-api-complete-final.yaml');
// Chemin de sortie pour le SDK généré
const OUTPUT_PATH = path.join(__dirname, 'frontend', 'lib', 'api', 'allokoli-sdk.ts');
// Chemin vers le template pour la génération du SDK
const TEMPLATE_PATH = path.join(__dirname, 'sdk-template.hbs');

// Charge la spécification OpenAPI
function loadSpec() {
  try {
    const specContent = fs.readFileSync(SPEC_PATH, 'utf8');
    return yaml.load(specContent);
  } catch (error) {
    console.error(`Erreur lors du chargement de la spécification: ${error.message}`);
    process.exit(1);
  }
}

// Génère le SDK TypeScript à partir de la spécification
function generateSDK(spec) {
  console.log('Génération du SDK client AlloKoli...');
  
  // Extraire les informations de base
  const { info, paths, components } = spec;
  const { title, version, description } = info;
  
  // Générer les interfaces pour les modèles
  const models = extractModels(components.schemas);
  
  // Générer les méthodes pour les endpoints
  const endpoints = extractEndpoints(paths);
  
  // Utiliser un template pour générer le SDK
  let template = '';
  if (fs.existsSync(TEMPLATE_PATH)) {
    template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  } else {
    console.warn('Template non trouvé, utilisation du SDK existant comme base');
    template = fs.readFileSync(OUTPUT_PATH, 'utf8');
  }
  
  // TODO: Utiliser un moteur de template (comme Handlebars) pour générer le SDK
  // Pour l'instant, nous écrivons simplement un message indiquant comment générer le SDK
  
  const sdkContent = `/**
 * SDK AlloKoli - Client TypeScript pour l'API AlloKoli
 * 
 * Généré automatiquement à partir de la spécification OpenAPI ${spec.openapi}
 * Base URL: ${spec.servers[0].url}
 * 
 * @version ${version}
 * @description ${description.split('\n')[0]}
 */

// Ce fichier a été généré par generate-sdk.js le ${new Date().toISOString()}
// Ne pas modifier manuellement, utilisez le script de génération à la place.

// Pour une génération complète, installez openapi-typescript-codegen et exécutez:
// npm install -g openapi-typescript-codegen
// openapi --input ${SPEC_PATH} --output frontend/lib/api/generated --client fetch --name AlloKoliAPI

console.log('Pour générer complètement le SDK, suivez les instructions dans le fichier.');
`;

  // Écrire le fichier de sortie
  fs.writeFileSync(OUTPUT_PATH + '.example', sdkContent);
  console.log(`SDK exemple généré à ${OUTPUT_PATH}.example`);
  
  console.log('Pour une génération complète du SDK, installez et utilisez openapi-typescript-codegen:');
  console.log('npm install -g openapi-typescript-codegen');
  console.log(`openapi --input ${SPEC_PATH} --output frontend/lib/api/generated --client fetch --name AlloKoliAPI`);
}

// Extraire les modèles (interfaces) depuis les schémas
function extractModels(schemas) {
  const models = [];
  for (const [name, schema] of Object.entries(schemas)) {
    models.push({ name, schema });
  }
  return models;
}

// Extraire les endpoints depuis les chemins
function extractEndpoints(paths) {
  const endpoints = [];
  for (const [path, methods] of Object.entries(paths)) {
    for (const [method, endpoint] of Object.entries(methods)) {
      if (method === 'get' || method === 'post' || method === 'patch' || method === 'delete') {
        endpoints.push({
          path,
          method,
          operationId: endpoint.operationId,
          summary: endpoint.summary,
          description: endpoint.description,
          parameters: endpoint.parameters,
          requestBody: endpoint.requestBody,
          responses: endpoint.responses
        });
      }
    }
  }
  return endpoints;
}

// Fonction principale
function main() {
  console.log('Début de la génération du SDK AlloKoli...');
  const spec = loadSpec();
  generateSDK(spec);
  console.log('Génération terminée!');
}

main(); 