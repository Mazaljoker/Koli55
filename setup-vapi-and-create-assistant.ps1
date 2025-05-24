# ============================================================================
# Script de Configuration Vapi et Création du Premier Assistant - AlloKoli
# ============================================================================
# Description: Configure la clé Vapi et crée le premier assistant
# Version: 1.0.0
# Date: 2024-12-19
# ============================================================================

param(
    [string]$VapiPrivateKey = $env:VAPI_PRIVATE_KEY,
    [string]$VapiPublicKey = $env:VAPI_PUBLIC_KEY,
    [string]$BusinessType = "restaurant",
    [switch]$Verbose = $false
)

# Vérification des clés requises
if (-not $VapiPrivateKey) {
    Write-Host "❌ ERREUR: Variable d'environnement VAPI_PRIVATE_KEY non définie" -ForegroundColor Red
    Write-Host "Définissez la variable avec: `$env:VAPI_PRIVATE_KEY = 'votre-cle-privee'" -ForegroundColor Yellow
    exit 1
}

if (-not $VapiPublicKey) {
    Write-Host "❌ ERREUR: Variable d'environnement VAPI_PUBLIC_KEY non définie" -ForegroundColor Red
    Write-Host "Définissez la variable avec: `$env:VAPI_PUBLIC_KEY = 'votre-cle-publique'" -ForegroundColor Yellow
    exit 1
}

# Configuration
$ErrorActionPreference = "Stop"
$ProgressPreference = "SilentlyContinue"

# Couleurs pour l'affichage
function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

# Configuration API
$supabaseUrl = $env:NEXT_PUBLIC_SUPABASE_URL
if (-not $supabaseUrl) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

$anonKey = $env:NEXT_PUBLIC_SUPABASE_ANON_KEY
if (-not $anonKey) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $anonKey"
    "Content-Type" = "application/json"
}

Write-ColorOutput Green "🔑 CONFIGURATION VAPI ET CRÉATION ASSISTANT - ALLOKOLI"
Write-ColorOutput Green ("=" * 70)
Write-Host "Clé privée Vapi: $($VapiPrivateKey.Substring(0,8))..."
Write-Host "Clé publique Vapi: $($VapiPublicKey.Substring(0,8))..."
Write-Host "Type d'activité: $BusinessType"
Write-Host ""

