import { FastifyInstance } from 'fastify';
import { createLanguageHandler, getLanguageListHandler, updateLanguageHandler, deleteLanguageHandler  } from './language.controller';
import { $ref } from './language.schema';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/modules/schemas';

async function languageRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available damage types in the db.',
        description: 'Returns a list of all available damage types in the db. If authenticated, also returns the list of damage types created by the user.',
        headers: jwtHeaderOptional,
        tags: ['damage types'],
        response: {
          200: $ref('getLanguageListResponseSchema')
        },
      }
    },
    getLanguageListHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Adds a new type of damage to the db.',
        description: '[MS ONLY] Adds a new type of damage to the db.',
        body: $ref('createLanguageSchema'),
        tags: ['damage types'],
        headers: jwtHeaderRequired,
        response: {
          201: $ref('getLanguageResponseSchema')
        }
      },
    },
    createLanguageHandler
  );

  server.put(
    '/:languageId',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Updates the details of the damage type corresponding to the given id.',
        description: '[MS ONLY] Updates the details of the damage type corresponding to the given id.',
        body: $ref('updateLanguageSchema'),
        tags: ['damage types'],
        headers: jwtHeaderRequired,
        response: {
          200: $ref('getLanguageResponseSchema')
        }
      }
    },
    updateLanguageHandler
  );

  server.delete(
    '/:languageId',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: '[MS ONLY] Deletes the damage type corresponding to the given id.',
        description: '[MS ONLY] Deletes the damage type corresponding to the given id.',
        tags: ['damage types'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload
        }
      }
    },
    deleteLanguageHandler
  );
}

export default languageRoutes;
