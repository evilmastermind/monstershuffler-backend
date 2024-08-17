import { FastifyInstance } from 'fastify';
import { generateTextHandler } from './ai.controller';
import { jwtHeaderRequired } from '@/schemas';
import { sGenerateTextBody, sGenerateTextResponse } from './ai.schema';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

// frontend: 
// - https://www.npmjs.com/package/@microsoft/fetch-event-source
// - or, more simply, https://developer.mozilla.org/en-US/docs/Web/API/EventSource

// backend
// - https://github.com/mpetrunic/fastify-sse-v2

const aiRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  server.post(
    '/generate-text',
    {
      preHandler: [server.authenticateOptional, server.MSOnly],
      schema: {
        hide: true,
        summary: '[MS ONLY] Generates text from a prompt using the AI model.',
        description: 'Generates text from a prompt using the AI model.',
        tags: ['ai'],
        body: sGenerateTextBody,
        response: {
          200: sGenerateTextResponse,
        },
      }
    },
    generateTextHandler
  );
};

export default aiRoutes;
