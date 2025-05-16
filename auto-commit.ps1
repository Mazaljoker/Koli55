# Script PowerShell d'auto-commit pour Koli55
# Ce script automatise le processus de commit et push

# Définir le dossier du projet - utilisez le chemin actuel
$projectPath = "C:\allokoli\pipecat\Koli55"

# Aller dans le dossier du projet
Set-Location -Path $projectPath

# Étape 1 : Ajouter tous les fichiers modifiés
git add .

# Étape 2 : Vérifier s'il y a quelque chose à committer
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "Aucun changement à committer." -ForegroundColor Yellow
    exit 0
}

# Étape 3 : Générer un message de commit avec date/heure
$commitMessage = "Auto-commit: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# Étape 4 : Faire le commit
git commit -m "$commitMessage"

# Étape 5 : Pousser sur la branche actuelle
$currentBranch = git rev-parse --abbrev-ref HEAD
git push origin $currentBranch

Write-Host "Commit auto effectué avec succès." -ForegroundColor Green 