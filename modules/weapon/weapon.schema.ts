import { z } from 'zod';
import { sPostWeaponBody, sPutWeaponBody, sGetWeaponListResponse, sGetWeaponResponse, sGetWeaponParams } from 'monstershuffler-shared';


export type PostWeaponBody = z.infer<typeof sPostWeaponBody>;
export type PutWeaponBody = z.infer<typeof sPutWeaponBody>;
export type GetWeaponListResponse = z.infer<typeof sGetWeaponListResponse>;
