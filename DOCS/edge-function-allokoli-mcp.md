# Edge Function AlloKoli MCP

## Vue d'ensemble

L'Edge Function `allokoli-mcp` expose les fonctionnalités du serveur MCP AlloKoli via une API REST, permettant à l'assistant configurateur et aux applications frontend de créer et gérer des assistants vocaux.

## URL de base

```
https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/allokoli-mcp
```

## Authentification

L'Edge Function supporte l'authentification optionnelle via le header `Authorization`:

```
Authorization: Bearer <supabase_jwt_token>
```

Si aucun token n'est fourni, l'utilisateur sera considéré comme `anonymous`.

## Endpoints disponibles

### 1. Créer un assistant complet

**POST** `/allokoli-mcp/create-assistant`

Crée un assistant avec provisioning automatique d'un numéro de téléphone.

#### Payload

```json
{
  "assistantName": "Assistant Restaurant Le Gourmet",
  "businessType": "restaurant",
  "assistantTone": "chaleureux et gourmand",
  "firstMessage": "Bonjour ! Bienvenue au Restaurant Le Gourmet. Comment puis-je vous aider aujourd'hui ?",
  "systemPromptCore": "Tu es l'assistant vocal du Restaurant Le Gourmet, spécialisé dans la cuisine française traditionnelle...",
  "canTakeReservations": true,
  "canTakeAppointments": false,
  "canTransferCall": true,
  "companyName": "Restaurant Le Gourmet",
  "address": "123 Rue de la Gastronomie, 75001 Paris",
  "phoneNumber": "+33 1 23 45 67 89",
  "email": "contact@legourmet.fr",
  "openingHours": "Mardi-Samedi 12h-14h et 19h-22h",
  "provisionPhone": true
}
```

#### Réponse

```json
{
  "success": true,
  "assistant": {
    "id": "uuid-assistant",
    "name": "Assistant Restaurant Le Gourmet",
    "vapiId": "vapi-assistant-id",
    "phoneNumber": "+33 1 XX XX XX XX"
  },
  "message": "Assistant créé avec succès"
}
```

### 2. Lister les assistants

**GET** `/allokoli-mcp/assistants?page=1&limit=10&search=restaurant&sector=restaurant`

#### Paramètres de requête

- `page` (optionnel): Numéro de page (défaut: 1)
- `limit` (optionnel): Nombre d'éléments par page (défaut: 10)
- `search` (optionnel): Recherche par nom
- `sector` (optionnel): Filtrer par secteur d'activité

#### Réponse

```json
{
  "success": true,
  "assistants": [
    {
      "id": "uuid-1",
      "name": "Assistant Restaurant Le Gourmet",
      "business_type": "restaurant",
      "is_active": true,
      "created_at": "2024-01-15T10:30:00Z",
      "vapi_assistant_id": "vapi-id",
      "provisioned_phone_number": "+33 1 XX XX XX XX"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### 3. Récupérer un assistant

**GET** `/allokoli-mcp/assistants/{assistantId}`

#### Réponse

```json
{
  "success": true,
  "assistant": {
    "id": "uuid-assistant",
    "name": "Assistant Restaurant Le Gourmet",
    "system_prompt": "Tu es l'assistant vocal...",
    "first_message": "Bonjour ! Bienvenue...",
    "business_type": "restaurant",
    "assistant_tone": "chaleureux et gourmand",
    "can_take_reservations": true,
    "can_take_appointments": false,
    "can_transfer_call": true,
    "company_name": "Restaurant Le Gourmet",
    "address": "123 Rue de la Gastronomie, 75001 Paris",
    "phone_number": "+33 1 23 45 67 89",
    "email": "contact@legourmet.fr",
    "opening_hours": "Mardi-Samedi 12h-14h et 19h-22h",
    "is_active": true,
    "vapi_assistant_id": "vapi-id",
    "provisioned_phone_number": "+33 1 XX XX XX XX",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

### 4. Mettre à jour un assistant

**PUT** `/allokoli-mcp/assistants/{assistantId}`

#### Payload

```json
{
  "name": "Nouveau nom",
  "system_prompt": "Nouveau prompt système",
  "first_message": "Nouveau message d'accueil",
  "is_active": false
}
```

#### Réponse

```json
{
  "success": true,
  "assistant": {
    "id": "uuid-assistant",
    "name": "Nouveau nom",
    // ... autres propriétés mises à jour
  },
  "message": "Assistant mis à jour avec succès"
}
```

### 5. Provisionner un numéro de téléphone

**POST** `/allokoli-mcp/provision-phone`

#### Payload

```json
{
  "country": "FR",
  "areaCode": "01",
  "contains": "123"
}
```

#### Réponse

```json
{
  "success": true,
  "phoneNumber": "+33 1 XX XX XX XX",
  "sid": "twilio-sid",
  "message": "Numéro provisionné avec succès"
}
```

### 6. Vérification de santé

**GET** `/allokoli-mcp/health`

#### Réponse

```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "version": "1.0.0"
}
```

## Exemples d'utilisation pour l'assistant configurateur

### Exemple 1: Création d'un assistant restaurant via l'assistant configurateur

```javascript
// Dans le code de l'assistant configurateur
async function createRestaurantAssistant(userInput) {
  const payload = {
    assistantName: `Assistant ${userInput.restaurantName}`,
    businessType: "restaurant",
    assistantTone: "chaleureux et gourmand",
    firstMessage: `Bonjour ! Bienvenue chez ${userInput.restaurantName}. Comment puis-je vous aider aujourd'hui ?`,
    systemPromptCore: generateRestaurantPrompt(userInput),
    canTakeReservations: true,
    canTransferCall: true,
    companyName: userInput.restaurantName,
    address: userInput.address,
    phoneNumber: userInput.phoneNumber,
    email: userInput.email,
    openingHours: userInput.openingHours
  };

  const response = await fetch('https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/allokoli-mcp/create-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify(payload)
  });

  const result = await response.json();
  
  if (result.success) {
    return `✅ Assistant créé avec succès !
    
📞 Numéro de téléphone: ${result.assistant.phoneNumber}
🤖 ID Vapi: ${result.assistant.vapiId}
📋 ID Assistant: ${result.assistant.id}

Votre assistant est maintenant prêt à recevoir des appels !`;
  } else {
    throw new Error(result.error);
  }
}
```

### Exemple 2: Intégration avec le configurateur frontend

```typescript
// Dans le composant React du configurateur
import { useState } from 'react';

