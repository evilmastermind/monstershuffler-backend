import { FastifyInstance } from 'fastify';
import { getSkillListHandler} from './skill.controller';
import { $ref } from './skill.schema';
import { jwtHeaderOptional } from '@/modules/schemas';

async function skillRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Get a list of all skills in the game.',
        description: 'Get a list of all skills in the game.',
        headers: jwtHeaderOptional,
        tags: ['skills'],
        response: {
          200: $ref('getSkillListResponseSchema'),
        },
      },
    },
    getSkillListHandler
  );
}

export default skillRoutes;
