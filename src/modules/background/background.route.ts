import { FastifyInstance } from 'fastify';
import { getRandomBackgroundHandler } from './background.controller';
import { $ref } from './background.schema';


async function backgroundRoutes(server: FastifyInstance) {
  server.get(
    '/random',
    {
      schema: {
        summary: 'Returns a random short background.',
        description: 'Returns a random short background , which is a string like \'from an unusual family line\' or \'cursed with bad luck\'.',
        tags: ['background'],
        response: {
          200: $ref('getRandomBackgroundResponseSchema'),
        },
      }
    },
    getRandomBackgroundHandler
  );
}

export default backgroundRoutes;
