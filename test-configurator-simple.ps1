
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$url = "
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$env:NEXT_PUBLIC_SUPABASE_URL/functions/v1/vapi-configurator"

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
$env:NEXT_PUBLIC_SUPABASE_ANON_KEY"
    "Content-Type" = "application/json"
}

Write-Host "🧪 Test Agent Vapi Configurateur" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Test 1: Liste des prompts
Write-Host "`n📋 Test 1: Liste des prompts..." -ForegroundColor Cyan
try {
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$body = '{"action": "list-prompts"}'
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$response = Invoke-RestMethod -Uri 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$url -Method POST -Headers 
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
$body
    Write-Host "✅ Succès!" -ForegroundColor Green
    Write-Host "Prompts disponibles: 
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
$response.data.prompts -join ', ')" -ForegroundColor White
} catch {
    Write-Host "❌ Erreur: 
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
$_.Exception.Message)" -ForegroundColor Red
}

# Test 2: Prompt restaurant
Write-Host "`n🍽️ Test 2: Prompt restaurant..." -ForegroundColor Cyan
try {
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$body = '{"action": "get-prompt", "businessType": "restaurant"}'
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$response = Invoke-RestMethod -Uri 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$url -Method POST -Headers 
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
$body
    Write-Host "✅ Succès!" -ForegroundColor Green
    Write-Host "Longueur du prompt: 
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
$response.data.prompt.Length) caractères" -ForegroundColor White
} catch {
    Write-Host "❌ Erreur: 
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
$_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Prompt salon
Write-Host "`n💄 Test 3: Prompt salon..." -ForegroundColor Cyan
try {
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$body = '{"action": "get-prompt", "businessType": "salon"}'
    
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$response = Invoke-RestMethod -Uri 
# Vérification des variables d'environnement
if (-not $env:NEXT_PUBLIC_SUPABASE_URL) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_URL non définie" -ForegroundColor Red
    exit 1
}

if (-not $env:NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    Write-Host "❌ ERREUR: Variable d'environnement NEXT_PUBLIC_SUPABASE_ANON_KEY non définie" -ForegroundColor Red
    exit 1
}
$url -Method POST -Headers 
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
$body
    Write-Host "✅ Succès!" -ForegroundColor Green
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
$response.data.businessType)" -ForegroundColor White
} catch {
    Write-Host "❌ Erreur: 
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
$_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Tests terminés!" -ForegroundColor Green 
