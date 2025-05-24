# Script pour créer l'assistant configurateur restaurant sur Vapi
Write-Host "🍽️ Création de l'assistant configurateur restaurant sur Vapi..." -ForegroundColor Green

# Configuration de l'assistant
$assistantData = @{
    name = "AlloKoliConfig - Configurateur Restaurant"
    model = @{
        provider = "openai"
        model = "gpt-4"
        temperature = 0.7
        maxTokens = 1500
        systemMessage = @"
Vous êtes **AlloKoliConfig**, un assistant IA expert en configuration d'agents vocaux personnalisés pour les restaurants. Votre mission est d'aider le restaurateur, de manière conversationnelle et didactique, à définir tous les paramètres nécessaires pour créer son propre assistant vocal intelligent en moins de 5 minutes.

### [Style de Communication]
- **Ton** : Accueillant, professionnel, patient, et très pédagogue. Spécifiquement pour les restaurants, vous pouvez utiliser un ton légèrement plus chaleureux et gourmand si approprié
- **Langage** : Simple, clair, évitez le jargon technique
- **Conversation** : Naturelle, posez une question à la fois
- **Objectif** : Rendre le processus facile et agréable, même pour un restaurateur très occupé

### [Processus de Collecte - Restaurant]
Collectez ces informations dans l'ordre, une par une :

1. **Nom de l'assistant** : "Comment souhaitez-vous nommer votre assistant vocal ?"
2. **Type de restaurant** : "Quel type de restaurant dirigez-vous ? (bistrot, pizzeria, gastronomique, fast-food, etc.)"
3. **Horaires d'ouverture** : "Quels sont vos horaires d'ouverture ?"
4. **Services proposés** : "Proposez-vous la livraison, la vente à emporter, ou uniquement sur place ?"
5. **Spécialités** : "Quelles sont vos spécialités culinaires principales ?"
6. **Réservations** : "Acceptez-vous les réservations ? Si oui, comment ?"
7. **Informations pratiques** : "Adresse, numéro de téléphone, site web ?"
8. **Ton souhaité** : "Quel ton souhaitez-vous pour votre assistant ? (professionnel, décontracté, chaleureux, etc.)"

### [Validation et Génération]
Une fois toutes les informations collectées, générez le JSON de configuration.
"@
    }
    voice = @{
        provider = "11labs"
        voiceId = "21m00Tcm4TlvDq8ikWAM"
    }
    firstMessage = "Bonjour ! Je suis AlloKoliConfig, votre guide spécialisé pour créer un assistant vocal parfait pour votre restaurant. Nous allons configurer ensemble votre assistant en moins de 5 minutes. Pour commencer, quel nom aimeriez-vous donner à votre futur assistant vocal ?"
    endCallMessage = "Parfait ! Votre assistant vocal pour restaurant est maintenant configuré. Vous recevrez un email avec tous les détails dans quelques minutes. Merci d'avoir choisi AlloKoli !"
    language = "fr-FR"
} | ConvertTo-Json -Depth 10

# URL de l'Edge Function
$url = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/assistants"

# Headers
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NjE1NzUsImV4cCI6MjAzMTQzNzU3NX0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"
}

try {
    Write-Host "📡 Envoi de la requête à l'Edge Function..." -ForegroundColor Yellow
    
    $response = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $assistantData -ContentType "application/json"
    
    Write-Host "✅ Assistant créé avec succès sur Vapi !" -ForegroundColor Green
    Write-Host "📋 Détails de l'assistant :" -ForegroundColor Cyan
    Write-Host "   - ID Vapi: $($response.id)" -ForegroundColor White
    Write-Host "   - Nom: $($response.name)" -ForegroundColor White
    Write-Host "   - Modèle: $($response.model.model)" -ForegroundColor White
    Write-Host "   - Voix: $($response.voice.voiceId)" -ForegroundColor White
    
    # Mettre à jour la base de données avec l'ID Vapi
    Write-Host "🔄 Mise à jour de la base de données..." -ForegroundColor Yellow
    
    $updateData = @{
        vapi_assistant_id = $response.id
        assistant_id = "9320cc3a-4e66-405d-86c7-36f53fbf3ded"
    } | ConvertTo-Json
    
    $updateUrl = "https://aiurboizarbbcpynmmgv.supabase.co/rest/v1/assistants?id=eq.9320cc3a-4e66-405d-86c7-36f53fbf3ded"
    $updateHeaders = @{
        "Content-Type" = "application/json"
        "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NjE1NzUsImV4cCI6MjAzMTQzNzU3NX0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"
        "apikey" = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NjE1NzUsImV4cCI6MjAzMTQzNzU3NX0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8"
        "Prefer" = "return=minimal"
    }
    
    Invoke-RestMethod -Uri $updateUrl -Method PATCH -Headers $updateHeaders -Body "{`"vapi_assistant_id`":`"$($response.id)`"}" -ContentType "application/json"
    
    Write-Host "✅ Base de données mise à jour avec l'ID Vapi !" -ForegroundColor Green
    Write-Host "🎉 Assistant configurateur restaurant créé et configuré avec succès !" -ForegroundColor Magenta
    
} catch {
    Write-Host "❌ Erreur lors de la création de l'assistant :" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Détails de l'erreur: $responseBody" -ForegroundColor Red
    }
} 