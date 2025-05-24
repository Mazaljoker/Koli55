# Script de test pour valider le nettoyage du repository
# Version: 1.0
# Date: 24 mai 2025

Write-Host "🧪 TEST DU NETTOYAGE DU REPOSITORY ALLOKOLI" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$testsPassed = 0
$testsTotal = 0

function Test-FileNotExists {
    param($path, $description)
    $global:testsTotal++
    Write-Host "🔍 Test $global:testsTotal : $description" -ForegroundColor Blue
    
    if (-not (Test-Path $path)) {
        Write-Host "  ✅ Fichier supprimé correctement: $path" -ForegroundColor Green
        $global:testsPassed++
        return $true
    } else {
        Write-Host "  ❌ Fichier encore présent: $path" -ForegroundColor Red
        return $false
    }
}

function Test-FileExists {
    param($path, $description)
    $global:testsTotal++
    Write-Host "🔍 Test $global:testsTotal : $description" -ForegroundColor Blue
    
    if (Test-Path $path) {
        Write-Host "  ✅ Fichier conservé: $path" -ForegroundColor Green
        $global:testsPassed++
        return $true
    } else {
        Write-Host "  ❌ Fichier manquant: $path" -ForegroundColor Red
        return $false
    }
}

function Test-DirectoryStructure {
    param($path, $description)
    $global:testsTotal++
    Write-Host "🔍 Test $global:testsTotal : $description" -ForegroundColor Blue
    
    if (Test-Path $path -PathType Container) {
        Write-Host "  ✅ Dossier présent: $path" -ForegroundColor Green
        $global:testsPassed++
        return $true
    } else {
        Write-Host "  ❌ Dossier manquant: $path" -ForegroundColor Red
        return $false
    }
}

Write-Host ""
Write-Host "📁 VÉRIFICATION DE LA STRUCTURE PRINCIPALE..." -ForegroundColor Yellow

# Test des dossiers principaux conservés
Test-DirectoryStructure "frontend" "Dossier frontend conservé"
Test-DirectoryStructure "supabase" "Dossier supabase conservé"
Test-DirectoryStructure "specs" "Dossier specs conservé"
Test-DirectoryStructure "DOCS" "Dossier DOCS conservé"
Test-DirectoryStructure ".github" "Dossier .github conservé"

Write-Host ""
Write-Host "📄 VÉRIFICATION DES FICHIERS ESSENTIELS..." -ForegroundColor Yellow

# Test des fichiers essentiels conservés
Test-FileExists "README.md" "Documentation principale conservée"
Test-FileExists "package.json" "Configuration npm conservée"
Test-FileExists "tsconfig.json" "Configuration TypeScript conservée"
Test-FileExists "tailwind.config.ts" "Configuration Tailwind conservée"
Test-FileExists "middleware.ts" "Middleware Next.js conservé"
Test-FileExists "CONTRIBUTING.md" "Guide de contribution conservé"
Test-FileExists "Cahier_Des_Charges_Allo_Koli.md" "Cahier des charges conservé"
Test-FileExists "ROADMAP_ALLOKOLI.md" "Roadmap conservé"

Write-Host ""
Write-Host "🗑️  VÉRIFICATION DES SUPPRESSIONS..." -ForegroundColor Yellow

# Test des fichiers de test supprimés
Test-FileNotExists "test-assistant-creation.ps1" "Script de test obsolète supprimé"
Test-FileNotExists "test-configurateur-simple.ps1" "Script de test obsolète supprimé"
Test-FileNotExists "test-vapi-compatibility.ps1" "Script de test obsolète supprimé"

# Test des scripts de setup supprimés
Test-FileNotExists "create-first-assistant.ps1" "Script de setup obsolète supprimé"
Test-FileNotExists "setup-vapiblocks.ps1" "Script de setup obsolète supprimé"
Test-FileNotExists "deploy-vapi-configurator.ps1" "Script de setup obsolète supprimé"

