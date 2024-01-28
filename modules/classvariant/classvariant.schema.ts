import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { classvariantObject, postClassvariant, putClassvariant, getClassvariantClassListResponse, getClassvariantListResponse, getClassvariantResponse } from 'monstershuffler-shared';

export type createClassvariantInput = z.infer<typeof postClassvariant>;
export type updateClassvariantInput = z.infer<typeof putClassvariant>;
export type Classvariant = z.infer<typeof classvariantObject>;

export const { schemas: classvariantSchemas, $ref } = buildJsonSchemas(
  {
    postClassvariant,
    putClassvariant,
    getClassvariantListResponse,
    getClassvariantClassListResponse,
    getClassvariantResponse,
  },
  { $id: 'classvariantSchemas' }
);
