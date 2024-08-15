import { FastifyInstance } from 'fastify';
import {
  createRaceHandler,
  getRaceHandler,
  getRandomRaceHandler,
  getRaceListHandler,
  getRaceWithVariantsListHandler,
  updateRaceHandler,
  deleteRaceHandler,
} from './race.controller';
import {
  sGetRaceListResponse,
  sGetRaceResponse,
  sGetRaceWithVariantsListResponse,
  sPostRaceBody,
  sPutRaceBody,
} from 'monstershuffler-shared';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/schemas';

async function raceRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available races in the db.',
        description:
          'Returns a list of all available races in the db. If authenticated, also returns the races created by the user.',
        headers: jwtHeaderOptional,
        tags: ['races'],
        response: {
          200: sGetRaceListResponse,
        },
      },
    },
    getRaceListHandler
  );

  server.get(
    '/with-variants',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns a list of all available combinations of races and variants in the db.',
        description:
          'Returns a list of all available combinations of races and variants in the db. If authenticated, also returns the races created by the user.',
        headers: jwtHeaderOptional,
        tags: ['races'],
        response: {
          200: sGetRaceWithVariantsListResponse,
        },
      },
    },
    getRaceWithVariantsListHandler
  );

  server.get(
    '/:raceId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of the race corresponding to the given id.',
        description:
          'Returns the details of the race corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['races'],
        // params: $ref('getRaceParamsSchema'),
        response: {
          200: sGetRaceResponse,
        },
      },
    },
    getRaceHandler
  );

  server.get(
    '/random',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns the details of a random race from the database.',
        description:
          'Returns the details of a random race from list of races available to the user in the database.',
        headers: jwtHeaderOptional,
        tags: ['races'],
        // params: $ref('getRaceParamsSchema'),
        response: {
          200: sGetRaceResponse,
        },
      },
    },
    getRandomRaceHandler
  );

  //   server.post(
  //     '/',
  //     {
  //       preHandler: [server.authenticate, server.MSOnly],
  //       schema: {
  //         hide: true,
  //         summary: '[MS ONLY] Adds a new race to the db.',
  //         description: '[MS ONLY] Adds a new race to the db.',
  //         body: $ref('sPostRaceBody'),
  //         tags: ['races'],
  //         headers: jwtHeaderRequired,
  //         response: {
  //           201: $ref('sGetRaceResponse')
  //         }
  //       },
  //     },
  //     createRaceHandler
  //   );

  //   server.put(
  //     '/:raceId',
  //     {
  //       preHandler: [server.authenticate,  server.MSOnly],
  //       schema: {
  //         hide: true,
  //         summary: '[MS ONLY] Updates the race corresponding to the given id.',
  //         description: '[MS ONLY] Updates the race corresponding to the given id.',
  //         body: $ref('sPutRaceBody'),
  //         tags: ['races'],
  //         headers: jwtHeaderRequired,
  //         response: {
  //           200: BatchPayload
  //         }
  //       }
  //     },
  //     updateRaceHandler
  //   );

  //   server.delete(
  //     '/:raceId',
  //     {
  //       preHandler: [server.authenticate, server.MSOnly],
  //       schema: {
  //         hide: true,
  //         summary: '[MS ONLY] Deletes the race corresponding to the given id.',
  //         description: '[MS ONLY] Deletes the race corresponding to the given id.',
  //         tags: ['races'],
  //         headers: jwtHeaderRequired,
  //         response: {
  //           200: BatchPayload
  //         },
  //       }
  //     },
  //     deleteRaceHandler
  //   );
}

export default raceRoutes;
