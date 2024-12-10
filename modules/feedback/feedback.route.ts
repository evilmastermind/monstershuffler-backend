import { FastifyInstance } from 'fastify';
import { getRandomQuestionHandler, postAnswerHandler } from './feedback.controller';
import { sGetRandomQuestionResponse, sGetRandomQuestionBody, sPostAnswerBody } from 'monstershuffler-shared';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const feedbackRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  server.post(
    '/questions/random',
    {
      preHandler: [server.authenticateOptional, server.MSOnly],
      schema: {
        summary: 'Returns a random question based on a topic or created after a date.',
        description: 'Returns a random question',
        hide: true,
        body: sGetRandomQuestionBody,
        tags: ['feedback'],
        response: {
          200: sGetRandomQuestionResponse,
        },
      },
    },
    getRandomQuestionHandler
  );
  server.post(
    '/answers',
    {
      config: {
        rateLimit: {
          max: 3,
          timeWindow: '1 minute',
        },
      },
      preHandler: [server.authenticateOptional, server.MSOnly],
      schema: {
        summary: 'Post an answer to a question.',
        description: 'Post an answer to a question.',
        hide: true,
        body: sPostAnswerBody,
        tags: ['feedback'],
      },
    },
    postAnswerHandler
  );
};

export default feedbackRoutes;
