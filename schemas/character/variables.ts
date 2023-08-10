import { z } from 'zod';

export const variablesObject = z.object({
  LVL: z.number(),
  CR: z.number(),
  PROF: z.number(),
  SIZE: z.number(),
  HD: z.number(),
  HP: z.number(),
  STR: z.number(),
  DEX: z.number(),
  CON: z.number(),
  INT: z.number(),
  WIS: z.number(),
  CHA: z.number(),
  STRVALUE: z.number(),
  DEXVALUE: z.number(),
  CONVALUE: z.number(),
  INTVALUE: z.number(),
  WISVALUE: z.number(),
  CHAVALUE: z.number(),
});
