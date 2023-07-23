import { z } from "zod";
import { statObject, choiceRandomObject, choiceListObject } from "@/schemas/character/choices";
import { abilitiesEnum } from "@/schemas/character/abilities";

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
