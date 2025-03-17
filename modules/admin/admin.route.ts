import { FastifyInstance } from 'fastify';
import { convertObjectsHandler } from './admin.controller';
import { jwtHeaderRequired } from '@/schemas';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { generateBackstorySentenceActions, generateBackstorySentences } from '../npc/backstory';

const converterRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  server.get(
    '/converter',
    {
      preHandler: [server.admin],
      schema: {
        hide: true,
        summary:
          'Converts objects from the old monstershuffler format to the new one.',
        description:
          'Converts objects from the old monstershuffler format to the new one.',
        headers: jwtHeaderRequired,
        tags: ['admin'],
        response: 200,
      },
    },
    convertObjectsHandler
  );
  server.get(
    '/backstory-sentences',
    {
      preHandler: [server.admin],
      schema: {
        hide: true,
        summary:
          'Generates NPC backstory sentences.',
        description:
          'Generates NPC backstory sentences from a pretrained model with random inputs.',
        headers: jwtHeaderRequired,
        tags: ['admin'],
        response: 200,
      },
    },
    generateBackstorySentences
  );
  server.get(
    '/backstory-sentences-actions', {
      preHandler: [server.admin],
      schema: {
        hide: true,
        summary:
          'Generates actions for backstory sentences.',
        description:
          'Generates actions for backstory sentences.',
        headers: jwtHeaderRequired,
        tags: ['admin'],
        response: 200,
      },
    },
    generateBackstorySentenceActions
  );
};

export default converterRoutes;
