# Test direct de l'API Vapi
Write-Host "🧪 Test direct de l'API Vapi..." -ForegroundColor Green

# Utiliser la clé API Vapi directement (récupérée depuis les secrets Supabase)
# Note: En production, cette clé serait récupérée depuis les variables d'environnement
$vapiKey = "vapi_sk_b8e8f8e8-8e8e-8e8e-8e8e-8e8e8e8e8e8e"  # Remplacer par la vraie clé

try {
    Write-Host "✅ Test avec clé API Vapi" -ForegroundColor Green
    
    # Test 1: Lister les assistants existants
    Write-Host "📋 Test 1: Liste des assistants..." -ForegroundColor Cyan
    $headers = @{
        "Authorization" = "Bearer $vapiKey"
        "Accept" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "https://api.vapi.ai/assistants" -Method GET -Headers $headers
    Write-Host "✅ Succès ! Nombre d'assistants: $($response.data.Count)" -ForegroundColor Green
    
    # Test 2: Créer un assistant simple
    Write-Host "📋 Test 2: Création d'un assistant..." -ForegroundColor Cyan
    $assistantData = @{
        name = "Test Assistant AlloKoli"
        model = @{
            provider = "openai"
            model = "gpt-4"
            systemPrompt = "Tu es un assistant vocal de test."
        }
        voice = @{
            provider = "11labs"
            voiceId = "21m00Tcm4TlvDq8ikWAM"
        }
        firstMessage = "Bonjour ! Je suis un assistant de test."
    } | ConvertTo-Json -Depth 3
    
    $headers["Content-Type"] = "application/json"
    
    $createResponse = Invoke-RestMethod -Uri "https://api.vapi.ai/assistants" -Method POST -Headers $headers -Body $assistantData
    Write-Host "✅ Assistant créé avec succès ! ID: $($createResponse.id)" -ForegroundColor Green
    
    # Test 3: Supprimer l'assistant de test
    Write-Host "📋 Test 3: Suppression de l'assistant de test..." -ForegroundColor Cyan
    Invoke-RestMethod -Uri "https://api.vapi.ai/assistants/$($createResponse.id)" -Method DELETE -Headers $headers
    Write-Host "✅ Assistant supprimé avec succès !" -ForegroundColor Green
    
    Write-Host "🎉 Tous les tests API Vapi ont réussi !" -ForegroundColor Green
    Write-Host "🔧 L'Edge Function assistants devrait donc fonctionner..." -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ Erreur lors du test API Vapi :" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
} 