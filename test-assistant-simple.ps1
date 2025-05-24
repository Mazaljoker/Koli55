# Test simple de création d'assistant via Edge Function
Write-Host "🧪 Test simple de création d'assistant..." -ForegroundColor Green

# Configuration très simple
$body = @{
    name = "Test Assistant Simple"
    model = @{
        provider = "openai"
        model = "gpt-4"
        systemMessage = "Tu es un assistant vocal."
    }
    voice = @{
        provider = "11labs"
        voiceId = "21m00Tcm4TlvDq8ikWAM"
    }
    firstMessage = "Bonjour !"
    language = "fr-FR"
} | ConvertTo-Json -Depth 3

$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM"
    "Content-Type" = "application/json"
}

Write-Host "📋 JSON à envoyer :" -ForegroundColor Cyan
Write-Host $body -ForegroundColor Gray

try {
    Write-Host "📡 Envoi de la requête..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/assistants" -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Assistant créé avec succès !" -ForegroundColor Green
    Write-Host "📋 Réponse :" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 5 | Write-Host
    
} catch {
    Write-Host "❌ Erreur lors de la création :" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
} 