import { z } from 'zod';
import { sGetRandomNameResponse, sGetRandomNameBody } from 'monstershuffler-shared';

export type GetRandomName = z.infer<typeof sGetRandomNameBody>;
