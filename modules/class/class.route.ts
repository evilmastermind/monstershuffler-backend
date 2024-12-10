import { FastifyInstance } from 'fastify';
import {
  createClassHandler,
  getClassHandler,
  getRandomClassHandler,
  getClassListHandler,
  getClassWithVariantsListHandler,
  updateClassHandler,
  deleteClassHandler,
} from './class.controller';
import { sGetClassWithVariantsListResponse, sGetClassListResponse, sGetClassResponse } from 'monstershuffler-shared';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/schemas';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const classRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available classes in the db.',
        description:
          'Returns a list of all available classes in the db. If authenticated, also returns the classes created by the user.',
        headers: jwtHeaderOptional,
        tags: ['classes'],
        response: {
          200: sGetClassListResponse,
        },
      },
    },
    getClassListHandler
  );

  server.get(
    '/random',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns the details of a random class in the database.',
        description:
          'Returns the details of a random class from list of classes available to the user in the database.',
        headers: jwtHeaderOptional,
        tags: ['classes'],
        response: {
          200: sGetClassResponse,
        },
      },
    },
    getRandomClassHandler
  );

  server.get(
    '/with-variants',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns a list of all available combinations of classes and variants in the db.',
        description:
          'Returns a list of all available combinations of classes and variants in the db. If authenticated, also returns the classes created by the user.',
        headers: jwtHeaderOptional,
        tags: ['classes'],
        response: {
          200: sGetClassWithVariantsListResponse,
        },
      },
    },
    getClassWithVariantsListHandler
  );

  server.get(
    '/:classId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of the class corresponding to the given id.',
        description:
          'Returns the details of the class corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['classes'],
        // params: $ref('getClassParamsSchema'),
        response: {
          200: sGetClassResponse,
        },
      },
    },
    getClassHandler
  );

  // server.post(
  //   '/',
  //   {
  //     preHandler: [server.authenticate, server.MSOnly],
  //     schema: {
  //       hide: true,
  //       summary: '[MS ONLY] Adds a new class to the db.',
  //       description: '[MS ONLY] Adds a new class to the db.',
  //       body: $ref('sPostClassBody'),
  //       tags: ['classes'],
  //       headers: jwtHeaderRequired,
  //       response: {
  //         201: $ref('sGetClassResponse')
  //       }
  //     },
  //   },
  //   createClassHandler
  // );

  // server.put(
  //   '/:classId',
  //   {
  //     preHandler: [server.authenticate, server.MSOnly],
  //     schema: {
  //       hide: true,
  //       summary: '[MS ONLY] Updates the class corresponding to the given id.',
  //       description: '[MS ONLY] Updates the class corresponding to the given id.',
  //       body: $ref('sPutClassBody'),
  //       tags: ['classes'],
  //       headers: jwtHeaderRequired,
  //       response: {
  //         200: BatchPayload
  //       }
  //     }
  //   },
  //   updateClassHandler
  // );

  // server.delete(
  //   '/:classId',
  //   {
  //     preHandler: [server.authenticate, server.MSOnly],
  //     schema: {
  //       hide: true,
  //       summary: '[MS ONLY] Deletes the class corresponding to the given id.',
  //       description: '[MS ONLY] Deletes the class corresponding to the given id.',
  //       tags: ['classes'],
  //       headers: jwtHeaderRequired,
  //       response: {
  //         200: BatchPayload
  //       },
  //     }
  //   },
  //   deleteClassHandler
  // );
};

export default classRoutes;
