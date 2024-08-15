import { FastifyInstance } from 'fastify';
import {
  createRacevariantHandler,
  getRacevariantHandler,
  getRandomRacevariantHandler,
  getRacevariantListHandler,
  updateRacevariantHandler,
  deleteRacevariantHandler,
} from './racevariant.controller';
import {
  sGetRacevariantListResponse,
  sGetRacevariantResponse,
  sPostRacevariantBody,
  sPutRacevariantBody,
} from 'monstershuffler-shared';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/schemas';

async function racevariantRoutes(server: FastifyInstance) {
  server.get(
    '/race/:raceId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns a list of all available race variants for a specific race.',
        description:
          'Returns a list of all available race variants for a specific race. The race must be public or owned by the user (if authenticated).',
        headers: jwtHeaderOptional,
        tags: ['race variants'],
        // params: $ref('getRacevariantParamsSchema'),
        response: {
          200: sGetRacevariantListResponse,
        },
      },
    },
    getRacevariantListHandler
  );

  server.get(
    '/race/:raceId/random',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of a random variant of the race corresponding to the given id.',
        description:
          'Returns the details of a random variant of the race corresponding to the given id',
        headers: jwtHeaderOptional,
        tags: ['race variants'],
        // params: $ref('getRacevariantParamsSchema'),
        response: {
          200: sGetRacevariantResponse,
        },
      },
    },
    getRandomRacevariantHandler
  );

  server.get(
    '/:racevariantId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of the race variant corresponding to the given id.',
        description:
          'Returns the details of the race variant corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['race variants'],
        // params: $ref('getRacevariantParamsSchema'),
        response: {
          200: sGetRacevariantResponse,
        },
      },
    },
    getRacevariantHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Adds a new race variant to the db.',
        description: '[MS ONLY] Adds a new race variant to the db.',
        body: sPostRacevariantBody,
        tags: ['race variants'],
        headers: jwtHeaderRequired,
        // params: $ref('getRacevariantParamsSchema'),
        response: {
          201: sGetRacevariantResponse,
        },
      },
    },
    createRacevariantHandler
  );

  server.put(
    '/:racevariantId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Updates the race variant corresponding to the given id.',
        description:
          '[MS ONLY] Updates the race variant corresponding to the given id.',
        body: sPutRacevariantBody,
        tags: ['race variants'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    updateRacevariantHandler
  );

  server.delete(
    '/:racevariantId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Deletes the race variant corresponding to the given id.',
        description:
          '[MS ONLY] Deletes the race variant corresponding to the given id.',
        tags: ['race variants'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteRacevariantHandler
  );
}

export default racevariantRoutes;
