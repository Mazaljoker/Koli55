#!/usr/bin/env pwsh
# Script pour créer facilement un assistant Vapi avec support des plans avancés
# Utilisation : ./create-vapi-assistant.ps1 -Name "Nom de l'assistant" -SystemPrompt "Instructions" -Voice "azure-fr-FR-DeniseNeural" -FirstMessage "Message d'accueil"

param (
    [Parameter(Mandatory=$false)]
    [string]$Name = "Assistant Test",
    
    [Parameter(Mandatory=$false)]
    [string]$SystemPrompt = "Tu es un assistant francophone serviable.",
    
    [Parameter(Mandatory=$false)]
    [string]$Voice = "azure-fr-FR-DeniseNeural",
    
    [Parameter(Mandatory=$false)]
    [string]$FirstMessage = "Bonjour, comment puis-je vous aider aujourd'hui?",
    
    [Parameter(Mandatory=$false)]
    [string]$ApiKey = "b913fdd5-3a43-423b-aff7-2b093b7b6759",
    
    [Parameter(Mandatory=$false)]
    [switch]$DeleteAfterTest = $false,
    
    # Plans avancés
    [Parameter(Mandatory=$false)]
    [string]$MessagePlan,
    
    [Parameter(Mandatory=$false)]
    [string]$StopSpeakingPlan,
    
    [Parameter(Mandatory=$false)]
    [string]$StartSpeakingPlan,
    
    [Parameter(Mandatory=$false)]
    [string]$AnalysisPlan,
    
    [Parameter(Mandatory=$false)]
    [string]$ArtifactPlan,
    
    [Parameter(Mandatory=$false)]
    [string]$MonitorPlan,
    
    [Parameter(Mandatory=$false)]
    [string]$VoicemailDetection,
    
    [Parameter(Mandatory=$false)]
    [int]$SilenceTimeoutSeconds,
    
    [Parameter(Mandatory=$false)]
    [int]$MaxDurationSeconds,
    
    [Parameter(Mandatory=$false)]
    [switch]$EndCallAfterSilence = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$VoiceReflection = $false,
    
    # Nouveaux paramètres
    [Parameter(Mandatory=$false)]
    [string]$Transcriber,
    
    [Parameter(Mandatory=$false)]
    [string]$VoiceAdvanced,
    
    [Parameter(Mandatory=$false)]
    [string]$FirstMessageMode,
    
    [Parameter(Mandatory=$false)]
    [switch]$FirstMessageInterruptionsEnabled = $false
)

# URL de base de l'API Vapi
$apiUrl = "https://api.vapi.ai"

Write-Host "=== Création d'un assistant Vapi ===" -ForegroundColor Cyan
Write-Host "Nom: $Name" -ForegroundColor White
Write-Host "Instructions: $SystemPrompt" -ForegroundColor White
Write-Host "Voix: $Voice" -ForegroundColor White
Write-Host "Message d'accueil: $FirstMessage" -ForegroundColor White

# Fonction pour appeler l'API Vapi
function Invoke-VapiApi {
    param (
        [string]$Endpoint,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    # S'assurer que l'endpoint commence par / si ce n'est pas le cas
    if (-not $Endpoint.StartsWith("/")) {
        $Endpoint = "/$Endpoint"
    }
    
    # Construire l'URL complète
    $url = "$apiUrl$Endpoint"
    
    # Préparer les en-têtes
    $headers = @{
        "Authorization" = "Bearer $ApiKey"
        "Content-Type" = "application/json"
        "Accept" = "application/json"
    }
    
    Write-Host "Appel API: $Method $url" -ForegroundColor DarkGray
    
    try {
        $params = @{
            Uri = $url
            Method = $Method
            Headers = $headers
            ContentType = "application/json"
            ErrorAction = "Stop"
        }
        
        # Ajouter le corps de la requête si nécessaire
        if ($Body -and ($Method -eq "POST" -or $Method -eq "PUT" -or $Method -eq "PATCH")) {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            $params.Body = $jsonBody
            Write-Host "Corps de la requête: $jsonBody" -ForegroundColor DarkGray
        }
        
        # Effectuer l'appel
        $webResponse = Invoke-WebRequest @params
        # Convertir la réponse en objet
        $response = $webResponse.Content | ConvertFrom-Json
        return $response
    }
    catch {
        Write-Host "Erreur lors de l'appel à $Endpoint" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
            
            # Tenter d'extraire plus de détails de l'erreur
            try {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $errorContent = $reader.ReadToEnd()
                $reader.Close()
                Write-Host "Détails de l'erreur: $errorContent" -ForegroundColor Red
            } catch {
                # Ignorer les erreurs supplémentaires lors de l'extraction des détails
            }
        }
        
        Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
        
        return $null
    }
}

