#!/usr/bin/env pwsh
# Script de déploiement du serveur MCP AlloKoli
# Usage: .\deploy-mcp-server.ps1 [-Test] [-Force]

param(
    [switch]$Test,      # Exécuter les tests avant déploiement
    [switch]$Force      # Forcer le déploiement sans confirmation
)

Write-Host "🚀 Déploiement du serveur MCP AlloKoli" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Vérification des prérequis
Write-Host "`n🔍 Vérification des prérequis..." -ForegroundColor Yellow

# Vérifier que Supabase CLI est installé
try {
    $supabaseVersion = supabase --version 2>$null
    Write-Host "✅ Supabase CLI: $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI non trouvé. Installez-le avec: npm install -g supabase" -ForegroundColor Red
    exit 1
}

# Vérifier que Deno est installé
try {
    $denoVersion = deno --version 2>$null | Select-String "deno" | Select-Object -First 1
    Write-Host "✅ Deno: $denoVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Deno non trouvé. Installez-le depuis https://deno.land/" -ForegroundColor Red
    exit 1
}

# Vérifier la connexion Supabase
Write-Host "`n🔗 Vérification de la connexion Supabase..." -ForegroundColor Yellow
try {
    $supabaseStatus = supabase status 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Connecté au projet Supabase" -ForegroundColor Green
    } else {
        Write-Host "❌ Non connecté à Supabase. Exécutez: supabase login" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur de connexion Supabase" -ForegroundColor Red
    exit 1
}

# Vérifier les fichiers requis
Write-Host "`n📁 Vérification des fichiers..." -ForegroundColor Yellow

$requiredFiles = @(
    "supabase/functions/mcp-server/index.ts",
    "supabase/functions/mcp-server/deno.json",
    "supabase/functions/shared/zod-schemas.ts",
    "supabase/functions/shared/cors.ts",
    "supabase/functions/shared/auth.ts",
    "supabase/functions/shared/response-helpers.ts"
)

$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "`n❌ Fichiers manquants détectés. Déploiement annulé." -ForegroundColor Red
    exit 1
}

# Exécuter les tests si demandé
if ($Test) {
    Write-Host "`n🧪 Exécution des tests..." -ForegroundColor Yellow
    
    Push-Location "supabase/functions/mcp-server"
    try {
        $testResult = deno run --allow-env --allow-net test.ts 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Tests réussis" -ForegroundColor Green
            Write-Host $testResult -ForegroundColor Gray
        } else {
            Write-Host "❌ Tests échoués" -ForegroundColor Red
            Write-Host $testResult -ForegroundColor Red
            Pop-Location
            exit 1
        }
    } catch {
        Write-Host "❌ Erreur lors de l'exécution des tests: $_" -ForegroundColor Red
        Pop-Location
        exit 1
    }
    Pop-Location
}

# Vérifier les variables d'environnement
Write-Host "`n🔐 Vérification des variables d'environnement..." -ForegroundColor Yellow

$requiredSecrets = @(
    "VAPI_API_KEY",
    "TWILIO_ACCOUNT_SID", 
    "TWILIO_AUTH_TOKEN"
)

$missingSecrets = @()
foreach ($secret in $requiredSecrets) {
    try {
        $secretValue = supabase secrets list --format json 2>$null | ConvertFrom-Json | Where-Object { $_.name -eq $secret }
        if ($secretValue) {
            Write-Host "✅ $secret configuré" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $secret non configuré" -ForegroundColor Yellow
            $missingSecrets += $secret
        }
    } catch {
        Write-Host "⚠️  Impossible de vérifier $secret" -ForegroundColor Yellow
        $missingSecrets += $secret
    }
}

