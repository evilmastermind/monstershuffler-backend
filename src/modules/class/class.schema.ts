import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { armorObject } from '@/modules/armor/armor.schema';
import { choiceRandomObject, statObject, speedsObject, choiceListObject, sensesObject, actionObject, imageObject, } from '@/modules/schemas';


const choiceRandomObject = z.object({
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
const choiceListObject = z.object({
  type: z.string(),
  number: z.string(),
  list: z.array(z.string()),
  repeatable: z.enum(['1','0']).optional(),
  chosenAlready: z.array(z.string()).optional(),
});


const diceObject = z.object({
  die: z.string(),
  diceNumber: z.string(),
  diceIncrement: z.string(),
  levelMin: z.string(),
  levelMax: z.string(),
  levelInterval: z.string(),
});


const enchantmentObject = z.object({
  type: z.string(),
  dice: diceObject.optional(),
  expression: z.string().optional(),
});
const attackAttributesObject = z.object({
  die: z.string(),
  diceNumber: z.string(),
  reach: z.string(),
  targets: z.string(),
  damageType: z.string(),
  properties: z.array(z.string()),
});
const attackObject = z.object({
  name: z.string(),
  replaceName: z.enum(['1','0']).optional(),
  attributes: z.union([attackAttributesObject, choiceRandomObject]),
  enchantment: enchantmentObject.optional(),
});


const valueExpressionObject = z.object({
  name: z.string(),
  type: z.string(),
  expression: z.string().optional(),
});
const valueDiceObject = z.object({
  name: z.string(),
  type: z.string(),
  expression: z.string().optional(),
  dice: diceObject.optional(),
});
const valueIncrProgressionObject = z.object({
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


const actionVariantObject = z.object({
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
const actionObject = z.object({
  tag: z.string(),
  priority: z.string().optional(),
  variants: z.array(actionVariantObject),
});


const statObject = z.object({
  value: z.string(),
  levelMin: z.string().optional(),
});
const speedsObject = z.object({
  base: z.string().optional(),
  burrow: z.string().optional(),
  climb: z.string().optional(),
  fly: z.string().optional(),
  hover: z.string().optional(),
  swim: z.string().optional(),
});
const sensesObject = z.object({
  blindsight: z.string().optional(),
  darkvision: z.string().optional(),
  tremorsense: z.string().optional(),
  truesight: z.string().optional(),
});


const imageObject = z.object({
  imgdir: z.string(),
  lastedited: z.number(),
});


const bonusObject = z.object({
  name: z.string(),
  value: z.string(),
});
const bonusesObject = z.object({
  HPBonus: bonusObject.optional(),
  ACBonus: bonusObject.optional(),
  sizeBonus: bonusObject.optional(),
  speedBaseBonus: bonusObject.optional(),
  speedBurrowBonus: bonusObject.optional(),
  speedClimbBonus: bonusObject.optional(),
  speedFlyBonus: bonusObject.optional(),
  speedHoverBonus: bonusObject.optional(),
  speedSwimBonus: bonusObject.optional(),
  STRBonus: bonusObject.optional(),
  DEXBonus: bonusObject.optional(),
  CONBonus: bonusObject.optional(),
  INTBonus: bonusObject.optional(),
  WISBonus: bonusObject.optional(),
  CHABonus: bonusObject.optional(),
  STRSaveBonus: bonusObject.optional(),
  DEXSaveBonus: bonusObject.optional(),
  CONSaveBonus: bonusObject.optional(),
  INTSaveBonus: bonusObject.optional(),
  WISSaveBonus: bonusObject.optional(),
  CHASaveBonus: bonusObject.optional(),
  AthleticsBonus: bonusObject.optional(),
  AcrobaticsBonus: bonusObject.optional(),
  SleightOfHandBonus: bonusObject.optional(),
  StealthBonus: bonusObject.optional(),
  ArcanaBonus: bonusObject.optional(),
  HistoryBonus: bonusObject.optional(),
  InvestigationBonus: bonusObject.optional(),
  NatureBonus: bonusObject.optional(),
  ReligionBonus: bonusObject.optional(),
  AnimalHandlingBonus: bonusObject.optional(),
  InsightBonus: bonusObject.optional(),
  MedicineBonus: bonusObject.optional(),
  PerceptionBonus: bonusObject.optional(),
  SurvivalBonus: bonusObject.optional(),
  DeceptionBonus: bonusObject.optional(),
  IntimidationBonus: bonusObject.optional(),
  PerformanceBonus: bonusObject.optional(),
  PersuasionBonus: bonusObject.optional(),
  blindsightBonus: bonusObject.optional(),
  darkvisionBonus: bonusObject.optional(),
  tremorsenseBonus: bonusObject.optional(),
  truesightBonus: bonusObject.optional(),
  rangedAttackBonus: bonusObject.optional(),
  rangedDamageBonus: bonusObject.optional(),
  meleeAttackBonus: bonusObject.optional(),
  meleeDamageBonus: bonusObject.optional(),
  spellAttackBonus: bonusObject.optional(),
  spellDamageBonus: bonusObject.optional(),
  weaponAttackBonus: bonusObject.optional(),
  weaponDamageBonus: bonusObject.optional(),
});


const classObject = z.object({
  name: z.string(),
  armor: z.array(
    z.union([armorObject, choiceRandomObject])
  ).optional(),
  subtypes: z.array(statObject).optional(),
  speeds: speedsObject.optional(),
  savingThrows: z.array(statObject).optional(),
  skills: z.union([z.array(statObject), choiceRandomObject, choiceListObject]).optional(),
  resistances: z.array(statObject).optional(),
  immunities: z.array(statObject).optional(),
  vulnerabilities: z.array(statObject).optional(),
  conditionImmunities: z.array(statObject).optional(),
  senses: sensesObject.optional(),
  blind: z.enum(['1','0']).optional(),
  canspeak: z.enum(['1','0']).optional(),
  telepathy: z.string().optional(),
  languages: z.union([z.array(statObject), choiceRandomObject, choiceListObject]).optional(),
  actions: z.array(actionObject).optional(),
  bonuses: bonusesObject.optional(),
  // generator keys
  enableGenerator: z.enum(['1','0']).optional(),
  // publication keys
  //published: z.enum(['1','0']).optional(),
  image: imageObject,
  searchTags: z.array(z.string()).optional(),
  environments: z.array(z.string()).optional(),
  backgroundImage: z.string().optional(),
  background: z.object({}).passthrough(),
}).strict();


const id = z.number();
const userid = z.number();
const name = z.string().min(2);

const getClassListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    }),
  ),
});

const getClassResponseSchema = z.object({
  object: classObject,
});

const createClassSchema = z.object({
  object: classObject,
});

export type createClassInput = z.infer<typeof createClassSchema>;
export type Class = z.infer<typeof classObject>;

export const { schemas: classSchemas, $ref } = buildJsonSchemas({
  createClassSchema,
  getClassListResponseSchema,
  getClassResponseSchema,
}, { $id: 'classSchemas' });
