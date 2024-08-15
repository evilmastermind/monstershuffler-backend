import { z } from 'zod';
import { classvariantObject, sPostClassvariantBody, sPutClassvariantBody, sGetClassvariantClassListResponse, sGetClassvariantListResponse, sGetClassvariantResponse } from 'monstershuffler-shared';

export type PostClassvariantBody = z.infer<typeof sPostClassvariantBody>;
export type PutClassvariantBody = z.infer<typeof sPutClassvariantBody>;
export type Classvariant = z.infer<typeof classvariantObject>;
