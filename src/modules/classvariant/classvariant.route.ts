import { FastifyInstance } from 'fastify';
import { createClassvariantHandler, getClassvariantHandler, getClassvariantListHandler, getClassvariantClassListHandler, updateClassvariantHandler, deleteClassvariantHandler  } from './classvariant.controller';
import { $ref } from './classvariant.schema';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/modules/schemas';

async function classvariantRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available class variants.',
        description: 'Returns a list of all available class variants. The original class must be public or owned by the user (if authenticated).',
        headers: jwtHeaderOptional,
        tags: ['class variants'],
        // params: $ref('getClassvariantParamsSchema'),
        response: {
          200: $ref('getClassvariantListResponseSchema')
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
        summary: 'Returns a list of all available class variants for a specific class.',
        description: 'Returns a list of all available class variants for a specific class. The class must be public or owned by the user (if authenticated).',
        headers: jwtHeaderOptional,
        tags: ['class variants'],
        // params: $ref('getClassvariantParamsSchema'),
        response: {
          200: $ref('getClassvariantClassListResponseSchema')
        },
      }
    },
    getClassvariantClassListHandler
  );

  server.get(
    '/:classvariantId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns the details of the class variant corresponding to the given id.',
        description: 'Returns the details of the class variant corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['class variants'],
        // params: $ref('getClassvariantParamsSchema'),
        response: {
          200: $ref('getClassvariantResponseSchema')
        }
      }
    },
    getClassvariantHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Adds a new class variant to the db.',
        description: '[MS ONLY] Adds a new class variant to the db.',
        body: $ref('createClassvariantSchema'),
        tags: ['class variants'],
        headers: jwtHeaderRequired,
        // params: $ref('getClassvariantParamsSchema'),
        response: {
          201: $ref('getClassvariantResponseSchema')
        }
      },
    },
    createClassvariantHandler
  );

  server.put(
    '/:classvariantId',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Updates the class variant corresponding to the given id.',
        description: '[MS ONLY] Updates the class variant corresponding to the given id.',
        body: $ref('updateClassvariantSchema'),
        tags: ['class variants'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload
        }
      }
    },
    updateClassvariantHandler
  );

  server.delete(
    '/:classvariantId',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Deletes the class variant corresponding to the given id.',
        description: '[MS ONLY] Deletes the class variant corresponding to the given id.',
        tags: ['class variants'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload
        },
      }
    },
    deleteClassvariantHandler
  );
}

export default classvariantRoutes;
