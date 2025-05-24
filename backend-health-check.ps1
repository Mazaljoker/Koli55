Write-Host "=== Vérification de la santé du backend AlloKoli ===" -ForegroundColor Green

# Variables de configuration
$PROJECT_REF = "aiurboizarbbcpynmmgv"
$BASE_URL = "https://$PROJECT_REF.supabase.co/functions/v1"
$AUTH_TOKEN = "Bearer $env:NEXT_PUBLIC_SUPABASE_ANON_KEY"

$headers = @{
    "Authorization" = $AUTH_TOKEN
    "Content-Type" = "application/json"
    "x-test-mode" = "true"
}

$testResults = @()

# Fonction pour tester un endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$ExpectedField = "success"
    )
    
    try {
        Write-Host "Testing $Name..." -NoNewline
        $response = Invoke-RestMethod -Uri $Url -Method GET -Headers $headers -TimeoutSec 10
        
        if ($response.$ExpectedField) {
            Write-Host " ✅ OK" -ForegroundColor Green
            return @{ Name = $Name; Status = "OK"; Message = "Endpoint accessible" }
        } else {
            Write-Host " ⚠️ WARNING" -ForegroundColor Yellow
            return @{ Name = $Name; Status = "WARNING"; Message = "Réponse inattendue" }
        }
    }
    catch {
        Write-Host " ❌ ERROR" -ForegroundColor Red
        return @{ Name = $Name; Status = "ERROR"; Message = $_.Exception.Message }
    }
}

Write-Host "`n1. Test des Edge Functions principales:" -ForegroundColor Cyan

# Tests des endpoints principaux
$endpoints = @(
    @{ Name = "Test Function"; Url = "$BASE_URL/test" },
    @{ Name = "Assistants"; Url = "$BASE_URL/assistants" },
    @{ Name = "Phone Numbers"; Url = "$BASE_URL/phone-numbers" },
    @{ Name = "Calls"; Url = "$BASE_URL/calls" },
    @{ Name = "Knowledge Bases"; Url = "$BASE_URL/knowledge-bases" },
    @{ Name = "Files"; Url = "$BASE_URL/files" },
    @{ Name = "Workflows"; Url = "$BASE_URL/workflows" },
    @{ Name = "Squads"; Url = "$BASE_URL/squads" },
    @{ Name = "Functions"; Url = "$BASE_URL/functions" },
    @{ Name = "Test Suites"; Url = "$BASE_URL/test-suites" },
    @{ Name = "Analytics"; Url = "$BASE_URL/analytics" },
    @{ Name = "Webhooks"; Url = "$BASE_URL/webhooks" }
)

foreach ($endpoint in $endpoints) {
    $testResults += Test-Endpoint -Name $endpoint.Name -Url $endpoint.Url
}

Write-Host "`n2. Test de compatibilité Vapi:" -ForegroundColor Cyan
try {
    Write-Host "Testing Vapi Compatibility..." -NoNewline
    $vapiTest = Invoke-RestMethod -Uri "$BASE_URL/test-vapi-compatibility" -Method POST -Headers $headers -TimeoutSec 15
    
    if ($vapiTest.overall_status -eq "compatible") {
        Write-Host " ✅ COMPATIBLE" -ForegroundColor Green
        $testResults += @{ Name = "Vapi Compatibility"; Status = "OK"; Message = "Fully compatible" }
    } elseif ($vapiTest.overall_status -eq "issues_found") {
        Write-Host " ⚠️ ISSUES FOUND" -ForegroundColor Yellow
        $testResults += @{ Name = "Vapi Compatibility"; Status = "WARNING"; Message = "$($vapiTest.issues.Count) issues found" }
    } else {
        Write-Host " ❌ ERROR" -ForegroundColor Red
        $testResults += @{ Name = "Vapi Compatibility"; Status = "ERROR"; Message = "Compatibility test failed" }
    }
}
catch {
    Write-Host " ❌ ERROR" -ForegroundColor Red
    $testResults += @{ Name = "Vapi Compatibility"; Status = "ERROR"; Message = $_.Exception.Message }
}

