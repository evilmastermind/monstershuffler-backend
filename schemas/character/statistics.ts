import { z } from 'zod';

export const statNumberString = z.object({
  number: z.number(),
  string: z.string(),
});

export const Abilities = z.object({
  STR: z.number(),
  DEX: z.number(),
  CON: z.number(),
  INT: z.number(),
  WIS: z.number(),
  CHA: z.number(),
});

export const DescriptionPart = z.object({
  string: z.string(),
  type: z.enum(['background', 'spell', 'trait', 'race', 'class', 'template']).optional(),
  id: z.number().optional(),
});

export const statisticsObject = z.object({
  alignment: z.array(z.string()),
  pronouns: z.enum(['male', 'female', 'neutral', 'thing']),
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
  sizeSwarmSingleEntity: statNumberString.optional(),
  abilityScores: Abilities,
  abilityModifiers: Abilities,
  HP: statNumberString,
});

type Statistics = z.infer<typeof statisticsObject>;
