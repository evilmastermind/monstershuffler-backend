import { FastifyInstance } from 'fastify';

async function nameRoutes(server: FastifyInstance) {
  server.get(
    '/',
    {
      schema: {
        summary: 'Returns a list of all available name types in the db.',
        description: 'Returns a list of all available name types in the db.',
        tags: ['names'],
        response: {
          200: $ref('getNameTypesResponseSchema')
        },
      }
    },
    getNameTypesHandler
  );
}
