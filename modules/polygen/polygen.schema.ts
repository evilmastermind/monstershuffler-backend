import { z } from 'zod';

const grammar = z.object({
  grammar: z.string(),
});

export const result = z.object({
  result: z.string(),
});

export type Grammar = z.infer<typeof grammar>;