if ($missingSecrets.Count -gt 0) {
    Write-Host "`n⚠️  Variables d'environnement manquantes:" -ForegroundColor Yellow
    foreach ($secret in $missingSecrets) {
        Write-Host "   - $secret" -ForegroundColor Yellow
    }
    Write-Host "`nConfigurez-les avec: supabase secrets set $secret=your-value" -ForegroundColor Yellow
    
    if (-not $Force) {
        $continue = Read-Host "`nContinuer le déploiement malgré tout ? (y/N)"
        if ($continue -ne "y" -and $continue -ne "Y") {
            Write-Host "Déploiement annulé." -ForegroundColor Yellow
            exit 0
        }
    }
}

# Confirmation finale
if (-not $Force) {
    Write-Host "`n📋 Résumé du déploiement:" -ForegroundColor Cyan
    Write-Host "   - Fonction: mcp-server" -ForegroundColor White
    Write-Host "   - Outils: 5 outils MCP" -ForegroundColor White
    Write-Host "   - Validation: Schémas Zod automatiques" -ForegroundColor White
    Write-Host "   - Intégrations: Vapi + Twilio" -ForegroundColor White
    
    $confirm = Read-Host "`nConfirmer le déploiement ? (y/N)"
    if ($confirm -ne "y" -and $confirm -ne "Y") {
        Write-Host "Déploiement annulé." -ForegroundColor Yellow
        exit 0
    }
}

# Déploiement
Write-Host "`n🚀 Déploiement en cours..." -ForegroundColor Cyan

try {
    $deployResult = supabase functions deploy mcp-server 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Déploiement réussi !" -ForegroundColor Green
        Write-Host $deployResult -ForegroundColor Gray
    } else {
        Write-Host "❌ Échec du déploiement" -ForegroundColor Red
        Write-Host $deployResult -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Erreur lors du déploiement: $_" -ForegroundColor Red
    exit 1
}

# Test post-déploiement
Write-Host "`n🔍 Test post-déploiement..." -ForegroundColor Yellow

try {
    # Récupérer l'URL de la fonction
    $functionUrl = supabase functions list --format json 2>$null | ConvertFrom-Json | Where-Object { $_.name -eq "mcp-server" } | Select-Object -ExpandProperty url
    
    if ($functionUrl) {
        Write-Host "✅ URL de la fonction: $functionUrl" -ForegroundColor Green
        
        # Test de la route de découverte MCP
        try {
            $response = Invoke-RestMethod -Uri "$functionUrl/mcp" -Method GET -TimeoutSec 10
            if ($response.name -eq "allokoli-mcp-server") {
                Write-Host "✅ Route de découverte MCP fonctionnelle" -ForegroundColor Green
                Write-Host "📋 Outils disponibles: $($response.tools.Count)" -ForegroundColor Green
            } else {
                Write-Host "⚠️  Route de découverte MCP répond mais format inattendu" -ForegroundColor Yellow
            }
        } catch {
            Write-Host "⚠️  Impossible de tester la route de découverte: $_" -ForegroundColor Yellow
        }
    } else {
        Write-Host "⚠️  Impossible de récupérer l'URL de la fonction" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Erreur lors du test post-déploiement: $_" -ForegroundColor Yellow
}

# Résumé final
Write-Host "`n🎉 Déploiement terminé avec succès !" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Green

Write-Host "`n📚 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Configurer l'agent Vapi configurateur pour utiliser ces outils" -ForegroundColor White
Write-Host "2. Tester la création d'un assistant complet" -ForegroundColor White
Write-Host "3. Vérifier les logs Supabase pour le monitoring" -ForegroundColor White
Write-Host "4. Configurer les webhooks Twilio si nécessaire" -ForegroundColor White

Write-Host "`n📖 Documentation:" -ForegroundColor Cyan
Write-Host "   - README: supabase/functions/mcp-server/README.md" -ForegroundColor White
Write-Host "   - Tests: deno run --allow-env --allow-net supabase/functions/mcp-server/test.ts" -ForegroundColor White
Write-Host "   - Logs: supabase functions logs mcp-server" -ForegroundColor White

Write-Host "`n✨ Le serveur MCP AlloKoli est maintenant opérationnel !" -ForegroundColor Green 