import { z } from 'zod';
import {
  sPostDamageTypeBody,
  sPutDamageTypeBody,
  sGetDamageTypeResponse,
  sGetDamageTypeListResponse,
} from 'monstershuffler-shared';

export type PostDamageTypeInput = z.infer<typeof sPostDamageTypeBody>;
export type GetDamageTypeListResponse = z.infer<
  typeof sGetDamageTypeListResponse
>;
