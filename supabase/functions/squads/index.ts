/**
 * Fonction Supabase Edge pour la gestion des équipes d'assistants (squads) Vapi
 *
 * Endpoints:
 * - GET /squads - Liste toutes les équipes
 * - GET /squads/:id - Récupère une équipe par ID
 * - POST /squads - Crée une nouvelle équipe
 * - PATCH /squads/:id - Met à jour une équipe
 * - DELETE /squads/:id - Supprime une équipe
 * - POST /squads/:id/members - Ajoute des membres à une équipe
 * - DELETE /squads/:id/members/:memberId - Retire un membre d'une équipe
 *
 * Variables d'Entrée (Request):
 *
 * GET /squads:
 *   - Query params: page (numéro de page), limit (nombre d'éléments par page)
 *   - Headers: Authorization (JWT token obligatoire)
 *
 * GET /squads/:id:
 *   - Path params: id (identifiant de l'équipe)
 *   - Headers: Authorization (JWT token obligatoire)
 *
 * POST /squads:
 *   - Body: {
 *       name: string (obligatoire, 3-100 caractères),
 *       description?: string (max 500 caractères),
 *       members?: Array<{
 *         id: string, // ID de l'assistant ou de l'utilisateur
 *         role: string // rôle du membre
 *       }>,
 *       metadata?: object
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: createSquadSchema
 *
 * PATCH /squads/:id:
 *   - Path params: id (identifiant de l'équipe)
 *   - Body: {
 *       name?: string (3-100 caractères),
 *       description?: string (max 500 caractères),
 *       metadata?: object
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: updateSquadSchema
 *
 * DELETE /squads/:id:
 *   - Path params: id (identifiant de l'équipe)
 *   - Headers: Authorization (JWT token obligatoire)
 *
 * POST /squads/:id/members:
 *   - Path params: id (identifiant de l'équipe)
 *   - Body: {
 *       members: Array<{
 *         id: string, // ID de l'assistant ou de l'utilisateur
 *         role: string // rôle du membre
 *       }>
 *     }
 *   - Headers: Authorization (JWT token obligatoire)
 *   - Validation: addMembersSchema
 *
 * DELETE /squads/:id/members/:memberId:
 *   - Path params: id (identifiant de l'équipe), memberId (identifiant du membre)
 *   - Headers: Authorization (JWT token obligatoire)
 *
 * Variables de Sortie (Response):
 *
 * GET /squads:
 *   - Succès: {
 *       data: VapiSquad[], // Liste des équipes
 *       pagination: {
 *         total: number,
 *         has_more: boolean
 *       }
 *     }
 *   - Erreur: FormattedError de shared/errors.ts
 *
 * GET /squads/:id:
 *   - Succès: { data: VapiSquad }
 *   - Erreur: FormattedError de shared/errors.ts
 *
 * POST /squads:
 *   - Succès: { data: VapiSquad }
 *   - Erreur: FormattedError de shared/errors.ts
 *
 * PATCH /squads/:id:
 *   - Succès: { data: VapiSquad }
 *   - Erreur: FormattedError de shared/errors.ts
 *
 * DELETE /squads/:id:
 *   - Succès: { success: true }
 *   - Erreur: FormattedError de shared/errors.ts
 *
 * POST /squads/:id/members:
 *   - Succès: { data: VapiSquad } // Équipe mise à jour avec les nouveaux membres
 *   - Erreur: FormattedError de shared/errors.ts
 *
 * DELETE /squads/:id/members/:memberId:
 *   - Succès: { success: true }
 *   - Erreur: FormattedError de shared/errors.ts
 *
 * Structure VapiSquad conforme à l'interface VapiSquad de shared/vapi.ts:
 * {
 *   id: string,
 *   name: string,
 *   description?: string,
 *   members: SquadMember[],
 *   metadata?: Record<string, any>,
 *   created_at: string,
 *   updated_at: string
 * }
 *
 * Structure SquadMember conforme à l'interface SquadMember de shared/vapi.ts:
 * {
 *   id: string, // ID de l'assistant ou de l'utilisateur
 *   role: string // Rôle du membre (ex: 'assistant', 'viewer', 'editor')
 * }
 */

