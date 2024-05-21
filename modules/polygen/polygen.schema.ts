import { buildJsonSchemas } from 'fastify-zod';
import { z } from 'zod';

const grammar = z.object({
  grammar: z.string(),
});

const result = z.object({
  result: z.string(),
});

export type Grammar = z.infer<typeof grammar>;

export const { schemas: polygenSchemas, $ref } = buildJsonSchemas({
  parsePolygenResponseSchema: result,
},
{ $id: 'polygenSchemas' }
);
