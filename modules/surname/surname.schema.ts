import { z } from 'zod';
import { sGetRandomSurnameBody, sGetRandomSurnameResponse } from 'monstershuffler-shared';

export type GetRandomSurnameBody = z.infer<typeof sGetRandomSurnameBody>;
