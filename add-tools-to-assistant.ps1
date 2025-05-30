# Script pour ajouter les tools à l'assistant Vapi configurateur
# Add tools to assistant.ps1

Write-Host "🤖 Ajout des Tools à l'Assistant Configurateur" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Yellow

# ⚠️ IMPORTANT: Remplacez YOUR_VAPI_API_KEY_HERE par votre vraie clé API Vapi
# 📋 Récupérez votre clé sur : https://dashboard.vapi.ai/api-keys
$VAPI_API_KEY = "b913fdd5-3a43-423b-aff7-2b093b7b6759"  # 👈 MODIFIEZ ICI

$CONFIGURATOR_ASSISTANT_ID = "46b73124-6624-45ab-89c7-d27ecedcb251"
$WEBHOOK_URL = "https://allokoli.vercel.app/api/vapi/webhook"

# Configuration des tools
$toolsConfig = @{
    tools = @(
        @{
            type = "function"
            function = @{
                name = "analyzeBusinessContext"
                description = "Analyse le contexte business et détecte le secteur d'activité pour recommander le template optimal"
                parameters = @{
                    type = "object"
                    properties = @{
                        description = @{
                            type = "string"
                            description = "Description de l'entreprise par l'utilisateur (activité, services, etc.)"
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
                description = "Obtient les 3 meilleures voix recommandées pour un secteur donné avec exemples audio personnalisés"
                parameters = @{
                    type = "object"
                    properties = @{
                        sector = @{
                            type = "string"
                            description = "Secteur d'activité détecté (restaurant, salon, ecommerce, artisan, service, medical)"
                        }
                        language = @{
                            type = "string"
                            description = "Code langue (fr, en, etc.)"
                            default = "fr"
                        }
                        businessName = @{
                            type = "string"
                            description = "Nom de l'entreprise pour personnaliser les exemples audio"
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
                description = "Crée l'assistant vocal final avec toute la configuration optimisée"
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
                        selectedVoice = @{
                            type = "object"
                            description = "Voix sélectionnée par l'utilisateur"
                            properties = @{
                                provider = @{ type = "string" }
                                voiceId = @{ type = "string" }
                                name = @{ type = "string" }
                            }
                            required = @("provider", "voiceId", "name")
                        }
                        template = @{
                            type = "object"
                            description = "Template de configuration sectoriel"
                            properties = @{
                                id = @{ type = "string" }
                                config = @{ type = "object" }
                            }
                            required = @("id", "config")
                        }
                        knowledgeBaseIds = @{
                            type = "array"
                            description = "IDs des bases de connaissances à associer"
                            items = @{ type = "string" }
                        }
                        customInstructions = @{
                            type = "string"
                            description = "Instructions personnalisées supplémentaires"
                        }
                        userId = @{
                            type = "string"
                            description = "ID utilisateur pour traçabilité"
                        }
                    }
                    required = @("businessName", "sector", "selectedVoice")
                }
            }
        }
    )
    
    # Configuration du webhook
    serverUrl = $WEBHOOK_URL
    serverUrlSecret = "allokoli-webhook-secret-2025"
}

# Validation des prérequis
if ($VAPI_API_KEY -eq "YOUR_VAPI_API_KEY_HERE") {
    Write-Host "`n❌ Configuration requise !" -ForegroundColor Red
    Write-Host "┌────────────────────────────────────────────────────────────┐" -ForegroundColor Yellow
    Write-Host "│ 1. Allez sur : https://dashboard.vapi.ai/api-keys         │" -ForegroundColor Yellow
    Write-Host "│ 2. Copiez votre clé API                                   │" -ForegroundColor Yellow
    Write-Host "│ 3. Remplacez YOUR_VAPI_API_KEY_HERE dans ce script        │" -ForegroundColor Yellow
    Write-Host "│ 4. Réexécutez : pwsh -File add-tools-to-assistant.ps1    │" -ForegroundColor Yellow
    Write-Host "└────────────────────────────────────────────────────────────┘" -ForegroundColor Yellow
    exit 1
}

# Conversion en JSON
$jsonData = $toolsConfig | ConvertTo-Json -Depth 10

Write-Host "Configuration des tools..." -ForegroundColor Yellow
Write-Host "Assistant ID: $CONFIGURATOR_ASSISTANT_ID" -ForegroundColor Cyan
Write-Host "Webhook URL: $WEBHOOK_URL" -ForegroundColor Cyan
Write-Host "Nombre de tools: $($toolsConfig.tools.Count)" -ForegroundColor Cyan

# Appel API Vapi
try {
    $headers = @{
        "Authorization" = "Bearer $VAPI_API_KEY"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant/$CONFIGURATOR_ASSISTANT_ID" -Method PATCH -Headers $headers -Body $jsonData
    
    Write-Host "✅ Tools ajoutés avec succès à l'assistant !" -ForegroundColor Green
    Write-Host "Assistant ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "Tools configurés: $($response.tools.Count)" -ForegroundColor Cyan
    Write-Host "Webhook configuré: $($response.serverUrl)" -ForegroundColor Cyan
    
    Write-Host "`n🎉 Configuration terminée ! Votre assistant peut maintenant :" -ForegroundColor Green
    Write-Host "✅ Analyser automatiquement le secteur d'activité" -ForegroundColor White
    Write-Host "✅ Recommander des voix adaptées" -ForegroundColor White
    Write-Host "✅ Créer des assistants personnalisés" -ForegroundColor White
    
} catch {
    Write-Host "❌ Erreur lors de l'ajout des tools: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $responseBody = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseBody)
        $responseText = $reader.ReadToEnd()
        Write-Host "Détail erreur: $responseText" -ForegroundColor Red
    }
    
    Write-Host "`n💡 Vérifiez que :" -ForegroundColor Yellow
    Write-Host "- Votre VAPI_API_KEY est correcte" -ForegroundColor White
    Write-Host "- L'assistant ID existe : $CONFIGURATOR_ASSISTANT_ID" -ForegroundColor White
    Write-Host "- Votre compte Vapi a les permissions nécessaires" -ForegroundColor White
} 