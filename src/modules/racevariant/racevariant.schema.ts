import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { armorObject } from '@/modules/armor/armor.schema';
import { spellGroupObject, bonusesObject, choiceRandomObject, statObject, speedsObject, choiceListObject, sensesObject, actionObject, imageObject, abilitiesEnum, spellsObject, } from '@/modules/schemas';

// TODO: these are the keys of racevariant, edit them for racevariant
export const racevariantObject = z.object({
  name: z.string(),
  pronouns: z.enum(['male','female','neutral','thing']).optional(),
  armor: z.union([armorObject, choiceRandomObject]).optional(),
  subtypes: z.array(statObject).optional(),
  speeds: speedsObject.optional(),
  savingThrows: z.array(statObject).optional(),
  skills: z.union([z.array(statObject), choiceRandomObject, choiceListObject]).optional(),
  resistances: z.array(statObject).optional(),
  immunities: z.array(statObject).optional(),
  vulnerabilities: z.array(statObject).optional(),
  conditionImmunities: z.array(statObject).optional(),
  senses: sensesObject.optional(),
  isBlind: z.boolean().optional(),
  canSpeak: z.boolean().optional(),
  telepathy: z.string().optional(),
  languages: z.union([z.array(statObject), choiceRandomObject, choiceListObject]).optional(),
  actions: z.array(actionObject).optional(),
  spells: spellsObject.optional(),
  // generator keys
  enableGenerator: z.boolean().optional(),
  // publication keys
  image: imageObject.optional(),
  searchTags: z.array(z.string()).optional(),
  environments: z.array(z.string()).optional(),
  backgroundImage: z.string().optional(),
  background: z.object({}).passthrough().optional(),
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
