import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { armorObject } from '@/modules/armor/armor.schema';
import { bonusesObject, choiceRandomObject, statObject, speedsObject, choiceListObject, sensesObject, actionObject, imageObject, spellGroupObject, abilitiesBaseObject, abilitiesEnum } from '@/modules/schemas';





export const templateObject = z.object({
  name: z.string(),
  // TODO: gender => pronouns
  gender: z.enum(['male','female','neutral','thing']).optional(),
  size: z.string().optional(),
  type: z.string().optional(),
  swarm: z.enum(['1','0']).optional(),
  swarmSize: z.string().optional(),
  subtypes: z.array(statObject).optional(),
  // TODO: this method of defining the alignment doesn' work:
  // it's not possible to define templates whose alignment lean towards neutral
  // also: there were other types of alignment that I didn't handle
  // any Good/Neutral/Evil alignment (See Lich)
  alignment: z.tuple([z.string(), z.string()]).optional(),
  armor: z.array(
    z.union([armorObject, choiceRandomObject])
  ).optional(),
  HD: z.number().optional(),
  speeds: speedsObject.optional(),
  abilitiesBase: abilitiesBaseObject.optional(),
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

const getTemplateListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    }),
  ),
});

const getTemplateResponseSchema = z.object({
  object: templateObject,
});

const createTemplateSchema = z.object({
  object: templateObject,
});

export type createTemplateInput = z.infer<typeof createTemplateSchema>;
export type Template = z.infer<typeof templateObject>;

export const { schemas: templateSchemas, $ref } = buildJsonSchemas({
  createTemplateSchema,
  getTemplateListResponseSchema,
  getTemplateResponseSchema,
}, { $id: 'templateSchemas' });