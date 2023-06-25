import { FastifyInstance } from "fastify";
import {
  createCharacterHandler,
  getCharacterHandler,
  getCharacterListHandler,
  updateCharacterHandler,
  deleteCharacterHandler,
} from "./character.controller";
import { $ref } from "./character.schema";
import {
  jwtHeaderOptional,
  jwtHeaderRequired,
  BatchPayload,
} from "@/modules/schemas";

async function characterRoutes(server: FastifyInstance) {
  server.get(
    "/",
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: "Returns a list of all available characters in the db.",
        description:
          "Returns a list of all available characters in the db. If authenticated, also returns the list of characters created by the user.",
        headers: jwtHeaderOptional,
        tags: ["characters"],
        response: {
          200: $ref("getCharacterListResponseSchema"),
        },
      },
    },
    getCharacterListHandler
  );

  server.get(
    "/:characterId",
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          "Returns the details of the character corresponding to the given id.",
        description:
          "Returns the details of the character corresponding to the given id.",
        headers: jwtHeaderOptional,
        tags: ["characters"],
        // params: $ref('getCharacterParamsSchema'),
        response: {
          200: $ref("getCharacterResponseSchema"),
        },
      },
    },
    getCharacterHandler
  );

  server.post(
    "/",
    {
      preHandler: [server.authenticate],
      schema: {
        summary: "[MS ONLY] Adds a new character to the db.",
        description: "[MS ONLY] Adds a new character to the db.",
        body: $ref("createCharacterSchema"),
        tags: ["characters"],
        headers: jwtHeaderRequired,
        response: {
          201: $ref("getCharacterResponseSchema"),
        },
      },
    },
    createCharacterHandler
  );

  server.put(
    "/:characterId",
    {
      preHandler: [server.authenticate],
      schema: {
        summary:
          "[MS ONLY] Updates the character corresponding to the given id.",
        description:
          "[MS ONLY] Updates the character corresponding to the given id.",
        body: $ref("updateCharacterSchema"),
        tags: ["characters"],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    updateCharacterHandler
  );

  server.delete(
    "/:characterId",
    {
      preHandler: [server.authenticate],
      schema: {
        summary:
          "[MS ONLY] Deletes the character corresponding to the given id.",
        description:
          "[MS ONLY] Deletes the character corresponding to the given id.",
        tags: ["characters"],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteCharacterHandler
  );
}

export default characterRoutes;
