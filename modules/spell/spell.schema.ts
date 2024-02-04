import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { spellObject } from 'monstershuffler-shared';
import {
  getSpellListResponse,
  getSpellResponse,
  getSpellList,
  postSpell,
  putSpell,
} from 'monstershuffler-shared';

export type getSpellListInput = z.infer<typeof getSpellList>;
export type createSpellInput = z.infer<typeof postSpell>;
export type updateSpellInput = z.infer<typeof putSpell>;
export type Spell = z.infer<typeof spellObject>;

export const { schemas: spellSchemas, $ref } = buildJsonSchemas({
  getSpellList,
  getSpellListResponse,
  getSpellResponse,
  postSpell,
  putSpell,
},{ $id: 'spellSchemas' });
