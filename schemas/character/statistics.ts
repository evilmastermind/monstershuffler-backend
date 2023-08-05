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

export const statisticsObject = z.object({
  alignment: z.array(z.string()),
  prename: z.string(),
  name: z.string(),
  surname: z.string(),
  fullName: z.string(),
  level: z.number(),
  CR: statNumberString,
  XP: z.string(),
  proficiency: z.number(),
  size: statNumberString,
  abilityScores: Abilities,
  abilityModifiers: Abilities,
  HP: statNumberString,
});
