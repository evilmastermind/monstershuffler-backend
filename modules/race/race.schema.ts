import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { raceObject } from '@/schemas/character';

const id = z.number();
const userid = z.number();
const game = z.number();
const name = z.string().min(2);

//TODO: add game type to every get*ListSchema
const getRaceListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

const getRaceWithVariantsListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
      other_objects: z.array(
        z.object({
          id,
          name,
          userid,
        })
      ),
    })
  ),
});

const getRaceResponseSchema = z.object({
  object: raceObject,
  id,
});

const createRaceSchema = z.object({
  game,
  object: raceObject,
});

const updateRaceSchema = z.object({
  object: raceObject,
  game,
});

export type createRaceInput = z.infer<typeof createRaceSchema>;
export type updateRaceInput = z.infer<typeof updateRaceSchema>;
export type Race = z.infer<typeof raceObject>;

export const { schemas: raceSchemas, $ref } = buildJsonSchemas(
  {
    createRaceSchema,
    updateRaceSchema,
    getRaceWithVariantsListResponseSchema,
    getRaceListResponseSchema,
    getRaceResponseSchema,
  },
  { $id: 'raceSchemas' }
);
