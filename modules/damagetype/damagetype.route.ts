import { FastifyInstance } from 'fastify';
import {
  createDamageTypeHandler,
  getDamageTypeListHandler,
  updateDamageTypeHandler,
  deleteDamageTypeHandler,
} from './damagetype.controller';
import {
  sPostDamageTypeBody,
  sPutDamageTypeBody,
  sGetDamageTypeResponse,
  sGetDamageTypeListResponse,
} from 'monstershuffler-shared';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/schemas';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const damageTypeRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available damage types in the db.',
        description:
          'Returns a list of all available damage types in the db. If authenticated, also returns the list of damage types created by the user.',
        headers: jwtHeaderOptional,
        tags: ['damage types'],
        response: {
          200: sGetDamageTypeListResponse,
        },
      },
    },
    getDamageTypeListHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Adds a new type of damage to the db.',
        description: '[MS ONLY] Adds a new type of damage to the db.',
        body: sPostDamageTypeBody,
        tags: ['damage types'],
        headers: jwtHeaderRequired,
        response: {
          201: sGetDamageTypeResponse,
        },
      },
    },
    createDamageTypeHandler
  );

  server.put(
    '/:damageTypeId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Updates the details of the damage type corresponding to the given id.',
        description:
          '[MS ONLY] Updates the details of the damage type corresponding to the given id.',
        body: sPutDamageTypeBody,
        tags: ['damage types'],
        headers: jwtHeaderRequired,
        response: {
          200: sGetDamageTypeResponse,
        },
      },
    },
    updateDamageTypeHandler
  );

  server.delete(
    '/:damageTypeId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Deletes the damage type corresponding to the given id.',
        description:
          '[MS ONLY] Deletes the damage type corresponding to the given id.',
        tags: ['damage types'],
        headers: jwtHeaderRequired,
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteDamageTypeHandler
  );
};

export default damageTypeRoutes;
