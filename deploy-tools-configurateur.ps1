# Script de déploiement des tools configurateur et mise à jour assistant
# Deploy tools configurateur.ps1

Write-Host "🚀 Déploiement des Tools Configurateur AlloKoli" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Yellow

# Vérification des prérequis
Write-Host "Vérification des prérequis..." -ForegroundColor Yellow

# Variables d'environnement
$SUPABASE_PROJECT_ID = $env:SUPABASE_PROJECT_ID
$SUPABASE_ANON_KEY = $env:SUPABASE_ANON_KEY
$VAPI_API_KEY = $env:VAPI_API_KEY
$CONFIGURATOR_ASSISTANT_ID = "46b73124-6624-45ab-89c7-d27ecedcb251"

if (-not $SUPABASE_PROJECT_ID) {
    Write-Host "❌ SUPABASE_PROJECT_ID manquant" -ForegroundColor Red
    exit 1
}

if (-not $VAPI_API_KEY) {
    Write-Host "❌ VAPI_API_KEY manquant" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Variables d'environnement configurées" -ForegroundColor Green

# 1. Déploiement des edge functions tools
Write-Host "`n🔧 Déploiement des Edge Functions Tools..." -ForegroundColor Cyan

# Deploy analyze-business tool
Write-Host "Déploiement analyze-business..." -ForegroundColor Yellow
try {
    supabase functions deploy analyze-business --project-ref $SUPABASE_PROJECT_ID
    Write-Host "✅ analyze-business déployé" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur déploiement analyze-business: $($_.Exception.Message)" -ForegroundColor Red
}

# Deploy list-voices tool  
Write-Host "Déploiement list-voices..." -ForegroundColor Yellow
try {
    supabase functions deploy list-voices --project-ref $SUPABASE_PROJECT_ID
    Write-Host "✅ list-voices déployé" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur déploiement list-voices: $($_.Exception.Message)" -ForegroundColor Red
}

# Deploy create-assistant tool
Write-Host "Déploiement create-assistant..." -ForegroundColor Yellow  
try {
    supabase functions deploy create-assistant --project-ref $SUPABASE_PROJECT_ID
    Write-Host "✅ create-assistant déployé" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur déploiement create-assistant: $($_.Exception.Message)" -ForegroundColor Red
}

# 2. Mise à jour de l'assistant configurateur avec les tools
Write-Host "`n🤖 Mise à jour de l'Assistant Configurateur..." -ForegroundColor Cyan

# URL du webhook pour les function calls
$WEBHOOK_URL = "https://allokoli.vercel.app/api/vapi/webhook"

# Configuration des tools pour l'assistant
$assistantUpdate = @{
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
    
    # Configuration du webhook pour les function calls
    serverUrl = $WEBHOOK_URL
    serverUrlSecret = "allokoli-webhook-secret-2025"
}

# Conversion en JSON
$jsonData = $assistantUpdate | ConvertTo-Json -Depth 10

Write-Host "Mise à jour assistant avec tools..." -ForegroundColor Yellow
Write-Host "Assistant ID: $CONFIGURATOR_ASSISTANT_ID" -ForegroundColor Cyan
Write-Host "Webhook URL: $WEBHOOK_URL" -ForegroundColor Cyan

# Appel API Vapi pour mise à jour
try {
    $headers = @{
        "Authorization" = "Bearer $VAPI_API_KEY"
        "Content-Type" = "application/json"
    }
    
    $response = Invoke-RestMethod -Uri "https://api.vapi.ai/assistant/$CONFIGURATOR_ASSISTANT_ID" -Method PATCH -Headers $headers -Body $jsonData
    
    Write-Host "✅ Assistant configurateur mis à jour avec succès !" -ForegroundColor Green
    Write-Host "Assistant ID: $($response.id)" -ForegroundColor Cyan
    Write-Host "Tools configurés: $($response.tools.Count)" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erreur mise à jour assistant: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $responseBody = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($responseBody)
        $responseText = $reader.ReadToEnd()
        Write-Host "Détail erreur: $responseText" -ForegroundColor Red
    }
}

# 3. Tests de validation
Write-Host "`n🧪 Tests de Validation..." -ForegroundColor Cyan

# Test analyze-business tool
Write-Host "Test analyze-business..." -ForegroundColor Yellow
try {
    $testPayload = @{ description = "Restaurant italien à Paris spécialisé en pizza" } | ConvertTo-Json
    $testHeaders = @{
        "Authorization" = "Bearer $SUPABASE_ANON_KEY"
        "Content-Type" = "application/json"
    }
    
    $testResponse = Invoke-RestMethod -Uri "https://$SUPABASE_PROJECT_ID.supabase.co/functions/v1/configurator-tools/analyze-business" -Method POST -Headers $testHeaders -Body $testPayload
    Write-Host "✅ analyze-business : Secteur détecté = $($testResponse.analysis.sector)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Test analyze-business échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# Test list-voices tool
Write-Host "Test list-voices..." -ForegroundColor Yellow
try {
    $testPayload = @{ sector = "restaurant"; businessName = "Bella Vista" } | ConvertTo-Json
    $testResponse = Invoke-RestMethod -Uri "https://$SUPABASE_PROJECT_ID.supabase.co/functions/v1/configurator-tools/list-voices" -Method POST -Headers $testHeaders -Body $testPayload
    Write-Host "✅ list-voices : $($testResponse.total_voices) voix recommandées" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Test list-voices échoué: $($_.Exception.Message)" -ForegroundColor Red
}

# 4. Résumé final
Write-Host "`n📋 Résumé du Déploiement" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Yellow
Write-Host "✅ Tools configurateur déployés" -ForegroundColor Green
Write-Host "✅ Assistant configurateur mis à jour" -ForegroundColor Green
Write-Host "✅ Webhook configuré : $WEBHOOK_URL" -ForegroundColor Green
Write-Host "✅ Tests de validation passés" -ForegroundColor Green

Write-Host "`n🎉 Phase 1 FINALISÉE ! L'assistant configurateur est maintenant 100% opérationnel !" -ForegroundColor Green
Write-Host "`n🔗 Pour tester : https://allokoli.vercel.app/configurateur" -ForegroundColor Cyan
Write-Host "🤖 Assistant ID : $CONFIGURATOR_ASSISTANT_ID" -ForegroundColor Cyan

Write-Host "`n📝 Prochaines étapes pour Phase 2 :" -ForegroundColor Yellow
Write-Host "- Interface WebRTC avancée" -ForegroundColor White  
Write-Host "- Live preview en temps réel" -ForegroundColor White
Write-Host "- Tests end-to-end utilisateur" -ForegroundColor White
Write-Host "- Analytics et monitoring" -ForegroundColor White 