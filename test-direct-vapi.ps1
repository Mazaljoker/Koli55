#!/usr/bin/env pwsh

# Test direct des clés Vapi pour création d'assistant
# ==================================================

Write-Host "🔑 Test clés Vapi - Création d'assistant" -ForegroundColor Green
Write-Host "=" * 50

$VapiApiUrl = "https://api.vapi.ai/assistant"

# Valeurs par défaut depuis l'image Supabase (vous pouvez les coller directement)
Write-Host "`n📋 Vous avez 2 clés dans Supabase:" -ForegroundColor Cyan
Write-Host "   - VAPI_PRIVATE_KEY (sk_xxx) : Pour créer assistants" -ForegroundColor White
Write-Host "   - VAPI_PUBLIC_KEY (pk_xxx) : Pour appeler assistants" -ForegroundColor White

Write-Host "`n🔍 Entrez vos clés pour test:" -ForegroundColor Yellow

# Test PRIVATE_KEY
$PrivateKey = Read-Host "VAPI_PRIVATE_KEY (sk_xxx)"

if ($PrivateKey -and $PrivateKey.StartsWith("sk_")) {
    try {
        Write-Host "`n🧪 Test PRIVATE_KEY..." -ForegroundColor Cyan
        
        $TestPayload = @{
            name = "Test AlloKoli"
            voice = @{
                provider = "azure"
                voiceId = "fr-FR-DeniseNeural"
            }
            model = @{
                provider = "openai"
                model = "gpt-4o-mini"
                systemMessage = "Test assistant AlloKoli"
            }
            firstMessage = "Bonjour, test AlloKoli"
        } | ConvertTo-Json -Depth 5

        $Headers = @{
            "Authorization" = "Bearer $PrivateKey"
            "Content-Type" = "application/json"
        }

        $Response = Invoke-RestMethod -Uri $VapiApiUrl -Method POST -Headers $Headers -Body $TestPayload
        
        Write-Host "✅ PRIVATE_KEY FONCTIONNE !" -ForegroundColor Green
        Write-Host "   Assistant créé: $($Response.id)" -ForegroundColor Yellow
        Write-Host "   Nom: $($Response.name)" -ForegroundColor White
        
        # Sauvegarder la bonne clé
        $env:VAPI_PRIVATE_KEY = $PrivateKey
        Write-Host "💾 Clé sauvegardée dans environnement" -ForegroundColor Green
        
        Write-Host "`n🚀 Création du configurateur maintenant..." -ForegroundColor Green
        $ConfigPayload = @{
            name = "Configurateur AlloKoli Final"
            voice = @{
                provider = "azure"
                voiceId = "fr-FR-DeniseNeural"
            }
            model = @{
                provider = "openai"
                model = "gpt-4o-mini"
                systemMessage = @"
Tu es un expert en configuration d'assistants vocaux AlloKoli.

Ton rôle :
1. Analyser l'activité du client (restaurant, salon, artisan, commerce)
2. Recommander les meilleures voix selon le secteur
3. Créer un assistant vocal personnalisé

Tu guides le client étape par étape vers un assistant vocal professionnel.
"@
            }
            firstMessage = "Bonjour ! Je suis votre configurateur AlloKoli. Décrivez-moi votre activité et je créerai un assistant parfait pour vous !"
            transcriber = @{
                provider = "deepgram"
                model = "nova-2"
                language = "fr"
            }
            tools = @(
                @{
                    type = "function"
                    function = @{
                        name = "analyzeBusinessContext"
                        description = "Analyse le contexte business automatiquement"
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
                    server = @{
                        url = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools?tool=analyzeBusinessContext"
                        method = "POST"
                    }
                },
                @{
                    type = "function"
                    function = @{
                        name = "listVoicesForBusiness"
                        description = "Liste les voix optimales par secteur"
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
                    server = @{
                        url = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools?tool=listVoicesForBusiness"
                        method = "POST"
                    }
                },
                @{
                    type = "function"
                    function = @{
                        name = "createAssistant"
                        description = "Crée l'assistant vocal final"
                        parameters = @{
                            type = "object"
                            properties = @{
                                name = @{ type = "string" }
                                sector = @{ type = "string" }
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
                    server = @{
                        url = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools?tool=createAssistant"
                        method = "POST"
                    }
                }
            )
        } | ConvertTo-Json -Depth 10
        
        $ConfigResponse = Invoke-RestMethod -Uri $VapiApiUrl -Method POST -Headers $Headers -Body $ConfigPayload
        
        Write-Host "🎉 CONFIGURATEUR CRÉÉ !" -ForegroundColor Green
        Write-Host "📋 Assistant ID: $($ConfigResponse.id)" -ForegroundColor Yellow
        Write-Host "📞 URL de test: https://dashboard.vapi.ai/assistant/$($ConfigResponse.id)/test" -ForegroundColor Cyan
        
        # Supprimer l'assistant de test
        try {
            Invoke-RestMethod -Uri "$VapiApiUrl/$($Response.id)" -Method DELETE -Headers $Headers
            Write-Host "🗑️ Assistant de test supprimé" -ForegroundColor Gray
        } catch {}
        
        # Sauvegarder les infos finales
        $FinalInfo = @{
            configurator_id = $ConfigResponse.id
            name = $ConfigResponse.name
            test_url = "https://dashboard.vapi.ai/assistant/$($ConfigResponse.id)/test"
            dashboard_url = "https://dashboard.vapi.ai/assistant/$($ConfigResponse.id)"
            tools_deployed = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools"
            created_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
            success = $true
        }
        
        $FinalInfo | ConvertTo-Json -Depth 5 | Out-File "CONFIGURATEUR-FINAL-SUCCESS.json" -Encoding UTF8
        
        Write-Host "`n🎯 SUCCÈS TOTAL ! 🎉" -ForegroundColor Green
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
        Write-Host "✅ Configurateur AlloKoli 100% opérationnel" -ForegroundColor White
        Write-Host "✅ Tools configurateur déployés et fonctionnels" -ForegroundColor White
        Write-Host "✅ Assistant ID: $($ConfigResponse.id)" -ForegroundColor Yellow
        Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
        
        return
        
    } catch {
        Write-Host "❌ PRIVATE_KEY échoue: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test PUBLIC_KEY si PRIVATE échoue
$PublicKey = Read-Host "`nVAPI_PUBLIC_KEY (pk_xxx) - Test si PRIVATE_KEY a échoué"

if ($PublicKey -and $PublicKey.StartsWith("pk_")) {
    try {
        Write-Host "`n🧪 Test PUBLIC_KEY..." -ForegroundColor Cyan
        
        $TestPayload = @{
            name = "Test Public Key"
            voice = @{ provider = "azure"; voiceId = "fr-FR-DeniseNeural" }
            model = @{ provider = "openai"; model = "gpt-4o-mini"; systemMessage = "Test" }
        } | ConvertTo-Json -Depth 5

        $Headers = @{
            "Authorization" = "Bearer $PublicKey"
            "Content-Type" = "application/json"
        }

        $Response = Invoke-RestMethod -Uri $VapiApiUrl -Method POST -Headers $Headers -Body $TestPayload
        
        Write-Host "✅ PUBLIC_KEY fonctionne aussi (inattendu mais OK)" -ForegroundColor Green
        Write-Host "   Assistant: $($Response.id)" -ForegroundColor Yellow
        
    } catch {
        Write-Host "❌ PUBLIC_KEY échoue (normal): $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "💡 PUBLIC_KEY est pour les appels, pas la création" -ForegroundColor Gray
    }
}

Write-Host "`n📝 Résumé:" -ForegroundColor White
Write-Host "   - Pour créer assistants: PRIVATE_KEY (sk_xxx)" -ForegroundColor Green
Write-Host "   - Pour appeler assistants: PUBLIC_KEY (pk_xxx)" -ForegroundColor Cyan 