import { z } from 'zod';


export const variationsObject = z.object({
  currentCR: z.number().optional(),
  currentHD: z.number().optional(),
});
