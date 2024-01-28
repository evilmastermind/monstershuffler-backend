import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { getRandomTrait, getRandomTraitResponse, getTraitDescriptionResponse } from 'monstershuffler-shared';

export type getRandomTraitInput = z.infer<typeof getRandomTrait>;
export type getRandomTraitResponse = z.infer<
  typeof getRandomTraitResponse
>;
export type getTraitDescriptionResponse = z.infer<
  typeof getTraitDescriptionResponse
>;

export const { schemas: traitSchemas, $ref } = buildJsonSchemas(
  {
    getRandomTrait,
    getRandomTraitResponse,
    getTraitDescriptionResponse,
  },
  { $id: 'traitSchemas' }
);
