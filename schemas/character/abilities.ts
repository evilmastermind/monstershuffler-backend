import { z } from 'zod';

export const abilitiesEnum = z.enum(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']);

export const abilitiesBaseObject = z.object({
  STR: z.string().optional(),
  DEX: z.string().optional(),
  CON: z.string().optional(),
  INT: z.string().optional(),
  WIS: z.string().optional(),
  CHA: z.string().optional(),
});
