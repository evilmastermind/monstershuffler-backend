import { FastifyInstance } from 'fastify';
import { converterHandler } from './converter.controller';
import { jwtHeaderRequired } from '../schemas';

async function converterRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      preHandler: [server.authenticate],
      schema: {
        summary: 'Converts all objects of the db into the new version.',
        description: 'Converts all objects of the db into the new version.',
        headers: jwtHeaderRequired,
        tags: ['converter'],
        response: {
          200: {},
        },
      }
    },
    converterHandler
  );
}

export default converterRoutes;
