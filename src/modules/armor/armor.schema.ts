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

const armorCore = {
  name: z
    .string({
      required_error: 'Name is a required field',
    })
    .min(2, { message: 'Name is too short (min 2 characters)'
    }),
};

const createArmorSchema = z.object({
  object: armorObject
});
const getArmorSchema = z.object({
  userid: z
    .number({
      required_error: 'Userid is a required field',
    }),
  ...armorCore,
});

// const getArmorResponseSchema = z.object({
//   ...armorCore,
//   id: z.number(),
//   userid: z.number(),
//   object: armorObject
// });

export type createArmorInput = z.infer<typeof createArmorSchema>;
export type getArmorInput = z.infer<typeof getArmorSchema>;

export const {schemas: armorSchemas, $ref} = buildJsonSchemas({
  createArmorSchema,
  getArmorSchema,
  // getArmorResponseSchema
}, { $id: 'armorSchemas' });
