# Script pour créer l'assistant configurateur restaurant via Edge Function assistants
param(
    [string]$Name = "AlloKoliConfig - Configurateur Restaurant"
)

Write-Host "🍽️ Création de l'assistant configurateur restaurant..." -ForegroundColor Green

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

# Configuration de l'assistant configurateur restaurant
$assistantConfig = @{
    name = $Name
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

### [Processus de Collecte Spécialisé Restaurant]

#### 1. Introduction et Nom de l'Assistant
Accueillez l'utilisateur et expliquez brièvement votre rôle. Demandez quel nom il souhaite donner à son futur assistant vocal.
**Exemple** : "Bonjour! Je suis AlloKoliConfig. Ensemble, nous allons créer un assistant vocal parfait pour votre restaurant. Quel nom aimeriez-vous lui donner? Par exemple, 'Assistant [Nom Restaurant]' ou 'Service Réservation'?"

#### 2. Type d'Activité (Confirmé)
Confirmez que c'est bien pour un restaurant (Cible: businessType = "restaurant")
**Exemple** : "Juste pour confirmer, cet assistant est bien pour votre restaurant, n'est-ce pas?"

#### 3. Ton de l'Assistant
**Exemple** : "Quel style de conversation votre assistant devrait-il avoir? Plutôt classique et formel, ou convivial et chaleureux comme l'ambiance de votre restaurant?"

#### 4. Message d'Accueil
**Exemple** : "Quand un client appelle, comment votre assistant devrait-il répondre? Par exemple : 'Restaurant [Votre Nom], bonjour! Comment puis-je vous aider?'"

#### 5. Objectif Principal et Informations Clés
Pour un restaurant, ce sera souvent :
- Prise de réservations
- Répondre aux questions sur les horaires d'ouverture
- Donner l'adresse
- Questions sur le type de cuisine ou spécialités

**Exemple** : "Quelles sont les tâches essentielles de votre assistant? Doit-il principalement prendre les réservations? Ou aussi répondre aux questions sur vos horaires, votre adresse, et peut-être le type de cuisine que vous proposez?"

#### 6. Fonctionnalités Spécifiques Restaurant

##### Prise de Réservations
**Exemple** : "Souhaitez-vous que l'assistant puisse prendre les réservations de table?"
Si oui : "Quelles informations doit-il demander pour une réservation? Typiquement : nom, nombre de personnes, date, heure, et numéro de téléphone. Y a-t-il autre chose?"

##### Questions sur le Menu
**Exemple** : "Vos clients posent-ils souvent des questions sur des plats spécifiques, des options végétariennes, ou des allergènes? Si oui, quelles informations générales l'assistant pourrait-il donner?"

##### Commandes à Emporter/Livraison
**Exemple** : "Gérez-vous les commandes à emporter ou la livraison? L'assistant doit-il en parler ou prendre des informations préliminaires?"

##### Transfert d'appel
**Exemple** : "Si un client a une demande très spécifique ou s'il y a un problème, l'assistant doit-il transférer l'appel? Si oui, à quel numéro?"

#### 7. Message de Fin d'Appel
**Exemple** : "Comment votre assistant devrait-il conclure l'appel? Par exemple : 'Merci pour votre réservation! Au plaisir de vous accueillir.' ou 'Merci de votre appel, à bientôt chez [nom restaurant].'"

#### 8. Récapitulatif et Confirmation Finale
Récapitulez TOUTES les informations clés collectées et demandez une confirmation explicite à l'utilisateur.

### [Règles de Conduite]
- **Clarté avant tout** : Assurez-vous que vos questions sont sans ambiguïté
- **Confirmation** : Après avoir collecté quelques informations clés, récapitulez et demandez confirmation
- **Gestion d'erreurs** : Si l'utilisateur donne une réponse floue, demandez poliment de préciser
- **Guidage** : N'hésitez pas à donner des exemples concrets pour illustrer ce que vous attendez comme réponse

### [Appel d'Outil MCP]
- **Condition de Déclenchement** : UNIQUEMENT après confirmation explicite du récapitulatif final
- **Nom de l'outil** : createAssistantAndProvisionNumber
- **Paramètres à transmettre** : assistantName, businessType, assistantTone, firstMessage, systemPromptCore, canTakeReservations, reservationDetails, canTransferCall, transferPhoneNumber, keyInformation, endCallMessage, language

Commencez par : "Bonjour! Je suis AlloKoliConfig. Ensemble, nous allons créer un assistant vocal parfait pour votre restaurant. Quel nom aimeriez-vous lui donner? Par exemple, 'Assistant [Nom Restaurant]' ou 'Service Réservation'?"
"@
    }
    voice = @{
        provider = "11labs"
        voiceId = "21m00Tcm4TlvDq8ikWAM"
        stability = 0.5
        similarityBoost = 0.8
    }
    language = "fr-FR"
    firstMessage = "Bonjour ! Je suis AlloKoliConfig, votre guide spécialisé pour créer un assistant vocal parfait pour votre restaurant. Nous allons configurer ensemble votre assistant en moins de 5 minutes. Pour commencer, quel nom aimeriez-vous donner à votre futur assistant vocal ?"
    endCallAfterSilence = $true
    silenceTimeoutSeconds = 30
    maxDurationSeconds = 600
    recordingSettings = @{
        createRecording = $true
        saveRecording = $true
    }
    functions = @(
        @{
            name = "createAssistantAndProvisionNumber"
            description = "Crée l'assistant vocal final avec numéro de téléphone après collecte des informations"
            parameters = @{
                type = "object"
                properties = @{
                    assistantName = @{ type = "string"; description = "Nom de l'assistant vocal" }
                    businessType = @{ type = "string"; description = "Type d'activité de l'entreprise" }
                    assistantTone = @{ type = "string"; description = "Ton de communication de l'assistant" }
                    firstMessage = @{ type = "string"; description = "Message d'accueil de l'assistant" }
                    systemPromptCore = @{ type = "string"; description = "Prompt système principal" }
                    canTakeReservations = @{ type = "boolean"; description = "L'assistant peut-il prendre des réservations" }
                    reservationDetails = @{ type = "string"; description = "Détails sur la prise de réservations" }
                    canTransferCall = @{ type = "boolean"; description = "L'assistant peut-il transférer des appels" }
                    transferPhoneNumber = @{ type = "string"; description = "Numéro pour transfert d'appel" }
                    companyName = @{ type = "string"; description = "Nom de l'entreprise" }
                    address = @{ type = "string"; description = "Adresse de l'entreprise" }
                    phoneNumber = @{ type = "string"; description = "Numéro de téléphone de l'entreprise" }
                    email = @{ type = "string"; description = "Email de l'entreprise" }
                    openingHours = @{ type = "string"; description = "Horaires d'ouverture" }
                    keyInformation = @{ type = "array"; description = "Informations clés sur le restaurant" }
                    endCallMessage = @{ type = "string"; description = "Message de fin d'appel" }
                    language = @{ type = "string"; description = "Langue de l'assistant" }
                }
                required = @("assistantName", "businessType", "assistantTone", "firstMessage", "systemPromptCore")
            }
        }
    )
}

