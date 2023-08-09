import { z } from 'zod';

export const armorTypes = z.enum(['light', 'medium', 'heavy']);

export const armorObject = z.object({
  AC: z.string(),
  name: z.string(),
  isAutomaticCalcDisabled: z.boolean().optional(),
  cost: z.string().optional(),
  type: armorTypes.optional(),
  maxDex: z.string().optional(),
  minStr: z.string().optional(),
  weight: z.string().optional(),
  stealthDis: z.boolean().optional(),
});
