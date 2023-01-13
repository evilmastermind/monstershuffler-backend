import { z } from 'zod';

export const jwtHeaderRequired = {
  type: 'object',
  properties: {
    'authorization': { type: 'string'}
  },
  required: ['authorization']
};

export const jwtHeaderOptional = {
  type: 'object',
  properties: {
    'authorization': { type: 'string' }
  },
};

export const BatchPayload = {
  type: 'object',
  properties: {
    count: { type: 'number' }
  }
};



// object schemas
export const choiceRandomObject = z.object({
  type: z.string(),
  field: z.string(),
  number: z.string(),
  result: z.string(),
  source: z.enum(['actions','armor','backgrounds','bases','damagetypes','languages','names','professions','skills','spells','traits','voices','weapons']).optional(),
  filtersObject: z.array(z.object({
    keyName: z.string(),
    keyValues: z.array(z.string()),
  })).optional(), 
});
export const choiceListObject = z.object({
  type: z.string(),
  number: z.string(),
  list: z.array(z.string()),
  repeatable: z.enum(['1','0']).optional(),
  chosenAlready: z.array(z.string()).optional(),
});


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
  die: z.string(),
  diceNumber: z.string(),
  reach: z.string(),
  targets: z.string(),
  damageType: z.string(),
  properties: z.array(z.string()),
});
export const attackObject = z.object({
  name: z.string(),
  replaceName: z.enum(['1','0']).optional(),
  attributes: z.union([attackAttributesObject, choiceRandomObject]),
  enchantment: enchantmentObject.optional(),
});


export const valueExpressionObject = z.object({
  name: z.string(),
  type: z.string(),
  expression: z.string().optional(),
});
export const valueDiceObject = z.object({
  name: z.string(),
  type: z.string(),
  expression: z.string().optional(),
  dice: diceObject.optional(),
});
export const valueIncrProgressionObject = z.object({
  name: z.string(),
  type: z.string(),
  incrProgression: z.object({
    levelInterval: z.string(),
    levelIncrement: z.string(),
    levelMin: z.string(),
    base: z.string(),
    increment: z.string(),
  }).optional(),
});

export const spellGroupObject = z.object({
  tag: z.string(),
  levelMin: z.string(),
  timesDay: z.string(),
  timesDayMax: z.string(),
  spells: z.union([z.array(z.string()), choiceRandomObject, choiceListObject]),
}).strict();


export const actionVariantObject = z.object({
  name: z.string(),
  type: z.enum(['trait', 'legendary', 'action', 'reaction', 'bonus', 'attack', 'multiattack', 'mythic', 'lair']),
  levelMin: z.string().optional(),
  levelMax: z.string().optional(),
  ability: z.enum(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']).optional(),
  charges: z.string().optional(),
  recharge: z.string().optional(),
  cost: z.string().optional(),
  description: z.string(),
  values: z.array(
    z.union([valueExpressionObject, valueDiceObject, valueIncrProgressionObject])
  ).optional(),
  attacks: z.array(attackObject).optional(),
});
export const actionObject = z.object({
  tag: z.string(),
  priority: z.string().optional(),
  variants: z.array(actionVariantObject),
});


export const statObject = z.object({
  value: z.string(),
  levelMin: z.string().optional(),
});
export const speedsObject = z.object({
  base: z.string().optional(),
  burrow: z.string().optional(),
  climb: z.string().optional(),
  fly: z.string().optional(),
  hover: z.string().optional(),
  swim: z.string().optional(),
});
export const sensesObject = z.object({
  blindsight: z.string().optional(),
  darkvision: z.string().optional(),
  tremorsense: z.string().optional(),
  truesight: z.string().optional(),
});


export const imageObject = z.object({
  imgdir: z.string(),
  lastedited: z.number(),
});