import { FastifyInstance } from 'fastify';
import {
  createTemplateHandler,
  getTemplateHandler,
  getTemplateListHandler,
  updateTemplateHandler,
  deleteTemplateHandler,
} from './template.controller';
import { $ref } from './template.schema';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/schemas';

async function templateRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available templates in the db.',
        description:
          'Returns a list of all available templates in the db. If authenticated, also returns the list of templates created by the user.',
        headers: jwtHeaderOptional,
        tags: ['templates'],
        response: {
          200: $ref('getTemplateListResponse'),
        },
      },
    },
    getTemplateListHandler
  );

  server.get(
    '/:templateId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of the template corresponding to the given id.',
        description:
          'Returns the details of the template corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['templates'],
        // params: $ref('getTemplateParamsSchema'),
        response: {
          200: $ref('getTemplateResponse'),
        },
      },
    },
    getTemplateHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Adds a new template to the db.',
        description: '[MS ONLY] Adds a new template to the db.',
        body: $ref('postTemplate'),
        tags: ['templates'],
        headers: jwtHeaderRequired,
        response: {
          201: $ref('getTemplateResponse'),
        },
      },
    },
    createTemplateHandler
  );

  server.put(
    '/:templateId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Updates the template corresponding to the given id.',
        description:
          '[MS ONLY] Updates the template corresponding to the given id.',
        body: $ref('putTemplate'),
        tags: ['templates'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    updateTemplateHandler
  );

  server.delete(
    '/:templateId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Deletes the template corresponding to the given id.',
        description:
          '[MS ONLY] Deletes the template corresponding to the given id.',
        tags: ['templates'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteTemplateHandler
  );
}

export default templateRoutes;
