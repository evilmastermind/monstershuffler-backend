import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { classObject, postClass, putClass, getClassWithVariantsListResponse, getClassListResponse, getClassResponse } from 'monstershuffler-shared';

export type createClassInput = z.infer<typeof postClass>;
export type updateClassInput = z.infer<typeof putClass>;
export type Class = z.infer<typeof classObject>;

export const { schemas: classSchemas, $ref } = buildJsonSchemas(
  {
    putClass,
    postClass,
    getClassWithVariantsListResponse,
    getClassListResponse,
    getClassResponse,
  },
  { $id: 'classSchemas' }
);
