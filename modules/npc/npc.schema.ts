import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { characterObject } from '@/schemas/character';

const id = z.number();
const userid = z.number();
const name = z.string().min(2);

export const objectListSchema = z.array(
  z.object({
    id: z.number(),
    userid,
    name,
  })
);

export const objectWithVariantsListSchema = z.array(
  z.object({
    id: z.number(),
    userid,
    name,
    other_objects: z.array(
      z.object({
        id: z.number(),
        name,
        userid,
      })
    ),
  })
);


const createRandomNpcInputSchema = z.object({
  levelType: z.enum(['random', 'randomPeasantsMostly']).optional(),
  classType: z
    .enum(['none', 'randomSometimes', 'randomAlways', 'specific'])
    .optional(),
  backgroundType: z.enum(['none', 'random', 'specific']).optional(),
  classId: id.optional(),
  classvariantId: id.optional(),
  backgroundId: id.optional(),
  primaryRaceId: id.optional(),
  secondaryRaceId: id.optional(),
  primaryRacevariantId: id.optional(),
  secondaryRacevariantId: id.optional(),
  primaryRacePercentage: z.number().min(0).max(100).optional(),
  secondaryRacePercentage: z.number().min(0).max(100).optional(),
  addVoice: z.boolean().optional(),
  includeChildren: z.boolean().optional(),
});

const createRandomNpcResponseSchema = z.object({
  npc: characterObject,
});

const createFourRandomNpcsResponseSchema = z.object({
  npcs: z.array(characterObject),
});

const getGeneratorDataResponseSchema = z.object({
  races: objectWithVariantsListSchema,
  classes: objectWithVariantsListSchema,
  backgrounds: objectListSchema,
});

export type createRandomNpcInput = z.infer<typeof createRandomNpcInputSchema>;

export const { schemas: npcSchemas, $ref } = buildJsonSchemas(
  {
    createRandomNpcInputSchema,
    createRandomNpcResponseSchema,
    createFourRandomNpcsResponseSchema,
    getGeneratorDataResponseSchema,
  },
  { $id: 'npcSchemas' }
);
