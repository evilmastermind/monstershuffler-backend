import { z } from 'zod';

// object schemas
export const statObject = z.object({
  id: z.number().optional(),
  value: z.string(),
  availableAt: z.number().optional(),
});
export const choiceRandomObject = z.object({
  choice: z.object({
    type: z.literal('random'),
    number: z.number().optional(),
    resultType: z.enum(['object', 'nameId']),
    source: z.enum(['objects', 'languages', 'skills']),
    objectType: z.number().optional(),
    filters: z
      .array(
        z.object({
          keyName: z.string(),
          keyValues: z.array(z.string()),
        })
      )
      .optional(),
    chosenAlready: z.array(statObject).optional(),
  }),
});
export const choiceListObject = z.object({
  choice: z.object({
    type: z.literal('list'),
    number: z.number(),
    list: z.array(statObject),
    isRepeatable: z.boolean().optional(),
  }),
});
export type Choice = z.infer<typeof statObject>;
export type ChoiceRandomObject = z.infer<typeof choiceRandomObject>;
export type ChoiceListObject = z.infer<typeof choiceListObject>;
