# Script de synchronisation de l'Assistant Configurateur Expert vers Vapi
# Utilise l'assistant existant dans Supabase et le synchronise avec Vapi via fonction Edge

Write-Host "Synchronisation de l'Assistant Configurateur Expert vers Vapi..." -ForegroundColor Green

# Configuration Supabase
$SUPABASE_URL = "https://aiurboizarbbcpynmmgv.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM"

# ID de l'assistant configurateur expert créé dans Supabase
$ASSISTANT_ID = "754eaa93-d7c2-42a4-ab54-b8350d11eca4"

# Vérifier la clé API Vapi
$VAPI_API_KEY = $env:VAPI_API_KEY
if (-not $VAPI_API_KEY) {
    Write-Host "ERREUR: Variable d'environnement VAPI_API_KEY non definie" -ForegroundColor Red
    Write-Host "Definissez votre cle API Vapi avec: `$env:VAPI_API_KEY = 'votre_cle_api'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Cle API Vapi configuree" -ForegroundColor Green
Write-Host "ID Assistant Supabase: $ASSISTANT_ID" -ForegroundColor Cyan

# Récupérer les données de l'assistant depuis Supabase
try {
    Write-Host "Recuperation des donnees de l'assistant depuis Supabase..." -ForegroundColor Blue
    
    $assistantResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/assistants?id=eq.$ASSISTANT_ID&select=*" `
        -Method GET `
        -Headers @{
            "Authorization" = "Bearer $SUPABASE_ANON_KEY"
            "Content-Type" = "application/json"
            "apikey" = $SUPABASE_ANON_KEY
        }
    
    if ($assistantResponse.Count -eq 0) {
        Write-Host "ERREUR: Assistant non trouve dans Supabase" -ForegroundColor Red
        exit 1
    }
    
    $assistant = $assistantResponse[0]
    Write-Host "Assistant trouve: $($assistant.name)" -ForegroundColor Green
    
} catch {
    Write-Host "Erreur lors de la recuperation de l'assistant:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Préparer les données au format Vapi pour la fonction Edge
$vapiData = @{
    name = $assistant.name
    model = @{
        provider = $assistant.model_provider
        model = $assistant.model_name
        temperature = [double]$assistant.model_temperature
        maxTokens = $assistant.model_max_tokens
        systemMessage = $assistant.system_prompt
    }
    voice = @{
        provider = "elevenlabs"
        voiceId = $assistant.voice
        stability = 0.5
        similarityBoost = 0.8
    }
    language = $assistant.language
    firstMessage = $assistant.first_message
    endCallMessage = $assistant.end_call_message
    
    # Fonctionnalités avancées depuis tools_config
    silenceTimeoutSeconds = 30
    maxDurationSeconds = 1800
    backgroundSound = "office"
    backchannelingEnabled = $true
    backgroundDenoisingEnabled = $true
    modelOutputInMessagesEnabled = $true
    
    # Détection répondeur
    voicemailDetection = @{
        enabled = $true
        voicemailDetectionTimeoutMs = 10000
    }
    
    # Transcriber optimisé
    transcriber = @{
        provider = "deepgram"
        model = "nova-2"
        language = "fr"
        smartFormat = $true
        languageDetectionEnabled = $true
    }
    
    # Métadonnées
    metadata = $assistant.metadata
    
    # Clé API Vapi pour la fonction Edge
    vapi_api_key = $VAPI_API_KEY
}

# Conversion en JSON
$jsonData = $vapiData | ConvertTo-Json -Depth 10

Write-Host "Donnees preparees pour synchronisation Vapi" -ForegroundColor Yellow
Write-Host "Taille des donnees: $($jsonData.Length) caracteres" -ForegroundColor Cyan

try {
    Write-Host "Synchronisation vers Vapi via fonction Edge..." -ForegroundColor Blue
    
    # Appel à la fonction Edge /assistants pour créer sur Vapi
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/functions/v1/assistants" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $SUPABASE_ANON_KEY"
            "Content-Type" = "application/json"
            "apikey" = $SUPABASE_ANON_KEY
            "X-Vapi-API-Key" = $VAPI_API_KEY
        } `
        -Body $jsonData
    
    if ($response.success) {
        Write-Host "Assistant synchronise avec succes vers Vapi !" -ForegroundColor Green
        Write-Host "ID Supabase: $($response.data.id)" -ForegroundColor Cyan
        Write-Host "Nom: $($response.data.name)" -ForegroundColor Cyan
        
        if ($response.data.vapi_assistant_id) {
            Write-Host "ID Vapi: $($response.data.vapi_assistant_id)" -ForegroundColor Green
            
            # Mettre à jour l'assistant existant avec l'ID Vapi
            Write-Host "Mise a jour de l'assistant Supabase avec l'ID Vapi..." -ForegroundColor Blue
            
            $updateData = @{
                vapi_assistant_id = $response.data.vapi_assistant_id
                vapi_created_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                vapi_updated_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                updated_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
            }
            
            $updateJson = $updateData | ConvertTo-Json
            
            try {
                $updateResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/assistants?id=eq.$ASSISTANT_ID" `
                    -Method PATCH `
                    -Headers @{
                        "Authorization" = "Bearer $SUPABASE_ANON_KEY"
                        "Content-Type" = "application/json"
                        "apikey" = $SUPABASE_ANON_KEY
                        "Prefer" = "return=representation"
                    } `
                    -Body $updateJson
                
                Write-Host "Assistant Supabase mis a jour avec l'ID Vapi !" -ForegroundColor Green
                
            } catch {
                Write-Host "Avertissement: Erreur lors de la mise a jour Supabase:" -ForegroundColor Yellow
                Write-Host $_.Exception.Message -ForegroundColor Yellow
            }
        }
        
        Write-Host "`nSUCCES COMPLET !" -ForegroundColor Magenta
        Write-Host "L'Assistant Configurateur Expert AlloKoli est maintenant operationnel sur Vapi !" -ForegroundColor Green
        Write-Host "ID Supabase: $ASSISTANT_ID" -ForegroundColor Green
        Write-Host "ID Vapi: $($response.data.vapi_assistant_id)" -ForegroundColor Green
        Write-Host "Il maitrise 105 pages de documentation Vapi et 525 exemples" -ForegroundColor Yellow
        Write-Host "Pret a revolutionner la configuration d'assistants vocaux !" -ForegroundColor Magenta
        
    } else {
        Write-Host "Erreur lors de la synchronisation:" -ForegroundColor Red
        Write-Host $response.message -ForegroundColor Red
    }
    
} catch {
    Write-Host "Erreur lors de l'appel de la fonction Edge:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Essayer d'afficher plus de détails sur l'erreur
    if ($_.ErrorDetails) {
        Write-Host "Details de l'erreur:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    }
}

Write-Host "`nScript termine." -ForegroundColor White 