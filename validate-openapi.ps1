# Script de validation OpenAPI pour AlloKoli
# Vérifie la spécification OpenAPI et extrait des informations

Write-Host "🔍 Validation de la spécification OpenAPI AlloKoli" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Vérifier l'existence du fichier
$specFile = "specs/allokoli-api-complete.yaml"
if (-not (Test-Path $specFile)) {
    Write-Host "❌ Fichier non trouvé: $specFile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Fichier trouvé: $specFile" -ForegroundColor Green

# Obtenir des informations sur le fichier
$fileInfo = Get-Item $specFile
Write-Host "📄 Taille du fichier: $([math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor Yellow
Write-Host "📅 Dernière modification: $($fileInfo.LastWriteTime)" -ForegroundColor Yellow

# Compter les lignes
$lineCount = (Get-Content $specFile).Count
Write-Host "📏 Nombre de lignes: $lineCount" -ForegroundColor Yellow

# Analyser le contenu pour extraire des informations clés
$content = Get-Content $specFile -Raw

# Compter les endpoints (paths)
$pathMatches = [regex]::Matches($content, '^\s*\/[^:]*:')
Write-Host "🎯 Endpoints détectés: $($pathMatches.Count)" -ForegroundColor Green

# Compter les méthodes HTTP
$httpMethods = @('get:', 'post:', 'patch:', 'delete:', 'put:')
$totalMethods = 0
foreach ($method in $httpMethods) {
    $matches = [regex]::Matches($content, "^\s*$method", [System.Text.RegularExpressions.RegexOptions]::Multiline)
    $count = $matches.Count
    $totalMethods += $count
    Write-Host "  - $($method.TrimEnd(':').ToUpper()): $count" -ForegroundColor Gray
}
Write-Host "🔧 Total méthodes HTTP: $totalMethods" -ForegroundColor Green

# Vérifier les tags principaux
$tags = @('Assistants', 'Knowledge Bases', 'Calls', 'Phone Numbers', 'Files', 'Analytics', 'Webhooks', 'Workflows', 'Squads', 'Functions', 'Test Suites', 'System')
Write-Host "🏷️  Services documentés:" -ForegroundColor Green
foreach ($tag in $tags) {
    if ($content -match "tags:\s*\[$tag\]" -or $content -match "- $tag") {
        Write-Host "  ✅ $tag" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $tag" -ForegroundColor Red
    }
}

# Vérifier la structure OpenAPI de base
$requiredSections = @('openapi:', 'info:', 'servers:', 'paths:', 'components:')
Write-Host "🔍 Structure OpenAPI:" -ForegroundColor Green
foreach ($section in $requiredSections) {
    if ($content -match $section) {
        Write-Host "  ✅ $section" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $section" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Validation terminée!" -ForegroundColor Cyan
Write-Host "📋 Résumé:" -ForegroundColor Yellow
Write-Host "  - Fichier: $specFile" -ForegroundColor White
Write-Host "  - Taille: $([math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor White
Write-Host "  - Lignes: $lineCount" -ForegroundColor White
Write-Host "  - Endpoints: $($pathMatches.Count)" -ForegroundColor White
Write-Host "  - Méthodes HTTP: $totalMethods" -ForegroundColor White

# Comparer avec l'ancienne version si elle existe
$oldSpecFile = "specs/allokoli-api.yaml"
if (Test-Path $oldSpecFile) {
    $oldFileInfo = Get-Item $oldSpecFile
    $oldLineCount = (Get-Content $oldSpecFile).Count
    $oldContent = Get-Content $oldSpecFile -Raw
    $oldPathMatches = [regex]::Matches($oldContent, '^\s*\/[^:]*:')
    
    Write-Host "`n📊 Comparaison avec l'ancienne version:" -ForegroundColor Cyan
    Write-Host "  Ancienne: $([math]::Round($oldFileInfo.Length / 1KB, 2)) KB, $oldLineCount lignes, $($oldPathMatches.Count) endpoints" -ForegroundColor Gray
    Write-Host "  Nouvelle: $([math]::Round($fileInfo.Length / 1KB, 2)) KB, $lineCount lignes, $($pathMatches.Count) endpoints" -ForegroundColor Green
    Write-Host "  Amélioration: +$([math]::Round(($fileInfo.Length - $oldFileInfo.Length) / 1KB, 2)) KB, +$($lineCount - $oldLineCount) lignes, +$($pathMatches.Count - $oldPathMatches.Count) endpoints" -ForegroundColor Yellow
} 