# Script de déploiement de l'Assistant Configurateur Expert sur Vapi
# Utilise les données de la base Supabase et l'API Vapi directement

Write-Host "Deploiement de l'Assistant Configurateur Expert sur Vapi..." -ForegroundColor Green

# Configuration - Vérifier la clé API Vapi
$VAPI_API_KEY = $env:VAPI_API_KEY
if (-not $VAPI_API_KEY) {
    Write-Host "ERREUR: Variable d'environnement VAPI_API_KEY non definie" -ForegroundColor Red
    Write-Host "Definissez votre cle API Vapi avec: `$env:VAPI_API_KEY = 'votre_cle_api'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Cle API Vapi configuree" -ForegroundColor Green

# Configuration Supabase
$SUPABASE_URL = "https://aiurboizarbbcpynmmgv.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM"

# ID de l'assistant configurateur expert
$ASSISTANT_ID = "e576e32b-7d2c-492a-8bc5-1e2248d9bbfb"

Write-Host "ID Assistant Supabase: $ASSISTANT_ID" -ForegroundColor Cyan

# Données de l'assistant configurateur expert basées sur la base Supabase
$assistantData = @{
    name = "AlloKoliConfig Pro - Assistant Configurateur Expert Omniscient v2"
    model = @{
        provider = "openai"
        model = "gpt-4o"
        temperature = 0.7
        maxTokens = 3000
        systemMessage = @"
Vous êtes **AlloKoliConfig Pro**, l'assistant IA le plus avancé au monde pour la configuration d'agents vocaux Vapi.

🧠 **Votre Expertise Omnisciente Unique:**
- **105 pages** de documentation Vapi officielle maîtrisées à 100%
- **525 exemples** de configuration réels mémorisés et analysés
- **168 schémas** de données Vapi documentés et optimisés
- **83 paramètres** Vapi avancés avec recommandations intelligentes
- **Tous les providers** vocaux, modèles LLM et transcribers disponibles

🎯 **Capacités Avancées Uniques:**
1. **Recommandations Intelligentes Sectorielles** : Je propose automatiquement les meilleurs providers selon votre activité
2. **Optimisation Performance Automatique** : Je calcule les paramètres optimaux selon vos besoins
3. **Intégrations Complexes Maîtrisées** : Je configure webhooks, tools personnalisés, squads multi-assistants
4. **Troubleshooting Expert Instantané** : Je diagnostique et corrige les problèmes en temps réel
5. **Architecture Évolutive** : Je conçois des systèmes scalables pour croissance future

🚀 **Modes de Configuration Adaptatifs:**
- **🟢 SIMPLE** : Configuration guidée en 5 minutes (PME, artisans, commerces)
- **🟡 AVANCÉ** : Tools, intégrations, webhooks (entreprises, services)  
- **🔴 EXPERT** : Squads, SIP, custom transcribers, MCP (développeurs, grandes entreprises)

Dites-moi votre niveau souhaité ou décrivez directement votre besoin, je détecterai automatiquement le niveau optimal et vous guiderai avec mes recommandations expertes basées sur 105 pages de documentation Vapi !
"@
    }
    voice = @{
        provider = "elevenlabs"
        voiceId = "shimmer"
        stability = 0.5
        similarityBoost = 0.8
    }
    language = "fr-FR"
    firstMessage = "Bonjour ! Je suis AlloKoliConfig Pro, votre expert Vapi omniscient. Grâce à ma maîtrise complète de 105 pages de documentation officielle et 525 exemples pratiques, je peux créer des configurations depuis les plus simples jusqu'aux plus complexes. Quel est votre niveau souhaité : SIMPLE, AVANCÉ, ou EXPERT ?"
    endCallMessage = "Parfait ! Votre assistant vocal expert est configuré avec les meilleures pratiques Vapi. Merci d'avoir utilisé AlloKoliConfig Pro !"
    
    # Fonctionnalités avancées optimisées
    voicemailDetection = @{
        enabled = $true
        voicemailDetectionTimeoutMs = 10000
    }
    
    silenceTimeoutSeconds = 30
    maxDurationSeconds = 1800
    backgroundSound = "office"
    backchannelingEnabled = $true
    backgroundDenoisingEnabled = $true
    modelOutputInMessagesEnabled = $true
    
    # Transcriber optimisé pour le français
    transcriber = @{
        provider = "deepgram"
        model = "nova-2"
        language = "fr"
        smartFormat = $true
        languageDetectionEnabled = $true
    }
    
    # Métadonnées enrichies
    metadata = @{
        configurator_type = "expert_omniscient"
        knowledge_base_version = "2.0.0"
        total_pages_mastered = 105
        total_examples = 525
        intelligence_level = "omniscient"
        supabase_id = $ASSISTANT_ID
        creation_date = "2025-01-18"
        version = "2.0.0"
    }
}

# Conversion en JSON
$jsonData = $assistantData | ConvertTo-Json -Depth 10

Write-Host "Donnees de l'assistant preparees" -ForegroundColor Yellow
Write-Host "Taille des donnees: $($jsonData.Length) caracteres" -ForegroundColor Cyan

try {
    Write-Host "Creation de l'assistant sur Vapi..." -ForegroundColor Blue
    
    # Appel direct à l'API Vapi
    $response = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $VAPI_API_KEY"
            "Content-Type" = "application/json"
        } `
        -Body $jsonData
    
    Write-Host "Assistant cree avec succes sur Vapi !" -ForegroundColor Green
    Write-Host "ID Vapi: $($response.id)" -ForegroundColor Cyan
    Write-Host "Nom: $($response.name)" -ForegroundColor Cyan
    Write-Host "Modele: $($response.model.provider)/$($response.model.model)" -ForegroundColor Cyan
    Write-Host "Voix: $($response.voice.provider)/$($response.voice.voiceId)" -ForegroundColor Cyan
    
    # Maintenant mettre à jour la base Supabase avec l'ID Vapi
    Write-Host "Mise a jour de la base Supabase avec l'ID Vapi..." -ForegroundColor Blue
    
    $updateData = @{
        vapi_assistant_id = $response.id
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
        
        Write-Host "Base Supabase mise a jour avec succes !" -ForegroundColor Green
        Write-Host "ID Vapi sauvegarde: $($response.id)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "Avertissement: Erreur lors de la mise a jour Supabase:" -ForegroundColor Yellow
        Write-Host $_.Exception.Message -ForegroundColor Yellow
        Write-Host "L'assistant Vapi a ete cree mais l'ID n'a pas pu etre sauvegarde en base" -ForegroundColor Yellow
    }
    
    Write-Host "`nSUCCES COMPLET !" -ForegroundColor Magenta
    Write-Host "L'Assistant Configurateur Expert AlloKoli est maintenant deploye sur Vapi !" -ForegroundColor Green
    Write-Host "ID Vapi: $($response.id)" -ForegroundColor Green
    Write-Host "ID Supabase: $ASSISTANT_ID" -ForegroundColor Green
    Write-Host "Il maitrise 105 pages de documentation Vapi et 525 exemples" -ForegroundColor Yellow
    Write-Host "Pret a revolutionner la configuration d'assistants vocaux !" -ForegroundColor Magenta
    
} catch {
    Write-Host "Erreur lors de la creation sur Vapi:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Details de l'erreur: $errorBody" -ForegroundColor Yellow
    }
}

Write-Host "`nScript termine." -ForegroundColor White 