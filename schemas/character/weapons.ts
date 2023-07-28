import { z } from 'zod';

export const weaponObject = z.object({
  name: z.string().optional(),
  cost: z.string().optional(),
  weight: z.string().optional(),
  damageType: z.string().optional(),
  special: z.string().optional(),
  die: z.string().optional(),
  diceNumber: z.string().optional(),
  dieV: z.string().optional(),
  diceNumberV: z.string().optional(),
  range: z.string().optional(),
  rangeMax: z.string().optional(),
  properties: z.array(z.string()),
});
