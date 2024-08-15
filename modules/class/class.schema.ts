import { z } from 'zod';
import { classObject, sPostClassBody, sPutClassBody, sGetClassWithVariantsListResponse, sGetClassListResponse, sGetClassResponse } from 'monstershuffler-shared';

export type PostClassBody = z.infer<typeof sPostClassBody>;
export type PutClassBody = z.infer<typeof sPutClassBody>;
export type Class = z.infer<typeof classObject>;
