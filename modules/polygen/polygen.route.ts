import { FastifyInstance } from 'fastify';
import { result } from './polygen.schema';
import {
  parsePolygenHandler,
} from './polygen.controller';

async function polygenRoutes(server: FastifyInstance) {
  server.post(
    '/parse',
    {
      preHandler: [server.MSOnly],
      schema: {
        summary: 'Parses a Polygen grammar.',
        description:
          'Parses a Polygen grammar. https://polygen.org/it/manuale',
        tags: ['polygen'],
        response: {
          200: result,
          404: { type: 'string' },
        },
      },
    },
    parsePolygenHandler
  );
}

export default polygenRoutes;
