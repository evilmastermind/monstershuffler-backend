import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import {
  postLanguage,
  putLanguage,
  getLanguageResponse,
  getLanguageListResponse,
} from 'monstershuffler-shared';

export type createLanguageInput = z.infer<typeof postLanguage>;
export type getLanguageListResponse = z.infer<
  typeof getLanguageListResponse
>;

export const { schemas: languageSchemas, $ref } = buildJsonSchemas(
  {
    postLanguage,
    putLanguage,
    getLanguageResponse,
    getLanguageListResponse,
  },
  { $id: 'languageSchemas' }
);