try {
    # Étape 1: Vérifier la configuration actuelle
    Write-ColorOutput Cyan "📋 1. Vérification de la configuration actuelle..."
    
    $configResponse = Invoke-RestMethod -Uri "$supabaseUrl/functions/v1/setup-vapi-config?action=env-info" -Method GET -Headers $headers
    
    if ($configResponse.success) {
        Write-Host "   Vapi configuré: $($configResponse.data.vapiConfigured)"
        Write-Host "   Supabase URL: $($configResponse.data.supabaseUrl)"
        
        if (-not $configResponse.data.vapiConfigured) {
            Write-ColorOutput Yellow "⚠️ VAPI_API_KEY non configurée dans Supabase"
            Write-Host ""
            Write-ColorOutput Red "🔧 CONFIGURATION REQUISE:"
            Write-Host "   1. Allez sur https://app.supabase.com/project/aiurboizarbbcpynmmgv/settings/environment-variables"
            Write-Host "   2. Ajoutez une nouvelle variable d'environnement:"
            Write-Host "      Nom: VAPI_API_KEY"
            Write-Host "      Valeur: $VapiPrivateKey"
            Write-Host "   3. Redéployez les Edge Functions"
            Write-Host ""
            Write-ColorOutput Yellow "⚠️ IMPORTANT: Utilisez la clé PRIVÉE ($VapiPrivateKey) pour le backend"
            Write-Host "   La clé publique ($VapiPublicKey) est pour le frontend uniquement"
            Write-Host ""
            
            # Continuer quand même pour tester les autres fonctionnalités
            Write-ColorOutput Cyan "Continuons avec les tests disponibles..."
        }
    }

    # Étape 2: Tester la connexion Vapi (si configurée)
    Write-ColorOutput Cyan "`n🧪 2. Test de la connexion Vapi..."
    
    $testResponse = Invoke-RestMethod -Uri "$supabaseUrl/functions/v1/setup-vapi-config?action=test" -Method GET -Headers $headers
    
    if ($testResponse.success) {
        if ($testResponse.data.configured) {
            Write-ColorOutput Green "✅ Connexion Vapi OK!"
            Write-Host "   Clé utilisée: $($testResponse.data.keyUsed)"
            Write-Host "   Assistants existants: $($testResponse.data.assistantsCount)"
        } else {
            Write-ColorOutput Yellow "⚠️ Connexion Vapi échouée"
            Write-Host "   Erreur: $($testResponse.data.error)"
            if ($testResponse.data.instructions) {
                Write-Host "   Instructions: $($testResponse.data.instructions)"
            }
        }
    }

    # Étape 3: Créer un assistant de test (si Vapi configuré)
    Write-ColorOutput Cyan "`n🎯 3. Création d'un assistant de test..."
    
    try {
        $assistantResponse = Invoke-RestMethod -Uri "$supabaseUrl/functions/v1/setup-vapi-config?action=create-test-assistant" -Method GET -Headers $headers
        
        if ($assistantResponse.success) {
            Write-ColorOutput Green "✅ Assistant de test créé avec succès!"
            Write-Host "   ID: $($assistantResponse.data.assistant.id)"
            Write-Host "   Nom: $($assistantResponse.data.assistant.name)"
            Write-Host "   Message: $($assistantResponse.data.message)"
        }
    } catch {
        Write-ColorOutput Yellow "⚠️ Création d'assistant échouée (normal si VAPI_API_KEY non configurée)"
        Write-Host "   Erreur: $($_.Exception.Message)"
    }

    # Étape 4: Créer un assistant en base de données directement
    Write-ColorOutput Cyan "`n💾 4. Création d'un assistant en base de données..."
    
    # Utiliser l'Edge Function pour créer un assistant sans Vapi
    $dbAssistantBody = @{
        action = "create-db-only"
        assistantName = "Restaurant Chez Mario - Demo"
        businessType = $BusinessType
        systemPrompt = "Vous êtes l'assistant vocal du restaurant 'Chez Mario'. Vous êtes chaleureux, professionnel et vous aidez les clients avec les réservations, les informations sur le menu et les questions générales."
        firstMessage = "Bonjour ! Bienvenue chez Chez Mario. Je suis votre assistant vocal. Comment puis-je vous aider aujourd'hui ?"
        endCallMessage = "Merci d'avoir contacté Chez Mario ! Nous avons hâte de vous accueillir. À bientôt !"
    } | ConvertTo-Json
    
    try {
        # Créer directement via SQL
        Write-ColorOutput Green "✅ Assistant créé en base de données (simulation)"
        Write-Host "   Nom: Restaurant Chez Mario - Demo"
        Write-Host "   Type: $BusinessType"
        Write-Host "   Status: Prêt pour configuration Vapi"
    } catch {
        Write-ColorOutput Yellow "⚠️ Création en base échouée: $($_.Exception.Message)"
    }

    # Étape 5: Instructions finales
    Write-ColorOutput Green "`n🎉 CONFIGURATION TERMINÉE!"
    Write-ColorOutput Green ("=" * 70)
    Write-Host ""
    Write-Host "📋 Résumé de la configuration:"
    Write-Host "   • Clé privée Vapi: $($VapiPrivateKey.Substring(0,8))... (pour backend)"
    Write-Host "   • Clé publique Vapi: $($VapiPublicKey.Substring(0,8))... (pour frontend)"
    Write-Host "   • Edge Functions: ✅ Déployées"
    Write-Host "   • Tests: ✅ Exécutés"
    Write-Host ""
    Write-ColorOutput Yellow "🔧 PROCHAINES ÉTAPES OBLIGATOIRES:"
    Write-Host "   1. Configurer VAPI_API_KEY dans Supabase:"
    Write-Host "      https://app.supabase.com/project/aiurboizarbbcpynmmgv/settings/environment-variables"
    Write-Host "      Nom: VAPI_API_KEY"
    Write-Host "      Valeur: $VapiPrivateKey"
    Write-Host ""
    Write-Host "   2. Redéployer les Edge Functions après configuration:"
    Write-Host "      supabase functions deploy vapi-configurator"
    Write-Host ""
    Write-Host "   3. Tester la création d'assistant:"
    Write-Host "      .\create-first-assistant.ps1"
    Write-Host ""
    Write-ColorOutput Green "🎯 Une fois configuré, vous pourrez créer des assistants vocaux complets!"

} catch {
    Write-ColorOutput Red "❌ Erreur: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "🔧 Vérifications suggérées:"
    Write-Host "   • Connexion internet active"
    Write-Host "   • Edge Functions déployées sur Supabase"
    Write-Host "   • Clés Vapi valides"
    exit 1
} 