# Script de test pour l'installation du composant AbstractBall
# Version: 1.0
# Date: 24 mai 2025

Write-Host "🧪 Test Installation AbstractBall - AlloKoli" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

$testsPassed = 0
$testsTotal = 0

function Test-Component {
    param($name, $path, $description)
    $global:testsTotal++
    Write-Host "🔍 Test $global:testsTotal : $description" -ForegroundColor Blue
    
    if (Test-Path $path) {
        Write-Host "  ✅ $name trouvé" -ForegroundColor Green
        $global:testsPassed++
        return $true
    } else {
        Write-Host "  ❌ $name manquant" -ForegroundColor Red
        return $false
    }
}

function Test-FileContent {
    param($path, $pattern, $description)
    $global:testsTotal++
    Write-Host "🔍 Test $global:testsTotal : $description" -ForegroundColor Blue
    
    if (Test-Path $path) {
        $content = Get-Content $path -Raw
        if ($content -match $pattern) {
            Write-Host "  ✅ Contenu valide" -ForegroundColor Green
            $global:testsPassed++
            return $true
        } else {
            Write-Host "  ❌ Contenu invalide" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "  ❌ Fichier non trouvé" -ForegroundColor Red
        return $false
    }
}

# Vérifier la structure des fichiers
Write-Host ""
Write-Host "📁 Vérification de la structure des fichiers..." -ForegroundColor Yellow

Test-Component "AbstractBall" "frontend/components/examples/abstract-ball.tsx" "Composant AbstractBall"
Test-Component "ConfiguratorGlob" "frontend/app/configurateur/components/ConfiguratorGlob.tsx" "Composant ConfiguratorGlob"
Test-Component "Page Configurateur" "frontend/app/configurateur/page.tsx" "Page principale"

# Vérifier le contenu des fichiers
Write-Host ""
Write-Host "📝 Vérification du contenu des fichiers..." -ForegroundColor Yellow

Test-FileContent "frontend/components/examples/abstract-ball.tsx" "import \* as THREE from 'three'" "Import Three.js dans AbstractBall"
Test-FileContent "frontend/components/examples/abstract-ball.tsx" "interface AbstractBallProps" "Interface TypeScript"
Test-FileContent "frontend/components/examples/abstract-ball.tsx" "ShaderMaterial" "Shader Material Three.js"
Test-FileContent "frontend/app/configurateur/components/ConfiguratorGlob.tsx" "import AbstractBall from" "Import AbstractBall dans ConfiguratorGlob"

# Vérifier les dépendances
Write-Host ""
Write-Host "📦 Vérification des dépendances..." -ForegroundColor Yellow

if (Test-Path "frontend/package.json") {
    $packageJson = Get-Content "frontend/package.json" | ConvertFrom-Json
    
    $requiredDeps = @("three", "@types/three")
    foreach ($dep in $requiredDeps) {
        $testsTotal++
        $found = $false
        if ($packageJson.dependencies -and $packageJson.dependencies.$dep) {
            $found = $true
        }
        if ($packageJson.devDependencies -and $packageJson.devDependencies.$dep) {
            $found = $true
        }
        
        if ($found) {
            Write-Host "  ✅ Dépendance $dep présente" -ForegroundColor Green
            $testsPassed++
        } else {
            Write-Host "  ❌ Dépendance $dep manquante" -ForegroundColor Red
        }
    }
} else {
    Write-Host "  ❌ package.json non trouvé" -ForegroundColor Red
}

# Test de compilation TypeScript
Write-Host ""
Write-Host "🔧 Test de compilation TypeScript..." -ForegroundColor Yellow

Set-Location frontend
$compileResult = npx tsc --noEmit --skipLibCheck 2>&1
Set-Location ..

$testsTotal++
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✅ Compilation TypeScript réussie" -ForegroundColor Green
    $testsPassed++
} else {
    Write-Host "  ⚠️  Erreurs de compilation détectées" -ForegroundColor Yellow
    Write-Host "  Détails: $compileResult" -ForegroundColor Gray
}

# Résumé final
Write-Host ""
Write-Host "📊 Résumé des Tests" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "Tests réussis: $testsPassed/$testsTotal" -ForegroundColor $(if ($testsPassed -eq $testsTotal) { "Green" } else { "Yellow" })

$percentage = [math]::Round(($testsPassed / $testsTotal) * 100, 1)
Write-Host "Pourcentage de réussite: $percentage%" -ForegroundColor $(if ($percentage -eq 100) { "Green" } elseif ($percentage -ge 80) { "Yellow" } else { "Red" })

if ($testsPassed -eq $testsTotal) {
    Write-Host ""
    Write-Host "🎉 Installation AbstractBall RÉUSSIE!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Prochaines étapes:" -ForegroundColor Blue
    Write-Host "1. cd frontend && npm run dev" -ForegroundColor Yellow
    Write-Host "2. Ouvrir http://localhost:3000/configurateur" -ForegroundColor Yellow
    Write-Host "3. Tester l'interaction avec le Glob 3D" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "⚠️  Installation partiellement réussie" -ForegroundColor Yellow
    Write-Host "Vérifiez les erreurs ci-dessus avant de continuer" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📚 Le composant AbstractBall est maintenant intégré!" -ForegroundColor Cyan 