import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

const getRandomNameSchema = z.object({
  race: z.string().optional(),
  gender: z.string().optional(),
});

const getRandomNameResponseSchema = z.object({
  name: z.string(),
});

export type getRandomNameInput = z.infer<typeof getRandomNameSchema>;

export const { schemas: nameSchemas, $ref } = buildJsonSchemas(
  {
    getRandomNameSchema,
    getRandomNameResponseSchema,
  },
  { $id: "nameSchemas" }
);
