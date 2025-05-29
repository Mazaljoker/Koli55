# Script de test simplifié pour l'API Vapi
Write-Host "Test de l'API Vapi..." -ForegroundColor Green

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
    
    $response = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $VAPI_API_KEY"
            "Content-Type" = "application/json"
        } `
        -Body $jsonData `
        -ErrorAction Stop
    
    Write-Host "SUCCES ! Assistant cree:" -ForegroundColor Green
    Write-Host "ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "Nom: $($response.name)" -ForegroundColor Cyan
    
} catch {
    Write-Host "Erreur:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Details erreur:" -ForegroundColor Yellow
        Write-Host $errorBody -ForegroundColor Yellow
    }
} 