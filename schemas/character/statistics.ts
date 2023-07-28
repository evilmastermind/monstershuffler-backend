import { z } from 'zod';

export const statisticsObject = z.object({
  alignment: z.array(z.string()),
});
