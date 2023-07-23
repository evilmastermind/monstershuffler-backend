import { z } from "zod";

export const armorTypes = z.enum(["light", "medium", "heavy"]);

export const armorObject = z.object({
  AC: z.string(),
  name: z.string(),
  cost: z.string().optional(),
  type: armorTypes.optional(),
  maxDex: z.string().optional(),
  minStr: z.string().optional(),
  weight: z.string().optional(),
  stealthDis: z.union([z.literal("0"), z.literal("1")]).optional(),
});
