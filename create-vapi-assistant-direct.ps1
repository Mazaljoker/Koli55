# Script de création directe de l'Assistant Configurateur Expert sur Vapi
# Utilise les données de Supabase et appelle directement l'API Vapi

Write-Host "Creation directe de l'Assistant Configurateur Expert sur Vapi..." -ForegroundColor Green

# Vérifier la clé API Vapi
$VAPI_API_KEY = $env:VAPI_API_KEY
if (-not $VAPI_API_KEY) {
    Write-Host "ERREUR: Variable d'environnement VAPI_API_KEY non definie" -ForegroundColor Red
    exit 1
}

# ID de l'assistant dans Supabase
$SUPABASE_ASSISTANT_ID = "754eaa93-d7c2-42a4-ab54-b8350d11eca4"

Write-Host "Cle API Vapi configuree" -ForegroundColor Green
Write-Host "ID Assistant Supabase: $SUPABASE_ASSISTANT_ID" -ForegroundColor Cyan

# Données de l'assistant configurateur expert au format Vapi (minimal et valide)
$assistantData = @{
    name = "AlloKoliConfig Pro Expert v3"  # Nom raccourci (< 40 caractères)
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

🎯 **Capacités Avancées Uniques:**
1. **Recommandations Intelligentes Sectorielles**
2. **Optimisation Performance Automatique**
3. **Intégrations Complexes Maîtrisées**
4. **Troubleshooting Expert Instantané**
5. **Architecture Évolutive**

🚀 **Modes de Configuration Adaptatifs:**
- **🟢 SIMPLE** : Configuration guidée 5 minutes
- **🟡 AVANCÉ** : Tools, intégrations, webhooks
- **🔴 EXPERT** : Squads, SIP, custom transcribers, MCP

Dites-moi votre niveau souhaité ou décrivez directement votre besoin, je détecterai automatiquement le niveau optimal et vous guiderai avec mes recommandations expertes basées sur 105 pages de documentation Vapi !
"@
    }
    voice = @{
        provider = "11labs"  # Corrigé: "elevenlabs" -> "11labs"
        voiceId = "shimmer"
        stability = 0.5
        similarityBoost = 0.8
    }
    language = "fr"  # Corrigé: "fr-FR" -> "fr"
    firstMessage = "Bonjour ! Je suis AlloKoliConfig Pro, votre expert Vapi omniscient. Grâce à ma maîtrise complète de 105 pages de documentation officielle et 525 exemples pratiques, je peux créer des configurations depuis les plus simples jusqu'aux plus complexes. Quel est votre niveau souhaité : SIMPLE, AVANCÉ, ou EXPERT ?"
    endCallMessage = "Parfait ! Votre assistant vocal expert est configuré avec les meilleures pratiques Vapi. Merci d'avoir utilisé AlloKoliConfig Pro !"
    
    # Fonctionnalités avancées (format minimal)
    silenceTimeoutSeconds = 30
    maxDurationSeconds = 1800
    backgroundSound = "office"
    backchannelingEnabled = $true
    backgroundDenoisingEnabled = $true
    modelOutputInMessagesEnabled = $true
    
    # Transcriber optimisé pour le français (format minimal)
    transcriber = @{
        provider = "deepgram"
        model = "nova-2"
        language = "fr"
        smartFormat = $true
    }
    
    # Métadonnées
    metadata = @{
        configurator_type = "expert_omniscient"
        knowledge_base_version = "2.0.0"
        total_pages_mastered = 105
        total_examples = 525
        intelligence_level = "omniscient"
        supabase_id = $SUPABASE_ASSISTANT_ID
        version = "3.0.0"
        creation_date = "2025-01-18"
    }
}

# Conversion en JSON
$jsonData = $assistantData | ConvertTo-Json -Depth 10

Write-Host "Donnees preparees pour Vapi (format minimal valide)" -ForegroundColor Yellow
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
    
    # Maintenant mettre à jour Supabase avec l'ID Vapi
    Write-Host "Mise a jour de Supabase avec l'ID Vapi..." -ForegroundColor Blue
    
    # Configuration Supabase
    $SUPABASE_URL = "https://aiurboizarbbcpynmmgv.supabase.co"
    $SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM"
    
    $updateData = @{
        vapi_assistant_id = $response.id
        vapi_created_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        vapi_updated_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
        updated_at = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
    }
    
    $updateJson = $updateData | ConvertTo-Json
    
    try {
        $updateResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/assistants?id=eq.$SUPABASE_ASSISTANT_ID" `
            -Method PATCH `
            -Headers @{
                "Authorization" = "Bearer $SUPABASE_ANON_KEY"
                "Content-Type" = "application/json"
                "apikey" = $SUPABASE_ANON_KEY
                "Prefer" = "return=representation"
            } `
            -Body $updateJson
        
        Write-Host "Supabase mis a jour avec succes !" -ForegroundColor Green
        Write-Host "ID Vapi sauvegarde: $($response.id)" -ForegroundColor Cyan
        
    } catch {
        Write-Host "Avertissement: Erreur lors de la mise a jour Supabase:" -ForegroundColor Yellow
        Write-Host $_.Exception.Message -ForegroundColor Yellow
        Write-Host "L'assistant Vapi a ete cree mais l'ID n'a pas pu etre sauvegarde en base" -ForegroundColor Yellow
    }
    
    Write-Host "`nSUCCES COMPLET !" -ForegroundColor Magenta
    Write-Host "L'Assistant Configurateur Expert AlloKoli est maintenant deploye sur Vapi !" -ForegroundColor Green
    Write-Host "ID Supabase: $SUPABASE_ASSISTANT_ID" -ForegroundColor Green
    Write-Host "ID Vapi: $($response.id)" -ForegroundColor Green
    Write-Host "Il maitrise 105 pages de documentation Vapi et 525 exemples" -ForegroundColor Yellow
    Write-Host "Pret a revolutionner la configuration d'assistants vocaux !" -ForegroundColor Magenta
    
} catch {
    Write-Host "Erreur lors de la creation sur Vapi:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    # Essayer d'afficher plus de détails sur l'erreur
    if ($_.ErrorDetails) {
        Write-Host "Details de l'erreur:" -ForegroundColor Yellow
        Write-Host $_.ErrorDetails.Message -ForegroundColor Yellow
    }
}

Write-Host "`nScript termine." -ForegroundColor White 