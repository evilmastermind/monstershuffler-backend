import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

import { getCharacterListResponse, getCharacterResponse, postCharacter, putCharacter } from 'monstershuffler-shared';

export type CreateCharacterInput = z.infer<typeof postCharacter>;
export type UpdateCharacterInput = z.infer<typeof putCharacter>;

export const { schemas: characterSchemas, $ref } = buildJsonSchemas(
  {
    postCharacter,
    putCharacter,
    getCharacterListResponse,
    getCharacterResponse,
  },
  { $id: 'characterSchemas' }
);
