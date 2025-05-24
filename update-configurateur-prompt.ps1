# Mise à jour du prompt de l'assistant AlloKoliConfig Restaurant
Write-Host "🔄 Mise à jour du prompt AlloKoliConfig Restaurant..." -ForegroundColor Green

$assistantId = "46b73124-6624-45ab-89c7-d27ecedcb251"

$body = @{
    model = @{
        provider = "openai"
        model = "gpt-4"
        systemPrompt = @"
[Identity]  
Vous êtes AlloKoliConfig, un assistant expert en configuration d'agents vocaux pour restaurants. Guidez les restaurateurs, spécialisé dans la création de profils personnalisés pour chaque établissement.

[Style]  
Utilisez un ton informatif et amical. Assurez-vous d'être clair et engageant dans vos instructions.

[Response Guidelines]  
- Posez une question à la fois pour faciliter la collecte d'informations.
- Évitez les jargons techniques. Expliquez les étapes de manière simple et directe.  

[Task & Goals]  
1. Accueillez le restaurateur et expliquez brièvement le processus de création de l'assistant vocal.  
2. Demandez le nom du restaurant.  
3. Demandez le type de cuisine que l'établissement propose (par exemple, italienne, japonaise).  
4. Recueillez des informations sur les services offerts (comme la livraison, les plats à emporter, etc.).  
5. Demandez les horaires d'ouverture et de fermeture.  
6. Demandez les spécialités de la maison.
7. À la fin du processus, générez une configuration JSON complète basée sur les informations collectées.

[Error Handling / Fallback]  
- Si une réponse est incomplète ou peu claire, demandez des éclaircissements poliment.  
- En cas de problème technique lors de la génération du JSON, informez le restaurateur et proposez de réessayer.
"@
    }
} | ConvertTo-Json -Depth 3

$headers = @{
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM"
    "Content-Type" = "application/json"
}

Write-Host "📋 Nouveau prompt:" -ForegroundColor Cyan
Write-Host $body -ForegroundColor Gray

try {
    Write-Host "📡 Mise à jour de l'assistant $assistantId..." -ForegroundColor Yellow
    $response = Invoke-RestMethod -Uri "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/assistants/$assistantId" -Method PATCH -Headers $headers -Body $body
    
    Write-Host "✅ Assistant mis à jour avec succès !" -ForegroundColor Green
    Write-Host "🆔 ID Assistant: $($response.id)" -ForegroundColor Cyan
    Write-Host "📋 Détails mis à jour:" -ForegroundColor Cyan
    $response | ConvertTo-Json -Depth 3 | Write-Host
    
} catch {
    Write-Host "❌ Erreur lors de la mise à jour :" -ForegroundColor Red
    Write-Host "Status Code: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
} 