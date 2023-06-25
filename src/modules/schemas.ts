import { z } from "zod";
import { armorObject } from "@/modules/armor/armor.schema";
import { weaponObject } from "@/modules/weapon/weapon.schema";

export const jwtHeaderRequired = {
  type: "object",
  properties: {
    authorization: { type: "string" },
  },
  required: ["authorization"],
};

export const jwtHeaderOptional = {
  type: "object",
  properties: {
    authorization: { type: "string" },
  },
};

export const BatchPayload = {
  type: "object",
  properties: {
    count: { type: "number" },
  },
};

export type AnyObject = {
  [key: string]: any;
};

export const abilitiesEnum = z.enum(["STR", "DEX", "CON", "INT", "WIS", "CHA"]);

// lists of choices, and the chosenAlready array
// will now be a list of objects with name and/or id
// id is optional so that lists with custom entries can still be created
// export const choice = z.object({
//   id: z.number().optional(),
//   name: z.string(),
// });
// export const chosenAlready = z.object({
//   id: z.number(),
//   value: z.string(),
// });

// object schemas
export const statObject = z.object({
  id: z.number().optional(),
  value: z.string(),
  levelMin: z.string().optional(),
});
export const choiceRandomObject = z.object({
  choice: z.object({
    type: z.literal("random"),
    number: z.number().optional(),
    resultType: z.enum(["object", "nameId"]),
    source: z.enum(["objects", "languages", "skills"]),
    objectType: z.number().optional(),
    filters: z
      .array(
        z.object({
          keyName: z.string(),
          keyValues: z.array(z.string()),
        })
      )
      .optional(),
    chosenAlready: z.array(statObject).optional(),
  }),
});
export const choiceListObject = z.object({
  choice: z.object({
    type: z.literal("list"),
    number: z.number(),
    list: z.array(statObject),
    isRepeatable: z.boolean().optional(),
  }),
});
export type Choice = z.infer<typeof statObject>;
export type ChoiceRandomObject = z.infer<typeof choiceRandomObject>;
export type ChoiceListObject = z.infer<typeof choiceListObject>;

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

export const spellGroupObject = z
  .object({
    tag: z.string(),
    levelMin: z.string().optional(),
    timesDay: z.string().optional(),
    timesDayMax: z.string().optional(),
    spells: z.union([
      z.array(statObject),
      choiceRandomObject,
      choiceListObject,
    ]),
  })
  .strict();

export const spellsObject = z.object({
  hasSlots: z.boolean().optional(),
  ability: abilitiesEnum.optional(),
  groups: z.array(spellGroupObject).optional(),
});

export const spellObject = z
  .object({
    name: z.string().min(2),
    level: z.number(),
    range: z.string(),
    ritual: z.boolean(),
    school: z.string().min(2),
    source: z.string(),
    classes: z.array(z.string()),
    duration: z.string(),
    components: z.string(),
    castingTime: z.string(),
    description: z.string(),
  })
  .strict();

export const abilitiesBaseObject = z.object({
  STR: z.string().optional(),
  DEX: z.string().optional(),
  CON: z.string().optional(),
  INT: z.string().optional(),
  WIS: z.string().optional(),
  CHA: z.string().optional(),
});

export const actionVariantObject = z.object({
  name: z.string(),
  description: z.string(),
  type: z.enum([
    "trait",
    "legendary",
    "action",
    "reaction",
    "bonus",
    "attack",
    "multiattack",
    "mythic",
    "lair",
  ]),
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
  actionType: z
    .enum([
      "trait",
      "legendary",
      "action",
      "reaction",
      "bonus",
      "attack",
      "multiattack",
      "mythic",
      "lair",
    ])
    .optional(),
  subType: z.string().optional(),
  source: z.string().optional(),
  tags: z.array(z.string()).optional(),
  priority: z.number().optional(),
  variants: z.array(
    z.union([actionVariantObject, choiceRandomObject, choiceListObject])
  ),
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

const bonusObject = z.object({
  name: z.string().optional(),
  value: z.string(),
});
export const bonusesObject = z.object({
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

export const imageObject = z.object({
  imgdir: z.string(),
  lastedited: z.number(),
});

export const CRTwoPointsObject = z.object({
  x1: z.string(),
  x2: z.string(),
  y1: z.string(),
  y2: z.string(),
  name: z.literal("twopoints"),
});
export const CRNPCObject = z.object({
  name: z.literal("npcstandard"),
});
export const CREstimatedObject = z.object({
  name: z.literal("estimated"),
});

export const userObject = z.object({
  name: z.string(),
  // TODO: gender => pronouns
  gender: z.enum(["male", "female", "neutral", "thing"]).optional(),
  size: z.string().optional(),
  type: z.string().optional(),
  isSwarm: z.boolean().optional(),
  swarmSize: z.string().optional(),
  subtypes: z.array(statObject).optional(),
  armor: z.union([armorObject, choiceRandomObject]).optional(),
  HD: z.number().optional(),
  speeds: speedsObject.optional(),
  abilitiesBase: abilitiesBaseObject.optional(),
  savingThrows: z.array(statObject).optional(),
  skills: z
    .union([z.array(statObject), choiceRandomObject, choiceListObject])
    .optional(),
  resistances: z.array(statObject).optional(),
  immunities: z.array(statObject).optional(),
  vulnerabilities: z.array(statObject).optional(),
  conditionImmunities: z.array(statObject).optional(),
  senses: sensesObject.optional(),
  isBlind: z.boolean().optional(),
  canSpeak: z.boolean().optional(),
  telepathy: z.string().optional(),
  languages: z
    .union([z.array(statObject), choiceRandomObject, choiceListObject])
    .optional(),
  actions: z.array(actionObject).optional(),
  bonuses: bonusesObject.optional(),
  spells: spellsObject.optional(),
  // publication keys
  image: imageObject.optional(),
  searchTags: z.array(z.string()).optional(),
  environments: z.array(z.string()).optional(),
  backgroundImage: z.string().optional(),
  background: z.object({}).passthrough().optional(),
  // roleplaying helpers
  smallbackground: z.string().optional(),
  trait: z.string().optional(),
});
