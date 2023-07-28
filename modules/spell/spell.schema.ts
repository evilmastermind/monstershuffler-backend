import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { spellObject } from '@/schemas/character/spells';

const id = z.number();
const userid = z.number();
const game = z.number();
const name = z.string().min(2);
const level = z.number();
const range = z.string();
const ritual = z.boolean();
const school = z.string().min(2);
const source = z.string();
const className = z.string().min(2);
const duration = z.string().min(2);
const component = z.string().min(2);
const castingTime = z.string().min(2);
const description = z.string().min(2);

const getSpellListSchema = z.object({
  game,
  name: name.optional(),
  level: level.optional(),
  range: range.optional(),
  ritual: ritual.optional(),
  school: school.optional(),
  source: source.optional(),
  className: className.optional(),
  duration: duration.optional(),
  component: component.optional(),
  castingTime: castingTime.optional(),
  description: description.optional(),
});

const getSpellListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      userid,
      name,
    })
  ),
});

const getSpellResponseSchema = z.object({
  id,
  userid,
  object: spellObject,
});

const createSpellSchema = z.object({
  game,
  name,
  object: spellObject,
});

const updateSpellSchema = z.object({
  name,
  object: spellObject,
});

export type getSpellListInput = z.infer<typeof getSpellListSchema>;
export type createSpellInput = z.infer<typeof createSpellSchema>;
export type updateSpellInput = z.infer<typeof updateSpellSchema>;
export type Spell = z.infer<typeof spellObject>;

export const { schemas: spellSchemas, $ref } = buildJsonSchemas({
  getSpellListSchema,
  getSpellListResponseSchema,
  getSpellResponseSchema,
  createSpellSchema,
  updateSpellSchema,
});
