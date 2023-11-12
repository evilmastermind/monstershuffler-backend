import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

import { getRandomQuirkResponse } from 'monstershuffler-shared';

export const { schemas: quirkSchemas, $ref } = buildJsonSchemas(
  {
    getRandomQuirkResponse,
  },
  { $id: 'quirkSchemas' }
);
