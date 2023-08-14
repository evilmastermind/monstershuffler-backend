import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const getRandomVoiceSchema = z.object({
  gender: z.string().optional(),
});

const getRandomVoiceResponseSchema = z.object({
  id: z.number(),
  gender: z.string(),
  person: z.string(),
  character: z.string().optional(),
  production: z.string().optional(),
  filename: z.string(),
});

export type getRandomVoiceInput = z.infer<typeof getRandomVoiceSchema>;
export const { schemas: voiceSchemas, $ref } = buildJsonSchemas(
  {
    getRandomVoiceSchema,
    getRandomVoiceResponseSchema,
  },
  { $id: 'voiceSchemas' }
);
