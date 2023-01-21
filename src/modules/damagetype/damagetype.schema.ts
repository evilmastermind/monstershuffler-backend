import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const id = z.number();
const userid = z.number();
const name = z.string().min(2);
const description = z.string().min(2);

const createDamageTypeSchema = z.object({
  name,
  description,
});

const getDamageTypeResponseSchema = z.object({
  id,
  userid,
  name,
  description,
});

const updateDamageTypeSchema = z.object({
  name,
  description,
});

const getDamageTypeListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
      description,
    })
  ),
});

export type createDamageTypeInput = z.infer<typeof createDamageTypeSchema>;
export type getDamageTypeListResponse = z.infer<typeof getDamageTypeListResponseSchema>;

export const {schemas: damageTypeSchemas, $ref} = buildJsonSchemas({
  createDamageTypeSchema,
  updateDamageTypeSchema,
  getDamageTypeResponseSchema,
  getDamageTypeListResponseSchema
}, { $id: 'damageTypeSchemas' });
