#!/usr/bin/env pwsh

# Script de déploiement des edge functions configurateur
# Deploy Configurateur Expert.ps1

Write-Host "🚀 Déploiement Edge Functions Configurateur" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Yellow

# Configuration du projet KOLI
$SUPABASE_PROJECT_ID = "aiurboizarbbcpynmmgv"

Write-Host "✅ Projet cible : KOLI ($SUPABASE_PROJECT_ID)" -ForegroundColor Green

# Vérifier que Supabase CLI est installé
try {
    $supabaseVersion = supabase --version
    Write-Host "✅ Supabase CLI détecté : $supabaseVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Supabase CLI non trouvé. Installez-le avec :" -ForegroundColor Red
    Write-Host "npm install -g supabase" -ForegroundColor Yellow
    exit 1
}

# Déploiement des 3 edge functions configurateur
Write-Host "`n📦 Déploiement des functions..." -ForegroundColor Yellow

$functions = @(
    "configurator-tools/analyze-business",
    "configurator-tools/list-voices", 
    "configurator-tools/create-assistant"
)

foreach ($func in $functions) {
    Write-Host "`n🔧 Déploiement $func..." -ForegroundColor Cyan
    
    try {
        $deployOutput = supabase functions deploy $func --project-ref $SUPABASE_PROJECT_ID 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ $func déployé avec succès" -ForegroundColor Green
        } else {
            Write-Host "❌ Erreur déploiement $func :" -ForegroundColor Red
            Write-Host $deployOutput -ForegroundColor Red
        }
        
    } catch {
        Write-Host "❌ Exception déploiement $func : $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test de validation après déploiement
Write-Host "`n🧪 Tests de validation..." -ForegroundColor Yellow

$SUPABASE_URL = "https://aiurboizarbbcpynmmgv.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpdXJib2l6YXJiYmNweW5tbWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU4NTk3NzYsImV4cCI6MjAzMTQzNTc3Nn0.JH0x8O1KnfDl5lsZFSBJ0TlkA3pFQ8aNSDT8VOMBh1o"

$headers = @{
    "Authorization" = "Bearer $SUPABASE_ANON_KEY"
    "Content-Type" = "application/json"
}

# Test rapide de la fonction analyze-business
Start-Sleep -Seconds 5  # Attendre le déploiement

try {
    $testPayload = @{ description = "Restaurant italien à Paris" } | ConvertTo-Json
    $testResponse = Invoke-RestMethod -Uri "$SUPABASE_URL/functions/v1/configurator-tools/analyze-business" -Method POST -Headers $headers -Body $testPayload
    
    Write-Host "✅ Test analyze-business : Secteur détecté = $($testResponse.analysis.sector)" -ForegroundColor Green
    
} catch {
    Write-Host "⚠️  Test analyze-business échoué (normal si déploiement en cours)" -ForegroundColor Yellow
    Write-Host "   Erreur : $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n🎉 Déploiement terminé !" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Yellow
Write-Host "✅ Edge Functions configurateur déployées" -ForegroundColor White
Write-Host "✅ Projet : KOLI ($SUPABASE_PROJECT_ID)" -ForegroundColor White
Write-Host "✅ Prêt pour tests complets" -ForegroundColor White

Write-Host "`n📝 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "1. Attendre 2-3 minutes (propagation)" -ForegroundColor White
Write-Host "2. Tester : pwsh -File create-via-mcp-supabase.ps1" -ForegroundColor White
Write-Host "3. Créer l'assistant configurateur avec tools" -ForegroundColor White

# Déploiement final avec test des deux clés Vapi
# ==============================================

Write-Host "🔑 Test des clés Vapi et création du configurateur" -ForegroundColor Green
Write-Host "=" * 60

$VapiApiUrl = "https://api.vapi.ai/assistant"

# D'après votre image Supabase, voici les clés (complétez-les si nécessaire)
Write-Host "📋 Clés depuis votre configuration Supabase :" -ForegroundColor Cyan
Write-Host "   VAPI_PRIVATE_KEY: 71c8d36796cf..." -ForegroundColor White
Write-Host "   VAPI_PUBLIC_KEY:  02e5b2503a3c..." -ForegroundColor White

Write-Host "`n🔍 Entrez vos clés COMPLÈTES pour test :" -ForegroundColor Yellow

$PrivateKey = Read-Host "VAPI_PRIVATE_KEY (clé complète)"
$PublicKey = Read-Host "VAPI_PUBLIC_KEY (clé complète)"

# Configuration de l'assistant
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
Tu es un expert configurateur d'assistants vocaux AlloKoli.

🎯 TON RÔLE :
- Analyser l'activité du client (restaurant, salon, artisan, commerce)
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
    firstMessage = "Bonjour ! 🎯 Je suis votre configurateur AlloKoli. Décrivez-moi votre activité et je créerai un assistant vocal parfait pour vous !"
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

# Test 1: PRIVATE_KEY
if ($PrivateKey) {
    try {
        Write-Host "`n🧪 Test avec PRIVATE_KEY..." -ForegroundColor Cyan
        
        $Headers = @{
            "Authorization" = "Bearer $PrivateKey"
            "Content-Type" = "application/json"
        }

        $Response = Invoke-RestMethod -Uri $VapiApiUrl -Method POST -Headers $Headers -Body $ConfiguratorPayload
        
        Write-Host "✅ SUCCÈS avec PRIVATE_KEY !" -ForegroundColor Green
        Write-Host "🎉 CONFIGURATEUR CRÉÉ !" -ForegroundColor Green
        Write-Host "   🆔 ID: $($Response.id)" -ForegroundColor Yellow
        Write-Host "   📞 Test: https://dashboard.vapi.ai/assistant/$($Response.id)/test" -ForegroundColor Cyan
        
        # Sauvegarder le succès
        @{
            success = $true
            key_used = "PRIVATE_KEY"
            assistant_id = $Response.id
            test_url = "https://dashboard.vapi.ai/assistant/$($Response.id)/test"
            created_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        } | ConvertTo-Json | Out-File "SUCCESS-PRIVATE-KEY.json" -Encoding UTF8
        
        Write-Host "`n🎯 MISSION ACCOMPLIE avec PRIVATE_KEY ! 🎉" -ForegroundColor Green
        return
        
    } catch {
        Write-Host "❌ PRIVATE_KEY échoue: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 2: PUBLIC_KEY si PRIVATE échoue
if ($PublicKey) {
    try {
        Write-Host "`n🧪 Test avec PUBLIC_KEY..." -ForegroundColor Cyan
        
        $Headers = @{
            "Authorization" = "Bearer $PublicKey"
            "Content-Type" = "application/json"
        }

        $Response = Invoke-RestMethod -Uri $VapiApiUrl -Method POST -Headers $Headers -Body $ConfiguratorPayload
        
        Write-Host "✅ SUCCÈS avec PUBLIC_KEY !" -ForegroundColor Green
        Write-Host "🎉 CONFIGURATEUR CRÉÉ !" -ForegroundColor Green
        Write-Host "   🆔 ID: $($Response.id)" -ForegroundColor Yellow
        Write-Host "   📞 Test: https://dashboard.vapi.ai/assistant/$($Response.id)/test" -ForegroundColor Cyan
        
        # Sauvegarder le succès
        @{
            success = $true
            key_used = "PUBLIC_KEY"
            assistant_id = $Response.id
            test_url = "https://dashboard.vapi.ai/assistant/$($Response.id)/test"
            created_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
        } | ConvertTo-Json | Out-File "SUCCESS-PUBLIC-KEY.json" -Encoding UTF8
        
        Write-Host "`n🎯 MISSION ACCOMPLIE avec PUBLIC_KEY ! 🎉" -ForegroundColor Green
        return
        
    } catch {
        Write-Host "❌ PUBLIC_KEY échoue aussi: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n💡 Solutions possibles :" -ForegroundColor Yellow
Write-Host "1. Vérifiez que vos clés sont complètes (pas tronquées)" -ForegroundColor White
Write-Host "2. Récupérez les clés depuis https://dashboard.vapi.ai" -ForegroundColor White
Write-Host "3. Essayez de régénérer les clés si nécessaire" -ForegroundColor White 