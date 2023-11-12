import { FastifyInstance } from 'fastify';
import {
  getActionListHandler,
  getActionHandler,
  createActionHandler,
  updateActionHandler,
  deleteActionHandler,
} from './action.controller';
import { $ref } from './action.schema';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/schemas';

async function actionRoutes(server: FastifyInstance) {
  server.post(
    '/filter',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns a list of actions from the db, filtered by the values specified in the body.',
        description:
          'Returns a list of actions from the db, filtered by the values specified in the body. If authenticated, also returns the actions created by the user.',
        body: $ref('getActionList'),
        headers: jwtHeaderOptional,
        tags: ['actions'],
        response: {
          200: $ref('getActionListResponse'),
        },
      },
    },
    getActionListHandler
  );

  server.get(
    '/:actionId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of the action corresponding to the given id.',
        description:
          'Returns the details of the action corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['actions'],
        // params: $ref('getActionParamsSchema'),
        response: {
          200: $ref('getActionResponse'),
        },
      },
    },
    getActionHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Adds a new action to the db.',
        description: '[MS ONLY] Adds a new action to the db.',
        body: $ref('postAction'),
        tags: ['actions'],
        headers: jwtHeaderRequired,
        response: {
          201: $ref('getActionResponse'),
        },
      },
    },
    createActionHandler
  );

  server.put(
    '/:actionId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Updates the action corresponding to the given id.',
        description:
          '[MS ONLY] Updates the action corresponding to the given id.',
        body: $ref('putAction'),
        tags: ['actions'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    updateActionHandler
  );

  server.delete(
    '/:actionId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Deletes the action corresponding to the given id.',
        description:
          '[MS ONLY] Deletes the action corresponding to the given id.',
        tags: ['actions'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteActionHandler
  );
}

export default actionRoutes;
