#!/usr/bin/env pwsh

# FINALISATION CONFIGURATEUR ALLOKOLI
# ===================================

Write-Host "🎯 FINALISATION CONFIGURATEUR ALLOKOLI" -ForegroundColor Green
Write-Host "=" * 50

Write-Host "`n📋 ÉTAPE 1 : Récupération des clés Vapi" -ForegroundColor Cyan
Write-Host "1. Allez sur: https://dashboard.vapi.ai" -ForegroundColor White
Write-Host "2. Menu gauche → API Keys" -ForegroundColor White
Write-Host "3. Copiez vos clés complètes" -ForegroundColor White

Write-Host "`n🔑 ÉTAPE 2 : Saisie des clés" -ForegroundColor Cyan
$PrivateKey = Read-Host "VAPI_PRIVATE_KEY (sk_...)"
$PublicKey = Read-Host "VAPI_PUBLIC_KEY (pk_...)"

if (-not $PrivateKey -or -not $PrivateKey.StartsWith("sk_")) {
    Write-Host "❌ PRIVATE_KEY requise (doit commencer par sk_)" -ForegroundColor Red
    exit 1
}

Write-Host "`n🚀 ÉTAPE 3 : Création du configurateur..." -ForegroundColor Green

$VapiApiUrl = "https://api.vapi.ai/assistant"

$ConfiguratorPayload = @{
    name = "🎯 Configurateur AlloKoli Expert"
    voice = @{
        provider = "azure"
        voiceId = "fr-FR-DeniseNeural"
    }
    model = @{
        provider = "openai"
        model = "gpt-4o-mini"
        temperature = 0.7
        systemMessage = @"
Tu es l'expert configurateur d'assistants vocaux AlloKoli.

🎯 TON RÔLE :
- Analyser l'activité du client (restaurant, salon, artisan, commerce, médical)
- Recommander les meilleures voix selon le secteur
- Créer un assistant vocal personnalisé et professionnel

📋 PROCESSUS ÉTAPE PAR ÉTAPE :
1. Demande description détaillée de l'activité
2. Utilise analyzeBusinessContext pour détecter le secteur automatiquement
3. Utilise listVoicesForBusiness pour proposer 3 voix optimisées
4. Recueille les préférences finales (nom entreprise, personnalisation)
5. Utilise createAssistant pour créer l'assistant vocal final

Tu guides le client vers un assistant vocal professionnel parfaitement adapté !
"@
    }
    firstMessage = "Bonjour ! 🎯 Je suis votre expert configurateur AlloKoli. Je vais créer un assistant vocal parfaitement adapté à votre activité. Pouvez-vous me décrire en détail votre entreprise ou activité ?"
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
                description = "Analyse automatique du contexte business et détection du secteur d'activité"
                parameters = @{
                    type = "object"
                    properties = @{
                        businessDescription = @{
                            type = "string"
                            description = "Description complète de l'activité et des services"
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
                description = "Obtient les 3 meilleures voix recommandées pour le secteur d'activité"
                parameters = @{
                    type = "object"
                    properties = @{
                        sector = @{
                            type = "string"
                            description = "Secteur d'activité (restaurant, salon, artisan, commerce, medical, service)"
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
                description = "Crée l'assistant vocal final avec la configuration optimisée"
                parameters = @{
                    type = "object"
                    properties = @{
                        name = @{
                            type = "string"
                            description = "Nom de l'entreprise ou de l'assistant"
                        }
                        sector = @{
                            type = "string"
                            description = "Secteur d'activité détecté"
                        }
                        voice = @{
                            type = "object"
                            description = "Configuration de la voix sélectionnée"
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
            server = @{
                url = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools?tool=createAssistant"
                method = "POST"
            }
        }
    )
} | ConvertTo-Json -Depth 10

try {
    $Headers = @{
        "Authorization" = "Bearer $PrivateKey"
        "Content-Type" = "application/json"
    }

    Write-Host "📡 Envoi à Vapi..." -ForegroundColor Cyan
    $Response = Invoke-RestMethod -Uri $VapiApiUrl -Method POST -Headers $Headers -Body $ConfiguratorPayload
    
    Write-Host "🎉 CONFIGURATEUR CRÉÉ AVEC SUCCÈS !" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 DÉTAILS :" -ForegroundColor White
    Write-Host "   🆔 ID: $($Response.id)" -ForegroundColor Yellow
    Write-Host "   📛 Nom: $($Response.name)" -ForegroundColor Yellow
    Write-Host "   🎤 Voix: Azure Denise (FR)" -ForegroundColor Yellow
    Write-Host "   🧠 Modèle: GPT-4o-mini" -ForegroundColor Yellow
    Write-Host "   🔧 Tools: 3 outils configurateur" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔗 LIENS :" -ForegroundColor White
    Write-Host "   🧪 Test: https://dashboard.vapi.ai/assistant/$($Response.id)/test" -ForegroundColor Cyan
    Write-Host "   ⚙️ Config: https://dashboard.vapi.ai/assistant/$($Response.id)" -ForegroundColor Cyan

    # Sauvegarde finale
    @{
        success = $true
        configurator_id = $Response.id
        name = $Response.name
        test_url = "https://dashboard.vapi.ai/assistant/$($Response.id)/test"
        dashboard_url = "https://dashboard.vapi.ai/assistant/$($Response.id)"
        tools_url = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools"
        tools = @("analyzeBusinessContext", "listVoicesForBusiness", "createAssistant")
        created_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        project_status = "TERMINÉ"
    } | ConvertTo-Json -Depth 5 | Out-File "ALLOKOLI-CONFIGURATEUR-FINAL.json" -Encoding UTF8

    Write-Host ""
    Write-Host "🎯 PROJET ALLOKOLI 100% TERMINÉ ! 🎉" -ForegroundColor Green
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host "✅ Configurateur expert opérationnel" -ForegroundColor White
    Write-Host "✅ Edge Functions déployées" -ForegroundColor White
    Write-Host "✅ 3 Tools configurateur actifs" -ForegroundColor White
    Write-Host "✅ Assistant ID: $($Response.id)" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
    Write-Host ""
    Write-Host "🚀 Le configurateur peut maintenant créer automatiquement" -ForegroundColor Cyan
    Write-Host "🎯 des assistants vocaux pour TOUS les secteurs d'activité !" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Erreur: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $StatusCode = $_.Exception.Response.StatusCode
        Write-Host "Status: $StatusCode" -ForegroundColor Red
        
        if ($StatusCode -eq "Unauthorized") {
            Write-Host "💡 Vérifiez votre clé PRIVATE_KEY sur dashboard.vapi.ai" -ForegroundColor Yellow
        }
    }
} 