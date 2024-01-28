import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { armorObject, postArmor, putArmor, getArmorListResponse, getArmorParams, getArmorResponse } from 'monstershuffler-shared';

export type PostArmorInput = z.infer<typeof postArmor>;
export type PutArmorInput = z.infer<typeof putArmor>;
export type GetArmorListResponse = z.infer<typeof getArmorListResponse>;
export type Armor = z.infer<typeof armorObject>;

export const { schemas: armorSchemas, $ref } = buildJsonSchemas(
  {
    postArmor,
    putArmor,
    getArmorParams,
    getArmorResponse,
    getArmorListResponse,
  },
  { $id: 'armorSchemas' }
);
