import { FastifyInstance } from 'fastify';
import {
  createWeaponHandler,
  getWeaponHandler,
  getWeaponListHandler,
  updateWeaponHandler,
  deleteWeaponHandler,
} from './weapon.controller';
import { sPostWeaponBody, sPutWeaponBody, sGetWeaponListResponse, sGetWeaponResponse, sGetWeaponParams } from 'monstershuffler-shared';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/schemas';

async function weaponRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available weapons in the db.',
        description:
          'Returns a list of all available weapons in the db. If authenticated, also returns the list of weapons created by the user.',
        headers: jwtHeaderOptional,
        tags: ['weapons'],
        response: {
          200: sGetWeaponListResponse,
        },
      },
    },
    getWeaponListHandler
  );

  server.get(
    '/:weaponId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary:
          'Returns the details of the weapon corresponding to the given id.',
        description:
          'Returns the details of the weapon corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['weapons'],
        response: {
          200: sGetWeaponResponse,
        },
      },
    },
    getWeaponHandler
  );

  server.post(
    '/',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Adds a new type of weapon to the db.',
        description: '[MS ONLY] Adds a new type of weapon to the db.',
        body: sPostWeaponBody,
        tags: ['weapons'],
        headers: jwtHeaderRequired,
        response: {
          201: sGetWeaponResponse,
        },
      },
    },
    createWeaponHandler
  );

  server.put(
    '/:weaponId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Updates the weapon corresponding to the given id.',
        description:
          '[MS ONLY] Updates the weapon corresponding to the given id.',
        body: sPutWeaponBody,
        tags: ['weapons'],
        headers: jwtHeaderRequired,
        // params: $ref('sGetWeaponParams'),
        response: {
          200: BatchPayload,
        },
      },
    },
    updateWeaponHandler
  );

  server.delete(
    '/:weaponId',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Deletes the weapon corresponding to the given id.',
        description:
          '[MS ONLY] Deletes the weapon corresponding to the given id.',
        tags: ['weapons'],
        headers: jwtHeaderRequired,
        // params: $ref('sGetWeaponParams'),
        response: {
          200: BatchPayload,
        },
      },
    },
    deleteWeaponHandler
  );
}

export default weaponRoutes;
