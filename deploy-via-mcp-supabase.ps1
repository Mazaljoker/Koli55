# Script de création d'assistant via MCP Supabase
# Deploy via MCP Supabase.ps1

Write-Host "🚀 Création Assistant Vapi via MCP Supabase" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Yellow

# Configuration automatique du projet KOLI
$SUPABASE_PROJECT_ID = "aiurboizarbbcpynmmgv"
$SUPABASE_URL = "https://aiurboizarbbcpynmmgv.supabase.co"
$CONFIGURATOR_TOOLS_URL = "$SUPABASE_URL/functions/v1/configurator-tools"

Write-Host "✅ Projet KOLI configuré automatiquement" -ForegroundColor Green
Write-Host "   URL Tools : $CONFIGURATOR_TOOLS_URL" -ForegroundColor White

# Configuration de l'assistant avec les 3 tools
$assistantConfig = @{
    name = "Configurateur d'Assistants AlloKoli"
    firstMessage = "Bonjour ! Je suis votre configurateur d'assistant vocal. Décrivez-moi votre activité et je créerai un assistant parfaitement adapté à vos besoins !"
    systemPrompt = @"
Tu es un expert en configuration d'assistants vocaux pour professionnels. 

Ton rôle :
1. Analyser l'activité du client (restaurant, salon, artisan, etc.)
2. Recommander les meilleures voix selon le secteur
3. Créer un assistant vocal personnalisé et professionnel

Process :
1. Demande la description de l'activité
2. Utilise analyzeBusinessContext pour détecter le secteur
3. Utilise listVoicesForBusiness pour recommander 3 voix
4. Recueille les préférences (nom, contact, message d'accueil)
5. Utilise createAssistant pour finaliser la création

Tu es enthousiaste, expert et efficace. Tu guides le client étape par étape.
"@
    voice = @{
        provider = "azure"
        voiceId = "fr-FR-DeniseNeural"
    }
    model = @{
        provider = "openai"
        model = "gpt-4o-mini"
        temperature = 0.7
        maxTokens = 1000
    }
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
                            description = "Description de l'activité du client"
                        }
                    }
                    required = @("description")
                }
            }
            server = @{
                url = $CONFIGURATOR_TOOLS_URL
                method = "POST"
                headers = @{
                    "Content-Type" = "application/json"
                }
            }
        },
        @{
            type = "function"
            function = @{
                name = "listVoicesForBusiness"
                description = "Liste les voix optimisées selon le secteur d'activité détecté"
                parameters = @{
                    type = "object"
                    properties = @{
                        businessType = @{
                            type = "string"
                            description = "Type de business (restaurant, salon, artisan, medical, commerce)"
                        }
                    }
                    required = @("businessType")
                }
            }
            server = @{
                url = $CONFIGURATOR_TOOLS_URL
                method = "POST"
                headers = @{
                    "Content-Type" = "application/json"
                }
            }
        },
        @{
            type = "function"
            function = @{
                name = "createAssistant"
                description = "Crée un assistant Vapi personnalisé avec la configuration optimale"
                parameters = @{
                    type = "object"
                    properties = @{
                        businessInfo = @{
                            type = "object"
                            properties = @{
                                name = @{ type = "string" }
                                type = @{ type = "string" }
                                description = @{ type = "string" }
                                phone = @{ type = "string" }
                                address = @{ type = "string" }
                            }
                            required = @("name", "type", "description")
                        }
                        selectedVoice = @{
                            type = "object"
                            properties = @{
                                provider = @{ type = "string" }
                                voiceId = @{ type = "string" }
                                name = @{ type = "string" }
                            }
                            required = @("provider", "voiceId", "name")
                        }
                        additionalConfig = @{
                            type = "object"
                            properties = @{
                                greeting = @{ type = "string" }
                                instructions = @{ type = "string" }
                            }
                        }
                    }
                    required = @("businessInfo", "selectedVoice")
                }
            }
            server = @{
                url = $CONFIGURATOR_TOOLS_URL
                method = "POST"
                headers = @{
                    "Content-Type" = "application/json"
                }
            }
        }
    )
    recordingEnabled = $true
    silenceTimeoutSeconds = 30
    maxDurationSeconds = 900
}

Write-Host "`n🤖 Configuration assistant préparée" -ForegroundColor Green
Write-Host "   3 tools configurateur intégrés" -ForegroundColor White
Write-Host "   URL endpoint : $CONFIGURATOR_TOOLS_URL" -ForegroundColor White

Write-Host "`n📋 Prochaines étapes :" -ForegroundColor Yellow
Write-Host "1. Récupérez votre clé API Vapi : https://dashboard.vapi.ai/api-keys" -ForegroundColor White
Write-Host "2. Utilisez l'API ou le dashboard pour créer l'assistant avec cette config" -ForegroundColor White
Write-Host "3. Testez via l'interface chat /configurateur" -ForegroundColor White

Write-Host "`n✅ Edge Functions déployées et prêtes !" -ForegroundColor Green 