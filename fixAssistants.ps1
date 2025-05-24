# fixAssistants.ps1
# Script pour résoudre le problème de fonction Edge assistants

Write-Host "Correction de la fonction Edge assistants..." -ForegroundColor Green

# Créer un backup du fichier actuel à la racine
if (Test-Path "supabase/functions/assistants/index.ts") {
    Write-Host "Backup du fichier à la racine..." -ForegroundColor Yellow
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    Copy-Item "supabase/functions/assistants/index.ts" "supabase/functions/assistants/index.ts.backup-$timestamp"
}

# Copier le fichier depuis backend
if (Test-Path "backend/supabase/functions/assistants/index.ts") {
    Write-Host "Copie de la fonction depuis backend..." -ForegroundColor Yellow
    
    # Assurer que le dossier existe
    if (-not (Test-Path "supabase/functions/assistants")) {
        New-Item -ItemType Directory -Path "supabase/functions/assistants" -Force
    }
    
    Copy-Item "backend/supabase/functions/assistants/index.ts" "supabase/functions/assistants/index.ts" -Force
    
    Write-Host "Fichier copié avec succès." -ForegroundColor Green
} else {
    Write-Host "Erreur: Fichier source non trouvé dans backend/supabase/functions/assistants" -ForegroundColor Red
    exit 1
}

# Installer Supabase CLI si nécessaire et déployer la fonction
Write-Host "Déploiement de la fonction Edge..." -ForegroundColor Yellow
npx supabase@latest functions deploy assistants

Write-Host "Opération terminée! Veuillez tester à nouveau la création d'assistant." -ForegroundColor Green 