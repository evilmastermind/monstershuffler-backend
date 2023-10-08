import { FastifyInstance } from 'fastify';
import { $ref } from './pagesetting.schema';
import {
  getPagesettingHandler,
  setPagesettingHandler,
} from './pagesetting.controller';

async function pagesettingRoutes(server: FastifyInstance) {
  server.get(
    '/:page',
    {
      preHandler: [server.MSOnly],
      schema: {
        summary: 'Returns the user\'s settings for a specific page.',
        description:
          'Returns the user\'s settings for a specific page.',
        tags: ['pagesettings'],
        response: {
          200: $ref('getPagesettingResponseSchema'),
          404: { type: 'string' },
        },
      },
    },
    getPagesettingHandler
  );

  server.post(
    '/:page',
    {
      preHandler: [server.MSOnly],
      schema: {
        summary: 'Saves the user\'s settings for a specific page.',
        description:
          'Saves the user\'s settings for a specific page.',
        tags: ['pagesettings'],
        body: $ref('setPagesettingResponseSchema'),
        response: {
          200: { type: 'string' },
        },
      },
    },
    setPagesettingHandler
  );
}

export default pagesettingRoutes;
