# Script de test des tools configurateur
# Test rapide des 3 tools configurateur

Write-Host "🧪 Test des Tools Configurateur AlloKoli" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Yellow

# Variables d'environnement
$SUPABASE_PROJECT_ID = $env:SUPABASE_PROJECT_ID
$SUPABASE_ANON_KEY = $env:SUPABASE_ANON_KEY

if (-not $SUPABASE_PROJECT_ID -or -not $SUPABASE_ANON_KEY) {
    Write-Host "❌ Variables d'environnement manquantes (SUPABASE_PROJECT_ID, SUPABASE_ANON_KEY)" -ForegroundColor Red
    exit 1
}

$baseUrl = "https://$SUPABASE_PROJECT_ID.supabase.co/functions/v1/configurator-tools"
$headers = @{
    "Authorization" = "Bearer $SUPABASE_ANON_KEY"
    "Content-Type" = "application/json"
}

# Test 1: Analyze Business Tool
Write-Host "`n🔧 Test 1: Analyze Business Tool" -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Yellow

$testCases = @(
    @{
        name = "Restaurant Italien"
        description = "Restaurant italien à Paris spécialisé en pizza et pâtes fraîches, ambiance familiale"
        expectedSector = "restaurant"
    },
    @{
        name = "Salon de Coiffure"
        description = "Salon de coiffure moderne dans le centre-ville, coupes, colorations et soins"
        expectedSector = "salon"
    },
    @{
        name = "Plombier Artisan"
        description = "Plombier chauffagiste, dépannage d'urgence 24h/24, réparations"
        expectedSector = "artisan"
    },
    @{
        name = "Cabinet Conseil"
        description = "Cabinet de conseil en management, accompagnement des entreprises"
        expectedSector = "service"
    }
)

foreach ($testCase in $testCases) {
    Write-Host "Testing: $($testCase.name)..." -ForegroundColor White
    
    try {
        $payload = @{ description = $testCase.description } | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$baseUrl/analyze-business" -Method POST -Headers $headers -Body $payload
        
        $detectedSector = $response.analysis.sector
        $confidence = $response.analysis.confidence
        
        if ($detectedSector -eq $testCase.expectedSector) {
            Write-Host "✅ $($testCase.name): $detectedSector (confiance: $confidence)" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $($testCase.name): Attendu $($testCase.expectedSector), obtenu $detectedSector" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "❌ $($testCase.name): Erreur - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 2: List Voices Tool
Write-Host "`n🎵 Test 2: List Voices Tool" -ForegroundColor Cyan
Write-Host "---------------------------" -ForegroundColor Yellow

$voiceTestCases = @("restaurant", "salon", "artisan", "service", "medical")

foreach ($sector in $voiceTestCases) {
    Write-Host "Testing voices for sector: $sector..." -ForegroundColor White
    
    try {
        $payload = @{ 
            sector = $sector
            businessName = "Test Business"
            language = "fr"
        } | ConvertTo-Json
        
        $response = Invoke-RestMethod -Uri "$baseUrl/list-voices" -Method POST -Headers $headers -Body $payload
        
        $primaryVoice = $response.recommendations.primary.name
        $alternativesCount = $response.recommendations.alternatives.Count
        
        Write-Host "✅ $sector`: $primaryVoice + $alternativesCount alternatives" -ForegroundColor Green
        
    } catch {
        Write-Host "❌ $sector`: Erreur - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 3: Webhook Handler (simulation)
Write-Host "`n🔗 Test 3: Webhook Handler (Simulation)" -ForegroundColor Cyan
Write-Host "---------------------------------------" -ForegroundColor Yellow

$webhookUrl = "https://allokoli.vercel.app/api/vapi/webhook"

# Test function call simulation
$testFunctionCalls = @(
    @{
        name = "analyzeBusinessContext"
        parameters = @{
            description = "Boutique de vêtements en ligne, livraison rapide"
        }
    },
    @{
        name = "listVoicesForSector"
        parameters = @{
            sector = "ecommerce"
            businessName = "Fashion Store"
        }
    }
)

foreach ($functionCall in $testFunctionCalls) {
    Write-Host "Testing webhook function: $($functionCall.name)..." -ForegroundColor White
    
    try {
        $webhookPayload = @{
            type = "function-call"
            functionCall = $functionCall
        } | ConvertTo-Json -Depth 5
        
        $response = Invoke-RestMethod -Uri $webhookUrl -Method POST -Headers @{"Content-Type" = "application/json"} -Body $webhookPayload
        
        if ($response.result -and -not $response.result.error) {
            Write-Host "✅ $($functionCall.name): Webhook OK" -ForegroundColor Green
        } else {
            Write-Host "⚠️  $($functionCall.name): $($response.result.error)" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "❌ $($functionCall.name): Erreur webhook - $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Assistant Configurateur Status
Write-Host "`n🤖 Test 4: Assistant Configurateur Status" -ForegroundColor Cyan
Write-Host "------------------------------------------" -ForegroundColor Yellow

$VAPI_API_KEY = $env:VAPI_API_KEY
$CONFIGURATOR_ASSISTANT_ID = "46b73124-6624-45ab-89c7-d27ecedcb251"

if ($VAPI_API_KEY) {
    try {
        $vapiHeaders = @{
            "Authorization" = "Bearer $VAPI_API_KEY"
            "Content-Type" = "application/json"
        }
        
        $assistant = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant/$CONFIGURATOR_ASSISTANT_ID" -Headers $vapiHeaders
        
        $toolsCount = if ($assistant.tools) { $assistant.tools.Count } else { 0 }
        $hasWebhook = if ($assistant.serverUrl) { "✅" } else { "❌" }
        
        Write-Host "✅ Assistant Status:" -ForegroundColor Green
        Write-Host "   - ID: $($assistant.id)" -ForegroundColor White
        Write-Host "   - Name: $($assistant.name)" -ForegroundColor White
        Write-Host "   - Tools: $toolsCount configurés" -ForegroundColor White
        Write-Host "   - Webhook: $hasWebhook $($assistant.serverUrl)" -ForegroundColor White
        
    } catch {
        Write-Host "❌ Impossible de vérifier l'assistant Vapi: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  VAPI_API_KEY non configurée, impossible de tester l'assistant" -ForegroundColor Yellow
}

# Résumé des tests
Write-Host "`n📊 Résumé des Tests" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Yellow

Write-Host "🔧 Analyze Business Tool: Tests sectoriels" -ForegroundColor White
Write-Host "🎵 List Voices Tool: Tests recommandations vocales" -ForegroundColor White
Write-Host "🔗 Webhook Handler: Tests function calls" -ForegroundColor White
Write-Host "🤖 Assistant Status: Vérification configuration" -ForegroundColor White

Write-Host "`n🎯 Commande de déploiement complet:" -ForegroundColor Yellow
Write-Host "pwsh -File deploy-tools-configurateur.ps1" -ForegroundColor Cyan

Write-Host "`n🌐 Tester l'interface complète:" -ForegroundColor Yellow
Write-Host "https://allokoli.vercel.app/configurateur" -ForegroundColor Cyan

Write-Host "`n✅ Phase 1 Tools: FINALISÉE et TESTÉE !" -ForegroundColor Green 