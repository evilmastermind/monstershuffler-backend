import { FastifyInstance } from 'fastify';
import {
  createBackgroundHandler,
  getBackgroundHandler,
  getRandomBackgroundHandler,
  getRandomBackgroundForAgeHandler,
  getBackgroundListHandler,
  updateBackgroundHandler,
  deleteBackgroundHandler,
} from './background.controller';
import { $ref } from './background.schema';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/schemas';

// TODO: backgrounds have some random choices that choose a weapon based
// on the weapon's name. This might cause issues if there are multiple
// weapons with the same name.

async function backgroundRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available backgrounds in the db.',
        description:
          'Returns a list of all available backgrounds in the db. If authenticated, also returns the list of backgrounds created by the user.',
        headers: jwtHeaderOptional,
        tags: ['backgrounds'],
        response: {
          200: $ref('getBackgroundListResponseSchema'),
        },
      },
    },
    getBackgroundListHandler
  );

  server.get(
    '/:backgroundId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of the background corresponding to the given id.',
        description:
          'Returns the details of the background corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['backgrounds'],
        // params: $ref('getBackgroundParamsSchema'),
        response: {
          200: $ref('getBackgroundResponseSchema'),
        },
      },
    },
    getBackgroundHandler
  );

  server.get(
    '/random',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of a random background from the database.',
        description:
          'Returns the details of a random background from list of backgrounds available to the user in the database.',
        headers: jwtHeaderOptional,
        tags: ['backgrounds'],
        // params: $ref('getBackgroundParamsSchema'),
        response: {
          200: $ref('getBackgroundResponseSchema'),
        },
      },
    },
    getRandomBackgroundHandler
  );

  server.get(
    '/random/:age',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of a random background for a specific age.',
        description:
          'Returns the details of a random background, for a specific age, from list of backgrounds available to the user in the database. The age must be one of the following: "child", "adolescent", "young adult", "adult", "middle-aged", "elderly", "venerable".',
        headers: jwtHeaderOptional,
        tags: ['backgrounds'],
        // params: $ref('getBackgroundParamsSchema'),
        response: {
          200: $ref('getBackgroundResponseSchema'),
        },
      },
    },
    getRandomBackgroundForAgeHandler
  );

  // server.post(
  //   '/',
  //   {
  //     preHandler: [server.authenticate, server.MSOnly],
  //     schema: {
  //       hide: true,
  //       summary: '[MS ONLY] Adds a new background to the db.',
  //       description: '[MS ONLY] Adds a new background to the db.',
  //       body: $ref('createBackgroundSchema'),
  //       tags: ['backgrounds'],
  //       headers: jwtHeaderRequired,
  //       response: {
  //         201: $ref('getBackgroundResponseSchema')
  //       }
  //     },
  //   },
  //   createBackgroundHandler
  // );

  // server.put(
  //   '/:backgroundId',
  //   {
  //     preHandler: [server.authenticate, server.MSOnly],
  //     schema: {
  //       hide: true,
  //       summary: '[MS ONLY] Updates the background corresponding to the given id.',
  //       description: '[MS ONLY] Updates the background corresponding to the given id.',
  //       body: $ref('createBackgroundSchema'),
  //       tags: ['backgrounds'],
  //       headers: jwtHeaderRequired,
  //       response: {
  //         200: BatchPayload
  //       }
  //     },
  //   },
  //   updateBackgroundHandler
  // );

  // server.delete(
  //   '/:backgroundId',
  //   {
  //     preHandler: [server.authenticate, server.MSOnly],
  //     schema: {
  //       hide: true,
  //       summary: '[MS ONLY] Deletes the background corresponding to the given id.',
  //       description: '[MS ONLY] Deletes the background corresponding to the given id.',
  //       tags: ['backgrounds'],
  //       headers: jwtHeaderRequired,
  //       response: {
  //         200: BatchPayload
  //       }
  //     },
  //   },
  //   deleteBackgroundHandler
  // );
}

export default backgroundRoutes;
