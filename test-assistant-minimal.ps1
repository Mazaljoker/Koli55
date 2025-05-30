#!/usr/bin/env pwsh

# TEST ASSISTANT MINIMAL SANS TOOLS
# ==================================

Write-Host "🎯 TEST ASSISTANT MINIMAL SANS TOOLS" -ForegroundColor Green
Write-Host "=" * 50

$VapiApiUrl = "https://api.vapi.ai/assistant"
$VapiPrivateKey = "37e5584f-31ce-4f77-baf2-5684682079ea"

Write-Host "🔑 Test API Vapi avec assistant minimal" -ForegroundColor Cyan

try {
    Write-Host "`n🚀 Création assistant minimal..." -ForegroundColor Green

    # Assistant le plus simple possible
    $MinimalPayload = @{
        name = "Test Assistant AlloKoli"
        model = @{
            provider = "openai"
            model = "gpt-4o-mini"
            messages = @(
                @{
                    role = "system"
                    content = "Tu es un assistant test AlloKoli."
                }
            )
        }
        voice = @{
            provider = "azure"
            voiceId = "fr-FR-DeniseNeural"
        }
        firstMessage = "Bonjour, je suis un assistant test AlloKoli."
    } | ConvertTo-Json -Depth 5

    $Headers = @{
        "Authorization" = "Bearer $VapiPrivateKey"
        "Content-Type" = "application/json"
    }

    Write-Host "📡 Test API..." -ForegroundColor Cyan
    Write-Host "📋 Payload: $($MinimalPayload.Length) characters" -ForegroundColor Gray
    
    $Response = Invoke-RestMethod -Uri $VapiApiUrl -Method POST -Headers $Headers -Body $MinimalPayload

    Write-Host "✅ ASSISTANT MINIMAL CRÉÉ !" -ForegroundColor Green
    Write-Host "   🆔 ID: $($Response.id)" -ForegroundColor Yellow
    Write-Host "   📛 Nom: $($Response.name)" -ForegroundColor Yellow
    Write-Host "   🧪 Test: https://dashboard.vapi.ai/assistant/$($Response.id)/test" -ForegroundColor Cyan

    # Maintenant testons d'ajouter UN SEUL tool simple
    Write-Host "`n🔧 Test avec UN tool simple..." -ForegroundColor Yellow
    
    $SimpleToolPayload = @{
        name = "Test Assistant avec Tool"
        model = @{
            provider = "openai"
            model = "gpt-4o-mini"
            messages = @(
                @{
                    role = "system"
                    content = "Tu es un assistant test avec un outil."
                }
            )
        }
        voice = @{
            provider = "azure"
            voiceId = "fr-FR-DeniseNeural"
        }
        firstMessage = "Bonjour, je teste les tools."
        tools = @(
            @{
                type = "function"
                function = @{
                    name = "testFunction"
                    description = "Fonction de test"
                    parameters = @{
                        type = "object"
                        properties = @{
                            input = @{
                                type = "string"
                                description = "Test input"
                            }
                        }
                        required = @("input")
                    }
                }
                server = @{
                    url = "https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/configurator-tools?tool=analyzeBusinessContext"
                }
            }
        )
    } | ConvertTo-Json -Depth 8
    
    $ToolResponse = Invoke-RestMethod -Uri $VapiApiUrl -Method POST -Headers $Headers -Body $SimpleToolPayload
    
    Write-Host "✅ ASSISTANT AVEC TOOL CRÉÉ !" -ForegroundColor Green
    Write-Host "   🆔 ID: $($ToolResponse.id)" -ForegroundColor Yellow
    Write-Host "   🧪 Test: https://dashboard.vapi.ai/assistant/$($ToolResponse.id)/test" -ForegroundColor Cyan
    
    # Supprimer les assistants de test
    Write-Host "`n🗑️ Nettoyage..." -ForegroundColor Gray
    try {
        Invoke-RestMethod -Uri "$VapiApiUrl/$($Response.id)" -Method DELETE -Headers $Headers
        Invoke-RestMethod -Uri "$VapiApiUrl/$($ToolResponse.id)" -Method DELETE -Headers $Headers
        Write-Host "✅ Assistants de test supprimés" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Assistants non supprimés (normal)" -ForegroundColor Yellow
    }
    
    Write-Host "`n🎉 TESTS RÉUSSIS !" -ForegroundColor Green
    Write-Host "✅ API Vapi fonctionne" -ForegroundColor White
    Write-Host "✅ Clé Private Key valide" -ForegroundColor White
    Write-Host "✅ Structure tools basique OK" -ForegroundColor White
    Write-Host ""
    Write-Host "🎯 Maintenant créons le configurateur final..." -ForegroundColor Cyan

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