import { FastifyInstance } from 'fastify';
import {
  createArmorHandler,
  getArmorHandler,
  getArmorListHandler,
  updateArmorHandler,
  deleteArmorHandler,
} from './armor.controller';
import { armorObject, sPostArmorBody, sPutArmorBody, sGetArmorListResponse, sGetArmorParams, sGetArmorResponse } from 'monstershuffler-shared';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/schemas';

async function armorRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available armor in the db.',
        description:
          'Returns a list of all available armor in the db. If authenticated, also returns the list of armor created by the user.',
        headers: jwtHeaderOptional,
        tags: ['armor'],
        response: {
          200: sGetArmorListResponse,
        },
      },
    },
    getArmorListHandler
  );

  server.get(
    '/:armorId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of the armor corresponding to the given id.',
        description:
          'Returns the details of the armor corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['armor'],
        response: {
          200: sGetArmorResponse,
        },
      },
    },
    getArmorHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Adds a new type of armor to the db.',
        description: '[MS ONLY] Adds a new type of armor to the db.',
        body: sPostArmorBody,
        tags: ['armor'],
        headers: jwtHeaderRequired,
        response: {
          201: sGetArmorResponse,
        },
      },
    },
    createArmorHandler
  );

  server.put(
    '/:armorId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Updates the armor corresponding to the given id.',
        description:
          '[MS ONLY] Updates the armor corresponding to the given id.',
        body: sPutArmorBody,
        tags: ['armor'],
        headers: jwtHeaderRequired,
        // params: $ref('sGetArmorParams'),
        response: {
          200: BatchPayload,
        },
      },
    },
    updateArmorHandler
  );

  server.delete(
    '/:armorId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Deletes the armor corresponding to the given id.',
        description:
          '[MS ONLY] Deletes the armor corresponding to the given id.',
        tags: ['armor'],
        headers: jwtHeaderRequired,
        // params: $ref('sGetArmorParams'),
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteArmorHandler
  );
}

export default armorRoutes;
