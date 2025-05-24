# Test simple de l'Edge Function assistants
Write-Host "🧪 Test simple Edge Function assistants..." -ForegroundColor Green

$body = @{
    name = "Test Simple"
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM"
    "Content-Type" = "application/json"
}

Write-Host "📋 Payload:" -ForegroundColor Cyan
Write-Host $body -ForegroundColor Gray

try {
    Write-Host "📡 Envoi de la requête..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/assistants" -Method POST -Headers $headers -Body $body
    
    Write-Host "✅ Succès !" -ForegroundColor Green
    $response | ConvertTo-Json -Depth 5 | Write-Host
    
} catch {
    Write-Host "❌ Erreur :" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
    
    # Essayer de lire le contenu de la réponse d'erreur
    try {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorContent = $reader.ReadToEnd()
        Write-Host "Détails de l'erreur:" -ForegroundColor Yellow
        Write-Host $errorContent -ForegroundColor Red
    } catch {
        Write-Host "Impossible de lire les détails de l'erreur" -ForegroundColor Yellow
    }
} 