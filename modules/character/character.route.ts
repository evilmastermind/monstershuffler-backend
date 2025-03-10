import { FastifyInstance } from 'fastify';
import {
  createCharacterHandler,
  getCharacterHandler,
  getCharacterListHandler,
  updateCharacterHandler,
  deleteCharacterHandler,
} from './character.controller';
import { sGetCharacterListResponse, sGetCharacterResponse, sPostCharacterBody, sPutCharacterBody  } from 'monstershuffler-shared';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/schemas';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const characterRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available characters in the db.',
        description:
          'Returns a list of all available characters in the db. If authenticated, also returns the list of characters created by the user.',
        headers: jwtHeaderOptional,
        tags: ['characters'],
        response: {
          200: sGetCharacterListResponse,
        },
      },
    },
    getCharacterListHandler
  );

  server.get(
    '/:characterId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of the character corresponding to the given id.',
        description:
          'Returns the details of the character corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['characters'],
        // params: $ref('getCharacterParamsSchema'),
        response: {
          200: sGetCharacterResponse,
        },
      },
    },
    getCharacterHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Adds a new character to the db.',
        description: '[MS ONLY] Adds a new character to the db.',
        body: sPostCharacterBody,
        tags: ['characters'],
        headers: jwtHeaderRequired,
        response: {
          201: sGetCharacterResponse,
        },
      },
    },
    createCharacterHandler
  );

  server.put(
    '/:characterId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Updates the character corresponding to the given id.',
        description:
          '[MS ONLY] Updates the character corresponding to the given id.',
        body: sPutCharacterBody,
        tags: ['characters'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    updateCharacterHandler
  );

  server.delete(
    '/:characterId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Deletes the character corresponding to the given id.',
        description:
          '[MS ONLY] Deletes the character corresponding to the given id.',
        tags: ['characters'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteCharacterHandler
  );
};

export default characterRoutes;
