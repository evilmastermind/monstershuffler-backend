import { FastifyInstance } from 'fastify';
import { getRandomQuirkHandler } from './quirk.controller';
import { sGetRandomQuirkResponse } from 'monstershuffler-shared';

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
          200: sGetRandomQuirkResponse,
        },
      },
    },
    getRandomQuirkHandler
  );
}

export default quirkRoutes;