export function AssistantConfigurator() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleCreateAssistant = async (formData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      setResult(result);
    } catch (error) {
      console.error('Erreur création assistant:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Formulaire de configuration */}
      <AssistantForm onSubmit={handleCreateAssistant} />
      
      {loading && <LoadingSpinner />}
      
      {result && (
        <AssistantResult 
          assistant={result.assistant}
          phoneNumber={result.assistant.phoneNumber}
        />
      )}
    </div>
  );
}
```

### Exemple 3: Utilisation avec l'assistant configurateur MCP

```javascript
// Fonction appelée par l'assistant configurateur MCP
async function handleConfiguratorRequest(userMessage) {
  // Parser le message utilisateur pour extraire les informations
  const config = parseUserConfiguration(userMessage);
  
  // Appeler l'Edge Function
  const response = await fetch('https://aiurboizarbbcpynmmgv.supabase.co/functions/v1/allokoli-mcp/create-assistant', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(config)
  });
  
  const result = await response.json();
  
  if (result.success) {
    return {
      content: [{
        type: "text",
        text: `🎉 Assistant créé avec succès !
        
📋 **Détails de l'assistant:**
- Nom: ${result.assistant.name}
- ID: ${result.assistant.id}
- Numéro: ${result.assistant.phoneNumber || 'Non provisionné'}

✅ L'assistant est maintenant opérationnel et prêt à recevoir des appels !`
      }]
    };
  } else {
    return {
      content: [{
        type: "text",
        text: `❌ Erreur lors de la création: ${result.error}`
      }],
      isError: true
    };
  }
}
```

## Déploiement

Pour déployer l'Edge Function:

```bash
# Déployer la fonction
supabase functions deploy allokoli-mcp

# Configurer les variables d'environnement
supabase secrets set VAPI_API_KEY=your_vapi_key
supabase secrets set TWILIO_ACCOUNT_SID=your_twilio_sid
supabase secrets set TWILIO_AUTH_TOKEN=your_twilio_token
```

## Variables d'environnement requises

- `SUPABASE_URL`: URL du projet Supabase
- `SUPABASE_SERVICE_ROLE_KEY`: Clé de service Supabase
- `VAPI_API_KEY`: Clé API Vapi (optionnel)
- `TWILIO_ACCOUNT_SID`: SID du compte Twilio (optionnel)
- `TWILIO_AUTH_TOKEN`: Token d'authentification Twilio (optionnel)

## Gestion des erreurs

L'Edge Function retourne des erreurs structurées:

```json
{
  "error": "Message d'erreur descriptif",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

Les codes de statut HTTP utilisés:
- `200`: Succès
- `400`: Erreur de validation
- `404`: Ressource non trouvée
- `500`: Erreur interne du serveur

## Sécurité

- Support CORS pour les requêtes cross-origin
- Authentification optionnelle via JWT Supabase
- Validation des paramètres d'entrée
- Gestion sécurisée des clés API externes 