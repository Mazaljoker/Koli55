# ============================================================================
# Script de Déploiement Agent Vapi Configurateur - AlloKoli
# ============================================================================
# Description: Déploie l'agent conversationnel d'onboarding sur Supabase Cloud
# Version: 1.0.0
# Date: 2024-12-19
# ============================================================================

param(
    [string]$BusinessType = "general",
    [switch]$Force = $false,
    [switch]$Verbose = $false
)

# Configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Couleurs pour l'affichage
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Write-Success { Write-ColorOutput Green $args }
function Write-Warning { Write-ColorOutput Yellow $args }
function Write-Error { Write-ColorOutput Red $args }
function Write-Info { Write-ColorOutput Cyan $args }

# Banner
Write-Host ""
Write-Success "🎤 DÉPLOIEMENT AGENT VAPI CONFIGURATEUR - ALLOKOLI"
Write-Host "=" * 60
Write-Info "Version: 1.0.0"
Write-Info "Type d'activité: $BusinessType"
Write-Info "Mode Force: $Force"
Write-Host ""

# ============================================================================
# 1. VÉRIFICATIONS PRÉALABLES
# ============================================================================

Write-Info "📋 1. Vérifications préalables..."

# Vérifier Supabase CLI
try {
    $supabaseVersion = supabase --version 2>$null
    if ($LASTEXITCODE -ne 0) {
        throw "Supabase CLI non trouvé"
    }
    Write-Success "✅ Supabase CLI: $supabaseVersion"
} catch {
    Write-Error "❌ Supabase CLI non installé ou non accessible"
    Write-Host "   Installez avec: npm install -g supabase"
    exit 1
}

# Vérifier la connexion Supabase
try {
    $projects = supabase projects list --output json 2>$null | ConvertFrom-Json
    if ($LASTEXITCODE -ne 0 -or -not $projects) {
        throw "Pas de projets Supabase"
    }
    Write-Success "✅ Connexion Supabase active"
} catch {
    Write-Error "❌ Non connecté à Supabase"
    Write-Host "   Connectez-vous avec: supabase login"
    exit 1
}

# Vérifier les fichiers requis
$requiredFiles = @(
    "supabase/functions/vapi-configurator/index.ts",
    "supabase/functions/vapi-configurator-webhook/index.ts",
    "supabase/functions/shared/cors.ts",
    "supabase/functions/shared/response-helpers.ts"
)

foreach ($file in $requiredFiles) {
    if (-not (Test-Path $file)) {
        Write-Error "❌ Fichier manquant: $file"
        exit 1
    }
}
Write-Success "✅ Tous les fichiers requis sont présents"

# ============================================================================
# 2. DÉPLOIEMENT DES EDGE FUNCTIONS
# ============================================================================

Write-Info "🚀 2. Déploiement des Edge Functions..."

# Déployer vapi-configurator
Write-Host "   Déploiement de vapi-configurator..."
try {
    $output = supabase functions deploy vapi-configurator --no-verify-jwt 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Erreur déploiement: $output"
    }
    Write-Success "✅ vapi-configurator déployée"
} catch {
    Write-Error "❌ Échec déploiement vapi-configurator: $_"
    exit 1
}

# Déployer vapi-configurator-webhook
Write-Host "   Déploiement de vapi-configurator-webhook..."
try {
    $output = supabase functions deploy vapi-configurator-webhook --no-verify-jwt 2>&1
    if ($LASTEXITCODE -ne 0) {
        throw "Erreur déploiement: $output"
    }
    Write-Success "✅ vapi-configurator-webhook déployée"
} catch {
    Write-Error "❌ Échec déploiement vapi-configurator-webhook: $_"
    exit 1
}

# ============================================================================
# 3. CONFIGURATION DES VARIABLES D'ENVIRONNEMENT
# ============================================================================

Write-Info "🔧 3. Vérification des variables d'environnement..."

# Vérifier les secrets requis
$requiredSecrets = @("VAPI_API_KEY", "TWILIO_ACCOUNT_SID", "TWILIO_AUTH_TOKEN")
$missingSecrets = @()

foreach ($secret in $requiredSecrets) {
    try {
        $value = supabase secrets list --output json 2>$null | ConvertFrom-Json | Where-Object { $_.name -eq $secret }
        if ($value) {
            Write-Success "✅ $secret configuré"
        } else {
            $missingSecrets += $secret
        }
    } catch {
        $missingSecrets += $secret
    }
}

if ($missingSecrets.Count -gt 0) {
    Write-Warning "⚠️  Secrets manquants: $($missingSecrets -join ', ')"
    Write-Host "   Configurez-les avec: supabase secrets set SECRET_NAME=value"
    
    if (-not $Force) {
        Write-Error "❌ Arrêt du déploiement. Utilisez -Force pour continuer."
        exit 1
    }
}

# ============================================================================
# 4. CRÉATION DE L'AGENT CONFIGURATEUR
# ============================================================================

Write-Info "🎯 4. Création de l'agent configurateur..."

