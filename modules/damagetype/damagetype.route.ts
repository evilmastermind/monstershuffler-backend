import { FastifyInstance } from "fastify";
import {
  createDamageTypeHandler,
  getDamageTypeListHandler,
  updateDamageTypeHandler,
  deleteDamageTypeHandler,
} from "./damagetype.controller";
import { $ref } from "./damagetype.schema";
import {
  jwtHeaderOptional,
  jwtHeaderRequired,
  BatchPayload,
} from "@/schemas";

async function damageTypeRoutes(server: FastifyInstance) {
  server.get(
    "/",
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: "Returns a list of all available damage types in the db.",
        description:
          "Returns a list of all available damage types in the db. If authenticated, also returns the list of damage types created by the user.",
        headers: jwtHeaderOptional,
        tags: ["damage types"],
        response: {
          200: $ref("getDamageTypeListResponseSchema"),
        },
      },
    },
    getDamageTypeListHandler
  );

  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        summary: "[MS ONLY] Adds a new type of damage to the db.",
        description: "[MS ONLY] Adds a new type of damage to the db.",
        body: $ref("createDamageTypeSchema"),
        tags: ["damage types"],
        headers: jwtHeaderRequired,
        response: {
          201: $ref("getDamageTypeResponseSchema"),
        },
      },
    },
    createDamageTypeHandler
  );

  server.put(
    "/:damageTypeId",
    {
      preHandler: [server.authenticate],
      schema: {
        summary:
          "[MS ONLY] Updates the details of the damage type corresponding to the given id.",
        description:
          "[MS ONLY] Updates the details of the damage type corresponding to the given id.",
        body: $ref("updateDamageTypeSchema"),
        tags: ["damage types"],
        headers: jwtHeaderRequired,
        response: {
          200: $ref("getDamageTypeResponseSchema"),
        },
      },
    },
    updateDamageTypeHandler
  );

  server.delete(
    "/:damageTypeId",
    {
      preHandler: [server.authenticate],
      schema: {
        summary:
          "[MS ONLY] Deletes the damage type corresponding to the given id.",
        description:
          "[MS ONLY] Deletes the damage type corresponding to the given id.",
        tags: ["damage types"],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteDamageTypeHandler
  );
}

export default damageTypeRoutes;
