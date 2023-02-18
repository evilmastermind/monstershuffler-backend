import { z } from 'zod';
import { buildJsonSchemas } from 'fastify-zod';

const id = z.number();
const game = z.number();
const name = z.string().min(2);

const getSkillListResponseSchema = z.object({
  list: z.array(
    z.object({
      id,
      game,
      name,
    })
  ),
});

export type getSkillListResponse = z.infer<typeof getSkillListResponseSchema>;

export const {schemas: skillSchemas, $ref} = buildJsonSchemas({
  getSkillListResponseSchema
}, { $id: 'skillSchemas' });
