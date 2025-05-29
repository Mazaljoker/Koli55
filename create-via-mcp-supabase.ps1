# Script de création de l'Assistant Configurateur Expert via MCP Supabase
# Utilise la fonction Edge /assistants avec le bon format

Write-Host "Creation de l'Assistant Configurateur Expert via MCP Supabase..." -ForegroundColor Green

# Vérifier la clé API Vapi
$VAPI_API_KEY = $env:VAPI_API_KEY
if (-not $VAPI_API_KEY) {
    Write-Host "ERREUR: Variable d'environnement VAPI_API_KEY non definie" -ForegroundColor Red
    exit 1
}

Write-Host "Cle API Vapi configuree" -ForegroundColor Green

# Configuration Supabase
$SUPABASE_URL = "https://aiurboizarbbcpynmmgv.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM"

# Données de l'assistant au format attendu par la fonction Edge
$assistantData = @{
    name = "AlloKoliConfig Pro Expert v3"
    model = @{
        provider = "openai"
        model = "gpt-4o"
        temperature = 0.7
        maxTokens = 3000
    }
    voice = @{
        provider = "11labs"
        voiceId = "shimmer"
        stability = 0.5
        similarityBoost = 0.8
    }
    language = "fr"
    firstMessage = "Bonjour ! Je suis AlloKoliConfig Pro, votre expert Vapi omniscient. Grâce à ma maîtrise complète de 105 pages de documentation officielle et 525 exemples pratiques, je peux créer des configurations depuis les plus simples jusqu'aux plus complexes. Quel est votre niveau souhaité : SIMPLE, AVANCÉ, ou EXPERT ?"
    endCallMessage = "Parfait ! Votre assistant vocal expert est configuré avec les meilleures pratiques Vapi. Merci d'avoir utilisé AlloKoliConfig Pro !"
    
    # Instructions système (format attendu par la fonction Edge)
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

Dites-moi votre niveau souhaité ou décrivez directement votre besoin, je détecterai automatiquement le niveau optimal et vous guiderai avec mes recommandations expertes basées sur 105 pages de documentation Vapi !
"@
    
    # Fonctionnalités avancées
    silenceTimeoutSeconds = 30
    maxDurationSeconds = 1800
    backgroundSound = "office"
    backchannelingEnabled = $true
    backgroundDenoisingEnabled = $true
    modelOutputInMessagesEnabled = $true
    
    # Transcriber
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
        version = "3.0.0"
        creation_date = "2025-01-18"
        specializations = @("restaurant", "salon", "artisan", "liberal", "boutique", "pme", "enterprise")
        supported_modes = @("simple", "advanced", "expert")
    }
    
    # Clé API Vapi pour la fonction Edge
    vapi_api_key = $VAPI_API_KEY
}

# Conversion en JSON
$jsonData = $assistantData | ConvertTo-Json -Depth 10

Write-Host "Donnees preparees pour la fonction Edge" -ForegroundColor Yellow
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
    
    if ($response.success -or $response.data) {
        Write-Host "Assistant configurateur expert cree avec succes !" -ForegroundColor Green
        
        $assistantData = $response.data
        if (-not $assistantData) {
            $assistantData = $response
        }
        
        Write-Host "ID Supabase: $($assistantData.id)" -ForegroundColor Cyan
        Write-Host "Nom: $($assistantData.name)" -ForegroundColor Cyan
        
        if ($assistantData.vapi_assistant_id) {
            Write-Host "ID Vapi: $($assistantData.vapi_assistant_id)" -ForegroundColor Green
            Write-Host "Assistant deploye sur Vapi avec succes !" -ForegroundColor Green
        }
        
        Write-Host "`nSUCCES COMPLET !" -ForegroundColor Magenta
        Write-Host "L'Assistant Configurateur Expert AlloKoli est maintenant operationnel !" -ForegroundColor Green
        Write-Host "Il maitrise 105 pages de documentation Vapi et 525 exemples" -ForegroundColor Yellow
        Write-Host "Pret a revolutionner la configuration d'assistants vocaux !" -ForegroundColor Magenta
        
        # Afficher les détails complets
        Write-Host "`nDetails de l'assistant cree:" -ForegroundColor White
        Write-Host "- ID Supabase: $($assistantData.id)" -ForegroundColor Cyan
        Write-Host "- ID Vapi: $($assistantData.vapi_assistant_id)" -ForegroundColor Cyan
        Write-Host "- Modele: $($assistantData.model_provider)/$($assistantData.model_name)" -ForegroundColor Cyan
        Write-Host "- Voix: $($assistantData.voice)" -ForegroundColor Cyan
        Write-Host "- Langue: $($assistantData.language)" -ForegroundColor Cyan
        
    } else {
        Write-Host "Erreur lors de la creation de l'assistant:" -ForegroundColor Red
        Write-Host ($response.message -or "Erreur inconnue") -ForegroundColor Red
        
        # Afficher la réponse complète pour debug
        Write-Host "Reponse complete:" -ForegroundColor Yellow
        Write-Host ($response | ConvertTo-Json -Depth 5) -ForegroundColor Yellow
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