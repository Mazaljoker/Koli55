# migrate-standard.ps1
# Script pour standardiser automatiquement le projet selon DOCS/architecture/structure-standard.md

Write-Host "=== STANDARDISATION DU PROJET ALLOKOLI ===" -ForegroundColor Cyan
Write-Host "Création et migration vers la structure standard définie dans DOCS/architecture/structure-standard.md" -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

# 1. S'assurer que les dossiers principaux existent
Write-Host "1. Vérification et création des dossiers principaux..." -ForegroundColor Yellow
$mainDirs = @("frontend", "supabase", "backend", "DOCS")

foreach ($dir in $mainDirs) {
    if (-not (Test-Path $dir)) {
        Write-Host "  - Création du dossier $dir" -ForegroundColor Green
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# 2. S'assurer que les sous-dossiers de supabase existent
Write-Host "2. Vérification des sous-dossiers Supabase..." -ForegroundColor Yellow
$supabaseDirs = @("supabase/functions", "supabase/migrations", "supabase/shared")

foreach ($dir in $supabaseDirs) {
    if (-not (Test-Path $dir)) {
        Write-Host "  - Création du dossier $dir" -ForegroundColor Green
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# 3. Déplacer les fonctions Edge de backend vers supabase si elles existent
Write-Host "3. Migration des fonctions Edge..." -ForegroundColor Yellow

if (Test-Path "backend/supabase/functions") {
    $functionDirs = Get-ChildItem -Path "backend/supabase/functions" -Directory

    foreach ($functionDir in $functionDirs) {
        $functionName = $functionDir.Name
        $sourcePath = "backend/supabase/functions/$functionName"
        $destPath = "supabase/functions/$functionName"

        if (Test-Path $sourcePath) {
            # Si la destination existe déjà, faire un backup
            if (Test-Path $destPath) {
                $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
                $backupPath = "$destPath.backup-$timestamp"
                Write-Host "  - Backup de $destPath vers $backupPath" -ForegroundColor Yellow
                
                # Renommer plutôt que copier pour éviter les problèmes de permission
                try {
                    Rename-Item -Path $destPath -NewName $backupPath -Force -ErrorAction Stop
                } catch {
                    Write-Host "  - ERREUR: Impossible de créer le backup de $destPath. Opération annulée." -ForegroundColor Red
                    Write-Host "    $($_.Exception.Message)" -ForegroundColor Red
                    continue
                }
            }

            # Copier la fonction depuis backend vers supabase
            Write-Host "  - Migration de $functionName depuis backend/supabase/functions vers supabase/functions" -ForegroundColor Green
            
            try {
                Copy-Item -Path $sourcePath -Destination "supabase/functions/" -Recurse -Force -ErrorAction Stop
                Write-Host "    Migration réussie!" -ForegroundColor Green
            } catch {
                Write-Host "  - ERREUR: Impossible de copier $sourcePath vers supabase/functions" -ForegroundColor Red
                Write-Host "    $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
} else {
    Write-Host "  - Aucune fonction à migrer depuis backend/supabase/functions (dossier inexistant)" -ForegroundColor Gray
}

# 4. Migration du code partagé si nécessaire
Write-Host "4. Migration du code partagé..." -ForegroundColor Yellow

if (Test-Path "backend/supabase/shared") {
    Write-Host "  - Migration du code partagé depuis backend/supabase/shared vers supabase/shared" -ForegroundColor Green
    
    try {
        # Vérifier si le dossier de destination existe et le créer si nécessaire
        if (-not (Test-Path "supabase/shared")) {
            New-Item -ItemType Directory -Path "supabase/shared" -Force | Out-Null
        }
        
        # Copier les fichiers
        Copy-Item -Path "backend/supabase/shared/*" -Destination "supabase/shared/" -Recurse -Force -ErrorAction Stop
        Write-Host "    Migration réussie!" -ForegroundColor Green
    } catch {
        Write-Host "  - ERREUR: Impossible de copier backend/supabase/shared vers supabase/shared" -ForegroundColor Red
        Write-Host "    $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "  - Aucun code partagé à migrer depuis backend/supabase/shared (dossier inexistant)" -ForegroundColor Gray
}

# 5. Mettre à jour le README.md pour référencer le standard
Write-Host "5. Mise à jour du README.md..." -ForegroundColor Yellow

$readmePath = "README.md"
$standardLink = '## Structure du projet

Ce projet suit une structure standardisée définie dans [DOCS/architecture/structure-standard.md](DOCS/architecture/structure-standard.md).

'

if (Test-Path $readmePath) {
    $readmeContent = Get-Content -Path $readmePath -Raw
    
    # Vérifier si la référence au standard existe déjà
    if ($readmeContent -notmatch "DOCS/architecture/structure-standard.md") {
        # Ajouter la référence au début du fichier, après le premier titre
        $newContent = $readmeContent -replace "^# .*?(\r?\n)+", "$&$standardLink"
        
        try {
            Set-Content -Path $readmePath -Value $newContent -Force
            Write-Host "  - README.md mis à jour avec la référence au standard" -ForegroundColor Green
        } catch {
            Write-Host "  - ERREUR: Impossible de mettre à jour le README.md" -ForegroundColor Red
            Write-Host "    $($_.Exception.Message)" -ForegroundColor Red
        }
    } else {
        Write-Host "  - README.md contient déjà une référence au standard" -ForegroundColor Gray
    }
} else {
    # Créer un README.md minimal
    $readmeContent = "# AlloKoli

$standardLink

## À propos

AlloKoli est une plateforme de communication propulsée par l'IA, conçue pour automatiser et améliorer les interactions avec les clients.
"
    try {
        Set-Content -Path $readmePath -Value $readmeContent -Force
        Write-Host "  - README.md créé avec la référence au standard" -ForegroundColor Green
    } catch {
        Write-Host "  - ERREUR: Impossible de créer le README.md" -ForegroundColor Red
        Write-Host "    $($_.Exception.Message)" -ForegroundColor Red
    }
}

# 6. Vérification des importations et des chemins
Write-Host "6. Vérification des importations (cette étape nécessite une revue manuelle)..." -ForegroundColor Yellow
Write-Host "  - Les imports qui utilisent '../../../backend/supabase/' doivent être modifiés pour utiliser '../../../supabase/'" -ForegroundColor Gray
Write-Host "  - Cette vérification doit être faite manuellement dans les fichiers de fonctions Edge" -ForegroundColor Gray

# 7. Finalisation
Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "Migration terminée!" -ForegroundColor Green
Write-Host "Actions recommandées:" -ForegroundColor Yellow
Write-Host "1. Vérifier manuellement les imports dans les fonctions Edge" -ForegroundColor White
Write-Host "2. Tester le déploiement des fonctions Edge depuis leur nouvel emplacement" -ForegroundColor White
Write-Host "3. Supprimer le dossier backend/supabase/functions après validation complète" -ForegroundColor White
Write-Host "4. Mettre à jour les scripts CI/CD si nécessaire" -ForegroundColor White
Write-Host "------------------------------------------------" -ForegroundColor Cyan 