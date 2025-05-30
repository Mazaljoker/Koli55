import { NextRequest, NextResponse } from "next/server";

// Types pour les webhooks Vapi
interface VapiFunctionCall {
  name: string;
  parameters: Record<string, any>;
}

interface VapiWebhookEvent {
  type: string;
  call?: any;
  message?: any;
  functionCall?: VapiFunctionCall;
}

/**
 * Handler pour les webhooks Vapi - Route les function calls vers les tools
 */
export async function POST(req: NextRequest) {
  try {
    const webhookData: VapiWebhookEvent = await req.json();

    console.log("Webhook Vapi reçu:", webhookData.type);

    // Traiter uniquement les function calls
    if (webhookData.type === "function-call" && webhookData.functionCall) {
      const { functionCall } = webhookData;

      console.log("Function call:", functionCall.name, functionCall.parameters);

      let result;

      switch (functionCall.name) {
        case "analyzeBusinessContext":
          result = await callAnalyzeBusinessTool(functionCall.parameters);
          break;

        case "listVoicesForSector":
          result = await callListVoicesTool(functionCall.parameters);
          break;

        case "createCompleteAssistant":
          result = await callCreateAssistantTool(functionCall.parameters);
          break;

        default:
          result = {
            error: `Function ${functionCall.name} non reconnue`,
            available_functions: [
              "analyzeBusinessContext",
              "listVoicesForSector",
              "createCompleteAssistant",
            ],
          };
      }

      return NextResponse.json({ result });
    }

    // Pour les autres types d'événements, juste confirmer la réception
    return NextResponse.json({ received: true, type: webhookData.type });
  } catch (error: any) {
    console.error("Erreur webhook Vapi:", error);
    return NextResponse.json(
      { error: "Erreur traitement webhook", details: error.message },
      { status: 500 }
    );
  }
}

/**
 * Appelle le tool analyzeBusinessContext
 */
async function callAnalyzeBusinessTool(parameters: any) {
  try {
    const { description } = parameters;

    if (!description) {
      return { error: "Parameter description manquant" };
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/configurator-tools/analyze-business`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ description }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { error: `Erreur analyze-business: ${error}` };
    }

    return await response.json();
  } catch (error: any) {
    return { error: `Erreur appel analyze-business: ${error.message}` };
  }
}

/**
 * Appelle le tool listVoicesForSector
 */
async function callListVoicesTool(parameters: any) {
  try {
    const { sector, language = "fr", businessName } = parameters;

    if (!sector) {
      return { error: "Parameter sector manquant" };
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/configurator-tools/list-voices`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ sector, language, businessName }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { error: `Erreur list-voices: ${error}` };
    }

    return await response.json();
  } catch (error: any) {
    return { error: `Erreur appel list-voices: ${error.message}` };
  }
}

/**
 * Appelle le tool createCompleteAssistant
 */
async function callCreateAssistantTool(parameters: any) {
  try {
    const {
      businessName,
      sector,
      selectedVoice,
      template,
      knowledgeBaseIds,
      customInstructions,
      userId,
    } = parameters;

    if (!businessName || !sector || !selectedVoice) {
      return {
        error: "Parameters businessName, sector et selectedVoice requis",
      };
    }

    const response = await fetch(
      `${process.env.SUPABASE_URL}/functions/v1/configurator-tools/create-assistant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          businessName,
          sector,
          selectedVoice,
          template,
          knowledgeBaseIds,
          customInstructions,
          userId,
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      return { error: `Erreur create-assistant: ${error}` };
    }

    return await response.json();
  } catch (error: any) {
    return { error: `Erreur appel create-assistant: ${error.message}` };
  }
}

/**
 * Handler pour les requêtes OPTIONS (CORS)
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
