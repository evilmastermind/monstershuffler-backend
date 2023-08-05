import { z } from 'zod';

export const abilitiesEnum = z.enum(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']);

export const abilitiesBaseObject = z.object({
  STR: z.number().optional(),
  DEX: z.number().optional(),
  CON: z.number().optional(),
  INT: z.number().optional(),
  WIS: z.number().optional(),
  CHA: z.number().optional(),
});
