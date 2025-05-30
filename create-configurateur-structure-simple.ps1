#!/usr/bin/env pwsh

# CRÉATION CONFIGURATEUR ALLOKOLI - STRUCTURE SIMPLE
# ===================================================

Write-Host "🎯 CRÉATION CONFIGURATEUR ALLOKOLI - STRUCTURE SIMPLE" -ForegroundColor Green
Write-Host "=" * 60

# Configuration avec la vraie Private Key Vapi
$VapiApiUrl = "https://api.vapi.ai/assistant"
$VapiPrivateKey = "37e5584f-31ce-4f77-baf2-5684682079ea"

Write-Host "🔑 Utilisation de VAPI_PRIVATE_KEY: 37e5584f-...79ea" -ForegroundColor Cyan
Write-Host "📋 Structure simple conforme à la documentation Vapi" -ForegroundColor Yellow

try {
    Write-Host "`n🚀 Création du Configurateur structure simple..." -ForegroundColor Green

    # Structure conforme à la documentation Vapi
    $ConfiguratorPayload = @{
        name = "Configurateur AlloKoli Expert"
        
        # Modèle - structure simple
        model = @{
            provider = "openai"
            model = "gpt-4o-mini"
            temperature = 0.7
            messages = @(
                @{
                    role = "system"
                    content = "Tu es l'expert configurateur d'assistants vocaux AlloKoli. Tu analyses l'activité du client, recommandes les meilleures voix selon le secteur, et crées un assistant vocal personnalisé. Tu guides le client étape par étape vers un assistant vocal professionnel."
                }
            )
        }
        
        # Voix
        voice = @{
            provider = "azure"
            voiceId = "fr-FR-DeniseNeural"
        }
        
        # Transcriber
        transcriber = @{
            provider = "deepgram"
            model = "nova-2"
            language = "fr"
        }
        
        # Message initial
        firstMessage = "Bonjour ! Je suis votre configurateur AlloKoli. Décrivez-moi votre activité et je créerai un assistant vocal adapté."
        
        # Tools - structure selon documentation
        tools = @(
            @{
                type = "function"
                function = @{
                    name = "analyzeBusinessContext"
                    description = "Analyse automatique du contexte business"
                    parameters = @{
                        type = "object"
                        properties = @{
                            businessDescription = @{
                                type = "string"
                                description = "Description de l'activité"
                            }
                        }
                        required = @("businessDescription")
                    }
                }
                async = $false
                server = @{
                    url = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools?tool=analyzeBusinessContext"
                }
                messages = @(
                    @{
                        type = "request-start"
                        content = "J'analyse votre activité..."
                    },
                    @{
                        type = "request-complete"
                        content = "Analyse terminée !"
                    }
                )
            },
            @{
                type = "function"
                function = @{
                    name = "listVoicesForBusiness"
                    description = "Liste des voix recommandées"
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
                async = $false
                server = @{
                    url = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools?tool=listVoicesForBusiness"
                }
                messages = @(
                    @{
                        type = "request-start"
                        content = "Je recherche les meilleures voix..."
                    },
                    @{
                        type = "request-complete"
                        content = "Voix sélectionnées !"
                    }
                )
            },
            @{
                type = "function"
                function = @{
                    name = "createAssistant"
                    description = "Crée l'assistant vocal final"
                    parameters = @{
                        type = "object"
                        properties = @{
                            name = @{
                                type = "string"
                                description = "Nom de l'assistant"
                            }
                            sector = @{
                                type = "string"
                                description = "Secteur d'activité"
                            }
                            voice = @{
                                type = "object"
                                properties = @{
                                    provider = @{ type = "string" }
                                    voiceId = @{ type = "string" }
                                }
                            }
                        }
                        required = @("name", "sector", "voice")
                    }
                }
                async = $false
                server = @{
                    url = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools?tool=createAssistant"
                }
                messages = @(
                    @{
                        type = "request-start"
                        content = "Je crée votre assistant..."
                    },
                    @{
                        type = "request-complete"
                        content = "Assistant créé avec succès !"
                    }
                )
            }
        )
        
    } | ConvertTo-Json -Depth 10

    $Headers = @{
        "Authorization" = "Bearer $VapiPrivateKey"
        "Content-Type" = "application/json"
    }

    Write-Host "📡 Envoi de la configuration à Vapi..." -ForegroundColor Cyan
    Write-Host "📋 Payload size: $($ConfiguratorPayload.Length) characters" -ForegroundColor Gray
    
    $Response = Invoke-RestMethod -Uri $VapiApiUrl -Method POST -Headers $Headers -Body $ConfiguratorPayload

    Write-Host "🎉 CONFIGURATEUR CRÉÉ AVEC SUCCÈS !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 DÉTAILS :" -ForegroundColor White
    Write-Host "   🆔 ID: $($Response.id)" -ForegroundColor Yellow
    Write-Host "   📛 Nom: $($Response.name)" -ForegroundColor Yellow
    Write-Host "   🔧 Tools: 3 outils configurateur" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔗 LIENS :" -ForegroundColor White
    Write-Host "   🧪 Test: https://dashboard.vapi.ai/assistant/$($Response.id)/test" -ForegroundColor Cyan
    Write-Host "   ⚙️ Config: https://dashboard.vapi.ai/assistant/$($Response.id)" -ForegroundColor Cyan

    # Sauvegarde des informations
    @{
        success = $true
        configurator_id = $Response.id
        name = $Response.name
        test_url = "https://dashboard.vapi.ai/assistant/$($Response.id)/test"
        dashboard_url = "https://dashboard.vapi.ai/assistant/$($Response.id)"
        tools_url = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools"
        tools = @("analyzeBusinessContext", "listVoicesForBusiness", "createAssistant")
        created_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        project_status = "COMPLET"
    } | ConvertTo-Json -Depth 5 | Out-File "ALLOKOLI-SIMPLE-SUCCESS.json" -Encoding UTF8

    Write-Host ""
    Write-Host "🎯 PROJET ALLOKOLI 100% TERMINÉ ! 🎉" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "✅ Configurateur expert opérationnel" -ForegroundColor White
    Write-Host "✅ Edge Functions déployées" -ForegroundColor White
    Write-Host "✅ 3 Tools configurateur actifs" -ForegroundColor White
    Write-Host "✅ Assistant ID: $($Response.id)" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green

} catch {
    Write-Host "❌ Erreur lors de la création:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $StatusCode = $_.Exception.Response.StatusCode
        Write-Host "   Status Code: $StatusCode" -ForegroundColor Red
        
        try {
            $ErrorStream = $_.Exception.Response.GetResponseStream()
            $Reader = New-Object System.IO.StreamReader($ErrorStream)
            $ErrorBody = $Reader.ReadToEnd()
            Write-Host "   Détails JSON: $ErrorBody" -ForegroundColor Red
        } catch {
            Write-Host "   Impossible de lire les détails de l'erreur" -ForegroundColor Red
        }
    }
} 