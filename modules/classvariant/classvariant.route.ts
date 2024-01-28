import { FastifyInstance } from 'fastify';
import {
  createClassvariantHandler,
  getClassvariantHandler,
  getRandomClassvariantHandler,
  getClassvariantListHandler,
  getClassvariantClassListHandler,
  updateClassvariantHandler,
  deleteClassvariantHandler,
} from './classvariant.controller';
import { $ref } from './classvariant.schema';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/schemas';

async function classvariantRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available class variants.',
        description:
          'Returns a list of all available class variants. The original class must be public or owned by the user (if authenticated).',
        headers: jwtHeaderOptional,
        tags: ['class variants'],
        // params: $ref('getClassvariantParamsSchema'),
        response: {
          200: $ref('getClassvariantListResponse'),
        },
      },
    },
    getClassvariantListHandler
  );
  server.get(
    '/class/:classId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns a list of all available class variants for a specific class.',
        description:
          'Returns a list of all available class variants for a specific class. The class must be public or owned by the user (if authenticated).',
        headers: jwtHeaderOptional,
        tags: ['class variants'],
        // params: $ref('getClassvariantParamsSchema'),
        response: {
          200: $ref('getClassvariantClassListResponse'),
        },
      },
    },
    getClassvariantClassListHandler
  );

  server.get(
    '/class:classId/random',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of a random variant of the class corresponding to the given id.',
        description:
          'Returns the details of a random variant of the class corresponding to the given id',
        headers: jwtHeaderOptional,
        tags: ['class variants'],
        // params: $ref('getClassvariantParamsSchema'),
        response: {
          200: $ref('getClassvariantResponse'),
        },
      },
    },
    getRandomClassvariantHandler
  );

  server.get(
    '/:classvariantId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of the class variant corresponding to the given id.',
        description:
          'Returns the details of the class variant corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['class variants'],
        // params: $ref('getClassvariantParamsSchema'),
        response: {
          200: $ref('getClassvariantResponse'),
        },
      },
    },
    getClassvariantHandler
  );

  //   server.post(
  //     '/',
  //     {
  //       preHandler: [server.authenticate, server.MSOnly],
  //       schema: {
  //         hide: true,
  //         summary: '[MS ONLY] Adds a new class variant to the db.',
  //         description: '[MS ONLY] Adds a new class variant to the db.',
  //         body: $ref('postClassvariant'),
  //         tags: ['class variants'],
  //         headers: jwtHeaderRequired,
  //         // params: $ref('getClassvariantParamsSchema'),
  //         response: {
  //           201: $ref('getClassvariantResponse')
  //         }
  //       },
  //     },
  //     createClassvariantHandler
  //   );

  //   server.put(
  //     '/:classvariantId',
  //     {
  //       preHandler: [server.authenticate, server.MSOnly],
  //       schema: {
  //         hide: true,
  //         summary: '[MS ONLY] Updates the class variant corresponding to the given id.',
  //         description: '[MS ONLY] Updates the class variant corresponding to the given id.',
  //         body: $ref('putClassvariant'),
  //         tags: ['class variants'],
  //         headers: jwtHeaderRequired,
  //         response: {
  //           200: BatchPayload
  //         }
  //       }
  //     },
  //     updateClassvariantHandler
  //   );

  //   server.delete(
  //     '/:classvariantId',
  //     {
  //       preHandler: [server.authenticate, server.MSOnly],
  //       schema: {
  //         hide: true,
  //         summary: '[MS ONLY] Deletes the class variant corresponding to the given id.',
  //         description: '[MS ONLY] Deletes the class variant corresponding to the given id.',
  //         tags: ['class variants'],
  //         headers: jwtHeaderRequired,
  //         response: {
  //           200: BatchPayload
  //         },
  //       }
  //     },
  //     deleteClassvariantHandler
  //   );
}

export default classvariantRoutes;
