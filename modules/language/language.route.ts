import { FastifyInstance } from "fastify";
import {
  createLanguageHandler,
  getLanguageListHandler,
  updateLanguageHandler,
  deleteLanguageHandler,
} from "./language.controller";
import { $ref } from "./language.schema";
import {
  jwtHeaderOptional,
  jwtHeaderRequired,
  BatchPayload,
} from "@/schemas";

async function languageRoutes(server: FastifyInstance) {
  server.get(
    "/",
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: "Returns a list of all available languages in the db.",
        description:
          "Returns a list of all available languages in the db. If authenticated, also returns the list of languages created by the user.",
        headers: jwtHeaderOptional,
        tags: ["languages"],
        response: {
          200: $ref("getLanguageListResponseSchema"),
        },
      },
    },
    getLanguageListHandler
  );

  server.post(
    "/",
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: "[MS ONLY] Adds a new type of language to the db.",
        description: "[MS ONLY] Adds a new type of language to the db.",
        body: $ref("createLanguageSchema"),
        tags: ["languages"],
        headers: jwtHeaderRequired,
        response: {
          201: $ref("getLanguageResponseSchema"),
        },
      },
    },
    createLanguageHandler
  );

  server.put(
    "/:languageId",
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          "[MS ONLY] Updates the details of the language corresponding to the given id.",
        description:
          "[MS ONLY] Updates the details of the language corresponding to the given id.",
        body: $ref("updateLanguageSchema"),
        tags: ["languages"],
        headers: jwtHeaderRequired,
        response: {
          200: $ref("getLanguageResponseSchema"),
        },
      },
    },
    updateLanguageHandler
  );

  server.delete(
    "/:languageId",
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          "[MS ONLY] Deletes the language corresponding to the given id.",
        description:
          "[MS ONLY] Deletes the language corresponding to the given id.",
        tags: ["languages"],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteLanguageHandler
  );
}

export default languageRoutes;
