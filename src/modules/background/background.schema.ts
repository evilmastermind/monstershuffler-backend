import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';


const getRandomBackgroundResponseSchema = z.object({
  id: z.number(),
  background: z.string(),
});

export const {schemas: backgroundSchemas, $ref} = buildJsonSchemas({
  getRandomBackgroundResponseSchema,
}, { $id: 'backgroundSchemas' });