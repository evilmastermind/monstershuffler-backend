import { z } from "zod";
import { armorObject } from "@/modules/armor/armor.schema";
import { weaponObject } from "@/modules/weapon/weapon.schema";




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
