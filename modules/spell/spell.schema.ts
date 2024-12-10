import { z } from 'zod';
import { spellObject } from 'monstershuffler-shared';
import {
  sGetSpellListResponse,
  sGetSpellResponse,
  sGetSpellListBody,
  sPostSpellBody,
  sPutSpellBody,
} from 'monstershuffler-shared';

export type GetSpellListBody = z.infer<typeof sGetSpellListBody>;
export type PostSpellBody = z.infer<typeof sPostSpellBody>;
export type PutSpellBody = z.infer<typeof sPutSpellBody>;
export type Spell = z.infer<typeof spellObject>;
