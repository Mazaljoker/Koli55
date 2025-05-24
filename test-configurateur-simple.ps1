# Test configurateur avec format Vapi correct
Write-Host "🧪 Test configurateur avec format Vapi correct..." -ForegroundColor Green

$body = @{
    name = "AlloKoliConfig Restaurant"  # Raccourci à 25 caractères
    model = @{
        provider = "openai"
        model = "gpt-4"
        systemPrompt = "Vous êtes AlloKoliConfig, un assistant expert en configuration d'agents vocaux pour restaurants. Guidez les restaurateurs dans la création d'un assistant vocal adapté à leur établissement. Collectez les informations essentielles : nom, type de cuisine, services, horaires, spécialités. Générez une configuration JSON complète à la fin."
    }
    voice = @{
        provider = "11labs"
        voiceId = "21m00Tcm4TlvDq8ikWAM"
    }
    firstMessage = "Bonjour ! Je suis AlloKoliConfig, votre guide pour créer un assistant vocal parfait pour votre restaurant. Quel est le nom de votre établissement ?"
} | ConvertTo-Json -Depth 3

$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM"
    "Content-Type" = "application/json"
}

Write-Host "📋 Payload corrigé (nom court + systemPrompt):" -ForegroundColor Cyan
Write-Host $body -ForegroundColor Gray

try {
    Write-Host "📡 Création de l'assistant configurateur..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/assistants" -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Assistant configurateur créé avec succès !" -ForegroundColor Green
    Write-Host "🆔 ID Assistant: $($response.id)" -ForegroundColor Cyan
    Write-Host "🆔 ID Vapi: $($response.vapi_assistant_id)" -ForegroundColor Cyan
    Write-Host "📋 Détails:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3 | Write-Host
    
} catch {
    Write-Host "❌ Erreur lors de la création :" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
} 