import { FastifyInstance } from 'fastify';
import { convertObjectsHandler } from './converter.controller';
import { jwtHeaderRequired } from '@/schemas';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const converterRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  server.get(
    '/converter',
    {
      preHandler: [server.authenticate, server.MSOnly],
      schema: {
        hide: true,
        summary:
          'Converts objects from the old monstershuffler format to the new one.',
        description:
          'Converts objects from the old monstershuffler format to the new one.',
        headers: jwtHeaderRequired,
        tags: ['converter'],
        response: 200,
      },
    },
    convertObjectsHandler
  );
};

export default converterRoutes;
