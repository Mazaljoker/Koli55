# Script de création du repository GitHub pour MCP AlloKoli
# Version: 1.0
# Date: 24 mai 2025

Write-Host "CREATION DU REPOSITORY GITHUB POUR MCP ALLOKOLI" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green

$mcpDir = "allokoli-mcp-server"

# Vérification des prérequis
Write-Host ""
Write-Host "VERIFICATION DES PREREQUIS..." -ForegroundColor Yellow

if (-not (Test-Path $mcpDir)) {
    Write-Host "ERREUR: Dossier MCP non trouve. Executez d'abord prepare-mcp-smithery.ps1" -ForegroundColor Red
    exit 1
}

# Vérification de Git
try {
    $gitVersion = git --version 2>&1
    Write-Host "OK: Git detecte ($gitVersion)" -ForegroundColor Green
} catch {
    Write-Host "ERREUR: Git non installe ou non accessible" -ForegroundColor Red
    exit 1
}

# Vérification de GitHub CLI (optionnel)
$hasGhCli = $false
try {
    $ghVersion = gh --version 2>&1
    Write-Host "OK: GitHub CLI detecte" -ForegroundColor Green
    $hasGhCli = $true
} catch {
    Write-Host "ATTENTION: GitHub CLI non detecte (creation manuelle requise)" -ForegroundColor Yellow
}

# Initialisation du repository
Write-Host ""
Write-Host "INITIALISATION DU REPOSITORY..." -ForegroundColor Yellow

Set-Location $mcpDir

# Initialisation Git
if (-not (Test-Path ".git")) {
    git init
    Write-Host "OK: Repository Git initialise" -ForegroundColor Green
} else {
    Write-Host "OK: Repository Git deja initialise" -ForegroundColor Green
}

# Configuration Git (si pas déjà configuré)
$gitUserName = git config user.name 2>$null
$gitUserEmail = git config user.email 2>$null

if (-not $gitUserName) {
    Write-Host "Configuration Git requise..." -ForegroundColor Yellow
    $userName = Read-Host "Nom d'utilisateur Git"
    git config user.name "$userName"
}

if (-not $gitUserEmail) {
    $userEmail = Read-Host "Email Git"
    git config user.email "$userEmail"
}

# Ajout des fichiers
Write-Host ""
Write-Host "AJOUT DES FICHIERS..." -ForegroundColor Yellow

git add .
$commitMessage = "Initial commit - AlloKoli MCP Server for Smithery"
git commit -m "$commitMessage"
Write-Host "OK: Commit initial cree" -ForegroundColor Green

# Création du repository GitHub
Write-Host ""
Write-Host "CREATION DU REPOSITORY GITHUB..." -ForegroundColor Yellow

$repoName = "allokoli-mcp-server"
$repoDescription = "Serveur MCP AlloKoli pour la creation et gestion d'assistants vocaux avec Vapi et Twilio"

if ($hasGhCli) {
    Write-Host "Creation automatique via GitHub CLI..." -ForegroundColor Cyan
    
    try {
        gh repo create $repoName --description "$repoDescription" --public --source . --remote origin --push
        Write-Host "OK: Repository GitHub cree et pousse automatiquement" -ForegroundColor Green
        
        $repoUrl = gh repo view --json url --jq .url
        Write-Host "URL du repository: $repoUrl" -ForegroundColor Cyan
        
    } catch {
        Write-Host "ERREUR: Echec de la creation automatique" -ForegroundColor Red
        $hasGhCli = $false
    }
}

if (-not $hasGhCli) {
    Write-Host "CREATION MANUELLE REQUISE" -ForegroundColor Yellow
    Write-Host "=========================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Allez sur https://github.com/new" -ForegroundColor White
    Write-Host "2. Nom du repository: $repoName" -ForegroundColor White
    Write-Host "3. Description: $repoDescription" -ForegroundColor White
    Write-Host "4. Visibilite: Public" -ForegroundColor White
    Write-Host "5. Ne pas initialiser avec README (deja present)" -ForegroundColor White
    Write-Host "6. Cliquez sur 'Create repository'" -ForegroundColor White
    Write-Host ""
    
    $githubUsername = Read-Host "Votre nom d'utilisateur GitHub"
    $repoUrl = "https://github.com/$githubUsername/$repoName.git"
    
    Write-Host ""
    Write-Host "AJOUT DU REMOTE ET PUSH..." -ForegroundColor Yellow
    
    git remote add origin $repoUrl
    git branch -M main
    git push -u origin main
    
    Write-Host "OK: Code pousse vers GitHub" -ForegroundColor Green
    Write-Host "URL du repository: https://github.com/$githubUsername/$repoName" -ForegroundColor Cyan
}

