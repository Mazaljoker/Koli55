# Test de création d'assistant via Edge Function
Write-Host "🧪 Test de création d'assistant configurateur restaurant..." -ForegroundColor Green

# Configuration simple
$body = @{
    name = "AlloKoliConfig - Configurateur Restaurant"
    model = @{
        provider = "openai"
        model = "gpt-4"
        temperature = 0.7
        maxTokens = 1500
        systemMessage = "Vous êtes AlloKoliConfig, un assistant IA expert en configuration d'agents vocaux personnalisés pour les restaurants."
    }
    voice = @{
        provider = "11labs"
        voiceId = "21m00Tcm4TlvDq8ikWAM"
    }
    firstMessage = "Bonjour ! Je suis AlloKoliConfig, votre guide spécialisé pour créer un assistant vocal parfait pour votre restaurant."
    language = "fr-FR"
} | ConvertTo-Json -Depth 5

$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM"
    "Content-Type" = "application/json"
}

try {
    Write-Host "📡 Envoi de la requête..." -ForegroundColor Yellow
    Write-Host "🔍 Body envoyé:" -ForegroundColor Gray
    Write-Host $body -ForegroundColor Gray
    
    $response = Invoke-RestMethod -Uri "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/assistants" -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Assistant créé avec succès !" -ForegroundColor Green
    Write-Host "📋 Réponse :" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5 | Write-Host
    
} catch {
    Write-Host "❌ Erreur lors de la création :" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    # Essayer de lire le contenu de l'erreur avec WebRequest
    try {
        $errorResponse = $_.Exception.Response
        $stream = $errorResponse.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Détails de l'erreur: $errorBody" -ForegroundColor Red
    } catch {
        Write-Host "Impossible de lire les détails de l'erreur: $($_.Exception.Message)" -ForegroundColor Yellow
    }
} 