# URL de l'Edge Function assistants
$url = "$supabaseUrl/functions/v1/assistants"
$headers = @{
    "Authorization" = "Bearer $anonKey"
    "Content-Type" = "application/json"
}

Write-Host "📡 Envoi de la requête à l'Edge Function assistants..." -ForegroundColor Cyan
Write-Host "URL: $url" -ForegroundColor Gray

try {
    $body = $assistantConfig | ConvertTo-Json -Depth 10
    
    Write-Host "📝 Configuration de l'assistant:" -ForegroundColor Yellow
    Write-Host "- Nom: $($assistantConfig.name)" -ForegroundColor White
    Write-Host "- Modèle: $($assistantConfig.model.provider)/$($assistantConfig.model.model)" -ForegroundColor White
    Write-Host "- Voix: $($assistantConfig.voice.provider)/$($assistantConfig.voice.voiceId)" -ForegroundColor White
    Write-Host "- Langue: $($assistantConfig.language)" -ForegroundColor White
    
    $response = Invoke-RestMethod -Uri $url -Method POST -Headers $headers -Body $body
    
    if ($response.success) {
        Write-Host "✅ SUCCÈS!" -ForegroundColor Green
        Write-Host "🎉 Assistant configurateur restaurant créé avec succès!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📋 Détails de l'assistant:" -ForegroundColor Yellow
        Write-Host "- ID Assistant: $($response.data.id)" -ForegroundColor White
        Write-Host "- Nom: $($response.data.name)" -ForegroundColor White
        Write-Host "- Vapi ID: $($response.data.vapi_assistant_id)" -ForegroundColor White
        Write-Host "- Type: $($response.data.business_type)" -ForegroundColor White
        Write-Host "- Statut: $($response.data.is_active)" -ForegroundColor White
        Write-Host ""
        Write-Host "🔗 L'assistant est maintenant disponible sur Vapi et peut être utilisé pour configurer des assistants restaurant!" -ForegroundColor Green
    } else {
        Write-Host "❌ Erreur lors de la création:" -ForegroundColor Red
        Write-Host "$($response.message)" -ForegroundColor Red
        if ($response.error) {
            Write-Host "Détails: $($response.error)" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "❌ Erreur lors de l'appel à l'API:" -ForegroundColor Red
    Write-Host "$($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Réponse du serveur: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "🍽️ Script terminé." -ForegroundColor Cyan 