import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { characterObject } from '../character/character.schema';

const id = z.number();

const createRandomNpcInputSchema = z.object({
  levelType: z.enum(['random', 'randomPeasantsMostly']).optional(),
  classType: z.enum(['specificClass', 'randomClass', 'randomClassProfession', 'randomProfessionMostly', 'randomProfession', 'specificProfession']).optional(),
  classId: id.optional(),
  classVarintId: id.optional(),
  primaryRaceId: id.optional(),
  primaryRaceVariantId: id.optional(),
  secondaryRaceId: id.optional(),
  secondaryRaceVariantId: id.optional(),
  primaryRacePercentage: z.number().min(0).max(100).optional(),
  secondaryRacePercentage: z.number().min(0).max(100).optional(),
});

const createRandomNpcResponseSchema = z.object({
  npc: characterObject,
});

export type createRandomNpcInput = z.infer<typeof createRandomNpcInputSchema>;

export const { schemas: npcSchemas, $ref } = buildJsonSchemas({
  createRandomNpcInputSchema,
  createRandomNpcResponseSchema,
}, { $id: 'npcSchemas' });
