import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { armorObject } from "@/modules/armor/armor.schema";
import {
  bonusesObject,
  choiceRandomObject,
  statObject,
  speedsObject,
  choiceListObject,
  sensesObject,
  actionObject,
  imageObject,
  spellGroupObject,
  abilitiesBaseObject,
  abilitiesEnum,
  spellsObject,
} from "@/modules/schemas";

export const templateObject = z
  .object({
    name: z.string(),
    // TODO: gender => pronouns
    pronouns: z.enum(["male", "female", "neutral", "thing"]).optional(),
    size: z.string().optional(),
    type: z.string().optional(),
    isSwarm: z.boolean().optional(),
    swarmSize: z.string().optional(),
    subtypes: z.array(statObject).optional(),
    // TODO: this method of defining the alignment doesn' work:
    // it's not possible to define templates whose alignment lean towards neutral
    // also: there were other types of alignment that I didn't handle
    // any Good/Neutral/Evil alignment (See Lich)
    alignment: z.tuple([z.number(), z.number(), z.number()]).optional(),
    armor: z.union([armorObject, choiceRandomObject]).optional(),
    HD: z.number().optional(),
    speeds: speedsObject.optional(),
    abilitiesBase: abilitiesBaseObject.optional(),
    savingThrows: z.array(statObject).optional(),
    skills: z
      .union([z.array(statObject), choiceRandomObject, choiceListObject])
      .optional(),
    resistances: z.array(statObject).optional(),
    immunities: z.array(statObject).optional(),
    vulnerabilities: z.array(statObject).optional(),
    conditionImmunities: z.array(statObject).optional(),
    senses: sensesObject.optional(),
    isBlind: z.boolean().optional(),
    canSpeak: z.boolean().optional(),
    telepathy: z.string().optional(),
    languages: z
      .union([z.array(statObject), choiceRandomObject, choiceListObject])
      .optional(),
    actions: z.array(actionObject).optional(),
    bonuses: bonusesObject.optional(),
    spellCasting: abilitiesEnum.optional(),
    spells: spellsObject.optional(),
    // publication keys
    image: imageObject.optional(),
    searchTags: z.array(z.string()).optional(),
    environments: z.array(z.string()).optional(),
    backgroundImage: z.string().optional(),
    background: z.object({}).passthrough().optional(),
  })
  .strict();

const id = z.number();
const userid = z.number();
const game = z.number();
const name = z.string().min(2);

const getTemplateListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

const getTemplateResponseSchema = z.object({
  object: templateObject,
});

const createTemplateSchema = z.object({
  object: templateObject,
  game,
});

const updateTemplateSchema = z.object({
  object: templateObject,
  game,
});

export type createTemplateInput = z.infer<typeof createTemplateSchema>;
export type updateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type Template = z.infer<typeof templateObject>;

export const { schemas: templateSchemas, $ref } = buildJsonSchemas(
  {
    createTemplateSchema,
    updateTemplateSchema,
    getTemplateListResponseSchema,
    getTemplateResponseSchema,
  },
  { $id: "templateSchemas" }
);
