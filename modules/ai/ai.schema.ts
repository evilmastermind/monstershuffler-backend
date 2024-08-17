import { z } from 'zod';

export const CURRENT_GOOD_MODEL= 'gpt-4o-2024-08-06';
export const CURRENT_CHEAP_MODEL= 'gpt-4o-mini';

export const sGenerateTextBody = z.object({
  prompt: z.string(),
  model: z.string().optional()
});

export const sGenerateTextResponse = z.object({
  id: z.string(),
  object: z.string(),
  created: z.number(),
  model: z.string(),
  choices: z.array(z.object({
    message: z.object({
      content: z.string(),
      index: z.number()
    }),
    index: z.number(),
    completions: z.number()
  }))
});

export type GenerateTextInput = z.infer<typeof sGenerateTextBody>;
export type GenerateTextResponse = z.infer<typeof sGenerateTextResponse>;
