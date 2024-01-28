import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import {
  postDamageType,
  putDamageType,
  getDamageTypeResponse,
  getDamageTypeListResponse,
} from 'monstershuffler-shared';

export type createDamageTypeInput = z.infer<typeof postDamageType>;
export type getDamageTypeListResponse = z.infer<
  typeof getDamageTypeListResponse
>;

export const { schemas: damageTypeSchemas, $ref } = buildJsonSchemas(
  {
    postDamageType,
    putDamageType,
    getDamageTypeResponse,
    getDamageTypeListResponse,
  },
  { $id: 'damageTypeSchemas' }
);
