import { FastifyInstance } from 'fastify';
import { getRandomNameHandler } from './name.controller';
import { $ref } from './name.schema';

async function nameRoutes(server: FastifyInstance) {
  server.post(
    '/random',
    {
      schema: {
        summary: 'Returns a random name.',
        description:
          "Returns a random name, which is a string like 'Aldric' or 'Aldric the Brave'.",
        body: $ref('getRandomName'),
        tags: ['names'],
        response: {
          200: $ref('getRandomNameResponse'),
        },
      },
    },
    getRandomNameHandler
  );
}

export default nameRoutes;
