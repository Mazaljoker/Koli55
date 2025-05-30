# Script simplifié pour ajouter les tools (sans webhook pour test)
# Add tools simple.ps1

Write-Host "🧪 Test de Connexion à l'API Vapi" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Yellow

# ⚠️ IMPORTANT: Remplacez par votre VRAIE clé API Vapi
# 📋 Format: vapi_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
# 🔗 Récupérez-la sur: https://dashboard.vapi.ai/api-keys
$VAPI_API_KEY = "vapi_ta-vraie-cle-ici"
$CONFIGURATOR_ASSISTANT_ID = "dca5b90b-8c26-4959-9ffd-b1abe1b42e1f"

# Vérification de configuration
if ($VAPI_API_KEY -eq "VOTRE_VRAIE_CLE_API_ICI") {
    Write-Host "`n❌ Configuration requise !" -ForegroundColor Red
    Write-Host "┌─────────────────────────────────────────────────────────────┐" -ForegroundColor Yellow
    Write-Host "│ ÉTAPES À SUIVRE :                                           │" -ForegroundColor Yellow
    Write-Host "│                                                             │" -ForegroundColor Yellow
    Write-Host "│ 1. Ouvrez https://dashboard.vapi.ai/api-keys               │" -ForegroundColor Yellow
    Write-Host "│ 2. Créez une nouvelle clé API ou copiez la bonne           │" -ForegroundColor Yellow
    Write-Host "│ 3. Dans ce script, remplacez VOTRE_VRAIE_CLE_API_ICI       │" -ForegroundColor Yellow
    Write-Host "│    par votre vraie clé API                                 │" -ForegroundColor Yellow
    Write-Host "│ 4. Réexécutez: pwsh -File add-tools-simple.ps1             │" -ForegroundColor Yellow
    Write-Host "└─────────────────────────────────────────────────────────────┘" -ForegroundColor Yellow
    exit 1
}

# Étape 1: Tester l'accès à l'assistant
Write-Host "`n📋 Étape 1: Vérification de l'assistant existant..." -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $VAPI_API_KEY"
        "Content-Type" = "application/json"
    }
    
    $assistant = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant/$CONFIGURATOR_ASSISTANT_ID" -Headers $headers
    
    Write-Host "✅ Assistant trouvé !" -ForegroundColor Green
    Write-Host "   Nom: $($assistant.name)" -ForegroundColor White
    Write-Host "   ID: $($assistant.id)" -ForegroundColor White
    Write-Host "   Tools actuels: $($assistant.tools.Count)" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur d'accès à l'assistant: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "`n🔑 Problème d'authentification détecté !" -ForegroundColor Yellow
        Write-Host "┌─────────────────────────────────────────────────────────────┐" -ForegroundColor Yellow
        Write-Host "│ Vérifiez votre clé API Vapi :                              │" -ForegroundColor Yellow
        Write-Host "│ 1. Allez sur https://dashboard.vapi.ai/api-keys            │" -ForegroundColor Yellow
        Write-Host "│ 2. Créez une nouvelle clé ou copiez la bonne               │" -ForegroundColor Yellow
        Write-Host "│ 3. Remplacez la clé dans ce script                         │" -ForegroundColor Yellow
        Write-Host "└─────────────────────────────────────────────────────────────┘" -ForegroundColor Yellow
        exit 1
    }
    
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "`n🔍 Assistant non trouvé !" -ForegroundColor Yellow
        Write-Host "L'assistant avec l'ID $CONFIGURATOR_ASSISTANT_ID n'existe pas." -ForegroundColor White
        Write-Host "Vérifiez l'ID sur votre dashboard Vapi." -ForegroundColor White
        exit 1
    }
    
    exit 1
}

# Étape 2: Ajouter SEULEMENT les tools (sans webhook)
Write-Host "`n🔧 Étape 2: Ajout des tools (sans webhook)..." -ForegroundColor Yellow

$toolsOnlyConfig = @{
    tools = @(
        @{
            type = "function"
            function = @{
                name = "analyzeBusinessContext"
                description = "Analyse le contexte business et détecte le secteur d'activité"
                parameters = @{
                    type = "object"
                    properties = @{
                        description = @{
                            type = "string"
                            description = "Description de l'entreprise"
                        }
                    }
                    required = @("description")
                }
            }
        }
        @{
            type = "function"
            function = @{
                name = "listVoicesForSector"
                description = "Recommande des voix pour un secteur donné"
                parameters = @{
                    type = "object"
                    properties = @{
                        sector = @{
                            type = "string"
                            description = "Secteur d'activité"
                        }
                    }
                    required = @("sector")
                }
            }
        }
        @{
            type = "function"
            function = @{
                name = "createCompleteAssistant"
                description = "Crée un assistant complet"
                parameters = @{
                    type = "object"
                    properties = @{
                        businessName = @{
                            type = "string"
                            description = "Nom de l'entreprise"
                        }
                        sector = @{
                            type = "string"
                            description = "Secteur d'activité"
                        }
                    }
                    required = @("businessName", "sector")
                }
            }
        }
    )
}

try {
    $jsonData = $toolsOnlyConfig | ConvertTo-Json -Depth 10
    
    Write-Host "Envoi de la configuration..." -ForegroundColor White
    $response = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant/$CONFIGURATOR_ASSISTANT_ID" -Method PATCH -Headers $headers -Body $jsonData
    
    Write-Host "✅ Tools ajoutés avec succès !" -ForegroundColor Green
    Write-Host "   Tools configurés: $($response.tools.Count)" -ForegroundColor Cyan
    
    Write-Host "`n🎉 Succès ! Prochaines étapes :" -ForegroundColor Green
    Write-Host "1. 🌐 Créer un compte Vercel (gratuit)" -ForegroundColor White
    Write-Host "2. 🚀 Déployer le frontend avec webhook" -ForegroundColor White
    Write-Host "3. 🔗 Configurer le webhook URL" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur ajout tools: $($_.Exception.Message)" -ForegroundColor Red
    
    # Afficher plus de détails sur l'erreur
    if ($_.Exception.Response) {
        $statusCode = $_.Exception.Response.StatusCode.value__
        Write-Host "Code d'erreur HTTP: $statusCode" -ForegroundColor Red
    }
}

Write-Host "`n📝 Étapes suivantes recommandées :" -ForegroundColor Cyan
Write-Host "1. Si ce test réussit → Tools sont ajoutés à l'assistant" -ForegroundColor White
Write-Host "2. Créer compte Vercel → https://vercel.com (gratuit)" -ForegroundColor White
Write-Host "3. Déployer le frontend → voir guide déploiement" -ForegroundColor White 