import { stat } from 'fs';
import { z } from 'zod';

const statNumberString = z.object({
  number: z.number(),
  string: z.string(),
  id: z.number().optional(),
});

export const Abilities = z.object({
  STR: z.number(),
  DEX: z.number(),
  CON: z.number(),
  INT: z.number(),
  WIS: z.number(),
  CHA: z.number(),
});

const DescriptionPart = z.object({
  string: z.string(),
  type: z.enum(['background' , 'spell' , 'trait' , 'race' , 'class' , 'template' , 'type' , 'subtype' , 'language' , 'skill'  , 'savingThrow' , 'condition' , 'resistance' , 'immunity' , 'vulnerability' , 'conditionImmunity']).optional(),
  id: z.number().optional(),
});

export const Pronouns = z.enum(['male', 'female', 'neutral', 'thing']);

export const statisticsObject = z.object({
  alignment: z.array(z.string()),
  pronouns: Pronouns,
  prename: z.string(),
  name: z.string(),
  surname: z.string(),
  fullName: z.string(),
  characterHook: z.array(DescriptionPart).optional(),
  level: z.number(),
  CR: statNumberString,
  XP: z.string(),
  proficiency: z.number(),
  size: statNumberString,
  sizeSingleEntityOfSwarm: statNumberString.optional(),
  abilityScores: Abilities,
  abilityModifiers: Abilities,
  HP: statNumberString,
  type: statNumberString.optional(),
  subtypes: z.array(statNumberString).optional(),
});

export type Statistics = z.infer<typeof statisticsObject>;
