import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { backgroundObject } from 'monstershuffler-shared';

import {
  postBackground,
  getBackgroundListResponse,
  getBackgroundResponse,
} from 'monstershuffler-shared';

export type CreateBackgroundInput = z.infer<typeof postBackground>;
export type Background = z.infer<typeof backgroundObject>;

export const { schemas: backgroundSchemas, $ref } = buildJsonSchemas(
  {
    postBackground,
    getBackgroundListResponse,
    getBackgroundResponse,
  },
  { $id: 'backgroundSchemas' }
);
