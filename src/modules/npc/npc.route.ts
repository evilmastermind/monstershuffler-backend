import { FastifyInstance } from 'fastify';
import { createRandomNpcHandler } from './npc.controller';
import { $ref } from './npc.schema';
// schemas
import { jwtHeaderOptional } from '@/modules/schemas';

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
        body: $ref('createRandomNpcInputSchema'),
        response: {
          200: $ref('createRandomNpcResponseSchema')
        }
      }
    },
    createRandomNpcHandler
  );
}

export default npcRoutes;
