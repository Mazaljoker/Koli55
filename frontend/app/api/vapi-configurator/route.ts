// frontend/app/api/vapi-configurator/route.ts
import { NextRequest, NextResponse } from "next/server";

const VAPI_BASE_URL = "https://api.vapi.ai";
const VAPI_PRIVATE_KEY = process.env.VAPI_PRIVATE_KEY;
const ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID;

interface VapiRequestBody {
  action:
    | "start-call"
    | "end-call"
    | "send-message"
    | "get-call-status"
    | "update-assistant";
  callId?: string;
  message?: string;
  assistantConfig?: any;
  phoneNumber?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: VapiRequestBody = await request.json();

    if (!VAPI_PRIVATE_KEY) {
      return NextResponse.json(
        { success: false, error: "Configuration Vapi manquante" },
        { status: 500 }
      );
    }

    const headers = {
      Authorization: `Bearer ${VAPI_PRIVATE_KEY}`,
      "Content-Type": "application/json",
    };

    switch (body.action) {
      case "start-call":
        return await startCall(body, headers);

      case "end-call":
        return await endCall(body, headers);

      case "send-message":
        return await sendMessage(body, headers);

      case "get-call-status":
        return await getCallStatus(body, headers);

      case "update-assistant":
        return await updateAssistant(body, headers);

      default:
        return NextResponse.json(
          { success: false, error: "Action non supportée" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Erreur API Vapi:", error);
    return NextResponse.json(
      { success: false, error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

async function startCall(
  body: VapiRequestBody,
  headers: Record<string, string>
) {
  try {
    const response = await fetch(`${VAPI_BASE_URL}/call`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        assistantId: ASSISTANT_ID,
        customer: {
          number: body.phoneNumber || undefined,
        },
        // Configuration spécifique pour le configurateur
        assistantOverrides: {
          firstMessage:
            "Bonjour ! Je suis votre assistant configurateur AlloKoli. Je vais vous aider à créer votre assistant vocal en quelques minutes. Commençons par le nom de votre restaurant !",
          model: {
            model: "gpt-4-turbo",
            temperature: 0.7,
            systemMessage: `Tu es un assistant configurateur AlloKoli spécialisé dans la création d'assistants vocaux pour restaurants. 

OBJECTIF: Guider l'utilisateur pour créer son assistant vocal en collectant les informations suivantes dans l'ordre:
1. Nom du restaurant
2. Type de cuisine 
3. Services proposés (livraison, click & collect, réservations, etc.)
4. Horaires d'ouverture
5. Spécialités de la maison
6. Génération de la configuration finale

INSTRUCTIONS:
- Pose UNE question à la fois
- Sois chaleureux et professionnel
- Adapte tes questions selon les réponses
- Confirme chaque information avant de passer à la suivante
- À la fin, résume la configuration complète

FONCTIONS DISPONIBLES:
- update_step(step: number) : pour indiquer l'étape actuelle
- save_config(data: object) : pour sauvegarder la configuration finale

Commence par demander le nom du restaurant.`,
          },
          voice: {
            provider: "11labs",
            voiceId: "jennifer",
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Vapi start call:", errorText);
      return NextResponse.json(
        { success: false, error: "Erreur lors du démarrage de l'appel" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: {
        callId: data.id,
        status: data.status,
        message: "Appel démarré avec succès",
      },
    });
  } catch (error) {
    console.error("Erreur start call:", error);
    return NextResponse.json(
      { success: false, error: "Erreur de connexion Vapi" },
      { status: 500 }
    );
  }
}

async function endCall(body: VapiRequestBody, headers: Record<string, string>) {
  if (!body.callId) {
    return NextResponse.json(
      { success: false, error: "ID d'appel requis" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${VAPI_BASE_URL}/call/${body.callId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        status: "ended",
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Vapi end call:", errorText);
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'arrêt de l'appel" },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: { message: "Appel terminé avec succès" },
    });
  } catch (error) {
    console.error("Erreur end call:", error);
    return NextResponse.json(
      { success: false, error: "Erreur de connexion Vapi" },
      { status: 500 }
    );
  }
}

async function sendMessage(
  body: VapiRequestBody,
  headers: Record<string, string>
) {
  if (!body.callId || !body.message) {
    return NextResponse.json(
      { success: false, error: "ID d'appel et message requis" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${VAPI_BASE_URL}/call/${body.callId}/messages`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          type: "text",
          content: body.message,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Vapi send message:", errorText);
      return NextResponse.json(
        { success: false, error: "Erreur lors de l'envoi du message" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: { messageId: data.id, message: "Message envoyé avec succès" },
    });
  } catch (error) {
    console.error("Erreur send message:", error);
    return NextResponse.json(
      { success: false, error: "Erreur de connexion Vapi" },
      { status: 500 }
    );
  }
}

async function getCallStatus(
  body: VapiRequestBody,
  headers: Record<string, string>
) {
  if (!body.callId) {
    return NextResponse.json(
      { success: false, error: "ID d'appel requis" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${VAPI_BASE_URL}/call/${body.callId}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Vapi get status:", errorText);
      return NextResponse.json(
        { success: false, error: "Erreur lors de la récupération du statut" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: {
        status: data.status,
        duration: data.duration,
        cost: data.cost,
        transcript: data.transcript,
      },
    });
  } catch (error) {
    console.error("Erreur get status:", error);
    return NextResponse.json(
      { success: false, error: "Erreur de connexion Vapi" },
      { status: 500 }
    );
  }
}

async function updateAssistant(
  body: VapiRequestBody,
  headers: Record<string, string>
) {
  if (!body.assistantConfig) {
    return NextResponse.json(
      { success: false, error: "Configuration assistant requise" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(`${VAPI_BASE_URL}/assistant/${ASSISTANT_ID}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body.assistantConfig),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erreur Vapi update assistant:", errorText);
      return NextResponse.json(
        {
          success: false,
          error: "Erreur lors de la mise à jour de l'assistant",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      success: true,
      data: {
        assistantId: data.id,
        message: "Assistant mis à jour avec succès",
      },
    });
  } catch (error) {
    console.error("Erreur update assistant:", error);
    return NextResponse.json(
      { success: false, error: "Erreur de connexion Vapi" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: "API Vapi Configurateur - Utilisez POST pour interagir",
      endpoints: [
        "POST /api/vapi-configurator - start-call, end-call, send-message, get-call-status, update-assistant",
      ],
    },
    { status: 200 }
  );
}
