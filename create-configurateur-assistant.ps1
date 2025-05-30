#!/usr/bin/env pwsh

# Création Assistant Configurateur AlloKoli via Vapi API
# =====================================================

Write-Host "🎯 Création Assistant Configurateur AlloKoli" -ForegroundColor Green
Write-Host "=" * 50

# Configuration
$VapiApiUrl = "https://api.vapi.ai/assistant"

# Récupération de la clé depuis l'environnement ou demande manuelle
$VapiApiKey = $env:VAPI_PRIVATE_KEY
if (-not $VapiApiKey) {
    Write-Host "⚠️ VAPI_PRIVATE_KEY non trouvée dans l'environnement" -ForegroundColor Yellow
    $VapiApiKey = Read-Host "Entrez votre clé API Vapi"
}

if (-not $VapiApiKey) {
    Write-Host "❌ Clé API Vapi requise" -ForegroundColor Red
    exit 1
}

# Configuration de l'assistant
$AssistantConfig = @{
    name = "Configurateur AlloKoli MCP"
    firstMessage = "Bonjour ! Je suis votre configurateur d'assistant vocal AlloKoli. Décrivez-moi votre activité et je créerai un assistant parfaitement adapté à vos besoins professionnels !"
    systemMessage = @"
Tu es un expert en configuration d'assistants vocaux pour professionnels avec AlloKoli.

Ton rôle :
1. Analyser l'activité du client (restaurant, salon, artisan, cabinet médical, commerce)
2. Recommander les meilleures voix selon le secteur d'activité
3. Créer un assistant vocal personnalisé et professionnel

Process étape par étape :
1. Demande une description détaillée de l'activité du client
2. Utilise analyzeBusinessContext pour détecter automatiquement le secteur
3. Utilise listVoicesForBusiness pour recommander 3 voix optimisées
4. Recueille les préférences (nom entreprise, contact, message d'accueil personnalisé)
5. Utilise createAssistant pour finaliser la création avec la configuration optimale

Tu es enthousiaste, expert et efficace. Tu guides le client étape par étape vers un assistant vocal professionnel.
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
                description = "Analyse le contexte business et détecte automatiquement le secteur d'activité"
                parameters = @{
                    type = "object"
                    properties = @{
                        businessDescription = @{
                            type = "string"
                            description = "Description détaillée de l'activité du client"
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
                description = "Liste les meilleures voix optimisées selon le secteur d'activité"
                parameters = @{
                    type = "object"
                    properties = @{
                        sector = @{
                            type = "string"
                            description = "Secteur d'activité détecté"
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
                description = "Crée un assistant Vapi personnalisé avec la configuration optimale"
                parameters = @{
                    type = "object"
                    properties = @{
                        name = @{
                            type = "string"
                            description = "Nom de l'entreprise"
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
            server = @{
                url = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools?tool=createAssistant"
                method = "POST"
            }
        }
    )
    transcriber = @{
        provider = "deepgram"
        model = "nova-2"
        language = "fr"
    }
    recordingEnabled = $true
    silenceTimeoutSeconds = 30
    maxDurationSeconds = 900
    endCallMessage = "Merci d'avoir utilisé le configurateur AlloKoli ! Votre assistant vocal sera opérationnel sous peu. À bientôt !"
}

try {
    Write-Host "🔄 Création de l'assistant configurateur..." -ForegroundColor Cyan

    # Conversion en JSON
    $JsonPayload = $AssistantConfig | ConvertTo-Json -Depth 10

    Write-Host "📋 Payload préparé:" -ForegroundColor White
    $JsonPayload | Out-Host

    # Headers
    $Headers = @{
        "Authorization" = "Bearer $VapiApiKey"
        "Content-Type" = "application/json"
    }

    # Appel API
    Write-Host "🚀 Appel API Vapi..." -ForegroundColor Cyan
    $Response = Invoke-RestMethod -Uri $VapiApiUrl -Method POST -Headers $Headers -Body $JsonPayload

    Write-Host "✅ Assistant créé avec succès !" -ForegroundColor Green
    Write-Host "📋 Détails:" -ForegroundColor White
    Write-Host "   ID: $($Response.id)" -ForegroundColor Yellow
    Write-Host "   Nom: $($Response.name)" -ForegroundColor Yellow
    Write-Host "   URL: https://vapi.ai/assistants/$($Response.id)" -ForegroundColor Yellow

    # Sauvegarde de la configuration
    $ConfigFile = "assistant-configurateur-created.json"
    $Response | ConvertTo-Json -Depth 10 | Out-File $ConfigFile -Encoding UTF8
    Write-Host "💾 Configuration sauvegardée: $ConfigFile" -ForegroundColor Green

    Write-Host ""
    Write-Host "🎉 MISSION ACCOMPLIE !" -ForegroundColor Green
    Write-Host "🎯 Assistant configurateur AlloKoli opérationnel" -ForegroundColor Green
    Write-Host "📞 Testez avec l'ID: $($Response.id)" -ForegroundColor Yellow

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
            Write-Host "   Détails: $ErrorBody" -ForegroundColor Red
        } catch {
            Write-Host "   Impossible de lire les détails de l'erreur" -ForegroundColor Red
        }
    }
} 