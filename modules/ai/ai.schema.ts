import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const generateTextSchema = z.object({
  prompt: z.string()
});

export const generateTextResponse = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  choices: z.array(z.object({
    message: z.object({
      content: z.string(),
      index: z.number()
    }),
    index: z.number(),
    completions: z.number()
  }))
});

export type GenerateTextInput = z.infer<typeof generateTextSchema>;
export type GenerateTextResponse = z.infer<typeof generateTextResponse>;

export const { schemas: aiSchemas, $ref } = buildJsonSchemas(
  {
    generateTextSchema,
    generateTextResponse
  },
  { $id: 'aiSchemas' }
);
