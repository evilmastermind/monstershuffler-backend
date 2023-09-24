import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { backgroundObject } from '@/schemas/character';

const id = z.number();
const userid = z.number();
const age = z.enum([
  'medieval',
  'fantasy',
  'renaissance',
  'modern',
  'future',
  'space',
  'other',
]);
const name = z.string().min(2);
const description = z.string();
const game = z.number();
const object = backgroundObject;

const getBackgroundListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

const getBackgroundResponseSchema = z.object({
  object,
  id,
  name: z.string(),
  femaleName: z.string(),
  age: z.string(),
  description: z.string(),
});

const createBackgroundSchema = z.object({
  object,
  age,
  description,
  game,
});

export type createBackgroundInput = z.infer<typeof createBackgroundSchema>;
export type Background = z.infer<typeof backgroundObject>;

export const { schemas: backgroundSchemas, $ref } = buildJsonSchemas(
  {
    createBackgroundSchema,
    getBackgroundListResponseSchema,
    getBackgroundResponseSchema,
  },
  { $id: 'backgroundSchemas' }
);
