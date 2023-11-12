import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { getRandomVoiceResponse, getRandomVoice } from 'monstershuffler-shared';

export type getRandomVoiceInput = z.infer<typeof getRandomVoice>;
export const { schemas: voiceSchemas, $ref } = buildJsonSchemas(
  {
    getRandomVoice,
    getRandomVoiceResponse,
  },
  { $id: 'voiceSchemas' }
);