# Préparer les données de l'assistant
$voiceConfig = @{}

if ($PSBoundParameters.ContainsKey('VoiceAdvanced')) {
    # Si voiceAdvanced est fourni, l'utiliser directement
    try {
        $voiceConfig = $VoiceAdvanced | ConvertFrom-Json
        Write-Host "🔄 Configuration avancée de voix ajoutée" -ForegroundColor Blue
    } catch {
        Write-Host "⚠️ Erreur de format JSON pour VoiceAdvanced" -ForegroundColor Yellow
    }
} else {
    # Sinon, analyser le paramètre Voice standard
    $voiceParts = $Voice.Split('-')
    
    if ($voiceParts.Length -gt 1) {
        $provider = $voiceParts[0]
        $voiceId = $Voice.Substring($provider.Length + 1)
        
        # Correction pour ElevenLabs
        if ($provider -eq "elevenlabs") {
            $provider = "11labs"
        } elseif ($provider -eq "playht") {
            $provider = "play.ht"
        }
        
        $voiceConfig = @{
            provider = $provider
            voiceId = $voiceId
        }
    } else {
        # Cas où une seule partie est fournie (comme "azure")
        $voiceConfig = @{
            provider = $Voice
            voiceId = "fr-FR-DeniseNeural"  # Valeur par défaut
        }
    }
}

$assistantData = @{
    name = $Name
    model = @{
        provider = "openai"
        model = "gpt-4o"
        messages = @(
            @{
                role = "system"
                content = $SystemPrompt
            }
        )
    }
    voice = $voiceConfig
    firstMessage = $FirstMessage
}

# Ajouter le mode du premier message
if ($PSBoundParameters.ContainsKey('FirstMessageMode')) {
    $assistantData.firstMessageMode = $FirstMessageMode
    Write-Host "🔄 Mode de premier message configuré: $FirstMessageMode" -ForegroundColor Blue
}

# Ajouter l'option d'interruption du premier message
if ($FirstMessageInterruptionsEnabled) {
    $assistantData.firstMessageInterruptionsEnabled = $true
    Write-Host "🔄 Interruptions du premier message activées" -ForegroundColor Blue
}

# Ajouter les plans avancés s'ils sont spécifiés
if ($PSBoundParameters.ContainsKey('MessagePlan')) {
    try {
        $assistantData.messagePlan = $MessagePlan | ConvertFrom-Json
        Write-Host "🔄 Plan de messages ajouté" -ForegroundColor Blue
    } catch {
        Write-Host "⚠️ Erreur de format JSON pour MessagePlan" -ForegroundColor Yellow
    }
}

if ($PSBoundParameters.ContainsKey('StopSpeakingPlan')) {
    try {
        $assistantData.stopSpeakingPlan = $StopSpeakingPlan | ConvertFrom-Json
        Write-Host "🔄 Plan d'interruption ajouté" -ForegroundColor Blue
    } catch {
        Write-Host "⚠️ Erreur de format JSON pour StopSpeakingPlan" -ForegroundColor Yellow
    }
}

if ($PSBoundParameters.ContainsKey('StartSpeakingPlan')) {
    try {
        $assistantData.startSpeakingPlan = $StartSpeakingPlan | ConvertFrom-Json
        Write-Host "🔄 Plan de prise de parole ajouté" -ForegroundColor Blue
    } catch {
        Write-Host "⚠️ Erreur de format JSON pour StartSpeakingPlan" -ForegroundColor Yellow
    }
}

