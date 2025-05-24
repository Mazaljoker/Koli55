# copy-shared.ps1
# Script pour créer le dossier shared manquant

Write-Host "Création du dossier shared manquant..." -ForegroundColor Cyan

# Créer le dossier s'il n'existe pas
if (-not (Test-Path "supabase/shared")) {
    Write-Host "Création du dossier supabase/shared..." -ForegroundColor Green
    New-Item -ItemType Directory -Path "supabase/shared" -Force
    Write-Host "Dossier créé avec succès." -ForegroundColor Green
} else {
    Write-Host "Le dossier supabase/shared existe déjà." -ForegroundColor Yellow
}

# Vérifier si le dossier a été créé
if (Test-Path "supabase/shared") {
    Write-Host "Le dossier supabase/shared est maintenant disponible." -ForegroundColor Green
} else {
    Write-Host "ERREUR: Impossible de créer le dossier supabase/shared." -ForegroundColor Red
}

Write-Host "Opération terminée!" -ForegroundColor Cyan 