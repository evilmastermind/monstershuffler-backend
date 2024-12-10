import { z } from 'zod';
import { actionObject } from 'monstershuffler-shared';
import { sGetActionListBody, sPostActionBody, sPutActionBody } from 'monstershuffler-shared';

export type GetActionListBody = z.infer<typeof sGetActionListBody>;
export type PostActionBody = z.infer<typeof sPostActionBody>;
export type PutActionBody = z.infer<typeof sPutActionBody>;
export type Action = z.infer<typeof actionObject>;
