import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { racevariantObject } from 'monstershuffler-shared';
import {
  getRacevariantListResponse,
  getRacevariantResponse,
  postRacevariant,
  putRacevariant,
} from 'monstershuffler-shared';

export type createRacevariantInput = z.infer<typeof postRacevariant>;
export type updateRacevariantInput = z.infer<typeof putRacevariant>;
export type Racevariant = z.infer<typeof racevariantObject>;

export const { schemas: racevariantSchemas, $ref } = buildJsonSchemas(
  {
    postRacevariant,
    putRacevariant,
    getRacevariantListResponse,
    getRacevariantResponse,
  },
  { $id: 'racevariantSchemas' }
);