if ($PSBoundParameters.ContainsKey('AnalysisPlan')) {
    try {
        $assistantData.analysisPlan = $AnalysisPlan | ConvertFrom-Json
        Write-Host "🔄 Plan d'analyse ajouté" -ForegroundColor Blue
    } catch {
        Write-Host "⚠️ Erreur de format JSON pour AnalysisPlan" -ForegroundColor Yellow
    }
}

if ($PSBoundParameters.ContainsKey('ArtifactPlan')) {
    try {
        $assistantData.artifactPlan = $ArtifactPlan | ConvertFrom-Json
        Write-Host "🔄 Plan d'artefacts ajouté" -ForegroundColor Blue
    } catch {
        Write-Host "⚠️ Erreur de format JSON pour ArtifactPlan" -ForegroundColor Yellow
    }
}

if ($PSBoundParameters.ContainsKey('MonitorPlan')) {
    try {
        $assistantData.monitorPlan = $MonitorPlan | ConvertFrom-Json
        Write-Host "🔄 Plan de supervision ajouté" -ForegroundColor Blue
    } catch {
        Write-Host "⚠️ Erreur de format JSON pour MonitorPlan" -ForegroundColor Yellow
    }
}

if ($PSBoundParameters.ContainsKey('VoicemailDetection')) {
    try {
        $assistantData.voicemailDetection = $VoicemailDetection | ConvertFrom-Json
        Write-Host "🔄 Détection de messagerie vocale ajoutée" -ForegroundColor Blue
    } catch {
        Write-Host "⚠️ Erreur de format JSON pour VoicemailDetection" -ForegroundColor Yellow
    }
}

if ($PSBoundParameters.ContainsKey('Transcriber')) {
    try {
        $assistantData.transcriber = $Transcriber | ConvertFrom-Json
        Write-Host "🔄 Configuration de transcripteur ajoutée" -ForegroundColor Blue
    } catch {
        Write-Host "⚠️ Erreur de format JSON pour Transcriber" -ForegroundColor Yellow
    }
}

# Ajouter les paramètres avancés simples s'ils sont spécifiés
if ($PSBoundParameters.ContainsKey('SilenceTimeoutSeconds')) {
    $assistantData.silenceTimeoutSeconds = $SilenceTimeoutSeconds
    Write-Host "🔄 Délai d'inactivité configuré: $SilenceTimeoutSeconds secondes" -ForegroundColor Blue
}

if ($PSBoundParameters.ContainsKey('MaxDurationSeconds')) {
    $assistantData.maxDurationSeconds = $MaxDurationSeconds
    Write-Host "🔄 Durée maximale configurée: $MaxDurationSeconds secondes" -ForegroundColor Blue
}

if ($EndCallAfterSilence) {
    $assistantData.endCallAfterSilence = $true
    Write-Host "🔄 Fin d'appel après silence activée" -ForegroundColor Blue
}

if ($VoiceReflection) {
    $assistantData.voiceReflection = $true
    Write-Host "🔄 Réflexion vocale activée" -ForegroundColor Blue
}

# Création de l'assistant
$createdAssistant = Invoke-VapiApi -Endpoint "/assistant" -Method "POST" -Body $assistantData

