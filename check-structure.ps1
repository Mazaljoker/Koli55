# check-structure.ps1
# Script pour vérifier la conformité du projet avec la structure standard définie

Write-Host "=== VÉRIFICATION DE LA STRUCTURE DU PROJET ALLOKOLI ===" -ForegroundColor Cyan
Write-Host "Analyse de la conformité avec le standard défini dans DOCS/architecture/structure-standard.md" -ForegroundColor Cyan
Write-Host "------------------------------------------------" -ForegroundColor Cyan

$issues = @()
$warnings = @()
$conformity = 100 # Pourcentage de conformité initial

# 1. Vérifier l'existence des dossiers principaux
Write-Host "1. Vérification des dossiers principaux..." -ForegroundColor Yellow
$mainDirs = @("frontend", "supabase", "backend", "DOCS")

foreach ($dir in $mainDirs) {
    if (-not (Test-Path $dir)) {
        $issues += "Dossier principal '$dir' manquant"
        $conformity -= 10
    }
}

# 2. Vérifier les sous-dossiers critiques
Write-Host "2. Vérification des sous-dossiers critiques..." -ForegroundColor Yellow
$criticalDirs = @(
    "frontend/app",
    "frontend/components",
    "frontend/lib",
    "supabase/functions",
    "supabase/shared"
)

foreach ($dir in $criticalDirs) {
    if (-not (Test-Path $dir)) {
        $warnings += "Sous-dossier critique '$dir' manquant"
        $conformity -= 5
    }
}

# 3. Vérifier s'il y a des fonctions Edge au mauvais endroit
Write-Host "3. Vérification de l'emplacement des fonctions Edge..." -ForegroundColor Yellow
$wrongEdgeFunctions = $false

if (Test-Path "backend/supabase/functions") {
    $backendFunctions = Get-ChildItem -Path "backend/supabase/functions" -Directory
    
    if ($backendFunctions.Count -gt 0) {
        $wrongEdgeFunctions = $true
        $functionsList = $backendFunctions.Name -join ", "
        $issues += "Fonctions Edge trouvées dans 'backend/supabase/functions': $functionsList"
        $conformity -= 15
    }
}

# 4. Vérifier s'il y a du code partagé au mauvais endroit
Write-Host "4. Vérification de l'emplacement du code partagé..." -ForegroundColor Yellow
$wrongShared = $false

if (Test-Path "backend/supabase/shared") {
    $backendShared = Get-ChildItem -Path "backend/supabase/shared" -File
    
    if ($backendShared.Count -gt 0) {
        $wrongShared = $true
        $sharedList = $backendShared.Name -join ", "
        $issues += "Code partagé trouvé dans 'backend/supabase/shared': $sharedList"
        $conformity -= 10
    }
}

# 5. Vérifier si le README fait référence au standard
Write-Host "5. Vérification de la référence au standard dans le README..." -ForegroundColor Yellow
$readmeRefersToStandard = $false

if (Test-Path "README.md") {
    $readmeContent = Get-Content -Path "README.md" -Raw
    
    if ($readmeContent -match "DOCS/architecture/structure-standard.md") {
        $readmeRefersToStandard = $true
    } else {
        $warnings += "Le README.md ne fait pas référence au standard"
        $conformity -= 5
    }
} else {
    $warnings += "README.md manquant"
    $conformity -= 5
}

# 6. Vérifier si le standard existe
Write-Host "6. Vérification de l'existence du document de standard..." -ForegroundColor Yellow
if (-not (Test-Path "DOCS/architecture/structure-standard.md")) {
    $issues += "Le document de standard 'DOCS/architecture/structure-standard.md' est manquant"
    $conformity -= 10
}

# 7. Afficher les résultats
Write-Host "------------------------------------------------" -ForegroundColor Cyan
Write-Host "RÉSULTATS DE L'ANALYSE:" -ForegroundColor White

# Limiter la conformité entre 0 et 100%
$conformity = [Math]::Max(0, [Math]::Min(100, $conformity))

# Définir la couleur en fonction du pourcentage de conformité
$conformityColor = "Red"
if ($conformity -ge 80) {
    $conformityColor = "Green"
} elseif ($conformity -ge 50) {
    $conformityColor = "Yellow"
}

Write-Host "Taux de conformité au standard: " -NoNewline
Write-Host "$conformity%" -ForegroundColor $conformityColor

if ($issues.Count -gt 0) {
    Write-Host "`nPROBLÈMES CRITIQUES:" -ForegroundColor Red
    foreach ($issue in $issues) {
        Write-Host "- $issue" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "`nAVERTISSEMENTS:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "- $warning" -ForegroundColor Yellow
    }
}

if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "`nFÉLICITATIONS! Votre projet est entièrement conforme au standard." -ForegroundColor Green
} else {
    Write-Host "`nACTIONS RECOMMANDÉES:" -ForegroundColor Cyan
    
    if ($wrongEdgeFunctions) {
        Write-Host "- Exécuter ./migrate-standard.ps1 pour migrer les fonctions Edge vers l'emplacement correct" -ForegroundColor White
    }
    
    if ($wrongShared) {
        Write-Host "- Exécuter ./migrate-standard.ps1 pour migrer le code partagé vers l'emplacement correct" -ForegroundColor White
    }
    
    if (-not $readmeRefersToStandard) {
        Write-Host "- Mettre à jour le README.md pour référencer le document standard" -ForegroundColor White
    }
}

Write-Host "------------------------------------------------" -ForegroundColor Cyan 