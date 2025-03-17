import { z } from 'zod';
import { sPostRandomCharacterhookBody, sPostRandomCharacterhookResponse } from 'monstershuffler-shared';


export type PostRandomCharacterhookBody = z.infer<typeof sPostRandomCharacterhookBody>;
export type PostRandomCharacterhookResponse = z.infer<typeof sPostRandomCharacterhookResponse>;
