import { FastifyInstance } from 'fastify';
import { postRandomCharacterhookHandler } from './characterhook.controller';
import { sPostRandomCharacterhookBody, sPostRandomCharacterhookResponse } from 'monstershuffler-shared';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const characterhookRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  server.post(
    '/random',
    {
      schema: {
        summary: 'Returns a random short characterhook.',
        description:
          'Returns a short characterhook for the backstory of an NPC.',
        tags: ['characterhooks'],
        body: sPostRandomCharacterhookBody,
        response: {
          200: sPostRandomCharacterhookResponse,
        },
      },
    },
    postRandomCharacterhookHandler
  );
};

export default characterhookRoutes;
