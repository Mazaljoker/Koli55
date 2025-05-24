# Test de la fonction test-assistant
Write-Host "🧪 Test de la fonction test-assistant..." -ForegroundColor Green

$body = @{
    name = "AlloKoliConfig - Configurateur Restaurant"
    model = @{
        provider = "openai"
        model = "gpt-4"
        systemMessage = "Tu es AlloKoliConfig."
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

try {
    Write-Host "📡 Test de la fonction test-assistant..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/test-assistant" -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Succès !" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5 | Write-Host
    
} catch {
    Write-Host "❌ Erreur :" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
} 