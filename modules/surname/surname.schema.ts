import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const getRandomSurnameSchema = z.object({
  race: z.string().optional(),
  gender: z.string().optional(),
});

const getRandomSurnameResponseSchema = z.object({
  surname: z.string(),
});

export type getRandomSurnameInput = z.infer<typeof getRandomSurnameSchema>;

export const { schemas: surnameSchemas, $ref } = buildJsonSchemas(
  {
    getRandomSurnameSchema,
    getRandomSurnameResponseSchema,
  },
  { $id: 'surnameSchemas' }
);
