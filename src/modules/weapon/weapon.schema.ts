import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";

export const weaponObject = z.object({
  name: z.string().optional(),
  cost: z.string().optional(),
  weight: z.string().optional(),
  damageType: z.string().optional(),
  special: z.string().optional(),
  die: z.string().optional(),
  diceNumber: z.string().optional(),
  dieV: z.string().optional(),
  diceNumberV: z.string().optional(),
  range: z.string().optional(),
  rangeMax: z.string().optional(),
  properties: z.array(z.string()),
});

const id = z.number();
const userid = z.number();
const game = z.number();
const name = z.string().min(2);

const createWeaponSchema = z.object({
  game,
  object: weaponObject,
});

const updateWeaponSchema = z.object({
  object: weaponObject,
});

const getWeaponParamsSchema = z.object({
  id,
});

const getWeaponResponseSchema = z.object({
  object: weaponObject,
});

const getWeaponListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

export type createWeaponInput = z.infer<typeof createWeaponSchema>;
export type updateWeaponInput = z.infer<typeof updateWeaponSchema>;
export type getWeaponListResponse = z.infer<typeof getWeaponListResponseSchema>;

export const { schemas: weaponSchemas, $ref } = buildJsonSchemas(
  {
    createWeaponSchema,
    updateWeaponSchema,
    getWeaponParamsSchema,
    getWeaponResponseSchema,
    getWeaponListResponseSchema,
  },
  { $id: "weaponSchemas" }
);
