import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { userObject, CREstimatedObject, CRTwoPointsObject, CRNPCObject, abilitiesBaseObject, } from '@/modules/schemas';
import { raceObject } from '../race/race.schema';
import { classObject } from '../class/class.schema';
import { templateObject } from '../template/template.schema';


// TODO: add racevariant, classvariant, and profession to objects
const characterObject = z.object({
  character: z.object({
    // naming
    name: z.string(),
    prename: z.string().optional(),
    surname: z.string().optional(),
    generic: z.enum(['1','0']).optional(),
    // objects
    race: raceObject.optional(),
    class: classObject.optional(),
    template: templateObject.optional(),
    user: userObject.optional(),
    // other stats
    abilitiesBase: abilitiesBaseObject.optional(),
    alignmentMoral: z.enum(['Good','Neutral','Evil','Any','Unaligned']).optional(),
    alignmentEthical: z.enum(['Lawful','Neutral','Chaotic','Any']).optional(),
    // roleplaying helpers
    smallbackground: z.string().optional(),
    trait: z.string().optional(),
    // CR
    CRCalculation: z.union([CRTwoPointsObject, CRNPCObject, CREstimatedObject]).optional(),
  }).strict(),
  // TODO: define the 'statistics' object (processed statistics from all other objects combined)
  statistics: z.object({}).passthrough(),
}).strict();


const id = z.number();
const userid = z.number();
const name = z.string().min(2);

const getCharacterListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    }),
  ),
});

const getCharacterResponseSchema = z.object({
  object: characterObject,
});

const createCharacterSchema = z.object({
  object: characterObject,
});

export type createCharacterInput = z.infer<typeof createCharacterSchema>;
export type Character = z.infer<typeof characterObject>;

export const { schemas: characterSchemas, $ref } = buildJsonSchemas({
  createCharacterSchema,
  getCharacterListResponseSchema,
  getCharacterResponseSchema,
}, { $id: 'characterSchemas' });