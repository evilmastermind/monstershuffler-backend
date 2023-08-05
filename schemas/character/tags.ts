import { z } from 'zod';


export const tagsObject = z.object({
  size: z.string(),
  sizegreater: z.string(),
  sizesmaller: z.string(),
  sizetwogreater: z.string(),
  sizetwosmaller: z.string(),
});
