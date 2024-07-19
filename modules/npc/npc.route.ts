import { FastifyInstance } from 'fastify';
import {
  createFourRandomNpcHandler,
  createRandomNpcHandler,
  getGeneratorDataHandler,
  generateBackstoryHandler,
} from './npc.controller';
import { $ref } from './npc.schema';
// schemas
import { jwtHeaderOptional } from '@/schemas';

async function npcRoutes(server: FastifyInstance) {
  server.post(
    '/',
    {
      preHandler: [server.authenticateOptional],
      schema: {
        summary: 'Creates a new random npc using the settings provided.',
        description: 'Creates a new random npc using the settings provided.',
        headers: jwtHeaderOptional,
        tags: ['npcs'],
        body: $ref('postRandomNpcInput'),
        response: {
          200: $ref('postRandomNpcResponse'),
        },
      },
    },
    createRandomNpcHandler
  );
  server.post(
    '/four',
    {
      preHandler: [server.authenticateOptional, server.MSOnly],
      schema: {
        hide: true,
        summary:
          '[MS ONLY] Creates four new random npcs using the settings provided.',
        description:
          'Creates four new random npcs using the settings provided. Only accessible through monstershuffler.com',
        headers: jwtHeaderOptional,
        tags: ['npcs'],
        body: $ref('postRandomNpcInput'),
        response: {
          200: $ref('postFourRandomNpcsResponse'),
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
          200: $ref('getGeneratorDataResponse'),
        },
      },
    },
    getGeneratorDataHandler
  );
  server.post(
    '/backstory',
    {
      preHandler: [server.authenticateOptional, server.MSOnly],
      schema: {
        summary: '[MS ONLY] Generates a random backstory for an NPC.',
        description: 'Generates a random backstory for an NPC. Only accessible through monstershuffler.com',
        headers: jwtHeaderOptional,
        tags: ['npcs'],
        body: $ref('postBackstoryInput'),
        response: {
          200: $ref('generateTextResponse'),
        },
      },
    },
    generateBackstoryHandler
  );
}

export default npcRoutes;