// @deno-types="https://deno.land/std@0.168.0/http/server.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../shared/cors.ts";
import {
  errorResponse,
  notFoundError,
  validationError,
} from "../shared/errors.ts";
import { authenticate } from "../shared/auth.ts";
import {
  validateInput,
  validatePagination,
  ValidationSchema,
} from "../shared/validation.ts";
import {
  vapiSquads,
  VapiSquad,
  SquadCreateParams,
  SquadUpdateParams,
  SquadMember,
  PaginationParams,
} from "../shared/vapi.ts";

/**
 * Fonctions utilitaires pour mapper les données entre notre format DB/frontend et le format Vapi
 */

/**
 * Convertit les données du squad du format frontend/DB au format Vapi
 *
 * @param squadData - Données du squad
 */
function mapToVapiSquadFormat(
  squadData: any
): SquadCreateParams | SquadUpdateParams {
  console.log(
    `[MAPPING] mapToVapiSquadFormat - Input: ${JSON.stringify(
      squadData,
      null,
      2
    )}`
  );

  const payload: SquadCreateParams | SquadUpdateParams = {};

  if (squadData.name !== undefined) {
    payload.name = squadData.name;
  }

  if (squadData.description !== undefined) {
    payload.description = squadData.description;
  }

  if (squadData.members !== undefined && "members" in payload) {
    (payload as SquadCreateParams).members = squadData.members;
  }

  if (squadData.metadata !== undefined) {
    payload.metadata = squadData.metadata;
  }

  console.log(
    `[MAPPING] mapToVapiSquadFormat - Output: ${JSON.stringify(
      payload,
      null,
      2
    )}`
  );
  return payload;
}

