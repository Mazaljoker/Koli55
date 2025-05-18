#!/usr/bin/env pwsh
# Script simplifié pour tester les fonctionnalités de base de l'API Vapi

# Configuration
$apiKey = "b913fdd5-3a43-423b-aff7-2b093b7b6759"  # La clé API Vapi du projet
$apiUrl = "https://api.vapi.ai"  # L'URL de base de l'API Vapi

Write-Host "=== Test des fonctionnalités de base de l'API Vapi ===" -ForegroundColor Cyan

# Fonction pour appeler l'API Vapi
function Invoke-VapiApi {
    param (
        [string]$Endpoint,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    # S'assurer que l'endpoint commence par / si ce n'est pas le cas
    if (-not $Endpoint.StartsWith("/")) {
        $Endpoint = "/$Endpoint"
    }
    
    # Construire l'URL complète
    $url = "$apiUrl$Endpoint"
    
    # Préparer les en-têtes
    $headers = @{
        "Authorization" = "Bearer $apiKey"
        "Content-Type" = "application/json"
        "Accept" = "application/json"
    }
    
    Write-Host "Appel API: $Method $url" -ForegroundColor DarkGray
    
    try {
        $params = @{
            Uri = $url
            Method = $Method
            Headers = $headers
            ContentType = "application/json"
            ErrorAction = "Stop"
        }
        
        # Ajouter le corps de la requête si nécessaire
        if ($Body -and ($Method -eq "POST" -or $Method -eq "PUT" -or $Method -eq "PATCH")) {
            $jsonBody = $Body | ConvertTo-Json -Depth 10
            $params.Body = $jsonBody
            Write-Host "Corps de la requête: $jsonBody" -ForegroundColor DarkGray
        }
        
        # Effectuer l'appel
        $webResponse = Invoke-WebRequest @params
        # Convertir la réponse en objet
        $response = $webResponse.Content | ConvertFrom-Json
        return $response
    }
    catch {
        Write-Host "Erreur lors de l'appel à $Endpoint" -ForegroundColor Red
        
        if ($_.Exception.Response) {
            Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        }
        
        Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red
        
        return $null
    }
}

# Test 1: Configuration avec Azure (Fonctionne)
Write-Host "`n=== Test 1: Configuration avec Azure ===" -ForegroundColor Cyan
$assistantAzure = @{
    name = "Assistant Test Azure"
    model = @{
        provider = "openai"
        model = "gpt-4o"
        messages = @(
            @{
                role = "system"
                content = "Tu es un assistant francophone serviable."
            }
        )
    }
    voice = @{
        provider = "azure"
        voiceId = "fr-FR-DeniseNeural"
    }
    firstMessage = "Bonjour, comment puis-je vous aider aujourd'hui?"
}

$createdAssistant1 = Invoke-VapiApi -Endpoint "/assistant" -Method "POST" -Body $assistantAzure

if ($createdAssistant1) {
    $assistantId1 = $createdAssistant1.id
    Write-Host "✅ Succès: Assistant Azure créé avec ID: $assistantId1" -ForegroundColor Green
    
    # Test de récupération
    $retrievedAssistant1 = Invoke-VapiApi -Endpoint "/assistant/$assistantId1" -Method "GET"
    
    if ($retrievedAssistant1) {
        Write-Host "✅ Succès: Assistant Azure récupéré" -ForegroundColor Green
        
        # Test de mise à jour simple
        $updateData = @{
            name = "Assistant Azure Mis à Jour"
            firstMessage = "Bonjour, je suis l'assistant mis à jour. Comment puis-je vous aider?"
        }
        
        $updatedAssistant = Invoke-VapiApi -Endpoint "/assistant/$assistantId1" -Method "PATCH" -Body $updateData
        
        if ($updatedAssistant) {
            Write-Host "✅ Succès: Assistant Azure mis à jour" -ForegroundColor Green
            Write-Host "Nouveau nom: $($updatedAssistant.name)" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Échec: Impossible de mettre à jour l'assistant Azure" -ForegroundColor Red
        }
        
        # Test de suppression
        $deleteResult1 = Invoke-VapiApi -Endpoint "/assistant/$assistantId1" -Method "DELETE"
        
        if ($deleteResult1 -ne $null) {
            Write-Host "✅ Succès: Assistant Azure supprimé" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Échec: Impossible de supprimer l'assistant Azure" -ForegroundColor Red
        }
    }
    else {
        Write-Host "❌ Échec: Impossible de récupérer l'assistant Azure" -ForegroundColor Red
    }
}
else {
    Write-Host "❌ Échec: Impossible de créer l'assistant Azure" -ForegroundColor Red
}

# Test 2: Configuration avec ElevenLabs (Fonctionne)
Write-Host "`n=== Test 2: Configuration avec ElevenLabs (11labs) ===" -ForegroundColor Cyan
$assistantElevenLabs = @{
    name = "Assistant Test ElevenLabs"
    model = @{
        provider = "openai"
        model = "gpt-4o"
        messages = @(
            @{
                role = "system"
                content = "Tu es un assistant francophone serviable."
            }
        )
    }
    voice = @{
        provider = "11labs"  # Nom correct pour ElevenLabs
        voiceId = "21m00Tcm4TlvDq8ikWAM"  # ID de voix Rachel
    }
    firstMessage = "Bonjour, comment puis-je vous aider aujourd'hui?"
}

$createdAssistant2 = Invoke-VapiApi -Endpoint "/assistant" -Method "POST" -Body $assistantElevenLabs

if ($createdAssistant2) {
    $assistantId2 = $createdAssistant2.id
    Write-Host "✅ Succès: Assistant ElevenLabs créé avec ID: $assistantId2" -ForegroundColor Green
    
    # Test de récupération
    $retrievedAssistant2 = Invoke-VapiApi -Endpoint "/assistant/$assistantId2" -Method "GET"
    
    if ($retrievedAssistant2) {
        Write-Host "✅ Succès: Assistant ElevenLabs récupéré" -ForegroundColor Green
        Write-Host "Configuration de voix: $($retrievedAssistant2.voice | ConvertTo-Json -Depth 2)" -ForegroundColor Green
        
        # Test de suppression
        $deleteResult2 = Invoke-VapiApi -Endpoint "/assistant/$assistantId2" -Method "DELETE"
        
        if ($deleteResult2 -ne $null) {
            Write-Host "✅ Succès: Assistant ElevenLabs supprimé" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Échec: Impossible de supprimer l'assistant ElevenLabs" -ForegroundColor Red
        }
    }
    else {
        Write-Host "❌ Échec: Impossible de récupérer l'assistant ElevenLabs" -ForegroundColor Red
    }
}
else {
    Write-Host "❌ Échec: Impossible de créer l'assistant ElevenLabs" -ForegroundColor Red
}

# Test 3: Configuration avec plan de message simple
Write-Host "`n=== Test 3: Configuration avec plan de message simple ===" -ForegroundColor Cyan
$assistantWithIdleMessage = @{
    name = "Assistant avec Message d'Inactivité"
    model = @{
        provider = "openai"
        model = "gpt-4o"
        messages = @(
            @{
                role = "system"
                content = "Tu es un assistant francophone serviable."
            }
        )
    }
    voice = @{
        provider = "azure"
        voiceId = "fr-FR-DeniseNeural"
    }
    firstMessage = "Bonjour, comment puis-je vous aider aujourd'hui?"
    messagePlan = @{
        idleMessages = @("Êtes-vous toujours là?")
        idleMessageIntervalSeconds = 20
    }
}

$createdAssistant3 = Invoke-VapiApi -Endpoint "/assistant" -Method "POST" -Body $assistantWithIdleMessage

if ($createdAssistant3) {
    $assistantId3 = $createdAssistant3.id
    Write-Host "✅ Succès: Assistant avec message d'inactivité créé avec ID: $assistantId3" -ForegroundColor Green
    
    # Test de récupération
    $retrievedAssistant3 = Invoke-VapiApi -Endpoint "/assistant/$assistantId3" -Method "GET"
    
    if ($retrievedAssistant3) {
        Write-Host "✅ Succès: Assistant avec message d'inactivité récupéré" -ForegroundColor Green
        
        if ($retrievedAssistant3.messagePlan) {
            Write-Host "Configuration messagePlan: $($retrievedAssistant3.messagePlan | ConvertTo-Json -Depth 2)" -ForegroundColor Green
        }
        
        # Test de suppression
        $deleteResult3 = Invoke-VapiApi -Endpoint "/assistant/$assistantId3" -Method "DELETE"
        
        if ($deleteResult3 -ne $null) {
            Write-Host "✅ Succès: Assistant avec message d'inactivité supprimé" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Échec: Impossible de supprimer l'assistant avec message d'inactivité" -ForegroundColor Red
        }
    }
    else {
        Write-Host "❌ Échec: Impossible de récupérer l'assistant avec message d'inactivité" -ForegroundColor Red
    }
}
else {
    Write-Host "❌ Échec: Impossible de créer l'assistant avec message d'inactivité" -ForegroundColor Red
}

Write-Host "`n=== Résumé des tests de base ===" -ForegroundColor Cyan
Write-Host "Les tests de base ont été exécutés. Vérifiez les résultats ci-dessus pour voir les fonctionnalités qui fonctionnent correctement." -ForegroundColor White 