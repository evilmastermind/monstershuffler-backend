import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { getRandomCharacterhookResponse } from 'monstershuffler-shared';

export const { schemas: characterhookSchemas, $ref } = buildJsonSchemas(
  {
    getRandomCharacterhookResponse,
  },
  { $id: 'characterhookSchemas' }
);
