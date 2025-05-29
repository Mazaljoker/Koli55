# Script de debug pour l'API Vapi
Write-Host "Debug de l'API Vapi..." -ForegroundColor Green

$VAPI_API_KEY = $env:VAPI_API_KEY
if (-not $VAPI_API_KEY) {
    Write-Host "ERREUR: Variable VAPI_API_KEY non definie" -ForegroundColor Red
    exit 1
}

# Configuration minimale pour test
$assistantData = @{
    name = "Test AlloKoli Assistant"
    model = @{
        provider = "openai"
        model = "gpt-4o"
        temperature = 0.7
        maxTokens = 1000
        systemMessage = "Vous êtes un assistant vocal test pour AlloKoli."
    }
    voice = @{
        provider = "elevenlabs"
        voiceId = "shimmer"
    }
    language = "fr-FR"
    firstMessage = "Bonjour, je suis un assistant test."
}

$jsonData = $assistantData | ConvertTo-Json -Depth 5

Write-Host "Donnees preparees:" -ForegroundColor Yellow
Write-Host $jsonData -ForegroundColor Cyan

try {
    Write-Host "Test creation assistant..." -ForegroundColor Blue
    
    # Utiliser Invoke-WebRequest pour avoir plus de contrôle sur les erreurs
    $response = Invoke-WebRequest -Uri "https://api.vapi.ai/assistant" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $VAPI_API_KEY"
            "Content-Type" = "application/json"
        } `
        -Body $jsonData `
        -UseBasicParsing
    
    $responseData = $response.Content | ConvertFrom-Json
    
    Write-Host "SUCCES ! Assistant cree:" -ForegroundColor Green
    Write-Host "ID: $($responseData.id)" -ForegroundColor Cyan
    Write-Host "Nom: $($responseData.name)" -ForegroundColor Cyan
    
} catch {
    Write-Host "Erreur:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
        Write-Host "Status Description: $($_.Exception.Response.StatusDescription)" -ForegroundColor Yellow
        
        # Essayer de lire le contenu de l'erreur
        try {
            $errorContent = $_.ErrorDetails.Message
            if ($errorContent) {
                Write-Host "Details erreur:" -ForegroundColor Yellow
                Write-Host $errorContent -ForegroundColor Yellow
            }
        } catch {
            Write-Host "Impossible de lire les details de l'erreur" -ForegroundColor Yellow
        }
    }
} 