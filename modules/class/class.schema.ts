import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { classObject } from '@/schemas/character';

const id = z.number();
const userid = z.number();
const game = z.number();
const name = z.string().min(2);

const getClassListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

const getClassWithVariantsListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
      other_objects: z.array(
        z.object({
          id,
          name,
          userid,
        })
      ),
    })
  ),
});

const getClassResponseSchema = z.object({
  object: classObject,
  id,
});

const createClassSchema = z.object({
  game,
  object: classObject,
});

const updateClassSchema = z.object({
  object: classObject,
  game,
});

export type createClassInput = z.infer<typeof createClassSchema>;
export type updateClassInput = z.infer<typeof updateClassSchema>;
export type Class = z.infer<typeof classObject>;

export const { schemas: classSchemas, $ref } = buildJsonSchemas(
  {
    updateClassSchema,
    createClassSchema,
    getClassWithVariantsListResponseSchema,
    getClassListResponseSchema,
    getClassResponseSchema,
  },
  { $id: 'classSchemas' }
);
