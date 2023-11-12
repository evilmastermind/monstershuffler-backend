import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { postWeapon, putWeapon, getWeaponListResponse, getWeaponResponse, getWeaponParams } from 'monstershuffler-shared';


export type createWeaponInput = z.infer<typeof postWeapon>;
export type updateWeaponInput = z.infer<typeof putWeapon>;
export type getWeaponListResponse = z.infer<typeof getWeaponListResponse>;

export const { schemas: weaponSchemas, $ref } = buildJsonSchemas(
  {
    postWeapon,
    putWeapon,
    getWeaponParams,
    getWeaponResponse,
    getWeaponListResponse,
  },
  { $id: 'weaponSchemas' }
);
