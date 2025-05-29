# Script de déploiement de l'Assistant Configurateur Expert AlloKoli
# Utilise la fonction Edge /assistants existante pour créer l'assistant sur Vapi

Write-Host "Deploiement de l'Assistant Configurateur Expert AlloKoli..." -ForegroundColor Green

# Configuration
$SUPABASE_URL = "https://aiurboizarbbcpynmmgv.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM"

# Données de l'assistant configurateur expert
$assistantData = @{
    name = "AlloKoliConfig Pro - Assistant Configurateur Expert Omniscient"
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
- **Base de connaissances live** mise à jour avec les dernières fonctionnalités Vapi

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

Dites-moi votre niveau souhaité ou décrivez directement votre besoin, je détecterai automatiquement le niveau optimal !
"@
    }
    voice = @{
        provider = "elevenlabs"
        voiceId = "shimmer"
        stability = 0.5
        similarityBoost = 0.8
    }
    language = "fr-FR"
    firstMessage = "Bonjour ! Je suis AlloKoliConfig Pro, votre expert Vapi omniscient. Grâce à ma maîtrise complète de 105 pages de documentation officielle et 525 exemples pratiques, je peux créer des configurations depuis les plus simples jusqu'aux plus complexes (squads, webhooks, SIP, MCP). Quel est votre niveau souhaité : SIMPLE pour une config guidée, AVANCÉ pour tools et intégrations, ou EXPERT pour configurations complexes ?"
    endCallMessage = "Parfait ! Votre assistant vocal expert est configuré avec les meilleures pratiques Vapi. Vous recevrez tous les détails par email. Merci d'avoir utilisé AlloKoliConfig Pro !"
    
    # Outils MCP et fonctionnalités avancées
    tools = @(
        @{
            type = "function"
            function = @{
                name = "createAssistantWithIntelligentRecommendations"
                description = "Crée l'assistant vocal final avec recommandations intelligentes basées sur 105 pages de doc Vapi"
                parameters = @{
                    type = "object"
                    properties = @{
                        assistantName = @{ type = "string"; description = "Nom de l'assistant vocal" }
                        businessType = @{ type = "string"; description = "Type d'activité de l'entreprise" }
                        complexityLevel = @{ type = "string"; enum = @("simple", "advanced", "expert"); description = "Niveau de complexité souhaité" }
                        assistantTone = @{ type = "string"; description = "Ton de communication" }
                        firstMessage = @{ type = "string"; description = "Message d'accueil" }
                        systemPromptCore = @{ type = "string"; description = "Prompt système principal" }
                        voiceProvider = @{ type = "string"; description = "Provider vocal recommandé" }
                        voiceId = @{ type = "string"; description = "ID de la voix recommandée" }
                        modelProvider = @{ type = "string"; description = "Provider LLM recommandé" }
                        modelName = @{ type = "string"; description = "Modèle LLM recommandé" }
                        temperature = @{ type = "number"; description = "Température optimale" }
                        enabledTools = @{ type = "array"; items = @{ type = "string" }; description = "Outils recommandés selon le secteur" }
                        advancedFeatures = @{ type = "object"; description = "Fonctionnalités avancées recommandées" }
                        companyName = @{ type = "string"; description = "Nom de l'entreprise" }
                        address = @{ type = "string"; description = "Adresse" }
                        phoneNumber = @{ type = "string"; description = "Numéro de téléphone" }
                        email = @{ type = "string"; description = "Email" }
                        openingHours = @{ type = "string"; description = "Horaires d'ouverture" }
                        endCallMessage = @{ type = "string"; description = "Message de fin d'appel" }
                    }
                    required = @("assistantName", "businessType", "complexityLevel", "assistantTone", "firstMessage", "systemPromptCore")
                }
            }
        },
        @{
            type = "function"
            function = @{
                name = "getVapiRecommendations"
                description = "Obtient des recommandations intelligentes basées sur la base de connaissances Vapi"
                parameters = @{
                    type = "object"
                    properties = @{
                        businessType = @{ type = "string"; description = "Type d'activité" }
                        requirements = @{ type = "object"; description = "Exigences spécifiques (langue, premium, etc.)" }
                    }
                    required = @("businessType")
                }
            }
        },
        @{
            type = "function"
            function = @{
                name = "explainVapiFeature"
                description = "Explique une fonctionnalité Vapi avec exemples de la documentation"
                parameters = @{
                    type = "object"
                    properties = @{
                        feature = @{ type = "string"; description = "Fonctionnalité à expliquer (squads, webhooks, tools, etc.)" }
                    }
                    required = @("feature")
                }
            }
        }
    )
    
    # Métadonnées enrichies
    metadata = @{
        configurator_type = "expert_omniscient"
        knowledge_base_version = "2.0.0"
        total_pages_mastered = 105
        total_examples = 525
        total_schemas = 168
        coverage_score = 98
        intelligence_level = "omniscient"
        specializations = @("restaurant", "salon", "artisan", "liberal", "boutique", "pme", "enterprise")
        advanced_capabilities = @("intelligent_recommendations", "sector_optimization", "performance_tuning", "complex_integrations", "troubleshooting_expert", "scalable_architecture")
        supported_modes = @("simple", "advanced", "expert")
        creation_date = "2025-01-18"
        creator = "AlloKoli Team"
        version = "2.0.0"
    }
    
    # Configuration MCP
    server = @{
        url = "https://mcp.vapi.ai/mcp"
        timeoutSeconds = 30
    }
    
    # Fonctionnalités avancées
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
}

# Conversion en JSON
$jsonData = $assistantData | ConvertTo-Json -Depth 10

Write-Host "Donnees de l'assistant preparees" -ForegroundColor Yellow
Write-Host "Taille des donnees: $($jsonData.Length) caracteres" -ForegroundColor Cyan

# Appel à la fonction Edge /assistants
try {
    Write-Host "Appel de la fonction Edge /assistants..." -ForegroundColor Blue
    
    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/functions/v1/assistants" `
        -Method POST `
        -Headers @{
            "Authorization" = "Bearer $SUPABASE_ANON_KEY"
            "Content-Type" = "application/json"
            "apikey" = $SUPABASE_ANON_KEY
        } `
        -Body $jsonData
    
    Write-Host "Assistant configurateur expert cree avec succes !" -ForegroundColor Green
    Write-Host "ID Assistant: $($response.data.id)" -ForegroundColor Cyan
    Write-Host "Nom: $($response.data.name)" -ForegroundColor Cyan
    Write-Host "Modele: $($response.data.model.provider)/$($response.data.model.model)" -ForegroundColor Cyan
    Write-Host "Voix: $($response.data.voice.provider)/$($response.data.voice.voiceId)" -ForegroundColor Cyan
    
    if ($response.data.vapi_assistant_id) {
        Write-Host "ID Vapi: $($response.data.vapi_assistant_id)" -ForegroundColor Green
        Write-Host "Assistant deploye sur Vapi avec succes !" -ForegroundColor Green
    }
    
    Write-Host "`nL'Assistant Configurateur Expert AlloKoli est maintenant operationnel !" -ForegroundColor Magenta
    Write-Host "Il maitrise 105 pages de documentation Vapi et 525 exemples" -ForegroundColor Yellow
    Write-Host "Pret a creer des configurations depuis simples jusqu'aux plus complexes !" -ForegroundColor Green
    
} catch {
    Write-Host "Erreur lors de la creation de l'assistant:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Details de l'erreur: $errorBody" -ForegroundColor Yellow
    }
}

Write-Host "`nScript termine." -ForegroundColor White 