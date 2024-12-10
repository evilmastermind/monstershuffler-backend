import { z } from 'zod';
import { raceObject } from 'monstershuffler-shared';
import {
  sGetRaceListResponse,
  sGetRaceResponse,
  sGetRaceWithVariantsListResponse,
  sPostRaceBody,
  sPutRaceBody,
} from 'monstershuffler-shared';

export type PostRaceBody = z.infer<typeof sPostRaceBody>;
export type PutRaceBody = z.infer<typeof sPutRaceBody>;
export type Race = z.infer<typeof raceObject>;
