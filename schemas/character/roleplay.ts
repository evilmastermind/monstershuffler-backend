import { z } from 'zod';

export const voiceObject = z.object({
  person: z.string(),
  character: z.string().optional(),
  production: z.string().optional(),
  filename: z.string(),
});

export type Voice = z.infer<typeof voiceObject>;