# Test des fichiers de configuration supprimés
Test-FileNotExists "auto-commit.ps1" "Fichier de configuration obsolète supprimé"
Test-FileNotExists "generate-sdk.js" "Fichier de configuration obsolète supprimé"
Test-FileNotExists "todo.md" "Fichier de configuration obsolète supprimé"

# Test des dossiers supprimés
Test-FileNotExists "project" "Dossier project (doublon) supprimé"
Test-FileNotExists "lib" "Dossier lib racine (doublon) supprimé"
Test-FileNotExists ".cursor" "Dossier cursor supprimé"

Write-Host ""
Write-Host "🎯 VÉRIFICATION DES SCRIPTS FONCTIONNELS..." -ForegroundColor Yellow

# Test des scripts fonctionnels conservés
Test-FileExists "install-abstract-ball.ps1" "Script d'installation AbstractBall conservé"
Test-FileExists "test-abstract-ball-installation.ps1" "Script de test AbstractBall conservé"
Test-FileExists "test-fix-ui-components.ps1" "Script de test UI conservé"
Test-FileExists "cleanup-repository.ps1" "Script de nettoyage conservé"

Write-Host ""
Write-Host "📚 VÉRIFICATION DE LA DOCUMENTATION..." -ForegroundColor Yellow

# Test de la documentation essentielle
Test-FileExists "DOCS/README.md" "Documentation principale DOCS conservée"
Test-FileExists "DOCS/guide-utilisation-abstract-ball.md" "Guide AbstractBall conservé"
Test-FileExists "DOCS/nettoyage-repository-resume.md" "Résumé du nettoyage créé"

# Test de la suppression de documentation obsolète
Test-FileNotExists "DOCS/api_integration.md" "Documentation obsolète supprimée"
Test-FileNotExists "DOCS/deployment.md" "Documentation obsolète supprimée"
Test-FileNotExists "DOCS/vapi-testing-guide.md" "Documentation obsolète supprimée"

Write-Host ""
Write-Host "🔗 VÉRIFICATION DES SPECS OPENAPI..." -ForegroundColor Yellow

# Test des specs OpenAPI
Test-FileExists "specs/allokoli-api-complete-final.yaml" "Spec OpenAPI finale conservée"
Test-FileNotExists "specs/allokoli-api.yaml" "Spec OpenAPI intermédiaire supprimée"
Test-FileNotExists "specs/_dereferenced" "Dossier de specs déréférencées supprimé"

Write-Host ""
Write-Host "📊 RÉSULTATS DU TEST" -ForegroundColor Cyan
Write-Host "====================" -ForegroundColor Cyan

$successRate = [math]::Round(($testsPassed / $testsTotal) * 100, 1)

Write-Host "Tests réussis: $testsPassed / $testsTotal" -ForegroundColor Yellow
Write-Host "Taux de réussite: $successRate%" -ForegroundColor Yellow

if ($successRate -ge 95) {
    Write-Host ""
    Write-Host "🎉 NETTOYAGE VALIDÉ AVEC SUCCÈS!" -ForegroundColor Green
    Write-Host "Le repository a été nettoyé correctement." -ForegroundColor Green
} elseif ($successRate -ge 80) {
    Write-Host ""
    Write-Host "⚠️  NETTOYAGE PARTIELLEMENT VALIDÉ" -ForegroundColor Yellow
    Write-Host "Quelques éléments nécessitent une vérification." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "❌ PROBLÈMES DÉTECTÉS" -ForegroundColor Red
    Write-Host "Le nettoyage nécessite des corrections." -ForegroundColor Red
}

Write-Host ""
Write-Host "🚀 PROCHAINES ÉTAPES" -ForegroundColor Blue
Write-Host "===================" -ForegroundColor Blue
Write-Host "1. Tester l'application: cd frontend && npm run dev" -ForegroundColor White
Write-Host "2. Vérifier le configurateur: http://localhost:3000/configurateur" -ForegroundColor White
Write-Host "3. Valider AbstractBall: Tester les effets 3D" -ForegroundColor White

Write-Host ""
Write-Host "✨ TEST DU NETTOYAGE TERMINÉ!" -ForegroundColor Green 