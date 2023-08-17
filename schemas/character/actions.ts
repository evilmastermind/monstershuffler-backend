import { z } from 'zod';
import { weaponObject } from '@/schemas/character/weapons';
import {
  choiceRandomObject,
  choiceListObject,
} from '@/schemas/character/choices';
import { abilitiesEnum } from '@/schemas/character/abilities';

export const actionTypesEnum = z.enum([
  'trait',
  'legendary',
  'action',
  'reaction',
  'bonus',
  'attack',
  'multiattack',
  'mythic',
  'lair',
]);

export const diceObject = z.object({
  die: z.number(),
  diceNumber: z.number(),
  diceIncrement: z.number().optional(),
  availableAt: z.number().optional(),
  availableUntil: z.number().optional(),
  availableUnit: z.enum(['level','cr']).optional(),
  unitInterval: z.number().optional(),
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
    unitInterval: z.string(),
    unitIncrement: z.string(),
    availableAt: z.string(),
    availableUnit: z.enum(['level','cr']).optional(),
    valueBase: z.string(),
    valueIncrement: z.string(),
  }),
});

export const actionVariantObject = z.object({
  name: z.string(),
  description: z.string(),
  type: actionTypesEnum.optional(),
  availableAt: z.number().optional(),
  ability: abilitiesEnum.optional(),
  charges: z.string().optional(),
  recharge: z.string().optional(),
  cost: z.string().optional(),
  values: z
    .array(
      z.union([
        z.any(),
        z.any(),
        valueIncrProgressionObject,
      ])
    )
    .optional(),
  attacks: z.array(attackObject).optional(),
}); 
export const actionObject = z.object({
  tag: z.string(),
  actionType: actionTypesEnum.optional(),
  priority: z.number().optional(),
  availableUnit: z.enum(['level','cr']).optional(),
  availableUntil: z.number().optional(),
  subType: z.string().optional(),
  source: z.string().optional(),
  tags: z.array(z.string()).optional(),
  variants: z.array(
    z.union([actionVariantObject, choiceRandomObject, choiceListObject])
  ),
});
