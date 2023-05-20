import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { armorObject } from '@/modules/armor/armor.schema';
import { spellGroupObject, bonusesObject, choiceRandomObject, statObject, speedsObject, choiceListObject, sensesObject, actionObject, imageObject, abilitiesEnum, spellsObject, } from '@/modules/schemas';



export const classObject = z.object({
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


const getClassListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    }),
  ),
});


const getClassWithVariantsListResponseSchema = z.object({
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
    }),
  ),
});


const getClassResponseSchema = z.object({
  object: classObject,
  id,
});


const createClassSchema = z.object({
  game,
  object: classObject,
});

const updateClassSchema = z.object({
  object: classObject,
  game,
});


export type createClassInput = z.infer<typeof createClassSchema>;
export type updateClassInput = z.infer<typeof updateClassSchema>;
export type Class = z.infer<typeof classObject>;


export const { schemas: classSchemas, $ref } = buildJsonSchemas({
  updateClassSchema,
  createClassSchema,
  getClassWithVariantsListResponseSchema,
  getClassListResponseSchema,
  getClassResponseSchema,
}, { $id: 'classSchemas' });
