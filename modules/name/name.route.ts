import { FastifyInstance } from 'fastify';
import { sGetRandomNameHandler } from './name.controller';
import { sGetRandomNameResponse, sGetRandomNameBody } from 'monstershuffler-shared';

async function nameRoutes(server: FastifyInstance) {
  server.post(
    '/random',
    {
      schema: {
        summary: 'Returns a random name.',
        description:
          'Returns a random name, which is a string like \'Aldric\' or \'Aldric the Brave\'.',
        body: sGetRandomNameBody,
        tags: ['names'],
        response: {
          200: sGetRandomNameResponse,
        },
      },
    },
    sGetRandomNameHandler
  );
}

export default nameRoutes;
