import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { armorObject } from '@/modules/armor/armor.schema';
import { spellGroupObject, bonusesObject, choiceRandomObject, statObject, speedsObject, choiceListObject, sensesObject, actionObject, imageObject, abilitiesEnum, } from '@/modules/schemas';

export const professionObject = z.object({
  name: z.string(),
  femaleName: z.string(),
  workplace: z.string(),
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
  blind: z.boolean().optional(),
  canspeak: z.boolean().optional(),
  telepathy: z.string().optional(),
  languages: z.union([z.array(statObject), choiceRandomObject, choiceListObject]).optional(),
  actions: z.array(z.union([actionObject, choiceRandomObject])).optional(),
  bonuses: bonusesObject.optional(),
  spellCasting: abilitiesEnum.optional(),
  spellSlots: z.array(spellGroupObject).optional(),
  // generator keys
  enableGenerator: z.boolean().optional()
}).strict();

const id = z.number();
const userid = z.number();
const age = z.enum(['medieval', 'fantasy', 'renaissance', 'modern', 'future', 'space', 'other']);
const name = z.string().min(2);
const description = z.string();
const game = z.number();
const object = professionObject;

const getProfessionListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    }),
  ),
});

const getProfessionResponseSchema = z.object({
  object,
  id,
});

const createProfessionSchema = z.object({
  object,
  age,
  description,
  game,
});

export type createProfessionInput = z.infer<typeof createProfessionSchema>;
export type Profession = z.infer<typeof professionObject>;

export const { schemas: professionSchemas, $ref } = buildJsonSchemas({
  createProfessionSchema,
  getProfessionListResponseSchema,
  getProfessionResponseSchema,
}, { $id: 'professionSchemas' });
