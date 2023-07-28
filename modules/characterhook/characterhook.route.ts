import { FastifyInstance } from 'fastify';
import { getRandomCharacterhookHandler } from './characterhook.controller';
import { $ref } from './characterhook.schema';

async function characterhookRoutes(server: FastifyInstance) {
  server.get(
    '/random',
    {
      schema: {
        summary: 'Returns a random short characterhook.',
        description:
          "Returns a random short characterhook , which is a string like 'from an unusual family line' or 'cursed with bad luck'.",
        tags: ['characterhooks'],
        response: {
          200: $ref('getRandomCharacterhookResponseSchema'),
        },
      },
    },
    getRandomCharacterhookHandler
  );
}

export default characterhookRoutes;