// Schéma de validation pour la création d'une équipe
const createSquadSchema: ValidationSchema = {
  name: {
    type: "string",
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  description: {
    type: "string",
    maxLength: 500,
  },
  members: {
    type: "array",
    // items: { type: 'object', properties: { id: {type: 'string'}, role: {type: 'string'} } } // Validation plus stricte
  },
  metadata: {
    type: "object",
  },
};

// Schéma de validation pour la mise à jour d'une équipe
const updateSquadSchema: ValidationSchema = {
  name: {
    type: "string",
    minLength: 3,
    maxLength: 100,
  },
  description: {
    type: "string",
    maxLength: 500,
  },
  metadata: {
    type: "object",
  },
};

// Schéma de validation pour l'ajout de membres à une équipe
const addMembersSchema: ValidationSchema = {
  members: {
    type: "array",
    required: true,
    minLength: 1,
    // items: { type: 'object', properties: { id: {type: 'string'}, role: {type: 'string'} } }
  },
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    // Mode test: vérifier si c'est un appel de test
    const url = new URL(req.url);
    const isTestMode =
      url.searchParams.get("test") === "true" ||
      req.headers.get("x-test-mode") === "true";

    // Authentification de l'utilisateur (optionnelle en mode test)
    let user = null;
    if (!isTestMode) {
      user = await authenticate(req);
    } else {
      // Mode test: utiliser un utilisateur fictif
      user = {
        id: "test-user",
        email: "test@allokoli.com",
        role: "user",
        organization_id: "test-org",
      };
    }

    const pathSegments = url.pathname.split("/").filter((segment) => segment);

    // Vérification qu'on a au moins le segment 'squads'
    if (pathSegments.length === 0 || pathSegments[0] !== "squads") {
      throw validationError("Chemin d'URL invalide");
    }

    // Extraction de l'ID du squad, action et ID du membre si présents
    const squadId = pathSegments.length >= 2 ? pathSegments[1] : null;
    const action = pathSegments.length >= 3 ? pathSegments[2] : null;
    const memberId = pathSegments.length >= 4 ? pathSegments[3] : null;

    // POST /squads/:id/members - Ajoute des membres à une équipe
    if (req.method === "POST" && squadId && action === "members" && !memberId) {
      console.log(
        `[HANDLER] POST /squads/${squadId}/members - Ajout de membres à une équipe`
      );

      const data = await req.json();
      const validatedData = validateInput<{ members: SquadMember[] }>(
        data,
        addMembersSchema
      );

      const updatedSquad = await vapiSquads.addMembers(
        squadId,
        validatedData.members
      );
      console.log(
        `[VAPI_SUCCESS] Added members to squad: ${squadId}`,
        updatedSquad
      );

      return new Response(JSON.stringify({ data: updatedSquad }), {
        // Vapi retourne le squad mis à jour
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // DELETE /squads/:id/members/:memberId - Retire un membre d'une équipe
    if (
      req.method === "DELETE" &&
      squadId &&
      action === "members" &&
      memberId
    ) {
      console.log(
        `[HANDLER] DELETE /squads/${squadId}/members/${memberId} - Retrait d'un membre d'une équipe`
      );

      await vapiSquads.removeMember(squadId, memberId);
      console.log(
        `[VAPI_SUCCESS] Removed member ${memberId} from squad: ${squadId}`
      );

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // GET /squads - Liste de toutes les équipes
    if (req.method === "GET" && !squadId) {
      console.log(`[HANDLER] GET /squads - Liste des équipes`);

      // Mode test simple
      if (isTestMode) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Squads function deployed successfully!",
            endpoints: {
              GET_ALL: "/squads",
              GET_ONE: "/squads/:id",
              CREATE: "/squads",
              UPDATE: "/squads/:id",
              DELETE: "/squads/:id",
              ADD_MEMBERS: "/squads/:id/members",
              REMOVE_MEMBER: "/squads/:id/members/:memberId",
            },
          }),
          {
            headers: { "Content-Type": "application/json", ...corsHeaders },
          }
        );
      }

      const { page, limit } = validatePagination(url.searchParams);
      const squads = await vapiSquads.list({
        limit: limit,
        offset: (page - 1) * limit,
      });

      console.log(`[VAPI_SUCCESS] Listed ${squads.data?.length || 0} squads`);
      return new Response(
        JSON.stringify({
          data: squads.data,
          pagination: {
            page,
            limit,
            total: squads.pagination?.total || 0,
            has_more: squads.pagination?.has_more || false,
          },
        }),
        {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // GET /squads/:id - Récupération d'une équipe spécifique
    if (req.method === "GET" && squadId && !action) {
      console.log(
        `[HANDLER] GET /squads/${squadId} - Récupération d'une équipe`
      );

      let squad: VapiSquad;
      try {
        squad = await vapiSquads.retrieve(squadId);
        console.log(`[VAPI_SUCCESS] Retrieved squad: ${squadId}`, squad);
      } catch (error) {
        console.error(
          `[VAPI_ERROR] GET /squads/${squadId} - Failed to retrieve:`,
          error
        );
        throw notFoundError(`Équipe avec l'ID ${squadId} non trouvée`);
      }

      return new Response(JSON.stringify({ data: squad }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // POST /squads - Création d'une nouvelle équipe
    if (req.method === "POST" && !squadId) {
      console.log(`[HANDLER] POST /squads - Création d'une équipe`);

      const data = await req.json();
      const validatedData = validateInput(data, createSquadSchema);

      // Ajouter les métadonnées utilisateur
      validatedData.metadata = {
        ...validatedData.metadata,
        user_id: user.id,
        organization_id: user.organization_id || user.id,
      };

      // Utiliser notre fonction de mapping
      const squadPayload = mapToVapiSquadFormat(
        validatedData
      ) as SquadCreateParams;

      const squad = await vapiSquads.create(squadPayload);
      console.log(`[VAPI_SUCCESS] Created squad: ${squad.id}`, squad);

      return new Response(JSON.stringify({ data: squad }), {
        status: 201,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // PATCH /squads/:id - Mise à jour d'une équipe
    if (req.method === "PATCH" && squadId && !action) {
      console.log(
        `[HANDLER] PATCH /squads/${squadId} - Mise à jour d'une équipe`
      );

      const data = await req.json();
      const validatedData = validateInput(data, updateSquadSchema);

      // Utiliser notre fonction de mapping
      const squadPayload = mapToVapiSquadFormat(
        validatedData
      ) as SquadUpdateParams;

      const squad = await vapiSquads.update(squadId, squadPayload);
      console.log(`[VAPI_SUCCESS] Updated squad: ${squadId}`, squad);

      return new Response(JSON.stringify({ data: squad }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // DELETE /squads/:id - Suppression d'une équipe
    if (req.method === "DELETE" && squadId && !action) {
      console.log(
        `[HANDLER] DELETE /squads/${squadId} - Suppression d'une équipe`
      );

      await vapiSquads.delete(squadId);
      console.log(`[VAPI_SUCCESS] Deleted squad: ${squadId}`);

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Méthode non supportée
    return new Response(
      JSON.stringify({
        error: "Méthode non supportée",
      }),
      {
        status: 405,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
});
