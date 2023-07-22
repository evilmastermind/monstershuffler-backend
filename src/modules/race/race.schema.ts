import { z } from "zod";
import { buildJsonSchemas } from "fastify-zod";
import { armorObject } from "@/modules/armor/armor.schema";
import {
  bonusesObject,
  choiceRandomObject,
  statObject,
  speedsObject,
  choiceListObject,
  sensesObject,
  actionObject,
  imageObject,
  spellGroupObject,
  abilitiesEnum,
  spellsObject,
  alignmentModifiers,
} from "@/modules/schemas";

// TODO: missing race-specific options (in generator, race-specific options)
export const raceObject = z
  .object({
    name: z.string(),
    // TODO: gender => pronouns
    pronouns: z.enum(["male", "female", "neutral", "thing"]).optional(),
    size: z.string().optional(),
    type: z.string().optional(),
    isSwarm: z.boolean().optional(),
    swarmSize: z.string().optional(),
    subtypes: z.array(statObject).optional(),
    alignmentModifiers: alignmentModifiers.optional(),
    armor: z.union([armorObject, choiceRandomObject]).optional(),
    HD: z.number().optional(),
    abilitiesLimit: z.string().optional(),
    speeds: speedsObject.optional(),
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
    // generator keys
    enableGenerator: z.boolean().optional(),
    ageAdult: z.string().optional(),
    ageMax: z.string().optional(),
    heightMin: z.number().optional(),
    heightMax: z.number().optional(),
    nameType: z.array(z.string()).optional(),
    addSurname: z.number().optional(),
    // publication keys
    image: imageObject.optional(),
    searchTags: z.array(z.string()).optional(),
    environments: z.array(z.string()).optional(),
    backgroundImage: z.string().optional(),
    background: z.object({}).passthrough().optional(),
  })
  .strict();

const id = z.number();
const userid = z.number();
const game = z.number();
const name = z.string().min(2);

//TODO: add game type to every get*ListSchema
const getRaceListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

const getRaceWithVariantsListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
      other_objects: z.array(
        z.object({
          id,
          name,
          userid,
        })
      ),
    })
  ),
});

const getRaceResponseSchema = z.object({
  object: raceObject,
  id,
});

const createRaceSchema = z.object({
  game,
  object: raceObject,
});

const updateRaceSchema = z.object({
  object: raceObject,
  game,
});

export type createRaceInput = z.infer<typeof createRaceSchema>;
export type updateRaceInput = z.infer<typeof updateRaceSchema>;
export type Race = z.infer<typeof raceObject>;

export const { schemas: raceSchemas, $ref } = buildJsonSchemas(
  {
    createRaceSchema,
    updateRaceSchema,
    getRaceWithVariantsListResponseSchema,
    getRaceListResponseSchema,
    getRaceResponseSchema,
  },
  { $id: "raceSchemas" }
);