if ($createdAssistant) {
    $assistantId = $createdAssistant.id
    Write-Host "`n✅ Succès: Assistant créé avec ID: $assistantId" -ForegroundColor Green
    
    # Récupération de l'assistant pour vérification
    $retrievedAssistant = Invoke-VapiApi -Endpoint "/assistant/$assistantId" -Method "GET"
    
    if ($retrievedAssistant) {
        Write-Host "✅ Vérification: Assistant récupéré avec succès" -ForegroundColor Green
        
        # Afficher les détails principaux
        Write-Host "`n=== Détails de l'assistant ===" -ForegroundColor Cyan
        Write-Host "ID: $($retrievedAssistant.id)" -ForegroundColor White
        Write-Host "Nom: $($retrievedAssistant.name)" -ForegroundColor White
        Write-Host "Modèle: $($retrievedAssistant.model.provider)/$($retrievedAssistant.model.model)" -ForegroundColor White
        Write-Host "Voix: $($retrievedAssistant.voice.provider)/$($retrievedAssistant.voice.voiceId)" -ForegroundColor White
        Write-Host "Message d'accueil: $($retrievedAssistant.firstMessage)" -ForegroundColor White
        
        # Afficher les plans configurés
        Write-Host "`n=== Plans configurés ===" -ForegroundColor Cyan
        if ($retrievedAssistant.messagePlan) { 
            Write-Host "✓ Plan de messages configuré" -ForegroundColor Green 
        }
        if ($retrievedAssistant.stopSpeakingPlan) { 
            Write-Host "✓ Plan d'interruption configuré" -ForegroundColor Green 
        }
        if ($retrievedAssistant.startSpeakingPlan) { 
            Write-Host "✓ Plan de prise de parole configuré" -ForegroundColor Green 
        }
        if ($retrievedAssistant.analysisPlan) { 
            Write-Host "✓ Plan d'analyse configuré" -ForegroundColor Green 
        }
        if ($retrievedAssistant.artifactPlan) { 
            Write-Host "✓ Plan d'artefacts configuré" -ForegroundColor Green 
        }
        if ($retrievedAssistant.monitorPlan) { 
            Write-Host "✓ Plan de supervision configuré" -ForegroundColor Green 
        }
        if ($retrievedAssistant.voicemailDetection) { 
            Write-Host "✓ Détection de messagerie vocale configurée" -ForegroundColor Green 
        }
        if ($retrievedAssistant.transcriber) { 
            Write-Host "✓ Transcripteur configuré: $($retrievedAssistant.transcriber.provider)" -ForegroundColor Green 
        }
        if ($retrievedAssistant.firstMessageMode) { 
            Write-Host "✓ Mode de premier message: $($retrievedAssistant.firstMessageMode)" -ForegroundColor Green 
        }
        if ($retrievedAssistant.firstMessageInterruptionsEnabled) { 
            Write-Host "✓ Interruptions du premier message activées" -ForegroundColor Green 
        }
        if ($retrievedAssistant.silenceTimeoutSeconds) { 
            Write-Host "✓ Délai d'inactivité: $($retrievedAssistant.silenceTimeoutSeconds) secondes" -ForegroundColor Green 
        }
        if ($retrievedAssistant.maxDurationSeconds) { 
            Write-Host "✓ Durée maximale: $($retrievedAssistant.maxDurationSeconds) secondes" -ForegroundColor Green 
        }
        if ($retrievedAssistant.endCallAfterSilence) { 
            Write-Host "✓ Fin d'appel après silence activée" -ForegroundColor Green 
        }
        if ($retrievedAssistant.voiceReflection) { 
            Write-Host "✓ Réflexion vocale activée" -ForegroundColor Green 
        }
        
        # Si l'option de suppression après test est activée
        if ($DeleteAfterTest) {
            Write-Host "`n=== Suppression de l'assistant (mode test) ===" -ForegroundColor Yellow
            $deleteResult = Invoke-VapiApi -Endpoint "/assistant/$assistantId" -Method "DELETE"
            
            if ($deleteResult -ne $null) {
                Write-Host "✅ Succès: Assistant supprimé (mode test)" -ForegroundColor Green
            } else {
                Write-Host "❌ Échec: Impossible de supprimer l'assistant" -ForegroundColor Red
            }
        } else {
            # Informations d'utilisation
            Write-Host "`n=== Comment utiliser cet assistant ? ===" -ForegroundColor Cyan
            Write-Host "1. Dans l'Edge Function 'assistants', associez cet ID à une ressource :" -ForegroundColor White
            Write-Host "   await supabase.from('assistants').update({ vapi_assistant_id: '$assistantId' }).eq('id', assistantId);" -ForegroundColor White
            
            Write-Host "`n2. Pour le supprimer ultérieurement, exécutez :" -ForegroundColor White
            Write-Host "   Invoke-WebRequest -Uri '$apiUrl/assistant/$assistantId' -Method DELETE -Headers @{Authorization='Bearer $ApiKey'}" -ForegroundColor White
        }
    } else {
        Write-Host "❌ Échec: Impossible de récupérer l'assistant créé" -ForegroundColor Red
    }
} else {
    Write-Host "❌ Échec: Impossible de créer l'assistant" -ForegroundColor Red
}