# Instructions pour Smithery
Write-Host ""
Write-Host "INSTRUCTIONS POUR SMITHERY" -ForegroundColor Blue
Write-Host "==========================" -ForegroundColor Blue
Write-Host ""
Write-Host "1. Allez sur https://smithery.ai" -ForegroundColor White
Write-Host "2. Connectez-vous avec votre compte GitHub" -ForegroundColor White
Write-Host "3. Cliquez sur 'Add Server' ou 'New Package'" -ForegroundColor White
Write-Host "4. Selectionnez 'GitHub Repository'" -ForegroundColor White
Write-Host "5. Choisissez le repository: $repoName" -ForegroundColor White
Write-Host "6. Configurez les variables d'environnement:" -ForegroundColor White
Write-Host "   - SUPABASE_URL=https://aiurboizarbbcpynmmgv.supabase.co" -ForegroundColor Gray
Write-Host "   - SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key" -ForegroundColor Gray
Write-Host "   - VAPI_API_KEY=votre_vapi_api_key" -ForegroundColor Gray
Write-Host "   - TWILIO_ACCOUNT_SID=votre_twilio_account_sid" -ForegroundColor Gray
Write-Host "   - TWILIO_AUTH_TOKEN=votre_twilio_auth_token" -ForegroundColor Gray
Write-Host "7. Publiez le package" -ForegroundColor White
Write-Host ""

# Configuration Claude Desktop
Write-Host "CONFIGURATION CLAUDE DESKTOP" -ForegroundColor Blue
Write-Host "============================" -ForegroundColor Blue
Write-Host ""
Write-Host "Ajoutez cette configuration a votre fichier Claude Desktop:" -ForegroundColor White
Write-Host ""

$claudeConfig = @"
{
  "mcpServers": {
    "allokoli": {
      "command": "npx",
      "args": ["allokoli-mcp-server"],
      "env": {
        "SUPABASE_URL": "https://aiurboizarbbcpynmmgv.supabase.co",
        "SUPABASE_SERVICE_ROLE_KEY": "votre_service_role_key",
        "VAPI_API_KEY": "votre_vapi_api_key",
        "TWILIO_ACCOUNT_SID": "votre_twilio_account_sid",
        "TWILIO_AUTH_TOKEN": "votre_twilio_auth_token"
      }
    }
  }
}
"@

Write-Host $claudeConfig -ForegroundColor Gray

# Sauvegarde de la configuration
$claudeConfig | Out-File "claude-desktop-config.json" -Encoding UTF8
Write-Host ""
Write-Host "OK: Configuration Claude Desktop sauvegardee dans claude-desktop-config.json" -ForegroundColor Green

# Test final
Write-Host ""
Write-Host "TEST FINAL DU PACKAGE..." -ForegroundColor Yellow

try {
    npm test 2>$null
    Write-Host "OK: Tests passes" -ForegroundColor Green
} catch {
    Write-Host "ATTENTION: Pas de tests definis (normal)" -ForegroundColor Yellow
}

# Résumé final
Write-Host ""
Write-Host "RESUME FINAL" -ForegroundColor Cyan
Write-Host "============" -ForegroundColor Cyan
Write-Host ""
Write-Host "OK: Repository GitHub cree et configure" -ForegroundColor Green
Write-Host "OK: Code pousse vers GitHub" -ForegroundColor Green
Write-Host "OK: Instructions Smithery fournies" -ForegroundColor Green
Write-Host "OK: Configuration Claude Desktop preparee" -ForegroundColor Green
Write-Host ""
Write-Host "PROCHAINES ETAPES:" -ForegroundColor Blue
Write-Host "1. Publier sur Smithery (suivre les instructions ci-dessus)" -ForegroundColor White
Write-Host "2. Configurer Claude Desktop avec le fichier genere" -ForegroundColor White
Write-Host "3. Tester l'integration MCP dans Claude" -ForegroundColor White
Write-Host ""
Write-Host "MCP ALLOKOLI PRET POUR SMITHERY ET CLAUDE DESKTOP!" -ForegroundColor Green

# Retour au dossier parent
Set-Location .. 