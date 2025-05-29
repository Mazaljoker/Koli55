# Script de déploiement de l'Assistant Configurateur Expert via fonction Edge
# Utilise la fonction Edge /assistants existante dans Supabase

Write-Host "Deploiement de l'Assistant Configurateur Expert via fonction Edge..." -ForegroundColor Green

# Configuration Supabase
$SUPABASE_URL = "https://aiurboizarbbcpynmmgv.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM"

# Vérifier la clé API Vapi
$VAPI_API_KEY = $env:VAPI_API_KEY
if (-not $VAPI_API_KEY) {
    Write-Host "ERREUR: Variable d'environnement VAPI_API_KEY non definie" -ForegroundColor Red
    Write-Host "Definissez votre cle API Vapi avec: `$env:VAPI_API_KEY = 'votre_cle_api'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Cle API Vapi configuree" -ForegroundColor Green

# Données de l'assistant configurateur expert pour la fonction Edge
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
    
    # Instructions système (system_prompt)
    instructions = @"
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

Guidez l'utilisateur avec vos recommandations expertes !
"@
    
    # Fonctionnalités avancées
    silenceTimeoutSeconds = 30
    maxDurationSeconds = 1800
    endCallAfterSilence = $false
    voiceReflection = $true
    recordingSettings = @{
        createRecording = $true
        saveRecording = $true
    }
    
    # Clé API Vapi pour la fonction Edge
    vapi_api_key = $VAPI_API_KEY
    
    # Métadonnées
    metadata = @{
        configurator_type = "expert_omniscient"
        knowledge_base_version = "2.0.0"
        total_pages_mastered = 105
        total_examples = 525
        intelligence_level = "omniscient"
        creation_date = "2025-01-18"
        version = "2.0.0"
    }
}

# Conversion en JSON
$jsonData = $assistantData | ConvertTo-Json -Depth 10

Write-Host "Donnees de l'assistant preparees pour la fonction Edge" -ForegroundColor Yellow
Write-Host "Taille des donnees: $($jsonData.Length) caracteres" -ForegroundColor Cyan

try {
    Write-Host "Appel de la fonction Edge /assistants..." -ForegroundColor Blue
    
    # Appel à la fonction Edge /assistants
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
        Write-Host "Assistant configurateur expert cree avec succes !" -ForegroundColor Green
        Write-Host "ID Supabase: $($response.data.id)" -ForegroundColor Cyan
        Write-Host "Nom: $($response.data.name)" -ForegroundColor Cyan
        
        if ($response.data.vapi_assistant_id) {
            Write-Host "ID Vapi: $($response.data.vapi_assistant_id)" -ForegroundColor Green
            Write-Host "Assistant deploye sur Vapi avec succes !" -ForegroundColor Green
        }
        
        Write-Host "`nSUCCES COMPLET !" -ForegroundColor Magenta
        Write-Host "L'Assistant Configurateur Expert AlloKoli est maintenant operationnel !" -ForegroundColor Green
        Write-Host "Il maitrise 105 pages de documentation Vapi et 525 exemples" -ForegroundColor Yellow
        Write-Host "Pret a revolutionner la configuration d'assistants vocaux !" -ForegroundColor Magenta
        
        # Afficher les détails complets
        Write-Host "`nDetails de l'assistant cree:" -ForegroundColor White
        Write-Host "- ID Supabase: $($response.data.id)" -ForegroundColor Cyan
        Write-Host "- ID Vapi: $($response.data.vapi_assistant_id)" -ForegroundColor Cyan
        Write-Host "- Modele: $($response.data.model_provider)/$($response.data.model_name)" -ForegroundColor Cyan
        Write-Host "- Voix: $($response.data.voice)" -ForegroundColor Cyan
        Write-Host "- Langue: $($response.data.language)" -ForegroundColor Cyan
        
    } else {
        Write-Host "Erreur lors de la creation de l'assistant:" -ForegroundColor Red
        Write-Host $response.message -ForegroundColor Red
    }
    
} catch {
    Write-Host "Erreur lors de l'appel de la fonction Edge:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        try {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorBody = $reader.ReadToEnd()
            Write-Host "Details de l'erreur: $errorBody" -ForegroundColor Yellow
        } catch {
            Write-Host "Impossible de lire les details de l'erreur" -ForegroundColor Yellow
        }
    }
}

Write-Host "`nScript termine." -ForegroundColor White 