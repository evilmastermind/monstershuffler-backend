import { FastifyInstance } from 'fastify';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/modules/schemas';


async function actionRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available actions in the db.',
        description: 'Returns a list of all available actions in the db. If authenticated, also returns the list of actions created by the user.',
        headers: jwtHeaderOptional,
        tags: ['action'],
        response: {
          200: $ref('getActionListResponseSchema')
        },
      }
    },
    getActionListHandler
  );

  server.get(
    '/:actionId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns the details of the action corresponding to the given id.',
        description: 'Returns the details of the action corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['action'],
        // params: $ref('getActionParamsSchema'),
        response: {
          200: $ref('getActionResponseSchema')
        }
      }
    },
    getActionHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Adds a new type of action to the db.',
        description: '[MS ONLY] Adds a new type of action to the db.',
        body: $ref('createActionSchema'),
        tags: ['action'],
        headers: jwtHeaderRequired,
        response: {
          201: $ref('getActionResponseSchema')
        }
      },
    },
    createActionHandler
  );

  server.put(
    '/:actionId',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Updates the action corresponding to the given id.',
        description: '[MS ONLY] Updates the action corresponding to the given id.',
        body: $ref('updateActionSchema'),
        tags: ['action'],
        headers: jwtHeaderRequired,
        response: