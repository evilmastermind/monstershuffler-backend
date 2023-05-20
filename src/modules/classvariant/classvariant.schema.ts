import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { armorObject } from '@/modules/armor/armor.schema';
import { spellGroupObject, bonusesObject, choiceRandomObject, statObject, speedsObject, choiceListObject, sensesObject, actionObject, imageObject, abilitiesEnum, spellsObject, } from '@/modules/schemas';


export const classvariantObject = z.object({
  name: z.string(),
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
  bonuses: bonusesObject.optional(),
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
const classId = z.number();


const getClassvariantListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
      objects:
        z.object({
          id,
          name,
        })
    }),
  ),
});

const getClassvariantClassListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    }),
  ),
});

const getClassvariantResponseSchema = z.object({
  object: classvariantObject,
  id,
});


const createClassvariantSchema = z.object({
  game,
  classId,
  object: classvariantObject,
});

const updateClassvariantSchema = z.object({
  object: classvariantObject,
});

export type createClassvariantInput = z.infer<typeof createClassvariantSchema>;
export type updateClassvariantInput = z.infer<typeof updateClassvariantSchema>;
export type Classvariant = z.infer<typeof classvariantObject>;


export const { schemas: classvariantSchemas, $ref } = buildJsonSchemas({
  createClassvariantSchema,
  updateClassvariantSchema,
  getClassvariantListResponseSchema,
  getClassvariantClassListResponseSchema,
  getClassvariantResponseSchema,
}, { $id: 'classvariantSchemas' });
