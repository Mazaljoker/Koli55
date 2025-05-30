#!/usr/bin/env pwsh

# CRÉATION TOOLS SÉPARÉS POUR VAPI DASHBOARD
# ===========================================

Write-Host "🔧 CRÉATION TOOLS SÉPARÉS ALLOKOLI" -ForegroundColor Green
Write-Host "=" * 50

$VapiApiUrl = "https://api.vapi.ai"
$VapiPrivateKey = "37e5584f-31ce-4f77-baf2-5684682079ea"

$Headers = @{
    "Authorization" = "Bearer $VapiPrivateKey"
    "Content-Type" = "application/json"
}

Write-Host "🔑 Création des tools individuels pour attribution manuelle" -ForegroundColor Cyan

try {
    # TOOL 1: analyzeBusinessContext
    Write-Host "`n🔍 Création tool: analyzeBusinessContext..." -ForegroundColor Yellow
    
    $Tool1Payload = @{
        type = "function"
        function = @{
            name = "analyzeBusinessContext"
            description = "Analyse automatique du contexte business pour détecter le secteur d'activité"
            parameters = @{
                type = "object"
                properties = @{
                    businessDescription = @{
                        type = "string"
                        description = "Description complète de l'activité du client"
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
                content = "🔍 J'analyse votre activité pour déterminer le secteur optimal..."
            },
            @{
                type = "request-complete"
                content = "✅ Analyse terminée ! J'ai identifié votre secteur d'activité."
            },
            @{
                type = "request-failed"
                content = "❌ Désolé, je n'ai pas pu analyser votre activité. Pouvez-vous me donner plus de détails ?"
            }
        )
    } | ConvertTo-Json -Depth 10

    $Tool1Response = Invoke-RestMethod -Uri "$VapiApiUrl/tool" -Method POST -Headers $Headers -Body $Tool1Payload
    Write-Host "   ✅ Tool créé - ID: $($Tool1Response.id)" -ForegroundColor Green

    # TOOL 2: listVoicesForBusiness
    Write-Host "`n🎤 Création tool: listVoicesForBusiness..." -ForegroundColor Yellow
    
    $Tool2Payload = @{
        type = "function"
        function = @{
            name = "listVoicesForBusiness"
            description = "Obtient les 3 meilleures voix recommandées pour un secteur d'activité spécifique"
            parameters = @{
                type = "object"
                properties = @{
                    sector = @{
                        type = "string"
                        description = "Secteur d'activité identifié"
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
                content = "🎤 Je recherche les meilleures voix pour votre secteur..."
            },
            @{
                type = "request-complete"
                content = "✅ Parfait ! J'ai sélectionné les 3 voix les plus adaptées à votre activité."
            },
            @{
                type = "request-failed"
                content = "❌ Je n'ai pas pu récupérer les voix recommandées. Essayons à nouveau."
            }
        )
    } | ConvertTo-Json -Depth 10

    $Tool2Response = Invoke-RestMethod -Uri "$VapiApiUrl/tool" -Method POST -Headers $Headers -Body $Tool2Payload
    Write-Host "   ✅ Tool créé - ID: $($Tool2Response.id)" -ForegroundColor Green

    # TOOL 3: createAssistant
    Write-Host "`n🚀 Création tool: createAssistant..." -ForegroundColor Yellow
    
    $Tool3Payload = @{
        type = "function"
        function = @{
            name = "createAssistant"
            description = "Crée l'assistant vocal final avec la configuration optimisée pour le secteur"
            parameters = @{
                type = "object"
                properties = @{
                    name = @{
                        type = "string"
                        description = "Nom de l'entreprise ou de l'assistant"
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
                        required = @("provider", "voiceId")
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
                content = "🚀 Je crée votre assistant vocal personnalisé..."
            },
            @{
                type = "request-complete"
                content = "🎉 Félicitations ! Votre assistant vocal est créé et prêt à fonctionner."
            },
            @{
                type = "request-failed"
                content = "❌ La création a échoué. Vérifions vos paramètres et réessayons."
            }
        )
    } | ConvertTo-Json -Depth 10

    $Tool3Response = Invoke-RestMethod -Uri "$VapiApiUrl/tool" -Method POST -Headers $Headers -Body $Tool3Payload
    Write-Host "   ✅ Tool créé - ID: $($Tool3Response.id)" -ForegroundColor Green

    Write-Host "`n🎉 TOUS LES TOOLS CRÉÉS AVEC SUCCÈS !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 IDs DES TOOLS CRÉÉS :" -ForegroundColor White
    Write-Host "   🔍 analyzeBusinessContext: $($Tool1Response.id)" -ForegroundColor Yellow
    Write-Host "   🎤 listVoicesForBusiness: $($Tool2Response.id)" -ForegroundColor Yellow
    Write-Host "   🚀 createAssistant: $($Tool3Response.id)" -ForegroundColor Yellow

    # Maintenant créer l'assistant avec toolIds
    Write-Host "`n👤 Création de l'assistant configurateur avec toolIds..." -ForegroundColor Cyan
    
    $AssistantPayload = @{
        name = "🎯 Configurateur AlloKoli Expert"
        model = @{
            provider = "openai"
            model = "gpt-4o-mini"
            temperature = 0.7
            messages = @(
                @{
                    role = "system"
                    content = @"
Tu es l'expert configurateur d'assistants vocaux AlloKoli.

🎯 TON RÔLE :
- Analyser précisément l'activité du client  
- Recommander les meilleures voix selon le secteur
- Créer un assistant vocal personnalisé

📋 PROCESSUS :
1. Demande description détaillée de l'activité
2. Utilise analyzeBusinessContext pour détecter le secteur
3. Utilise listVoicesForBusiness pour recommander voix
4. Utilise createAssistant pour créer l'assistant final

Tu guides le client étape par étape vers un assistant vocal professionnel !
"@
                }
            )
            toolIds = @(
                $Tool1Response.id,
                $Tool2Response.id,
                $Tool3Response.id
            )
        }
        voice = @{
            provider = "azure"
            voiceId = "fr-FR-DeniseNeural"
        }
        transcriber = @{
            provider = "deepgram"
            model = "nova-2"
            language = "fr"
        }
        firstMessage = "Bonjour ! 🎯 Je suis votre expert configurateur AlloKoli. Je vais créer un assistant vocal parfaitement adapté à votre activité. Pour commencer, pouvez-vous me décrire en détail votre entreprise ?"
    } | ConvertTo-Json -Depth 8

    $AssistantResponse = Invoke-RestMethod -Uri "$VapiApiUrl/assistant" -Method POST -Headers $Headers -Body $AssistantPayload
    Write-Host "   ✅ Assistant créé - ID: $($AssistantResponse.id)" -ForegroundColor Green

    # Sauvegarde des informations
    $ToolsInfo = @{
        success = $true
        tools = @{
            analyzeBusinessContext = $Tool1Response.id
            listVoicesForBusiness = $Tool2Response.id  
            createAssistant = $Tool3Response.id
        }
        assistant = @{
            id = $AssistantResponse.id
            name = $AssistantResponse.name
        }
        dashboard_urls = @{
            assistant = "https://dashboard.vapi.ai/assistant/$($AssistantResponse.id)"
            test = "https://dashboard.vapi.ai/assistant/$($AssistantResponse.id)/test"
            tools = "https://dashboard.vapi.ai/tools"
        }
        created_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }

    $ToolsInfo | ConvertTo-Json -Depth 5 | Out-File "ALLOKOLI-TOOLS-CRÉÉS.json" -Encoding UTF8

    Write-Host ""
    Write-Host "🎯 MISSION ACCOMPLIE !" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "✅ 3 Tools créés et assignés automatiquement" -ForegroundColor White
    Write-Host "✅ Assistant configurateur opérationnel" -ForegroundColor White
    Write-Host "✅ Tools IDs assignés au modèle" -ForegroundColor White
    Write-Host ""
    Write-Host "📋 DÉTAILS :" -ForegroundColor White
    Write-Host "   🎯 Assistant ID: $($AssistantResponse.id)" -ForegroundColor Yellow
    Write-Host "   🔧 Tools: 3 tools configurateur" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔗 LIENS :" -ForegroundColor White
    Write-Host "   🧪 Test assistant: https://dashboard.vapi.ai/assistant/$($AssistantResponse.id)/test" -ForegroundColor Cyan
    Write-Host "   ⚙️ Configuration: https://dashboard.vapi.ai/assistant/$($AssistantResponse.id)" -ForegroundColor Cyan
    Write-Host "   🔧 Gestion tools: https://dashboard.vapi.ai/tools" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💾 Informations sauvegardées dans: ALLOKOLI-TOOLS-CRÉÉS.json" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green

} catch {
    Write-Host "❌ Erreur:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $StatusCode = $_.Exception.Response.StatusCode
        Write-Host "   Status Code: $StatusCode" -ForegroundColor Red
        
        try {
            $ErrorStream = $_.Exception.Response.GetResponseStream()
            $Reader = New-Object System.IO.StreamReader($ErrorStream)
            $ErrorBody = $Reader.ReadToEnd()
            Write-Host "   Détails: $ErrorBody" -ForegroundColor Red
        } catch {
            Write-Host "   Impossible de lire les détails" -ForegroundColor Red
        }
    }
} 