import { FastifyInstance } from 'fastify';
import { sGetRandomSurnameHandler } from './surname.controller';
import { sGetRandomSurnameBody, sGetRandomSurnameResponse } from 'monstershuffler-shared';
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const surnameRoutes: FastifyPluginAsyncZod = async function (server: FastifyInstance) {
  server.post(
    '/random',
    {
      schema: {
        summary: 'Returns a random surname.',
        description:
          'Returns a random surname, which is a string like \'Aldric\' or \'Aldric the Brave\'.',
        body: sGetRandomSurnameBody,
        tags: ['surnames'],
        response: {
          200: sGetRandomSurnameResponse,
        },
      },
    },
    sGetRandomSurnameHandler
  );
};

export default surnameRoutes;
