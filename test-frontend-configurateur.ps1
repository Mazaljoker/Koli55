# Script de test pour l'interface frontend du configurateur AlloKoli
# Version: 1.0
# Date: 24 mai 2025

Write-Host "🧪 Test Interface Frontend Configurateur AlloKoli" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Vérifier si nous sommes dans le bon répertoire
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Erreur: Ce script doit être exécuté depuis la racine du projet" -ForegroundColor Red
    exit 1
}

$testResults = @()

# Test 1: Vérifier la structure des fichiers
Write-Host "📁 Test 1: Vérification de la structure des fichiers..." -ForegroundColor Blue

$requiredFiles = @(
    "frontend/app/configurateur/page.tsx",
    "frontend/app/configurateur/components/ConfiguratorGlob.tsx",
    "frontend/app/configurateur/components/ConfiguratorChat.tsx",
    "frontend/app/configurateur/components/ConfiguratorSteps.tsx",
    "frontend/app/configurateur/components/ConfiguratorResult.tsx",
    "frontend/components/vapi/VapiConfigProvider.tsx",
    "frontend/hooks/use-vapi-configurator.ts",
    "DOCS/plan-integration-frontend-configurateur.md",
    "setup-vapiblocks.ps1"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        $missingFiles += $file
    }
}

if ($missingFiles.Count -eq 0) {
    Write-Host "  ✅ Tous les fichiers requis sont présents" -ForegroundColor Green
    $testResults += @{ Test = "Structure fichiers"; Status = "PASS"; Details = "Tous les fichiers présents" }
} else {
    Write-Host "  ❌ Fichiers manquants:" -ForegroundColor Red
    foreach ($file in $missingFiles) {
        Write-Host "    - $file" -ForegroundColor Yellow
    }
    $testResults += @{ Test = "Structure fichiers"; Status = "FAIL"; Details = "$($missingFiles.Count) fichiers manquants" }
}

# Test 2: Vérifier les dépendances package.json
Write-Host "📦 Test 2: Vérification des dépendances..." -ForegroundColor Blue

if (Test-Path "frontend/package.json") {
    $packageJson = Get-Content "frontend/package.json" | ConvertFrom-Json
    $requiredDeps = @("three", "gsap", "@types/three", "lucide-react")
    $missingDeps = @()
    
    foreach ($dep in $requiredDeps) {
        $found = $false
        if ($packageJson.dependencies -and $packageJson.dependencies.$dep) {
            $found = $true
        }
        if ($packageJson.devDependencies -and $packageJson.devDependencies.$dep) {
            $found = $true
        }
        if (-not $found) {
            $missingDeps += $dep
        }
    }
    
    if ($missingDeps.Count -eq 0) {
        Write-Host "  ✅ Toutes les dépendances VapiBlocks sont installées" -ForegroundColor Green
        $testResults += @{ Test = "Dépendances"; Status = "PASS"; Details = "Toutes les dépendances présentes" }
    } else {
        Write-Host "  ⚠️  Dépendances manquantes: $($missingDeps -join ', ')" -ForegroundColor Yellow
        Write-Host "    Exécutez: pwsh -File setup-vapiblocks.ps1" -ForegroundColor Cyan
        $testResults += @{ Test = "Dépendances"; Status = "WARN"; Details = "$($missingDeps.Count) dépendances manquantes" }
    }
} else {
    Write-Host "  ❌ package.json non trouvé dans frontend/" -ForegroundColor Red
    $testResults += @{ Test = "Dépendances"; Status = "FAIL"; Details = "package.json manquant" }
}

# Test 3: Vérifier la configuration environnement
Write-Host "⚙️  Test 3: Vérification de la configuration..." -ForegroundColor Blue

if (Test-Path "frontend/.env.local") {
    $envContent = Get-Content "frontend/.env.local" -Raw
    $requiredVars = @(
        "NEXT_PUBLIC_VAPI_PUBLIC_KEY",
        "NEXT_PUBLIC_CONFIGURATOR_ASSISTANT_ID",
        "NEXT_PUBLIC_SUPABASE_URL"
    )
    
    $missingVars = @()
    foreach ($var in $requiredVars) {
        if ($envContent -notmatch $var) {
            $missingVars += $var
        }
    }
    
    if ($missingVars.Count -eq 0) {
        Write-Host "  ✅ Configuration environnement complète" -ForegroundColor Green
        $testResults += @{ Test = "Configuration"; Status = "PASS"; Details = "Variables d'environnement présentes" }
    } else {
        Write-Host "  ⚠️  Variables manquantes: $($missingVars -join ', ')" -ForegroundColor Yellow
        $testResults += @{ Test = "Configuration"; Status = "WARN"; Details = "$($missingVars.Count) variables manquantes" }
    }
} else {
    Write-Host "  ⚠️  Fichier .env.local non trouvé" -ForegroundColor Yellow
    Write-Host "    Exécutez: pwsh -File setup-vapiblocks.ps1" -ForegroundColor Cyan
    $testResults += @{ Test = "Configuration"; Status = "WARN"; Details = ".env.local manquant" }
}

# Test 4: Vérifier l'agent configurateur backend
Write-Host "🤖 Test 4: Vérification de l'agent configurateur..." -ForegroundColor Blue

