import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { armorObject } from '@/modules/armor/armor.schema';
import { spellGroupObject, bonusesObject, choiceRandomObject, statObject, speedsObject, choiceListObject, sensesObject, actionObject, imageObject, abilitiesEnum, } from '@/modules/schemas';


export const classvariantObject = z.object({
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
const name = z.string().min(2);
const classId = z.number();


const getClassvariantListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    }),
  ),
});

const getClassvariantResponseSchema = z.object({
  id,
  name,
  object: classvariantObject,
});


const createClassvariantSchema = z.object({
  classId,
  object: classvariantObject,
});


export type createClassvariantInput = z.infer<typeof createClassvariantSchema>;
export type Classvariant = z.infer<typeof classvariantObject>;


export const { schemas: classvariantSchemas, $ref } = buildJsonSchemas({
  createClassvariantSchema,
  getClassvariantListResponseSchema,
  getClassvariantResponseSchema,
}, { $id: 'classvariantSchemas' });
