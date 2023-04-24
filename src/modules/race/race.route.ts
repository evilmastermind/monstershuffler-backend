import { FastifyInstance } from 'fastify';
import { createRaceHandler, getRaceHandler, getRandomRaceHandler, getRaceListHandler, getRaceWithVariantsListHandler, updateRaceHandler, deleteRaceHandler  } from './race.controller';
import { $ref } from './race.schema';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/modules/schemas';

async function raceRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available races in the db.',
        description: 'Returns a list of all available races in the db. If authenticated, also returns the races created by the user.',
        headers: jwtHeaderOptional,
        tags: ['races'],
        response: {
          200: $ref('getRaceListResponseSchema')
        },
      }
    },
    getRaceListHandler
  );

  server.get(
    '/withvariants',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available combinations of races and variants in the db.',
        description: 'Returns a list of all available combinations of races and variants in the db. If authenticated, also returns the races created by the user.',
        headers: jwtHeaderOptional,
        tags: ['races'],
        response: {
          200: $ref('getRaceWithVariantsListResponseSchema')
        },
      }
    },
    getRaceWithVariantsListHandler
  );

  server.get(
    '/:raceId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns the details of the race corresponding to the given id.',
        description: 'Returns the details of the race corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['races'],
        // params: $ref('getRaceParamsSchema'),
        response: {
          200: $ref('getRaceResponseSchema')
        }
      }
    },
    getRaceHandler
  );

  server.get(
    '/random',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns the details of a random race from the database.',
        description: 'Returns the details of a random race from list of races available to the user in the database.',
        headers: jwtHeaderOptional,
        tags: ['races'],
        // params: $ref('getRaceParamsSchema'),
        response: {
          200: $ref('getRaceResponseSchema')
        }
      }
    },
    getRandomRaceHandler
  );

  //   server.post(
  //     '/',
  //     {
  //       preHandler: [server.authenticate],
  //       schema: {
  //         summary: '[MS ONLY] Adds a new race to the db.',
  //         description: '[MS ONLY] Adds a new race to the db.',
  //         body: $ref('createRaceSchema'),
  //         tags: ['races'],
  //         headers: jwtHeaderRequired,
  //         response: {
  //           201: $ref('getRaceResponseSchema')
  //         }
  //       },
  //     },
  //     createRaceHandler
  //   );

  //   server.put(
  //     '/:raceId',
  //     {
  //       preHandler: [server.authenticate],
  //       schema: {
  //         summary: '[MS ONLY] Updates the race corresponding to the given id.',
  //         description: '[MS ONLY] Updates the race corresponding to the given id.',
  //         body: $ref('updateRaceSchema'),
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
  //       preHandler: [server.authenticate],
  //       schema: {
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
