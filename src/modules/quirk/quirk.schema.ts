import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const getRandomQuirkResponseSchema = z.object({
  id: z.number(),
  quirk: z.string(),
});

export const { schemas: quirkSchemas, $ref } = buildJsonSchemas({
  getRandomQuirkResponseSchema,
}, { $id: 'quirkSchemas' });
