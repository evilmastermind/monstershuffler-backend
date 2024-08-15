import { z } from 'zod';
import { armorObject, sPostArmorBody, sPutArmorBody, sGetArmorListResponse, sGetArmorParams, sGetArmorResponse } from 'monstershuffler-shared';

export type PostArmorBody = z.infer<typeof sPostArmorBody>;
export type PutArmorInput = z.infer<typeof sPutArmorBody>;
export type GetArmorListResponse = z.infer<typeof sGetArmorListResponse>;
export type Armor = z.infer<typeof armorObject>;
