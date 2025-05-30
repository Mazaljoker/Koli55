# Script pour créer un assistant via les edge functions Supabase
# Create Vapi Assistant Direct.ps1

Write-Host "🤖 Création Assistant via Edge Functions Supabase" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Yellow

# Configuration Supabase
$SUPABASE_URL = "https://your-project.supabase.co"  # 👈 VOTRE URL SUPABASE
$SUPABASE_ANON_KEY = "your-anon-key"  # 👈 VOTRE CLÉ PUBLIQUE

# Vérification configuration
if ($SUPABASE_URL -eq "https://your-project.supabase.co" -or $SUPABASE_ANON_KEY -eq "your-anon-key") {
    Write-Host "`n❌ Configuration Supabase requise !" -ForegroundColor Red
    Write-Host "┌────────────────────────────────────────────────────────────┐" -ForegroundColor Yellow
    Write-Host "│ 1. Récupérez votre URL Supabase                           │" -ForegroundColor Yellow
    Write-Host "│ 2. Récupérez votre clé anon/publique                      │" -ForegroundColor Yellow
    Write-Host "│ 3. Modifiez ce script avec vos vraies valeurs             │" -ForegroundColor Yellow
    Write-Host "└────────────────────────────────────────────────────────────┘" -ForegroundColor Yellow
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $SUPABASE_ANON_KEY"
    "Content-Type" = "application/json"
}

# Scénario de test complet : Restaurant Italien
Write-Host "`n🎯 Test Complet : Création Assistant Restaurant" -ForegroundColor Cyan

# Étape 1 : Analyser le business
Write-Host "`n📊 Étape 1 : Analyse du secteur d'activité..." -ForegroundColor Yellow

$businessDescription = "Restaurant italien La Bella Vista à Paris, spécialisé en pizza et pâtes fraîches, ambiance familiale"

try {
    $analyzePayload = @{ description = $businessDescription } | ConvertTo-Json
    $analyzeResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/functions/v1/configurator-tools/analyze-business" -Method POST -Headers $headers -Body $analyzePayload
    
    $sector = $analyzeResponse.analysis.sector
    $template = $analyzeResponse.analysis.recommendedTemplate
    $confidence = $analyzeResponse.analysis.confidence
    
    Write-Host "✅ Secteur détecté : $sector (confiance: $confidence)" -ForegroundColor Green
    Write-Host "   Template recommandé : $($template.name)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur analyse business : $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Étape 2 : Sélectionner les voix
Write-Host "`n🎵 Étape 2 : Recommandations vocales..." -ForegroundColor Yellow

try {
    $voicesPayload = @{ 
        sector = $sector
        businessName = "La Bella Vista"
        language = "fr"
    } | ConvertTo-Json
    
    $voicesResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/functions/v1/configurator-tools/list-voices" -Method POST -Headers $headers -Body $voicesPayload
    
    $primaryVoice = $voicesResponse.recommendations.primary
    $alternatives = $voicesResponse.recommendations.alternatives
    
    Write-Host "✅ Voix recommandée : $($primaryVoice.name)" -ForegroundColor Green
    Write-Host "   Style : $($primaryVoice.style)" -ForegroundColor White
    Write-Host "   Raison : $($primaryVoice.reason)" -ForegroundColor White
    Write-Host "   Alternatives : $($alternatives.Count)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur recommandations vocales : $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Étape 3 : Créer l'assistant complet
Write-Host "`n🚀 Étape 3 : Création assistant complet..." -ForegroundColor Yellow

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
        userId = "test-user"
    } | ConvertTo-Json -Depth 10
    
    $assistantResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/functions/v1/configurator-tools/create-assistant" -Method POST -Headers $headers -Body $assistantPayload
    
    $assistantId = $assistantResponse.assistant_id
    $testUrl = $assistantResponse.test_url
    $supabaseId = $assistantResponse.supabase_id
    
    Write-Host "✅ Assistant créé avec succès !" -ForegroundColor Green
    Write-Host "   Vapi ID : $assistantId" -ForegroundColor Cyan
    Write-Host "   Supabase ID : $supabaseId" -ForegroundColor Cyan
    Write-Host "   Test URL : $testUrl" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erreur création assistant : $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Résumé final
Write-Host "`n🎉 SUCCÈS ! Assistant Restaurant Créé" -ForegroundColor Green
Write-Host "=======================================" -ForegroundColor Yellow
Write-Host "✅ Secteur analysé automatiquement : $sector" -ForegroundColor White
Write-Host "✅ Voix optimisée sélectionnée : $($primaryVoice.name)" -ForegroundColor White
Write-Host "✅ Assistant Vapi déployé : $assistantId" -ForegroundColor White
Write-Host "✅ Données sauvées en Supabase : $supabaseId" -ForegroundColor White

Write-Host "`n🔗 Testez votre assistant :" -ForegroundColor Cyan
Write-Host "$testUrl" -ForegroundColor Blue

Write-Host "`n📝 Prochaines étapes :" -ForegroundColor Yellow
Write-Host "1. Tester l'assistant via l'URL ci-dessus" -ForegroundColor White
Write-Host "2. Ajuster la configuration si nécessaire" -ForegroundColor White
Write-Host "3. Intégrer dans votre application" -ForegroundColor White 