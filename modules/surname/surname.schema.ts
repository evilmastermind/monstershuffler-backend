import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { getRandomSurname, getRandomSurnameResponse } from 'monstershuffler-shared';

export type getRandomSurnameInput = z.infer<typeof getRandomSurname>;

export const { schemas: surnameSchemas, $ref } = buildJsonSchemas(
  {
    getRandomSurname,
    getRandomSurnameResponse,
  },
  { $id: 'surnameSchemas' }
);
