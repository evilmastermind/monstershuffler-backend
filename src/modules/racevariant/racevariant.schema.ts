import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { armorObject } from '@/modules/armor/armor.schema';
import { spellGroupObject, bonusesObject, choiceRandomObject, statObject, speedsObject, choiceListObject, sensesObject, actionObject, imageObject, abilitiesEnum, } from '@/modules/schemas';

// TODO: these are the keys of racevariant, edit them for racevariant
export const racevariantObject = z.object({
  name: z.string(),
  armor: z.array(
    z.union([armorObject, choiceRandomObject])
  ).optional(),
  subtypes: z.array(statObject).optional(),
  speeds: speedsObject.optional(),
  savingThrows: z.array(statObject).optional(),
  skills: z.union([z.array(statObject), choiceRandomObject, choiceListObject]).optional(),
  resistances: z.array(statObject).optional(),
  immunities: z.array(statObject).optional(),
  vulnerabilities: z.array(statObject).optional(),
  conditionImmunities: z.array(statObject).optional(),
  senses: sensesObject.optional(),
  blind: z.enum(['1','0']).optional(),
  canspeak: z.enum(['1','0']).optional(),
  telepathy: z.string().optional(),
  languages: z.union([z.array(statObject), choiceRandomObject, choiceListObject]).optional(),
  actions: z.array(actionObject).optional(),
  bonuses: bonusesObject.optional(),
  spellCasting: abilitiesEnum.optional(),
  spellSlots: z.array(spellGroupObject).optional(),
  // generator keys
  enableGenerator: z.enum(['1','0']).optional(),
  // publication keys
  //published: z.enum(['1','0']).optional(),
  image: imageObject,
  searchTags: z.array(z.string()).optional(),
  environments: z.array(z.string()).optional(),
  backgroundImage: z.string().optional(),
  background: z.object({}).passthrough(),
}).strict();


const id = z.number();
const userid = z.number();
const game = z.number();
const name = z.string().min(2);
const raceId = z.number();


const getRacevariantListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    }),
  ),
});

const getRacevariantResponseSchema = z.object({
  id,
  name,
  object: racevariantObject,
});


const createRacevariantSchema = z.object({
  game,
  raceId,
  object: racevariantObject,
});

const updateRacevariantSchema = z.object({
  object: racevariantObject,
});


export type createRacevariantInput = z.infer<typeof createRacevariantSchema>;
export type updateRacevariantInput = z.infer<typeof updateRacevariantSchema>;
export type Racevariant = z.infer<typeof racevariantObject>;


export const { schemas: racevariantSchemas, $ref } = buildJsonSchemas({
  createRacevariantSchema,
  updateRacevariantSchema,
  getRacevariantListResponseSchema,
  getRacevariantResponseSchema,
}, { $id: 'racevariantSchemas' });