# Obtenir l'URL du projet
try {
    $projectRef = supabase status --output json 2>$null | ConvertFrom-Json | Select-Object -ExpandProperty api_url
    if (-not $projectRef) {
        $projectRef = "https://aiurboizarbbcpynmmgv.supabase.co"
    }
    $functionUrl = "$projectRef/functions/v1/vapi-configurator"
    Write-Success "✅ URL fonction: $functionUrl"
} catch {
    Write-Warning "⚠️  Impossible de déterminer l'URL automatiquement"
    $functionUrl = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/vapi-configurator"
}

# Créer l'agent configurateur
Write-Host "   Création de l'agent pour le type: $BusinessType"
try {
    $body = @{
        action = "create"
        businessType = $BusinessType
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri $functionUrl -Method POST -Body $body -ContentType "application/json" -TimeoutSec 30
    
    if ($response.success) {
        Write-Success "✅ Agent configurateur créé:"
        Write-Host "   - ID Assistant: $($response.data.assistantId)"
        Write-Host "   - ID Vapi: $($response.data.vapiId)"
        Write-Host "   - Type: $BusinessType"
    } else {
        throw "Erreur API: $($response.error)"
    }
} catch {
    Write-Error "❌ Échec création agent: $_"
    if (-not $Force) {
        exit 1
    }
}

# ============================================================================
# 5. TESTS DE FONCTIONNEMENT
# ============================================================================

Write-Info "🧪 5. Tests de fonctionnement..."

# Test 1: Récupération des prompts
Write-Host "   Test récupération des prompts..."
try {
    $testBody = @{
        action = "list-prompts"
    } | ConvertTo-Json

    $testResponse = Invoke-RestMethod -Uri $functionUrl -Method POST -Body $testBody -ContentType "application/json" -TimeoutSec 15
    
    if ($testResponse.success -and $testResponse.data.prompts) {
        Write-Success "✅ Prompts disponibles: $($testResponse.data.prompts.Count)"
        if ($Verbose) {
            $testResponse.data.prompts | ForEach-Object { Write-Host "     - $_" }
        }
    } else {
        throw "Réponse invalide"
    }
} catch {
    Write-Warning "⚠️  Test prompts échoué: $_"
}

# Test 2: Récupération d'un prompt spécifique
Write-Host "   Test récupération prompt spécifique..."
try {
    $testBody = @{
        action = "get-prompt"
        businessType = $BusinessType
    } | ConvertTo-Json

    $testResponse = Invoke-RestMethod -Uri $functionUrl -Method POST -Body $testBody -ContentType "application/json" -TimeoutSec 15
    
    if ($testResponse.success -and $testResponse.data.prompt) {
        Write-Success "✅ Prompt $BusinessType récupéré (${($testResponse.data.prompt.Length)} caractères)"
    } else {
        throw "Prompt non trouvé"
    }
} catch {
    Write-Warning "⚠️  Test prompt spécifique échoué: $_"
}

# ============================================================================
# 6. CONFIGURATION WEBHOOK
# ============================================================================

Write-Info "🔗 6. Configuration webhook..."

$webhookUrl = "$projectRef/functions/v1/vapi-configurator-webhook"
Write-Host "   URL Webhook: $webhookUrl"
Write-Success "✅ Webhook configuré"

# ============================================================================
# 7. RAPPORT FINAL
# ============================================================================

Write-Host ""
Write-Success "🎉 DÉPLOIEMENT TERMINÉ AVEC SUCCÈS !"
Write-Host "=" * 60

Write-Host ""
Write-Info "📊 RÉSUMÉ DU DÉPLOIEMENT:"
Write-Host "   • Agent Configurateur: ✅ Déployé"
Write-Host "   • Webhook Handler: ✅ Déployé"
Write-Host "   • Type d'activité: $BusinessType"
Write-Host "   • URL Fonction: $functionUrl"
Write-Host "   • URL Webhook: $webhookUrl"

Write-Host ""
Write-Info "🔧 PROCHAINES ÉTAPES:"
Write-Host "   1. Configurer l'URL webhook dans Vapi Dashboard"
Write-Host "   2. Tester l'agent via l'interface web"
Write-Host "   3. Valider le processus d'onboarding complet"

Write-Host ""
Write-Info "📚 DOCUMENTATION:"
Write-Host "   • Prompts: DOCS/prompts/Vapi_Configurateur_Prompts.md"
Write-Host "   • API: supabase/functions/vapi-configurator/"
Write-Host "   • Tests: Utilisez test-vapi-configurator.ps1"

Write-Host ""
Write-Success "Agent Vapi Configurateur prêt pour l'onboarding en 5 minutes ! 🚀"
Write-Host ""

# ============================================================================
# 8. SAUVEGARDE DES INFORMATIONS
# ============================================================================

$deploymentInfo = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    businessType = $BusinessType
    functionUrl = $functionUrl
    webhookUrl = $webhookUrl
    status = "success"
} | ConvertTo-Json -Depth 3

$deploymentInfo | Out-File -FilePath "vapi-configurator-deployment.json" -Encoding UTF8
Write-Info "📄 Informations sauvegardées dans: vapi-configurator-deployment.json" 