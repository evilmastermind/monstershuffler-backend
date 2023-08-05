import { z } from 'zod';

export const variablesObject = z.object({
  LVL: z.number(),
  CR: z.number(),
  PROF: z.number(),
  SIZE: z.number(),
  HD: z.number(),
});