# Exemples d'utilisation :
<#
# Assistant de base
./create-vapi-assistant.ps1 -Name "Assistant Support Client" -SystemPrompt "Tu es un assistant de support client serviable et précis." -Voice "azure-fr-FR-DeniseNeural" -FirstMessage "Bonjour, je suis votre assistant de support. Comment puis-je vous aider aujourd'hui?"

# Assistant avec ElevenLabs (11labs)
./create-vapi-assistant.ps1 -Name "Test ElevenLabs" -Voice "11labs-21m00Tcm4TlvDq8ikWAM" -DeleteAfterTest

# Assistant avec plan d'interruption (StopSpeakingPlan)
./create-vapi-assistant.ps1 -Name "Assistant Interruptible" -StopSpeakingPlan "{`"interruptionPhrases`":[`"stop`", `"attends`", `"excuse-moi`"]}" -DeleteAfterTest

# Assistant avec messages d'inactivité (MessagePlan)
./create-vapi-assistant.ps1 -Name "Assistant Proactif" -MessagePlan "{`"idleMessages`":[`"Êtes-vous toujours là?`",`"Avez-vous besoin d'aide supplémentaire?`"], `"idleTimeoutSeconds`": 15}" -DeleteAfterTest

# Assistant avec plan d'analyse (AnalysisPlan)
./create-vapi-assistant.ps1 -Name "Assistant Analytique" -AnalysisPlan "{`"summaryEnabled`": true, `"topicsEnabled`": true, `"entitiesEnabled`": true, `"sentimentEnabled`": true}" -DeleteAfterTest

# Assistant avec plan de prise de parole (StartSpeakingPlan)
./create-vapi-assistant.ps1 -Name "Assistant Réactif" -StartSpeakingPlan "{`"confidenceThreshold`": 0.7, `"delayMs`": 500, `"preferContentCompletion`": true}" -DeleteAfterTest

# Assistant avec options du premier message
./create-vapi-assistant.ps1 -Name "Assistant Proactif" -FirstMessageMode "assistant-speaks-first" -FirstMessageInterruptionsEnabled -DeleteAfterTest

# Assistant avec transcripteur personnalisé
./create-vapi-assistant.ps1 -Name "Assistant Transcripteur" -Transcriber "{`"provider`": `"assembly-ai`", `"language`": `"fr`"}" -DeleteAfterTest

# Assistant avec configuration de voix avancée
./create-vapi-assistant.ps1 -Name "Assistant Voix Avancée" -VoiceAdvanced "{`"provider`": `"azure`", `"voiceId`": `"fr-FR-DeniseNeural`", `"speed`": 1.1, `"cachingEnabled`": true}" -DeleteAfterTest

# Assistant complet avec plusieurs plans avancés
./create-vapi-assistant.ps1 -Name "Super Assistant" `
  -SystemPrompt "Tu es un assistant professionnel, serviable et proactif." `
  -Voice "azure-fr-FR-DeniseNeural" `
  -MessagePlan "{`"idleMessages`":[`"Êtes-vous toujours là?`"], `"idleTimeoutSeconds`": 15}" `
  -StopSpeakingPlan "{`"interruptionPhrases`":[`"stop`", `"attends`"]}" `
  -FirstMessageMode "assistant-speaks-first" `
  -FirstMessageInterruptionsEnabled `
  -DeleteAfterTest
#> 