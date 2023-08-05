import { z } from 'zod';

export const statNumberString = z.object({
  number: z.number(),
  string: z.string(),
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
});
