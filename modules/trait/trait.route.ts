import { FastifyInstance } from 'fastify';
import { $ref } from './trait.schema';
import {
  getRandomTraitHandler,
  getRandomTraitForAgeHandler,
  getTraitDescriptionHandler,
} from './trait.controller';

async function traitRoutes(server: FastifyInstance) {
  server.post(
    '/random',
    {
      schema: {
        summary: 'Returns a random trait.',
        description:
          'Returns a random trait which is usually an adjective describing a creature\'s state of mind, attitude, core beliefs or current feelings.',
        body: $ref('getRandomTrait'),
        tags: ['traits'],
        response: {
          200: $ref('getRandomTraitResponse'),
        },
      },
    },
    getRandomTraitHandler
  );

  server.post(
    '/random/:age',
    {
      schema: {
        summary: 'Returns a random trait for the given age.',
        description:
          'Returns a random trait for the given age. The age must be one of the following: "child", "adolescent", "young adult", "adult", "middle-aged", "elderly", "venerable".',
        body: $ref('getRandomTrait'),
        tags: ['traits'],
        response: {
          200: $ref('getRandomTraitResponse'),
        },
      },
    },
    getRandomTraitForAgeHandler
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
          200: $ref('getTraitDescriptionResponse'),
        },
      },
    },
    getTraitDescriptionHandler
  );
}

export default traitRoutes;
