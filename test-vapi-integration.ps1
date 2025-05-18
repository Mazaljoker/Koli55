#!/usr/bin/env pwsh
# Script pour tester l'intégration avec l'API Vapi en utilisant différentes configurations d'assistant

# Configuration
$apiKey = "b913fdd5-3a43-423b-aff7-2b093b7b6759"  # La clé API Vapi du projet
$apiUrl = "https://api.vapi.ai"  # L'URL de base de l'API Vapi

Write-Host "=== Test d'intégration avec l'API Vapi ===" -ForegroundColor Cyan

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
            
            # Afficher seulement si c'est un petit corps
            if ($jsonBody.Length -lt 500) {
                Write-Host "Corps de la requête: $jsonBody" -ForegroundColor DarkGray
            } else {
                Write-Host "Corps de la requête: (trop long pour être affiché)" -ForegroundColor DarkGray
            }
        }
        
        # Effectuer l'appel avec Invoke-WebRequest pour accéder au corps des erreurs
        try {
            $webResponse = Invoke-WebRequest @params
            # Convertir la réponse en objet
            $response = $webResponse.Content | ConvertFrom-Json
            return $response
        }
        catch [System.Net.WebException] {
            $errorResponse = $_.Exception.Response
            $errorReader = [System.IO.StreamReader]::new($errorResponse.GetResponseStream())
            $errorContent = $errorReader.ReadToEnd()
            $errorReader.Close()
            
            try {
                $errorObject = $errorContent | ConvertFrom-Json
                Write-Host "Erreur détaillée:" -ForegroundColor Red
                Write-Host $errorContent -ForegroundColor Red
            }
            catch {
                Write-Host "Corps de l'erreur (brut): $errorContent" -ForegroundColor Red
            }
            return $null
        }
    }
    catch {
        Write-Host "Erreur lors de l'appel à $Endpoint" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host "Message: $($_.Exception.Message)" -ForegroundColor Red

        # Essayer de récupérer le corps de la réponse pour plus de détails
        try {
            if ($_.Exception.Response) {
                $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
                $reader.BaseStream.Position = 0
                $reader.DiscardBufferedData()
                $responseBody = $reader.ReadToEnd()
                Write-Host "Détails de l'erreur: $responseBody" -ForegroundColor Red
                try {
                    $errorObject = $responseBody | ConvertFrom-Json
                    if ($errorObject.message) {
                        Write-Host "Message d'erreur: $($errorObject.message)" -ForegroundColor Red
                    }
                    if ($errorObject.error) {
                        Write-Host "Erreur: $($errorObject.error)" -ForegroundColor Red
                    }
                }
                catch {}
            }
        }
        catch {
            Write-Host "Impossible de lire le corps de la réponse d'erreur" -ForegroundColor Red
        }
        
        return $null
    }
}

