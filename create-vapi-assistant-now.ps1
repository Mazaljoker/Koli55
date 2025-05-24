# Script pour créer l'assistant sur Vapi MAINTENANT
$assistantId = "416ed02f-3c8d-43b4-b6da-adb711b025bf"

# Vérification des variables d'environnement
$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
$anonKey = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY

if (-not $supabaseUrl) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $anonKey) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}

$url = "$supabaseUrl/functions/v1/create-vapi-assistant"
$headers = @{
    "Authorization" = "Bearer $anonKey"
    "Content-Type" = "application/json"
}

Write-Host "🎤 Création de l'assistant sur Vapi..." -ForegroundColor Green
Write-Host "Assistant ID: $assistantId" -ForegroundColor Cyan

try {
    $body = @{
        assistantId = $assistantId
    } | ConvertTo-Json

    $response = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body
    
    if ($response.success) {
        Write-Host "✅ SUCCÈS!" -ForegroundColor Green
        Write-Host "Message: $($response.data.message)" -ForegroundColor White
        Write-Host "Assistant ID: $($response.data.assistantId)" -ForegroundColor Yellow
        Write-Host "Vapi Assistant ID: $($response.data.vapiAssistantId)" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "🎉 PREMIER ASSISTANT CRÉÉ AVEC SUCCÈS!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur: $($response.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
} 