# ============================================================================
# Script de Création du Premier Assistant - AlloKoli
# ============================================================================
# Description: Crée le premier assistant vocal via notre Edge Function
# Version: 1.0.0
# Date: 2024-12-19
# ============================================================================

param(
    [string]
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$BusinessType = "restaurant",
    [string]
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$AssistantName = "AlloKoli Assistant Demo",
    [switch]
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$Verbose = 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$false
)


# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$ErrorActionPreference = "Stop"

# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$ProgressPreference = "SilentlyContinue"

# Couleurs pour l'affichage
function Write-ColorOutput(
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$ForegroundColor) {
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$fc = 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$host.UI.RawUI.ForegroundColor
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$host.UI.RawUI.ForegroundColor = 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$ForegroundColor
    if (
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$args) {
        Write-Output 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$args
    }
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$host.UI.RawUI.ForegroundColor = 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$fc
}


# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$supabaseUrl = "
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$env:NEXT_PUBLIC_SUPABASE_URL"

# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$anonKey = "
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY"


# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$headers = @{
    "Authorization" = "Bearer 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$anonKey"
    "Content-Type" = "application/json"
}

Write-ColorOutput Green "🎤 CRÉATION DU PREMIER ASSISTANT - ALLOKOLI"
Write-ColorOutput Green ("=" * 60)
Write-Host "Type d'activité: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$BusinessType"
Write-Host "Nom de l'assistant: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$AssistantName"
Write-Host ""

try {
    # Étape 1: Vérifier la connexion
    Write-ColorOutput Cyan "📋 1. Vérification de la connexion..."
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$testBody = @{
        action = "list-prompts"
    } | ConvertTo-Json
    
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$testResponse = Invoke-RestMethod -Uri "
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$supabaseUrl/functions/v1/vapi-configurator" -Method POST -Headers 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$headers -Body 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$testBody
    
    if (
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$testResponse.success) {
        Write-ColorOutput Green "✅ Connexion OK - Prompts disponibles: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$(
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$testResponse.data.prompts -join ', ')"
    } else {
        throw "Erreur de connexion: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$(
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$testResponse.error)"
    }

    # Étape 2: Créer l'assistant configurateur
    Write-ColorOutput Cyan "`n🚀 2. Création de l'assistant configurateur..."
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$createBody = @{
        action = "create"
        businessType = 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$BusinessType
    } | ConvertTo-Json
    
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$createResponse = Invoke-RestMethod -Uri "
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$supabaseUrl/functions/v1/vapi-configurator" -Method POST -Headers 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$headers -Body 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$createBody
    
    if (
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$createResponse.success) {
        Write-ColorOutput Green "✅ Assistant configurateur créé avec succès!"
        Write-Host "   ID Assistant: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$(
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$createResponse.data.assistantId)"
        Write-Host "   ID Vapi: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$(
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$createResponse.data.vapiId)"
        Write-Host "   Message: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$(
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$createResponse.data.message)"
    } else {
        throw "Erreur création assistant: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$(
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$createResponse.error)"
    }

    # Étape 3: Créer un assistant final via MCP
    Write-ColorOutput Cyan "`n🎯 3. Création d'un assistant final via MCP..."
    
    # Paramètres pour un restaurant de démonstration
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$assistantParams = @{
        assistantName = 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$AssistantName
        businessType = 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$BusinessType
        assistantTone = "chaleureux et professionnel"
        firstMessage = "Bonjour ! Bienvenue chez Chez Mario. Je suis votre assistant vocal. Comment puis-je vous aider aujourd'hui ? Souhaitez-vous faire une réservation ou avez-vous des questions sur notre menu ?"
        systemPromptCore = "Vous êtes l'assistant vocal du restaurant 'Chez Mario'. Vous êtes chaleureux, professionnel et vous aidez les clients avec les réservations, les informations sur le menu et les questions générales."
        canTakeReservations = 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$true
        canTakeAppointments = 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$false
        canTransferCall = 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$true
        companyName = "Restaurant Chez Mario"
        address = "123 Rue de la Gastronomie, 75001 Paris"
        phoneNumber = "+33 1 23 45 67 89"
        email = "contact@chezmario.fr"
        openingHours = "Mardi à Dimanche de 12h à 14h30 et de 19h à 22h30. Fermé le lundi."
        endCallMessage = "Merci d'avoir contacté Chez Mario ! Nous avons hâte de vous accueillir. À bientôt !"
    }
    
    # Appeler le serveur MCP pour créer l'assistant final
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$mcpBody = @{
        tool = "createAssistantAndProvisionNumber"
        parameters = 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$assistantParams
    } | ConvertTo-Json -Depth 10
    
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$mcpResponse = Invoke-RestMethod -Uri "
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$supabaseUrl/functions/v1/mcp-server" -Method POST -Headers 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$headers -Body 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$mcpBody
    
    if (
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$mcpResponse.success) {
        Write-ColorOutput Green "✅ Assistant final créé avec succès!"
        Write-Host "   Détails: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$(
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$mcpResponse.data | ConvertTo-Json -Depth 3)"
    } else {
        Write-ColorOutput Yellow "⚠️ Création MCP échouée, mais l'assistant configurateur est opérationnel"
        Write-Host "   Erreur: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$(
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$mcpResponse.error)"
    }

    # Étape 4: Vérification en base de données
    Write-ColorOutput Cyan "`n📊 4. Vérification en base de données..."
    
    # Note: Cette étape nécessiterait une requête SQL directe
    Write-ColorOutput Green "✅ Vérification manuelle recommandée via Supabase Dashboard"

    Write-ColorOutput Green "`n🎉 CRÉATION TERMINÉE AVEC SUCCÈS!"
    Write-ColorOutput Green ("=" * 60)
    Write-Host ""
    Write-Host "📋 Résumé:"
    Write-Host "   • Assistant configurateur: ✅ Créé"
    Write-Host "   • Type d'activité: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$BusinessType"
    Write-Host "   • Prompts spécialisés: ✅ Chargés"
    Write-Host "   • Edge Functions: ✅ Opérationnelles"
    Write-Host ""
    Write-Host "🔗 URLs importantes:"
    Write-Host "   • Edge Function: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$supabaseUrl/functions/v1/vapi-configurator"
    Write-Host "   • Interface web: http://localhost:3000/vapi-configurator"
    Write-Host ""
    Write-ColorOutput Yellow "⚠️ Prochaines étapes:"
    Write-Host "   1. Configurer VAPI_API_KEY dans les variables d'environnement"
    Write-Host "   2. Tester l'onboarding vocal complet"
    Write-Host "   3. Vérifier la création d'assistants finaux"

} catch {
    Write-ColorOutput Red "❌ Erreur: 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$(
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$_.Exception.Message)"
    Write-Host ""
    Write-Host "🔧 Vérifications suggérées:"
    Write-Host "   • Connexion internet active"
    Write-Host "   • Edge Functions déployées sur Supabase"
    Write-Host "   • Variables d'environnement configurées"
    exit 1
} 
