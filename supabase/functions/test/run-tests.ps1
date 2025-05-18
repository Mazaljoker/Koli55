# Script PowerShell pour lancer les tests des Edge Functions Supabase
# Auteur: Koli55 Team

# Configuration
$ENV_FILE = "../../.env.local"
$SUPABASE_FUNCTIONS_DIR = "../"
$TEST_DIR = "./"

# Couleurs pour les outputs
function Write-ColorOutput {
    param ([string]$Message, [string]$Color)
    
    $prevColor = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $Color
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $prevColor
}

function Write-Success {
    param ([string]$Message)
    Write-ColorOutput $Message "Green"
}

function Write-Error {
    param ([string]$Message)
    Write-ColorOutput $Message "Red"
}

function Write-Info {
    param ([string]$Message)
    Write-ColorOutput $Message "Cyan"
}

function Write-Warning {
    param ([string]$Message)
    Write-ColorOutput $Message "Yellow"
}

# Bannière
Write-Info ""
Write-Info "====================================="
Write-Info "   Tests des Edge Functions Supabase  "
Write-Info "====================================="
Write-Info ""

# Vérifier si le répertoire de test existe
if (-not (Test-Path $TEST_DIR)) {
    Write-Error "Le répertoire de test n'existe pas: $TEST_DIR"
    exit 1
}

# Vérifier si Supabase CLI est installé
try {
    $supabaseVersion = (supabase --version) | Out-String
    Write-Success "Supabase CLI installé: $supabaseVersion"
}
catch {
    Write-Error "Supabase CLI n'est pas installé ou n'est pas dans le PATH."
    Write-Info "Installez Supabase CLI avec: npm install -g supabase"
    exit 1
}

# Lister les fichiers de test disponibles
Write-Info "Fichiers de test disponibles:"
$httpFiles = Get-ChildItem -Path $TEST_DIR -Filter "*.http"
foreach ($file in $httpFiles) {
    Write-Info " - $($file.Name)"
}

# Vérifier si .env.http existe
if (-not (Test-Path ".env.http")) {
    Write-Warning "Le fichier .env.http n'existe pas. Les variables comme {{supabase_token}} ne seront pas résolues."
    Write-Info "Créez un fichier .env.http avec le contenu suivant:"
    Write-Info "@supabase_token=votre_token_jwt"
}

# Demander quel test exécuter
Write-Info ""
Write-Info "Options disponibles:"
Write-Info "1. Démarrer le serveur Supabase local"
Write-Info "2. Servir les fonctions Edge"
Write-Info "3. Vérifier les variables d'environnement"
Write-Info "4. Voir les logs Supabase"
Write-Info "5. Quitter"

$choice = Read-Host "Choisissez une option (1-5)"

# Revenir au répertoire racine pour les commandes Supabase
Set-Location -Path "../../.."

switch ($choice) {
    "1" {
        Write-Info "Démarrage du serveur Supabase local..."
        supabase start
    }
    "2" {
        Write-Info "Lancement des fonctions Edge..."
        Write-Warning "Utilisation de --no-verify-jwt pour le développement"
        supabase functions serve --no-verify-jwt
    }
    "3" {
        Write-Info "Vérification des variables d'environnement..."
        # Adapter pour utiliser le fichier JS si disponible 
        if (Test-Path "supabase/functions/test/test-env.js") {
            node supabase/functions/test/test-env.js
        } else {
            Write-Warning "Le fichier test-env.js n'existe pas."
        }
    }
    "4" {
        Write-Info "Affichage des logs Supabase..."
        supabase logs
    }
    "5" {
        Write-Info "Au revoir!"
        exit 0
    }
    default {
        Write-Error "Option non valide."
        exit 1
    }
}

Write-Success "Terminé!"
