import { FastifyInstance } from "fastify";
import {
  createSpellHandler,
  getSpellHandler,
  getSpellListHandler,
  updateSpellHandler,
  deleteSpellHandler,
} from "./spell.controller";
import { $ref } from "./spell.schema";
import {
  jwtHeaderOptional,
  jwtHeaderRequired,
  BatchPayload,
} from "@/schemas";

// TODO: a /random route that returns a random spell from the db, filtered by the values specified in the body.
// TODO: spells should be have variants and be structured like the new version of actions.
// TODO: spells should have dynamic values, and be exactly like actions... spells should be actions?
// TODO: it would be cool if spells could be used as actions, and actions could be used as spells.
//       this is in line with the new way of creating monsters by WotC, like the ones in Monsters of the Multiverse
async function spellRoutes(server: FastifyInstance) {
  server.post(
    "/filter",
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          "Returns a list of spells from the db, filtered by the values specified in the body.",
        description:
          "Returns a list of spells from the db, filtered by the values specified in the body. If authenticated, also returns the spells created by the user.",
        body: $ref("getSpellListSchema"),
        headers: jwtHeaderOptional,
        tags: ["spells"],
        response: {
          200: $ref("getSpellListResponseSchema"),
        },
      },
    },
    getSpellListHandler
  );

  server.get(
    "/:spellId",
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          "Returns the details of the spell corresponding to the given id.",
        description:
          "Returns the details of the spell corresponding to the given id.",
        headers: jwtHeaderOptional,
        tags: ["spells"],
        // params: $ref('getSpellParamsSchema'),
        response: {
          200: $ref("getSpellResponseSchema"),
        },
      },
    },
    getSpellHandler
  );

  server.post(
    "/",
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: "[MS ONLY] Adds a new spell to the db.",
        description: "[MS ONLY] Adds a new spell to the db.",
        body: $ref("createSpellSchema"),
        tags: ["spells"],
        headers: jwtHeaderRequired,
        response: {
          201: $ref("getSpellResponseSchema"),
        },
      },
    },
    createSpellHandler
  );

  server.put(
    "/:spellId",
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: "[MS ONLY] Updates the spell corresponding to the given id.",
        description:
          "[MS ONLY] Updates the spell corresponding to the given id.",
        body: $ref("updateSpellSchema"),
        tags: ["spells"],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    updateSpellHandler
  );

  server.delete(
    "/:spellId",
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: "[MS ONLY] Deletes the spell corresponding to the given id.",
        description:
          "[MS ONLY] Deletes the spell corresponding to the given id.",
        tags: ["spells"],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteSpellHandler
  );
}

export default spellRoutes;
