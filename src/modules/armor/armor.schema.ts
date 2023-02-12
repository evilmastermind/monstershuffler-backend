import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

export const armorObject = z.object({
  AC: z.string(),
  name: z.string().min(2),
  cost: z.string().optional(),
  type: z.enum(['light', 'medium','heavy']).optional(),
  maxDex: z.string().optional(),
  minStr: z.string().optional(),
  weight: z.string().optional(),
  stealthDis: z.union([z.literal('0'),z.literal('1')]).optional(),
});

const id = z.number();
const game = z.number();
const userid = z.number();
const name = z.string().min(2);

const createArmorSchema = z.object({
  game,
  name,
  object: armorObject
});

const updateArmorSchema = z.object({
  name,
  object: armorObject
});

const getArmorParamsSchema = z.object({
  id,
});

const getArmorResponseSchema = z.object({
  object: armorObject
});

const getArmorListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

export type createArmorInput = z.infer<typeof createArmorSchema>;
export type updateArmorInput = z.infer<typeof updateArmorSchema>;
export type getArmorListResponse = z.infer<typeof getArmorListResponseSchema>;
export type Armor = z.infer<typeof armorObject>;

export const {schemas: armorSchemas, $ref} = buildJsonSchemas({
  createArmorSchema,
  updateArmorSchema,
  getArmorParamsSchema,
  getArmorResponseSchema,
  getArmorListResponseSchema
}, { $id: 'armorSchemas' });
