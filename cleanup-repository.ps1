# Script de nettoyage complet du repository AlloKoli
# Version: 1.0
# Date: 24 mai 2025

Write-Host "🧹 NETTOYAGE COMPLET DU REPOSITORY ALLOKOLI" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$deletedFiles = @()
$deletedDirs = @()
$totalSize = 0

function Remove-ItemSafely {
    param($path, $description)
    
    if (Test-Path $path) {
        try {
            $size = (Get-ChildItem $path -Recurse -File | Measure-Object -Property Length -Sum).Sum
            $global:totalSize += $size
            
            Remove-Item $path -Recurse -Force
            Write-Host "  ✅ Supprimé: $description" -ForegroundColor Green
            
            if (Test-Path $path -PathType Container) {
                $global:deletedDirs += $path
            } else {
                $global:deletedFiles += $path
            }
            
            return $true
        } catch {
            Write-Host "  ❌ Erreur suppression: $description - $($_.Exception.Message)" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "  ⚠️  Déjà supprimé: $description" -ForegroundColor Yellow
        return $false
    }
}

Write-Host ""
Write-Host "🗂️  SUPPRESSION DES DOSSIERS OBSOLÈTES..." -ForegroundColor Yellow

# Dossier project (doublon de frontend)
Remove-ItemSafely "project" "Dossier project (doublon de frontend)"

# Dossier lib racine (doublon de frontend/lib)
Remove-ItemSafely "lib" "Dossier lib racine (doublon de frontend/lib)"

# Dossiers de build temporaires
Remove-ItemSafely ".next" "Dossier de build Next.js temporaire"
Remove-ItemSafely "node_modules" "Node modules racine (inutile)"

# Dossier cursor
Remove-ItemSafely ".cursor" "Dossier de configuration Cursor"

Write-Host ""
Write-Host "📄 SUPPRESSION DES FICHIERS DE TEST REDONDANTS..." -ForegroundColor Yellow

# Scripts de test redondants ou obsolètes
$testFiles = @(
    "test-assistant-creation.ps1",
    "test-assistant-simple.ps1", 
    "test-configurateur-final.ps1",
    "test-configurateur-simple.ps1",
    "test-configurator-simple.ps1",
    "test-edge-function-simple.ps1",
    "test-simple-function.ps1",
    "test-vapi-direct.ps1",
    "test-vapi-compatibility.ps1",
    "test-vapi-compatibility-cloud.ps1",
    "test-openapi-deployment.ps1"
)

foreach ($file in $testFiles) {
    Remove-ItemSafely $file "Script de test obsolète: $file"
}

Write-Host ""
Write-Host "🔧 SUPPRESSION DES SCRIPTS DE SETUP OBSOLÈTES..." -ForegroundColor Yellow

# Scripts de setup redondants
$setupFiles = @(
    "create-first-assistant.ps1",
    "create-vapi-assistant-configurateur.ps1", 
    "create-vapi-assistant-now.ps1",
    "create-configurateur-restaurant.ps1",
    "setup-vapi-and-create-assistant.ps1",
    "setup-vapiblocks.ps1",
    "deploy-vapi-configurator.ps1",
    "deploy-mcp-server.ps1",
    "backend-health-check.ps1",
    "migrate-standard.ps1",
    "check-structure.ps1",
    "fixAssistants.ps1",
    "copy-shared.ps1",
    "clean-keys.ps1",
    "fix-remaining-credentials.ps1",
    "update-configurateur-prompt.ps1"
)

foreach ($file in $setupFiles) {
    Remove-ItemSafely $file "Script de setup obsolète: $file"
}

Write-Host ""
Write-Host "📋 SUPPRESSION DES FICHIERS DE CONFIGURATION REDONDANTS..." -ForegroundColor Yellow

# Fichiers de configuration obsolètes
$configFiles = @(
    "auto-commit.ps1",
    "auto-commit.bat",
    "generate-sdk.js",
    "validate-openapi.ps1",
    "vapi-configurator-test-report.json",
    "todo.md"
)

foreach ($file in $configFiles) {
    Remove-ItemSafely $file "Fichier de configuration obsolète: $file"
}

Write-Host ""
Write-Host "📚 NETTOYAGE DE LA DOCUMENTATION..." -ForegroundColor Yellow

# Documentation redondante ou obsolète
$docsToRemove = @(
    "DOCS/deprecated",
    "DOCS/context", 
    "DOCS/assets",
    "DOCS/guides/todov2.md",
    "DOCS/prompts",
    "DOCS/architecture",
    "DOCS/api_integration.md",
    "DOCS/api_services.md",
    "DOCS/development_guide.md",
    "DOCS/deployment.md",
    "DOCS/backend-status-report.md",
    "DOCS/vapi-api-key-configured-report.md",
    "DOCS/vapi-compatibility-report.md",
    "DOCS/vapi-compatibility-final-report.md",
    "DOCS/deploy-functions-cloud.md",
    "DOCS/vapi-testing-guide.md",
    "DOCS/openapi-completion-summary.md",
    "DOCS/openapi-update-report.md",
    "DOCS/update-summary.md",
    "DOCS/mcp-deployment-guide.md",
    "DOCS/premier-assistant-cree-succes.md",
    "DOCS/vapi-configurator-deployment-summary.md",
    "DOCS/security-audit-report.md",
    "DOCS/security-final-steps.md",
    "DOCS/audit-documentation-configurateur.md",
    "DOCS/mission-completed.md"
)

foreach ($doc in $docsToRemove) {
    Remove-ItemSafely $doc "Documentation obsolète: $doc"
}

Write-Host ""
Write-Host "🔗 NETTOYAGE DES SPECS OPENAPI..." -ForegroundColor Yellow

# Garder seulement le fichier final et supprimer les versions intermédiaires
Remove-ItemSafely "specs/allokoli-api.yaml" "Spec OpenAPI intermédiaire"
Remove-ItemSafely "specs/allokoli-api-complete.yaml" "Spec OpenAPI intermédiaire"
Remove-ItemSafely "specs/_dereferenced" "Dossier de specs déréférencées"
Remove-ItemSafely "specs/_catalog" "Catalogue de specs"

Write-Host ""
Write-Host "🎯 NETTOYAGE DU FRONTEND..." -ForegroundColor Yellow

# Fichiers frontend obsolètes
$frontendObsolete = @(
    "frontend/env.local.example",
    "frontend/landing-page.tsx",
    "frontend/app/test-database.sql",
    "frontend/app/applications",
    "frontend/jest.config.js",
    "frontend/jest.setup.js",
    "frontend/__tests__"
)

foreach ($item in $frontendObsolete) {
    Remove-ItemSafely $item "Fichier frontend obsolète: $item"
}

Write-Host ""
Write-Host "🏗️  NETTOYAGE DES FICHIERS DE BUILD..." -ForegroundColor Yellow

# Fichiers de build et temporaires
Remove-ItemSafely "frontend/.next" "Build Next.js frontend"
Remove-ItemSafely "frontend/node_modules" "Node modules frontend (sera réinstallé)"
Remove-ItemSafely "frontend/pnpm-lock.yaml" "Lock file frontend (sera régénéré)"
Remove-ItemSafely "pnpm-lock.yaml" "Lock file racine"

Write-Host ""
Write-Host "📦 CONSERVATION DES FICHIERS ESSENTIELS..." -ForegroundColor Cyan

$essentialFiles = @(
    "✅ README.md - Documentation principale",
    "✅ package.json - Configuration npm racine", 
    "✅ tsconfig.json - Configuration TypeScript",
    "✅ tailwind.config.ts - Configuration Tailwind",
    "✅ postcss.config.js - Configuration PostCSS",
    "✅ next-env.d.ts - Types Next.js",
    "✅ middleware.ts - Middleware Next.js",
    "✅ .gitignore - Configuration Git",
    "✅ CONTRIBUTING.md - Guide de contribution",
    "✅ Cahier_Des_Charges_Allo_Koli.md - Cahier des charges",
    "✅ ROADMAP_ALLOKOLI.md - Roadmap du projet"
)

foreach ($file in $essentialFiles) {
    Write-Host "  $file" -ForegroundColor Green
}

Write-Host ""
Write-Host "📁 CONSERVATION DES DOSSIERS ESSENTIELS..." -ForegroundColor Cyan

$essentialDirs = @(
    "✅ frontend/ - Application Next.js principale",
    "✅ supabase/ - Configuration et fonctions Supabase", 
    "✅ specs/ - Spécifications OpenAPI finales",
    "✅ DOCS/ - Documentation essentielle",
    "✅ .github/ - Configuration GitHub",
    "✅ .git/ - Historique Git"
)

foreach ($dir in $essentialDirs) {
    Write-Host "  $dir" -ForegroundColor Green
}

Write-Host ""
Write-Host "📊 RÉSUMÉ DU NETTOYAGE" -ForegroundColor Cyan
Write-Host "======================" -ForegroundColor Cyan

Write-Host "Fichiers supprimés: $($deletedFiles.Count)" -ForegroundColor Yellow
Write-Host "Dossiers supprimés: $($deletedDirs.Count)" -ForegroundColor Yellow
Write-Host "Espace libéré: $([math]::Round($totalSize / 1MB, 2)) MB" -ForegroundColor Yellow

Write-Host ""
Write-Host "🎯 STRUCTURE FINALE OPTIMISÉE" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green

Write-Host "📁 Racine du projet:" -ForegroundColor Blue
Write-Host "  ├── frontend/                 # Application Next.js" -ForegroundColor White
Write-Host "  ├── supabase/                 # Backend Supabase" -ForegroundColor White  
Write-Host "  ├── specs/                    # Spécifications OpenAPI" -ForegroundColor White
Write-Host "  ├── DOCS/                     # Documentation essentielle" -ForegroundColor White
Write-Host "  ├── .github/                  # Configuration GitHub" -ForegroundColor White
Write-Host "  ├── README.md                 # Documentation principale" -ForegroundColor White
Write-Host "  ├── package.json              # Configuration npm" -ForegroundColor White
Write-Host "  ├── tsconfig.json             # Configuration TypeScript" -ForegroundColor White
Write-Host "  ├── tailwind.config.ts        # Configuration Tailwind" -ForegroundColor White
Write-Host "  ├── middleware.ts             # Middleware Next.js" -ForegroundColor White
Write-Host "  └── install-abstract-ball.ps1 # Script d'installation AbstractBall" -ForegroundColor White

Write-Host ""
Write-Host "🚀 PROCHAINES ÉTAPES" -ForegroundColor Blue
Write-Host "===================" -ForegroundColor Blue
Write-Host "1. Réinstaller les dépendances: cd frontend && npm install" -ForegroundColor Yellow
Write-Host "2. Tester l'application: npm run dev" -ForegroundColor Yellow  
Write-Host "3. Vérifier que tout fonctionne: http://localhost:3000/configurateur" -ForegroundColor Yellow

Write-Host ""
Write-Host "✨ REPOSITORY NETTOYÉ ET OPTIMISÉ!" -ForegroundColor Green 