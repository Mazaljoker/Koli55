# Script utilisant MCP Supabase pour créer un assistant
# Create via MCP Supabase.ps1

Write-Host "🚀 Création Assistant via MCP Supabase" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Yellow

# Configuration automatique via MCP
$SUPABASE_PROJECT_ID = "aiurboizarbbcpynmmgv"
$SUPABASE_URL = "https://aiurboizarbbcpynmmgv.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NTk3NzYsImV4cCI6MjAzMTQzNTc3Nn0.JH0x8O1KnfDl5lsZFSBJ0TlkA3pFQ8aNSDT8VOMBh1o"

Write-Host "✅ Configuration Supabase automatique" -ForegroundColor Green
Write-Host "   Projet : KOLI ($SUPABASE_PROJECT_ID)" -ForegroundColor White
Write-Host "   URL : $SUPABASE_URL" -ForegroundColor White
Write-Host "   Region : eu-central-2" -ForegroundColor White

$headers = @{
    "Authorization" = "Bearer $SUPABASE_ANON_KEY"
    "Content-Type" = "application/json"
}

# Test de connexion aux edge functions
Write-Host "`n🔍 Vérification des Edge Functions..." -ForegroundColor Yellow

# Test de la fonction analyze-business
Write-Host "`n📊 Test 1: Analyze Business Function" -ForegroundColor Cyan

$businessDescription = "Restaurant italien La Bella Vista à Paris, spécialisé en pizza et pâtes fraîches, ambiance familiale"

try {
    $analyzePayload = @{ description = $businessDescription } | ConvertTo-Json
    $analyzeUrl = "$SUPABASE_URL/functions/v1/configurator-tools/analyze-business"
    
    Write-Host "   Appel : $analyzeUrl" -ForegroundColor Gray
    $analyzeResponse = Invoke-RestMethod -Uri $analyzeUrl -Method POST -Headers $headers -Body $analyzePayload
    
    $sector = $analyzeResponse.analysis.sector
    $template = $analyzeResponse.analysis.recommendedTemplate
    $confidence = $analyzeResponse.analysis.confidence
    
    Write-Host "✅ Secteur détecté : $sector (confiance: $confidence)" -ForegroundColor Green
    Write-Host "   Template : $($template.name)" -ForegroundColor White
    Write-Host "   Confiance : $($template.id)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur analyze-business : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Status Code : $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    exit 1
}

# Test de la fonction list-voices
Write-Host "`n🎵 Test 2: List Voices Function" -ForegroundColor Cyan

try {
    $voicesPayload = @{ 
        sector = $sector
        businessName = "La Bella Vista"
        language = "fr"
    } | ConvertTo-Json
    
    $voicesUrl = "$SUPABASE_URL/functions/v1/configurator-tools/list-voices"
    Write-Host "   Appel : $voicesUrl" -ForegroundColor Gray
    $voicesResponse = Invoke-RestMethod -Uri $voicesUrl -Method POST -Headers $headers -Body $voicesPayload
    
    $primaryVoice = $voicesResponse.recommendations.primary
    $alternatives = $voicesResponse.recommendations.alternatives
    
    Write-Host "✅ Voix recommandée : $($primaryVoice.name)" -ForegroundColor Green
    Write-Host "   Provider : $($primaryVoice.provider)" -ForegroundColor White
    Write-Host "   Style : $($primaryVoice.style)" -ForegroundColor White
    Write-Host "   Alternatives : $($alternatives.Count)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur list-voices : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Status Code : $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    exit 1
}

# Test de la fonction create-assistant
Write-Host "`n🚀 Test 3: Create Assistant Function" -ForegroundColor Cyan

try {
    $assistantPayload = @{
        businessName = "La Bella Vista"
        sector = $sector
        selectedVoice = @{
            provider = $primaryVoice.provider
            voiceId = $primaryVoice.voiceId
            name = $primaryVoice.name
        }
        template = $template
        userId = "test-mcp-user"
    } | ConvertTo-Json -Depth 10
    
    $createUrl = "$SUPABASE_URL/functions/v1/configurator-tools/create-assistant"
    Write-Host "   Appel : $createUrl" -ForegroundColor Gray
    $assistantResponse = Invoke-RestMethod -Uri $createUrl -Method POST -Headers $headers -Body $assistantPayload
    
    $assistantId = $assistantResponse.assistant_id
    $testUrl = $assistantResponse.test_url
    $supabaseId = $assistantResponse.supabase_id
    
    Write-Host "✅ Assistant créé avec succès !" -ForegroundColor Green
    Write-Host "   Vapi ID : $assistantId" -ForegroundColor Cyan
    Write-Host "   Supabase ID : $supabaseId" -ForegroundColor Cyan
    Write-Host "   Test URL : $testUrl" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erreur create-assistant : $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Status Code : $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    
    # Afficher plus de détails
    if ($_.ErrorDetails) {
        Write-Host "   Détails : $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit 1
}

# Résumé de succès
Write-Host "`n🎉 SUCCÈS COMPLET ! Assistant Créé via MCP" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Yellow
Write-Host "✅ Edge Functions Supabase opérationnelles" -ForegroundColor White
Write-Host "✅ Secteur analysé : $sector" -ForegroundColor White
Write-Host "✅ Voix sélectionnée : $($primaryVoice.name)" -ForegroundColor White
Write-Host "✅ Assistant Vapi déployé : $assistantId" -ForegroundColor White
Write-Host "✅ Données en Supabase : $supabaseId" -ForegroundColor White

Write-Host "`n🔗 Test Direct de l'Assistant :" -ForegroundColor Cyan
Write-Host "$testUrl" -ForegroundColor Blue

Write-Host "`n📋 Configuration Final Assistant Configurateur :" -ForegroundColor Yellow
Write-Host "1. 🤖 Assistant ID : $assistantId" -ForegroundColor White
Write-Host "2. 🎯 Secteur optimisé : $sector" -ForegroundColor White
Write-Host "3. 🎵 Voix configurée : $($primaryVoice.provider)/$($primaryVoice.voiceId)" -ForegroundColor White
Write-Host "4. 🚀 Prêt pour intégration frontend" -ForegroundColor White

Write-Host "`n✨ Les 3 Tools Configurateur sont maintenant testés et opérationnels !" -ForegroundColor Magenta

Write-Host "🚀 Test des Edge Functions via MCP Supabase" -ForegroundColor Cyan

# Configuration automatique du projet KOLI
$SUPABASE_PROJECT_ID = "aiurboizarbbcpynmmgv"
$SUPABASE_URL = "https://aiurboizarbbcpynmmgv.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NTk3NzYsImV4cCI6MjAzMTQzNTc3Nn0.JH0x8O1KnfDl5lsZFSBJ0TlkA3pFQ8aNSDT8VOMBh1o"

Write-Host "✅ Projet KOLI configuré automatiquement" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $SUPABASE_ANON_KEY"
    "Content-Type" = "application/json"
}

# Test des 3 edge functions configurateur
Write-Host "`n📊 Test analyze-business..." -ForegroundColor Yellow

try {
    $analyzePayload = @{ description = "Restaurant italien à Paris" } | ConvertTo-Json
    $analyzeResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/functions/v1/configurator-tools/analyze-business" -Method POST -Headers $headers -Body $analyzePayload
    
    Write-Host "✅ Secteur détecté : $($analyzeResponse.analysis.sector)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Erreur : $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nScript terminé" -ForegroundColor White 