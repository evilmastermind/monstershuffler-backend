import { z } from 'zod';
import { racevariantObject } from 'monstershuffler-shared';
import {
  sGetRacevariantListResponse,
  sGetRacevariantResponse,
  sPostRacevariantBody,
  sPutRacevariantBody,
} from 'monstershuffler-shared';

export type PostRacevariantBody = z.infer<typeof sPostRacevariantBody>;
export type PutRacevariantBody = z.infer<typeof sPutRacevariantBody>;
export type Racevariant = z.infer<typeof racevariantObject>;