# Test 1: Configuration minimale
Write-Host "`n=== Test 1: Configuration minimale ===" -ForegroundColor Cyan
$assistantMinimal = @{
    name = "Assistant Test Minimal"
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

$createdAssistant1 = Invoke-VapiApi -Endpoint "/assistant" -Method "POST" -Body $assistantMinimal

if ($createdAssistant1) {
    $assistantId1 = $createdAssistant1.id
    Write-Host "✅ Succès: Assistant minimal créé avec ID: $assistantId1" -ForegroundColor Green
    
    # Test de récupération
    $retrievedAssistant1 = Invoke-VapiApi -Endpoint "/assistant/$assistantId1" -Method "GET"
    
    if ($retrievedAssistant1) {
        Write-Host "✅ Succès: Assistant minimal récupéré" -ForegroundColor Green
        
        # Test de suppression
        $deleteResult1 = Invoke-VapiApi -Endpoint "/assistant/$assistantId1" -Method "DELETE"
        
        if ($deleteResult1 -ne $null) {
            Write-Host "✅ Succès: Assistant minimal supprimé" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Échec: Impossible de supprimer l'assistant minimal" -ForegroundColor Red
        }
    }
    else {
        Write-Host "❌ Échec: Impossible de récupérer l'assistant minimal" -ForegroundColor Red
    }
}
else {
    Write-Host "❌ Échec: Impossible de créer l'assistant minimal" -ForegroundColor Red
}

# Test 2: Configuration avec ElevenLabs (11labs)
Write-Host "`n=== Test 2: Configuration avec ElevenLabs ===" -ForegroundColor Cyan
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
        provider = "11labs"  # Utiliser le nom correct pour ElevenLabs
        voiceId = "21m00Tcm4TlvDq8ikWAM"  # ID de voix Rachel d'ElevenLabs
        speed = 1.0
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

# Test 3: Configuration avec plans avancés
Write-Host "`n=== Test 3: Configuration avec plans avancés ===" -ForegroundColor Cyan
$assistantAdvanced = @{
    name = "Assistant Test Avancé"
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
    firstMessageInterruptionsEnabled = $true
    analysisPlan = @{
        summaryEnabled = $true
        topicsEnabled = $true
        entitiesEnabled = $true
    }
    startSpeakingPlan = @{
        confidenceThreshold = 0.5
        delayMs = 200
    }
    stopSpeakingPlan = @{
        confidenceThreshold = 0.8
        delayMs = 100
        waitForPauseInInterruption = $true
    }
    messagePlan = @{
        idleMessages = @(
            "Êtes-vous toujours là?", 
            "Avez-vous besoin d'aide?"
        )
        idleMessageIntervalSeconds = 15
    }
}

$createdAssistant3 = Invoke-VapiApi -Endpoint "/assistant" -Method "POST" -Body $assistantAdvanced

if ($createdAssistant3) {
    $assistantId3 = $createdAssistant3.id
    Write-Host "✅ Succès: Assistant avancé créé avec ID: $assistantId3" -ForegroundColor Green
    
    # Test de récupération
    $retrievedAssistant3 = Invoke-VapiApi -Endpoint "/assistant/$assistantId3" -Method "GET"
    
    if ($retrievedAssistant3) {
        Write-Host "✅ Succès: Assistant avancé récupéré" -ForegroundColor Green
        Write-Host "Configuration analysisPlan: $($retrievedAssistant3.analysisPlan | ConvertTo-Json -Depth 2)" -ForegroundColor Green
        Write-Host "Configuration messagePlan: $($retrievedAssistant3.messagePlan | ConvertTo-Json -Depth 2)" -ForegroundColor Green
        
        # Test de suppression
        $deleteResult3 = Invoke-VapiApi -Endpoint "/assistant/$assistantId3" -Method "DELETE"
        
        if ($deleteResult3 -ne $null) {
            Write-Host "✅ Succès: Assistant avancé supprimé" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Échec: Impossible de supprimer l'assistant avancé" -ForegroundColor Red
        }
    }
    else {
        Write-Host "❌ Échec: Impossible de récupérer l'assistant avancé" -ForegroundColor Red
    }
}
else {
    Write-Host "❌ Échec: Impossible de créer l'assistant avancé" -ForegroundColor Red
}

# Test 4: Mise à jour d'un assistant
Write-Host "`n=== Test 4: Mise à jour d'un assistant ===" -ForegroundColor Cyan
$assistantInitial = @{
    name = "Assistant Test pour Mise à Jour"
    model = @{
        provider = "openai"
        model = "gpt-4o"
        messages = @(
            @{
                role = "system"
                content = "Tu es un assistant standard."
            }
        )
    }
    voice = @{
        provider = "azure"
        voiceId = "fr-FR-DeniseNeural"
    }
    firstMessage = "Bonjour, comment puis-je vous aider?"
}

$createdAssistant4 = Invoke-VapiApi -Endpoint "/assistant" -Method "POST" -Body $assistantInitial

if ($createdAssistant4) {
    $assistantId4 = $createdAssistant4.id
    Write-Host "✅ Succès: Assistant initial créé avec ID: $assistantId4" -ForegroundColor Green
    
    # Données de mise à jour
    $updateData = @{
        name = "Assistant Test Mis à Jour"
        firstMessage = "Bonjour, je suis l'assistant mis à jour. Comment puis-je vous aider aujourd'hui?"
        model = @{
            messages = @(
                @{
                    role = "system"
                    content = "Tu es un assistant francophone professionnel et serviable."
                }
            )
        }
        messagePlan = @{
            idleMessages = @("Êtes-vous toujours là?")
            idleMessageIntervalSeconds = 20
        }
    }
    
    # Test de mise à jour
    $updatedAssistant = Invoke-VapiApi -Endpoint "/assistant/$assistantId4" -Method "PATCH" -Body $updateData
    
    if ($updatedAssistant) {
        Write-Host "✅ Succès: Assistant mis à jour" -ForegroundColor Green
        Write-Host "Nouveau nom: $($updatedAssistant.name)" -ForegroundColor Green
        Write-Host "Nouveau premier message: $($updatedAssistant.firstMessage)" -ForegroundColor Green
        
        if ($updatedAssistant.messagePlan) {
            Write-Host "Configuration messagePlan ajoutée: $($updatedAssistant.messagePlan | ConvertTo-Json -Depth 2)" -ForegroundColor Green
        }
        
        # Test de suppression
        $deleteResult4 = Invoke-VapiApi -Endpoint "/assistant/$assistantId4" -Method "DELETE"
        
        if ($deleteResult4 -ne $null) {
            Write-Host "✅ Succès: Assistant mis à jour supprimé" -ForegroundColor Green
        }
        else {
            Write-Host "❌ Échec: Impossible de supprimer l'assistant mis à jour" -ForegroundColor Red
        }
    }
    else {
        Write-Host "❌ Échec: Impossible de mettre à jour l'assistant" -ForegroundColor Red
    }
}
else {
    Write-Host "❌ Échec: Impossible de créer l'assistant initial pour la mise à jour" -ForegroundColor Red
}

Write-Host "`n=== Résumé des tests d'intégration ===" -ForegroundColor Cyan
Write-Host "Tous les tests ont été exécutés. Vérifiez les résultats ci-dessus pour voir si l'intégration avec l'API Vapi fonctionne correctement." -ForegroundColor White 