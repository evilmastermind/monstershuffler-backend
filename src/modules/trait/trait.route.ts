import { FastifyInstance } from 'fastify';
import { $ref } from './trait.schema';
import { getRandomTraitHandler, getTraitDescriptionHandler } from './trait.controller';

async function traitRoutes(server: FastifyInstance) {
  server.post(
    '/random',
    {
      schema: {
        summary: 'Returns a random trait.',
        description:
          'Returns a random trait which is usually an adjective describing a creature\'s state of mind, attitude, core beliefs or current feelings.',
        body: $ref('getRandomTraitSchema'),
        tags: ['traits'],
        response: {
          200: $ref('getRandomTraitResponseSchema'),
        },
      },
    },
    getRandomTraitHandler
  );

  server.get(
    '/:name',
    {
      schema: {
        summary: 'Returns the description of a trait.',
        description:
          'Returns the description of a trait which is usually an adjective describing a creature\'s state of mind, attitude, core beliefs or current feelings.',
        tags: ['traits'],
        response: {
          200: $ref('getTraitDescriptionResponseSchema'),
        },
      },
    },
    getTraitDescriptionHandler
  );
}

export default traitRoutes;
