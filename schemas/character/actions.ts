import { z } from "zod";
import { weaponObject } from "@/schemas/character/weapons";
import { choiceRandomObject, choiceListObject } from "@/schemas/character/choices";
import { abilitiesEnum } from "@/schemas/character/abilities";

export const actionTypesEnum = z.enum([
  "trait",
  "legendary",
  "action",
  "reaction",
  "bonus",
  "attack",
  "multiattack",
  "mythic",
  "lair",
]);

export const diceObject = z.object({
  die: z.string(),
  diceNumber: z.string(),
  diceIncrement: z.string(),
  levelMin: z.string(),
  levelMax: z.string(),
  levelInterval: z.string(),
});

export const enchantmentObject = z.object({
  type: z.string(),
  dice: diceObject.optional(),
  expression: z.string().optional(),
});
export const attackAttributesObject = z.object({
  reach: z.string().optional(),
  targets: z.string().optional(),
});
export const attackObject = z.object({
  name: z.string(),
  replaceName: z.boolean().optional(),
  attributes: z.union([
    attackAttributesObject.merge(weaponObject),
    choiceRandomObject,
  ]),
  enchantment: enchantmentObject.optional(),
});

export const valueExpressionObject = z.object({
  name: z.string(),
  type: z.string().optional(),
  expression: z.string(),
});
export const valueDiceObject = z.object({
  name: z.string(),
  type: z.string().optional(),
  expression: z.string().optional(),
  dice: diceObject,
});

export const valueIncrProgressionObject = z.object({
  name: z.string(),
  type: z.string().optional(),
  incrProgression: z.object({
    levelInterval: z.string(),
    levelIncrement: z.string(),
    levelMin: z.string(),
    base: z.string(),
    increment: z.string(),
  }),
});

export const actionVariantObject = z.object({
  name: z.string(),
  description: z.string(),
  type: actionTypesEnum,
  levelMin: z.number().optional(),
  levelMax: z.number().optional(),
  ability: abilitiesEnum.optional(),
  charges: z.string().optional(),
  recharge: z.string().optional(),
  cost: z.string().optional(),
  values: z
    .array(
      z.union([
        valueExpressionObject,
        valueDiceObject,
        valueIncrProgressionObject,
      ])
    )
    .optional(),
  attacks: z.array(attackObject).optional(),
});
export const actionObject = z.object({
  tag: z.string(),
  actionType: actionTypesEnum.optional(),
  subType: z.string().optional(),
  source: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.number().optional(),
  variants: z.array(
    z.union([actionVariantObject, choiceRandomObject, choiceListObject])
  ),
});
