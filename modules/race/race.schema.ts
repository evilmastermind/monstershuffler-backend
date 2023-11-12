import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { raceObject } from '@/schemas/character';
import { getRaceListResponse, getRaceResponse, getRaceWithVariantsListResponse, postRace, putRace } from 'monstershuffler-shared';

export type createRaceInput = z.infer<typeof postRace>;
export type updateRaceInput = z.infer<typeof putRace>;
export type Race = z.infer<typeof raceObject>;

export const { schemas: raceSchemas, $ref } = buildJsonSchemas(
  {
    postRace,
    putRace,
    getRaceWithVariantsListResponse,
    getRaceListResponse,
    getRaceResponse,
  },
  { $id: 'raceSchemas' }
);
