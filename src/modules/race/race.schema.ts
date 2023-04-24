import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { armorObject } from '@/modules/armor/armor.schema';
import { bonusesObject, choiceRandomObject, statObject, speedsObject, choiceListObject, sensesObject, actionObject, imageObject, spellGroupObject, abilitiesEnum } from '@/modules/schemas';


// TODO: missing race-specific options (in generator, race-specific options)
export const raceObject = z.object({
  name: z.string(),
  // TODO: gender => pronouns
  gender: z.enum(['male','female','neutral','thing']).optional(),
  size: z.string().optional(),
  type: z.string().optional(),
  swarm: z.boolean().optional(),
  swarmSize: z.string().optional(),
  subtypes: z.array(statObject).optional(),
  // TODO: this method of defining the alignment doesn' work:
  // it's not possible to define races whose alignment lean towards neutral
  // also: there were other types of alignment that I didn't handle
  // any Good/Neutral/Evil alignment (See Lich)
  alignment: z.tuple([z.string(), z.string()]).optional(),
  armor: z.array(
    z.union([armorObject, choiceRandomObject])
  ).optional(),
  HD: z.number().optional(),
  abilitiesLimit: z.string().optional(),
  speeds: speedsObject.optional(),
  savingThrows: z.array(statObject).optional(),
  skills: z.union([z.array(statObject), choiceRandomObject, choiceListObject]).optional(),
  resistances: z.array(statObject).optional(),
  immunities: z.array(statObject).optional(),
  vulnerabilities: z.array(statObject).optional(),
  conditionImmunities: z.array(statObject).optional(),
  senses: sensesObject.optional(),
  blind: z.boolean().optional(),
  canspeak: z.boolean().optional(),
  telepathy: z.string().optional(),
  languages: z.union([z.array(statObject), choiceRandomObject, choiceListObject]).optional(),
  actions: z.array(actionObject).optional(),
  bonuses: bonusesObject.optional(),
  spellCasting: abilitiesEnum.optional(),
  spellSlots: z.array(spellGroupObject).optional(),
  // generator keys
  enableGenerator: z.boolean().optional(),
  ageAdult: z.string().optional(),
  ageMax: z.string().optional(),
  heightMin: z.number().optional(),
  heightMax: z.number().optional(),
  nameType: z.array(z.string()).optional(),
  addSurname: z.number().optional(),
  // publication keys
  //published: z.boolean().optional(),
  image: imageObject,
  searchTags: z.array(z.string()).optional(),
  environments: z.array(z.string()).optional(),
  backgroundImage: z.string().optional(),
  background: z.object({}).passthrough(),
}).strict();


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
    }),
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
    }),
  ),
});


const getRaceResponseSchema = z.object({
  object: raceObject,
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

export const { schemas: raceSchemas, $ref } = buildJsonSchemas({
  createRaceSchema,
  updateRaceSchema,
  getRaceWithVariantsListResponseSchema,
  getRaceListResponseSchema,
  getRaceResponseSchema,
}, { $id: 'raceSchemas' });
