import { FastifyInstance } from 'fastify';
import { generateTextHandler } from './ai.controller';
import { jwtHeaderRequired } from '@/schemas';
import { $ref } from './ai.schema';

// frontend: 
// - https://www.npmjs.com/package/@microsoft/fetch-event-source
// - or, more simply, https://developer.mozilla.org/en-US/docs/Web/API/EventSource

// backend
// - https://github.com/mpetrunic/fastify-sse-v2

async function aiRoutes(server: FastifyInstance) {
  server.post(
    '/generate-text',
    {
      preHandler: [server.authenticateOptional, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Generates text from a prompt using the AI model.',
        description: 'Generates text from a prompt using the AI model.',
        tags: ['ai'],
        body: $ref('generateTextSchema'),
        response: {
          200: $ref('sGenerateTextResponse'),
        },
      }
    },
    generateTextHandler
  );
}

export default aiRoutes;
