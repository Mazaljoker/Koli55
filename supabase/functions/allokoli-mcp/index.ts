import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Configuration des variables d'environnement
const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const vapiApiKey = Deno.env.get("VAPI_API_KEY");
const twilioAccountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
const twilioAuthToken = Deno.env.get("TWILIO_AUTH_TOKEN");

// Client Supabase avec clé service (accès complet)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Headers CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS, PUT, DELETE",
};

/**
 * Crée un assistant sur Vapi
 */
async function createVapiAssistant(assistantData: any) {
  if (!vapiApiKey) {
    throw new Error("VAPI_API_KEY non configurée");
  }

  const response = await fetch("https://api.vapi.ai/assistant", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${vapiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(assistantData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erreur Vapi: ${response.status} - ${errorText}`);
  }

  return await response.json();
}

/**
 * Provisionne un numéro de téléphone via Twilio
 */
async function provisionTwilioNumber(areaCode?: string) {
  if (!twilioAccountSid || !twilioAuthToken) {
    throw new Error("Identifiants Twilio non configurés");
  }

  const searchParams = new URLSearchParams({
    VoiceEnabled: "true",
    SmsEnabled: "true",
    ...(areaCode && { AreaCode: areaCode }),
  });

  // Rechercher des numéros disponibles
  const searchResponse = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/AvailablePhoneNumbers/US/Local.json?${searchParams}`,
    {
      headers: {
        Authorization: `Basic ${btoa(
          `${twilioAccountSid}:${twilioAuthToken}`
        )}`,
      },
    }
  );

  if (!searchResponse.ok) {
    throw new Error(`Erreur recherche Twilio: ${searchResponse.status}`);
  }

  const searchData = await searchResponse.json();
  if (!searchData.available_phone_numbers?.length) {
    throw new Error("Aucun numéro disponible");
  }

  const phoneNumber = searchData.available_phone_numbers[0].phone_number;

  // Acheter le numéro
  const purchaseResponse = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/IncomingPhoneNumbers.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(
          `${twilioAccountSid}:${twilioAuthToken}`
        )}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        PhoneNumber: phoneNumber,
        VoiceUrl: `https://api.vapi.ai/call/twilio`,
      }),
    }
  );

  if (!purchaseResponse.ok) {
    throw new Error(`Erreur achat Twilio: ${purchaseResponse.status}`);
  }

  return await purchaseResponse.json();
}

/**
 * Crée un assistant complet avec provisioning optionnel
 */
async function createAssistantAndProvisionNumber(request: any, userId: string) {
  try {
    // 1. Créer l'assistant dans Supabase
    const assistantData = {
      name: request.assistantName,
      system_prompt: request.systemPromptCore,
      first_message: request.firstMessage,
      end_call_message: "Merci pour votre appel. Au revoir !",
      model_provider: "openai",
      model_name: "gpt-4",
      voice_provider: "elevenlabs",
      voice_id: "21m00Tcm4TlvDq8ikWAM",
      language: "fr",
      business_type: request.businessType,
      assistant_tone: request.assistantTone,
      can_take_reservations: request.canTakeReservations || false,
      can_take_appointments: request.canTakeAppointments || false,
      can_transfer_call: request.canTransferCall || false,
      company_name: request.companyName,
      address: request.address,
      phone_number: request.phoneNumber,
      email: request.email,
      opening_hours: request.openingHours,
      is_active: true,
      created_by: userId,
    };

    const { data: assistant, error: assistantError } = await supabase
      .from("assistants")
      .insert(assistantData)
      .select()
      .single();

    if (assistantError) {
      throw new Error(`Erreur création assistant: ${assistantError.message}`);
    }

    // 2. Créer l'assistant sur Vapi
    let vapiAssistant = null;
    try {
      vapiAssistant = await createVapiAssistant({
        name: request.assistantName,
        systemPrompt: request.systemPromptCore,
        firstMessage: request.firstMessage,
      });

      // Mettre à jour l'assistant avec l'ID Vapi
      await supabase
        .from("assistants")
        .update({ vapi_assistant_id: vapiAssistant.id })
        .eq("id", assistant.id);
    } catch (vapiError) {
      console.warn("Erreur création Vapi:", vapiError.message);
    }

    // 3. Provisionner un numéro de téléphone (optionnel)
    let phoneNumber = null;
    if (
      twilioAccountSid &&
      twilioAuthToken &&
      request.provisionPhone !== false
    ) {
      try {
        phoneNumber = await provisionTwilioNumber({
          country: "FR",
          assistantId: assistant.id,
        });

        // Mettre à jour l'assistant avec le numéro
        await supabase
          .from("assistants")
          .update({ provisioned_phone_number: phoneNumber.phoneNumber })
          .eq("id", assistant.id);
      } catch (phoneError) {
        console.warn("Erreur provisioning téléphone:", phoneError.message);
      }
    }

    return {
      success: true,
      assistant: {
        id: assistant.id,
        name: assistant.name,
        vapiId: vapiAssistant?.id,
        phoneNumber: phoneNumber?.phoneNumber,
      },
      message: "Assistant créé avec succès",
    };
  } catch (error) {
    throw new Error(`Erreur création assistant: ${error.message}`);
  }
}

