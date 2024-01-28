import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';
import { getSkillListResponse, getSkillResponse } from 'monstershuffler-shared';

export type getSkillListResponse = z.infer<typeof getSkillListResponse>;

export const { schemas: skillSchemas, $ref } = buildJsonSchemas(
  {
    getSkillListResponse,
    getSkillResponse,
  },
  { $id: 'skillSchemas' }
);
