import { FastifyInstance } from 'fastify';
import {
  getBackgroundHandler,
  getRandomBackgroundHandler,
  getRandomBackgroundForAgeHandler,
  getBackgroundListHandler,
} from './background.controller';
import { jwtHeaderOptional } from '@/schemas';
import { sGetBackgroundListResponse, sGetBackgroundResponse } from 'monstershuffler-shared';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

// TODO: backgrounds have some random choices that choose a weapon based
// on the weapon's name. This might cause issues if there are multiple
// weapons with the same name.

const backgroundRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
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
          200: sGetBackgroundListResponse,
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
          200: sGetBackgroundResponse,
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
          200: sGetBackgroundResponse,
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
          200: sGetBackgroundResponse,
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
  //         201: $ref('sGetBackgroundResponseSchema')
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
};

export default backgroundRoutes;
