import { FastifyInstance } from 'fastify';
import { createProfessionHandler, getProfessionHandler, getRandomProfessionHandler, getProfessionListHandler, updateProfessionHandler, deleteProfessionHandler  } from './profession.controller';
import { $ref } from './profession.schema';
import { jwtHeaderOptional, jwtHeaderRequired, BatchPayload } from '@/modules/schemas';

// TODO: professions have some random choices that choose a weapon based
// on the weapon's name. This might cause issues if there are multiple
// weapons with the same name.

async function professionRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns a list of all available professions in the db.',
        description: 'Returns a list of all available professions in the db. If authenticated, also returns the list of professions created by the user.',
        headers: jwtHeaderOptional,
        tags: ['professions'],
        response: {
          200: $ref('getProfessionListResponseSchema')
        },
      }
    },
    getProfessionListHandler
  );

  server.get(
    '/:professionId',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns the details of the profession corresponding to the given id.',
        description: 'Returns the details of the profession corresponding to the given id.',
        headers: jwtHeaderOptional,
        tags: ['professions'],
        // params: $ref('getProfessionParamsSchema'),
        response: {
          200: $ref('getProfessionResponseSchema')
        }
      }
    },
    getProfessionHandler
  );

  server.get(
    '/random',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Returns the details of a random profession from the database.',
        description: 'Returns the details of a random profession from list of professions available to the user in the database.',
        headers: jwtHeaderOptional,
        tags: ['professions'],
        // params: $ref('getProfessionParamsSchema'),
        response: {
          200: $ref('getProfessionResponseSchema')
        }
      }
    },
    getRandomProfessionHandler
  );

  // server.post(
  //   '/',
  //   {
  //     preHandler: [server.authenticate],
  //     schema: {
  //       summary: '[MS ONLY] Adds a new profession to the db.',
  //       description: '[MS ONLY] Adds a new profession to the db.',
  //       body: $ref('createProfessionSchema'),
  //       tags: ['professions'],
  //       headers: jwtHeaderRequired,
  //       response: {
  //         201: $ref('getProfessionResponseSchema')
  //       }
  //     },
  //   },
  //   createProfessionHandler
  // );

  // server.put(
  //   '/:professionId',
  //   {
  //     preHandler: [server.authenticate],
  //     schema: {
  //       summary: '[MS ONLY] Updates the profession corresponding to the given id.',
  //       description: '[MS ONLY] Updates the profession corresponding to the given id.',
  //       body: $ref('createProfessionSchema'),
  //       tags: ['professions'],
  //       headers: jwtHeaderRequired,
  //       response: {
  //         200: BatchPayload
  //       }
  //     },
  //   },
  //   updateProfessionHandler
  // );

  // server.delete(
  //   '/:professionId',
  //   {
  //     preHandler: [server.authenticate],
  //     schema: {
  //       summary: '[MS ONLY] Deletes the profession corresponding to the given id.',
  //       description: '[MS ONLY] Deletes the profession corresponding to the given id.',
  //       tags: ['professions'],
  //       headers: jwtHeaderRequired,
  //       response: {
  //         200: BatchPayload
  //       }
  //     },
  //   },
  //   deleteProfessionHandler
  // );
}

export default professionRoutes;
