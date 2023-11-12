import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { getRandomNameResponse, getRandomName } from 'monstershuffler-shared';

export type getRandomNameInput = z.infer<typeof getRandomName>;

export const { schemas: nameSchemas, $ref } = buildJsonSchemas(
  {
    getRandomName,
    getRandomNameResponse,
  },
  { $id: 'nameSchemas' }
);
