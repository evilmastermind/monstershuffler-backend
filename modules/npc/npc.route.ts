import { FastifyInstance } from "fastify";
import { createFourRandomNpcHandler, createRandomNpcHandler } from "./npc.controller";
import { $ref } from "./npc.schema";
// schemas
import { jwtHeaderOptional } from "@/schemas";

async function npcRoutes(server: FastifyInstance) {
  server.post(
    "/",
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: "Creates a new random npc using the settings provided.",
        description: "Creates a new random npc using the settings provided.",
        headers: jwtHeaderOptional,
        tags: ["npcs"],
        body: $ref("createRandomNpcInputSchema"),
        response: {
          200: $ref("createRandomNpcResponseSchema"),
        },
      },
    },
    createRandomNpcHandler
  );
  server.post(
    "/four",
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: "[MS ONLY] Creates four new random npcs using the settings provided.",
        description: "Creates four new random npcs using the settings provided. Only accessible through monstershuffler.com",
        headers: jwtHeaderOptional,
        tags: ["npcs"],
        body: $ref("createRandomNpcInputSchema"),
        response: {
          200: $ref("createFourRandomNpcsResponseSchema"),
        },
      },
    },
    createFourRandomNpcHandler
  );
}

export default npcRoutes;