/**
 * Liste les assistants avec pagination et filtres
 */
async function listAssistants(request: any, userId?: string) {
  try {
    let query = supabase
      .from("assistants")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (request.search) {
      query = query.ilike("name", `%${request.search}%`);
    }

    if (request.sector) {
      query = query.eq("business_type", request.sector);
    }

    if (userId) {
      query = query.eq("created_by", userId);
    }

    const page = request.page || 1;
    const limit = request.limit || 10;
    const offset = (page - 1) * limit;

    query = query.range(offset, offset + limit - 1);

    const { data: assistants, error, count } = await query;

    if (error) {
      throw new Error(`Erreur récupération assistants: ${error.message}`);
    }

    return {
      success: true,
      assistants: assistants || [],
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  } catch (error) {
    throw new Error(`Erreur listage assistants: ${error.message}`);
  }
}

/**
 * Récupère un assistant spécifique
 */
async function getAssistant(assistantId: string, userId?: string) {
  try {
    let query = supabase.from("assistants").select("*").eq("id", assistantId);

    if (userId) {
      query = query.eq("created_by", userId);
    }

    const { data: assistant, error } = await query.single();

    if (error) {
      throw new Error(`Erreur récupération assistant: ${error.message}`);
    }

    if (!assistant) {
      throw new Error("Assistant non trouvé");
    }

    return {
      success: true,
      assistant,
    };
  } catch (error) {
    throw new Error(`Erreur récupération assistant: ${error.message}`);
  }
}

/**
 * Met à jour un assistant
 */
async function updateAssistant(
  assistantId: string,
  updates: any,
  userId?: string
) {
  try {
    let query = supabase
      .from("assistants")
      .update(updates)
      .eq("id", assistantId);

    if (userId) {
      query = query.eq("created_by", userId);
    }

    const { data: assistant, error } = await query.select().single();

    if (error) {
      throw new Error(`Erreur mise à jour assistant: ${error.message}`);
    }

    return {
      success: true,
      assistant,
      message: "Assistant mis à jour avec succès",
    };
  } catch (error) {
    throw new Error(`Erreur mise à jour assistant: ${error.message}`);
  }
}

/**
 * Gestionnaire principal de l'Edge Function
 */
serve(async (req) => {
  // Gestion CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace("/functions/v1/allokoli-mcp", "");
    const method = req.method;

    console.log(`${method} ${path}`);
    console.log(`Full URL: ${req.url}`);
    console.log(`Pathname: ${url.pathname}`);

    // Health check
    if (path === "/health" && method === "GET") {
      return new Response(
        JSON.stringify({
          status: "healthy",
          timestamp: new Date().toISOString(),
          version: "1.0.0",
          environment: {
            hasVapiKey: !!vapiApiKey,
            hasTwilioCredentials: !!(twilioAccountSid && twilioAuthToken),
            supabaseUrl: !!supabaseUrl,
            supabaseServiceKey: !!supabaseServiceKey,
          },
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Liste des assistants
    if (path === "/assistants" && method === "GET") {
      try {
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "10");
        const search = url.searchParams.get("search");
        const offset = (page - 1) * limit;

        let query = supabase
          .from("assistants")
          .select("*", { count: "exact" })
          .range(offset, offset + limit - 1)
          .order("created_at", { ascending: false });

        if (search) {
          query = query.or(
            `name.ilike.%${search}%,system_prompt.ilike.%${search}%`
          );
        }

        const { data, error, count } = await query;

        if (error) {
          console.error("Erreur Supabase:", error);
          throw error;
        }

        return new Response(
          JSON.stringify({
            assistants: data || [],
            pagination: {
              page,
              limit,
              total: count || 0,
              totalPages: Math.ceil((count || 0) / limit),
            },
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          }
        );
      } catch (error) {
        console.error("Erreur liste assistants:", error);
        return new Response(
          JSON.stringify({
            error: "Erreur lors de la récupération des assistants",
            details: error.message,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    // Récupération d'un assistant spécifique
    if (path.startsWith("/assistants/") && method === "GET") {
      try {
        const assistantId = path.split("/")[2];

        const { data, error } = await supabase
          .from("assistants")
          .select("*")
          .eq("id", assistantId)
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return new Response(
              JSON.stringify({ error: "Assistant non trouvé" }),
              {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 404,
              }
            );
          }
          throw error;
        }

        return new Response(JSON.stringify({ assistant: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } catch (error) {
        console.error("Erreur récupération assistant:", error);
        return new Response(
          JSON.stringify({
            error: "Erreur lors de la récupération de l'assistant",
            details: error.message,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    // Création d'assistant complet (nécessite VAPI_API_KEY)
    if (path === "/create-assistant" && method === "POST") {
      if (!vapiApiKey) {
        return new Response(
          JSON.stringify({ error: "VAPI_API_KEY non configurée" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 503,
          }
        );
      }

      try {
        const body = await req.json();
        const {
          name,
          model,
          voice,
          language = "fr",
          firstMessage,
          systemPrompt,
          toolsConfig,
          knowledgeBaseIds,
          forwardingPhoneNumber,
          endCallMessage,
          endCallPhrases,
          metadata,
          provisionPhone = false,
          areaCode,
        } = body;

        // Validation des champs requis
        if (!name || !model || !voice) {
          return new Response(
            JSON.stringify({
              error: "Champs requis manquants: name, model, voice",
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" },
              status: 400,
            }
          );
        }

        // Créer l'assistant sur Vapi
        const vapiAssistantData = {
          name,
          model,
          voice,
          language,
          firstMessage,
          systemPrompt,
          ...(toolsConfig && { tools: toolsConfig }),
          ...(knowledgeBaseIds?.length && {
            knowledgeBase: { knowledgeBaseIds },
          }),
          ...(forwardingPhoneNumber && { forwardingPhoneNumber }),
          ...(endCallMessage && { endCallMessage }),
          ...(endCallPhrases?.length && { endCallPhrases }),
          ...(metadata && { metadata }),
        };

        const vapiAssistant = await createVapiAssistant(vapiAssistantData);

        // Sauvegarder dans Supabase
        const { data: assistant, error: dbError } = await supabase
          .from("assistants")
          .insert({
            vapi_assistant_id: vapiAssistant.id,
            name,
            model: typeof model === "object" ? model : null,
            model_string: typeof model === "string" ? model : null,
            voice,
            language,
            first_message: firstMessage,
            system_prompt: systemPrompt,
            tools_config: toolsConfig,
            knowledge_base_ids: knowledgeBaseIds,
            forwarding_phone_number: forwardingPhoneNumber,
            end_call_message: endCallMessage,
            end_call_phrases: endCallPhrases,
            metadata,
            vapi_created_at: vapiAssistant.createdAt,
            vapi_updated_at: vapiAssistant.updatedAt,
          })
          .select()
          .single();

        if (dbError) throw dbError;

        let phoneNumber = null;
        if (provisionPhone) {
          try {
            const twilioNumber = await provisionTwilioNumber(areaCode);

            const { data: phoneData, error: phoneError } = await supabase
              .from("phone_numbers")
              .insert({
                phone_number: twilioNumber.phone_number,
                friendly_name: twilioNumber.friendly_name,
                provider: "twilio",
                country: "US",
                capabilities: ["voice", "sms"],
                assistant_id: assistant.id,
                metadata: { twilio_sid: twilioNumber.sid },
              })
              .select()
              .single();

            if (phoneError) throw phoneError;
            phoneNumber = phoneData;
          } catch (phoneError) {
            console.error("Erreur provisioning téléphone:", phoneError);
            // Continue sans échouer complètement
          }
        }

        return new Response(
          JSON.stringify({
            assistant,
            phoneNumber,
            vapiAssistant,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 201,
          }
        );
      } catch (error) {
        console.error("Erreur création assistant:", error);
        return new Response(
          JSON.stringify({
            error: "Erreur lors de la création de l'assistant",
            details: error.message,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    // Mise à jour d'assistant
    if (path.startsWith("/assistants/") && method === "PUT") {
      try {
        const assistantId = path.split("/")[2];
        const body = await req.json();

        const { data, error } = await supabase
          .from("assistants")
          .update({
            ...body,
            updated_at: new Date().toISOString(),
          })
          .eq("id", assistantId)
          .select()
          .single();

        if (error) {
          if (error.code === "PGRST116") {
            return new Response(
              JSON.stringify({ error: "Assistant non trouvé" }),
              {
                headers: { ...corsHeaders, "Content-Type": "application/json" },
                status: 404,
              }
            );
          }
          throw error;
        }

        return new Response(JSON.stringify({ assistant: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } catch (error) {
        console.error("Erreur mise à jour assistant:", error);
        return new Response(
          JSON.stringify({
            error: "Erreur lors de la mise à jour de l'assistant",
            details: error.message,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    // Provisioning de numéro de téléphone
    if (path === "/provision-phone" && method === "POST") {
      if (!twilioAccountSid || !twilioAuthToken) {
        return new Response(
          JSON.stringify({ error: "Identifiants Twilio non configurés" }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 503,
          }
        );
      }

      try {
        const body = await req.json();
        const { assistantId, areaCode } = body;

        const twilioNumber = await provisionTwilioNumber(areaCode);

        const { data: phoneNumber, error } = await supabase
          .from("phone_numbers")
          .insert({
            phone_number: twilioNumber.phone_number,
            friendly_name: twilioNumber.friendly_name,
            provider: "twilio",
            country: "US",
            capabilities: ["voice", "sms"],
            assistant_id: assistantId,
            metadata: { twilio_sid: twilioNumber.sid },
          })
          .select()
          .single();

        if (error) throw error;

        return new Response(JSON.stringify({ phoneNumber, twilioNumber }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        });
      } catch (error) {
        console.error("Erreur provisioning téléphone:", error);
        return new Response(
          JSON.stringify({
            error: "Erreur lors du provisioning du numéro",
            details: error.message,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    // Route non trouvée
    return new Response(JSON.stringify({ error: "Route non trouvée" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 404,
    });
  } catch (error) {
    console.error("Erreur générale:", error);
    return new Response(
      JSON.stringify({
        error: "Erreur interne du serveur",
        details: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
