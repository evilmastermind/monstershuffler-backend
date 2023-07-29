import { z } from 'zod';

export const statisticsObject = z.object({
  alignment: z.array(z.string()),
  prename: z.string(),
  name: z.string(),
  surname: z.string(),
  fullName: z.string(),
  level: z.number(),
});
