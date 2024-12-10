import { FastifyInstance } from 'fastify';
import {
  createLanguageHandler,
  getLanguageListHandler,
  updateLanguageHandler,
  deleteLanguageHandler,
} from './language.controller';
import {
  sPostLanguageBody,
  sPutLanguageBody,
  sGetLanguageResponse,
  sGetLanguageListResponse,
} from 'monstershuffler-shared';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/schemas';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const languageRoutes:FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available languages in the db.',
        description:
          'Returns a list of all available languages in the db. If authenticated, also returns the list of languages created by the user.',
        headers: jwtHeaderOptional,
        tags: ['languages'],
        response: {
          200: sGetLanguageListResponse,
        },
      },
    },
    getLanguageListHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Adds a new type of language to the db.',
        description: '[MS ONLY] Adds a new type of language to the db.',
        body: sPostLanguageBody,
        tags: ['languages'],
        headers: jwtHeaderRequired,
        response: {
          201: sGetLanguageResponse,
        },
      },
    },
    createLanguageHandler
  );

  server.put(
    '/:languageId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Updates the details of the language corresponding to the given id.',
        description:
          '[MS ONLY] Updates the details of the language corresponding to the given id.',
        body: sPutLanguageBody,
        tags: ['languages'],
        headers: jwtHeaderRequired,
        response: {
          200: sGetLanguageResponse,
        },
      },
    },
    updateLanguageHandler
  );

  server.delete(
    '/:languageId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Deletes the language corresponding to the given id.',
        description:
          '[MS ONLY] Deletes the language corresponding to the given id.',
        tags: ['languages'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteLanguageHandler
  );
};

export default languageRoutes;