Write-Host "`n3. Vérification du projet Supabase:" -ForegroundColor Cyan
try {
    Write-Host "Checking Supabase project status..." -NoNewline
    $projectStatus = supabase projects list --output json | ConvertFrom-Json
    $project = $projectStatus | Where-Object { $_.id -eq $PROJECT_REF }
    
    if ($project -and $project.status -eq "ACTIVE_HEALTHY") {
        Write-Host " ✅ HEALTHY" -ForegroundColor Green
        $testResults += @{ Name = "Supabase Project"; Status = "OK"; Message = "Project is active and healthy" }
    } else {
        Write-Host " ⚠️ WARNING" -ForegroundColor Yellow
        $testResults += @{ Name = "Supabase Project"; Status = "WARNING"; Message = "Project status: $($project.status)" }
    }
}
catch {
    Write-Host " ❌ ERROR" -ForegroundColor Red
    $testResults += @{ Name = "Supabase Project"; Status = "ERROR"; Message = "Cannot check project status" }
}

Write-Host "`n4. Vérification des Edge Functions déployées:" -ForegroundColor Cyan
try {
    Write-Host "Checking deployed Edge Functions..." -NoNewline
    $functions = supabase functions list --project-ref $PROJECT_REF --output json | ConvertFrom-Json
    
    if ($functions.Count -ge 10) {
        Write-Host " ✅ OK ($($functions.Count) functions)" -ForegroundColor Green
        $testResults += @{ Name = "Edge Functions"; Status = "OK"; Message = "$($functions.Count) functions deployed" }
    } else {
        Write-Host " ⚠️ WARNING" -ForegroundColor Yellow
        $testResults += @{ Name = "Edge Functions"; Status = "WARNING"; Message = "Only $($functions.Count) functions deployed" }
    }
}
catch {
    Write-Host " ❌ ERROR" -ForegroundColor Red
    $testResults += @{ Name = "Edge Functions"; Status = "ERROR"; Message = "Cannot list functions" }
}

# Résumé final
Write-Host "`n=== RÉSUMÉ DES TESTS ===" -ForegroundColor Green

$okCount = ($testResults | Where-Object { $_.Status -eq "OK" }).Count
$warningCount = ($testResults | Where-Object { $_.Status -eq "WARNING" }).Count
$errorCount = ($testResults | Where-Object { $_.Status -eq "ERROR" }).Count

Write-Host "✅ OK: $okCount" -ForegroundColor Green
Write-Host "⚠️ WARNING: $warningCount" -ForegroundColor Yellow
Write-Host "❌ ERROR: $errorCount" -ForegroundColor Red

if ($errorCount -eq 0 -and $warningCount -eq 0) {
    Write-Host "`n🎉 BACKEND 100% OPÉRATIONNEL!" -ForegroundColor Green
    Write-Host "Tous les services fonctionnent correctement." -ForegroundColor Green
} elseif ($errorCount -eq 0) {
    Write-Host "`n✅ BACKEND OPÉRATIONNEL AVEC AVERTISSEMENTS" -ForegroundColor Yellow
    Write-Host "Le backend fonctionne mais certains points nécessitent attention." -ForegroundColor Yellow
} else {
    Write-Host "`n❌ PROBLÈMES DÉTECTÉS DANS LE BACKEND" -ForegroundColor Red
    Write-Host "Des erreurs critiques nécessitent une intervention." -ForegroundColor Red
}

# Détails des problèmes si nécessaires
if ($warningCount -gt 0 -or $errorCount -gt 0) {
    Write-Host "`nDétails des problèmes:" -ForegroundColor Cyan
    foreach ($result in $testResults | Where-Object { $_.Status -ne "OK" }) {
        $color = if ($result.Status -eq "WARNING") { "Yellow" } else { "Red" }
        Write-Host "- $($result.Name): $($result.Message)" -ForegroundColor $color
