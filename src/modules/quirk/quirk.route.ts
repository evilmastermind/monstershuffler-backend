import { FastifyInstance } from 'fastify';
import { getRandomQuirkHandler } from './quirk.controller';
import { $ref } from './quirk.schema';

async function quirkRoutes(server: FastifyInstance) {
  server.get(
    '/random',
    {
      schema: {
        summary: 'Returns a random quirk.',
        description:
          'Returns a random quirk, which is a string like \'Cracks knuckles.\' or \'Missing teeth.\'.',
        tags: ['quirks'],
        response: {
          200: $ref('getRandomQuirkResponseSchema'),
        },
      },
    },
    getRandomQuirkHandler
  );
}
