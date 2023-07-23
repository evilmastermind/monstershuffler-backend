import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const getRandomCharacterhookResponseSchema = z.object({
  id: z.number(),
  characterhook: z.string(),
});

export const { schemas: characterhookSchemas, $ref } = buildJsonSchemas(
  {
    getRandomCharacterhookResponseSchema,
  },
  { $id: "characterhookSchemas" }
);
