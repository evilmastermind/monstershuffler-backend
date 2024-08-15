import { FastifyInstance } from 'fastify';
import { pageSettings, settings } from 'monstershuffler-shared';
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
          200: pageSettings,
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
        body: settings,
        response: {
          200: { type: 'string' },
        },
      },
    },
    setPagesettingHandler
  );
}

export default pagesettingRoutes;
