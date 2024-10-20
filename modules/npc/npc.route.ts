import { FastifyInstance } from 'fastify';
import {
  createFourRandomNpcHandler,
  // createRandomNpcHandler,
  getGeneratorDataHandler,
  generateBackstoryHandler,
  postNpcRatingController,
  getNpcHandler,
} from './npc.controller';

import { sGetNpcResponse, sGetNpcParams } from './npc.schema';
import {
  sPostRandomNpcBody,
  sPostRandomNpcResponse,
  sPostFourRandomNpcsResponse,
  sGetGeneratorDataResponse,
  sGenerateBackstoryBody,
  sPostNpcBody,
  sPostNpcToSentAlreadyListBody,
  sAddBackstoryToNpcBody,
  sPostNpcRatingBody,
  sPostNpcRatingResponse,
} from 'monstershuffler-shared';
import { sGenerateTextResponse } from '@/modules/ai/ai.schema';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';


// schemas
import { jwtHeaderOptional } from '@/schemas';
import { get } from 'http';

const npcRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  // server.post(
  //   '/',
  //   {
  //     preHandler: [server.authenticateOptional],
  //     schema: {
  //       summary: 'Creates a new random npc using the settings provided.',
  //       description: 'Creates a new random npc using the settings provided.',
  //       headers: jwtHeaderOptional,
  //       tags: ['npcs'],
  //       body: $ref('sPostRandomNpcBody'),
  //       response: {
  //         200: $ref('sPostRandomNpcResponse'),
  //       },
  //     },
  //   },
  //   createRandomNpcHandler
  // );
  server.post(
    '/four',
    {
      config: {
        rateLimit: {
          max: 15,
          timeWindow: '1 minute',
        },
      },
      preHandler: [server.authenticateOptional, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Creates four new random npcs using the settings provided.',
        description:
          'Creates four new random npcs using the settings provided. Only accessible through monstershuffler.com',
        headers: jwtHeaderOptional,
        tags: ['npcs'],
        body: sPostRandomNpcBody,
        response: {
          200: sPostFourRandomNpcsResponse,
        },
      },
    },
    createFourRandomNpcHandler
  );
  server.get(
    '/generator-data',
    {
      preHandler: [server.authenticateOptional, server.MSOnly],
      schema: {
        // hide: true,
        summary: '[MS ONLY] Gets the data used by the NPC Generator on the frontend.',
        description: 'Gets the data used by the NPC Generator page in one single call (lists of classes, races and backgrounds). Only accessible through monstershuffler.com',
        headers: jwtHeaderOptional,
        tags: ['npcs'],
        response: {
          200: sGetGeneratorDataResponse,
        },
      },
    },
    getGeneratorDataHandler
  );
  server.post(
    '/backstory',
    {
      config: {
        rateLimit: {
          max: 6,
          timeWindow: '1 minute',
        },
      },
      preHandler: [server.authenticateOptional, server.MSOnly],
      schema: {
        summary: '[MS ONLY] Generates a random backstory for an NPC.',
        description: 'Generates a random backstory for an NPC. Only accessible through monstershuffler.com',
        tags: ['npcs'],
        headers: jwtHeaderOptional,
        body: sGenerateBackstoryBody,
        response: {
          200: sGenerateTextResponse,
        },
      },
    },
    generateBackstoryHandler
  );
  server.post(
    '/rating',
    {
      preHandler: [server.authenticateOptional, server.MSOnly],
      schema: {
        summary: '[MS Only] Rate an NPC',
        description: 'Rate an NPC',
        tags: ['npcs'],
        headers: jwtHeaderOptional,
        body: sPostNpcRatingBody,
        response: {
          200: sPostNpcRatingResponse,
        },
      },
    },
    postNpcRatingController
  );
  server.get(
    '/:uuid',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Get an NPC by UUID',
        description: 'Get an NPC by UUID',
        tags: ['npcs'],
        // params: {
        //   type: 'object',
        //   properties: {
        //     uuid: { type: 'string' },
        //   },
        // },
        response: {
          200: sGetNpcResponse,
        },
      },
    },
    getNpcHandler
  );
};

export default npcRoutes;
