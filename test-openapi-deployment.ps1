# Script de test et déploiement OpenAPI AlloKoli
# Teste la spécification et propose des actions de déploiement

Write-Host "🚀 Test et Déploiement OpenAPI AlloKoli v2.0.0" -ForegroundColor Cyan
Write-Host "===================================================" -ForegroundColor Cyan

# Configuration
$specFile = "specs/allokoli-api-complete-final.yaml"
$fullSpecFile = "specs/allokoli-api-complete.yaml"

# Vérifier les prérequis
Write-Host "`n🔍 Vérification des prérequis..." -ForegroundColor Yellow

if (-not (Test-Path $specFile)) {
    Write-Host "❌ Fichier spécification introuvable: $specFile" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Spécification trouvée: $specFile" -ForegroundColor Green

# Afficher les informations de base
$fileInfo = Get-Item $specFile
Write-Host "📊 Informations fichier:" -ForegroundColor Yellow
Write-Host "  - Taille: $([math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor White
Write-Host "  - Lignes: $((Get-Content $specFile).Count)" -ForegroundColor White
Write-Host "  - Modifié: $($fileInfo.LastWriteTime)" -ForegroundColor White

# Menu des actions disponibles
Write-Host "`n🎯 Actions disponibles:" -ForegroundColor Cyan
Write-Host "1. 📖 Ouvrir dans Swagger Editor (navigateur)" -ForegroundColor Green
Write-Host "2. 🔧 Générer client TypeScript" -ForegroundColor Green
Write-Host "3. 🐍 Générer client Python" -ForegroundColor Green
Write-Host "4. ✅ Valider spécification avec outils en ligne" -ForegroundColor Green
Write-Host "5. 📋 Copier URL pour intégration" -ForegroundColor Green
Write-Host "6. 🌐 Tester endpoint /test (connectivité)" -ForegroundColor Green
Write-Host "7. 📄 Afficher résumé complet" -ForegroundColor Green
Write-Host "0. ❌ Quitter" -ForegroundColor Red

# Lire le choix utilisateur
Write-Host "`nChoisissez une action (0-7): " -NoNewline -ForegroundColor White
$choice = Read-Host

switch ($choice) {
    "1" {
        Write-Host "`n📖 Ouverture de Swagger Editor..." -ForegroundColor Cyan
        Write-Host "1. Allez sur: https://editor.swagger.io/" -ForegroundColor Yellow
        Write-Host "2. Copiez le contenu de: $specFile" -ForegroundColor Yellow
        Write-Host "3. Collez dans l'éditeur pour voir la documentation interactive" -ForegroundColor Yellow
        
        # Tenter d'ouvrir le navigateur
        try {
            Start-Process "https://editor.swagger.io/"
            Write-Host "✅ Navigateur ouvert sur Swagger Editor" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Ouvrez manuellement: https://editor.swagger.io/" -ForegroundColor Yellow
        }
    }
    
    "2" {
        Write-Host "`n🔧 Génération du client TypeScript..." -ForegroundColor Cyan
        Write-Host "Commande à exécuter:" -ForegroundColor Yellow
        Write-Host "npx @openapitools/openapi-generator-cli generate -i $specFile -g typescript-fetch -o ./generated/typescript" -ForegroundColor White
        
        $confirm = Read-Host "Exécuter maintenant? (y/N)"
        if ($confirm -eq 'y' -or $confirm -eq 'Y') {
            try {
                npx @openapitools/openapi-generator-cli generate -i $specFile -g typescript-fetch -o ./generated/typescript
                Write-Host "✅ Client TypeScript généré dans ./generated/typescript" -ForegroundColor Green
            } catch {
                Write-Host "❌ Erreur: Assurez-vous que Node.js et npm sont installés" -ForegroundColor Red
            }
        }
    }
    
    "3" {
        Write-Host "`n🐍 Génération du client Python..." -ForegroundColor Cyan
        Write-Host "Commande à exécuter:" -ForegroundColor Yellow
        Write-Host "npx @openapitools/openapi-generator-cli generate -i $specFile -g python -o ./generated/python" -ForegroundColor White
        
        $confirm = Read-Host "Exécuter maintenant? (y/N)"
        if ($confirm -eq 'y' -or $confirm -eq 'Y') {
            try {
                npx @openapitools/openapi-generator-cli generate -i $specFile -g python -o ./generated/python
                Write-Host "✅ Client Python généré dans ./generated/python" -ForegroundColor Green
            } catch {
                Write-Host "❌ Erreur: Assurez-vous que Node.js et npm sont installés" -ForegroundColor Red
            }
        }
    }
    
    "4" {
        Write-Host "`n✅ Validation en ligne de la spécification..." -ForegroundColor Cyan
        Write-Host "Outils de validation recommandés:" -ForegroundColor Yellow
        Write-Host "1. Swagger Editor: https://editor.swagger.io/" -ForegroundColor White
        Write-Host "2. OpenAPI Validator: https://apitools.dev/swagger-parser/online/" -ForegroundColor White
        Write-Host "3. Redoc Preview: https://redocly.github.io/redoc/" -ForegroundColor White
        
        try {
            Start-Process "https://editor.swagger.io/"
            Write-Host "✅ Swagger Editor ouvert pour validation" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Ouvrez manuellement les liens ci-dessus" -ForegroundColor Yellow
        }
    }
    
    "5" {
        Write-Host "`n📋 URLs pour intégration:" -ForegroundColor Cyan
        $baseUrl = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1"
        Write-Host "Base URL API: $baseUrl" -ForegroundColor White
        Write-Host "Swagger Editor: https://editor.swagger.io/" -ForegroundColor White
        Write-Host "Fichier spécification: $specFile" -ForegroundColor White
        
        # Copier l'URL de base dans le presse-papier si possible
        try {
            $baseUrl | Set-Clipboard
            Write-Host "✅ URL de base copiée dans le presse-papier" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Copiez manuellement l'URL de base" -ForegroundColor Yellow
        }
    }
    
    "6" {
        Write-Host "`n🌐 Test de connectivité endpoint /test..." -ForegroundColor Cyan
        $testUrl = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/test"
        Write-Host "URL de test: $testUrl" -ForegroundColor White
        
        try {
            $response = Invoke-RestMethod -Uri $testUrl -Method GET -TimeoutSec 10
            Write-Host "✅ Endpoint /test accessible!" -ForegroundColor Green
            Write-Host "Réponse: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Gray
        } catch {
            Write-Host "❌ Erreur de connectivité: $($_.Exception.Message)" -ForegroundColor Red
            Write-Host "⚠️  Vérifiez que le backend est en ligne" -ForegroundColor Yellow
        }
    }
    
    "7" {
        Write-Host "`n📄 Résumé complet de la spécification..." -ForegroundColor Cyan
        
        # Exécuter le script de validation
        if (Test-Path "validate-openapi.ps1") {
            & .\validate-openapi.ps1
        } else {
            Write-Host "⚠️  Script validate-openapi.ps1 non trouvé" -ForegroundColor Yellow
        }
        
        Write-Host "`n📋 Fichiers disponibles:" -ForegroundColor Cyan
        Get-ChildItem "specs/*.yaml" | ForEach-Object {
            $info = Get-Item $_.FullName
            Write-Host "  - $($_.Name): $([math]::Round($info.Length / 1KB, 2)) KB" -ForegroundColor White
        }
        
        Write-Host "`n📖 Documentation disponible:" -ForegroundColor Cyan
        Get-ChildItem "DOCS/*.md" | ForEach-Object {
            Write-Host "  - $($_.Name)" -ForegroundColor White
        }
    }
    
    "0" {
        Write-Host "`n👋 Au revoir!" -ForegroundColor Green
        exit 0
    }
    
    default {
        Write-Host "`n❌ Choix invalide. Relancez le script." -ForegroundColor Red
    }
}

Write-Host "`n🎉 Opération terminée!" -ForegroundColor Cyan
Write-Host "📚 Pour plus d'aide, consultez specs/README.md" -ForegroundColor Yellow
Write-Host "🔗 Documentation complète: DOCS/" -ForegroundColor Yellow 