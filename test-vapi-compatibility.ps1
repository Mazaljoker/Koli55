# Script de Test de Compatibilité Vapi.ai
# Teste la compatibilité de nos Edge Functions avec l'API Vapi officielle

Write-Host "🔍 Test de Compatibilité Vapi.ai - AlloKoli" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green

# Configuration
$functionName = "test-vapi-compatibility"
$outputFile = "vapi-compatibility-report.json"

try {
    # 1. Vérification des prérequis
    Write-Host "📋 Vérification des prérequis..." -ForegroundColor Yellow
    
    # Vérifier si Supabase CLI est installé
    $supabaseCmd = Get-Command supabase -ErrorAction SilentlyContinue
    if (-not $supabaseCmd) {
        Write-Host "❌ Supabase CLI n'est pas installé ou pas dans le PATH" -ForegroundColor Red
        Write-Host "💡 Installez avec: npm install -g supabase" -ForegroundColor Cyan
        exit 1
    }
    
    Write-Host "✅ Supabase CLI détecté: $($supabaseCmd.Version)" -ForegroundColor Green
    
    # 2. Déploiement de la fonction de test
    Write-Host "🚀 Déploiement de la fonction de test..." -ForegroundColor Yellow
    
    $deployResult = supabase functions deploy $functionName 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Erreur lors du déploiement:" -ForegroundColor Red
        Write-Host $deployResult -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ Fonction déployée avec succès" -ForegroundColor Green
    
    # 3. Attendre que la fonction soit disponible
    Write-Host "⏳ Attente de la disponibilité (5 secondes)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 5
    
    # 4. Récupération de l'URL du projet Supabase
    Write-Host "🔗 Récupération de la configuration Supabase..." -ForegroundColor Yellow
    
    # Essayer de lire le fichier de configuration
    $configFile = ".\.supabase\config.toml"
    $projectUrl = $null
    
    if (Test-Path $configFile) {
        $configContent = Get-Content $configFile -Raw
        if ($configContent -match 'project_id\s*=\s*"([^"]+)"') {
            $projectId = $matches[1]
            $projectUrl = "https://$projectId.supabase.co"
            Write-Host "✅ URL du projet: $projectUrl" -ForegroundColor Green
        }
    }
    
    if (-not $projectUrl) {
        Write-Host "⚠️  Impossible de détecter l'URL automatiquement" -ForegroundColor Yellow
        $projectUrl = Read-Host "Entrez l'URL de votre projet Supabase (ex: https://xyz.supabase.co)"
    }
    
    # 5. Récupération de la clé ANON
    $anonKey = $env:SUPABASE_ANON_KEY
    if (-not $anonKey) {
        Write-Host "⚠️  Variable SUPABASE_ANON_KEY non trouvée" -ForegroundColor Yellow
        $anonKey = Read-Host "Entrez votre clé ANON Supabase"
    }
    
    # 6. Exécution du test de compatibilité
    Write-Host "🧪 Exécution des tests de compatibilité..." -ForegroundColor Yellow
    
    $testUrl = "$projectUrl/functions/v1/$functionName"
    $headers = @{
        'Authorization' = "Bearer $anonKey"
        'Content-Type' = 'application/json'
    }
    
    Write-Host "📡 URL de test: $testUrl" -ForegroundColor Cyan
    
    try {
        $response = Invoke-RestMethod -Uri $testUrl -Method POST -Headers $headers -TimeoutSec 30
        
        # 7. Sauvegarde du rapport
        $response | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputFile -Encoding UTF8
        Write-Host "✅ Rapport sauvegardé: $outputFile" -ForegroundColor Green
        
        # 8. Affichage des résultats
        Write-Host "`n📊 RÉSULTATS DU TEST DE COMPATIBILITÉ" -ForegroundColor Green
        Write-Host "=====================================" -ForegroundColor Green
        
        Write-Host "⏰ Timestamp: $($response.timestamp)" -ForegroundColor Cyan
        Write-Host "🎯 Statut Global: $($response.overall_status.ToUpper())" -ForegroundColor $(
            switch ($response.overall_status) {
                'compatible' { 'Green' }
                'issues_found' { 'Yellow' }
                'error' { 'Red' }
                default { 'White' }
            }
        )
        Write-Host "📈 Tests: $($response.tests_passed)/$($response.tests_run) réussis" -ForegroundColor Cyan
        
        # Affichage des problèmes s'il y en a
        if ($response.issues -and $response.issues.Count -gt 0) {
            Write-Host "`n⚠️  PROBLÈMES DÉTECTÉS:" -ForegroundColor Yellow
            foreach ($issue in $response.issues) {
                $color = if ($issue.status -eq 'error') { 'Red' } else { 'Yellow' }
                Write-Host "  • $($issue.test): $($issue.message)" -ForegroundColor $color
            }
        } else {
            Write-Host "`n✅ Aucun problème détecté!" -ForegroundColor Green
        }
        
        # Affichage des recommandations
        if ($response.recommendations -and $response.recommendations.Count -gt 0) {
            Write-Host "`n💡 RECOMMANDATIONS:" -ForegroundColor Cyan
            foreach ($rec in $response.recommendations) {
                Write-Host "  • $rec" -ForegroundColor White
            }
        }
        
        # 9. Résumé final
        Write-Host "`n🎉 CONCLUSION:" -ForegroundColor Green
        switch ($response.overall_status) {
            'compatible' {
                Write-Host "✅ Votre backend est 100% compatible avec Vapi.ai!" -ForegroundColor Green
                Write-Host "🚀 Prêt pour la production!" -ForegroundColor Green
            }
            'issues_found' {
                Write-Host "⚠️  Problèmes mineurs détectés mais fonctionnel" -ForegroundColor Yellow
                Write-Host "🔧 Voir les recommandations ci-dessus" -ForegroundColor Yellow
            }
            'error' {
                Write-Host "❌ Problèmes critiques détectés" -ForegroundColor Red
                Write-Host "🛠️  Corrections nécessaires avant production" -ForegroundColor Red
            }
        }
        
    } catch {
        Write-Host "❌ Erreur lors de l'exécution du test:" -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
        
        # Suggestions de débogage
        Write-Host "`n🔧 DÉBOGAGE:" -ForegroundColor Yellow
        Write-Host "1. Vérifiez que la fonction est bien déployée:" -ForegroundColor White
        Write-Host "   supabase functions list" -ForegroundColor Cyan
        Write-Host "2. Vérifiez les logs de la fonction:" -ForegroundColor White
        Write-Host "   supabase functions logs $functionName" -ForegroundColor Cyan
        Write-Host "3. Vérifiez votre configuration Supabase:" -ForegroundColor White
        Write-Host "   supabase status" -ForegroundColor Cyan
        
        exit 1
    }
    
} catch {
    Write-Host "❌ Erreur générale:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

Write-Host "`n🎯 Test de compatibilité terminé!" -ForegroundColor Green
Write-Host "📄 Rapport détaillé disponible dans: $outputFile" -ForegroundColor Cyan 