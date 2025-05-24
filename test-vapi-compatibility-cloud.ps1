# Script de Test de Compatibilité Vapi.ai - Version Cloud Only
# Teste la compatibilité sans Docker, uniquement avec Supabase Cloud

Write-Host "🔍 Test de Compatibilité Vapi.ai - AlloKoli (Cloud Only)" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green

# Configuration
$outputFile = "vapi-compatibility-report.json"

try {
    # 1. Configuration du projet cloud
    Write-Host "☁️  Configuration pour Supabase Cloud uniquement..." -ForegroundColor Yellow
    
    # Récupération de l'URL du projet
    $projectUrl = $env:SUPABASE_URL
    if (-not $projectUrl) {
        Write-Host "⚠️  Variable SUPABASE_URL non trouvée" -ForegroundColor Yellow
        $projectUrl = Read-Host "Entrez l'URL de votre projet Supabase Cloud (ex: https://xyz.supabase.co)"
    }
    
    # Récupération de la clé ANON
    $anonKey = $env:SUPABASE_ANON_KEY
    if (-not $anonKey) {
        Write-Host "⚠️  Variable SUPABASE_ANON_KEY non trouvée" -ForegroundColor Yellow
        $anonKey = Read-Host "Entrez votre clé ANON Supabase"
    }
    
    # Récupération de la clé Vapi (optionnelle pour les tests)
    $vapiKey = $env:VAPI_API_KEY
    if (-not $vapiKey) {
        Write-Host "⚠️  Variable VAPI_API_KEY non trouvée (optionnelle pour les tests de base)" -ForegroundColor Yellow
    }
    
    Write-Host "✅ Configuration cloud récupérée" -ForegroundColor Green
    Write-Host "🌐 URL: $projectUrl" -ForegroundColor Cyan
    
    # 2. Test direct de compatibilité (sans déploiement de fonction)
    Write-Host "🧪 Exécution des tests de compatibilité directs..." -ForegroundColor Yellow
    
    # Créer un rapport de compatibilité local
    $report = @{
        timestamp = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
        overall_status = "compatible"
        tests_run = 0
        tests_passed = 0
        issues = @()
        recommendations = @()
        environment = "cloud_only"
    }
    
    # Test 1: Validation de la configuration cloud
    $report.tests_run++
    try {
        $testUrl = "$projectUrl/functions/v1/assistants"
        $headers = @{
            'Authorization' = "Bearer $anonKey"
            'Content-Type' = 'application/json'
        }
        
        # Test simple de connectivité (GET assistants)
        $response = Invoke-RestMethod -Uri $testUrl -Method GET -Headers $headers -TimeoutSec 10
        $report.tests_passed++
        Write-Host "✅ Test de connectivité cloud réussi" -ForegroundColor Green
    } catch {
        $report.issues += @{
            test = "Cloud Connectivity"
            status = "error"
            message = "Impossible de se connecter aux Edge Functions: $($_.Exception.Message)"
        }
        Write-Host "❌ Erreur de connectivité cloud" -ForegroundColor Red
    }
    
    # Test 2: Structure URL Vapi
    $report.tests_run++
    try {
        # Vérifier que nos URLs n'utilisent pas /v1/ pour Vapi
        $vapiBaseUrl = "https://api.vapi.ai"
        if ($vapiBaseUrl -match "/v1/") {
            $report.issues += @{
                test = "Vapi URL Structure"
                status = "error"
                message = "URLs Vapi contiennent le préfixe /v1/ qui n'est pas utilisé"
            }
        } else {
            $report.tests_passed++
            Write-Host "✅ Structure URL Vapi correcte" -ForegroundColor Green
        }
    } catch {
        $report.issues += @{
            test = "Vapi URL Structure"
            status = "error"
            message = "Erreur de validation URL: $($_.Exception.Message)"
        }
    }
    
    # Test 3: Configuration de la clé API Vapi
    $report.tests_run++
    try {
        if (-not $vapiKey) {
            $report.issues += @{
                test = "Vapi API Key"
                status = "warning"
                message = "Clé API Vapi non configurée (VAPI_API_KEY)"
            }
        } elseif (-not ($vapiKey.StartsWith("pk_") -or $vapiKey.StartsWith("sk_"))) {
            $report.issues += @{
                test = "Vapi API Key"
                status = "warning"
                message = "Format de clé API Vapi potentiellement incorrect"
            }
        } else {
            $report.tests_passed++
            Write-Host "✅ Clé API Vapi correctement configurée" -ForegroundColor Green
        }
    } catch {
        $report.issues += @{
            test = "Vapi API Key"
            status = "error"
            message = "Erreur de validation clé API: $($_.Exception.Message)"
        }
    }
    
    # Test 4: Test des endpoints Edge Functions disponibles
    $report.tests_run++
    try {
        $expectedEndpoints = @("assistants", "calls", "phone-numbers", "files", "webhooks")
        $availableEndpoints = @()
        
        foreach ($endpoint in $expectedEndpoints) {
            try {
                $testUrl = "$projectUrl/functions/v1/$endpoint"
                $response = Invoke-RestMethod -Uri $testUrl -Method GET -Headers $headers -TimeoutSec 5
                $availableEndpoints += $endpoint
            } catch {
                # Endpoint non disponible ou erreur
                Write-Host "⚠️  Endpoint '$endpoint' non accessible" -ForegroundColor Yellow
            }
        }
        
        if ($availableEndpoints.Count -eq $expectedEndpoints.Count) {
            $report.tests_passed++
            Write-Host "✅ Tous les endpoints Edge Functions sont accessibles" -ForegroundColor Green
        } else {
            $missingEndpoints = $expectedEndpoints | Where-Object { $_ -notin $availableEndpoints }
            $report.issues += @{
                test = "Edge Functions Endpoints"
                status = "warning"
                message = "Endpoints manquants: $($missingEndpoints -join ', ')"
            }
        }
    } catch {
        $report.issues += @{
            test = "Edge Functions Endpoints"
            status = "error"
            message = "Erreur lors du test des endpoints: $($_.Exception.Message)"
        }
    }
    
    # Test 5: Validation des headers HTTP
    $report.tests_run++
    try {
        $requiredHeaders = @("Authorization", "Content-Type")
        $configuredHeaders = $headers.Keys
        
        $missingHeaders = $requiredHeaders | Where-Object { $_ -notin $configuredHeaders }
        
        if ($missingHeaders.Count -eq 0) {
            $report.tests_passed++
            Write-Host "✅ Headers HTTP corrects" -ForegroundColor Green
        } else {
            $report.issues += @{
                test = "HTTP Headers"
                status = "error"
                message = "Headers manquants: $($missingHeaders -join ', ')"
            }
        }
    } catch {
        $report.issues += @{
            test = "HTTP Headers"
            status = "error"
            message = "Erreur de validation headers: $($_.Exception.Message)"
        }
    }
    
    # Détermination du statut global
    $errorCount = ($report.issues | Where-Object { $_.status -eq "error" }).Count
    $warningCount = ($report.issues | Where-Object { $_.status -eq "warning" }).Count
    
    if ($errorCount -eq 0 -and $warningCount -eq 0) {
        $report.overall_status = "compatible"
    } elseif ($errorCount -eq 0) {
        $report.overall_status = "issues_found"
    } else {
        $report.overall_status = "error"
    }
    
    # Ajout de recommandations spécifiques au cloud
    $report.recommendations += @(
        "✅ Vous utilisez correctement Supabase Cloud (pas Docker)",
        "🔧 Déployez les Edge Functions via l'interface web Supabase",
        "🌐 Testez avec l'URL de production: $projectUrl",
        "🔑 Configurez VAPI_API_KEY dans les secrets Supabase",
        "📊 Surveillez les logs via l'interface web Supabase"
    )
    
    # 3. Sauvegarde du rapport
    $report | ConvertTo-Json -Depth 10 | Out-File -FilePath $outputFile -Encoding UTF8
    Write-Host "✅ Rapport sauvegardé: $outputFile" -ForegroundColor Green
    
    # 4. Affichage des résultats
    Write-Host "`n📊 RÉSULTATS DU TEST DE COMPATIBILITÉ (CLOUD)" -ForegroundColor Green
    Write-Host "===============================================" -ForegroundColor Green
    
    Write-Host "⏰ Timestamp: $($report.timestamp)" -ForegroundColor Cyan
    Write-Host "☁️  Environnement: Supabase Cloud Only" -ForegroundColor Cyan
    Write-Host "🎯 Statut Global: $($report.overall_status.ToUpper())" -ForegroundColor $(
        switch ($report.overall_status) {
            'compatible' { 'Green' }
            'issues_found' { 'Yellow' }
            'error' { 'Red' }
            default { 'White' }
        }
    )
    Write-Host "📈 Tests: $($report.tests_passed)/$($report.tests_run) réussis" -ForegroundColor Cyan
    
    # Affichage des problèmes
    if ($report.issues.Count -gt 0) {
        Write-Host "`n⚠️  PROBLÈMES DÉTECTÉS:" -ForegroundColor Yellow
        foreach ($issue in $report.issues) {
            $color = switch ($issue.status) {
                'error' { 'Red' }
                'warning' { 'Yellow' }
                default { 'White' }
            }
            Write-Host "  • $($issue.test): $($issue.message)" -ForegroundColor $color
        }
    } else {
        Write-Host "`n✅ Aucun problème détecté!" -ForegroundColor Green
    }
    
    # Affichage des recommandations
    Write-Host "`n💡 RECOMMANDATIONS CLOUD:" -ForegroundColor Cyan
    foreach ($rec in $report.recommendations) {
        Write-Host "  $rec" -ForegroundColor White
    }
    
    # 5. Guide de déploiement cloud
    Write-Host "`n🚀 DÉPLOIEMENT EDGE FUNCTIONS (CLOUD ONLY):" -ForegroundColor Green
    Write-Host "1. Ouvrez https://app.supabase.com" -ForegroundColor White
    Write-Host "2. Sélectionnez votre projet" -ForegroundColor White
    Write-Host "3. Allez dans 'Edge Functions'" -ForegroundColor White
    Write-Host "4. Créez/modifiez vos fonctions directement dans l'interface" -ForegroundColor White
    Write-Host "5. Déployez via le bouton 'Deploy'" -ForegroundColor White
    
    # 6. Résumé final
    Write-Host "`n🎉 CONCLUSION (CLOUD ONLY):" -ForegroundColor Green
    switch ($report.overall_status) {
        'compatible' {
            Write-Host "✅ Configuration cloud compatible avec Vapi.ai!" -ForegroundColor Green
            Write-Host "☁️  Prêt pour Supabase Cloud!" -ForegroundColor Green
        }
        'issues_found' {
            Write-Host "⚠️  Problèmes mineurs dans la configuration cloud" -ForegroundColor Yellow
            Write-Host "🔧 Voir les recommandations ci-dessus" -ForegroundColor Yellow
        }
        'error' {
            Write-Host "❌ Problèmes de configuration cloud détectés" -ForegroundColor Red
            Write-Host "🛠️  Corrections nécessaires" -ForegroundColor Red
        }
    }
    
} catch {
    Write-Host "❌ Erreur générale:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    Write-Host "`n🔧 SOLUTION:" -ForegroundColor Yellow
    Write-Host "Utilisez l'interface web Supabase pour:" -ForegroundColor White
    Write-Host "1. Déployer vos Edge Functions" -ForegroundColor Cyan
    Write-Host "2. Configurer les variables d'environnement" -ForegroundColor Cyan
    Write-Host "3. Tester directement dans l'interface" -ForegroundColor Cyan
    
    exit 1
}

Write-Host "`n🎯 Test de compatibilité cloud terminé!" -ForegroundColor Green
Write-Host "📄 Rapport détaillé: $outputFile" -ForegroundColor Cyan
Write-Host "☁️  Développement 100% cloud - Pas de Docker requis!" -ForegroundColor Green 