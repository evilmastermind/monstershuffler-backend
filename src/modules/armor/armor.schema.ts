import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const armorObject = z.object({
  AC: z.string(),
  cost: z.string().optional(),
  name: z.string().min(2),
  type: z.enum(['light', 'medium','heavy']),
  maxDex: z.number().optional(),
  weight: z.number().optional(),
  stealthDis: z.union([z.literal(0),z.literal(1)])
});

const id = z.number();
const userid = z.number();
const name = z.string().min(2);

const createArmorSchema = z.object({
  object: armorObject
});

const getArmorParamsSchema = z.object({
  id,
});

const getArmorResponseSchema = z.object({
  object: armorObject
});

const getArmorListResponseSchema = z.object({
  armor: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

export type createArmorInput = z.infer<typeof createArmorSchema>;
export type getArmorListResponse = z.infer<typeof getArmorListResponseSchema>;

export const {schemas: armorSchemas, $ref} = buildJsonSchemas({
  createArmorSchema,
  getArmorParamsSchema,
  getArmorResponseSchema,
  getArmorListResponseSchema
}, { $id: 'armorSchemas' });
