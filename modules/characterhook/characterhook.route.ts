import { FastifyInstance } from 'fastify';
import { getRandomCharacterhookHandler, getRandomCharacterhookForAgeHandler } from './characterhook.controller';
import { sGetRandomCharacterhookResponse } from 'monstershuffler-shared';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const characterhookRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  server.get(
    '/random',
    {
      schema: {
        summary: 'Returns a random short characterhook.',
        description:
          'Returns a random short characterhook , which is a string like \'from an unusual family line\' or \'cursed with bad luck\'.',
        tags: ['characterhooks'],
        response: {
          200: sGetRandomCharacterhookResponse,
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
          200: sGetRandomCharacterhookResponse,
        },
      },
    },
    getRandomCharacterhookForAgeHandler,
  );
};

export default characterhookRoutes;