try {
    $response = Invoke-RestMethod -Uri "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/assistants/46b73124-6624-45ab-89c7-d27ecedcb251" -Method GET -Headers @{
        "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ5NzE0NzEsImV4cCI6MjA1MDU0NzQ3MX0.OqFJHdLqhJGJhz8Ej_-QLhXhOOKJJJJJJJJJJJJJJJJ"
    } -TimeoutSec 10
    
    if ($response -and $response.data) {
        Write-Host "  ✅ Agent configurateur accessible" -ForegroundColor Green
        Write-Host "    ID: 46b73124-6624-45ab-89c7-d27ecedcb251" -ForegroundColor Cyan
        Write-Host "    Nom: $($response.data.name)" -ForegroundColor Cyan
        $testResults += @{ Test = "Agent configurateur"; Status = "PASS"; Details = "Agent accessible et opérationnel" }
    } else {
        Write-Host "  ⚠️  Réponse inattendue de l'agent" -ForegroundColor Yellow
        $testResults += @{ Test = "Agent configurateur"; Status = "WARN"; Details = "Réponse inattendue" }
    }
} catch {
    Write-Host "  ❌ Erreur lors de l'accès à l'agent: $($_.Exception.Message)" -ForegroundColor Red
    $testResults += @{ Test = "Agent configurateur"; Status = "FAIL"; Details = "Erreur d'accès" }
}

# Test 5: Vérifier la syntaxe TypeScript
Write-Host "📝 Test 5: Vérification de la syntaxe TypeScript..." -ForegroundColor Blue

Set-Location frontend

if (Get-Command "npx" -ErrorAction SilentlyContinue) {
    try {
        $tscOutput = npx tsc --noEmit --skipLibCheck 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ Syntaxe TypeScript valide" -ForegroundColor Green
            $testResults += @{ Test = "TypeScript"; Status = "PASS"; Details = "Aucune erreur de syntaxe" }
        } else {
            Write-Host "  ⚠️  Erreurs TypeScript détectées" -ForegroundColor Yellow
            Write-Host "    $tscOutput" -ForegroundColor Gray
            $testResults += @{ Test = "TypeScript"; Status = "WARN"; Details = "Erreurs de syntaxe détectées" }
        }
    } catch {
        Write-Host "  ⚠️  Impossible de vérifier TypeScript" -ForegroundColor Yellow
        $testResults += @{ Test = "TypeScript"; Status = "WARN"; Details = "Vérification impossible" }
    }
} else {
    Write-Host "  ⚠️  npx non disponible" -ForegroundColor Yellow
    $testResults += @{ Test = "TypeScript"; Status = "WARN"; Details = "npx non disponible" }
}

Set-Location ..

# Test 6: Vérifier la documentation
Write-Host "📚 Test 6: Vérification de la documentation..." -ForegroundColor Blue

$docFiles = @(
    "DOCS/plan-integration-frontend-configurateur.md",
    "DOCS/audit-documentation-configurateur.md",
    "DOCS/guide-configurateur-allokoli.md"
)

$missingDocs = @()
foreach ($doc in $docFiles) {
    if (-not (Test-Path $doc)) {
        $missingDocs += $doc
    }
}

if ($missingDocs.Count -eq 0) {
    Write-Host "  ✅ Documentation complète" -ForegroundColor Green
    $testResults += @{ Test = "Documentation"; Status = "PASS"; Details = "Tous les documents présents" }
} else {
    Write-Host "  ❌ Documents manquants: $($missingDocs -join ', ')" -ForegroundColor Red
    $testResults += @{ Test = "Documentation"; Status = "FAIL"; Details = "$($missingDocs.Count) documents manquants" }
}

# Résumé des tests
Write-Host ""
Write-Host "📊 Résumé des Tests" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green

$passCount = ($testResults | Where-Object { $_.Status -eq "PASS" }).Count
$warnCount = ($testResults | Where-Object { $_.Status -eq "WARN" }).Count
$failCount = ($testResults | Where-Object { $_.Status -eq "FAIL" }).Count

foreach ($result in $testResults) {
    $color = switch ($result.Status) {
        "PASS" { "Green" }
        "WARN" { "Yellow" }
        "FAIL" { "Red" }
    }
    Write-Host "  $($result.Status.PadRight(4)) | $($result.Test.PadRight(20)) | $($result.Details)" -ForegroundColor $color
}

Write-Host ""
Write-Host "📈 Score Global: $passCount PASS, $warnCount WARN, $failCount FAIL" -ForegroundColor Cyan

if ($failCount -eq 0 -and $warnCount -le 2) {
    Write-Host "🎉 Interface configurateur prête pour le développement!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Prochaines étapes:" -ForegroundColor Blue
    Write-Host "1. Installer le composant AbstractBall de VapiBlocks" -ForegroundColor Yellow
    Write-Host "2. Configurer les clés API dans frontend/.env.local" -ForegroundColor Yellow
    Write-Host "3. Démarrer le serveur de développement: cd frontend && npm run dev" -ForegroundColor Yellow
    Write-Host "4. Tester l'interface: http://localhost:3000/configurateur" -ForegroundColor Yellow
} elseif ($failCount -eq 0) {
    Write-Host "⚠️  Interface configurateur partiellement prête" -ForegroundColor Yellow
    Write-Host "   Résolvez les avertissements avant de continuer" -ForegroundColor Yellow
} else {
    Write-Host "❌ Erreurs critiques détectées" -ForegroundColor Red
    Write-Host "   Résolvez les erreurs avant de continuer" -ForegroundColor Red
}

Write-Host "" 