import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { templateObject } from '@/schemas/character';
import { getTemplateListResponse, getTemplateResponse, postTemplate, putTemplate } from 'monstershuffler-shared';

export type createTemplateInput = z.infer<typeof postTemplate>;
export type updateTemplateInput = z.infer<typeof putTemplate>;
export type Template = z.infer<typeof templateObject>;

export const { schemas: templateSchemas, $ref } = buildJsonSchemas(
  {
    postTemplate,
    putTemplate,
    getTemplateListResponse,
    getTemplateResponse,
  },
  { $id: 'templateSchemas' }
);
