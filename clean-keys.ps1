# Script PowerShell pour nettoyer l'historique Git des clés API avec BFG Repo-Cleaner

Write-Host "=== ATTENTION ===" -ForegroundColor Red
Write-Host "Ce script va nettoyer l'historique Git pour supprimer toutes les clés API." -ForegroundColor Yellow
Write-Host "Cette opération est irréversible et modifie l'historique Git." -ForegroundColor Yellow
Write-Host "Si vous avez déjà poussé ce dépôt sur un repo distant, vous devrez forcer la mise à jour." -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Voulez-vous continuer? (oui/non)"
if ($confirmation -ne "oui") {
    Write-Host "Opération annulée par l'utilisateur." -ForegroundColor Cyan
    exit 0
}

# Vérifier si le dépôt est propre
$status = git status --porcelain
if ($status) {
    Write-Host "Votre dépôt contient des modifications non commitées." -ForegroundColor Red
    Write-Host "Commitez ou stashez vos changements avant d'exécuter ce script." -ForegroundColor Red
    exit 1
}

# Créer une sauvegarde de la branche actuelle
$currentBranch = git branch --show-current
Write-Host "Création d'une sauvegarde de la branche $currentBranch..." -ForegroundColor Cyan
git branch "backup-$currentBranch-$(Get-Date -Format 'yyyyMMdd-HHmmss')"

# Créer un fichier de remplacement pour les textes sensibles
$replacementFile = "replacements.txt"
@"
supabaseUrl = 'https://aiurboizarbbcpynmmgv.supabase.co'==>supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM'==>supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM==>REMOVED_API_KEY
"@ | Out-File -FilePath $replacementFile -Encoding utf8

# Créer un script de remplacement personalisé
$scriptFile = "replace-keys.ps1"
@"
param(
    [Parameter(Mandatory=`$true, ValueFromPipeline=`$true)]
    [string] `$content
)

`$replacements = @{
    "supabaseUrl = 'https://aiurboizarbbcpynmmgv.supabase.co'" = "supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''";
    "supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczOTUxNzUsImV4cCI6MjA2Mjk3MTE3NX0.5uZKJkSS656znzAd0VFLQ0vE3s2cEfpZfn5SCsFTBGM'" = "supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''";
}

foreach (`$key in `$replacements.Keys) {
    `$content = `$content -replace [regex]::Escape(`$key), `$replacements[`$key]
}

# Remplacer tous les tokens JWT
`$content = `$content -replace 'eyJ[a-zA-Z0-9_\-]{20,}', 'REMOVED_API_KEY'

return `$content
"@ | Out-File -FilePath $scriptFile -Encoding utf8

# Vérifier si git-filter-repo est installé
try {
    $null = python -c "import git_filter_repo"
    Write-Host "git-filter-repo est disponible." -ForegroundColor Green
} catch {
    Write-Host "L'outil git-filter-repo n'est pas installé." -ForegroundColor Red
    Write-Host "Installation via pip..." -ForegroundColor Yellow
    python -m pip install git-filter-repo
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Impossible d'installer git-filter-repo. Veuillez l'installer manuellement." -ForegroundColor Red
        exit 1
    }
}

# Le filtre pour supprimer les clés API
Write-Host "Nettoyage de l'historique Git..." -ForegroundColor Cyan

# Utiliser git filter-repo avec un script Python personnalisé
$pyScript = "filter-script.py"
@"
#!/usr/bin/env python3
import re
import sys
from git_filter_repo import Blob, FilteringOptions, RepoFilter

def clean_sensitive_data(blob):
    data = blob.data.decode('utf-8', errors='replace')
    original_data = data
    
    # Remplacer les clés Supabase
    data = re.sub(
        r"supabaseUrl\s*=\s*['\"]https://[^'\"]+['\"]", 
        "supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''", 
        data
    )
    
    data = re.sub(
        r"supabaseAnonKey\s*=\s*['\"][^'\"]+['\"]", 
        "supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''", 
        data
    )
    
    # Remplacer les JWT tokens
    data = re.sub(
        r"eyJ[a-zA-Z0-9_\-]{20,}", 
        "REMOVED_API_KEY", 
        data
    )
    
    # Si des modifications ont été faites, mettre à jour le blob
    if data != original_data:
        print(f"Nettoyage de données sensibles dans {blob.path}")
        blob.data = data.encode('utf-8')
    
    return blob

filter = RepoFilter(blob_callback=clean_sensitive_data)
filter.run()
"@ | Out-File -FilePath $pyScript -Encoding utf8

# Exécuter le script de nettoyage
Write-Host "Exécution du nettoyage avec git-filter-repo..." -ForegroundColor Cyan
python $pyScript

# Nettoyer les fichiers temporaires
Remove-Item -Path $replacementFile -Force -ErrorAction SilentlyContinue
Remove-Item -Path $scriptFile -Force -ErrorAction SilentlyContinue
Remove-Item -Path $pyScript -Force -ErrorAction SilentlyContinue

# Nettoyer les références orphelines
Write-Host "Nettoyage des références..." -ForegroundColor Cyan
git reflog expire --expire=now --all
git gc --prune=now --aggressive

Write-Host "Nettoyage terminé!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT: Si vous souhaitez mettre à jour un dépôt distant, utilisez:" -ForegroundColor Yellow
Write-Host "git push --force" -ForegroundColor Yellow
