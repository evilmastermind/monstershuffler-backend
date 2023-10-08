import { FastifyInstance } from 'fastify';
import { getRandomCharacterhookHandler, getRandomCharacterhookForAgeHandler } from './characterhook.controller';
import { $ref } from './characterhook.schema';

async function characterhookRoutes(server: FastifyInstance) {
  server.get(
    '/random',
    {
      schema: {
        summary: 'Returns a random short characterhook.',
        description:
          'Returns a random short characterhook , which is a string like \'from an unusual family line\' or \'cursed with bad luck\'.',
        tags: ['characterhooks'],
        response: {
          200: $ref('getRandomCharacterhookResponseSchema'),
        },
      },
    },
    getRandomCharacterhookHandler
  );
  server.get(
    '/random/:age',
    {
      schema: {
        summary: 'Returns a random characterhook for the given age.',
        description:
          'Returns a random characterhook for the given age. The age must be one of the following: "child", "adolescent", "young adult", "adult", "middle-aged", "elderly", "venerable".',
        tags: ['characterhooks'],
        response: {
          200: $ref('getRandomCharacterhookResponseSchema'),
        },
      },
    },
    getRandomCharacterhookForAgeHandler,
  );
}

export default characterhookRoutes;
