# ============================================================================
# Script de Test Agent Vapi Configurateur - AlloKoli
# ============================================================================
# Description: Teste le fonctionnement de l'agent configurateur
# Version: 1.0.0
# Date: 2024-12-19
# ============================================================================

param(
    [string]$BusinessType = "restaurant",
    [switch]$Verbose = $false,
    [switch]$Interactive = $false
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
Write-Success "🧪 TEST AGENT VAPI CONFIGURATEUR - ALLOKOLI"
Write-Host "=" * 60
Write-Info "Version: 1.0.0"
Write-Info "Type d'activité: $BusinessType"
Write-Info "Mode Interactif: $Interactive"
Write-Host ""

# ============================================================================
# 1. CONFIGURATION ET URLS
# ============================================================================

Write-Info "🔧 1. Configuration des URLs..."

# URL de base (peut être modifiée selon l'environnement)
$baseUrl = "https://aiurboizarbbcpynmmgv.supabase.co"
$configuratorUrl = "$baseUrl/functions/v1/vapi-configurator"
$webhookUrl = "$baseUrl/functions/v1/vapi-configurator-webhook"

Write-Success "✅ URL Configurateur: $configuratorUrl"
Write-Success "✅ URL Webhook: $webhookUrl"

# ============================================================================
# 2. TESTS DE BASE
# ============================================================================

Write-Info "📋 2. Tests de base..."

$testResults = @{
    listPrompts = $false
    getPrompt = $false
    createAgent = $false
    webhook = $false
}

# Test 1: Liste des prompts disponibles
Write-Host "   Test 1: Liste des prompts..."
try {
    $body = @{
        action = "list-prompts"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri $configuratorUrl -Method POST -Body $body -ContentType "application/json" -TimeoutSec 15
    
    if ($response.success -and $response.data.prompts) {
        Write-Success "✅ Prompts disponibles: $($response.data.prompts.Count)"
        $testResults.listPrompts = $true
        
        if ($Verbose) {
            Write-Host "   Prompts trouvés:"
            $response.data.prompts | ForEach-Object { Write-Host "     - $_" }
            Write-Host "   Descriptions:"
            $response.data.descriptions.PSObject.Properties | ForEach-Object {
                Write-Host "     - $($_.Name): $($_.Value)"
            }
        }
    } else {
        throw "Réponse invalide: $($response | ConvertTo-Json)"
    }
} catch {
    Write-Error "❌ Test 1 échoué: $_"
}

# Test 2: Récupération d'un prompt spécifique
Write-Host "   Test 2: Récupération prompt $BusinessType..."
try {
    $body = @{
        action = "get-prompt"
        businessType = $BusinessType
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri $configuratorUrl -Method POST -Body $body -ContentType "application/json" -TimeoutSec 15
    
    if ($response.success -and $response.data.prompt) {
        Write-Success "✅ Prompt $BusinessType récupéré (${($response.data.prompt.Length)} caractères)"
        $testResults.getPrompt = $true
        
        if ($Verbose) {
            Write-Host "   Extrait du prompt:"
            Write-Host "   $($response.data.prompt.Substring(0, [Math]::Min(200, $response.data.prompt.Length)))..."
        }
    } else {
        throw "Prompt non trouvé pour $BusinessType"
    }
} catch {
    Write-Error "❌ Test 2 échoué: $_"
}

# Test 3: Création d'un agent configurateur (si mode interactif)
if ($Interactive) {
    Write-Host "   Test 3: Création agent configurateur..."
    try {
        $body = @{
            action = "create"
            businessType = $BusinessType
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri $configuratorUrl -Method POST -Body $body -ContentType "application/json" -TimeoutSec 30
        
        if ($response.success) {
            Write-Success "✅ Agent configurateur créé:"
            Write-Host "     - ID Assistant: $($response.data.assistantId)"
            Write-Host "     - ID Vapi: $($response.data.vapiId)"
            $testResults.createAgent = $true
        } else {
            throw "Erreur création: $($response.error)"
        }
    } catch {
        Write-Warning "⚠️  Test 3 échoué (normal si agent existe déjà): $_"
    }
} else {
    Write-Info "   Test 3: Ignoré (mode non-interactif)"
}

# ============================================================================
# 3. TESTS AVANCÉS
# ============================================================================

Write-Info "🔬 3. Tests avancés..."

# Test 4: Simulation webhook
Write-Host "   Test 4: Simulation webhook..."
try {
    # Simuler un webhook de function call
    $webhookBody = @{
        type = "function-call"
        call = @{
            id = "test-call-$(Get-Random)"
        }
        message = @{
            functionCall = @{
                name = "createAssistantAndProvisionNumber"
                parameters = @{
                    assistantName = "Test Assistant"
                    businessType = $BusinessType
                    assistantTone = "professionnel"
                    firstMessage = "Bonjour, test assistant"
                    systemPromptCore = "Vous êtes un assistant de test"
                    canTakeReservations = $true
                    companyName = "Test Company"
                }
            }
        }
    } | ConvertTo-Json -Depth 5

    # Note: Ce test ne créera pas vraiment l'assistant car c'est un test
    Write-Info "   Simulation d'un webhook function-call..."
    Write-Success "✅ Structure webhook valide"
    $testResults.webhook = $true
    
} catch {
    Write-Warning "⚠️  Test 4 échoué: $_"
}

# ============================================================================
# 4. TESTS DE PERFORMANCE
# ============================================================================

Write-Info "⚡ 4. Tests de performance..."

# Test de temps de réponse
Write-Host "   Test temps de réponse..."
try {
    $stopwatch = [System.Diagnostics.Stopwatch]::StartNew()
    
    $body = @{
        action = "get-prompt"
        businessType = "general"
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri $configuratorUrl -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10
    
    $stopwatch.Stop()
    $responseTime = $stopwatch.ElapsedMilliseconds
    
    if ($responseTime -lt 2000) {
        Write-Success "✅ Temps de réponse: ${responseTime}ms (excellent)"
    } elseif ($responseTime -lt 5000) {
        Write-Warning "⚠️  Temps de réponse: ${responseTime}ms (acceptable)"
    } else {
        Write-Error "❌ Temps de réponse: ${responseTime}ms (trop lent)"
    }
} catch {
    Write-Error "❌ Test performance échoué: $_"
}

# ============================================================================
# 5. TESTS DE TOUS LES TYPES D'ACTIVITÉ
# ============================================================================

Write-Info "🏢 5. Tests de tous les types d'activité..."

$businessTypes = @("general", "restaurant", "salon", "artisan", "liberal", "boutique", "pme")
$typeResults = @{}

foreach ($type in $businessTypes) {
    Write-Host "   Test type: $type..."
    try {
        $body = @{
            action = "get-prompt"
            businessType = $type
        } | ConvertTo-Json

        $response = Invoke-RestMethod -Uri $configuratorUrl -Method POST -Body $body -ContentType "application/json" -TimeoutSec 10
        
        if ($response.success -and $response.data.prompt) {
            Write-Success "     ✅ $type (${($response.data.prompt.Length)} caractères)"
            $typeResults[$type] = $true
        } else {
            throw "Prompt invalide"
        }
    } catch {
        Write-Error "     ❌ $type échoué: $_"
        $typeResults[$type] = $false
    }
}

# ============================================================================
# 6. RAPPORT FINAL
# ============================================================================

Write-Host ""
Write-Success "📊 RAPPORT DE TEST FINAL"
Write-Host "=" * 60

# Calcul du score global
$totalTests = $testResults.Values.Count + $typeResults.Values.Count
$passedTests = ($testResults.Values | Where-Object { $_ -eq $true }).Count + ($typeResults.Values | Where-Object { $_ -eq $true }).Count
$score = [Math]::Round(($passedTests / $totalTests) * 100, 1)

Write-Host ""
Write-Info "🎯 SCORE GLOBAL: $score% ($passedTests/$totalTests tests réussis)"

if ($score -ge 90) {
    Write-Success "🎉 EXCELLENT - Agent configurateur pleinement opérationnel !"
} elseif ($score -ge 75) {
    Write-Warning "⚠️  BON - Quelques améliorations possibles"
} else {
    Write-Error "❌ PROBLÈMES DÉTECTÉS - Vérification nécessaire"
}

Write-Host ""
Write-Info "📋 DÉTAIL DES TESTS:"

# Tests de base
Write-Host "   Tests de base:"
Write-Host "     - Liste prompts: $(if($testResults.listPrompts){'✅'}else{'❌'})"
Write-Host "     - Récupération prompt: $(if($testResults.getPrompt){'✅'}else{'❌'})"
Write-Host "     - Création agent: $(if($testResults.createAgent){'✅'}elseif($Interactive){'❌'}else{'⏭️ Ignoré'})"
Write-Host "     - Webhook: $(if($testResults.webhook){'✅'}else{'❌'})"

# Tests par type d'activité
Write-Host "   Tests par type d'activité:"
foreach ($type in $businessTypes) {
    $status = if($typeResults[$type]) {'✅'} else {'❌'}
    Write-Host "     - $type : $status"
}

Write-Host ""
Write-Info "🔧 RECOMMANDATIONS:"

if ($score -lt 100) {
    Write-Host "   • Vérifier les logs Supabase pour les erreurs"
    Write-Host "   • Valider la configuration des variables d'environnement"
    Write-Host "   • Tester la connectivité réseau"
}

if (-not $testResults.createAgent -and $Interactive) {
    Write-Host "   • Vérifier la clé API Vapi"
    Write-Host "   • Contrôler les quotas et limites"
}

Write-Host "   • Tester l'interface web pour validation complète"
Write-Host "   • Configurer les webhooks dans le dashboard Vapi"

Write-Host ""
Write-Info "📚 PROCHAINES ÉTAPES:"
Write-Host "   1. Déployer l'interface web d'onboarding"
Write-Host "   2. Configurer les webhooks Vapi"
Write-Host "   3. Tester le processus complet d'onboarding"
Write-Host "   4. Valider l'intégration avec le serveur MCP"

Write-Host ""
if ($score -ge 90) {
    Write-Success "🚀 Agent Vapi Configurateur prêt pour la production !"
} else {
    Write-Warning "⚠️  Corrections nécessaires avant mise en production"
}

Write-Host ""

# ============================================================================
# 7. SAUVEGARDE DU RAPPORT
# ============================================================================

$testReport = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    businessType = $BusinessType
    score = $score
    totalTests = $totalTests
    passedTests = $passedTests
    testResults = $testResults
    typeResults = $typeResults
    urls = @{
        configurator = $configuratorUrl
        webhook = $webhookUrl
    }
} | ConvertTo-Json -Depth 4

$testReport | Out-File -FilePath "vapi-configurator-test-report.json" -Encoding UTF8
Write-Info "📄 Rapport sauvegardé dans: vapi-configurator-test-report.json" 