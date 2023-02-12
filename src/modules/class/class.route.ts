import { FastifyInstance } from 'fastify';
import { createClassHandler, getClassHandler, getClassListHandler, updateClassHandler, deleteClassHandler  } from './class.controller';
import { $ref } from './class.schema';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/modules/schemas';

async function classRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available classes in the db.',
        description: 'Returns a list of all available classes in the db. If authenticated, also returns the list of classes created by the user.',
        headers: jwtHeaderOptional,
        tags: ['classes'],
        response: {
          200: $ref('getClassListResponseSchema')
        },
      }
    },
    getClassListHandler
  );

  server.get(
    '/:classId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns the details of the class corresponding to the given id.',
        description: 'Returns the details of the class corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['classes'],
        // params: $ref('getClassParamsSchema'),
        response: {
          200: $ref('getClassResponseSchema')
        }
      }
    },
    getClassHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Adds a new class to the db.',
        description: '[MS ONLY] Adds a new class to the db.',
        body: $ref('createClassSchema'),
        tags: ['classes'],
        headers: jwtHeaderRequired,
        response: {
          201: $ref('getClassResponseSchema')
        }
      },
    },
    createClassHandler
  );

  server.put(
    '/:classId',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Updates the class corresponding to the given id.',
        description: '[MS ONLY] Updates the class corresponding to the given id.',
        body: $ref('updateClassSchema'),
        tags: ['classes'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload
        }
      }
    },
    updateClassHandler
  );

  server.delete(
    '/:classId',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Deletes the class corresponding to the given id.',
        description: '[MS ONLY] Deletes the class corresponding to the given id.',
        tags: ['classes'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload
        },
      }
    },
    deleteClassHandler
  );
}

export default classRoutes;
